/**
 * test-devloop.js — Test Dev Loop Wiring (No API needed)
 * Run: node tests/test-devloop.js
 * 
 * Tests the task execution cycle with mock nodes.
 * Verifies: task selection → context → code → registry → review → execute → snapshot → next task
 */

import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { AgentState } from "../src/config/state.js";

console.log("\n🧪 TEST: Dev Loop Wiring (No API needed)\n");

let passed = 0, failed = 0;
function assert(c, m) { if (c) { console.log(`  ✅ PASS: ${m}`); passed++; } else { console.log(`  ❌ FAIL: ${m}`); failed++; } }

let nodeOrder = [];

// ─── MOCK NODES — simulate a 2-task dev loop ───────────────

const mockSelectNext = (state) => {
  nodeOrder.push("selectNextTask");
  const statuses = state.taskStatuses || {};
  const tasks = state.taskQueue?.phases?.[0]?.tasks || [];
  
  for (const task of tasks) {
    if (statuses[task.taskId] !== "done") {
      return { currentTask: task, currentPhase: "dev_loop", taskStatuses: { [task.taskId]: "in_progress" } };
    }
  }
  return { currentTask: null, currentPhase: "done" };
};

const mockContext = (state) => { nodeOrder.push("contextBuilder"); return { contextPackage: { task: state.currentTask } }; };
const mockCoder = (state) => { nodeOrder.push("coderAgent"); return { coderOutput: { files: [{ path: "test.js", lines: 10 }] } }; };
const mockRegistry = (state) => { nodeOrder.push("updateRegistry"); return {}; };
const mockReviewer = (state) => { nodeOrder.push("reviewerAgent"); return { reviewResult: { verdict: "approved", issues: [], reviewCycle: 1 } }; };
const mockExecutor = (state) => { nodeOrder.push("executorAgent"); return { executionResult: { result: "pass", output: "ok", errors: "" } }; };
const mockSnapshot = (state) => {
  nodeOrder.push("snapshotManager");
  return {
    taskStatuses: { [state.currentTask.taskId]: "done" },
    currentTask: null, reviewResult: { verdict: "", issues: [], reviewCycle: 0 },
  };
};
const mockPresent = (state) => { nodeOrder.push("presentToUser"); return { currentPhase: "done" }; };

async function runTest() {
  const graph = new StateGraph(AgentState);

  graph.addNode("selectNextTask", mockSelectNext);
  graph.addNode("contextBuilder", mockContext);
  graph.addNode("coderAgent", mockCoder);
  graph.addNode("updateRegistry", mockRegistry);
  graph.addNode("reviewerAgent", mockReviewer);
  graph.addNode("executorAgent", mockExecutor);
  graph.addNode("snapshotManager", mockSnapshot);
  graph.addNode("presentToUser", mockPresent);

  graph.addEdge(START, "selectNextTask");

  graph.addConditionalEdges("selectNextTask", (state) => {
    if (state.currentPhase === "done") return "presentToUser";
    return "contextBuilder";
  }, { contextBuilder: "contextBuilder", presentToUser: "presentToUser" });

  graph.addEdge("contextBuilder", "coderAgent");
  graph.addEdge("coderAgent", "updateRegistry");
  graph.addEdge("updateRegistry", "reviewerAgent");

  graph.addConditionalEdges("reviewerAgent", (state) => {
    return state.reviewResult?.verdict === "approved" ? "executorAgent" : "coderAgent";
  }, { executorAgent: "executorAgent", coderAgent: "coderAgent" });

  graph.addConditionalEdges("executorAgent", (state) => {
    return state.executionResult?.result === "pass" ? "snapshotManager" : "selectNextTask";
  }, { snapshotManager: "snapshotManager", selectNextTask: "selectNextTask" });

  graph.addEdge("snapshotManager", "selectNextTask");
  graph.addEdge("presentToUser", END);

  const compiled = graph.compile({ checkpointer: new MemorySaver() });
  console.log("  ✅ Dev loop graph compiled\n");

  // Run with 2 tasks
  const finalState = await compiled.invoke({
    taskQueue: {
      phases: [{
        phaseNumber: 1,
        phaseName: "setup",
        tasks: [
          { taskId: "s-1", title: "Task 1", filesToCreate: ["a.js"], filesNeeded: [], acceptanceCriteria: ["works"], canParallelize: false },
          { taskId: "s-2", title: "Task 2", filesToCreate: ["b.js"], filesNeeded: ["a.js"], acceptanceCriteria: ["works"], canParallelize: false },
        ],
      }],
    },
    sandboxId: "test-sandbox",
    sandboxHealthy: true,
  }, { configurable: { thread_id: "test-devloop" } });

  console.log(`\n  Node order: ${nodeOrder.join(" → ")}\n`);

  // Should be: select → context → code → registry → review → execute → snapshot
  //          → select → context → code → registry → review → execute → snapshot
  //          → select → present

  assert(nodeOrder[0] === "selectNextTask", "Starts with selectNextTask");
  assert(nodeOrder[1] === "contextBuilder", "Then contextBuilder");
  assert(nodeOrder[2] === "coderAgent", "Then coderAgent");
  assert(nodeOrder[3] === "updateRegistry", "Then updateRegistry");
  assert(nodeOrder[4] === "reviewerAgent", "Then reviewerAgent");
  assert(nodeOrder[5] === "executorAgent", "Then executorAgent");
  assert(nodeOrder[6] === "snapshotManager", "Then snapshotManager");

  // Second iteration
  assert(nodeOrder[7] === "selectNextTask", "Second task: selectNextTask");
  assert(nodeOrder[8] === "contextBuilder", "Second task: contextBuilder");

  // Final
  const lastNode = nodeOrder[nodeOrder.length - 1];
  assert(lastNode === "presentToUser", `Ends with presentToUser (got ${lastNode})`);

  // State checks
  assert(finalState.taskStatuses["s-1"] === "done", "Task s-1 done");
  assert(finalState.taskStatuses["s-2"] === "done", "Task s-2 done");
  assert(finalState.currentPhase === "done", "Phase is done");

  console.log(`\n  ─── Summary: ${passed} passed, ${failed} failed ───\n`);
  if (failed > 0) process.exit(1);
}

runTest().catch(err => { console.error("  ❌", err.message); console.error(err.stack); process.exit(1); });

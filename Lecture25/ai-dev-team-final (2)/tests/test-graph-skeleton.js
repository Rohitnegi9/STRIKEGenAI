/**
 * test-graph-skeleton.js — Full Graph Wiring Test (No API needed)
 * Run: node tests/test-graph-skeleton.js
 * 
 * Mocks every node and verifies the LangGraph wiring:
 * - PM flow: START → pmAgent ←→ humanInput → architectStep1
 * - Architect chain: step1 → 2 → 3 → 4 → 5 → validator
 * - Validator → plannerAgent
 * - Planner → setupSandbox → healthCheck → END
 */

import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { AgentState } from "../src/config/state.js";

console.log("\n🧪 TEST: Graph Skeleton (No API, all mocked)\n");

let passed = 0, failed = 0;
function assert(c, m) { if (c) { console.log(`  ✅ PASS: ${m}`); passed++; } else { console.log(`  ❌ FAIL: ${m}`); failed++; } }

// ─── MOCK NODES ─────────────────────────────────────────────

let nodeOrder = [];

const mockPm = (state) => {
  nodeOrder.push("pmAgent");
  if (state.pmConversation.length === 0) {
    return { pmStatus: "needs_clarification", pmQuestions: ["Q1?"], pmConversation: [{ role: "pm", questions: ["Q1?"] }] };
  }
  return { pmStatus: "spec_ready", clarifiedSpec: { appName: "test", features: [], authRequired: true, pages: [] }, pmConversation: [{ role: "pm", spec: {} }] };
};

const mockHuman = (state) => {
  nodeOrder.push("humanInput");
  return { pmConversation: [{ role: "user", answers: "Answer" }] };
};

const mockArchStep = (name, blueprintKey, value) => (state) => {
  nodeOrder.push(name);
  return { blueprint: { [blueprintKey]: value } };
};

const mockValidator = (state) => {
  nodeOrder.push("blueprintValidator");
  return { blueprintValidation: { isValid: true, issues: [], validationCycles: 1 } };
};

const mockPlanner = (state) => {
  nodeOrder.push("plannerAgent");
  return { taskQueue: { phases: [{ phaseNumber: 1, phaseName: "setup", tasks: [{ taskId: "s-1" }] }] } };
};

const mockSetup = (state) => {
  nodeOrder.push("setupSandbox");
  return { sandboxId: "sandbox-test-123" };
};

const mockHealth = (state) => {
  nodeOrder.push("sandboxHealthCheck");
  return { sandboxHealthy: true };
};

// ─── BUILD GRAPH ────────────────────────────────────────────

async function runTest() {
  const graph = new StateGraph(AgentState);

  graph.addNode("pmAgent", mockPm);
  graph.addNode("humanInput", mockHuman);
  graph.addNode("architectStep1", mockArchStep("architectStep1", "entities", [{ name: "User" }]));
  graph.addNode("architectStep2", mockArchStep("architectStep2", "dbSchema", { tables: [{ name: "users" }] }));
  graph.addNode("architectStep3", mockArchStep("architectStep3", "apiEndpoints", [{ path: "/api/users" }]));
  graph.addNode("architectStep4", mockArchStep("architectStep4", "frontendPages", [{ name: "Home" }]));
  graph.addNode("architectStep5", mockArchStep("architectStep5", "folderStructure", "backend/\nfrontend/"));
  graph.addNode("blueprintValidator", mockValidator);
  graph.addNode("plannerAgent", mockPlanner);
  graph.addNode("setupSandbox", mockSetup);
  graph.addNode("sandboxHealthCheck", mockHealth);

  // Edges: PM flow
  graph.addEdge(START, "pmAgent");
  graph.addConditionalEdges("pmAgent", (state) => {
    if (state.pmStatus === "needs_clarification") return "humanInput";
    if (state.pmStatus === "spec_ready") return "architectStep1";
    return END;
  });
  graph.addEdge("humanInput", "pmAgent");

  // Edges: Architect chain
  graph.addEdge("architectStep1", "architectStep2");
  graph.addEdge("architectStep2", "architectStep3");
  graph.addEdge("architectStep3", "architectStep4");
  graph.addEdge("architectStep4", "architectStep5");
  graph.addEdge("architectStep5", "blueprintValidator");

  // Edges: Validator → Planner
  graph.addConditionalEdges("blueprintValidator", (state) => {
    if (state.blueprintValidation?.isValid) return "__end__";
    return "architectStep2";
  }, { __end__: "plannerAgent", architectStep2: "architectStep2" });

  // Edges: Planner → Sandbox
  graph.addEdge("plannerAgent", "setupSandbox");
  graph.addEdge("setupSandbox", "sandboxHealthCheck");
  graph.addConditionalEdges("sandboxHealthCheck", (state) => {
    return state.sandboxHealthy ? "__end__" : "setupSandbox";
  }, { __end__: END, setupSandbox: "setupSandbox" });

  const compiled = graph.compile({ checkpointer: new MemorySaver() });
  console.log("  ✅ Graph compiled\n");

  // ─── RUN ──────────────────────────────────────────────────

  const finalState = await compiled.invoke(
    { userRequirement: "Build a test app" },
    { configurable: { thread_id: "test-skeleton" } }
  );

  // ─── VERIFY ORDER ─────────────────────────────────────────

  console.log(`\n  Node execution order: ${nodeOrder.join(" → ")}\n`);

  const expectedOrder = [
    "pmAgent",          // First call → needs_clarification
    "humanInput",       // User answers
    "pmAgent",          // Second call → spec_ready
    "architectStep1",
    "architectStep2",
    "architectStep3",
    "architectStep4",
    "architectStep5",
    "blueprintValidator",
    "plannerAgent",
    "setupSandbox",
    "sandboxHealthCheck",
  ];

  assert(nodeOrder.length === expectedOrder.length, `${nodeOrder.length} nodes executed (expected ${expectedOrder.length})`);

  for (let i = 0; i < expectedOrder.length; i++) {
    assert(nodeOrder[i] === expectedOrder[i], `Step ${i + 1}: ${nodeOrder[i]} === ${expectedOrder[i]}`);
  }

  // Verify final state
  assert(finalState.pmStatus === "spec_ready", "PM finished");
  assert(finalState.clarifiedSpec?.appName === "test", "Spec propagated");
  assert(finalState.blueprint?.entities?.length > 0, "Blueprint has entities");
  assert(finalState.blueprintValidation?.isValid === true, "Blueprint validated");
  assert(finalState.taskQueue?.phases?.length > 0, "Task queue populated");
  assert(finalState.sandboxId === "sandbox-test-123", "Sandbox created");
  assert(finalState.sandboxHealthy === true, "Sandbox healthy");

  console.log(`\n  ─── Summary: ${passed} passed, ${failed} failed ───\n`);
  if (failed > 0) process.exit(1);
}

runTest().catch(err => { console.error("  ❌", err.message); console.error(err.stack); process.exit(1); });

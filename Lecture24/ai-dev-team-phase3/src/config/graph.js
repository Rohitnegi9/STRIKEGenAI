/**
 * graph.js — LangGraph Definition (Phase 3)
 * 
 * PHASE 3 FLOW:
 * START → pmAgent ←→ humanInput 
 *   → architectStep1 → 2 → 3 → 4 → 5 → blueprintValidator
 *       (validator can loop back to step 2/3/4)
 *   → plannerAgent → setupSandbox → sandboxHealthCheck → END
 *       (healthCheck can retry setupSandbox)
 */

import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { AgentState } from "../config/state.js";
import { pmAgentNode } from "../agents/pmAgent.js";
import { humanInputNode } from "../nodes/humanInput.js";
import {
  architectStep1Node, architectStep2Node, architectStep3Node,
  architectStep4Node, architectStep5Node,
} from "../agents/architectAgent.js";
import { blueprintValidatorNode, blueprintValidatorRouter } from "../agents/blueprintValidator.js";
import { plannerAgentNode } from "../agents/plannerAgent.js";
import { setupSandboxNode } from "../nodes/setupSandbox.js";
import { sandboxHealthCheckNode, sandboxHealthRouter } from "../nodes/sandboxHealthCheck.js";

export function buildGraph(options = {}) {
  const { checkpointer } = options;
  const graph = new StateGraph(AgentState);

  // ─── NODES ────────────────────────────────────────────────

  // Phase 1
  graph.addNode("pmAgent", pmAgentNode);
  graph.addNode("humanInput", humanInputNode);

  // Phase 2
  graph.addNode("architectStep1", architectStep1Node);
  graph.addNode("architectStep2", architectStep2Node);
  graph.addNode("architectStep3", architectStep3Node);
  graph.addNode("architectStep4", architectStep4Node);
  graph.addNode("architectStep5", architectStep5Node);
  graph.addNode("blueprintValidator", blueprintValidatorNode);

  // Phase 3
  graph.addNode("plannerAgent", plannerAgentNode);
  graph.addNode("setupSandbox", setupSandboxNode);
  graph.addNode("sandboxHealthCheck", sandboxHealthCheckNode);

  // ─── EDGES: PM Agent ──────────────────────────────────────

  graph.addEdge(START, "pmAgent");

  graph.addConditionalEdges("pmAgent", (state) => {
    if (state.pmStatus === "needs_clarification") return "humanInput";
    if (state.pmStatus === "spec_ready") return "architectStep1";
    return END;
  });

  graph.addEdge("humanInput", "pmAgent");

  // ─── EDGES: Architect chain ───────────────────────────────

  graph.addEdge("architectStep1", "architectStep2");
  graph.addEdge("architectStep2", "architectStep3");
  graph.addEdge("architectStep3", "architectStep4");
  graph.addEdge("architectStep4", "architectStep5");
  graph.addEdge("architectStep5", "blueprintValidator");

  // ─── EDGES: Blueprint Validator → Planner (Phase 3 change) ─

  graph.addConditionalEdges("blueprintValidator", blueprintValidatorRouter, {
    __end__: "plannerAgent",       // ← Changed! Was END, now routes to Planner
    architectStep2: "architectStep2",
    architectStep3: "architectStep3",
    architectStep4: "architectStep4",
  });

  // ─── EDGES: Planner → Sandbox ─────────────────────────────

  graph.addEdge("plannerAgent", "setupSandbox");
  graph.addEdge("setupSandbox", "sandboxHealthCheck");

  graph.addConditionalEdges("sandboxHealthCheck", sandboxHealthRouter, {
    __end__: END,                   // Phase 4 will change this to selectNextTask
    setupSandbox: "setupSandbox",   // Retry
  });

  // ─── COMPILE ──────────────────────────────────────────────

  const saver = checkpointer || new MemorySaver();
  const compiled = graph.compile({ checkpointer: saver });

  console.log("✅ Graph compiled (Phase 3: PM + Architect + Planner + Sandbox)");
  return compiled;
}

export async function createCheckpointer() {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    try {
      const { RedisSaver } = await import("@langchain/langgraph-checkpoint-redis");
      const saver = await RedisSaver.fromUrl(redisUrl);
      console.log("✅ Redis checkpointer connected");
      return saver;
    } catch (error) {
      console.warn(`⚠️ Redis failed: ${error.message}. Using in-memory.`);
    }
  } else {
    console.log("ℹ️  No REDIS_URL. Using in-memory checkpointer.");
  }
  return new MemorySaver();
}

/**
 * graph.js — LangGraph Definition (Phase 4)
 * 
 * THE FULL DEV LOOP:
 *
 * [Phase 1-3: PM → Architect → Validator → Planner → Sandbox → HealthCheck]
 *                                                                    ↓
 *  ┌──────────── selectNextTask ←─────────────────────────────────────┐
 *  ↓               ↓ (phase done)          ↓ (all done)              │
 * contextBuilder   phaseVerification      presentToUser → END        │
 *  ↓               ↓                                                 │
 * coderAgent       patternExtractor                                  │
 *  ↓               ↓                                                 │
 * updateRegistry   stateCompactor ─→ selectNextTask                  │
 *  ↓                                                                 │
 * reviewerAgent                                                      │
 *  ↓ approved    ↓ rejected (≤2)    ↓ rejected (>2)                  │
 * executorAgent  coderAgent         simplifyTask → selectNextTask    │
 *  ↓ pass    ↓ fail                                                  │
 * snapshot   debuggerAgent                                           │
 *  ↓          ↓ fix        ↓ escalate                                │
 *  └──────── coderAgent   humanEscalation                            │
 *                          ↓ skip/guide                              │
 *                          └─────────────────────────────────────────┘
 */

import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { AgentState } from "../config/state.js";

// Phase 1
import { pmAgentNode } from "../agents/pmAgent.js";
import { humanInputNode } from "../nodes/humanInput.js";

// Phase 2
import {
  architectStep1Node, architectStep2Node, architectStep3Node,
  architectStep4Node, architectStep5Node,
} from "../agents/architectAgent.js";
import { blueprintValidatorNode, blueprintValidatorRouter } from "../agents/blueprintValidator.js";

// Phase 3
import { plannerAgentNode } from "../agents/plannerAgent.js";
import { setupSandboxNode } from "../nodes/setupSandbox.js";
import { sandboxHealthCheckNode, sandboxHealthRouter } from "../nodes/sandboxHealthCheck.js";

// Phase 4 — Dev Loop
import { selectNextTaskNode, selectNextTaskRouter } from "../nodes/selectNextTask.js";
import { contextBuilderNode } from "../nodes/contextBuilder.js";
import { coderAgentNode } from "../agents/coderAgent.js";
import { updateRegistryNode } from "../nodes/updateRegistry.js";
import { reviewerAgentNode, reviewerRouter } from "../agents/reviewerAgent.js";
import { executorAgentNode, executorRouter } from "../agents/executorAgent.js";
import { snapshotManagerNode } from "../nodes/snapshotManager.js";
import { debuggerAgentNode, debuggerRouter } from "../agents/debuggerAgent.js";
import { simplifyTaskNode } from "../nodes/simplifyTask.js";
import { humanEscalationNode, humanEscalationRouter } from "../nodes/humanEscalation.js";
import { phaseVerificationNode, phaseVerificationRouter } from "../nodes/phaseVerification.js";
import { patternExtractorNode } from "../nodes/patternExtractor.js";
import { stateCompactorNode } from "../nodes/stateCompactor.js";
import { presentToUserNode } from "../nodes/presentToUser.js";
import { deploymentVerifierNode, deploymentVerifierRouter } from "../nodes/deploymentVerifier.js";

export function buildGraph(options = {}) {
  const { checkpointer } = options;
  const graph = new StateGraph(AgentState);

  // ─── ALL NODES ────────────────────────────────────────────

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

  // Phase 4 — Dev Loop
  graph.addNode("selectNextTask", selectNextTaskNode);
  graph.addNode("contextBuilder", contextBuilderNode);
  graph.addNode("coderAgent", coderAgentNode);
  graph.addNode("updateRegistry", updateRegistryNode);
  graph.addNode("reviewerAgent", reviewerAgentNode);
  graph.addNode("executorAgent", executorAgentNode);
  graph.addNode("snapshotManager", snapshotManagerNode);
  graph.addNode("debuggerAgent", debuggerAgentNode);
  graph.addNode("simplifyTask", simplifyTaskNode);
  graph.addNode("humanEscalation", humanEscalationNode);
  graph.addNode("phaseVerification", phaseVerificationNode);
  graph.addNode("patternExtractor", patternExtractorNode);
  graph.addNode("stateCompactor", stateCompactorNode);
  graph.addNode("presentToUser", presentToUserNode);
  graph.addNode("deploymentVerifier", deploymentVerifierNode);

  // ─── EDGES: Phase 1 — PM Agent ────────────────────────────

  graph.addEdge(START, "pmAgent");

  graph.addConditionalEdges("pmAgent", (state) => {
    if (state.pmStatus === "needs_clarification") return "humanInput";
    if (state.pmStatus === "spec_ready") return "architectStep1";
    return END;
  });

  graph.addEdge("humanInput", "pmAgent");

  // ─── EDGES: Phase 2 — Architect ───────────────────────────

  graph.addEdge("architectStep1", "architectStep2");
  graph.addEdge("architectStep2", "architectStep3");
  graph.addEdge("architectStep3", "architectStep4");
  graph.addEdge("architectStep4", "architectStep5");
  graph.addEdge("architectStep5", "blueprintValidator");

  graph.addConditionalEdges("blueprintValidator", blueprintValidatorRouter, {
    __end__: "plannerAgent",
    architectStep2: "architectStep2",
    architectStep3: "architectStep3",
    architectStep4: "architectStep4",
  });

  // ─── EDGES: Phase 3 — Planner + Sandbox ───────────────────

  graph.addEdge("plannerAgent", "setupSandbox");
  graph.addEdge("setupSandbox", "sandboxHealthCheck");

  graph.addConditionalEdges("sandboxHealthCheck", sandboxHealthRouter, {
    __end__: "selectNextTask",      // ← Phase 4 change! Was END
    setupSandbox: "setupSandbox",
  });

  // ─── EDGES: Phase 4 — Dev Loop ────────────────────────────

  // Task selection → routes to contextBuilder, phaseVerification, or deploymentVerifier
  graph.addConditionalEdges("selectNextTask", selectNextTaskRouter, {
    contextBuilder: "contextBuilder",
    phaseVerification: "phaseVerification",
    presentToUser: "deploymentVerifier",  // All done → verify deployment first
  });

  // Build context → code → index → review
  graph.addEdge("contextBuilder", "coderAgent");
  graph.addEdge("coderAgent", "updateRegistry");
  graph.addEdge("updateRegistry", "reviewerAgent");

  // Review → approved/rejected/simplify
  graph.addConditionalEdges("reviewerAgent", reviewerRouter, {
    executorAgent: "executorAgent",
    coderAgent: "coderAgent",
    simplifyTask: "simplifyTask",
  });

  // Execute → pass/fail
  graph.addConditionalEdges("executorAgent", executorRouter, {
    snapshotManager: "snapshotManager",
    debuggerAgent: "debuggerAgent",
  });

  // Snapshot → back to task selection
  graph.addEdge("snapshotManager", "selectNextTask");

  // Debug → fix/escalate
  graph.addConditionalEdges("debuggerAgent", debuggerRouter, {
    coderAgent: "coderAgent",
    humanEscalation: "humanEscalation",
  });

  // Human escalation → skip/guide/simplify
  graph.addConditionalEdges("humanEscalation", humanEscalationRouter, {
    selectNextTask: "selectNextTask",
    coderAgent: "coderAgent",
    simplifyTask: "simplifyTask",
  });

  // Simplify → back to task selection
  graph.addEdge("simplifyTask", "selectNextTask");

  // Phase verification → pattern extraction → compaction → next task
  graph.addConditionalEdges("phaseVerification", phaseVerificationRouter, {
    patternExtractor: "patternExtractor",
  });

  graph.addEdge("patternExtractor", "stateCompactor");
  graph.addEdge("stateCompactor", "selectNextTask");

  // Present to user → END
  graph.addEdge("presentToUser", END);

  // Deployment verification → pass: present, fail: debug
  graph.addConditionalEdges("deploymentVerifier", deploymentVerifierRouter, {
    presentToUser: "presentToUser",
    debuggerAgent: "debuggerAgent",
  });

  // ─── COMPILE ──────────────────────────────────────────────

  const saver = checkpointer || new MemorySaver();
  const compiled = graph.compile({ checkpointer: saver });

  console.log("✅ Graph compiled (Phase 4: Full Dev Loop — 27 nodes)");
  return compiled;
}

export async function createCheckpointer() {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    // Auto-start Redis container if not running
    const { ensureRedis } = await import("../utils/redisDocker.js");
    const redisReady = ensureRedis(redisUrl);

    if (redisReady) {
      try {
        const { RedisSaver } = await import("@langchain/langgraph-checkpoint-redis");
        const saver = await RedisSaver.fromUrl(redisUrl);
        console.log("✅ Redis checkpointer connected");
        return saver;
      } catch (error) {
        console.warn(`⚠️ Redis connection failed: ${error.message}`);
        console.warn("   Falling back to in-memory checkpointer");
      }
    } else {
      console.warn("⚠️ Redis not available. Using in-memory checkpointer.");
    }
  } else {
    console.log("ℹ️  No REDIS_URL in .env. Using in-memory checkpointer.");
    console.log("   Add REDIS_URL=redis://localhost:6379 to .env for persistence.");
  }

  return new MemorySaver();
}

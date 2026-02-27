/**
 * state.js — Complete V2 State Definition
 * 
 * FIRST PRINCIPLES:
 * In LangGraph, state is the ONLY way nodes communicate.
 * Node A writes to state → Node B reads from state.
 * There's no direct function call between nodes.
 * 
 * This file defines the FULL state shape for all 30 nodes.
 * We define it all upfront even though Phase 1 only uses a subset.
 * Why? Because changing state shape later with active checkpoints 
 * can cause compatibility issues. Better to define it right once.
 * 
 * REDUCERS:
 * - Simple fields (string, number, boolean, object): "last write wins" — no reducer needed
 * - Array fields that accumulate: need a reducer that merges old + new
 * - LangGraph's Annotation.Root handles this
 */

import { Annotation } from "@langchain/langgraph";

/**
 * The complete state definition for AI Dev Team V2
 * 
 * Every node reads from and writes to this state.
 * Each field has a comment explaining which node owns it.
 */
export const AgentState = Annotation.Root({

  // ─── USER INPUT ───────────────────────────────────────────
  // Set by: Entry point (user's raw message)
  userRequirement: Annotation({
    reducer: (_, y) => y ?? "",
    default: () => "",
  }),

  // ─── PM AGENT ─────────────────────────────────────────────
  // Set by: pmAgent node
  pmStatus: Annotation({
    reducer: (_, y) => y ?? "idle",
    default: () => "idle",   // idle | needs_clarification | spec_ready
  }),

  pmQuestions: Annotation({
    reducer: (_, y) => y ?? [],
    default: () => [],
  }),

  // Accumulates Q&A across multiple clarification rounds
  pmConversation: Annotation({
    reducer: (existing, incoming) => {
      if (!incoming) return existing;
      if (Array.isArray(incoming)) return [...existing, ...incoming];
      return [...existing, incoming];
    },
    default: () => [],
  }),

  clarifiedSpec: Annotation({
    reducer: (_, y) => y ?? null,
    default: () => null,
  }),

  // ─── ARCHITECT AGENT ──────────────────────────────────────
  // Built across 5 steps, each step adds to the blueprint
  blueprint: Annotation({
    reducer: (existing, incoming) => {
      if (!incoming) return existing;
      return { ...existing, ...incoming };
    },
    default: () => ({
      entities: [],
      dbSchema: {},
      apiEndpoints: [],
      frontendPages: [],
      folderStructure: "",
      dependencies: {},
    }),
  }),

  // ─── BLUEPRINT VALIDATOR ──────────────────────────────────
  blueprintValidation: Annotation({
    reducer: (_, y) => y ?? { isValid: false, issues: [], validationCycles: 0 },
    default: () => ({ isValid: false, issues: [], validationCycles: 0 }),
  }),

  // ─── PLANNER AGENT ────────────────────────────────────────
  taskQueue: Annotation({
    reducer: (_, y) => y ?? { phases: [] },
    default: () => ({ phases: [] }),
  }),

  currentPhaseIndex: Annotation({
    reducer: (_, y) => y ?? 0,
    default: () => 0,
  }),

  currentTaskIndex: Annotation({
    reducer: (_, y) => y ?? 0,
    default: () => 0,
  }),

  // ─── FILE INTERFACE REGISTRY ──────────────────────────────
  // Grows after every task — needs accumulating reducer
  fileRegistry: Annotation({
    reducer: (existing, incoming) => {
      if (!incoming) return existing;
      if (Array.isArray(incoming)) {
        // Merge: update existing entries, add new ones
        const map = new Map(existing.map((f) => [f.path, f]));
        for (const entry of incoming) {
          map.set(entry.path, entry);
        }
        return Array.from(map.values());
      }
      return existing;
    },
    default: () => [],
  }),

  // ─── PROJECT PATTERNS (V2 NEW) ───────────────────────────
  projectPatterns: Annotation({
    reducer: (existing, incoming) => {
      if (!incoming) return existing;
      return { ...existing, ...incoming };
    },
    default: () => ({
      errorHandling: "",
      namingConvention: "",
      responseFormat: "",
      importStyle: "",
      stateManagement: "",
      commentStyle: "",
    }),
  }),

  // ─── SANDBOX ──────────────────────────────────────────────
  sandboxId: Annotation({
    reducer: (_, y) => y ?? "",
    default: () => "",
  }),

  sandboxHealthy: Annotation({
    reducer: (_, y) => y ?? false,
    default: () => false,
  }),

  // ─── REVIEWER ─────────────────────────────────────────────
  reviewResult: Annotation({
    reducer: (_, y) => y ?? { verdict: "", issues: [], reviewCycle: 0 },
    default: () => ({ verdict: "", issues: [], reviewCycle: 0 }),
  }),

  // ─── EXECUTOR ─────────────────────────────────────────────
  executionResult: Annotation({
    reducer: (_, y) => y ?? { result: "", output: "", errors: "" },
    default: () => ({ result: "", output: "", errors: "" }),
  }),

  // ─── DEBUGGER ─────────────────────────────────────────────
  debugState: Annotation({
    reducer: (_, y) => y ?? { tier: 1, attempts: 0, maxAttempts: 3, rollbackAttempted: false },
    default: () => ({ tier: 1, attempts: 0, maxAttempts: 3, rollbackAttempted: false }),
  }),

  // ─── USER FEEDBACK ────────────────────────────────────────
  userFeedback: Annotation({
    reducer: (existing, incoming) => {
      if (!incoming) return existing;
      if (Array.isArray(incoming)) return [...existing, ...incoming];
      return [...existing, incoming];
    },
    default: () => [],
  }),

  feedbackIteration: Annotation({
    reducer: (_, y) => y ?? 0,
    default: () => 0,
  }),

  maxFeedbackIterations: Annotation({
    reducer: (_, y) => y ?? 3,
    default: () => 3,
  }),

  scopeDrift: Annotation({
    reducer: (_, y) => y ?? 0.0,
    default: () => 0.0,
  }),

  userSatisfied: Annotation({
    reducer: (_, y) => y ?? false,
    default: () => false,
  }),

  // ─── DEPLOYMENT ───────────────────────────────────────────
  deploymentConfig: Annotation({
    reducer: (_, y) => y ?? { platform: "", files: [], instructions: [] },
    default: () => ({ platform: "", files: [], instructions: [] }),
  }),

  // ─── TOKEN TRACKING (V2 NEW) ──────────────────────────────
  tokenUsage: Annotation({
    reducer: (existing, incoming) => {
      if (!incoming) return existing;
      return {
        calls: [...(existing.calls || []), ...(incoming.newCalls || [])],
        totalInput: existing.totalInput + (incoming.addedInput || 0),
        totalOutput: existing.totalOutput + (incoming.addedOutput || 0),
        estimatedCost: existing.estimatedCost + (incoming.addedCost || 0),
      };
    },
    default: () => ({
      calls: [],
      totalInput: 0,
      totalOutput: 0,
      estimatedCost: 0.0,
    }),
  }),

  tokenBudget: Annotation({
    reducer: (_, y) => y ?? 2.0,
    default: () => 2.0,
  }),

  // ─── CONTROL ──────────────────────────────────────────────
  currentPhase: Annotation({
    reducer: (_, y) => y ?? "pm",
    default: () => "pm",   // pm | architect | planner | dev_loop | feedback | deploy
  }),

  // Error message if something goes fatally wrong
  error: Annotation({
    reducer: (_, y) => y ?? null,
    default: () => null,
  }),
});

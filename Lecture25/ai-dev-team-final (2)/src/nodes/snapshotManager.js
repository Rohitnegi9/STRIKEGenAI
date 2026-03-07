/**
 * snapshotManager.js — Git Snapshot After Successful Task
 * 
 * After executor says "pass", we commit + tag the sandbox.
 * This creates a rollback point the Debugger can use later.
 * 
 * Zero LLM calls — pure git operations.
 */

import { snapshot } from "../utils/sandboxManager.js";

export function snapshotManagerNode(state) {
  console.log("\n📸 [Snapshot] Saving checkpoint...\n");

  const { currentTask, sandboxId } = state;

  if (!sandboxId || !currentTask) {
    console.log("   ⚠️ No sandbox or task");
    return { taskStatuses: { [currentTask?.taskId]: "done" } };
  }

  const message = `Task ${currentTask.taskId}: ${currentTask.title}`;
  const result = snapshot(sandboxId, message);

  if (result.success) {
    console.log(`   ✅ Snapshot: ${result.tag} — "${message}"`);
  } else {
    console.log(`   ⚠️ Snapshot failed: ${result.error} (task still marked done)`);
  }

  return {
    taskStatuses: { [currentTask.taskId]: "done" },
    // Reset review and debug state for next task
    reviewResult: { verdict: "", issues: [], reviewCycle: 0 },
    executionResult: { result: "", output: "", errors: "" },
    debugState: { tier: 1, attempts: 0, maxAttempts: 3, rollbackAttempted: false },
    coderOutput: null,
    contextPackage: null,
    currentTask: null,
  };
}

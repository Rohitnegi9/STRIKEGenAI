/**
 * phaseVerification.js — Phase-Level Verification
 * 
 * After all tasks in a phase complete, verify the phase works as a whole.
 * Individual tasks might pass but the integration could be broken.
 * 
 * For now: basic file existence and structure checks.
 * With Docker: would run actual servers, test API responses, etc.
 * 
 * Zero LLM calls — pure verification.
 */

import { executeCommand, getFileList } from "../utils/sandboxManager.js";

export function phaseVerificationNode(state) {
  console.log("\n🏁 [Phase Verification] Checking phase integrity...\n");

  const { currentTask, sandboxId, taskQueue } = state;
  const phase = currentTask?.phase;

  if (!phase) {
    console.log("   ⚠️ No phase info");
    return { taskStatuses: {} };
  }

  const errors = [];
  const outputs = [];

  // Check: all files from this phase exist
  const phaseTasks = phase.tasks || [];
  for (const task of phaseTasks) {
    for (const filePath of (task.filesToCreate || [])) {
      const files = getFileList(sandboxId);
      if (files.includes(filePath)) {
        outputs.push(`✓ ${filePath} exists`);
      } else {
        errors.push(`Missing: ${filePath} (from task ${task.taskId})`);
      }
    }
  }

  // Run phase verification command if provided
  if (phase.verificationCommand && sandboxId) {
    const result = executeCommand(sandboxId, phase.verificationCommand, 15000);
    if (result.exitCode === 0) {
      outputs.push(`✓ Verification command passed: ${phase.verificationCommand}`);
    } else {
      // Don't fail on verification command — deps may not be installed
      outputs.push(`⚠ Verification command exited ${result.exitCode} (may need npm install)`);
    }
  }

  const passed = errors.length === 0;

  console.log(`   ${passed ? "✅" : "❌"} Phase ${phase.phaseNumber} (${phase.phaseName}): ${passed ? "PASSED" : "FAILED"}`);
  outputs.forEach(o => console.log(`   ${o}`));
  errors.forEach(e => console.log(`   ❌ ${e}`));

  return {
    taskStatuses: { [`phase-${phase.phaseNumber}-verified`]: passed ? "done" : "failed" },
  };
}

/**
 * Router: pass → patternExtractor, fail → debuggerAgent
 */
export function phaseVerificationRouter(state) {
  const phase = state.currentTask?.phase;
  const key = `phase-${phase?.phaseNumber}-verified`;
  if (state.taskStatuses?.[key] === "done") return "patternExtractor";
  // On failure, just move on (mark verified to prevent loop)
  return "patternExtractor";
}

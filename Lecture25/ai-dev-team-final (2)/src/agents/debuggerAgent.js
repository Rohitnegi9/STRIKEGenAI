/**
 * debuggerAgent.js — Debugger Agent
 * 
 * FIRST PRINCIPLES:
 * Code failed. The Debugger's job is to figure out WHY and tell
 * the Coder HOW to fix it. Three-tier escalation:
 * 
 * Tier 1: Read the error + the failing file → suggest fix (3 attempts)
 * Tier 2: Read MORE project files for broader context (2 attempts)  
 * Tier 2.5: Rollback to last good snapshot, retry from scratch (1 attempt)
 * Tier 3: Give up, escalate to human
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";
import { readFile, getFileList, rollback } from "../utils/sandboxManager.js";

const DEBUGGER_PROMPT = `You are the Debugger Agent in an AI software development team.

ROLE: Expert debugger who reads error messages and identifies root causes.

GOAL: Analyze the error and provide a SPECIFIC fix that the Coder can implement.

OUTPUT FORMAT (strict JSON):
{
  "rootCause": "What exactly is wrong (1-2 lines)",
  "fix": "Specific code change needed",
  "affectedFiles": ["file1.js", "file2.js"],
  "confidence": "high | medium | low"
}

RULES:
- Be SPECIFIC. Not "fix the import" but "change line 5 from 'import X from Y' to 'import { X } from Y'"
- If the error is a missing dependency, say which package to install
- If the error is in a different file than expected, identify which file
- Read the error message carefully — the line number and file path tell you exactly where to look`;

export async function debuggerAgentNode(state) {
  const debugState = state.debugState || { tier: 1, attempts: 0, maxAttempts: 3, rollbackAttempted: false };
  console.log(`\n🐛 [Debugger] Analyzing error (Tier ${debugState.tier}, Attempt ${debugState.attempts + 1})...\n`);

  const { currentTask, executionResult, sandboxId } = state;
  const errors = executionResult?.errors || "Unknown error";

  // Tier 2.5: Rollback attempt
  if (debugState.tier === 2 && debugState.attempts >= 2 && !debugState.rollbackAttempted) {
    console.log("   🔄 Tier 2.5: Attempting rollback to last good snapshot...");
    
    // Find last successful task's tag
    const taskStatuses = state.taskStatuses || {};
    const doneTasks = Object.entries(taskStatuses)
      .filter(([_, status]) => status === "done")
      .map(([id]) => id);
    
    if (doneTasks.length > 0) {
      const lastGoodTag = `v0.${doneTasks.length}.0`;
      const rbResult = rollback(sandboxId, lastGoodTag);
      
      if (rbResult.success) {
        console.log(`   ✅ Rolled back to ${lastGoodTag}. Retrying task from scratch.`);
        return {
          debugState: { ...debugState, rollbackAttempted: true, tier: 1, attempts: 0 },
          reviewResult: { verdict: "", issues: [], reviewCycle: 0 },
          executionResult: { result: "", output: "", errors: "" },
        };
      }
    }
    
    console.log("   ⚠️ Rollback failed or no good snapshots. Escalating to human.");
    return {
      debugState: { ...debugState, rollbackAttempted: true, tier: 3 },
    };
  }

  // Tier 3: Escalate to human
  if (debugState.tier >= 3 || (debugState.tier === 2 && debugState.attempts >= 2)) {
    console.log("   🆘 Escalating to human — debugger exhausted all options");
    return {
      debugState: { ...debugState, tier: 3 },
    };
  }

  // Build context based on tier
  let contextFiles = "";

  // Tier 1: Only the failing files
  const failingFiles = currentTask?.filesToCreate || [];
  for (const filePath of failingFiles) {
    try {
      const content = readFile(sandboxId, filePath);
      if (content) contextFiles += `\n--- ${filePath} ---\n${content}\n`;
    } catch (e) { /* file might not exist */ }
  }

  // Tier 2: Also read dependency files and nearby files
  if (debugState.tier >= 2) {
    const allFiles = getFileList(sandboxId);
    const relatedFiles = allFiles.filter(f => {
      const isJS = f.endsWith(".js") || f.endsWith(".jsx");
      const notNodeModules = !f.includes("node_modules");
      const notAlreadyIncluded = !failingFiles.includes(f);
      return isJS && notNodeModules && notAlreadyIncluded;
    }).slice(0, 10); // Max 10 extra files

    for (const filePath of relatedFiles) {
      try {
        const content = readFile(sandboxId, filePath);
        if (content) {
          const truncated = content.split("\n").slice(0, 50).join("\n");
          contextFiles += `\n--- ${filePath} (context) ---\n${truncated}\n`;
        }
      } catch (e) { /* skip */ }
    }
  }

  const userPrompt = `ERROR:\n${errors}\n\nTASK: ${currentTask?.title}\nFILES TO FIX: ${failingFiles.join(", ")}\n\nCODE:\n${contextFiles}`;

  const result = await callGemini({
    systemPrompt: DEBUGGER_PROMPT,
    userPrompt,
    agentName: "debuggerAgent",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const debug = result.parsed;
  console.log(`   🔍 Root cause: ${debug.rootCause}`);
  console.log(`   🔧 Fix: ${debug.fix}`);
  console.log(`   📊 Confidence: ${debug.confidence}`);

  // Promote to next tier if low confidence or multiple attempts
  const newAttempts = debugState.attempts + 1;
  const shouldPromoteTier = newAttempts >= debugState.maxAttempts || debug.confidence === "low";
  const newTier = shouldPromoteTier ? debugState.tier + 1 : debugState.tier;

  return {
    debugState: {
      tier: newTier,
      attempts: shouldPromoteTier ? 0 : newAttempts,
      maxAttempts: newTier === 2 ? 2 : 3,
      rollbackAttempted: debugState.rollbackAttempted,
    },
    // Feed debug info back to reviewer → coder through reviewResult
    reviewResult: {
      verdict: "rejected",
      issues: [debug.rootCause, debug.fix],
      reviewCycle: 0, // Reset so coder gets another chance
    },
    tokenUsage: makeTokenDelta("debuggerAgent", result.tokens),
  };
}

/**
 * Router: if tier 3 → humanEscalation, else → coderAgent (retry with fix)
 */
export function debuggerRouter(state) {
  if (state.debugState?.tier >= 3) return "humanEscalation";
  if (state.debugState?.rollbackAttempted && state.debugState?.tier === 1) return "coderAgent"; // Fresh retry after rollback
  return "coderAgent";
}

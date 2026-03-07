/**
 * simplifyTask.js — Task Simplifier ⭐ V2 NEW
 * 
 * When the Coder fails 3 review cycles, the task is too complex.
 * Instead of infinite retries, we break it into 2-3 smaller tasks.
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";

const SIMPLIFY_PROMPT = `You are analyzing a coding task that failed multiple times and needs to be broken into smaller pieces.

Given the original task and the rejection reasons, create 2-3 simpler sub-tasks that together accomplish the same goal but are each simple enough to succeed individually.

OUTPUT FORMAT (strict JSON):
{
  "subTasks": [
    {
      "taskId": "original-taskId-a",
      "title": "Simpler task title",
      "description": "Focused description",
      "filesToCreate": ["file1.js"],
      "filesNeeded": [],
      "acceptanceCriteria": ["Simple criterion"],
      "canParallelize": false
    }
  ],
  "reason": "Why the original task was too complex"
}`;

export async function simplifyTaskNode(state) {
  console.log("\n✂️  [Simplify Task] Breaking complex task into simpler pieces...\n");

  const { currentTask, reviewResult } = state;

  const userPrompt = `FAILED TASK:\n${JSON.stringify(currentTask, null, 2)}\n\nREJECTION HISTORY:\n${JSON.stringify(reviewResult?.issues || [], null, 2)}`;

  const result = await callGemini({
    systemPrompt: SIMPLIFY_PROMPT,
    userPrompt,
    agentName: "simplifyTask",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const output = result.parsed;
  const subTasks = output.subTasks || [];

  console.log(`   ✂️ Split into ${subTasks.length} sub-tasks:`);
  subTasks.forEach(t => console.log(`   • ${t.taskId}: ${t.title}`));
  if (output.reason) console.log(`   💡 Reason: ${output.reason}`);

  // Mark original task as "simplified" and inject sub-tasks
  // The sub-tasks will be picked up by selectNextTask
  const newStatuses = { [currentTask.taskId]: "done" }; // Mark original as done

  // Insert sub-tasks into current phase of task queue
  const updatedQueue = { ...state.taskQueue };
  if (updatedQueue.phases) {
    for (const phase of updatedQueue.phases) {
      const idx = phase.tasks?.findIndex(t => t.taskId === currentTask.taskId);
      if (idx !== undefined && idx >= 0) {
        // Insert sub-tasks after the original task
        phase.tasks.splice(idx + 1, 0, ...subTasks);
        break;
      }
    }
  }

  return {
    taskQueue: updatedQueue,
    taskStatuses: newStatuses,
    reviewResult: { verdict: "", issues: [], reviewCycle: 0 },
    currentTask: null,
    tokenUsage: makeTokenDelta("simplifyTask", result.tokens),
  };
}

/**
 * stateCompactor.js — State Compressor ⭐ V2 NEW
 * 
 * FIRST PRINCIPLES:
 * LangGraph state grows with every task. After 15 tasks, the state
 * might have 15 coderOutputs, 15 executionResults, 15 reviewResults.
 * Most of this is dead data — only the current task's data matters.
 * 
 * The compactor trims old data to keep state lean.
 * This isn't about saving money — it's about keeping within
 * context window limits when state is passed to LLM calls.
 * 
 * Zero LLM calls — pure data trimming.
 */

export function stateCompactorNode(state) {
  console.log("\n🗜️  [State Compactor] Trimming old state...\n");

  // Calculate rough state size
  const stateStr = JSON.stringify(state);
  const estimatedTokens = Math.ceil(stateStr.length / 4);
  console.log(`   📊 State size before: ~${estimatedTokens} tokens`);

  // Compact task queue: completed tasks only keep id + status
  const compactedQueue = { ...state.taskQueue };
  if (compactedQueue.phases) {
    compactedQueue.phases = compactedQueue.phases.map(phase => ({
      ...phase,
      tasks: phase.tasks?.map(task => {
        const status = state.taskStatuses?.[task.taskId];
        if (status === "done") {
          // Completed: keep only essential info
          return {
            taskId: task.taskId,
            title: task.title,
            filesToCreate: task.filesToCreate,
            canParallelize: task.canParallelize,
            // Remove: description, acceptanceCriteria, filesNeeded, estimatedTokens
          };
        }
        return task; // Pending tasks keep full info
      }),
    }));
  }

  // Count what changed
  const beforeStr = JSON.stringify(state.taskQueue);
  const afterStr = JSON.stringify(compactedQueue);
  const saved = beforeStr.length - afterStr.length;

  const afterTokens = Math.ceil((stateStr.length - saved) / 4);
  console.log(`   📊 State size after: ~${afterTokens} tokens (saved ~${Math.ceil(saved / 4)} tokens)`);

  return {
    taskQueue: compactedQueue,
  };
}

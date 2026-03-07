/**
 * selectNextTask.js — Task Selector
 * 
 * FIRST PRINCIPLES:
 * The Planner gave us a queue like:
 *   Phase 1: [task-1, task-2, task-3]
 *   Phase 2: [task-4, task-5]
 *   Phase 3: [task-6, task-7, task-8]
 * 
 * This node is the "foreman" — it looks at the queue, figures out
 * what's done and what's next, and hands the next task to the worker.
 * 
 * LOGIC:
 * 1. Find first task with status != "done" in current phase
 * 2. If all tasks in current phase done → trigger phaseVerification
 * 3. If ALL phases done → route to presentToUser
 * 
 * Zero LLM calls — pure queue logic.
 */

export function selectNextTaskNode(state) {
  console.log("\n🎯 [Select Next Task] Scanning task queue...\n");

  const { taskQueue, taskStatuses } = state;
  const phases = taskQueue?.phases || [];

  if (phases.length === 0) {
    console.log("   ⚠️ No phases in task queue");
    return { currentTask: null, currentPhase: "done" };
  }

  // Walk through phases in order
  for (const phase of phases) {
    const tasks = phase.tasks || [];

    // Check if this phase has pending tasks
    for (const task of tasks) {
      const status = taskStatuses[task.taskId];
      if (!status || status === "pending") {
        console.log(`   📌 Next task: ${task.taskId} — ${task.title}`);
        console.log(`   Phase ${phase.phaseNumber}: ${phase.phaseName}`);
        if (task.filesToCreate?.length) {
          task.filesToCreate.forEach(f => console.log(`   📄 ${f}`));
        }

        return {
          currentTask: task,
          currentPhaseIndex: phase.phaseNumber - 1,
          taskStatuses: { [task.taskId]: "in_progress" },
          currentPhase: "dev_loop",
        };
      }
    }

    // All tasks in this phase done — check if phase verification needed
    const allDone = tasks.every(t => taskStatuses[t.taskId] === "done");
    const phaseVerified = taskStatuses[`phase-${phase.phaseNumber}-verified`];

    if (allDone && !phaseVerified) {
      console.log(`   ✅ Phase ${phase.phaseNumber} (${phase.phaseName}) — all tasks done, needs verification`);
      return {
        currentTask: { 
          taskId: `phase-${phase.phaseNumber}-verify`, 
          type: "phase_verification",
          phase: phase,
        },
        currentPhase: "phase_verification",
      };
    }
  }

  // All phases complete
  console.log("   🎉 ALL TASKS COMPLETE!");
  return {
    currentTask: null,
    currentPhase: "done",
  };
}

/**
 * Router: decides where to go after task selection
 */
export function selectNextTaskRouter(state) {
  if (state.currentPhase === "done") return "presentToUser";
  if (state.currentPhase === "phase_verification") return "phaseVerification";
  if (state.currentTask) return "contextBuilder";
  return "presentToUser";
}

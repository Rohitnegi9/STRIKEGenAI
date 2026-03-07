/**
 * presentToUser.js — Final project presentation
 */

import { getFileList, getSandboxPath } from "../utils/sandboxManager.js";
import { printTokenSummary } from "../utils/tokenTracker.js";

export function presentToUserNode(state) {
  console.log("\n" + "🎉".repeat(25));
  console.log("\n  🚀 PROJECT COMPLETE!\n");
  console.log("═".repeat(60));

  // Project info
  console.log(`  App: ${state.clarifiedSpec?.appName || "Unknown"}`);
  console.log(`  Description: ${state.clarifiedSpec?.description || ""}`);

  // Task summary
  const statuses = state.taskStatuses || {};
  const done = Object.values(statuses).filter(s => s === "done").length;
  const total = Object.keys(statuses).length;
  console.log(`\n  📋 Tasks completed: ${done}/${total}`);

  // Files created
  if (state.sandboxId) {
    try {
      const files = getFileList(state.sandboxId);
      const codeFiles = files.filter(f =>
        !f.includes("node_modules") && !f.includes(".git") && !f.includes("package-lock")
      );
      console.log(`  📂 Files created: ${codeFiles.length}`);
      codeFiles.forEach(f => console.log(`     ${f}`));

      const sandboxPath = getSandboxPath(state.sandboxId);
      console.log(`\n  📍 Project location: ${sandboxPath}`);
    } catch (e) { /* sandbox might be unavailable */ }
  }

  // Token usage
  printTokenSummary(state.tokenUsage);

  // How to run
  console.log("═".repeat(60));
  console.log("  🏃 HOW TO RUN YOUR APP:\n");

  if (state.sandboxId) {
    const sandboxPath = getSandboxPath(state.sandboxId);
    console.log(`  cd ${sandboxPath}`);
    console.log("  docker-compose up");
    console.log("");
    console.log("  Then open:");
    console.log("  🌐 Frontend: http://localhost:15173");
    console.log("  🔌 Backend:  http://localhost:15000");
    console.log("");
    console.log("  To stop: docker-compose down");
  }

  console.log("═".repeat(60));
  console.log("  ✅ Ready for your review!\n");

  return {
    currentPhase: "done",
    userSatisfied: false,
  };
}

/**
 * index.js — Main Entry Point
 * 
 * Run: node src/index.js "Build me a todo app with user authentication"
 * Or:  node src/index.js   (will prompt you for the requirement)
 * 
 * WHAT HAPPENS:
 * 1. Initializes Gemini client
 * 2. Creates LangGraph with checkpointer
 * 3. Takes your requirement
 * 4. Runs the PM Agent flow:
 *    - PM asks questions (if needed)
 *    - You answer
 *    - PM generates final spec
 * 5. Outputs the clarified spec as JSON
 * 
 * PHASE 1 TEST:
 * You should see the PM Agent ask you 3-8 questions,
 * then after your answers, generate a complete project spec.
 */

import "dotenv/config";
import * as readline from "readline";
import { initGemini } from "./utils/gemini.js";
import { printTokenSummary } from "./utils/tokenTracker.js";
import { buildGraph, createCheckpointer } from "./config/graph.js";

// ─── HELPERS ────────────────────────────────────────────────

function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function printBanner() {
  console.log("");
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║                                                          ║");
  console.log("║    🤖  AI DEV TEAM — Multi-Agent Development System     ║");
  console.log("║                                                          ║");
  console.log("║    Phase 3: PM + Architect + Planner + Sandbox          ║");
  console.log("║    By: Coder Army × Claude                               ║");
  console.log("║                                                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");
}

function printSpec(spec) {
  console.log("\n" + "═".repeat(60));
  console.log("  📋 FINAL PROJECT SPECIFICATION");
  console.log("═".repeat(60));
  console.log(JSON.stringify(spec, null, 2));
  console.log("═".repeat(60));
}

function printBlueprint(blueprint, validation) {
  console.log("\n" + "═".repeat(60));
  console.log("  🏗️  ARCHITECTURE BLUEPRINT");
  console.log("═".repeat(60));

  if (blueprint.entities?.length) {
    console.log(`\n  📦 Entities (${blueprint.entities.length}):`);
    blueprint.entities.forEach(e => {
      console.log(`     • ${e.name} — ${e.description || ""}`);
    });
  }

  if (blueprint.dbSchema?.tables?.length) {
    console.log(`\n  🗄️  Database: ${blueprint.dbSchema.databaseType} (${blueprint.dbSchema.tables.length} tables)`);
    blueprint.dbSchema.tables.forEach(t => {
      console.log(`     • ${t.name} (${t.fields?.length || 0} fields)`);
    });
  }

  if (blueprint.apiEndpoints?.length) {
    console.log(`\n  🔌 API Endpoints (${blueprint.apiEndpoints.length}):`);
    blueprint.apiEndpoints.forEach(e => {
      const lock = e.requiresAuth ? "🔒" : "  ";
      console.log(`     ${lock} ${e.method?.padEnd(7)} ${e.path}`);
    });
  }

  if (blueprint.frontendPages?.length) {
    console.log(`\n  🖥️  Frontend Pages (${blueprint.frontendPages.length}):`);
    blueprint.frontendPages.forEach(p => {
      console.log(`     • ${p.route?.padEnd(20)} ${p.name}`);
    });
  }

  if (blueprint.folderStructure) {
    console.log(`\n  📁 Folder Structure:`);
    const lines = typeof blueprint.folderStructure === "string" 
      ? blueprint.folderStructure.split("\n") 
      : [JSON.stringify(blueprint.folderStructure)];
    lines.slice(0, 25).forEach(l => console.log(`     ${l}`));
    if (lines.length > 25) console.log(`     ... (${lines.length - 25} more lines)`);
  }

  if (validation) {
    console.log(`\n  ✅ Validation: ${validation.isValid ? "PASSED" : "FAILED"} (${validation.validationCycles} cycles)`);
    if (validation.issues?.length) {
      validation.issues.forEach(i => {
        console.log(`     ${i.severity === "error" ? "❌" : "⚠️"} ${i.message}`);
      });
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log("\n  ✅ Phase 2 complete! This blueprint will be passed to the");
  console.log("     Planner Agent in Phase 3.\n");
}

// ─── MAIN ───────────────────────────────────────────────────

async function main() {
  printBanner();

  // 1. Initialize Gemini
  try {
    initGemini(process.env.GEMINI_API_KEY);
    console.log(`✅ Gemini initialized (model: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"})`);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    console.error("   Create a .env file with GEMINI_API_KEY=your_key");
    process.exit(1);
  }

  // 2. Create checkpointer
  const checkpointer = await createCheckpointer();

  // 3. Build graph
  const graph = buildGraph({ checkpointer });

  // 4. Get requirement from CLI args or prompt
  let requirement = process.argv.slice(2).join(" ");
  
  if (!requirement) {
    console.log("  What do you want to build?\n");
    console.log("  Examples:");
    console.log('  - "Build a todo app with categories and due dates"');
    console.log('  - "Create an e-commerce store with admin panel"');
    console.log('  - "Build a blog platform with comments and tags"\n');
    requirement = await askUser("  Your idea: ");
  }

  if (!requirement) {
    console.log("  No requirement provided. Exiting.");
    process.exit(0);
  }

  console.log(`\n  📝 Requirement: "${requirement}"\n`);
  console.log("─".repeat(60));

  // 5. Run the graph
  const threadId = `project-${Date.now()}`;
  const config = {
    configurable: {
      thread_id: threadId,
    },
  };

  try {
    // Invoke the graph with initial state
    const finalState = await graph.invoke(
      {
        userRequirement: requirement,
        tokenBudget: parseFloat(process.env.TOKEN_BUDGET || "2.0"),
      },
      config
    );

    // 6. Display results
    if (finalState.clarifiedSpec) {
      printSpec(finalState.clarifiedSpec);
    }

    if (finalState.blueprint?.entities?.length) {
      printBlueprint(finalState.blueprint, finalState.blueprintValidation);
    }

    // Phase 3 output: Task Queue
    if (finalState.taskQueue?.phases?.length) {
      console.log("\n" + "═".repeat(60));
      console.log("  📋 BUILD PLAN");
      console.log("═".repeat(60));
      for (const phase of finalState.taskQueue.phases) {
        console.log(`\n  Phase ${phase.phaseNumber}: ${phase.phaseName} (${phase.tasks?.length || 0} tasks)`);
        phase.tasks?.forEach(t => {
          const icon = t.canParallelize ? "∥" : "→";
          console.log(`    ${icon} ${t.taskId}: ${t.title}`);
          t.filesToCreate?.forEach(f => console.log(`      📄 ${f}`));
        });
      }
      console.log("═".repeat(60));
    }

    // Phase 3 output: Sandbox
    if (finalState.sandboxId) {
      console.log(`\n  📦 Sandbox: ${finalState.sandboxId}`);
      console.log(`  🏥 Healthy: ${finalState.sandboxHealthy ? "✅ Yes" : "❌ No"}`);
      
      // Show files in sandbox
      try {
        const { getFileList } = await import("./utils/sandboxManager.js");
        const files = getFileList(finalState.sandboxId);
        console.log(`  📂 Files created: ${files.length}`);
        files.slice(0, 15).forEach(f => console.log(`     ${f}`));
        if (files.length > 15) console.log(`     ... and ${files.length - 15} more`);
      } catch (e) { /* sandbox may be cleaned up */ }
    }

    if (!finalState.clarifiedSpec && !finalState.blueprint?.entities?.length) {
      console.log("\n  ⚠️ No output generated.");
    }

    console.log("\n  ✅ Phase 3 complete! Sandbox ready for coding in Phase 4.\n");

    // 7. Token usage summary
    printTokenSummary(finalState.tokenUsage);

  } catch (error) {
    if (error.message?.includes("TOKEN_BUDGET_EXCEEDED")) {
      console.error("\n  💰 Token budget exceeded! Increase TOKEN_BUDGET in .env");
    } else {
      console.error("\n  ❌ Error:", error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

main().catch(console.error);

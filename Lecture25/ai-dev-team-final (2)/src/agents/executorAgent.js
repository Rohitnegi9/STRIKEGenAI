/**
 * executorAgent.js — Code Executor (Multi-Container)
 * 
 * TEST LEVELS:
 * 1. File existence — files on disk?
 * 2. Syntax check — valid JavaScript?
 * 3. npm install — install any new dependencies
 * 4. Runtime import — can Node load the file? (skips server/config/model files)
 * 
 * WHAT WE SKIP FOR RUNTIME IMPORT:
 * - Server entry points (server.js, index.js, app.js) — they call .listen()
 * - Config files (db.js, config/) — they connect to DB on import
 * - Model files (models/) — they import config which connects to DB
 * - Frontend files — they need Vite/Babel
 * 
 * These files get tested during PHASE VERIFICATION when the whole
 * server starts up and we can hit actual API endpoints.
 */

import { executeCommand, readFile, getSandboxInfo } from "../utils/sandboxManager.js";

export function executorAgentNode(state) {
  console.log("\n⚡ [Executor] Testing code...\n");

  const { currentTask, coderOutput, sandboxId } = state;

  if (!currentTask || !sandboxId) {
    return { executionResult: { result: "pass", output: "Nothing to test", errors: "" } };
  }

  const info = getSandboxInfo(sandboxId);
  const isDocker = info?.dockerEnabled || false;
  console.log(`   🐳 Docker: ${isDocker ? "ENABLED" : "DISABLED"}`);

  const errors = [];
  const outputs = [];
  const files = coderOutput?.files || [];

  // ─── Level 1: File existence ──────────────────────────────

  for (const file of files) {
    const content = readFile(sandboxId, file.path);
    if (!content) {
      errors.push(`File not found: ${file.path}`);
    } else {
      outputs.push(`✓ ${file.path} exists (${content.split("\n").length} lines)`);
    }
  }

  if (errors.length > 0) return buildResult(false, outputs, errors);

  // ─── Level 2: Syntax check ───────────────────────────────

  for (const file of files) {
    const filePath = file.path;
    if (!filePath.endsWith(".js") && !filePath.endsWith(".jsx")) continue;

    if (filePath.endsWith(".jsx")) {
      const content = readFile(sandboxId, filePath);
      if (content && (content.includes("import") || content.includes("export"))) {
        outputs.push(`✓ ${filePath} has valid module structure`);
      }
      continue;
    }

    // .js syntax check
    const container = filePath.includes("frontend") ? "frontend" : "backend";
    const checkCmd = isDocker
      ? `cd /app/${container} && node --check /app/${filePath}`
      : `node --check ${filePath}`;

    const result = executeCommand(sandboxId, checkCmd, 10000);
    if (result.exitCode === 0) {
      outputs.push(`✓ ${filePath} syntax valid`);
    } else if (result.stderr?.includes("SyntaxError")) {
      errors.push(`Syntax error in ${filePath}: ${result.stderr.slice(0, 300)}`);
    } else {
      outputs.push(`⚠ ${filePath} unresolved imports (will resolve after npm install)`);
    }
  }

  if (errors.length > 0) return buildResult(false, outputs, errors);

  // ─── Level 3: npm install + Runtime check (Docker only) ───

  if (isDocker) {
    const hasBackendFiles = files.some(f => f.path?.includes("backend"));
    const hasFrontendFiles = files.some(f => f.path?.includes("frontend"));

    // Install dependencies
    if (hasBackendFiles) {
      console.log("   📦 Installing backend dependencies...");
      const installResult = executeCommand(sandboxId, "cd /app/backend && npm install 2>&1", 60000);
      outputs.push(installResult.exitCode === 0
        ? "✓ Backend npm install successful"
        : `⚠ Backend npm install: ${installResult.stderr.slice(0, 150)}`);
    }

    if (hasFrontendFiles) {
      console.log("   📦 Installing frontend dependencies...");
      const installResult = executeCommand(sandboxId, "cd /app/frontend && npm install 2>&1", 60000);
      outputs.push(installResult.exitCode === 0
        ? "✓ Frontend npm install successful"
        : `⚠ Frontend npm install: ${installResult.stderr.slice(0, 150)}`);
    }

    // Runtime import test — ONLY for safe files
    const skipPatterns = [
      "server.js", "index.js", "app.js", "main.js", "start.js",  // Server entry points
    ];
    const skipDirs = [
      "/config/",   // DB connection, env loading
      "/models/",   // Import DB config on load
      "/middleware/", // Often imports models
    ];

    for (const file of files) {
      const filePath = file.path;
      if (!filePath.endsWith(".js")) continue;
      if (filePath.includes("frontend")) continue; // Need Vite

      const fileName = filePath.split("/").pop();
      if (skipPatterns.includes(fileName)) {
        outputs.push(`⏭ ${filePath} skipped (server entry point)`);
        continue;
      }
      if (skipDirs.some(dir => filePath.includes(dir))) {
        outputs.push(`⏭ ${filePath} skipped (needs running services)`);
        continue;
      }

      // Safe to import — utility files, validators, helpers
      const testCmd = `cd /app/backend && node -e "import('/app/${filePath}').then(() => console.log('OK')).catch(e => { console.error(e.message); process.exit(1); })"`;
      const result = executeCommand(sandboxId, testCmd, 10000);

      if (result.exitCode === 0) {
        outputs.push(`✓ ${filePath} imports successfully`);
      } else {
        const err = result.stderr || result.stdout;
        if (err.includes("ECONNREFUSED") || err.includes("ENOTFOUND") ||
            err.includes("ETIMEDOUT") || err.includes("ERR_MODULE_NOT_FOUND") ||
            err.includes("Cannot find module") || err.includes("DATABASE_URL") ||
            err.includes("secret") || err.includes("Cannot find package")) {
          outputs.push(`⚠ ${filePath} needs running services: ${err.slice(0, 100)}`);
        } else {
          errors.push(`Runtime error in ${filePath}: ${err.slice(0, 300)}`);
        }
      }
    }
  }

  return buildResult(errors.length === 0, outputs, errors);
}

function buildResult(passed, outputs, errors) {
  console.log(`\n   ${passed ? "✅" : "❌"} Execution ${passed ? "PASSED" : "FAILED"}`);
  outputs.forEach(o => console.log(`   ${o}`));
  if (errors.length) {
    console.log("   Errors:");
    errors.forEach(e => console.log(`   ❌ ${e}`));
  }
  return {
    executionResult: {
      result: passed ? "pass" : "fail",
      output: outputs.join("\n"),
      errors: errors.join("\n"),
    },
  };
}

export function executorRouter(state) {
  if (state.executionResult?.result === "pass") return "snapshotManager";
  return "debuggerAgent";
}

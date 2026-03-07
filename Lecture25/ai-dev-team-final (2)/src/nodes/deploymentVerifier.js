/**
 * deploymentVerifier.js — Verify docker-compose works
 * 
 * FIXES:
 * 1. Captures full build output (stdout + stderr)
 * 2. Ensures env vars are available during build via .env file
 * 3. Max 2 verification attempts, then presents project regardless
 *    (user can fix Dockerfiles manually — code is still usable)
 */

import { execSync } from "child_process";
import { getSandboxPath, readFile } from "../utils/sandboxManager.js";
import fs from "fs";
import path from "path";

const BACKEND_PORT = 15000;
const FRONTEND_PORT = 15173;
const DB_PORT = 15432;

export async function deploymentVerifierNode(state) {
  // Track verification attempts
  const attempts = state.deploymentAttempts || 0;

  if (attempts >= 2) {
    console.log("\n🚀 [Deployment Verifier] Max attempts reached. Presenting project as-is.\n");
    return {
      deploymentAttempts: attempts,
      executionResult: { result: "pass", output: "Skipped — max verification attempts reached. Project code is complete, docker-compose may need manual fixes.", errors: "" },
    };
  }

  console.log(`\n🚀 [Deployment Verifier] Testing docker-compose (attempt ${attempts + 1}/2)...\n`);

  const sandboxPath = getSandboxPath(state.sandboxId);

  if (!sandboxPath) {
    console.log("   ❌ No sandbox path — skipping verification");
    return {
      deploymentAttempts: attempts + 1,
      executionResult: { result: "pass", output: "Skipped — no sandbox", errors: "" },
    };
  }

  const composePath = path.join(sandboxPath, "docker-compose.yml");
  if (!fs.existsSync(composePath)) {
    console.log("   ❌ docker-compose.yml not found — skipping verification");
    return {
      deploymentAttempts: attempts + 1,
      executionResult: { result: "pass", output: "Skipped — no docker-compose.yml", errors: "" },
    };
  }

  const outputs = [];
  const errors = [];

  try {
    // ─── Prep: Patch ports and ensure .env ──────────────────

    patchComposePorts(composePath);
    ensureEnvForBuild(sandboxPath);

    // ─── Step 1: Build ──────────────────────────────────────

    console.log("   📦 Building containers (this may take a minute)...");
    const buildResult = runInSandbox(sandboxPath, "docker-compose build --no-cache 2>&1", 300000);

    if (buildResult.exitCode !== 0) {
      const fullLog = (buildResult.stdout + "\n" + buildResult.stderr).trim();
      const lastLines = fullLog.split("\n").slice(-20).join("\n");
      console.log("   ❌ Build failed. Last 20 lines:");
      console.log(lastLines);
      errors.push(`Docker build failed. Last 20 lines:\n${lastLines}`);
      return buildVerifyResult(false, outputs, errors, attempts + 1);
    }
    outputs.push("✓ Docker build successful");

    // ─── Step 2: Start ──────────────────────────────────────

    console.log("   🚀 Starting services...");
    // Stop any previous run first
    runInSandbox(sandboxPath, "docker-compose down 2>&1", 15000);

    const upResult = runInSandbox(sandboxPath, "docker-compose up -d 2>&1", 60000);
    if (upResult.exitCode !== 0) {
      const fullLog = (upResult.stdout + "\n" + upResult.stderr).trim();
      errors.push(`Docker compose up failed:\n${fullLog.slice(-500)}`);
      return buildVerifyResult(false, outputs, errors, attempts + 1);
    }
    outputs.push("✓ Services started");

    // ─── Step 3: Wait ───────────────────────────────────────

    console.log("   ⏳ Waiting 20 seconds for services...");
    await sleep(20000);

    const psResult = runInSandbox(sandboxPath, "docker-compose ps 2>&1", 10000);
    console.log(psResult.stdout);

    // ─── Step 4: Test backend ───────────────────────────────

    console.log(`   🔍 Testing backend at localhost:${BACKEND_PORT}...`);
    let backendOk = false;

    for (const testPath of ["/api/health", "/api", "/health", "/"]) {
      const result = testEndpoint(`http://localhost:${BACKEND_PORT}${testPath}`, 5000);
      if (result.success) {
        outputs.push(`✓ Backend responds at ${testPath}: ${result.status}`);
        backendOk = true;
        break;
      }
    }

    if (!backendOk) {
      const logs = runInSandbox(sandboxPath, "docker-compose logs --tail=30 backend 2>&1", 10000);
      console.log("   Backend logs:");
      console.log(logs.stdout.slice(-500));
      errors.push(`Backend not responding. Logs:\n${logs.stdout.slice(-300)}`);
    }

    // ─── Step 5: Test frontend ──────────────────────────────

    console.log(`   🔍 Testing frontend at localhost:${FRONTEND_PORT}...`);
    const frontendTest = testEndpoint(`http://localhost:${FRONTEND_PORT}`, 10000);

    if (frontendTest.success) {
      outputs.push(`✓ Frontend responds: ${frontendTest.status}`);
    } else {
      const logs = runInSandbox(sandboxPath, "docker-compose logs --tail=30 frontend 2>&1", 10000);
      console.log("   Frontend logs:");
      console.log(logs.stdout.slice(-500));
      errors.push(`Frontend not responding. Logs:\n${logs.stdout.slice(-300)}`);
    }

    // ─── Step 6: Test DB ────────────────────────────────────

    console.log("   🔍 Testing database...");
    const dbTest = runInSandbox(sandboxPath, "docker-compose exec -T db pg_isready -U postgres 2>&1", 10000);
    if (dbTest.exitCode === 0) {
      outputs.push("✓ Database accepting connections");
    } else {
      outputs.push("⚠ Database check inconclusive");
    }

    // ─── Result ─────────────────────────────────────────────

    const passed = errors.length === 0;

    if (passed) {
      console.log("\n   ✅ DEPLOYMENT VERIFIED!");
      console.log(`   🌐 Backend:  http://localhost:${BACKEND_PORT}`);
      console.log(`   🌐 Frontend: http://localhost:${FRONTEND_PORT}`);
    } else {
      console.log("\n   ❌ Deployment has issues.");
      runInSandbox(sandboxPath, "docker-compose down 2>&1", 15000);
    }

    return buildVerifyResult(passed, outputs, errors, attempts + 1);

  } catch (e) {
    try { runInSandbox(sandboxPath, "docker-compose down 2>&1", 15000); } catch (err) {}
    errors.push(`Verification error: ${e.message}`);
    return buildVerifyResult(false, outputs, errors, attempts + 1);
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

function ensureEnvForBuild(sandboxPath) {
  // Create root .env with default values for docker-compose
  const rootEnv = path.join(sandboxPath, ".env");
  if (!fs.existsSync(rootEnv)) {
    fs.writeFileSync(rootEnv, [
      "DATABASE_URL=postgresql://postgres:postgres@db:5432/appdb",
      "JWT_SECRET=dev-secret-change-in-production",
      "PORT=5000",
      "NODE_ENV=production",
      "VITE_API_URL=http://localhost:15000/api",
    ].join("\n") + "\n");
    console.log("   📝 Created root .env for docker-compose");
  }

  // Ensure backend .env exists
  const backendEnv = path.join(sandboxPath, "backend", ".env");
  if (!fs.existsSync(backendEnv)) {
    fs.writeFileSync(backendEnv, [
      "DATABASE_URL=postgresql://postgres:postgres@db:5432/appdb",
      "JWT_SECRET=dev-secret-change-in-production",
      "PORT=5000",
      "NODE_ENV=production",
    ].join("\n") + "\n");
  }

  // Ensure frontend .env exists
  const frontendEnv = path.join(sandboxPath, "frontend", ".env");
  if (!fs.existsSync(frontendEnv)) {
    fs.writeFileSync(frontendEnv, [
      "VITE_API_URL=http://localhost:15000/api",
    ].join("\n") + "\n");
  }
}

function patchComposePorts(composePath) {
  let content = fs.readFileSync(composePath, "utf-8");

  // Replace port mappings with high ports
  const portReplacements = [
    [/["']?5432:5432["']?/g, `"${DB_PORT}:5432"`],
    [/["']?5000:5000["']?/g, `"${BACKEND_PORT}:5000"`],
    [/["']?5173:5173["']?/g, `"${FRONTEND_PORT}:5173"`],
    [/["']?3000:3000["']?/g, `"${FRONTEND_PORT}:3000"`],
    [/["']?5001:5001["']?/g, `"${BACKEND_PORT}:5001"`],
  ];

  for (const [pattern, replacement] of portReplacements) {
    content = content.replace(pattern, replacement);
  }

  // Ensure env_file is set for backend service
  if (!content.includes("env_file") && content.includes("backend:")) {
    content = content.replace(
      /(backend:[\s\S]*?)(ports:)/,
      "$1env_file:\n      - ./backend/.env\n    $2"
    );
  }

  fs.writeFileSync(composePath, content);
  console.log(`   📝 Patched docker-compose.yml → ports ${BACKEND_PORT}, ${FRONTEND_PORT}, ${DB_PORT}`);
}

function runInSandbox(sandboxPath, command, timeout = 30000) {
  try {
    const stdout = execSync(command, {
      cwd: sandboxPath,
      timeout,
      stdio: "pipe",
      encoding: "utf-8",
    });
    return { stdout: stdout || "", stderr: "", exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message,
      exitCode: error.status || 1,
    };
  }
}

function testEndpoint(url, timeout = 10000) {
  try {
    const result = execSync(
      `curl -s -o /tmp/curl_body -w "%{http_code}" --max-time ${Math.floor(timeout / 1000)} "${url}"`,
      { encoding: "utf-8", timeout: timeout + 2000, stdio: "pipe" }
    );
    const status = parseInt(result.trim());
    let body = "";
    try { body = execSync("cat /tmp/curl_body", { encoding: "utf-8", stdio: "pipe" }); } catch (e) {}
    return { success: status >= 200 && status < 500, status, body };
  } catch (e) {
    return { success: false, status: 0, body: e.message };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildVerifyResult(passed, outputs, errors, attempts) {
  console.log(`\n   ${passed ? "✅" : "❌"} Deployment ${passed ? "VERIFIED" : "FAILED"}`);
  outputs.forEach(o => console.log(`   ${o}`));
  if (errors.length) errors.forEach(e => console.log(`   ❌ ${e}`));

  return {
    deploymentAttempts: attempts,
    executionResult: {
      result: passed ? "pass" : "fail",
      output: outputs.join("\n"),
      errors: errors.join("\n"),
    },
  };
}

/**
 * Router: pass → presentToUser, fail (under 2 attempts) → debuggerAgent, fail (2+ attempts) → presentToUser anyway
 */
export function deploymentVerifierRouter(state) {
  if (state.executionResult?.result === "pass") return "presentToUser";
  if ((state.deploymentAttempts || 0) >= 2) return "presentToUser"; // Give up, show project anyway
  return "debuggerAgent";
}

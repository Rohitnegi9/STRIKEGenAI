/**
 * sandboxManager.js — Project Sandbox (Local Filesystem)
 * 
 * FIRST PRINCIPLES:
 * The sandbox is the "workspace" where AI-generated code lives.
 * 
 * WHY A SANDBOX?
 * AI-generated code could be anything — broken imports, infinite loops,
 * file deletions. We need an isolated place where this code runs safely.
 * 
 * PHASE 3 APPROACH:
 * For now we use a local folder under /tmp or os.tmpdir().
 * This lets you test the full pipeline WITHOUT Docker.
 * 
 * In Phase 4, we'll add a Docker adapter that:
 * - Creates a Docker container instead of a local folder
 * - Runs commands inside the container
 * - Isolates the project from your system
 * 
 * The interface stays the same — agents don't know or care
 * if they're talking to a local folder or a Docker container.
 * 
 * SANDBOX INTERFACE:
 * - createSandbox(folderStructure, dependencies) → sandboxId
 * - healthCheck(sandboxId) → { healthy: true/false, failures: [] }
 * - writeFile(sandboxId, path, content) → writes file
 * - readFile(sandboxId, path) → reads file
 * - executeCommand(sandboxId, command) → { stdout, stderr, exitCode }
 * - snapshot(sandboxId, message) → git commit + tag
 * - rollback(sandboxId, tag) → git checkout
 * - getFileList(sandboxId) → list of files
 * - destroySandbox(sandboxId) → cleanup
 */

import { execSync, exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Store active sandboxes
const sandboxes = new Map();

/**
 * Create a new sandbox workspace
 */
export async function createSandbox(folderStructure, dependencies) {
  const sandboxId = `sandbox-${Date.now()}`;
  const sandboxPath = path.join(os.tmpdir(), "ai-dev-team", sandboxId);

  console.log(`   📂 Creating sandbox: ${sandboxPath}`);

  // Create base directory
  fs.mkdirSync(sandboxPath, { recursive: true });

  // Create backend and frontend directories
  const backendPath = path.join(sandboxPath, "backend");
  const frontendPath = path.join(sandboxPath, "frontend");
  fs.mkdirSync(backendPath, { recursive: true });
  fs.mkdirSync(frontendPath, { recursive: true });

  // Create standard subdirectories
  const backendDirs = ["src", "src/models", "src/routes", "src/middleware", "src/config", "src/utils"];
  const frontendDirs = ["src", "src/pages", "src/components", "src/hooks", "src/context", "src/utils"];

  backendDirs.forEach(d => fs.mkdirSync(path.join(backendPath, d), { recursive: true }));
  frontendDirs.forEach(d => fs.mkdirSync(path.join(frontendPath, d), { recursive: true }));

  // Parse and create additional folders from folderStructure string
  if (typeof folderStructure === "string") {
    const lines = folderStructure.split("\n");
    for (const line of lines) {
      // Extract folder paths from tree-like strings: "├── src/models/"
      const match = line.match(/(?:├──|└──|│\s+├──|│\s+└──|\s+)\s*(.+)/);
      if (match) {
        const item = match[1].trim().replace(/\/$/, "");
        if (item && !item.includes(".") && item.length < 100) {
          // Looks like a directory (no file extension)
          try {
            fs.mkdirSync(path.join(sandboxPath, item), { recursive: true });
          } catch (e) { /* ignore invalid paths */ }
        }
      }
    }
  }

  // Write backend package.json
  if (dependencies?.backend) {
    const backendPkg = {
      name: dependencies.backend.name || "backend",
      version: "1.0.0",
      type: "module",
      main: "src/index.js",
      scripts: {
        start: "node src/index.js",
        dev: "nodemon src/index.js",
      },
      dependencies: dependencies.backend.dependencies || {},
      devDependencies: dependencies.backend.devDependencies || {},
    };
    fs.writeFileSync(
      path.join(backendPath, "package.json"),
      JSON.stringify(backendPkg, null, 2)
    );
  }

  // Write frontend package.json
  if (dependencies?.frontend) {
    const frontendPkg = {
      name: dependencies.frontend.name || "frontend",
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: dependencies.frontend.dependencies || {},
      devDependencies: dependencies.frontend.devDependencies || {},
    };
    fs.writeFileSync(
      path.join(frontendPath, "package.json"),
      JSON.stringify(frontendPkg, null, 2)
    );
  }

  // Write .env.example files
  fs.writeFileSync(
    path.join(backendPath, ".env.example"),
    "PORT=5000\nDATABASE_URL=postgresql://user:pass@localhost:5432/dbname\nJWT_SECRET=your_secret\n"
  );
  fs.writeFileSync(
    path.join(frontendPath, ".env.example"),
    "VITE_API_URL=http://localhost:5000/api\n"
  );

  // Initialize Git
  try {
    execSync("git init", { cwd: sandboxPath, stdio: "pipe" });
    execSync("git add -A", { cwd: sandboxPath, stdio: "pipe" });
    execSync('git commit -m "Initial scaffold" --allow-empty', { cwd: sandboxPath, stdio: "pipe" });
    execSync("git tag v0.0.0", { cwd: sandboxPath, stdio: "pipe" });
    console.log("   ✅ Git initialized with initial commit");
  } catch (e) {
    console.warn(`   ⚠️ Git init failed: ${e.message}`);
  }

  // Store sandbox info
  sandboxes.set(sandboxId, {
    path: sandboxPath,
    backendPath,
    frontendPath,
    createdAt: Date.now(),
    snapshotCount: 0,
  });

  return sandboxId;
}

/**
 * Run health checks on the sandbox
 */
export async function healthCheck(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) return { healthy: false, failures: ["Sandbox not found"] };

  const failures = [];

  // Check 1: Base directories exist
  if (!fs.existsSync(sandbox.backendPath)) failures.push("Backend directory missing");
  if (!fs.existsSync(sandbox.frontendPath)) failures.push("Frontend directory missing");

  // Check 2: package.json exists
  if (!fs.existsSync(path.join(sandbox.backendPath, "package.json"))) {
    failures.push("Backend package.json missing");
  }
  if (!fs.existsSync(path.join(sandbox.frontendPath, "package.json"))) {
    failures.push("Frontend package.json missing");
  }

  // Check 3: Git is initialized
  try {
    execSync("git status", { cwd: sandbox.path, stdio: "pipe" });
  } catch (e) {
    failures.push("Git not initialized");
  }

  // Check 4: Standard directories exist
  const requiredDirs = [
    "backend/src", "backend/src/models", "backend/src/routes",
    "frontend/src", "frontend/src/pages", "frontend/src/components",
  ];
  for (const dir of requiredDirs) {
    if (!fs.existsSync(path.join(sandbox.path, dir))) {
      failures.push(`Missing directory: ${dir}`);
    }
  }

  // Check 5: Disk space (basic check — at least 100MB free)
  try {
    const tmpStats = fs.statfsSync(os.tmpdir());
    const freeMB = (tmpStats.bfree * tmpStats.bsize) / (1024 * 1024);
    if (freeMB < 100) failures.push(`Low disk space: ${Math.floor(freeMB)}MB free`);
  } catch (e) {
    // statfsSync may not be available on all platforms, skip
  }

  return {
    healthy: failures.length === 0,
    failures,
    sandboxPath: sandbox.path,
  };
}

/**
 * Write a file to the sandbox
 */
export function writeFile(sandboxId, filePath, content) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);

  const fullPath = path.join(sandbox.path, filePath);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
}

/**
 * Read a file from the sandbox
 */
export function readFile(sandboxId, filePath) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);

  const fullPath = path.join(sandbox.path, filePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf-8");
}

/**
 * Execute a command in the sandbox
 */
export function executeCommand(sandboxId, command, timeout = 30000) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);

  try {
    const stdout = execSync(command, {
      cwd: sandbox.path,
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

/**
 * Git snapshot (commit + tag)
 */
export function snapshot(sandboxId, message) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);

  sandbox.snapshotCount++;
  const tag = `v0.${sandbox.snapshotCount}.0`;

  try {
    execSync("git add -A", { cwd: sandbox.path, stdio: "pipe" });
    execSync(`git commit -m "${message}" --allow-empty`, { cwd: sandbox.path, stdio: "pipe" });
    execSync(`git tag ${tag}`, { cwd: sandbox.path, stdio: "pipe" });
    return { success: true, tag, message };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Git rollback to a tagged commit
 */
export function rollback(sandboxId, tag) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);

  try {
    execSync(`git checkout ${tag}`, { cwd: sandbox.path, stdio: "pipe" });
    return { success: true, rolledBackTo: tag };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get list of all files in sandbox
 */
export function getFileList(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);

  const files = [];
  function walk(dir, prefix = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), rel);
      } else {
        files.push(rel);
      }
    }
  }
  walk(sandbox.path);
  return files;
}

/**
 * Get sandbox info
 */
export function getSandboxPath(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  return sandbox?.path || null;
}

/**
 * Destroy sandbox
 */
export function destroySandbox(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) return;

  try {
    fs.rmSync(sandbox.path, { recursive: true, force: true });
  } catch (e) { /* best effort cleanup */ }
  sandboxes.delete(sandboxId);
}

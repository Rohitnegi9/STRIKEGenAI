/**
 * sandboxManager.js — Complete Docker Sandbox
 * 
 * CONTAINERS:
 * 1. Database (PostgreSQL or MongoDB) — persistent volume
 * 2. Backend (Node.js) — bind mount to local folder
 * 3. Frontend (Node.js) — bind mount to local folder
 * All on same Docker network so they can talk to each other.
 * 
 * SETUP SEQUENCE:
 * 1. Create Docker network
 * 2. Start DB container → wait for ready → create tables
 * 3. Start Backend container → npm install → set DATABASE_URL
 * 4. Start Frontend container → npm install → set VITE_API_URL
 * 5. Health check everything
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const sandboxes = new Map();
const NETWORK_NAME = "aidev-network";

// Check Docker availability
let dockerAvailable = false;
try {
  execSync("docker info", { stdio: "pipe", timeout: 5000 });
  dockerAvailable = true;
} catch (e) {
  console.warn("⚠️ Docker not available.");
}

// ═══════════════════════════════════════════════════════════════
// DOCKER HELPERS
// ═══════════════════════════════════════════════════════════════

function dockerExec(containerId, command, timeout = 30000) {
  try {
    const stdout = execSync(
      `docker exec ${containerId} sh -c '${command.replace(/'/g, "'\\''")}'`,
      { encoding: "utf-8", timeout, stdio: "pipe" }
    );
    return { stdout: stdout || "", stderr: "", exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message,
      exitCode: error.status || 1,
    };
  }
}

function ensureNetwork() {
  try {
    execSync(`docker network inspect ${NETWORK_NAME}`, { stdio: "pipe" });
  } catch (e) {
    console.log(`   🌐 Creating Docker network: ${NETWORK_NAME}`);
    execSync(`docker network create ${NETWORK_NAME}`, { stdio: "pipe" });
  }
}

function waitForContainer(containerId, checkCmd, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = dockerExec(containerId, checkCmd, 5000);
    if (result.exitCode === 0) return true;
    execSync("sleep 1");
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
// CREATE SANDBOX
// ═══════════════════════════════════════════════════════════════

export async function createSandbox(folderStructure, dependencies, dbSchema) {
  const sandboxId = `sandbox-${Date.now()}`;
  const sandboxBase = process.env.SANDBOX_DIR || path.join(process.cwd(), "sandboxes");
  const sandboxPath = path.join(sandboxBase, sandboxId);

  console.log(`   📂 Creating sandbox: ${sandboxPath}`);
  console.log(`   🐳 Docker: ${dockerAvailable ? "ENABLED" : "DISABLED"}`);

  // ─── Step 1: Create local folder structure ────────────────

  fs.mkdirSync(sandboxPath, { recursive: true });

  const backendPath = path.join(sandboxPath, "backend");
  const frontendPath = path.join(sandboxPath, "frontend");
  fs.mkdirSync(backendPath, { recursive: true });
  fs.mkdirSync(frontendPath, { recursive: true });

  const backendDirs = ["src", "src/models", "src/routes", "src/middleware", "src/config", "src/utils"];
  const frontendDirs = ["src", "src/pages", "src/components", "src/hooks", "src/context", "src/utils"];
  backendDirs.forEach(d => fs.mkdirSync(path.join(backendPath, d), { recursive: true }));
  frontendDirs.forEach(d => fs.mkdirSync(path.join(frontendPath, d), { recursive: true }));

  // Parse additional folders
  if (typeof folderStructure === "string") {
    for (const line of folderStructure.split("\n")) {
      const match = line.match(/(?:├──|└──|│\s+[├└]──|\s+)\s*(.+)/);
      if (match) {
        const item = match[1].trim().replace(/\/$/, "");
        if (item && !item.includes(".") && item.length < 100) {
          try { fs.mkdirSync(path.join(sandboxPath, item), { recursive: true }); }
          catch (e) { /* skip */ }
        }
      }
    }
  }

  // ─── Step 2: Write package.json files ─────────────────────

  if (dependencies?.backend) {
    fs.writeFileSync(path.join(backendPath, "package.json"), JSON.stringify({
      name: dependencies.backend.name || "backend",
      version: "1.0.0",
      type: "module",
      main: "src/index.js",
      scripts: { start: "node src/index.js", dev: "nodemon src/index.js" },
      dependencies: dependencies.backend.dependencies || {},
      devDependencies: dependencies.backend.devDependencies || {},
    }, null, 2));
  }

  if (dependencies?.frontend) {
    fs.writeFileSync(path.join(frontendPath, "package.json"), JSON.stringify({
      name: dependencies.frontend.name || "frontend",
      version: "1.0.0",
      type: "module",
      scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
      dependencies: dependencies.frontend.dependencies || {},
      devDependencies: dependencies.frontend.devDependencies || {},
    }, null, 2));
  }

  // Detect DB type
  const dbType = dependencies?.backend?.dependencies?.mongoose ? "mongo" : "postgres";
  const dbContainerName = `aidev-db-${sandboxId}`;
  const backendContainerName = `aidev-backend-${sandboxId}`;
  const frontendContainerName = `aidev-frontend-${sandboxId}`;
  const volumeName = `aidev-dbdata-${sandboxId}`;

  // DB connection strings
  const dbUrl = dbType === "mongo"
    ? `mongodb://${dbContainerName}:27017/appdb`
    : `postgresql://postgres:postgres@${dbContainerName}:5432/appdb`;

  // ─── Step 3: Write .env files ─────────────────────────────

  fs.writeFileSync(path.join(backendPath, ".env"), [
    "PORT=5000",
    `DATABASE_URL=${dbUrl}`,
    "JWT_SECRET=dev-secret-change-in-production",
    "NODE_ENV=development",
  ].join("\n") + "\n");

  fs.writeFileSync(path.join(frontendPath, ".env"), [
    `VITE_API_URL=http://localhost:5000/api`,
  ].join("\n") + "\n");

  // ─── Step 4: Initialize Git ───────────────────────────────

  try {
    execSync("git init", { cwd: sandboxPath, stdio: "pipe" });
    execSync("git add -A", { cwd: sandboxPath, stdio: "pipe" });
    execSync('git commit -m "Initial scaffold" --allow-empty', { cwd: sandboxPath, stdio: "pipe" });
    execSync("git tag v0.0.0", { cwd: sandboxPath, stdio: "pipe" });
    console.log("   ✅ Git initialized");
  } catch (e) {
    console.warn(`   ⚠️ Git init failed: ${e.message}`);
  }

  // ─── Step 5: Start Docker containers ──────────────────────

  let dbContainerId = null;
  let backendContainerId = null;
  let frontendContainerId = null;

  if (dockerAvailable) {
    try {
      ensureNetwork();

      // --- Database Container ---
      console.log(`\n   🗄️  Starting ${dbType === "mongo" ? "MongoDB" : "PostgreSQL"} container...`);

      if (dbType === "mongo") {
        dbContainerId = execSync([
          "docker run -d",
          `--name ${dbContainerName}`,
          `--network ${NETWORK_NAME}`,
          `-v ${volumeName}:/data/db`,
          "-e MONGO_INITDB_DATABASE=appdb",
          "mongo:7",
        ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 60000 }).trim();

        console.log(`   🗄️  MongoDB container: ${dbContainerId.slice(0, 12)}`);
        console.log("   ⏳ Waiting for MongoDB to be ready...");
        const dbReady = waitForContainer(dbContainerId, "mongosh --eval 'db.runCommand({ping:1})' --quiet", 30);
        console.log(dbReady ? "   ✅ MongoDB ready" : "   ⚠️ MongoDB may not be ready");

      } else {
        dbContainerId = execSync([
          "docker run -d",
          `--name ${dbContainerName}`,
          `--network ${NETWORK_NAME}`,
          `-v ${volumeName}:/var/lib/postgresql/data`,
          "-e POSTGRES_USER=postgres",
          "-e POSTGRES_PASSWORD=postgres",
          "-e POSTGRES_DB=appdb",
          "postgres:16-alpine",
        ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 60000 }).trim();

        console.log(`   🗄️  PostgreSQL container: ${dbContainerId.slice(0, 12)}`);
        console.log("   ⏳ Waiting for PostgreSQL to be ready...");
        const dbReady = waitForContainer(dbContainerId, "pg_isready -U postgres", 30);
        console.log(dbReady ? "   ✅ PostgreSQL ready" : "   ⚠️ PostgreSQL may not be ready");
      }

      // --- Create Tables ---
      if (dbSchema && dbType === "postgres") {
        console.log("   📊 Creating database tables...");
        const sql = generateCreateTableSQL(dbSchema);
        if (sql) {
          const sqlEscaped = sql.replace(/'/g, "'\\''");
          const createResult = dockerExec(dbContainerId, 
            `psql -U postgres -d appdb -c '${sqlEscaped}'`, 15000);
          if (createResult.exitCode === 0) {
            console.log("   ✅ Tables created");
          } else {
            console.warn(`   ⚠️ Table creation issues: ${createResult.stderr.slice(0, 200)}`);
          }
        }
      }

      if (dbSchema && dbType === "mongo") {
        console.log("   📊 MongoDB collections will be created on first insert (schemaless)");
      }

      // --- Backend Container ---
      console.log("\n   🖥️  Starting Backend container...");
      backendContainerId = execSync([
        "docker run -d",
        `--name ${backendContainerName}`,
        `--network ${NETWORK_NAME}`,
        `-v "${sandboxPath}:/app"`,
        "-w /app",
        `-e DATABASE_URL=${dbUrl}`,
        "-e JWT_SECRET=dev-secret-change-in-production",
        "-e PORT=5000",
        "-e NODE_ENV=development",
        "node:20-slim",
        "tail -f /dev/null",
      ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 30000 }).trim();

      console.log(`   🖥️  Backend container: ${backendContainerId.slice(0, 12)}`);

      console.log("   📦 Installing backend dependencies...");
      const backendInstall = dockerExec(backendContainerId, "cd /app/backend && npm install 2>&1", 120000);
      console.log(backendInstall.exitCode === 0 
        ? "   ✅ Backend dependencies installed" 
        : `   ⚠️ Backend npm install issues: ${backendInstall.stderr.slice(0, 200)}`);

      // --- Frontend Container ---
      console.log("\n   🎨 Starting Frontend container...");
      frontendContainerId = execSync([
        "docker run -d",
        `--name ${frontendContainerName}`,
        `--network ${NETWORK_NAME}`,
        `-v "${sandboxPath}:/app"`,
        "-w /app",
        `-e VITE_API_URL=http://${backendContainerName}:5000/api`,
        "node:20-slim",
        "tail -f /dev/null",
      ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 30000 }).trim();

      console.log(`   🎨 Frontend container: ${frontendContainerId.slice(0, 12)}`);

      console.log("   📦 Installing frontend dependencies...");
      const frontendInstall = dockerExec(frontendContainerId, "cd /app/frontend && npm install 2>&1", 120000);
      console.log(frontendInstall.exitCode === 0 
        ? "   ✅ Frontend dependencies installed" 
        : `   ⚠️ Frontend npm install issues: ${frontendInstall.stderr.slice(0, 200)}`);

    } catch (e) {
      console.warn(`   ⚠️ Docker setup failed: ${e.message}`);
      console.warn("   Falling back to local-only mode");
    }
  }

  // ─── Store sandbox info ───────────────────────────────────

  sandboxes.set(sandboxId, {
    path: sandboxPath,
    backendPath,
    frontendPath,
    dbType,
    dbContainerId,
    backendContainerId,
    frontendContainerId,
    dbContainerName,
    backendContainerName,
    frontendContainerName,
    createdAt: Date.now(),
    snapshotCount: 0,
  });

  return sandboxId;
}

// ═══════════════════════════════════════════════════════════════
// RECONNECT SANDBOX (for resume)
// ═══════════════════════════════════════════════════════════════

/**
 * Reconnect to an existing sandbox folder by recreating Docker containers.
 * Used when resuming a project — code files exist on disk, containers are gone.
 */
export async function reconnectSandbox(sandboxId) {
  const sandboxBase = process.env.SANDBOX_DIR || path.join(process.cwd(), "sandboxes");
  const sandboxPath = path.join(sandboxBase, sandboxId);

  console.log(`\n   🔄 Reconnecting sandbox: ${sandboxId}`);

  // Check folder exists
  if (!fs.existsSync(sandboxPath)) {
    console.error(`   ❌ Sandbox folder not found: ${sandboxPath}`);
    return false;
  }

  console.log(`   📂 Found sandbox at: ${sandboxPath}`);

  const backendPath = path.join(sandboxPath, "backend");
  const frontendPath = path.join(sandboxPath, "frontend");

  // Detect DB type from backend package.json
  let dbType = "postgres";
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(backendPath, "package.json"), "utf-8"));
    if (pkg.dependencies?.mongoose) dbType = "mongo";
  } catch (e) { /* default postgres */ }

  const dbContainerName = `aidev-db-${sandboxId}`;
  const backendContainerName = `aidev-backend-${sandboxId}`;
  const frontendContainerName = `aidev-frontend-${sandboxId}`;

  const dbUrl = dbType === "mongo"
    ? `mongodb://${dbContainerName}:27017/appdb`
    : `postgresql://postgres:postgres@${dbContainerName}:5432/appdb`;

  if (!dockerAvailable) {
    console.warn("   ⚠️ Docker not available");
    return false;
  }

  // Remove any old containers with same names (stale)
  for (const name of [dbContainerName, backendContainerName, frontendContainerName]) {
    try { execSync(`docker rm -f ${name}`, { stdio: "pipe", timeout: 5000 }); } catch (e) { /* doesn't exist */ }
  }

  try {
    ensureNetwork();

    // --- DB Container ---
    console.log(`   🗄️  Starting ${dbType === "mongo" ? "MongoDB" : "PostgreSQL"}...`);
    const volumeName = `aidev-dbdata-${sandboxId}`;

    let dbContainerId;
    if (dbType === "mongo") {
      dbContainerId = execSync([
        "docker run -d",
        `--name ${dbContainerName}`,
        `--network ${NETWORK_NAME}`,
        `-v ${volumeName}:/data/db`,
        "-e MONGO_INITDB_DATABASE=appdb",
        "mongo:7",
      ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 60000 }).trim();
      console.log("   ⏳ Waiting for MongoDB...");
      waitForContainer(dbContainerId, "mongosh --eval 'db.runCommand({ping:1})' --quiet", 30);
    } else {
      dbContainerId = execSync([
        "docker run -d",
        `--name ${dbContainerName}`,
        `--network ${NETWORK_NAME}`,
        `-v ${volumeName}:/var/lib/postgresql/data`,
        "-e POSTGRES_USER=postgres",
        "-e POSTGRES_PASSWORD=postgres",
        "-e POSTGRES_DB=appdb",
        "postgres:16-alpine",
      ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 60000 }).trim();
      console.log("   ⏳ Waiting for PostgreSQL...");
      waitForContainer(dbContainerId, "pg_isready -U postgres", 30);
    }
    console.log("   ✅ Database ready");

    // --- Backend Container ---
    console.log("   🖥️  Starting Backend container...");
    const backendContainerId = execSync([
      "docker run -d",
      `--name ${backendContainerName}`,
      `--network ${NETWORK_NAME}`,
      `-v "${sandboxPath}:/app"`,
      "-w /app",
      `-e DATABASE_URL=${dbUrl}`,
      "-e JWT_SECRET=dev-secret-change-in-production",
      "-e PORT=5000",
      "-e NODE_ENV=development",
      "node:20-slim",
      "tail -f /dev/null",
    ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 30000 }).trim();

    console.log("   📦 Installing backend dependencies...");
    dockerExec(backendContainerId, "cd /app/backend && npm install 2>&1", 120000);
    console.log("   ✅ Backend ready");

    // --- Frontend Container ---
    console.log("   🎨 Starting Frontend container...");
    const frontendContainerId = execSync([
      "docker run -d",
      `--name ${frontendContainerName}`,
      `--network ${NETWORK_NAME}`,
      `-v "${sandboxPath}:/app"`,
      "-w /app",
      `-e VITE_API_URL=http://${backendContainerName}:5000/api`,
      "node:20-slim",
      "tail -f /dev/null",
    ].join(" "), { encoding: "utf-8", stdio: "pipe", timeout: 30000 }).trim();

    console.log("   📦 Installing frontend dependencies...");
    dockerExec(frontendContainerId, "cd /app/frontend && npm install 2>&1", 120000);
    console.log("   ✅ Frontend ready");

    // Store in sandboxes map
    sandboxes.set(sandboxId, {
      path: sandboxPath,
      backendPath,
      frontendPath,
      dbType,
      dbContainerId,
      backendContainerId,
      frontendContainerId,
      dbContainerName,
      backendContainerName,
      frontendContainerName,
      createdAt: Date.now(),
      snapshotCount: 0,
    });

    console.log("   ✅ Sandbox reconnected! All containers running.\n");
    return true;

  } catch (e) {
    console.error(`   ❌ Reconnect failed: ${e.message}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════

function generateCreateTableSQL(dbSchema) {
  if (!dbSchema?.tables?.length) return null;

  const statements = [];

  for (const table of dbSchema.tables) {
    const fields = (table.fields || []).map(f => {
      const constraints = (f.constraints || []).join(" ");
      return `  ${f.name} ${f.type || "TEXT"} ${constraints}`.trimEnd();
    });

    let sql = `CREATE TABLE IF NOT EXISTS ${table.name} (\n${fields.join(",\n")}\n)`;
    statements.push(sql + ";");
  }

  // Add foreign keys as ALTER TABLE (safer — handles table creation order)
  for (const table of dbSchema.tables) {
    if (table.foreignKeys) {
      for (const fk of table.foreignKeys) {
        statements.push(
          `ALTER TABLE ${table.name} ADD CONSTRAINT IF NOT EXISTS fk_${table.name}_${fk.field} ` +
          `FOREIGN KEY (${fk.field}) REFERENCES ${fk.references} ON DELETE ${fk.onDelete || "CASCADE"};`
        );
      }
    }
  }

  // Add indexes
  for (const table of dbSchema.tables) {
    if (table.indexes) {
      for (const idx of table.indexes) {
        const idxName = `idx_${table.name}_${idx.replace(/,/g, "_")}`;
        statements.push(
          `CREATE INDEX IF NOT EXISTS ${idxName} ON ${table.name} (${idx});`
        );
      }
    }
  }

  return statements.join("\n");
}

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

export async function healthCheck(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) return { healthy: false, failures: ["Sandbox not found"] };

  const failures = [];

  // Check directories
  if (!fs.existsSync(sandbox.backendPath)) failures.push("Backend directory missing");
  if (!fs.existsSync(sandbox.frontendPath)) failures.push("Frontend directory missing");

  // Check package.json
  if (!fs.existsSync(path.join(sandbox.backendPath, "package.json"))) failures.push("Backend package.json missing");
  if (!fs.existsSync(path.join(sandbox.frontendPath, "package.json"))) failures.push("Frontend package.json missing");

  // Check Git
  try { execSync("git status", { cwd: sandbox.path, stdio: "pipe" }); }
  catch (e) { failures.push("Git not initialized"); }

  // Check DB container
  if (sandbox.dbContainerId) {
    if (sandbox.dbType === "postgres") {
      const result = dockerExec(sandbox.dbContainerId, "pg_isready -U postgres", 5000);
      if (result.exitCode !== 0) failures.push("PostgreSQL not responding");
    } else {
      const result = dockerExec(sandbox.dbContainerId, "mongosh --eval 'db.runCommand({ping:1})' --quiet", 5000);
      if (result.exitCode !== 0) failures.push("MongoDB not responding");
    }
  }

  // Check Backend container
  if (sandbox.backendContainerId) {
    const result = dockerExec(sandbox.backendContainerId, "node --version", 5000);
    if (result.exitCode !== 0) failures.push("Backend container not responding");

    const nmCheck = dockerExec(sandbox.backendContainerId, "ls /app/backend/node_modules/.package-lock.json 2>/dev/null", 5000);
    if (nmCheck.exitCode !== 0) failures.push("Backend node_modules not installed");
  } else {
    failures.push("No backend container");
  }

  // Check Frontend container
  if (sandbox.frontendContainerId) {
    const result = dockerExec(sandbox.frontendContainerId, "node --version", 5000);
    if (result.exitCode !== 0) failures.push("Frontend container not responding");
  } else {
    failures.push("No frontend container");
  }

  // Check tables exist (PostgreSQL)
  if (sandbox.dbContainerId && sandbox.dbType === "postgres") {
    const tableCheck = dockerExec(sandbox.dbContainerId,
      "psql -U postgres -d appdb -c \"SELECT tablename FROM pg_tables WHERE schemaname='public'\" -t", 5000);
    if (tableCheck.exitCode === 0 && tableCheck.stdout.trim()) {
      const tables = tableCheck.stdout.trim().split("\n").map(t => t.trim()).filter(Boolean);
      console.log(`   📊 Tables found: ${tables.join(", ")}`);
    }
  }

  return {
    healthy: failures.length === 0,
    failures,
    sandboxPath: sandbox.path,
    dockerEnabled: !!sandbox.backendContainerId,
  };
}

// ═══════════════════════════════════════════════════════════════
// FILE OPERATIONS (local disk — instant)
// ═══════════════════════════════════════════════════════════════

export function writeFile(sandboxId, filePath, content) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);
  const fullPath = path.join(sandbox.path, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
}

export function readFile(sandboxId, filePath) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);
  const fullPath = path.join(sandbox.path, filePath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf-8");
}

export function getFileList(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);
  const files = [];
  function walk(dir, prefix = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path.join(dir, entry.name), rel);
      else files.push(rel);
    }
  }
  walk(sandbox.path);
  return files;
}

// ═══════════════════════════════════════════════════════════════
// COMMAND EXECUTION
// ═══════════════════════════════════════════════════════════════

/**
 * Execute command in the appropriate container.
 * Detects backend vs frontend from the command path.
 */
export function executeCommand(sandboxId, command, timeout = 30000) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) throw new Error(`Sandbox ${sandboxId} not found`);

  // Route to correct container based on command content
  if (sandbox.backendContainerId && (command.includes("/app/backend") || command.includes("cd /app/backend"))) {
    return dockerExec(sandbox.backendContainerId, command, timeout);
  }
  if (sandbox.frontendContainerId && (command.includes("/app/frontend") || command.includes("cd /app/frontend"))) {
    return dockerExec(sandbox.frontendContainerId, command, timeout);
  }

  // Default: use backend container for general commands
  if (sandbox.backendContainerId) {
    return dockerExec(sandbox.backendContainerId, command, timeout);
  }

  // Local fallback
  try {
    const stdout = execSync(command, {
      cwd: sandbox.path, timeout, stdio: "pipe", encoding: "utf-8",
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

// ═══════════════════════════════════════════════════════════════
// GIT OPERATIONS
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

export function getSandboxPath(sandboxId) {
  return sandboxes.get(sandboxId)?.path || null;
}

export function getSandboxInfo(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) return null;
  return {
    path: sandbox.path,
    dockerEnabled: !!sandbox.backendContainerId,
    dbType: sandbox.dbType,
    dbContainer: sandbox.dbContainerId?.slice(0, 12),
    backendContainer: sandbox.backendContainerId?.slice(0, 12),
    frontendContainer: sandbox.frontendContainerId?.slice(0, 12),
  };
}

export function destroySandbox(sandboxId) {
  const sandbox = sandboxes.get(sandboxId);
  if (!sandbox) return;

  // Remove all containers
  const containers = [sandbox.dbContainerId, sandbox.backendContainerId, sandbox.frontendContainerId];
  for (const id of containers) {
    if (id) {
      try { execSync(`docker rm -f ${id}`, { stdio: "pipe", timeout: 10000 }); }
      catch (e) { /* best effort */ }
    }
  }
  console.log("   🐳 Containers removed");

  // Remove local files
  try { fs.rmSync(sandbox.path, { recursive: true, force: true }); }
  catch (e) { /* best effort */ }

  sandboxes.delete(sandboxId);
}

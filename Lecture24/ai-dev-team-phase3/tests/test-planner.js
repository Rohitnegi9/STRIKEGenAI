/**
 * test-planner.js — Test Planner Agent with real Gemini
 * Run: node tests/test-planner.js
 */

import "dotenv/config";
import { initGemini } from "../src/utils/gemini.js";
import { plannerAgentNode } from "../src/agents/plannerAgent.js";

console.log("\n🧪 TEST: Planner Agent\n");

const MOCK_BLUEPRINT = {
  entities: [
    { name: "User", description: "App user" },
    { name: "Task", description: "A todo task" },
    { name: "Category", description: "Task category" },
  ],
  dbSchema: {
    databaseType: "PostgreSQL",
    tables: [
      { name: "users", fields: [{ name: "id" }, { name: "email" }, { name: "password_hash" }] },
      { name: "tasks", fields: [{ name: "id" }, { name: "title" }, { name: "user_id" }, { name: "category_id" }] },
      { name: "categories", fields: [{ name: "id" }, { name: "name" }, { name: "user_id" }] },
    ],
  },
  apiEndpoints: [
    { method: "POST", path: "/api/auth/register", relatedTable: "users" },
    { method: "POST", path: "/api/auth/login", relatedTable: "users" },
    { method: "GET", path: "/api/tasks", relatedTable: "tasks", requiresAuth: true },
    { method: "POST", path: "/api/tasks", relatedTable: "tasks", requiresAuth: true },
    { method: "GET", path: "/api/categories", relatedTable: "categories", requiresAuth: true },
    { method: "POST", path: "/api/categories", relatedTable: "categories", requiresAuth: true },
  ],
  frontendPages: [
    { name: "Login", route: "/login", components: [{ name: "LoginForm" }] },
    { name: "Dashboard", route: "/dashboard", components: [{ name: "TaskList" }, { name: "AddTask" }] },
    { name: "Categories", route: "/categories", components: [{ name: "CategoryList" }] },
  ],
  folderStructure: "backend/src/models\nbackend/src/routes\nfrontend/src/pages\nfrontend/src/components",
  dependencies: {
    backend: { name: "backend", dependencies: { express: "^4.18.2", pg: "^8.11.0" } },
    frontend: { name: "frontend", dependencies: { react: "^18.2.0", axios: "^1.6.0" } },
  },
};

const MOCK_SPEC = {
  appName: "task-master",
  description: "Task management app",
  authRequired: true,
  features: [
    { name: "Tasks", description: "CRUD" },
    { name: "Categories", description: "Organize tasks" },
    { name: "Auth", description: "Login/register" },
  ],
};

async function runTest() {
  try {
    initGemini(process.env.GEMINI_API_KEY);
    console.log(`  ✅ Gemini initialized\n`);
  } catch (e) { console.error(`  ❌ ${e.message}`); process.exit(1); }

  let passed = 0, failed = 0;
  function assert(c, m) { if (c) { console.log(`  ✅ PASS: ${m}`); passed++; } else { console.log(`  ❌ FAIL: ${m}`); failed++; } }

  const state = {
    clarifiedSpec: MOCK_SPEC,
    blueprint: MOCK_BLUEPRINT,
    tokenUsage: { calls: [], totalInput: 0, totalOutput: 0, estimatedCost: 0 },
    tokenBudget: 2.0,
  };

  const result = await plannerAgentNode(state);

  assert(result.taskQueue?.phases?.length > 0, `Has ${result.taskQueue.phases.length} phases`);
  assert(result.taskQueue?.phases?.length >= 3, `At least 3 phases (got ${result.taskQueue.phases.length})`);
  
  const allTasks = result.taskQueue.phases.flatMap(p => p.tasks || []);
  assert(allTasks.length > 0, `Has ${allTasks.length} total tasks`);
  assert(allTasks.length <= 25, `Reasonable task count (<= 25, got ${allTasks.length})`);
  
  // Check task structure
  const firstTask = allTasks[0];
  assert(firstTask?.taskId, `Tasks have taskId: ${firstTask?.taskId}`);
  assert(firstTask?.filesToCreate?.length > 0, `Tasks have filesToCreate`);
  assert(firstTask?.acceptanceCriteria?.length > 0, `Tasks have acceptanceCriteria`);
  assert(typeof firstTask?.canParallelize === "boolean", `Tasks have canParallelize flag`);

  // Check phases have names
  assert(result.taskQueue.phases[0].phaseName, `Phases have names: ${result.taskQueue.phases[0].phaseName}`);

  // Token tracking
  assert(result.tokenUsage?.newCalls?.length === 1, `Exactly 1 LLM call`);

  console.log(`\n  ─── Summary: ${passed} passed, ${failed} failed ───\n`);
  if (failed > 0) process.exit(1);
}

runTest().catch(err => { console.error("  ❌", err.message); console.error(err.stack); process.exit(1); });

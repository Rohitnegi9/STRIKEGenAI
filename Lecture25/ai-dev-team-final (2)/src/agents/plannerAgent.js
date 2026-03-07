/**
 * plannerAgent.js — Planner Agent
 * 
 * Now includes Phase 6: deployment (Dockerfiles + docker-compose)
 * so the generated project can run with: docker-compose up
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";

const PLANNER_PROMPT = `You are the Planner Agent in an AI software development team.

ROLE: Senior tech lead who creates the build plan.

GOAL: Break the architecture blueprint into ordered coding tasks.

MANDATORY PHASE ORDER:
1. "setup" — Project scaffolding, DB connection file, environment config
2. "models" — Database models/schemas (one task per entity)
3. "middleware" — Auth middleware, error handler, validators
4. "backend" — API routes (one task per resource/entity)
5. "frontend" — React pages + components (one task per page)
6. "integration" — Wire frontend to backend, App.jsx routing, main entry points
7. "deployment" — Dockerfiles for backend + frontend, docker-compose.yml, final README

OUTPUT FORMAT (strict JSON):
{
  "phases": [
    {
      "phaseNumber": 1,
      "phaseName": "setup",
      "description": "What this phase accomplishes",
      "tasks": [
        {
          "taskId": "setup-1",
          "title": "Short task title",
          "description": "What exactly to build",
          "filesToCreate": ["backend/src/config/db.js"],
          "filesNeeded": [],
          "acceptanceCriteria": ["DB config exports pool and connectDB"],
          "canParallelize": false,
          "estimatedTokens": 500
        }
      ]
    }
  ],
  "totalTasks": 18,
  "estimatedTotalTokens": 10000
}

RULES:
- Each task creates 1-3 files max.
- "filesNeeded" = files this task imports from (must exist from prior tasks).
- "filesToCreate" = files this task writes.
- Phase 2 (models) tasks are parallelizable.
- Phase 4 (backend routes) tasks are parallelizable.
- Phase 5 (frontend pages) tasks are parallelizable.
- Give each task a unique taskId: "phaseName-N".
- Keep task count 15-25 for a typical CRUD app.
- Phase 7 MUST include a task that creates:
  - backend/Dockerfile
  - frontend/Dockerfile
  - docker-compose.yml (at project root)
  - Updated README with "docker-compose up" instructions
  The docker-compose.yml must start database + backend + frontend with proper networking.
- File paths should NOT start with / (use relative: "backend/src/..." not "/backend/src/...")`;

export async function plannerAgentNode(state) {
  console.log("\n📋 [Planner Agent] Creating build plan...\n");

  const { blueprint, clarifiedSpec } = state;

  const blueprintSummary = {
    databaseType: blueprint.dbSchema?.databaseType,
    entities: blueprint.entities?.map(e => ({
      name: e.name,
      tableName: e.tableName,
      apiPath: e.apiPath,
      modelFile: e.modelFile,
      routeFile: e.routeFile,
    })),
    tables: blueprint.dbSchema?.tables?.map(t => ({
      name: t.name,
      fieldCount: t.fields?.length,
      foreignKeys: t.foreignKeys?.map(fk => fk.references),
    })),
    apiEndpoints: blueprint.apiEndpoints?.map(e => ({
      method: e.method,
      path: e.path,
      relatedTable: e.relatedTable,
      requiresAuth: e.requiresAuth,
    })),
    frontendPages: blueprint.frontendPages?.map(p => ({
      name: p.name,
      route: p.route,
      componentCount: p.components?.length,
    })),
    folderStructure: blueprint.folderStructure,
    backendDeps: Object.keys(blueprint.dependencies?.backend?.dependencies || {}),
    frontendDeps: Object.keys(blueprint.dependencies?.frontend?.dependencies || {}),
  };

  const result = await callGemini({
    systemPrompt: PLANNER_PROMPT,
    userPrompt: `App: ${clarifiedSpec.appName}\n\nBlueprint:\n${JSON.stringify(blueprintSummary, null, 2)}\n\nSpec:\n${JSON.stringify(clarifiedSpec, null, 2)}`,
    agentName: "plannerAgent",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const plan = result.parsed;

  console.log(`   📦 Total phases: ${plan.phases?.length || 0}`);
  console.log(`   📝 Total tasks: ${plan.totalTasks || "?"}`);
  console.log("");

  if (plan.phases) {
    for (const phase of plan.phases) {
      const parallelCount = phase.tasks?.filter(t => t.canParallelize).length || 0;
      console.log(`   Phase ${phase.phaseNumber}: ${phase.phaseName} — ${phase.tasks?.length || 0} tasks (${parallelCount} parallelizable)`);
      phase.tasks?.forEach(t => {
        console.log(`     ${t.canParallelize ? "∥" : "→"} ${t.taskId}: ${t.title}`);
      });
    }
  }

  return {
    taskQueue: plan,
    currentPhaseIndex: 0,
    currentTaskIndex: 0,
    tokenUsage: makeTokenDelta("plannerAgent", result.tokens),
    currentPhase: "sandbox",
  };
}

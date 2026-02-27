/**
 * architectAgent.js — Architect Agent (5 Steps, Fixed Token Tracking)
 *
 * Each step makes 1 LLM call and returns a token delta.
 * The state reducer accumulates these deltas — no duplication.
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";

// ═══════════════════════════════════════════════════════════════
// STEP 1: Identify Entities & Relationships
// ═══════════════════════════════════════════════════════════════

const STEP1_PROMPT = `You are the Architect Agent in an AI software development team.

ROLE: Senior software architect.
GOAL: Identify ALL entities (data models) and their relationships from the project spec.

OUTPUT FORMAT (strict JSON):
{
  "entities": [
    {
      "name": "EntityName",
      "description": "What this entity represents",
      "relationships": [
        { "target": "OtherEntity", "type": "one-to-many | many-to-many | one-to-one", "description": "How they relate" }
      ]
    }
  ]
}

RULES:
- Always include a "User" entity if auth is required.
- Think about implicit entities (categories, tags, etc.).
- Keep descriptions concise (1 line each).`;

export async function architectStep1Node(state) {
  console.log("\n🏗️  [Architect Step 1/5] Identifying entities & relationships...\n");

  const result = await callGemini({
    systemPrompt: STEP1_PROMPT,
    userPrompt: `Project Specification:\n${JSON.stringify(state.clarifiedSpec, null, 2)}`,
    agentName: "architectStep1",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const entities = result.parsed.entities || result.parsed;
  console.log(`   Found ${entities.length} entities: ${entities.map(e => e.name).join(", ")}`);

  return {
    blueprint: { entities },
    tokenUsage: makeTokenDelta("architectStep1", result.tokens),
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: Design Database Schema
// ═══════════════════════════════════════════════════════════════

const STEP2_PROMPT = `You are the Architect Agent designing the database schema.

OUTPUT FORMAT (strict JSON):
{
  "databaseType": "PostgreSQL" | "MongoDB",
  "databaseReason": "Why this DB (1 line)",
  "tables": [
    {
      "name": "table_name",
      "description": "What this table stores",
      "fields": [
        { "name": "field_name", "type": "VARCHAR(255) | INTEGER | BOOLEAN | TIMESTAMP | UUID | etc.", "constraints": ["PRIMARY KEY", "NOT NULL"], "description": "Purpose" }
      ],
      "foreignKeys": [
        { "field": "local_field", "references": "other_table(field)", "onDelete": "CASCADE | SET NULL" }
      ],
      "indexes": ["field1", "field1,field2"]
    }
  ]
}

RULES:
- Every table MUST have "id" (UUID), "created_at", "updated_at".
- Use snake_case. Be SPECIFIC with types (VARCHAR(255), not "string").
- If auth: users table needs password_hash (NEVER plain passwords).
- Add indexes on foreign keys and commonly queried fields.`;

export async function architectStep2Node(state) {
  console.log("\n🏗️  [Architect Step 2/5] Designing database schema...\n");

  const validationIssues = state.blueprintValidation?.issues || [];
  const fixContext = validationIssues.length > 0
    ? `\n\nPREVIOUS VALIDATION ISSUES TO FIX:\n${JSON.stringify(validationIssues, null, 2)}`
    : "";

  const result = await callGemini({
    systemPrompt: STEP2_PROMPT,
    userPrompt: `Entities:\n${JSON.stringify(state.blueprint.entities, null, 2)}\n\nSpec:\n${JSON.stringify(state.clarifiedSpec, null, 2)}${fixContext}`,
    agentName: "architectStep2",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const schema = result.parsed;
  console.log(`   DB: ${schema.databaseType} — ${schema.tables?.length || 0} tables`);
  schema.tables?.forEach(t => console.log(`   • ${t.name} (${t.fields?.length || 0} fields)`));

  return {
    blueprint: { dbSchema: schema },
    tokenUsage: makeTokenDelta("architectStep2", result.tokens),
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 3: Design API Endpoints
// ═══════════════════════════════════════════════════════════════

const STEP3_PROMPT = `You are the Architect Agent designing REST API endpoints.

TECH: Express.js, JWT auth (if required), JSON responses.

OUTPUT FORMAT (strict JSON):
{
  "apiEndpoints": [
    {
      "method": "GET | POST | PUT | PATCH | DELETE",
      "path": "/api/resource",
      "description": "What this endpoint does",
      "requiresAuth": true | false,
      "roleAccess": ["admin", "user"],
      "requestBody": { "field1": "type" },
      "responseBody": { "field1": "type" },
      "relatedTable": "which DB table"
    }
  ]
}

RULES:
- REST conventions: GET=read, POST=create, PUT/PATCH=update, DELETE=delete.
- Include auth endpoints if needed: /api/auth/register, /api/auth/login, /api/auth/me.
- Every CRUD entity: GET all, GET by id, POST, PUT, DELETE.
- Pagination on GET-all (page, limit query params).`;

export async function architectStep3Node(state) {
  console.log("\n🏗️  [Architect Step 3/5] Designing API endpoints...\n");

  const validationIssues = state.blueprintValidation?.issues || [];
  const fixContext = validationIssues.length > 0
    ? `\n\nPREVIOUS VALIDATION ISSUES TO FIX:\n${JSON.stringify(validationIssues, null, 2)}`
    : "";

  const result = await callGemini({
    systemPrompt: STEP3_PROMPT,
    userPrompt: `DB Schema:\n${JSON.stringify(state.blueprint.dbSchema, null, 2)}\n\nSpec:\n${JSON.stringify(state.clarifiedSpec, null, 2)}${fixContext}`,
    agentName: "architectStep3",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const endpoints = result.parsed.apiEndpoints || result.parsed;
  console.log(`   Designed ${Array.isArray(endpoints) ? endpoints.length : 0} API endpoints`);

  return {
    blueprint: { apiEndpoints: Array.isArray(endpoints) ? endpoints : [] },
    tokenUsage: makeTokenDelta("architectStep3", result.tokens),
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 4: Design Frontend Pages
// ═══════════════════════════════════════════════════════════════

const STEP4_PROMPT = `You are the Architect Agent designing frontend pages.

TECH: React (Vite), React Router, useState + useContext, CSS.

OUTPUT FORMAT (strict JSON):
{
  "frontendPages": [
    {
      "name": "PageName",
      "route": "/route-path",
      "description": "What this page shows and does",
      "requiresAuth": true | false,
      "components": [
        { "name": "ComponentName", "description": "What it renders", "apiCalls": ["/api/endpoint1"] }
      ]
    }
  ]
}

RULES:
- Include auth pages if needed: Login, Register.
- Include layout/navbar component.
- Every data page must reference which API it calls.
- Descriptive routes: /dashboard, /todos/:id, not /page1.`;

export async function architectStep4Node(state) {
  console.log("\n🏗️  [Architect Step 4/5] Designing frontend pages...\n");

  const validationIssues = state.blueprintValidation?.issues || [];
  const fixContext = validationIssues.length > 0
    ? `\n\nPREVIOUS VALIDATION ISSUES TO FIX:\n${JSON.stringify(validationIssues, null, 2)}`
    : "";

  const result = await callGemini({
    systemPrompt: STEP4_PROMPT,
    userPrompt: `API Endpoints:\n${JSON.stringify(state.blueprint.apiEndpoints, null, 2)}\n\nSpec:\n${JSON.stringify(state.clarifiedSpec, null, 2)}${fixContext}`,
    agentName: "architectStep4",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const pages = result.parsed.frontendPages || result.parsed;
  console.log(`   Designed ${Array.isArray(pages) ? pages.length : 0} pages`);

  return {
    blueprint: { frontendPages: Array.isArray(pages) ? pages : [] },
    tokenUsage: makeTokenDelta("architectStep4", result.tokens),
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 5: Folder Structure + Dependencies
// ═══════════════════════════════════════════════════════════════

const STEP5_PROMPT = `You are the Architect Agent generating project folder structure and dependencies.

TECH: Express.js backend + React (Vite) frontend, monorepo: /backend and /frontend.

OUTPUT FORMAT (strict JSON):
{
  "folderStructure": "tree-format string showing every folder and file",
  "dependencies": {
    "backend": {
      "name": "app-backend",
      "dependencies": { "express": "^4.18.2" },
      "devDependencies": { "nodemon": "^3.0.0" }
    },
    "frontend": {
      "name": "app-frontend",
      "dependencies": { "react": "^18.2.0" },
      "devDependencies": { "vite": "^5.0.0" }
    }
  }
}

RULES:
- Backend: routes/, middleware/, models/, config/, utils/
- Frontend: src/pages/, src/components/, src/hooks/, src/context/
- EXACT version numbers. Include: express, cors, dotenv, bcryptjs, jsonwebtoken, pg/mongoose.
- Frontend: react, react-dom, react-router-dom, axios.`;

export async function architectStep5Node(state) {
  console.log("\n🏗️  [Architect Step 5/5] Generating folder structure & dependencies...\n");

  const { dbSchema, apiEndpoints, frontendPages } = state.blueprint;

  const result = await callGemini({
    systemPrompt: STEP5_PROMPT,
    userPrompt: `DB: ${dbSchema?.databaseType} (${dbSchema?.tables?.length} tables)\nAPIs: ${apiEndpoints?.length} endpoints\nPages: ${frontendPages?.length} pages\n\nSpec:\n${JSON.stringify(state.clarifiedSpec, null, 2)}`,
    agentName: "architectStep5",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const output = result.parsed;
  console.log(`   Folder structure generated`);
  console.log(`   Backend deps: ${Object.keys(output.dependencies?.backend?.dependencies || {}).length}`);
  console.log(`   Frontend deps: ${Object.keys(output.dependencies?.frontend?.dependencies || {}).length}`);

  return {
    blueprint: {
      folderStructure: output.folderStructure,
      dependencies: output.dependencies,
    },
    tokenUsage: makeTokenDelta("architectStep5", result.tokens),
  };
}

/**
 * architectAgent.js — Architect Agent (5 Steps)
 * 
 * NAMING CONVENTION (enforced across all steps):
 * - Entity names: PascalCase → User, TodoItem, Category
 * - Table names: snake_case plural → users, todo_items, categories
 * - API paths: kebab-case plural → /api/users, /api/todo-items
 * - File names: camelCase → userModel.js, todoItemRoutes.js
 * - DB fields: snake_case → created_at, password_hash, user_id
 * - JS variables: camelCase → createdAt, passwordHash, userId
 * 
 * Step 1 generates the naming map. Steps 2-5 receive it and MUST follow it.
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";

const NAMING_RULES = `
STRICT NAMING CONVENTION (you MUST follow this):
- Table names: snake_case + plural (e.g., "users", "todo_items", "categories")
- DB field names: snake_case (e.g., "created_at", "password_hash", "user_id")
- API paths: kebab-case + plural (e.g., "/api/users", "/api/todo-items")
- relatedTable field: ALWAYS a single table name, NEVER comma-separated
- Foreign key format: "table_name(field)" (e.g., "users(id)")
`;

// ═══════════════════════════════════════════════════════════════
// STEP 1: Identify Entities & Relationships + Naming Map
// ═══════════════════════════════════════════════════════════════

const STEP1_PROMPT = `You are the Architect Agent in an AI software development team.

ROLE: Senior software architect.
GOAL: Identify ALL entities and their relationships, AND generate a standard naming map.

${NAMING_RULES}

OUTPUT FORMAT (strict JSON):
{
  "entities": [
    {
      "name": "TodoItem",
      "tableName": "todo_items",
      "apiPath": "/api/todo-items",
      "modelFile": "todoItem",
      "routeFile": "todoItemRoutes",
      "description": "A task or todo entry",
      "relationships": [
        { "target": "User", "type": "many-to-one", "foreignKey": "user_id", "description": "Each todo belongs to a user" }
      ]
    }
  ]
}

RULES:
- Always include a "User" entity if auth is required.
- Generate tableName, apiPath, modelFile, routeFile for EVERY entity.
- tableName must be snake_case plural.
- apiPath must be kebab-case plural with /api/ prefix.
- modelFile and routeFile must be camelCase (no extension).`;

export async function architectStep1Node(state) {
  console.log("\n🏗️  [Architect Step 1/5] Identifying entities & naming map...\n");

  const result = await callGemini({
    systemPrompt: STEP1_PROMPT,
    userPrompt: `Project Specification:\n${JSON.stringify(state.clarifiedSpec, null, 2)}`,
    agentName: "architectStep1",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const entities = result.parsed.entities || result.parsed;
  console.log(`   Found ${entities.length} entities:`);
  entities.forEach(e => console.log(`   • ${e.name} → table: ${e.tableName}, api: ${e.apiPath}`));

  return {
    blueprint: { entities },
    tokenUsage: makeTokenDelta("architectStep1", result.tokens),
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: Design Database Schema
// ═══════════════════════════════════════════════════════════════

const STEP2_PROMPT = `You are the Architect Agent designing the database schema.

${NAMING_RULES}

CRITICAL: Use the EXACT table names from the entity naming map provided. Do NOT rename tables.

OUTPUT FORMAT (strict JSON):
{
  "databaseType": "PostgreSQL" | "MongoDB",
  "databaseReason": "Why this DB (1 line)",
  "tables": [
    {
      "name": "todo_items",
      "description": "Stores todo entries",
      "fields": [
        { "name": "id", "type": "UUID DEFAULT gen_random_uuid()", "constraints": ["PRIMARY KEY"], "description": "Unique ID" },
        { "name": "title", "type": "VARCHAR(255)", "constraints": ["NOT NULL"], "description": "Todo title" },
        { "name": "user_id", "type": "UUID", "constraints": ["NOT NULL"], "description": "Owner" },
        { "name": "created_at", "type": "TIMESTAMP", "constraints": ["DEFAULT NOW()"], "description": "Created time" },
        { "name": "updated_at", "type": "TIMESTAMP", "constraints": ["DEFAULT NOW()"], "description": "Updated time" }
      ],
      "foreignKeys": [
        { "field": "user_id", "references": "users(id)", "onDelete": "CASCADE" }
      ],
      "indexes": ["user_id"]
    }
  ]
}

RULES:
- Every table MUST have "id" (UUID with gen_random_uuid()), "created_at", "updated_at".
- Use snake_case for ALL table and field names.
- Be SPECIFIC with types — VARCHAR(255), not just "string".
- If auth: users table needs password_hash (NEVER plain passwords).
- Add indexes on foreign keys.`;

export async function architectStep2Node(state) {
  console.log("\n🏗️  [Architect Step 2/5] Designing database schema...\n");

  // Pass the naming map so Step 2 uses correct table names
  const entityNames = (state.blueprint.entities || []).map(e => ({
    name: e.name, tableName: e.tableName
  }));

  const validationIssues = state.blueprintValidation?.issues || [];
  const fixContext = validationIssues.length > 0
    ? `\n\nPREVIOUS VALIDATION ISSUES TO FIX:\n${JSON.stringify(validationIssues, null, 2)}`
    : "";

  const result = await callGemini({
    systemPrompt: STEP2_PROMPT,
    userPrompt: `Entity Naming Map (use these EXACT table names):\n${JSON.stringify(entityNames, null, 2)}\n\nFull Entities:\n${JSON.stringify(state.blueprint.entities, null, 2)}\n\nSpec:\n${JSON.stringify(state.clarifiedSpec, null, 2)}${fixContext}`,
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

${NAMING_RULES}

CRITICAL: 
- Use the EXACT apiPath from the entity naming map.
- "relatedTable" must be a SINGLE table name, never comma-separated.

OUTPUT FORMAT (strict JSON):
{
  "apiEndpoints": [
    {
      "method": "GET",
      "path": "/api/todo-items",
      "description": "Get all todos for current user",
      "requiresAuth": true,
      "roleAccess": ["user"],
      "requestBody": {},
      "responseBody": { "todos": "array of todo objects" },
      "relatedTable": "todo_items"
    }
  ]
}

RULES:
- REST conventions: GET=read, POST=create, PUT/PATCH=update, DELETE=delete.
- Include auth endpoints if needed: POST /api/auth/register, POST /api/auth/login.
- Every entity: GET all, GET by id, POST, PUT/PATCH, DELETE.
- Pagination on GET-all (page, limit query params).
- relatedTable = the PRIMARY table this endpoint queries. ONE table only.`;

export async function architectStep3Node(state) {
  console.log("\n🏗️  [Architect Step 3/5] Designing API endpoints...\n");

  const entityMap = (state.blueprint.entities || []).map(e => ({
    name: e.name, tableName: e.tableName, apiPath: e.apiPath
  }));

  const validationIssues = state.blueprintValidation?.issues || [];
  const fixContext = validationIssues.length > 0
    ? `\n\nPREVIOUS VALIDATION ISSUES TO FIX:\n${JSON.stringify(validationIssues, null, 2)}`
    : "";

  const result = await callGemini({
    systemPrompt: STEP3_PROMPT,
    userPrompt: `Entity Naming Map:\n${JSON.stringify(entityMap, null, 2)}\n\nDB Schema:\n${JSON.stringify(state.blueprint.dbSchema, null, 2)}\n\nSpec:\n${JSON.stringify(state.clarifiedSpec, null, 2)}${fixContext}`,
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

TECH: React (Vite), React Router, useState + useContext, Tailwind CSS.

OUTPUT FORMAT (strict JSON):
{
  "frontendPages": [
    {
      "name": "DashboardPage",
      "route": "/dashboard",
      "description": "Main page showing todos with add/edit/delete",
      "requiresAuth": true,
      "components": [
        { "name": "TodoList", "description": "Displays todos in a list/grid", "apiCalls": ["/api/todo-items"] }
      ]
    }
  ]
}

RULES:
- Include auth pages if needed: LoginPage, RegisterPage.
- Include a layout/navbar component.
- Every data page must reference which API it calls.
- Use the EXACT API paths from the endpoints provided.
- Descriptive routes: /dashboard, /login, not /page1.`;

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

const STEP5_PROMPT = `You are the Architect Agent generating project structure and dependencies.

TECH: Express.js backend + React (Vite) frontend, monorepo: /backend and /frontend.

OUTPUT FORMAT (strict JSON):
{
  "folderStructure": "tree-format string showing every folder and file",
  "dependencies": {
    "backend": {
      "name": "backend",
      "dependencies": { "express": "^4.18.2", "cors": "^2.8.5", "dotenv": "^16.4.7", "pg": "^8.11.0", "bcryptjs": "^2.4.3", "jsonwebtoken": "^9.0.2", "uuid": "^9.0.0" },
      "devDependencies": { "nodemon": "^3.0.0" }
    },
    "frontend": {
      "name": "frontend",
      "dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0", "react-router-dom": "^6.20.0", "axios": "^1.6.0" },
      "devDependencies": { "vite": "^5.0.0", "@vitejs/plugin-react": "^4.2.0", "tailwindcss": "^3.4.0", "postcss": "^8.4.0", "autoprefixer": "^10.4.0" }
    }
  }
}

RULES:
- Backend: src/models/, src/routes/, src/middleware/, src/config/, src/utils/
- Frontend: src/pages/, src/components/, src/hooks/, src/context/, src/utils/
- EXACT version numbers.
- Backend MUST include: express, cors, dotenv, bcryptjs, jsonwebtoken, pg (or mongoose), uuid.
- Frontend MUST include: react, react-dom, react-router-dom, axios, tailwindcss, vite.`;

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

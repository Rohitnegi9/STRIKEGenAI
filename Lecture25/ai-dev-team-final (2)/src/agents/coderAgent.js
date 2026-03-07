/**
 * coderAgent.js — Coder Agent (All 10 Error Types Addressed)
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";
import { writeFile } from "../utils/sandboxManager.js";

const CODER_PROMPT = `You are the Coder Agent in an AI software development team.

ROLE: Senior full-stack developer who writes clean, production-quality code.

GOAL: Write ALL files listed in the task. Complete, working, consistent with project patterns.

OUTPUT FORMAT (strict JSON):
{
  "files": [
    {
      "path": "backend/src/models/todoItem.js",
      "content": "// Full file content here"
    }
  ],
  "notes": "Brief explanation of key decisions"
}

═══ BACKEND RULES ═══

1. MODULES: ES module syntax ONLY (import/export). NEVER use require().

2. EXPRESS PATTERNS: Use Router(), router.get(), router.post(), etc.

3. DB QUERIES: ALWAYS parameterized ($1, $2, $3). NEVER string concatenation.
   CORRECT: pool.query('SELECT * FROM users WHERE id = $1', [id])
   WRONG:   pool.query('SELECT * FROM users WHERE id = ' + id)

4. RETURN VALUES FROM MODELS:
   - Model methods should return the CLEAN data, not raw pg result
   - CORRECT: const { rows } = await pool.query(...); return rows[0];
   - The caller (route) should NOT need to do .rows[0] — the model handles it
   - Always mark async functions with "async" keyword
   - Always document return type: returns user object, array, or null

5. ERROR RESPONSE FORMAT (use this EXACT format everywhere):
   Success: res.status(200).json({ success: true, data: result })
   Error:   res.status(500).json({ success: false, message: error.message })
   Created: res.status(201).json({ success: true, data: newItem })
   Not found: res.status(404).json({ success: false, message: 'Not found' })
   Validation: res.status(400).json({ success: false, message: 'Invalid input' })
   Unauthorized: res.status(401).json({ success: false, message: 'Unauthorized' })

6. AUTH PATTERN (follow exactly):
   - JWT token format: Authorization header with "Bearer <token>"
   - Token storage: frontend stores in localStorage
   - Auth middleware extracts token: req.headers.authorization?.split(' ')[1]
   - After verify: req.user = decoded (contains id, email, role)
   - Token payload: { id: user.id, email: user.email, role: user.role }

7. ENVIRONMENT VARIABLES:
   - Backend: import 'dotenv/config' at top of config files ONLY
   - Use process.env.DATABASE_URL, process.env.JWT_SECRET, process.env.PORT
   - NEVER use DB_URL, SECRET, or other variations
   - NEVER use REACT_APP_ prefix (that's CRA, not Vite)
   - Models should NOT crash if DATABASE_URL is missing — use lazy connection

8. MIDDLEWARE ORDER in app.js/server.js:
   - cors() FIRST
   - express.json() SECOND
   - API routes THIRD (router mounting)
   - Error handler middleware LAST (app.use((err, req, res, next) => ...))

═══ FRONTEND RULES ═══

9. API CALLS:
   - Use axios with baseURL from import.meta.env.VITE_API_URL
   - NEVER use process.env in frontend (Vite uses import.meta.env)
   - NEVER use REACT_APP_ prefix (that's Create React App, not Vite)
   - Request body field names MUST EXACTLY match what backend route expects
   - If backend expects { email, password } → send exactly { email, password }
   - Auth header: axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
   - Handle errors: catch(err) → err.response?.data?.message || 'Something went wrong'

10. REACT PATTERNS:
   - Functional components with hooks (useState, useEffect, useContext)
   - Use Tailwind CSS — NO inline styles, NO CSS modules, NO styled-components
   - Always include loading state (show spinner while fetching)
   - Always include error state (show error message if API fails)
   - Forms: controlled inputs with useState, onSubmit with e.preventDefault()
   - Navigation: import { useNavigate, Link } from 'react-router-dom'

11. DESIGN SYSTEM (follow strictly — NO generic AI look):
   - Background: bg-gray-950
   - Cards/surfaces: bg-gray-900 border border-gray-800 rounded-xl
   - Primary accent: emerald (bg-emerald-600, text-emerald-400, hover:bg-emerald-500)
   - Text: text-gray-100 (primary), text-gray-400 (secondary)
   - Buttons: bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 font-medium transition-colors
   - Destructive: bg-red-600 hover:bg-red-500
   - Inputs: bg-gray-800 border-gray-700 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent
   - Spacing: p-4 md:p-6, gap-4
   - NO blue default buttons, NO bright white backgrounds, NO system gray

═══ IMPORT RULES ═══

12. FILE PATHS:
   - ALWAYS use the EXACT importStatement provided in dependencies
   - If no importStatement provided, use relative paths from the current file location
   - Count directory depth carefully:
     from routes/auth.js to models/User.js → '../models/User.js'
     from routes/auth.js to middleware/auth.js → '../middleware/auth.js'
     from routes/auth.js to config/db.js → '../config/db.js'
     from pages/Login.jsx to utils/api.js → '../utils/api.js'
   - ALWAYS include .js extension in Node.js imports (required for ES modules)
   - Frontend .jsx files: import components WITHOUT extension

═══ GENERAL ═══

13. Write COMPLETE files — no placeholders, no "// TODO", no "implement here"
14. Follow the naming map for table names, API paths, file names
15. If a template file is provided, match its code style exactly
16. If dependency interfaces say a function is "async", ALWAYS use await when calling it`;

export async function coderAgentNode(state) {
  console.log("\n💻 [Coder Agent] Writing code...\n");

  const { currentTask, contextPackage, sandboxId } = state;

  if (!currentTask || !contextPackage) {
    console.log("   ⚠️ No task or context");
    return { coderOutput: null };
  }

  // Build focused prompt
  let userPrompt = `TASK: ${currentTask.title}\n`;
  userPrompt += `DESCRIPTION: ${currentTask.description}\n\n`;
  userPrompt += `FILES TO CREATE:\n${contextPackage.task.filesToCreate.map(f => `  - ${f}`).join("\n")}\n\n`;

  if (contextPackage.task.acceptanceCriteria?.length) {
    userPrompt += `ACCEPTANCE CRITERIA:\n${contextPackage.task.acceptanceCriteria.map(c => `  ✓ ${c}`).join("\n")}\n\n`;
  }

  // Naming map
  if (contextPackage.namingMap?.length) {
    userPrompt += `NAMING MAP (use these EXACT names):\n`;
    contextPackage.namingMap.forEach(n => {
      userPrompt += `  ${n.entity} → table: ${n.tableName}, api: ${n.apiPath}, model: ${n.modelFile}, route: ${n.routeFile}\n`;
    });
    userPrompt += "\n";
  }

  // Patterns
  const patterns = contextPackage.patterns || {};
  const hasPatterns = Object.values(patterns).some(v => v && v.length > 0);
  if (hasPatterns) {
    userPrompt += `PROJECT PATTERNS:\n`;
    for (const [key, value] of Object.entries(patterns)) {
      if (value) userPrompt += `  ${key}: ${value}\n`;
    }
    userPrompt += "\n";
  }

  // Interface-only dependencies with import statements
  const deps = contextPackage.dependencyInterfaces || {};
  if (Object.keys(deps).length > 0) {
    userPrompt += `DEPENDENCY FILES (use these EXACT import statements):\n`;
    for (const [path, info] of Object.entries(deps)) {
      userPrompt += `\n  ${path}:\n`;
      if (info.importStatement) userPrompt += `    IMPORT: ${info.importStatement}\n`;
      if (info.interface) userPrompt += `    INTERFACE: ${info.interface}\n`;
    }
    userPrompt += "\n";
  }

  // Template file
  if (contextPackage.templateFile) {
    userPrompt += `TEMPLATE (match this code style EXACTLY):\n--- ${contextPackage.templateFile.path} ---\n${contextPackage.templateFile.content}\n\n`;
  }

  // DB schema (filtered)
  if (contextPackage.dbSchema) {
    userPrompt += `DATABASE: ${contextPackage.dbSchema.databaseType}\nTABLES:\n${JSON.stringify(contextPackage.dbSchema.tables, null, 2)}\n\n`;
  }

  // API endpoints (filtered)
  if (contextPackage.apiEndpoints) {
    userPrompt += `API ENDPOINTS (use exact paths and request/response fields):\n${JSON.stringify(contextPackage.apiEndpoints, null, 2)}\n\n`;
  }

  userPrompt += `APP: ${contextPackage.appName}\nAUTH: ${contextPackage.authRequired}\n`;

  // Review feedback if retrying
  const reviewIssues = state.reviewResult?.issues || [];
  if (reviewIssues.length > 0 && state.reviewResult?.verdict === "rejected") {
    userPrompt += `\n⚠️ FIX THESE ISSUES:\n`;
    reviewIssues.forEach(issue => { userPrompt += `  - ${issue}\n`; });
    userPrompt += "\n";
  }

  const result = await callGemini({
    systemPrompt: CODER_PROMPT,
    userPrompt,
    agentName: "coderAgent",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const output = result.parsed;
  const files = output.files || [];

  // Write files to sandbox
  let filesWritten = 0;
  for (const file of files) {
    if (file.path && file.content) {
      try {
        writeFile(sandboxId, file.path, file.content);
        filesWritten++;
        console.log(`   ✅ Written: ${file.path} (${file.content.split("\n").length} lines)`);
      } catch (err) {
        console.error(`   ❌ Failed to write ${file.path}: ${err.message}`);
      }
    }
  }

  console.log(`\n   📝 ${filesWritten} files written to sandbox`);
  if (output.notes) console.log(`   💡 ${output.notes}`);

  return {
    coderOutput: {
      files: files.map(f => ({ path: f.path, lines: f.content?.split("\n").length || 0 })),
      notes: output.notes,
    },
    tokenUsage: makeTokenDelta("coderAgent", result.tokens),
  };
}

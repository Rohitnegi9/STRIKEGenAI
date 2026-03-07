/**
 * patternExtractor.js — Code Pattern Extractor ⭐ V2 NEW
 * 
 * FIRST PRINCIPLES:
 * Phase 1 code establishes conventions: how errors are handled,
 * how responses are formatted, what import style is used.
 * Phase 2+ code MUST follow these same conventions.
 * 
 * The pattern extractor reads Phase N's code and distills it into
 * a short description that future Coder calls receive as context.
 * 
 * This is what prevents "style drift" — where the AI starts writing
 * camelCase in Phase 1 and switches to snake_case in Phase 3.
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";
import { readFile, getFileList } from "../utils/sandboxManager.js";

const PATTERN_PROMPT = `You are analyzing code files to extract exact coding patterns. Be VERY specific — include actual code snippets, not descriptions.

Extract these patterns:

OUTPUT FORMAT (strict JSON):
{
  "errorHandling": "try { ... } catch(err) { res.status(500).json({ success: false, message: err.message }) }",
  "responseFormat": "Success: { success: true, data: result } | Error: { success: false, message: string }",
  "authPattern": "Bearer token in Authorization header, extracted with req.headers.authorization?.split(' ')[1]",
  "importStyle": "ES modules, named: import { pool } from '../config/db.js', default: import User from '../models/User.js'",
  "envVarStyle": "Backend: process.env.DATABASE_URL, Frontend: import.meta.env.VITE_API_URL",
  "modelReturnStyle": "Models return clean data: const { rows } = await pool.query(...); return rows[0]",
  "middlewareOrder": "cors() → express.json() → routes → errorHandler",
  "namingConvention": "camelCase vars, PascalCase components, snake_case DB fields, kebab-case API paths",
  "asyncPattern": "All DB/API functions are async, always called with await",
  "frontendApiPattern": "axios.get/post with baseURL from import.meta.env.VITE_API_URL, token in Authorization header"
}

RULES:
- Each value should be a SHORT code example or exact pattern, not a vague description
- If a pattern isn't established yet, use empty string ""
- Be precise enough that another developer can follow it exactly`;

export async function patternExtractorNode(state) {
  console.log("\n🎨 [Pattern Extractor] Analyzing code patterns...\n");

  const { sandboxId } = state;

  if (!sandboxId) {
    console.log("   ⚠️ No sandbox");
    return {};
  }

  // Read recent code files
  const allFiles = getFileList(sandboxId);
  const codeFiles = allFiles.filter(f => 
    (f.endsWith(".js") || f.endsWith(".jsx")) && !f.includes("node_modules")
  ).slice(0, 8); // Max 8 files to keep tokens low

  if (codeFiles.length === 0) {
    console.log("   ⚠️ No code files to analyze");
    return {};
  }

  let codeContent = "";
  for (const filePath of codeFiles) {
    try {
      const content = readFile(sandboxId, filePath);
      if (content) {
        const truncated = content.split("\n").slice(0, 40).join("\n");
        codeContent += `\n--- ${filePath} ---\n${truncated}\n`;
      }
    } catch (e) { /* skip */ }
  }

  const result = await callGemini({
    systemPrompt: PATTERN_PROMPT,
    userPrompt: codeContent,
    agentName: "patternExtractor",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const patterns = result.parsed;

  console.log("   Extracted patterns:");
  for (const [key, value] of Object.entries(patterns)) {
    if (value) console.log(`   • ${key}: ${value}`);
  }

  return {
    projectPatterns: patterns,
    tokenUsage: makeTokenDelta("patternExtractor", result.tokens),
  };
}

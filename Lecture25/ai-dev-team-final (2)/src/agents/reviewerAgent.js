/**
 * reviewerAgent.js — Code Reviewer
 * 
 * FIRST PRINCIPLES:
 * The Coder writes code, but LLMs make mistakes — wrong imports,
 * missing error handling, inconsistent patterns. The Reviewer catches
 * these BEFORE execution, saving expensive debug cycles.
 * 
 * Think of it as a senior dev doing code review before merging a PR.
 * 
 * MAX 2 REJECTION CYCLES:
 * If reviewer rejects 3 times, the task goes to simplifyTask — the
 * task gets broken into smaller pieces instead of infinite retry loops.
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";
import { readFile } from "../utils/sandboxManager.js";

const REVIEWER_PROMPT = `You are the Reviewer Agent in an AI software development team.

ROLE: Senior code reviewer. Last gate before code runs.

GOAL: Review for correctness and consistency. Approve or reject with actionable feedback.

REVIEW CHECKLIST:
1. IMPORTS: Do imports use EXACT importStatements from dependencies? Are relative paths correct? Is .js extension included?
2. EXPORTS: Does the file export what the interface says? Named vs default correct?
3. ASYNC/AWAIT: Are async functions called with await? No missing awaits on DB queries or API calls?
4. ERROR RESPONSE FORMAT: Does it use { success: true/false, data/message }? Consistent across all endpoints?
5. AUTH PATTERN: Uses "Bearer " prefix? Extracts with split(' ')[1]? Sets req.user after verify?
6. REQUEST/RESPONSE FIELDS: Do field names match between frontend API calls and backend route handlers?
7. ENV VARIABLES: Uses process.env.DATABASE_URL (not DB_URL)? Frontend uses import.meta.env.VITE_API_URL (not process.env)?
8. MIDDLEWARE ORDER: cors → json → routes → error handler?
9. MODEL RETURNS: Do models return clean data (not raw { rows })? Does caller handle null/undefined?
10. SECURITY: Parameterized queries? No hardcoded secrets? Proper password hashing?
11. COMPLETENESS: Does it meet acceptance criteria?

OUTPUT FORMAT (strict JSON):
{
  "verdict": "approved" | "rejected",
  "issues": ["Specific issue 1", "Specific issue 2"],
  "summary": "One-line summary"
}

RULES:
- If approved, issues should be empty or minor suggestions.
- If rejected, issues MUST be specific and actionable — include exact line/code to fix.
- Be practical. Don't reject for style preferences — only bugs, security, or missing functionality.
- If code is 90% correct with minor issues, APPROVE with suggestions.
- NEVER reject for missing features that are in a DIFFERENT task.`;

export async function reviewerAgentNode(state) {
  const currentCycle = state.reviewResult?.reviewCycle || 0;
  console.log(`\n🔍 [Reviewer] Reviewing code (cycle ${currentCycle + 1}/3)...\n`);

  const { currentTask, coderOutput, sandboxId, contextPackage } = state;

  if (!currentTask || !coderOutput?.files?.length) {
    console.log("   ⚠️ Nothing to review");
    return { reviewResult: { verdict: "approved", issues: [], reviewCycle: 0 } };
  }

  // Read actual code from sandbox
  let codeContent = "";
  for (const file of coderOutput.files) {
    try {
      const content = readFile(sandboxId, file.path);
      if (content) codeContent += `\n--- ${file.path} ---\n${content}\n`;
    } catch (e) { /* file might not exist */ }
  }

  let userPrompt = `TASK: ${currentTask.title}\n`;
  userPrompt += `DESCRIPTION: ${currentTask.description || ""}\n\n`;
  userPrompt += `ACCEPTANCE CRITERIA:\n${(currentTask.acceptanceCriteria || []).map(c => `  ✓ ${c}`).join("\n")}\n\n`;
  userPrompt += `CODE TO REVIEW:\n${codeContent}\n`;

  // Add patterns for consistency check
  const patterns = contextPackage?.patterns || {};
  const hasPatterns = Object.values(patterns).some(v => v && v.length > 0);
  if (hasPatterns) {
    userPrompt += `\nPROJECT PATTERNS (check compliance):\n`;
    for (const [key, value] of Object.entries(patterns)) {
      if (value) userPrompt += `  ${key}: ${value}\n`;
    }
  }

  const result = await callGemini({
    systemPrompt: REVIEWER_PROMPT,
    userPrompt,
    agentName: "reviewerAgent",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const review = result.parsed;
  const verdict = review.verdict || "approved";
  const issues = review.issues || [];

  if (verdict === "approved") {
    console.log(`   ✅ APPROVED: ${review.summary || "Code looks good"}`);
  } else {
    console.log(`   ❌ REJECTED: ${review.summary || "Issues found"}`);
    issues.forEach(i => console.log(`   • ${i}`));
  }

  return {
    reviewResult: {
      verdict,
      issues,
      reviewCycle: currentCycle + 1,
      summary: review.summary,
    },
    tokenUsage: makeTokenDelta("reviewerAgent", result.tokens),
  };
}

/**
 * Router: approved → executor, rejected (≤2) → coder, rejected (>2) → simplifyTask
 */
export function reviewerRouter(state) {
  const { verdict, reviewCycle } = state.reviewResult || {};

  if (verdict === "approved") return "executorAgent";
  if (reviewCycle >= 3) return "simplifyTask";
  return "coderAgent"; // Retry with feedback
}

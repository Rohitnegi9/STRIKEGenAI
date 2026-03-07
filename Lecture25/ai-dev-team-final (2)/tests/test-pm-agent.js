/**
 * test-pm-agent.js — Test PM Agent with real Gemini API
 * Run: node tests/test-pm-agent.js
 */

import "dotenv/config";
import { initGemini } from "../src/utils/gemini.js";
import { pmAgentNode } from "../src/agents/pmAgent.js";

console.log("\n🧪 TEST: PM Agent (Real Gemini API)\n");

async function runTest() {
  try {
    initGemini(process.env.GEMINI_API_KEY);
    console.log(`  ✅ Gemini initialized (${process.env.GEMINI_MODEL || "gemini-2.5-flash"})\n`);
  } catch (error) {
    console.error(`  ❌ ${error.message}`);
    process.exit(1);
  }

  let passed = 0, failed = 0;
  function assert(c, m) { if (c) { console.log(`  ✅ PASS: ${m}`); passed++; } else { console.log(`  ❌ FAIL: ${m}`); failed++; } }

  // Test 1: Vague requirement
  console.log("  ─── Test 1: Vague requirement → questions ───\n");

  const state1 = {
    userRequirement: "Build me a todo app",
    pmStatus: "idle",
    pmQuestions: [],
    pmConversation: [],
    tokenUsage: { calls: [], totalInput: 0, totalOutput: 0, estimatedCost: 0 },
    tokenBudget: 2.0,
  };

  const result1 = await pmAgentNode(state1);

  assert(result1.pmStatus === "needs_clarification" || result1.pmStatus === "spec_ready", `Valid status: ${result1.pmStatus}`);
  assert(result1.tokenUsage?.newCalls?.length === 1, `Exactly 1 new call tracked (got ${result1.tokenUsage?.newCalls?.length})`);

  if (result1.pmStatus === "needs_clarification") {
    assert(result1.pmQuestions.length > 0, `Generated ${result1.pmQuestions.length} questions`);

    // Test 2: Answers → spec
    console.log("\n  ─── Test 2: Answers → spec ───\n");

    const state2 = {
      userRequirement: "Build me a todo app",
      pmStatus: "idle",
      pmQuestions: [],
      pmConversation: [
        { role: "pm", questions: result1.pmQuestions },
        { role: "user", answers: "Categories, due dates, priority. Yes auth. Single user role. Clean UI." },
      ],
      tokenUsage: { calls: [], totalInput: 0, totalOutput: 0, estimatedCost: 0 },
      tokenBudget: 2.0,
    };

    const result2 = await pmAgentNode(state2);
    assert(result2.pmStatus === "spec_ready", `Second call → spec_ready: ${result2.pmStatus}`);
    assert(result2.clarifiedSpec !== null, "Spec generated");
    assert(result2.tokenUsage?.newCalls?.length === 1, `Exactly 1 new call tracked`);
  }

  console.log(`\n  ─── Summary: ${passed} passed, ${failed} failed ───\n`);
  if (failed > 0) process.exit(1);
}

runTest().catch(err => { console.error("  ❌", err.message); process.exit(1); });

/**
 * pmAgent.js — Project Manager Agent (Fixed Token Tracking)
 */

import { callGemini, makeTokenDelta } from "../utils/gemini.js";

const PM_SYSTEM_PROMPT = `You are the PM Agent in an AI software development team.

ROLE: You are a senior project manager who converts vague requirements into clear, actionable specifications.

GOAL: Analyze the user's project requirement and either:
1. Ask clarifying questions if the requirement is ambiguous
2. Generate a complete project specification if the requirement is clear enough

BOUNDARIES:
- Max 5-8 clarifying questions (pick the most important ones)
- Do NOT ask about tech stack — it's fixed: React (Vite) frontend + Express.js backend + PostgreSQL or MongoDB
- Do NOT ask obvious questions. If someone says "todo app", you KNOW it needs CRUD operations
- Make reasonable assumptions for minor details and state them in the spec
- Focus questions on BUSINESS LOGIC ambiguity (user roles, permissions, data relationships, workflows)

OUTPUT FORMAT — You MUST return one of two JSON formats:

FORMAT 1 — When you need more information:
{
  "status": "needs_clarification",
  "questions": ["Question 1?", "Question 2?"],
  "assumptions": ["Assumption I'm making if you don't answer..."]
}

FORMAT 2 — When you have enough information to create a spec:
{
  "status": "spec_ready",
  "spec": {
    "appName": "my-app",
    "description": "One-line description",
    "userRoles": ["admin", "user"],
    "authRequired": true,
    "features": [
      {
        "name": "Feature Name",
        "description": "What it does",
        "subFeatures": ["sub1", "sub2"],
        "userAccess": ["admin", "user"]
      }
    ],
    "databaseRecommendation": "PostgreSQL or MongoDB",
    "databaseReason": "Why this DB fits",
    "pages": [
      {
        "name": "Page Name",
        "route": "/route",
        "description": "What this page shows",
        "requiresAuth": true
      }
    ],
    "assumptions": ["Things I decided on my own"]
  }
}

RULES:
- Be concise in questions. No fluff.
- If the requirement is already detailed enough, go straight to spec_ready.
- Always include "assumptions" to show what you decided without asking.
- The spec should be COMPLETE enough for an architect to design the database and APIs from it.`;

export async function pmAgentNode(state) {
  console.log("\n🤖 [PM Agent] Analyzing requirement...\n");

  let userPrompt;

  if (state.pmConversation.length === 0) {
    userPrompt = `User's project requirement:\n"${state.userRequirement}"`;
  } else {
    userPrompt = `Original requirement:\n"${state.userRequirement}"\n\n`;
    userPrompt += `Conversation so far:\n`;
    for (const entry of state.pmConversation) {
      if (entry.role === "pm") {
        userPrompt += `PM Questions: ${JSON.stringify(entry.questions)}\n`;
      } else if (entry.role === "user") {
        userPrompt += `User Answers: ${entry.answers}\n`;
      }
    }
    userPrompt += `\nNow generate the FINAL spec incorporating all the user's answers. Return status: "spec_ready".`;
  }

  const result = await callGemini({
    systemPrompt: PM_SYSTEM_PROMPT,
    userPrompt,
    agentName: "pmAgent",
    currentCost: state.tokenUsage?.estimatedCost || 0,
    tokenBudget: state.tokenBudget,
  });

  const response = result.parsed;
  const tokenDelta = makeTokenDelta("pmAgent", result.tokens);

  if (response.status === "needs_clarification") {
    console.log("❓ [PM Agent] Need more info. Questions:");
    response.questions.forEach((q, i) => console.log(`   ${i + 1}. ${q}`));
    if (response.assumptions?.length) {
      console.log("\n   📌 Assumptions made:");
      response.assumptions.forEach((a) => console.log(`   - ${a}`));
    }

    return {
      pmStatus: "needs_clarification",
      pmQuestions: response.questions,
      pmConversation: [
        { role: "pm", questions: response.questions, assumptions: response.assumptions || [] },
      ],
      tokenUsage: tokenDelta,
      currentPhase: "pm",
    };
  }

  if (response.status === "spec_ready") {
    console.log("✅ [PM Agent] Spec ready!");
    console.log(`   App: ${response.spec.appName}`);
    console.log(`   Features: ${response.spec.features?.length || 0}`);
    console.log(`   Pages: ${response.spec.pages?.length || 0}`);
    console.log(`   DB: ${response.spec.databaseRecommendation}`);

    return {
      pmStatus: "spec_ready",
      clarifiedSpec: response.spec,
      pmConversation: [{ role: "pm", spec: response.spec }],
      tokenUsage: tokenDelta,
      currentPhase: "architect",
    };
  }

  return {
    pmStatus: "spec_ready",
    clarifiedSpec: response.spec || response,
    tokenUsage: tokenDelta,
    currentPhase: "architect",
  };
}

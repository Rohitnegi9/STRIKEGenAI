/**
 * gemini.js — Gemini API Wrapper (Fixed Token Tracking)
 * 
 * DESIGN CHANGE:
 * Old approach: Agent passes tokenUsage object → callGemini mutates it → agent returns it
 * Problem: LangGraph reducer merges old + new, causing exponential duplication.
 * 
 * New approach: callGemini returns token info. 
 * Agent builds a DELTA object (only new data) and returns it.
 * Reducer adds delta to existing state. No duplication possible.
 */

import { GoogleGenAI } from "@google/genai";

let aiClient = null;

export function initGemini(apiKey) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required. Get one from https://aistudio.google.com/apikey");
  }
  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

export function getClient() {
  if (!aiClient) throw new Error("Gemini not initialized. Call initGemini(apiKey) first.");
  return aiClient;
}

/**
 * Core LLM call — returns parsed JSON + token info
 * 
 * Does NOT mutate any external state. Returns everything the caller needs
 * to build its own state update.
 * 
 * @returns {object} { parsed, raw, tokens: {input, output, cost} }
 */
export async function callGemini({
  systemPrompt,
  userPrompt,
  agentName = "unknown",
  currentCost = 0,
  tokenBudget = 2.0,
  model = null,
}) {
  const client = getClient();
  const modelName = model || process.env.GEMINI_MODEL || "gemini-2.5-flash";

  // Budget check
  if (currentCost >= tokenBudget) {
    throw new Error(
      `TOKEN_BUDGET_EXCEEDED: $${currentCost.toFixed(4)} >= budget $${tokenBudget}`
    );
  }

  const fullPrompt = `${systemPrompt}\n\n---\n\nINPUT:\n${userPrompt}\n\n---\n\nIMPORTANT: Respond with ONLY valid JSON. No markdown, no backticks, no explanation outside JSON.`;

  let lastError = null;
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text || "";

      // Use actual token counts from API response if available, otherwise estimate
      const usageMetadata = response.usageMetadata;
      const inputTokens = usageMetadata?.promptTokenCount || Math.ceil(fullPrompt.length / 4);
      const outputTokens = usageMetadata?.candidatesTokenCount || Math.ceil(rawText.length / 4);

      // Gemini 2.5 Flash: $0.15/1M input, $0.60/1M output
      const cost = (inputTokens / 1_000_000) * 0.15 + (outputTokens / 1_000_000) * 0.60;

      // Parse JSON
      let parsed;
      try {
        let cleanText = rawText.trim();
        if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        parsed = JSON.parse(cleanText);
      } catch (parseError) {
        console.error(`[${agentName}] JSON parse failed (attempt ${attempt}):`, rawText.slice(0, 200));
        if (attempt === MAX_RETRIES) {
          throw new Error(`JSON_PARSE_FAILED after ${MAX_RETRIES} attempts.`);
        }
        lastError = parseError;
        continue;
      }

      return {
        parsed,
        raw: rawText,
        tokens: { input: inputTokens, output: outputTokens, cost },
      };

    } catch (error) {
      lastError = error;
      if (error.message?.includes("TOKEN_BUDGET_EXCEEDED")) throw error;
      if (attempt === MAX_RETRIES) throw error;

      const waitMs = Math.pow(2, attempt) * 1000;
      console.warn(`[${agentName}] Attempt ${attempt} failed: ${error.message}. Retrying in ${waitMs}ms...`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  throw lastError;
}

/**
 * Helper: build tokenUsage delta from a single callGemini result
 * 
 * This is what agents return to the state reducer.
 * The reducer ADDS this to existing state — no duplication.
 */
export function makeTokenDelta(agentName, tokens) {
  return {
    newCalls: [{
      agent: agentName,
      inputTokens: tokens.input,
      outputTokens: tokens.output,
      timestamp: Date.now(),
    }],
    addedInput: tokens.input,
    addedOutput: tokens.output,
    addedCost: tokens.cost,
  };
}

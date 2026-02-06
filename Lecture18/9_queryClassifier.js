// =====================================================================
// 9_queryClassifier.js — IS THIS FACTUAL OR SIMILARITY?
// =====================================================================
//
// Before doing anything, ask: "What type of query is this?"
//
// FACTUAL → "Movies directed by Nolan"    → uses Neo4j (graph)
// SIMILARITY → "Movies like Inception"    → uses Pinecone (vectors) + Neo4j
// =====================================================================

import { llm } from "./2_config.js";

const CLASSIFIER_PROMPT = `You are a query classifier for a movie knowledge graph.

Classify the query as:
1. "factual" — asks for specific lists, counts, or graph relationships
   Examples: "Movies directed by Nolan", "Actors who won Oscar", "How many sci-fi movies?"
   
2. "similarity" — asks for recommendations or similar items
   Examples: "Movies like Inception", "Recommend sci-fi movies", "Something similar to thriller"

3. "descriptive" — asks about an entity (who, what, tell me about)
   Examples: "Who is James Cameron?", "Tell me about Inception", "What is The Godfather about?"

Respond ONLY with JSON: {"type": "factual" or "similarity" or "descriptive", "reasoning": "one sentence"}
No markdown, no backticks.`;

async function classifyQuery(query) {
  const response = await llm.invoke([
    { role: "system", content: CLASSIFIER_PROMPT },
    { role: "human", content: query },
  ]);

  let raw = response.content;
  // Gemini 2.5 thinking models return array: [{type:"thinking",...}, {type:"text", text:"..."}]
  if (Array.isArray(raw)) {
    raw = raw
      .filter((block) => typeof block === "string" || block.type === "text")
      .map((block) => (typeof block === "string" ? block : block.text))
      .join("\n");
  }
  raw = raw.trim().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn("⚠️ Classification failed, defaulting to factual");
    return { type: "factual", reasoning: "Default fallback" };
  }
}

export { classifyQuery };
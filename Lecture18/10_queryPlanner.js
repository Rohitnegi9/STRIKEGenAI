// =====================================================================
// 10_queryPlanner.js — NATURAL LANGUAGE → JSON COMPOSITION PLAN
// =====================================================================
//
// Gemini understands the question → picks which templates to combine.
// It does NOT write Cypher. It outputs a JSON plan.
//
// Example: "Actors in Oscar-winning movies"
// Plan: [traversal(Actor→Movie), traversal(Movie→Award), filter(Oscar), project(Actor.name)]
// =====================================================================

import { llm } from "./2_config.js";

const PLANNER_PROMPT = `You are a query planner for a movie knowledge graph.

GRAPH SCHEMA:
Nodes: Movie(title,year), Director(name), Actor(name), Genre(name), Theme(name), Award(name,category)
Relationships: Director-DIRECTED->Movie, Actor-ACTED_IN->Movie, Movie-BELONGS_TO->Genre, Movie-EXPLORES->Theme, Movie-WON->Award

OUTPUT a JSON plan using ONLY these step types:

1. "traversal": {"type":"traversal","from":"Label","rel":"RELATIONSHIP","to":"Label"}
2. "filter": {"type":"filter","field":"Label.property","op":"=","value":"some value"}
   Operators: =, <>, >, <, >=, <=, CONTAINS, STARTS WITH
3. "projection": {"type":"projection","fields":["Label.property"],"distinct":true/false}
4. "aggregation": {"type":"aggregation","function":"count","field":"Label.property","alias":"name","groupBy":"Label.property"}
5. "sort": {"type":"sort","field":"Label.property","direction":"ASC/DESC"}
6. "limit": {"type":"limit","value":number}

RULES:
- Award.name = type (e.g. "Oscar"), Award.category = category (e.g. "Best Picture")
- Always include a projection or aggregation step
- Output ONLY valid JSON. No markdown, no backticks.

EXAMPLES:

"Movies directed by James Cameron":
{"steps":[
  {"type":"traversal","from":"Director","rel":"DIRECTED","to":"Movie"},
  {"type":"filter","field":"Director.name","op":"=","value":"James Cameron"},
  {"type":"projection","fields":["Movie.title","Movie.year"],"distinct":true}
]}

"How many movies won an Oscar?":
{"steps":[
  {"type":"traversal","from":"Movie","rel":"WON","to":"Award"},
  {"type":"filter","field":"Award.name","op":"=","value":"Oscar"},
  {"type":"aggregation","function":"count","field":"Movie.title","alias":"oscar_movies"}
]}

"Actors in Oscar-winning sci-fi movies":
{"steps":[
  {"type":"traversal","from":"Actor","rel":"ACTED_IN","to":"Movie"},
  {"type":"traversal","from":"Movie","rel":"WON","to":"Award"},
  {"type":"traversal","from":"Movie","rel":"BELONGS_TO","to":"Genre"},
  {"type":"filter","field":"Award.name","op":"=","value":"Oscar"},
  {"type":"filter","field":"Genre.name","op":"=","value":"Sci-Fi"},
  {"type":"projection","fields":["Actor.name"],"distinct":true}
]}`;

async function createQueryPlan(query) {
  const response = await llm.invoke([
    { role: "system", content: PLANNER_PROMPT },
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
    console.error("❌ Failed to parse plan:", raw.substring(0, 300));
    throw new Error("Query planning failed. Please rephrase your question.");
  }
}

export { createQueryPlan };
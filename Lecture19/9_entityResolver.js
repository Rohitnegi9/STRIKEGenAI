// =====================================================================
// 9_entityResolver.js — EXTRACT + RESOLVE ENTITIES
// =====================================================================
//
// THIS RUNS FIRST FOR EVERY QUERY. No exceptions.
//
// WHY?
//   User says "DiCaprio" — is that an Actor? Director? Movie?
//   User says "Nolan" — same question.
//   User says "Inception" — could be Movie, could be Theme.
//   User says "Oscar" — Award? Movie? Actor named Oscar?
//
//   WE DON'T KNOW. Only the graph knows.
//   So we search ALL node types for every entity.
//
// FLOW:
//   Step 1: LLM extracts entity names from the query
//           "Action movies with Tom Hardy" → ["Action", "Tom Hardy"]
//
//   Step 2: For EACH entity, search ALL 6 node types in Neo4j
//           "Tom Hardy" → Actor ✅, Director ❌, Movie ❌, Genre ❌...
//           "Action" → Genre ✅, Actor ❌, Director ❌, Movie ❌...
//
//   Step 3: Return resolved entities with their labels
//           [
//             { name: "Tom Hardy", searchTerm: "Tom Hardy", label: "Actor", nodeName: "Tom Hardy" },
//             { name: "Action", searchTerm: "Action", label: "Genre", nodeName: "Action" }
//           ]
//
// FUZZY MATCHING:
//   User might say "Nolan" but graph has "Christopher Nolan".
//   We use CONTAINS for partial matching.
//   If exact match exists, prefer it over partial match.
// =====================================================================

import { llm, driver } from "./2_config.js";

// All node types in our graph and their searchable properties
const NODE_TYPES = [
  { label: "Movie", property: "title" },
  { label: "Director", property: "name" },
  { label: "Actor", property: "name" },
  { label: "Genre", property: "name" },
  { label: "Theme", property: "name" },
  { label: "Award", property: "name" },
];

// =====================================================================
// Step 1: LLM extracts entity names from query
// =====================================================================
async function extractEntities(query) {
  const response = await llm.invoke([
    {
      role: "system",
      content: `You extract entity names from movie-related queries.

Extract ALL names, titles, and specific terms from the query.
Do NOT extract generic words like "movies", "recommend", "find", "show".
Do NOT extract adjectives like "good", "best", "latest".
DO extract: person names, movie titles, genre names, theme names, award names.

Respond ONLY with a JSON array of strings. No markdown, no backticks.

Examples:
"Movies directed by Christopher Nolan" → ["Christopher Nolan"]
"Action movies with Tom Hardy" → ["Action", "Tom Hardy"]
"How is DiCaprio related to Nolan?" → ["DiCaprio", "Nolan"]
"Tell me about Inception" → ["Inception"]
"Movies like Inception" → ["Inception"]
"Sci-fi movies that won Oscar" → ["Sci-fi", "Oscar"]
"Recommend me a good thriller" → ["thriller"]
"Movies about dreams and reality" → ["dreams", "reality"]`,
    },
    { role: "human", content: query },
  ]);

  let raw = response.content;
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
    console.warn("⚠️ Entity extraction failed, returning empty array");
    return [];
  }
}

// =====================================================================
// Step 2: Resolve ONE entity across ALL node types in Neo4j
// =====================================================================
//
// Search strategy:
//   1. Try EXACT match first (case-insensitive)
//      "Inception" = "Inception" ✅
//
//   2. If no exact match, try CONTAINS (partial match)
//      "Nolan" CONTAINS in "Christopher Nolan" ✅
//
//   3. If multiple matches across labels, return ALL
//      (e.g. "Jordan" could be Actor AND Director)
//
// =====================================================================
async function resolveEntity(entityName) {
  const session = driver.session({ defaultAccessMode: "READ" });
  const matches = [];

  try {
    for (const { label, property } of NODE_TYPES) {
      // First try exact match (case-insensitive)
      const exactResult = await session.run(
        `MATCH (n:${label})
         WHERE toLower(n.${property}) = toLower($name)
         RETURN n.${property} AS nodeName, labels(n)[0] AS label
         LIMIT 5`,
        { name: entityName }
      );

      if (exactResult.records.length > 0) {
        for (const record of exactResult.records) {
          matches.push({
            searchTerm: entityName,
            label: record.get("label"),
            nodeName: record.get("nodeName"),
            matchType: "exact",
          });
        }
        continue; // Got exact match for this label, skip CONTAINS
      }

      // No exact match → try CONTAINS (partial/fuzzy)
      const partialResult = await session.run(
        `MATCH (n:${label})
         WHERE toLower(n.${property}) CONTAINS toLower($name)
         RETURN n.${property} AS nodeName, labels(n)[0] AS label
         LIMIT 5`,
        { name: entityName }
      );

      for (const record of partialResult.records) {
        matches.push({
          searchTerm: entityName,
          label: record.get("label"),
          nodeName: record.get("nodeName"),
          matchType: "partial",
        });
      }
    }
  } finally {
    await session.close();
  }

  // Prefer exact matches over partial
  const exactMatches = matches.filter((m) => m.matchType === "exact");
  if (exactMatches.length > 0) return exactMatches;

  return matches;
}

// =====================================================================
// Main: Extract entities from query → Resolve each in Neo4j
// =====================================================================
//
// Returns:
//   {
//     query: "Action movies with Tom Hardy",
//     entities: [
//       { searchTerm: "Action", label: "Genre", nodeName: "Action", matchType: "exact" },
//       { searchTerm: "Tom Hardy", label: "Actor", nodeName: "Tom Hardy", matchType: "exact" }
//     ],
//     unresolved: []  // entities not found in graph
//   }
// =====================================================================
async function resolveQueryEntities(query) {
  console.log("   🔍 Step 1: Extracting entities from query...");
  const entityNames = await extractEntities(query);
  console.log(`   ✅ Found: [${entityNames.join(", ")}]`);

  if (entityNames.length === 0) {
    return { query, entities: [], unresolved: [] };
  }

  console.log("   🗄️  Step 2: Resolving entities in Neo4j...");
  const resolved = [];
  const unresolved = [];

  for (const name of entityNames) {
    const matches = await resolveEntity(name);

    if (matches.length > 0) {
      for (const match of matches) {
        resolved.push(match);
        console.log(
          `   ✅ "${name}" → ${match.label} (${match.nodeName}) [${match.matchType}]`
        );
      }
    } else {
      unresolved.push(name);
      console.log(`   ❌ "${name}" → not found in graph`);
    }
  }

  return { query, entities: resolved, unresolved };
}

export { resolveQueryEntities, resolveEntity };

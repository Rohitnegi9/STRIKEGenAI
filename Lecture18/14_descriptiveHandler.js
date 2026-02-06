// =====================================================================
// 14_descriptiveHandler.js — DESCRIPTIVE: "Who is X?" / "Tell me about X"
// =====================================================================
//
// Flow:
//   1. Embed the entity name (not the full question)
//   2. Pinecone → top 5 matches (the entity + closely related)
//   3. LLM → synthesize a natural answer from metadata
//
// WHY Pinecone, not Neo4j?
//   Neo4j stores structured relationships: Director→DIRECTED→Movie
//   But it can't answer "who is James Cameron?" because Director node
//   only has {name}. No bio, no description.
//
//   Pinecone metadata has RICH text: title, genres, themes, director,
//   actors — enough to build a descriptive answer.
//
//   "Who is James Cameron?" → search "James Cameron" → find all movies
//   where metadata.director = "James Cameron" → LLM summarizes:
//   "James Cameron is a director known for Titanic, Avatar, Aliens..."
// =====================================================================

import { llm, embedText, pineconeIndex } from "./2_config.js";

/**
 * Extract the entity name from the query.
 * "Who is James Cameron?" → "James Cameron"
 * "Tell me about Inception" → "Inception"
 * "What is The Godfather about?" → "The Godfather"
 */
async function extractEntityName(query) {
  const response = await llm.invoke([
    {
      role: "system",
      content: `Extract the main entity (person, movie, etc.) from the user's query.
Return ONLY the entity name, nothing else.
Examples:
  "Who is James Cameron?" → James Cameron
  "Tell me about Inception" → Inception
  "What genre is The Matrix?" → The Matrix`,
    },
    { role: "human", content: query },
  ]);

  let result = response.content;
  if (Array.isArray(result)) {
    result = result
      .filter((block) => typeof block === "string" || block.type === "text")
      .map((block) => (typeof block === "string" ? block : block.text))
      .join("\n");
  }
  return result.trim();
}

/**
 * Handle descriptive queries like "Who is X?" or "Tell me about X"
 */
async function handleDescriptiveQuery(query) {
  // Step 1: Extract entity name
  const entityName = await extractEntityName(query);
  console.log(`   🔍 Looking up: "${entityName}"`);

  // Step 2: Embed the entity name and search Pinecone
  const queryVector = await embedText(entityName);

  const searchResults = await pineconeIndex.query({
    vector: queryVector,
    topK: 10,
    includeMetadata: true,
  });

  if (!searchResults.matches || searchResults.matches.length === 0) {
    return `I couldn't find any information about "${entityName}" in the movie database.`;
  }

  // Step 3: Build context from Pinecone metadata
  // Each match has: title, year, director, genres, themes, actors
  const context = searchResults.matches.map((m) => ({
    title: m.metadata.title,
    year: m.metadata.year,
    director: m.metadata.director,
    genres: m.metadata.genres,
    themes: m.metadata.themes,
    actors: m.metadata.actors,
    score: m.score.toFixed(3),
  }));

  console.log(`   ✅ Found ${context.length} related entries`);

  // Step 4: LLM synthesizes a natural answer
  const prompt = `You are a movie expert.

The user asked: "${query}"

Here is relevant data from our movie database:
${JSON.stringify(context, null, 2)}

Using ONLY the data above, provide a clear and informative answer.
If the entity appears as a director, actor, or in movie metadata — describe their work.
Do NOT mention databases, scores, vectors, or technical terms.
If the data doesn't contain enough info, say so honestly.`;

  const response = await llm.invoke([{ role: "human", content: prompt }]);

  let answer = response.content;
  if (Array.isArray(answer)) {
    answer = answer
      .filter((block) => typeof block === "string" || block.type === "text")
      .map((block) => (typeof block === "string" ? block : block.text))
      .join("\n");
  }
  return answer.trim();
}

export { handleDescriptiveQuery };
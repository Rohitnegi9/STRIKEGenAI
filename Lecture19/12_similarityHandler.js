// =====================================================================
// 12_similarityHandler.js — SIMILARITY: Pinecone + Neo4j + LLM
// =====================================================================
//
// FLOW:
//   Step 1: From resolved entities, find the Movie (already resolved!)
//   Step 2: Embed movie name → Pinecone → top 50 candidates
//   Step 3: Neo4j → get source movie's genres
//   Step 4: Extract movie names from top 50 chunks
//   Step 5: Neo4j → which of those 50 share the same genres?
//   Step 6: LLM → pick top 10 from genre-matched list
//
// WHY resolved entities help:
//   "Movies like Inception" → entity resolver already confirmed
//   Inception = Movie "Inception" in the graph. No extra LLM call needed.
// =====================================================================

import { llm, embedText, pineconeIndex, driver } from "./2_config.js";

/**
 * Extract movie title from a raw chunk text.
 * Looks for "Movie Title: XYZ" pattern in the chunk.
 */
function extractTitleFromChunk(chunkText) {
  const match = chunkText.match(/Movie Title:\s*(.+)/i);
  return match ? match[1].trim() : null;
}

/**
 * Neo4j: Get genres of a specific movie.
 */
async function getMovieGenres(movieTitle) {
  const session = driver.session({ defaultAccessMode: "READ" });
  try {
    const result = await session.run(
      `MATCH (m:Movie)-[:BELONGS_TO]->(g:Genre)
       WHERE m.title = $title
       RETURN g.name AS genre`,
      { title: movieTitle }
    );
    return result.records.map((r) => r.get("genre"));
  } finally {
    await session.close();
  }
}

/**
 * Neo4j: Get themes of a specific movie.
 */
async function getMovieThemes(movieTitle) {
  const session = driver.session({ defaultAccessMode: "READ" });
  try {
    const result = await session.run(
      `MATCH (m:Movie)-[:EXPLORES]->(t:Theme)
       WHERE m.title = $title
       RETURN t.name AS theme`,
      { title: movieTitle }
    );
    return result.records.map((r) => r.get("theme"));
  } finally {
    await session.close();
  }
}

/**
 * Neo4j: From a list of movie titles, find which ones share
 * at least one genre with the source genres.
 */
async function filterByGenre(movieTitles, sourceGenres) {
  const session = driver.session({ defaultAccessMode: "READ" });
  try {
    const result = await session.run(
      `MATCH (m:Movie)-[:BELONGS_TO]->(g:Genre)
       WHERE m.title IN $titles
       WITH m, collect(g.name) AS genres
       WHERE any(genre IN genres WHERE genre IN $sourceGenres)
       RETURN m.title AS title, genres`,
      { titles: movieTitles, sourceGenres }
    );
    return result.records.map((r) => ({
      title: r.get("title"),
      genres: r.get("genres"),
    }));
  } finally {
    await session.close();
  }
}

/**
 * Main similarity handler.
 * Receives resolved entities from the universal flow.
 */
async function handleSimilarityQuery(query, resolvedEntities) {
  // ── Step 1: Find the source movie from resolved entities ──
  // Entity resolver already searched Neo4j, so we know exactly what it is
  const movieEntity = resolvedEntities.entities.find(
    (e) => e.label === "Movie"
  );

  if (!movieEntity) {
    // No movie found in resolved entities → fallback to pure vector search
    console.log("   ⚠️ No movie entity resolved. Falling back to vector search...");
    return await fallbackVectorSearch(query);
  }

  const movieName = movieEntity.nodeName;
  console.log(`   🎬 Finding movies similar to: "${movieName}"`);

  // ── Step 2: Pinecone → top 50 candidates ──
  console.log("   📐 Searching Pinecone (top 50)...");
  const queryVector = await embedText(movieName);

  const searchResults = await pineconeIndex.query({
    vector: queryVector,
    topK: 50,
    includeMetadata: true,
  });

  if (!searchResults.matches || searchResults.matches.length === 0) {
    return "I couldn't find any similar movies.";
  }

  console.log(`   ✅ Got ${searchResults.matches.length} candidates from Pinecone`);

  // ── Step 3: Neo4j → get source movie's genres & themes ──
  console.log("   🗄️  Getting source movie genres from Neo4j...");
  const sourceGenres = await getMovieGenres(movieName);
  const sourceThemes = await getMovieThemes(movieName);
  console.log(`   ✅ Genres: [${sourceGenres.join(", ")}]`);
  console.log(`   ✅ Themes: [${sourceThemes.join(", ")}]`);

  if (sourceGenres.length === 0) {
    console.warn(`   ⚠️ No genres found for "${movieName}". Using vector results only.`);
    return await fallbackVectorSearch(query);
  }

  // ── Step 4: Extract movie names from top 50 chunks ──
  const candidateTitles = [];
  const chunkMap = {}; // title → chunk text

  for (const match of searchResults.matches) {
    const title = extractTitleFromChunk(match.metadata.text);
    if (title && title.toLowerCase() !== movieName.toLowerCase()) {
      candidateTitles.push(title);
      chunkMap[title] = match.metadata.text;
    }
  }

  console.log(`   ✅ Extracted ${candidateTitles.length} movie titles from chunks`);

  // ── Step 5: Neo4j → filter by genre match ──
  console.log("   🗄️  Filtering by genre in Neo4j...");
  const genreMatched = await filterByGenre(candidateTitles, sourceGenres);
  console.log(`   ✅ ${genreMatched.length} movies share at least one genre`);

  if (genreMatched.length === 0) {
    return `I found movies in the database but none share genres with "${movieName}" (${sourceGenres.join(", ")}). Try a broader search.`;
  }

  // ── Step 6: LLM → pick top 10 with reasoning ──
  console.log("   🤖 LLM selecting top 10...");

  const candidateList = genreMatched.map((m) => ({
    title: m.title,
    genres: m.genres.join(", "),
    chunkText: chunkMap[m.title] || "",
  }));

  const prompt = `The user wants movies similar to: "${movieName}"
  - Genres: ${sourceGenres.join(", ")}
  - Themes: ${sourceThemes.join(", ")}

Here are ${candidateList.length} movies that share at least one genre:
${candidateList.map((c) => `- ${c.title} [Genres: ${c.genres}]\n  Info: ${c.chunkText}`).join("\n\n")}

Pick the 10 BEST matches. Rank by:
1. Genre overlap (most important)
2. Theme similarity (from the chunk text)
3. Overall vibe/style match

For each pick, explain in 1-2 sentences WHY it's similar.
Do NOT mention databases, vectors, scores, or technical terms.
Format as a numbered list.`;

  const response = await llm.invoke([
    { role: "system", content: "You are a movie recommendation expert. Respond ONLY with a numbered list of movie recommendations with short explanations. Never respond with JSON." },
    { role: "human", content: prompt },
  ]);
  let answer = response.content;
  if (Array.isArray(answer)) {
    answer = answer
      .filter((block) => typeof block === "string" || block.type === "text")
      .map((block) => (typeof block === "string" ? block : block.text))
      .join("\n");
  }
  return answer.trim();
}

/**
 * Fallback: When no specific movie is resolved.
 * Pure vector search + LLM ranking.
 */
async function fallbackVectorSearch(query) {
  console.log("   📐 Fallback: Pure vector search...");
  const queryVector = await embedText(query);

  const searchResults = await pineconeIndex.query({
    vector: queryVector,
    topK: 20,
    includeMetadata: true,
  });

  if (!searchResults.matches || searchResults.matches.length === 0) {
    return "I couldn't find any matching movies.";
  }

  const candidates = searchResults.matches.map((m) => m.metadata.text);

  const prompt = `The user asked: "${query}"

Here are ${candidates.length} movies from our database:
${candidates.map((text, i) => `--- Movie ${i + 1} ---\n${text}`).join("\n\n")}

Pick the 10 BEST matches for what the user is looking for.
For each pick, explain in 1-2 sentences WHY it fits.
Do NOT mention databases, vectors, or technical terms.
Format as a numbered list.`;

  const response = await llm.invoke([
    { role: "system", content: "You are a movie recommendation expert. Respond ONLY with a numbered list of movie recommendations with short explanations. Never respond with JSON." },
    { role: "human", content: prompt },
  ]);
  let answer = response.content;
  if (Array.isArray(answer)) {
    answer = answer
      .filter((block) => typeof block === "string" || block.type === "text")
      .map((block) => (typeof block === "string" ? block : block.text))
      .join("\n");
  }
  return answer.trim();
}

export { handleSimilarityQuery };
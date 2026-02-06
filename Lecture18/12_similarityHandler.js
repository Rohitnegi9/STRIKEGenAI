// =====================================================================
// 12_similarityHandler.js — SIMILARITY: Pinecone → LLM → Top 10
// =====================================================================
//
// Flow:
//   1. Embed the movie TITLE (not the question) → find the actual movie
//   2. Pinecone → top 50 candidates (wide net)
//      Each result already has metadata: title, genres, themes, director, actors
//      NO Neo4j needed! Everything is in Pinecone metadata.
//   3. LLM → "Inception is Sci-Fi about Dreams. Here are 50 candidates.
//      Pick 10 most relevant and explain WHY."
//
// WHY 50 → 10?
//   Pinecone ranks by vector distance only (mathematical similarity).
//   LLM understands genre, theme, director style (intelligent similarity).
//   Wide net (50) → Smart filter (10) = best results.
//
// WHY no Neo4j here?
//   We already stored genres, themes, director, actors in Pinecone metadata
//   during indexing (6_vectorStore.js). No need to query Neo4j again.
//   Neo4j is for FACTUAL queries (who directed X, count of Y, etc.)
// =====================================================================

import { llm, embedText, pineconeIndex } from "./2_config.js";

/**
 * Extract the movie name from the user's query.
 *
 * User might say:
 *   "Movies similar to Inception"
 *   "Recommend me something like The Dark Knight"
 *   "I liked Interstellar, what else should I watch?"
 *
 * LLM extracts: "Inception", "The Dark Knight", "Interstellar"
 *
 * If no specific movie is mentioned (e.g. "Recommend a thriller"),
 * returns null → we embed the full question instead.
 */
async function extractMovieName(query) {
  const response = await llm.invoke([
    {
      role: "system",
      content: `Extract the movie title from the user's query.
If a specific movie is mentioned, return ONLY the movie title (nothing else).
If no specific movie is mentioned, return exactly: NONE`,
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
  result = result.trim();
  return result === "NONE" ? null : result;
}

/**
 * Handle similarity/recommendation queries.
 *
 * Two modes:
 *   A) "Movies like Inception" → embed Inception's title → find similar
 *   B) "Recommend a thriller"  → embed the question → find matching
 */
async function handleSimilarityQuery(query) {
  // Step 1: Figure out what to embed
  const movieName = await extractMovieName(query);

  let queryVector;
  let sourceMovie = null;

  if (movieName) {
    // Mode A: User mentioned a specific movie
    // Embed the TITLE so Pinecone finds movies similar to THAT movie
    console.log(`   🎬 Looking for movies similar to: "${movieName}"`);
    queryVector = await embedText(movieName);

    // Also fetch the source movie's metadata from Pinecone
    // So LLM knows what genres/themes to compare against
    const movieId = movieName.replace(/\s+/g, "-").toLowerCase();
    try {
      const fetchResult = await pineconeIndex.fetch([movieId]);
      if (fetchResult.records[movieId]) {
        sourceMovie = fetchResult.records[movieId].metadata;
      }
    } catch (e) {
      // Movie not found by ID — that's fine, we'll search by vector
    }

    // If fetch by ID didn't work, the vector search itself will find it
    // and we can use the top result's metadata
  } else {
    // Mode B: No specific movie — embed the full question
    console.log(`   🔍 Searching by description: "${query}"`);
    queryVector = await embedText(query);
  }

  // Step 2: Search Pinecone — get 50 candidates (wide net)
  console.log("   📐 Searching Pinecone (top 50)...");
  const searchResults = await pineconeIndex.query({
    vector: queryVector,
    topK: 50,
    includeMetadata: true,
  });

  if (!searchResults.matches || searchResults.matches.length === 0) {
    return "I couldn't find any similar movies.";
  }

  // Filter out the source movie itself (don't recommend "Inception" for "movies like Inception")
  let candidates = searchResults.matches;
  if (movieName) {
    candidates = candidates.filter(
      (m) => m.metadata.title.toLowerCase() !== movieName.toLowerCase()
    );

    // If we didn't get source movie from fetch, use the closest match
    if (!sourceMovie) {
      const closestMatch = searchResults.matches.find(
        (m) => m.metadata.title.toLowerCase() === movieName.toLowerCase()
      );
      if (closestMatch) sourceMovie = closestMatch.metadata;
    }
  }

  console.log(`   ✅ Got ${candidates.length} candidates`);

  // Step 3: Build candidate list with metadata (already in Pinecone — no Neo4j needed!)
  const candidateList = candidates.map((m) => ({
    title: m.metadata.title,
    year: m.metadata.year,
    director: m.metadata.director,
    genres: m.metadata.genres,
    themes: m.metadata.themes,
    actors: m.metadata.actors,
    score: m.score.toFixed(3),
  }));

  // Step 4: LLM picks top 10 with intelligent reasoning
  console.log("   🤖 LLM selecting top 10...");

  let prompt;

  if (sourceMovie) {
    // Mode A: We know the source movie — compare against it
    prompt = `You are a movie recommendation expert.

The user wants movies similar to: "${sourceMovie.title}" (${sourceMovie.year})
  - Genres: ${sourceMovie.genres}
  - Themes: ${sourceMovie.themes}
  - Director: ${sourceMovie.director}
  - Actors: ${sourceMovie.actors}

Here are ${candidateList.length} candidate movies from our database:
${JSON.stringify(candidateList, null, 2)}

Pick the 10 BEST matches. Rank them by how well they match in:
1. Genre overlap (most important)
2. Theme similarity
3. Same director or actors (bonus)

For each pick, explain in 1-2 sentences WHY it matches.
Do NOT mention scores, vectors, databases, or technical terms.
Format as a numbered list.`;
  } else {
    // Mode B: No source movie — match against the question
    prompt = `You are a movie recommendation expert.

The user asked: "${query}"

Here are ${candidateList.length} candidate movies:
${JSON.stringify(candidateList, null, 2)}

Pick the 10 BEST matches for what the user is looking for.
For each pick, explain in 1-2 sentences WHY it fits.
Do NOT mention scores, vectors, databases, or technical terms.
Format as a numbered list.`;
  }

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

export { handleSimilarityQuery };
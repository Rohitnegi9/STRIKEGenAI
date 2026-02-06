// =====================================================================
// 6_vectorStore.js — STEP 4: Movie Text → Embedding → Pinecone
// =====================================================================
//
// Vector DB stores MEANING, not facts.
// It answers:  "Movies LIKE this" ✅
// It does NOT: "Who directed this?" ❌ (that's Neo4j's job)
//
// How embeddings work:
//   Text → Gemini → [0.3, 0.8, 0.1, ...] (768 numbers)
//   Similar texts → similar numbers → close in space
//
// Each movie becomes one vector with metadata in Pinecone.
// Pinecone index must have: dimensions=768, metric=cosine
// =====================================================================

import { embedTexts, pineconeIndex } from "./2_config.js";

// Create a clean text description for embedding
// Raw PDF text has noise. Clean text embeds better.
function createEmbeddingText(entity) {
  const parts = [
    `${entity.movie.title} is a ${entity.genres.join(", ")} movie released in ${entity.movie.year}.`,
    `Directed by ${entity.director.name}.`,
    `Starring ${entity.actors.join(", ")}.`,
    `The movie explores themes of ${entity.themes.join(", ")}.`,
  ];
  if (entity.awards.length > 0) {
    parts.push(`Awards: ${entity.awards.join(", ")}.`);
  }
  return parts.join(" ");
}

// Store all movie embeddings in Pinecone
async function buildVectorStore(entities) {
  console.log(`\n📐 Building vector store for ${entities.length} movies...\n`);

  const batchSize = 50;

  for (let i = 0; i < entities.length; i += batchSize) {
    const batch = entities.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(entities.length / batchSize);

    console.log(`   📦 Embedding batch ${batchNum}/${totalBatches}...`);

    // Create clean texts
    const texts = batch.map((entity) => createEmbeddingText(entity));

    // Get 768-dim vectors from Gemini
    const vectors = await embedTexts(texts);

    // Prepare Pinecone records
    const records = batch.map((entity, idx) => ({
      id: entity.movie.title.replace(/\s+/g, "-").toLowerCase(),
      values: vectors[idx],
      metadata: {
        title: entity.movie.title,
        year: entity.movie.year,
        director: entity.director.name,
        genres: entity.genres.join(", "),
        themes: entity.themes.join(", "),
        actors: entity.actors.join(", "),
        text: texts[idx],
      },
    }));

    // Upsert (update + insert) to Pinecone
    await pineconeIndex.upsert(records);

    if (i + batchSize < entities.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const stats = await pineconeIndex.describeIndexStats();
  console.log(`\n✅ Vector store built! Total vectors: ${stats.totalRecordCount}`);
}

export { buildVectorStore, createEmbeddingText };

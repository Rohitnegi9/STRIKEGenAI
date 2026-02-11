// =====================================================================
// 1_testConnection.js — RUN THIS FIRST
// =====================================================================
// Command: npm run test
//
// Tests all 4 services. If any fails, fix your .env file.
// =====================================================================

import { driver, pineconeIndex, llm, embedText, closeConnections } from "./2_config.js";

async function testConnections() {
  console.log("🔍 Testing all connections...\n");

  // Test 1: Neo4j
  try {
    const session = driver.session();
    const result = await session.run("RETURN 'Neo4j Connected!' AS message");
    console.log("✅ Neo4j:", result.records[0].get("message"));
    await session.close();
  } catch (err) {
    console.error("❌ Neo4j:", err.message);
  }

  // Test 2: Pinecone
  try {
    const stats = await pineconeIndex.describeIndexStats();
    console.log("✅ Pinecone: Connected | Vectors:", stats.totalRecordCount || 0);
  } catch (err) {
    console.error("❌ Pinecone:", err.message);
  }

  // Test 3: Gemini LLM
  try {
    const response = await llm.invoke("Say 'Gemini Connected!' and nothing else.");
    console.log("✅ Gemini LLM:", response.content.trim());
  } catch (err) {
    console.error("❌ Gemini LLM:", err.message);
  }

  // Test 4: Gemini Embeddings (gemini-embedding-001 → 3072 dimensions)
  try {
    const vector = await embedText("test");
    console.log("✅ Gemini Embeddings (gemini-embedding-001): Dimension =", vector.length);
    if (vector.length !== 3072) {
      console.warn("   ⚠️ Expected 3072 dimensions, got", vector.length);
    }
  } catch (err) {
    console.error("❌ Gemini Embeddings:", err.message);
  }

  await closeConnections();
}

testConnections();

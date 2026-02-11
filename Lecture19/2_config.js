// =====================================================================
// 2_config.js — ALL CONNECTIONS IN ONE PLACE
// =====================================================================
//
// This file sets up 4 connections:
//   1. Neo4j     → Graph Database (stores facts + relationships)
//   2. Pinecone  → Vector Database (stores embeddings for similarity)
//   3. Gemini LLM → Language Model (understands text, creates plans)
//   4. Gemini Embeddings → Converts text to 768-dim vectors
//
// Every other file imports from THIS file.
// If a key changes, you change it in ONE place.
// =====================================================================

import dotenv from "dotenv";
import neo4j from "neo4j-driver";
import { Pinecone } from "@pinecone-database/pinecone";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";

// Load .env file → puts values into process.env
dotenv.config();

// =====================================================================
// 1. NEO4J
// =====================================================================
// neo4j.driver() creates a connection pool (not single connection)
// neo4j+s:// = Bolt protocol with TLS (required for Aura cloud)
// =====================================================================
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// =====================================================================
// 2. PINECONE
// =====================================================================
// Pinecone() = the client
// pinecone.index() = points to one specific index (like a table)
// =====================================================================
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);

// =====================================================================
// 3. GEMINI LLM (via LangChain)
// =====================================================================
// Used for: entity extraction, query classification, planning, response
// temperature: 0 = deterministic (same input → same output every time)
// gemini-2.5-flash = fast, cheap, great for structured JSON output
// =====================================================================
// WHY gemini-2.5-flash?
// Paid tier has high limits (1000+ RPM). No need for older models.
// 2.5-flash = better quality + fast + cheap on paid tier.
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0,
});

// =====================================================================
// 4. GOOGLE GENAI SDK (needed for embeddings + PDF file uploads)
// =====================================================================
// Must be initialized BEFORE embedText/embedTexts functions below.
// Used by: embeddings (this file), PDF upload (4_entityExtractor.js)
// =====================================================================
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// =====================================================================
// 5. GEMINI EMBEDDINGS (via @google/genai SDK)
// =====================================================================
// text-embedding-004 → SHUT DOWN Jan 14, 2026. Dead.
// gemini-embedding-001 → only model alive. 3072 dimensions default.
//
// Pinecone free tier limit = 2GB storage (NOT dimension limit!)
// 1000 movies × 3072 dims × 4 bytes = ~12MB → fits easily in 2GB
//
// So we use FULL 3072 dimensions — no reduction needed!
// Better quality than 768, and Pinecone handles it fine.
//
// WHY @google/genai SDK instead of LangChain?
// LangChain's GoogleGenerativeAIEmbeddings has a bug —
// it ignores outputDimensionality param. But since we're using
// full 3072 (default), this doesn't matter. We use SDK anyway
// because it's simpler and we already need it for PDF file uploads.
// =====================================================================

// Embed ONE text → returns 3072-dim vector
async function embedText(text) {
  const response = await genai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });
  // response.embeddings is an ARRAY (even for single text)
  // Each element has .values (the actual vector)
  return response.embeddings[0].values;
}

// Embed MULTIPLE texts → returns array of 3072-dim vectors
async function embedTexts(texts) {
  const response = await genai.models.embedContent({
    model: "gemini-embedding-001",
    contents: texts,
  });
  return response.embeddings.map((e) => e.values);
}

// Close all connections when done
async function closeConnections() {
  await driver.close();
  console.log("✅ All connections closed.");
}

export { driver, pinecone, pineconeIndex, llm, genai, embedText, embedTexts, closeConnections };

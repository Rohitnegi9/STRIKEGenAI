// =====================================================================
// 13_runQuery.js — INTERACTIVE QUERY CLI
// =====================================================================
// Command: npm run query
//
// Type a question → system classifies → routes → answers
// Type "exit" to quit
// =====================================================================

import readline from "readline";
import { classifyQuery } from "./9_queryClassifier.js";
import { handleFactualQuery } from "./11_factualHandler.js";
import { handleSimilarityQuery } from "./12_similarityHandler.js";
import { handleDescriptiveQuery } from "./14_descriptiveHandler.js";
import { closeConnections } from "./2_config.js";

async function processQuery(query) {
  console.log("\n─────────────────────────────────────────");

  // Step 1: Classify
  console.log("🧠 Classifying query...");
  const classification = await classifyQuery(query);
  console.log(`   Type: ${classification.type} | Reason: ${classification.reasoning}`);

  // Step 2: Route to correct handler
  let answer;
  if (classification.type === "similarity") {
    console.log("\n📐 → SIMILARITY handler (Pinecone)...");
    answer = await handleSimilarityQuery(query);
  } else if (classification.type === "descriptive") {
    console.log("\n📖 → DESCRIPTIVE handler (Pinecone)...");
    answer = await handleDescriptiveQuery(query);
  } else {
    console.log("\n🔒 → FACTUAL handler (Templates → Neo4j)...");
    answer = await handleFactualQuery(query);
  }

  console.log("\n─────────────────────────────────────────");
  console.log("💬 Answer:\n");
  console.log(answer);
  console.log("\n─────────────────────────────────────────");
}

async function startCLI() {
  console.log("===========================================");
  console.log("   🎬 GraphRAG Movie Query System");
  console.log("===========================================");
  console.log('Type your question. Type "exit" to quit.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = () => {
    rl.question("🎬 You: ", async (input) => {
      const query = input.trim();

      if (query.toLowerCase() === "exit") {
        console.log("\n👋 Goodbye!");
        rl.close();
        await closeConnections();
        process.exit(0);
      }

      if (!query) { ask(); return; }

      try {
        await processQuery(query);
      } catch (err) {
        console.error("\n❌ Error:", err.message);
      }

      ask();
    });
  };

  ask();
}

startCLI();
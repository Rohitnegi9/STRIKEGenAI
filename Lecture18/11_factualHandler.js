// =====================================================================
// 11_factualHandler.js — FACTUAL QUERY: Plan → Cypher → Neo4j → Answer
// =====================================================================
//
// Flow:
// 1. User question → Gemini → JSON plan
// 2. JSON plan → Template system → safe Cypher
// 3. Safe Cypher → Neo4j (READ ONLY) → raw data
// 4. Raw data → Gemini → natural language answer
// =====================================================================

import { driver, llm } from "./2_config.js";
import { createQueryPlan } from "./10_queryPlanner.js";
import { buildCypher } from "./8_cypherTemplates.js";

async function handleFactualQuery(query) {
  // Step 1: Gemini creates a plan
  console.log("   📋 Creating query plan...");
  const plan = await createQueryPlan(query);
  console.log("   📋 Plan:", JSON.stringify(plan, null, 2));

  // Step 2: Template system builds safe Cypher
  console.log("   🔒 Building safe Cypher...");
  const { cypher, params } = buildCypher(plan);
  console.log("   🔒 Cypher:", cypher);
  console.log("   🔒 Params:", params);

  // Step 3: Execute on Neo4j (READ mode — extra safety)
  console.log("   🗄️  Querying Neo4j...");
  const session = driver.session({ defaultAccessMode: "READ" });

  let records;
  try {
    const result = await session.run(cypher, params);
    records = result.records.map((record) => {
      const obj = {};
      record.keys.forEach((key) => {
        const value = record.get(key);
        obj[key] = typeof value === "object" && value?.toNumber
          ? value.toNumber()
          : value;
      });
      return obj;
    });
  } finally {
    await session.close();
  }

  console.log(`   🗄️  Got ${records.length} results`);

  // Step 4: Gemini formats the answer
  if (records.length === 0) {
    return "I couldn't find any results for that query in the movie database.";
  }

  const responsePrompt = `You are a helpful movie assistant.
Given the question and database results, provide a clear, natural language answer.
Do NOT mention databases, Cypher, JSON, or technical details.
Do NOT return any JSON. Only return plain English text.

Question: ${query}

Database Results:
${JSON.stringify(records.slice(0, 50), null, 2)}
${records.length > 50 ? `\n... and ${records.length - 50} more results` : ""}`;

  const response = await llm.invoke([{ role: "human", content: responsePrompt }]);

  // LangChain with thinking models may return array of blocks or string
  let answer = response.content;
  if (Array.isArray(answer)) {
    // Filter out thinking blocks, keep only text blocks
    answer = answer
      .filter((block) => typeof block === "string" || block.type === "text")
      .map((block) => (typeof block === "string" ? block : block.text))
      .join("\n");
  }
  return answer.trim();
}

export { handleFactualQuery };
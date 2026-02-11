// =====================================================================
// 11_graphHandler.js — UNIFIED GRAPH QUERY HANDLER
// =====================================================================
//
// Handles ALL graph queries: factual, descriptive, relationship.
// They're all just "traverse the graph around resolved entities."
//
// HOW IT WORKS:
//   1. Takes the user query + resolved entities (from 9_entityResolver.js)
//   2. LLM creates a query plan (JSON steps)
//      - But NOW the LLM already knows what each entity IS
//      - "Nolan" is already resolved to Director "Christopher Nolan"
//      - No guessing, no assumptions
//   3. Template system validates + builds safe Cypher
//   4. Execute on Neo4j (READ-ONLY)
//   5. LLM formats the answer
//
// WHAT QUERIES DOES THIS HANDLE?
//
//   Factual:
//     "Movies directed by Nolan" → traversal + filter
//     "How many sci-fi movies?" → traversal + aggregation
//     "Action movies with Tom Hardy" → multi-traversal + filter
//
//   Descriptive:
//     "Tell me about Inception" → get ALL relationships around entity
//     "Who is Christopher Nolan?" → get all relationships around entity
//
//   Relationship:
//     "How is DiCaprio related to Nolan?" → path between two entities
//
// =====================================================================

import { driver, llm } from "./2_config.js";
import { buildCypher } from "./8_cypherTemplates.js";

// =====================================================================
// Step 1: LLM creates query plan WITH resolved entity context
// =====================================================================
async function createQueryPlan(query, resolvedEntities) {
  // Build entity context so LLM knows exactly what each entity is
  const entityContext = resolvedEntities.entities
    .map((e) => `"${e.searchTerm}" = ${e.label} (exact name in DB: "${e.nodeName}")`)
    .join("\n");

  const unresolvedContext = resolvedEntities.unresolved.length > 0
    ? `\nNOT FOUND in database: ${resolvedEntities.unresolved.join(", ")}`
    : "";

  const prompt = `You are a query planner for a movie knowledge graph.

RESOLVED ENTITIES (already verified in the database):
${entityContext}${unresolvedContext}

IMPORTANT: Use the exact "nodeName" values from above in filter values.
For example, if entity resolved to Director "Christopher Nolan", use "Christopher Nolan" not "Nolan".

GRAPH SCHEMA:
Nodes: Movie(title,year), Director(name), Actor(name), Genre(name), Theme(name), Award(name,category)
Relationships: Director-[:DIRECTED]->Movie, Actor-[:ACTED_IN]->Movie, Movie-[:BELONGS_TO]->Genre, Movie-[:EXPLORES]->Theme, Movie-[:WON]->Award

OUTPUT a JSON plan using ONLY these step types:

1. "traversal": {"type":"traversal","from":"Label","rel":"RELATIONSHIP","to":"Label"}
2. "filter": {"type":"filter","field":"Label.property","op":"=","value":"some value"}
   Operators: =, <>, >, <, >=, <=, CONTAINS, STARTS WITH
3. "projection": {"type":"projection","fields":["Label.property"],"distinct":true/false}
4. "aggregation": {"type":"aggregation","function":"count","field":"Label.property","alias":"name","groupBy":"Label.property"}
5. "sort": {"type":"sort","field":"Label.property","direction":"ASC/DESC"}
6. "limit": {"type":"limit","value":number}
7. "describe": {"type":"describe","label":"Label","name":"exact node name"}
   → Use this when the user asks "tell me about X" or "who is X" — fetches ALL relationships around that entity
8. "path": {"type":"path","fromLabel":"Label","fromName":"name","toLabel":"Label","toName":"name"}
   → Use this when asking how two entities are related — finds the shortest connection

RULES:
- Award.name = award type (e.g. "Oscar"), Award.category = specific category (e.g. "Best Picture")
- Always include a projection or aggregation step (unless using describe or path)
- Use EXACT node names from the resolved entities above
- Output ONLY valid JSON. No markdown, no backticks.

EXAMPLES:

"Movies directed by Christopher Nolan" (Nolan resolved as Director "Christopher Nolan"):
{"steps":[
  {"type":"traversal","from":"Director","rel":"DIRECTED","to":"Movie"},
  {"type":"filter","field":"Director.name","op":"=","value":"Christopher Nolan"},
  {"type":"projection","fields":["Movie.title","Movie.year"],"distinct":true}
]}

"Action movies with Tom Hardy" (Action resolved as Genre, Tom Hardy as Actor):
{"steps":[
  {"type":"traversal","from":"Actor","rel":"ACTED_IN","to":"Movie"},
  {"type":"traversal","from":"Movie","rel":"BELONGS_TO","to":"Genre"},
  {"type":"filter","field":"Actor.name","op":"=","value":"Tom Hardy"},
  {"type":"filter","field":"Genre.name","op":"=","value":"Action"},
  {"type":"projection","fields":["Movie.title","Movie.year"],"distinct":true}
]}

"Tell me about Inception" (Inception resolved as Movie "Inception"):
{"steps":[
  {"type":"describe","label":"Movie","name":"Inception"}
]}

"Who is Christopher Nolan?" (Nolan resolved as Director "Christopher Nolan"):
{"steps":[
  {"type":"describe","label":"Director","name":"Christopher Nolan"}
]}

"How is Leonardo DiCaprio related to Christopher Nolan?" (DiCaprio = Actor, Nolan = Director):
{"steps":[
  {"type":"path","fromLabel":"Actor","fromName":"Leonardo DiCaprio","toLabel":"Director","toName":"Christopher Nolan"}
]}

"How many sci-fi movies?" (Sci-fi resolved as Genre "Sci-Fi"):
{"steps":[
  {"type":"traversal","from":"Movie","rel":"BELONGS_TO","to":"Genre"},
  {"type":"filter","field":"Genre.name","op":"=","value":"Sci-Fi"},
  {"type":"aggregation","function":"count","field":"Movie.title","alias":"total_scifi_movies"}
]}`;

  const response = await llm.invoke([
    { role: "system", content: prompt },
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
    console.error("❌ Failed to parse plan:", raw.substring(0, 300));
    throw new Error("Query planning failed. Please rephrase your question.");
  }
}

// =====================================================================
// DESCRIBE: Get ALL relationships around an entity
// =====================================================================
// "Tell me about Inception" → Movie "Inception"
//   → who directed it?
//   → who acted in it?
//   → what genres?
//   → what themes?
//   → what awards?
//
// "Who is Christopher Nolan?" → Director "Christopher Nolan"
//   → what movies did he direct?
//   → what genres are those movies?
//   → what awards did those movies win?
// =====================================================================
async function executeDescribe(label, name) {
  const session = driver.session({ defaultAccessMode: "READ" });

  try {
    // Different queries depending on entity type
    // We fetch ALL connected information
    let cypher;
    let params = { name };

    switch (label) {
      case "Movie":
        cypher = `
          MATCH (m:Movie {title: $name})
          OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
          OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)
          OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
          OPTIONAL MATCH (m)-[:EXPLORES]->(t:Theme)
          OPTIONAL MATCH (m)-[:WON]->(aw:Award)
          RETURN m.title AS title, m.year AS year,
                 collect(DISTINCT d.name) AS directors,
                 collect(DISTINCT a.name) AS actors,
                 collect(DISTINCT g.name) AS genres,
                 collect(DISTINCT t.name) AS themes,
                 collect(DISTINCT {name: aw.name, category: aw.category}) AS awards`;
        break;

      case "Director":
        cypher = `
          MATCH (d:Director {name: $name})-[:DIRECTED]->(m:Movie)
          OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
          OPTIONAL MATCH (m)-[:EXPLORES]->(t:Theme)
          OPTIONAL MATCH (m)-[:WON]->(aw:Award)
          OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)
          RETURN d.name AS name,
                 collect(DISTINCT {title: m.title, year: m.year}) AS movies,
                 collect(DISTINCT g.name) AS genres,
                 collect(DISTINCT t.name) AS themes,
                 collect(DISTINCT a.name) AS collaborators,
                 collect(DISTINCT {name: aw.name, category: aw.category}) AS awards`;
        break;

      case "Actor":
        cypher = `
          MATCH (a:Actor {name: $name})-[:ACTED_IN]->(m:Movie)
          OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
          OPTIONAL MATCH (m)-[:BELONGS_TO]->(g:Genre)
          OPTIONAL MATCH (m)-[:EXPLORES]->(t:Theme)
          OPTIONAL MATCH (m)-[:WON]->(aw:Award)
          RETURN a.name AS name,
                 collect(DISTINCT {title: m.title, year: m.year}) AS movies,
                 collect(DISTINCT d.name) AS directors,
                 collect(DISTINCT g.name) AS genres,
                 collect(DISTINCT t.name) AS themes,
                 collect(DISTINCT {name: aw.name, category: aw.category}) AS awards`;
        break;

      case "Genre":
        cypher = `
          MATCH (m:Movie)-[:BELONGS_TO]->(g:Genre {name: $name})
          OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
          RETURN g.name AS name,
                 collect(DISTINCT {title: m.title, year: m.year}) AS movies,
                 collect(DISTINCT d.name) AS directors`;
        break;

      case "Theme":
        cypher = `
          MATCH (m:Movie)-[:EXPLORES]->(t:Theme {name: $name})
          OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
          RETURN t.name AS name,
                 collect(DISTINCT {title: m.title, year: m.year}) AS movies,
                 collect(DISTINCT d.name) AS directors`;
        break;

      case "Award":
        cypher = `
          MATCH (m:Movie)-[:WON]->(aw:Award {name: $name})
          OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m)
          RETURN aw.name AS name,
                 collect(DISTINCT {title: m.title, year: m.year, category: aw.category}) AS movies,
                 collect(DISTINCT d.name) AS directors`;
        break;

      default:
        return [{ error: `Unknown label: ${label}` }];
    }

    console.log(`   🔒 Describe Cypher: ${cypher.replace(/\s+/g, " ").trim()}`);

    const result = await session.run(cypher, params);
    return result.records.map((record) => {
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
}

// =====================================================================
// PATH: Find shortest path between two entities
// =====================================================================
// "How is DiCaprio related to Nolan?"
//   → shortestPath(Actor "DiCaprio" ... Director "Nolan")
//   → DiCaprio -[:ACTED_IN]-> Movie <-[:DIRECTED]- Nolan
//
// The path goes through intermediate nodes (usually Movies)
// We return the full path with all nodes and relationships
// =====================================================================
async function executePath(fromLabel, fromName, toLabel, toName) {
  const session = driver.session({ defaultAccessMode: "READ" });

  try {
    const cypher = `
      MATCH (a:${fromLabel} {${fromLabel === "Movie" ? "title" : "name"}: $fromName}),
            (b:${toLabel} {${toLabel === "Movie" ? "title" : "name"}: $toName}),
            path = shortestPath((a)-[*..6]-(b))
      RETURN [node IN nodes(path) | {
        labels: labels(node),
        name: coalesce(node.name, node.title),
        year: node.year
      }] AS pathNodes,
      [rel IN relationships(path) | type(rel)] AS pathRels`;

    console.log(`   🔒 Path Cypher: ${cypher.replace(/\s+/g, " ").trim()}`);

    const result = await session.run(cypher, { fromName, toName });

    if (result.records.length === 0) {
      return [{ error: `No connection found between ${fromName} and ${toName}` }];
    }

    return result.records.map((record) => ({
      pathNodes: record.get("pathNodes"),
      pathRels: record.get("pathRels"),
    }));
  } finally {
    await session.close();
  }
}

// =====================================================================
// Execute template-based Cypher (factual queries)
// =====================================================================
async function executeTemplateCypher(plan) {
  const { cypher, params } = buildCypher(plan);
  console.log(`   🔒 Cypher: ${cypher}`);
  console.log(`   🔒 Params:`, params);

  const session = driver.session({ defaultAccessMode: "READ" });

  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => {
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
}

// =====================================================================
// MAIN: Handle any graph query
// =====================================================================
async function handleGraphQuery(query, resolvedEntities) {
  // Step 1: LLM creates a plan (with resolved entity context)
  console.log("   📋 Creating query plan...");
  const plan = await createQueryPlan(query, resolvedEntities);
  console.log("   📋 Plan:", JSON.stringify(plan, null, 2));

  // Step 2: Execute based on plan type
  let records;
  const firstStep = plan.steps[0];

  if (firstStep.type === "describe") {
    // Descriptive: get all relationships around entity
    console.log(`   🗄️  Describing ${firstStep.label}: "${firstStep.name}"...`);
    records = await executeDescribe(firstStep.label, firstStep.name);
  } else if (firstStep.type === "path") {
    // Relationship: find path between two entities
    console.log(`   🗄️  Finding path: ${firstStep.fromName} → ${firstStep.toName}...`);
    records = await executePath(
      firstStep.fromLabel, firstStep.fromName,
      firstStep.toLabel, firstStep.toName
    );
  } else {
    // Factual: template-based Cypher
    console.log("   🗄️  Querying Neo4j...");
    records = await executeTemplateCypher(plan);
  }

  console.log(`   🗄️  Got ${records.length} results`);

  // Step 3: LLM formats the answer
  if (records.length === 0 || records[0]?.error) {
    const errorMsg = records[0]?.error || "No results found";
    return `I couldn't find an answer: ${errorMsg}`;
  }

  const responsePrompt = `Given the question and database results, provide a clear, natural language answer.
Do NOT mention databases, Cypher, JSON, or technical details.
Do NOT return any JSON. Only return plain English text.
Be informative and thorough — include all relevant details from the results.

Question: ${query}

Database Results:
${JSON.stringify(records.slice(0, 50), null, 2)}
${records.length > 50 ? `\n... and ${records.length - 50} more results` : ""}`;

  const response = await llm.invoke([
    { role: "system", content: "You are a helpful movie assistant. Respond ONLY in plain English text. Never respond with JSON or code." },
    { role: "human", content: responsePrompt },
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

export { handleGraphQuery };
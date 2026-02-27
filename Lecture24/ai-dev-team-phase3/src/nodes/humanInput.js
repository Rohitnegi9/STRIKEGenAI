/**
 * humanInput.js — Human Input Node
 * 
 * FIRST PRINCIPLES:
 * LangGraph is designed for "human-in-the-loop" workflows.
 * When the PM Agent asks questions, we need to pause the graph,
 * get the user's answer, and resume.
 * 
 * In production: this would be a WebSocket/API call.
 * In Phase 1: we use terminal readline for simplicity.
 * 
 * LangGraph supports this natively via `interrupt()` — the graph
 * pauses at this node and resumes when we provide input.
 * For now we handle it manually via a CLI prompt.
 */

import * as readline from "readline";

/**
 * Ask the user a question via terminal and return their answer
 */
function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Human Input node function
 * 
 * Displays PM Agent's questions and collects user's answers.
 * Returns the answers as part of the conversation history.
 */
export async function humanInputNode(state) {
  console.log("\n" + "═".repeat(60));
  console.log("  👤 YOUR INPUT NEEDED");
  console.log("═".repeat(60));
  
  const questions = state.pmQuestions;
  
  if (!questions || questions.length === 0) {
    console.log("  No questions to answer. Moving on...");
    return {};
  }

  console.log("\n  Please answer the PM Agent's questions.\n");
  console.log("  💡 TIP: You can answer all at once, separated by commas,");
  console.log("     or just give a general description.\n");

  // Display all questions
  questions.forEach((q, i) => {
    console.log(`  ${i + 1}. ${q}`);
  });

  console.log("");

  const answer = await askUser("  Your answers: ");

  console.log("\n  ✅ Got it! Sending your answers to the PM Agent...\n");

  return {
    pmConversation: [
      { role: "user", answers: answer },
    ],
    pmStatus: "idle",  // Reset so PM agent processes answers
  };
}

/**
 * setupSandbox.js — Creates complete Docker environment
 * 
 * Passes the Architect's dbSchema to sandboxManager so that:
 * - Database container starts with correct image
 * - Tables are created from the schema
 * - Backend has DATABASE_URL set
 * - Frontend has VITE_API_URL set
 */

import { createSandbox } from "../utils/sandboxManager.js";

export async function setupSandboxNode(state) {
  console.log("\n📦 [Setup Sandbox] Creating project workspace...\n");

  const { folderStructure, dependencies, dbSchema } = state.blueprint;

  try {
    const sandboxId = await createSandbox(folderStructure, dependencies, dbSchema);

    console.log(`\n   ✅ Sandbox created: ${sandboxId}`);
    console.log("   Ready for coding!\n");

    return {
      sandboxId,
      currentPhase: "sandbox",
    };
  } catch (error) {
    console.error(`   ❌ Sandbox creation failed: ${error.message}`);
    return {
      sandboxId: "",
      error: `Sandbox creation failed: ${error.message}`,
    };
  }
}

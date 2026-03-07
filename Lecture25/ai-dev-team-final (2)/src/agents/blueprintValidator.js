/**
 * blueprintValidator.js — Blueprint Cross-Validator ⭐ NEW V2
 * 
 * FIRST PRINCIPLES:
 * In the V1 design, the Architect's output went directly to the Planner.
 * Problem: if the Architect designed an API endpoint for a table that 
 * doesn't exist, the Coder would write broken code 10 steps later.
 * 
 * The Blueprint Validator sits BETWEEN Architect and Planner.
 * Its ONLY job: find contradictions in the blueprint BEFORE 
 * any code is written. Catch problems early = save tokens later.
 * 
 * WHAT IT CHECKS:
 * 1. Every API endpoint references a table that exists in the schema
 * 2. Every frontend page calls APIs that actually exist
 * 3. Every foreign key references an existing table and field
 * 4. Every entity from the spec has at least one DB table
 * 5. Auth/role requirements are consistent (API says "admin only" → page respects that)
 * 6. No orphan tables (table exists but no API uses it)
 * 
 * WHY NOT USE LLM FOR THIS?
 * Validation is deterministic logic — comparing strings, checking existence.
 * Using an LLM here would be wasteful and unreliable. 
 * Pure code = 100% accurate, zero tokens, instant execution.
 * 
 * ROUTING:
 * - Valid → goes to Planner
 * - DB issues → routes back to architectStep2
 * - API issues → routes back to architectStep3
 * - Page issues → routes back to architectStep4
 * - Max 2 validation loops, then force proceed with warnings
 */

const MAX_VALIDATION_CYCLES = 2;

/**
 * Blueprint Validator node function
 */
export async function blueprintValidatorNode(state) {
  console.log("\n🔍 [Blueprint Validator] Cross-validating architecture...\n");

  const { dbSchema, apiEndpoints, frontendPages, entities } = state.blueprint;
  const currentCycles = state.blueprintValidation?.validationCycles || 0;

  const issues = [];

  // ─── CHECK 1: Every entity has a DB table ──────────────────

  if (entities && dbSchema?.tables) {
    const tableNames = new Set();
    for (const t of dbSchema.tables) {
      const name = t.name.toLowerCase();
      tableNames.add(name);                          // "todo_items"
      tableNames.add(name.replace(/s$/, ""));        // "todo_item"
      tableNames.add(name.replace(/_/g, ""));        // "todoitems"
      tableNames.add(name.replace(/_/g, "").replace(/s$/, "")); // "todoitem"
    }

    for (const entity of entities) {
      // Convert PascalCase to snake_case: "TodoItem" → "todo_item"
      const snakeName = entity.name
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .toLowerCase();
      const plainName = entity.name.toLowerCase(); // "todoitem"

      const hasTable = tableNames.has(plainName) ||
                       tableNames.has(plainName + "s") ||
                       tableNames.has(snakeName) ||
                       tableNames.has(snakeName + "s") ||
                       tableNames.has(snakeName.replace(/y$/, "ie") + "s");
      if (!hasTable) {
        issues.push({
          type: "missing_table",
          severity: "error",
          fixTarget: "architectStep2",
          message: `Entity "${entity.name}" has no matching DB table. Tables: [${dbSchema.tables.map(t => t.name).join(", ")}]`,
        });
      }
    }
  }

  // ─── CHECK 2: Foreign keys reference existing tables ───────

  if (dbSchema?.tables) {
    const tableNameSet = new Set(dbSchema.tables.map(t => t.name.toLowerCase()));

    for (const table of dbSchema.tables) {
      if (table.foreignKeys) {
        for (const fk of table.foreignKeys) {
          // Extract table name from "other_table(field)" format
          const refMatch = fk.references?.match(/^(\w+)\(/);
          if (refMatch) {
            const refTable = refMatch[1].toLowerCase();
            if (!tableNameSet.has(refTable)) {
              issues.push({
                type: "invalid_foreign_key",
                severity: "error",
                fixTarget: "architectStep2",
                message: `Table "${table.name}" has FK referencing "${fk.references}" but table "${refTable}" does not exist.`,
              });
            }
          }
        }
      }
    }
  }

  // ─── CHECK 3: API endpoints reference existing tables ──────

  if (apiEndpoints && dbSchema?.tables) {
    const tableNameSet = new Set(dbSchema.tables.map(t => t.name.toLowerCase()));

    for (const endpoint of apiEndpoints) {
      if (endpoint.relatedTable) {
        // relatedTable can be comma-separated: "todo_items, categories"
        const tables = endpoint.relatedTable.split(",").map(t => t.trim().toLowerCase());
        for (const tableName of tables) {
          if (tableName && !tableNameSet.has(tableName)) {
            issues.push({
              type: "orphan_endpoint",
              severity: "error",
              fixTarget: "architectStep3",
              message: `API "${endpoint.method} ${endpoint.path}" references table "${tableName}" which doesn't exist.`,
            });
          }
        }
      }
    }
  }

  // ─── CHECK 4: Frontend pages reference existing APIs ───────

  if (frontendPages && apiEndpoints) {
    const apiPaths = new Set(
      (Array.isArray(apiEndpoints) ? apiEndpoints : []).map(e => e.path?.toLowerCase())
    );

    for (const page of frontendPages) {
      if (page.components) {
        for (const comp of page.components) {
          if (comp.apiCalls) {
            for (const apiCall of comp.apiCalls) {
              // Normalize: remove params like :id
              const normalized = apiCall.toLowerCase().replace(/\/:\w+/g, "/:param");
              const exists = [...apiPaths].some(path => {
                const normPath = path?.replace(/\/:\w+/g, "/:param");
                return normPath === normalized || path === apiCall.toLowerCase();
              });
              if (!exists) {
                issues.push({
                  type: "missing_api",
                  severity: "warning",
                  fixTarget: "architectStep3",
                  message: `Page "${page.name}" → Component "${comp.name}" calls "${apiCall}" but no matching API endpoint exists.`,
                });
              }
            }
          }
        }
      }
    }
  }

  // ─── CHECK 5: Auth consistency ─────────────────────────────

  if (apiEndpoints && frontendPages) {
    const authEndpoints = new Set(
      (Array.isArray(apiEndpoints) ? apiEndpoints : [])
        .filter(e => e.requiresAuth)
        .map(e => e.path?.toLowerCase())
    );

    for (const page of frontendPages) {
      if (page.components) {
        for (const comp of page.components) {
          if (comp.apiCalls) {
            const callsAuthApi = comp.apiCalls.some(c => authEndpoints.has(c.toLowerCase()));
            if (callsAuthApi && !page.requiresAuth) {
              issues.push({
                type: "auth_mismatch",
                severity: "warning",
                fixTarget: "architectStep4",
                message: `Page "${page.name}" calls auth-required API but page.requiresAuth is false.`,
              });
            }
          }
        }
      }
    }
  }

  // ─── CHECK 6: No orphan tables ─────────────────────────────

  if (dbSchema?.tables && apiEndpoints) {
    const referencedTables = new Set(
      (Array.isArray(apiEndpoints) ? apiEndpoints : [])
        .map(e => e.relatedTable?.toLowerCase())
        .filter(Boolean)
    );

    for (const table of dbSchema.tables) {
      // Skip junction/join tables and common system tables
      const name = table.name.toLowerCase();
      const isJunction = name.includes("_") && !["created_at", "updated_at"].some(f => name.includes(f));
      
      if (!referencedTables.has(name) && !isJunction) {
        issues.push({
          type: "orphan_table",
          severity: "warning",
          fixTarget: "architectStep3",
          message: `Table "${table.name}" exists but no API endpoint references it. Either add endpoints or remove the table.`,
        });
      }
    }
  }

  // ─── DECIDE: Valid or route back ───────────────────────────

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");

  if (issues.length === 0) {
    console.log("   ✅ Blueprint is VALID — all cross-checks passed!");
    return {
      blueprintValidation: {
        isValid: true,
        issues: [],
        validationCycles: currentCycles + 1,
      },
      currentPhase: "planner",
    };
  }

  // If we've exceeded max validation cycles, force proceed
  if (currentCycles >= MAX_VALIDATION_CYCLES) {
    console.log(`   ⚠️ Max validation cycles (${MAX_VALIDATION_CYCLES}) reached. Proceeding with warnings.`);
    console.log(`   ${errors.length} errors, ${warnings.length} warnings (unresolved)`);
    issues.forEach(i => console.log(`   ${i.severity === "error" ? "❌" : "⚠️"} ${i.message}`));
    return {
      blueprintValidation: {
        isValid: true, // Force proceed
        issues: issues,
        validationCycles: currentCycles + 1,
      },
      currentPhase: "planner",
    };
  }

  // Route back to the right architect step
  console.log(`   ❌ Found ${errors.length} errors, ${warnings.length} warnings (cycle ${currentCycles + 1}/${MAX_VALIDATION_CYCLES})`);
  issues.forEach(i => console.log(`   ${i.severity === "error" ? "❌" : "⚠️"} ${i.message}`));

  return {
    blueprintValidation: {
      isValid: false,
      issues: issues,
      validationCycles: currentCycles + 1,
    },
  };
}

/**
 * Determine which architect step to route back to based on issues.
 * Used as a conditional edge function.
 */
export function blueprintValidatorRouter(state) {
  const validation = state.blueprintValidation;

  if (validation?.isValid) {
    return "__end__"; // Phase 2 ends here. Phase 3 will route to planner.
  }

  // Find the highest-priority fix target
  const errors = validation?.issues?.filter(i => i.severity === "error") || [];
  
  if (errors.length > 0) {
    // Route to the first error's fix target
    const target = errors[0].fixTarget;
    console.log(`   🔄 Routing back to ${target} for fixes...\n`);
    return target;
  }

  // Only warnings — route to the most common fix target
  const targets = (validation?.issues || []).map(i => i.fixTarget);
  const targetCounts = {};
  targets.forEach(t => { targetCounts[t] = (targetCounts[t] || 0) + 1; });
  const topTarget = Object.entries(targetCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (topTarget) {
    console.log(`   🔄 Routing back to ${topTarget} for fixes...\n`);
    return topTarget;
  }

  return "__end__";
}

/**
 * contextBuilder.js — Smart Context Builder
 * 
 * THREE KEY OPTIMIZATIONS:
 * 1. Interface-only dependencies — send exports/signatures, not full code
 * 2. Filtered schema — only tables relevant to this task
 * 3. Template file — one completed similar file as style reference
 */

import { readFile } from "../utils/sandboxManager.js";

export function contextBuilderNode(state) {
  console.log("\n📦 [Context Builder] Assembling context for Coder...\n");

  const { currentTask, blueprint, fileRegistry, projectPatterns, sandboxId, clarifiedSpec, taskStatuses } = state;

  if (!currentTask) {
    console.log("   ⚠️ No current task");
    return { contextPackage: null };
  }

  const context = {
    task: {
      taskId: currentTask.taskId,
      title: currentTask.title,
      description: currentTask.description,
      filesToCreate: currentTask.filesToCreate || [],
      acceptanceCriteria: currentTask.acceptanceCriteria || [],
    },
    patterns: projectPatterns || {},
    dependencyInterfaces: {},
    dbSchema: null,
    apiEndpoints: null,
    templateFile: null,
    namingMap: null,
    appName: clarifiedSpec?.appName || "app",
    authRequired: clarifiedSpec?.authRequired || false,
  };

  // ─── 1. Interface-only dependencies (with import statements) ─

  const filesNeeded = currentTask.filesNeeded || [];
  for (const filePath of filesNeeded) {
    const registryEntry = (fileRegistry || []).find(f => f.path === filePath);
    if (registryEntry) {
      context.dependencyInterfaces[filePath] = {
        importStatement: registryEntry.importStatement,
        exports: registryEntry.exports,
        interface: registryEntry.interface,
      };
    }
  }

  // ─── 2. Naming map from entities ──────────────────────────

  if (blueprint?.entities) {
    context.namingMap = blueprint.entities.map(e => ({
      entity: e.name,
      tableName: e.tableName,
      apiPath: e.apiPath,
      modelFile: e.modelFile,
      routeFile: e.routeFile,
    }));
  }

  // ─── 3. Filtered DB schema (only relevant tables) ─────────

  const isBackendTask = currentTask.filesToCreate?.some(f => f.includes("backend"));
  if (isBackendTask && blueprint?.dbSchema) {
    // Find which tables this task likely needs
    const taskText = `${currentTask.title} ${currentTask.description}`.toLowerCase();
    const relevantTables = blueprint.dbSchema.tables?.filter(t => {
      const tableName = t.name.toLowerCase();
      const entityName = tableName.replace(/_/g, "").replace(/s$/, "");
      return taskText.includes(tableName) || 
             taskText.includes(entityName) ||
             taskText.includes(tableName.replace(/_/g, " "));
    });

    // If no specific match, include all (setup tasks need everything)
    context.dbSchema = {
      databaseType: blueprint.dbSchema.databaseType,
      tables: relevantTables?.length > 0 ? relevantTables : blueprint.dbSchema.tables,
    };
  }

  // ─── 4. Filtered API endpoints (only relevant ones) ───────

  const isFrontendTask = currentTask.filesToCreate?.some(f => f.includes("frontend"));
  if (isFrontendTask && blueprint?.apiEndpoints) {
    const taskText = `${currentTask.title} ${currentTask.description}`.toLowerCase();
    
    // Find relevant endpoints
    const relevantEndpoints = blueprint.apiEndpoints.filter(e => {
      const pathParts = e.path?.toLowerCase().split("/") || [];
      return pathParts.some(part => taskText.includes(part)) ||
             taskText.includes("auth") && e.path?.includes("auth");
    });

    // If no specific match or auth task, include auth + relevant
    const authEndpoints = blueprint.apiEndpoints.filter(e => e.path?.includes("/auth"));
    const combined = [...new Set([...authEndpoints, ...relevantEndpoints])];
    context.apiEndpoints = combined.length > 0 ? combined : blueprint.apiEndpoints;
  }

  // ─── 5. Template file (completed similar file as reference) ─

  if (fileRegistry?.length > 0) {
    // Find a completed file of same type (model for model, route for route, page for page)
    const targetFile = currentTask.filesToCreate?.[0] || "";
    let templateType = "";
    if (targetFile.includes("models")) templateType = "models";
    else if (targetFile.includes("routes")) templateType = "routes";
    else if (targetFile.includes("pages")) templateType = "pages";
    else if (targetFile.includes("components")) templateType = "components";
    else if (targetFile.includes("middleware")) templateType = "middleware";

    if (templateType) {
      const templateEntry = fileRegistry.find(f => 
        f.path?.includes(templateType) && !currentTask.filesToCreate.includes(f.path)
      );
      if (templateEntry && sandboxId) {
        try {
          const content = readFile(sandboxId, templateEntry.path);
          if (content) {
            // Send first 60 lines as template
            const lines = content.split("\n");
            context.templateFile = {
              path: templateEntry.path,
              content: lines.slice(0, 60).join("\n") + (lines.length > 60 ? "\n// ... (follow this pattern)" : ""),
            };
          }
        } catch (e) { /* skip */ }
      }
    }
  }

  // ─── Estimate and log ─────────────────────────────────────

  const contextStr = JSON.stringify(context);
  const estimatedTokens = Math.ceil(contextStr.length / 4);
  console.log(`   📊 Context size: ~${estimatedTokens} tokens`);
  console.log(`   📄 Files to create: ${context.task.filesToCreate.join(", ")}`);
  console.log(`   🔗 Dependencies: ${Object.keys(context.dependencyInterfaces).length} interfaces`);
  if (context.dbSchema) console.log(`   🗄️  Schema: ${context.dbSchema.tables?.length} tables (filtered)`);
  if (context.apiEndpoints) console.log(`   🔌 APIs: ${context.apiEndpoints.length} endpoints (filtered)`);
  if (context.templateFile) console.log(`   📝 Template: ${context.templateFile.path}`);

  return { contextPackage: context };
}

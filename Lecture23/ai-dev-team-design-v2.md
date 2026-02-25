# AI Software Development Team — Complete System Design Document (V2)

**Project:** AI-Powered Multi-Agent Software Development Team (Like Devin)
**Author:** Rohit (Coder Army) + Claude
**Date:** February 2026
**Status:** Design Phase — Not Yet Implemented
**Version:** 2.0 — With all loophole fixes integrated

---

## What Changed from V1 → V2

| # | Loophole | Fix | New Nodes Added |
|---|----------|-----|-----------------|
| 1 | No state persistence — crash = lose everything | Checkpoint after every node to PostgreSQL/Redis | `checkpoint` (implicit in every node) |
| 2 | No coding pattern consistency across tasks | Extract & inject project patterns after Phase 1 | `patternExtractor` |
| 3 | No rollback — can't undo bad code | Git init + auto-commit after every task, rollback on debug failure | `snapshotManager` |
| 4 | Architect has no self-validation loop | Cross-validate blueprint before planning | `blueprintValidator` |
| 5 | State grows unbounded — token bomb | State selectors per agent, registry compaction | `stateCompactor` |
| 6 | Sequential execution even for independent tasks | Parallel task execution within phases | Modified `selectNextTask` |
| 7 | Force approve after 2 rejections is dangerous | Escalate to task simplification instead | Modified `reviewerAgent` |
| 8 | No cost/token tracking | Token usage tracker with budget limits | `tokenTracker` (implicit in every LLM call) |
| 9 | Feedback loop has no iteration limit | Max 3 iterations + scope drift detection | Modified `feedbackCollector` |
| 10 | Sandbox has no health check | Verify DB, node_modules, ports after setup | `sandboxHealthCheck` |

**Node count: 22 → 30 nodes**

---

## 1. Overview

An autonomous multi-agent system that can understand a software requirement, plan it, write code, debug it, test it, take user feedback, iterate, and deploy — all with minimal human intervention.

**V2 additions:** The system now includes state persistence (survives crashes), rollback capability (undo bad code), blueprint self-validation, coding pattern consistency, token budget management, and scope drift protection.

---

## 2. Tech Stack

| Component         | Technology                         |
|-------------------|------------------------------------|
| Orchestration     | LangGraph (JavaScript)             |
| LLM               | Google Gemini API                  |
| Long-term Memory  | Pinecone Vector Database           |
| Frontend          | React (Vite)                       |
| Backend           | Node.js (Express)                  |
| Database          | PostgreSQL (Neon) OR MongoDB Atlas |
| Code Execution    | Docker (sandbox)                   |
| Deployment        | Vercel + Render + Neon/Atlas       |
| **State Persistence** | **Redis (checkpoint store)**   |
| **Version Control**   | **Git (inside Docker sandbox)**|

**Fixed Stack Decision:** All projects use React + Express + PostgreSQL/MongoDB. This keeps agent prompts focused and code quality high.

**Database Selection Rule:** Architect Agent decides per project:
- PostgreSQL → when data has clear relationships, joins needed, transactions required
- MongoDB → when data is flexible/nested, schema changes often, document-like structure

---

## 3. Agents

| #  | Agent          | Role                                            |
|----|----------------|--------------------------------------------------|
| 1  | PM Agent       | Understands requirement, removes ambiguity       |
| 2  | Architect Agent| Designs system blueprint (DB, APIs, pages, folders)|
| 3  | Planner Agent  | Creates phased, dependency-ordered task plan     |
| 4  | Coder Agent    | Writes code for one task at a time               |
| 5  | Reviewer Agent | Reviews code for bugs, security, integration     |
| 6  | Executor Agent | Runs code in Docker sandbox, captures real output|
| 7  | Debugger Agent | Reads real errors, diagnoses root cause, suggests fix|
| 8  | Deploy Agent   | Generates deployment configs and instructions    |

---

## 4. LangGraph Flow — 30 Nodes

### Node 1: pmAgent
- **Trigger:** User sends project requirement
- **Input:** Raw user message
- **Does:** Analyzes requirement, identifies ambiguity, generates clarifying questions
- **Output:** `{ status: "needs_clarification", questions: [...] }` OR `{ status: "spec_ready", spec: {...} }`
- **Checkpoint:** Saves state after completion
- **Next:** If needs_clarification → humanInput. If spec_ready → architectStep1

### Node 2: humanInput
- **Trigger:** PM Agent has questions
- **Input:** Questions from PM Agent
- **Does:** Sends questions to user, waits for response
- **Output:** User's answers
- **Next:** → pmAgent (generates final spec with answers)

### Node 3: architectStep1
- **Trigger:** Spec ready
- **Input:** Clarified spec
- **Does:** Identifies all entities and their relationships
- **Output:** Entity list with relationships
- **Next:** → architectStep2

### Node 4: architectStep2
- **Trigger:** Entities identified
- **Input:** Entity relationships
- **Does:** Designs complete database schema — tables, fields, types, constraints, foreign keys
- **Output:** DB schema
- **Next:** → architectStep3

### Node 5: architectStep3
- **Trigger:** DB schema ready
- **Input:** DB schema + original spec
- **Does:** Designs all API endpoints — method, path, auth, role access, request/response
- **Output:** API endpoint list
- **Next:** → architectStep4

### Node 6: architectStep4
- **Trigger:** API endpoints ready
- **Input:** API endpoints + spec
- **Does:** Designs frontend pages — routes, components, which API each page calls
- **Output:** Frontend page list
- **Next:** → architectStep5

### Node 7: architectStep5
- **Trigger:** Frontend pages ready
- **Input:** DB schema + API endpoints + frontend pages
- **Does:** Generates folder structure and package.json with exact dependency versions
- **Output:** Complete blueprint
- **Next:** → blueprintValidator *(NEW — was plannerAgent in V1)*

### Node 8: blueprintValidator ⭐ NEW
- **Trigger:** Blueprint complete
- **Input:** Complete blueprint (entities, schema, APIs, pages, folder structure)
- **Does:** Cross-validates the entire blueprint:
  - Every API endpoint has a matching DB query path (no orphan endpoints)
  - Every frontend page has matching API endpoints (no page calls a non-existent API)
  - Every foreign key references an existing table/field
  - Every entity from the spec is covered in the schema
  - No circular dependencies in entity relationships
  - Auth/role requirements are consistent across API and frontend
- **Output:** `{ valid: true }` OR `{ valid: false, issues: [...], fixTarget: "architectStep2" | "architectStep3" | "architectStep4" }`
- **Checkpoint:** Saves state after completion
- **Next:** If valid → plannerAgent. If invalid → routes back to the specific architectStep that needs fixing (with issues as context). Max 2 validation loops then force proceed with warnings logged.

### Node 9: plannerAgent
- **Trigger:** Blueprint validated
- **Input:** Complete validated blueprint
- **Does:** Breaks blueprint into phased, dependency-ordered tasks. Each task specifies files to create, files it depends on (filesNeeded), acceptance criteria, AND marks which tasks within a phase are independent (canParallelize: true).
- **Output:** Phased task queue with parallelization flags
- **Checkpoint:** Saves state after completion
- **Next:** → setupSandbox

**Mandatory Phase Order:**
1. Project Setup + Database + Models
2. Common Middleware + Utilities
3. Backend API Routes
4. Frontend Pages + Components
5. Integration + End-to-End Wiring

### Node 10: setupSandbox
- **Trigger:** Task plan ready
- **Input:** Folder structure + package.json from blueprint
- **Does:** Creates Docker container (with PostgreSQL/MongoDB via Docker Compose), initializes project folder structure, writes package.json, runs npm install, **initializes Git repo (`git init` + initial commit)**
- **Output:** Sandbox ready with sandboxId
- **Next:** → sandboxHealthCheck *(NEW — was selectNextTask in V1)*

### Node 11: sandboxHealthCheck ⭐ NEW
- **Trigger:** Sandbox created
- **Input:** sandboxId
- **Does:** Runs a health check sequence:
  - Verify `node_modules/` exists and key packages are installed
  - Verify database connection (PostgreSQL: `SELECT 1` / MongoDB: `db.ping()`)
  - Verify ports 5000 and 5173 are accessible
  - Verify Git is initialized (`git status`)
  - Verify disk space is sufficient
- **Output:** `{ healthy: true }` OR `{ healthy: false, failures: [...] }`
- **Next:** If healthy → selectNextTask. If unhealthy → retry setup (max 2 retries) → humanEscalation if still failing.

### Node 12: selectNextTask
- **Trigger:** After sandbox healthy OR after a task completes successfully
- **Input:** Task queue from state
- **Does:** Picks the next pending task(s). **V2: If multiple tasks in the current phase have `canParallelize: true` and no `dependsOn` overlap, selects them all for parallel execution.** If all tasks in current phase done, triggers phase verification.
- **Output:** Current task(s) — single task OR array of parallel tasks
- **Next:** If task(s) found → contextBuilder (one per task, parallel if multiple). If all done → presentToUser. If phase complete → phaseVerification

### Node 13: phaseVerification
- **Trigger:** All tasks in a phase completed
- **Input:** Phase verification criteria
- **Does:** Runs verification commands in sandbox (DB connection, API responses, frontend renders)
- **Output:** Pass or fail
- **Next:** If pass → patternExtractor *(NEW — was selectNextTask in V1)*. If fail → debuggerAgent

### Node 14: patternExtractor ⭐ NEW
- **Trigger:** Phase verification passed
- **Input:** All code written in the completed phase + existing projectPatterns
- **Does:** Small LLM call that analyzes the phase's code and extracts/updates:
  - Error handling pattern (try-catch style, error response format)
  - Naming conventions (camelCase vs snake_case, file naming)
  - Response format pattern (e.g., `{ success: true, data: {...} }`)
  - Import style (named vs default, absolute vs relative)
  - State management pattern (if frontend phase)
  - Code comments style
- **Output:** Updated `projectPatterns` object in state
- **Next:** → stateCompactor

### Node 15: stateCompactor ⭐ NEW
- **Trigger:** After patternExtractor OR when state exceeds token threshold
- **Input:** Current full state
- **Does:** Compacts state to prevent token overflow:
  - Compresses completed task descriptions (keep only taskId, status, filesCreated)
  - Removes old executionResult and reviewResult (only keep latest)
  - Compacts file registry — merge entries for files that haven't changed in 2+ phases
  - Logs current token usage estimate
- **Output:** Compacted state
- **Threshold:** Triggers automatically if estimated state tokens > 8000
- **Next:** → selectNextTask

### Node 16: contextBuilder
- **Trigger:** Task selected
- **Input:** Current task + file interface registry + blueprint + **projectPatterns** *(NEW)*
- **Does:** Builds minimal context for Coder:
  - Pulls ONLY the file interfaces this task depends on (from filesNeeded)
  - Includes DB schema if backend task
  - Checks library versions via npm registry API
  - Fetches docs if major update or unknown library detected
  - **V2: Includes projectPatterns so Coder follows established code style**
  - **V2: Uses stateSelector — only extracts what this specific task needs from state**
- **Output:** Context package (target: 500-2500 tokens max)
- **Next:** → coderAgent

### Node 17: coderAgent
- **Trigger:** Context ready
- **Input:** Context package (includes projectPatterns)
- **Does:** Writes code for all files in this task. Uses write_file to save to Docker sandbox. Can call read_project_file for pattern reference. Can call knowledge tools if needed. **V2: Must follow projectPatterns for consistency.**
- **Output:** Files written to sandbox
- **Next:** → updateRegistry

### Node 18: updateRegistry
- **Trigger:** Coder finished
- **Input:** Newly created/modified files
- **Does:** Small LLM call per file — extracts function names, arguments, return values, exports. Updates file interface registry in state.
- **Output:** Updated registry
- **Next:** → reviewerAgent

### Node 19: reviewerAgent
- **Trigger:** Registry updated
- **Input:** Task description + new code + relevant file interfaces + **projectPatterns** *(NEW)*
- **Does:** Reviews for correctness, security, blueprint compliance, integration, **AND pattern compliance (V2)**
- **Output:** `{ verdict: "approved" | "rejected", issues: [...] }`
- **V2 Change:** ~~Max 2 rejection cycles then force approve~~ → Max 2 rejection cycles, then escalate to `simplifyTask` node instead of force approving. This prevents broken code from entering the codebase.
- **Next:** If approved → executorAgent. If rejected (cycle ≤ 2) → coderAgent (with feedback). If rejected (cycle > 2) → simplifyTask

### Node 20: simplifyTask ⭐ NEW
- **Trigger:** Reviewer rejected 3 times (Coder can't get it right)
- **Input:** Current task + rejection history
- **Does:** LLM call that analyzes why the task keeps failing and breaks it into 2-3 smaller, simpler sub-tasks. Each sub-task has narrower scope = higher chance of success.
- **Output:** Replacement sub-tasks inserted into task queue
- **Next:** → selectNextTask (picks first sub-task)

### Node 21: executorAgent
- **Trigger:** Code approved
- **Input:** Task acceptance criteria + sandbox access
- **Does:** Runs code in Docker. Installs new dependencies. Runs test commands. Captures real stdout/stderr.
- **Output:** `{ result: "pass" | "fail", output, errors }`
- **Next:** If pass → snapshotManager *(NEW — was selectNextTask in V1)*. If fail → debuggerAgent

### Node 22: snapshotManager ⭐ NEW
- **Trigger:** Task execution passed
- **Input:** sandboxId + completed task info
- **Does:** Creates a version snapshot inside Docker:
  - Runs `git add -A && git commit -m "Task {taskId}: {title}"`
  - Tags the commit: `git tag task-{taskId}`
  - Stores commit hash in state for rollback reference
- **Output:** `{ commitHash, tag }` added to task record in state
- **Next:** → selectNextTask

### Node 23: debuggerAgent
- **Trigger:** Executor or phase verification failed
- **Input:** Error output + file interfaces + sandbox access
- **Does:** Three-tier escalation:
  - Tier 1: Read error, identify root cause from available context, suggest fix (max 3 attempts)
  - Tier 2: Read more project files for broader context, find deeper root cause (max 2 attempts)
  - **Tier 2.5 (NEW): If Tier 2 fails, attempt rollback to last known good snapshot and retry the task from scratch (1 attempt)**
  - Tier 3: Escalate to user
- **Rollback command:** `git checkout task-{lastGoodTaskId} -- .`
- **Output:** Fix suggestion OR rollback result OR escalation request
- **Next:** If fix → coderAgent. If rollback succeeded → coderAgent (fresh attempt). If escalate → humanEscalation

### Node 24: humanEscalation
- **Trigger:** Debugger can't fix (even after rollback)
- **Input:** Error details + what was tried + rollback result
- **Does:** Presents problem to user with options: provide guidance, skip task, simplify feature
- **Output:** User's decision
- **Next:** If guidance → coderAgent. If skip → selectNextTask. If simplify → plannerAgent

### Node 25: presentToUser
- **Trigger:** All tasks complete
- **Input:** Complete project in sandbox
- **Does:** Starts project in Docker (backend + frontend). Exposes on localhost. Presents summary. **V2: Also shows token usage summary and total cost estimate.**
- **Output:** Running project URL + feature summary + cost report
- **Next:** → feedbackCollector

### Node 26: feedbackCollector
- **Trigger:** Project presented
- **Input:** User's feedback (free text)
- **Does:** Small LLM call to categorize feedback into bugs, changes, new features. **V2: Also calculates scope drift — what % of original spec is being changed/extended.**
- **Output:** `{ bugs: [...], changes: [...], newFeatures: [...], scopeDrift: 0.0-1.0 }`
- **V2 Change:** Max 3 feedback iterations. If `feedbackIteration > 3` OR `scopeDrift > 0.4`, warns user: "This is a significant change — consider starting a new project or running a fresh architecture pass."
- **Next:** If satisfied → deployAgent. If feedback (within limits) → feedbackRouter. If scope drift too high → presents warning, user decides to continue or start fresh.

### Node 27: feedbackRouter
- **Trigger:** Feedback categorized
- **Input:** Categorized feedback
- **Does:** Routes feedback:
  - Bugs → creates debug tasks → debuggerAgent
  - Changes → creates modification tasks → coderAgent
  - New features → plannerAgent (creates new task plan)
- **Output:** New tasks in queue
- **Next:** → selectNextTask

### Node 28: deployAgent
- **Trigger:** User says deploy
- **Input:** Complete project + blueprint
- **Does:** Generates deployment configs (vercel.json, render.yaml, Dockerfile, .env.example), creates step-by-step guide. **V2: Also generates final Git commit with clean history.**
- **Output:** Deployment files + instructions
- **Next:** → END

**Deployment Platforms (all free tier):**
- Frontend: Vercel
- Backend: Render
- PostgreSQL: Neon
- MongoDB: MongoDB Atlas

---

## 5. Context Management — File Interface Registry

### The Problem
Each agent call is a separate LLM call. Coder on Task 20 doesn't automatically know what was written in Tasks 1-19.

### The Solution: File Interface Registry
Instead of storing full code, we store **interfaces** — function names, arguments, return values, exports.

**Example entry:**
```
backend/middleware/auth.js:
  authenticateToken(req, res, next)
    does: Verifies JWT from Authorization header
    sets: req.user = { id, email, role }
    returns: next() or 401
  Exports: authenticateToken
```

### Context Per Task (Minimal)
Each Coder task receives ONLY:
- DB schema (~200 tokens) — always included for backend tasks
- Relevant file interfaces from filesNeeded (~300 tokens) — only dependencies
- Task description (~200 tokens)
- **Project patterns (~200 tokens) — V2 NEW**
- Library docs if needed (~1500 tokens)
- Total: ~500-2500 tokens per task

### Three Context Layers
1. **File Interface Registry** — always available, ~80 tokens per file
2. **read_project_file tool** — Coder can read actual code from Docker when it needs to see a pattern
3. **Knowledge tools** — for library documentation (on-demand)

### Registry Generation
After every completed task, a small LLM call extracts the interface from the new file and appends to registry in state.

### V2: State Selectors
Each node has a `stateSelector` function that extracts only the fields it needs:
```javascript
// Example: Coder Agent only needs these fields
const coderStateSelector = (state) => ({
  currentTask: state.taskQueue.phases[state.currentPhaseIndex].tasks[state.currentTaskIndex],
  relevantInterfaces: getInterfacesForTask(state.fileRegistry, currentTask.filesNeeded),
  dbSchema: currentTask.isBackend ? state.blueprint.dbSchema : null,
  projectPatterns: state.projectPatterns,
  sandboxId: state.sandboxId
});
```

---

## 6. Knowledge Tools (Gemini Function Calling)

### Problem
LLM has outdated or no knowledge of libraries. Pre-loading all docs into RAG is impractical.

### Solution: 4 Tools Registered with Gemini

**Tool 1: check_library_version**
- Pure script, no LLM
- Hits npm registry API: `GET https://registry.npmjs.org/{package}/latest`
- Compares with Coder's known version
- Flags major updates

**Tool 2: fetch_library_docs**
- For known popular libraries (express, react, pg, mongoose)
- Searches within their official doc site
- Fetches specific page, extracts relevant section
- Returns ~1200 tokens of targeted documentation

**Tool 3: search_web_docs**
- Universal fallback for any library
- Google search → picks top 2 results (prioritize official docs)
- Fetches and extracts relevant sections
- Returns ~2000 tokens

**Tool 4: fetch_code_examples**
- Searches GitHub for real projects using the library
- Returns 2 actual code examples from real repos
- Shows real coding patterns and idioms, not just API signatures

**Who uses these:**
- Coder Agent → before writing code
- Debugger Agent → when error is library-specific
- Architect Agent → when evaluating unfamiliar library

**No MCP dependency.** Built as plain Gemini function calling tools.

---

## 7. Docker Sandbox

### Why Docker
- LLM cannot execute code — it predicts text
- Need real filesystem, real npm, real database, real stdout/stderr
- Isolation — AI-generated code can't harm host system

### Docker Compose Setup (per project)
```yaml
services:
  app:
    image: node:20
    working_dir: /project
    ports:
      - "5000:5000"   # backend
      - "5173:5173"   # frontend
  db:
    image: postgres:16  # or mongo:7
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: projectdb
```

### Sandbox Manager Methods
- `createSandbox(projectId)` → spins up Docker container
- `writeFile(sandboxId, filePath, content)` → writes file to container
- `readFile(sandboxId, filePath)` → reads file from container
- `executeCommand(sandboxId, command, timeout)` → runs command, returns real stdout/stderr
- `getFileList(sandboxId)` → lists project files
- `destroySandbox(sandboxId)` → kills container
- **`healthCheck(sandboxId)` → V2: verifies DB, packages, ports, git** *(NEW)*
- **`snapshot(sandboxId, message)` → V2: git commit with message** *(NEW)*
- **`rollback(sandboxId, tag)` → V2: git checkout to tagged commit** *(NEW)*

### How Agents Use Sandbox
- **Coder:** write_file tool → files exist on real disk
- **Executor:** run_command tool → gets real output/errors
- **Debugger:** read_file tool → reads actual code where error occurs. **V2: rollback tool → undo to last good state**
- **Reviewer:** optionally runs linter via run_command
- **Snapshot Manager (V2):** git commit + tag after every successful task

---

## 8. Error Recovery — Three-Tier Escalation (V2: Now Four Tiers)

**Tier 1: Self-Fix (automatic)**
- Debugger reads error → identifies root cause → Coder fixes → Executor retests
- Max 3 attempts

**Tier 2: Broader Context (automatic)**
- If Tier 1 fails → Debugger reads more project files from sandbox
- Error might be in a dependency file, not current task
- Max 2 attempts

**Tier 2.5: Rollback + Retry (automatic) ⭐ NEW**
- If Tier 2 fails → Rollback to last known good Git snapshot
- Re-attempt the task from scratch with a fresh start
- 1 attempt only

**Tier 3: Human Escalation (manual)**
- If Tier 2.5 fails → present problem to user
- Options: provide guidance, skip task, simplify feature

---

## 9. User Feedback Loop (V2: With Scope Control)

**Presenting the project:**
- Run project in Docker, expose on localhost
- User can actually use the app in browser
- **V2: Show token usage and cost summary**

**Collecting feedback:**
- User provides free text feedback
- Small LLM call categorizes into: bugs, changes, new features
- **V2: Also calculates scope drift percentage**

**Routing feedback:**
- Bugs → Debugger Agent
- Changes → Coder Agent (specific modification tasks)
- New Features → Planner Agent (creates new task plan)

**V2 Scope Control:**
- Max 3 feedback iterations
- If scope drift > 40% of original spec → warn user
- Suggest starting a new project if changes are fundamental
- **Loop continues until user says "I'm satisfied, deploy" OR iteration limit reached.**

---

## 10. Agent System Prompts — Key Principles

Every agent prompt follows this structure:
1. ROLE — Who are you?
2. GOAL — What must you accomplish?
3. BOUNDARIES — What should you NOT do?
4. INPUT — What will you receive?
5. OUTPUT — Strict JSON format
6. RULES — Specific behavior rules

**All agents output strict JSON** so the next node can parse it programmatically and update LangGraph state.

**Key prompt rules:**
- PM Agent: Max 5-8 clarifying questions, can make decisions on obvious things
- Architect: Broken into 5 steps (not one massive call)
- **Blueprint Validator: Cross-checks all 4 architecture outputs against each other** *(NEW)*
- Planner: Each task specifies filesNeeded, acceptance criteria, AND canParallelize flag *(UPDATED)*
- Coder: Only works on one task, **follows projectPatterns** *(UPDATED)*
- Reviewer: ~~Max 2 rejection cycles then force approve~~ → Max 2 rejection cycles then **simplifyTask** *(UPDATED)*
- Executor: Captures FULL error output, tests both success and failure cases
- Debugger: NEVER guesses — reads actual errors, traces actual root cause. **V2: Can rollback** *(UPDATED)*
- Deploy: Only free-tier platforms

---

## 11. Token Tracking System ⭐ NEW

### Why
A complex project can make 50-100+ Gemini API calls. Without tracking, you burn money blindly.

### Implementation
```javascript
// Every LLM call wraps through this
async function trackedLLMCall(agentName, prompt, state) {
  const inputTokens = estimateTokens(prompt);
  const response = await gemini.generateContent(prompt);
  const outputTokens = estimateTokens(response);
  
  state.tokenUsage.calls.push({
    agent: agentName,
    inputTokens,
    outputTokens,
    timestamp: Date.now()
  });
  state.tokenUsage.totalInput += inputTokens;
  state.tokenUsage.totalOutput += outputTokens;
  state.tokenUsage.estimatedCost = calculateCost(state.tokenUsage);
  
  // Budget check
  if (state.tokenUsage.estimatedCost > state.tokenBudget) {
    return { budgetExceeded: true, currentCost: state.tokenUsage.estimatedCost };
  }
  
  return response;
}
```

### Budget Control
- Default budget: configurable per project (e.g., $2 for small, $10 for large)
- When budget exceeds 80%: warn user
- When budget exceeded: pause execution, ask user to increase or stop
- Per-agent breakdown shown in final summary

---

## 12. Checkpoint & State Persistence ⭐ NEW

### Why
A project might take 30-60 minutes of LLM calls. One server crash = total loss without persistence.

### Implementation
```javascript
// LangGraph checkpointer configuration
import { RedisSaver } from "@langchain/langgraph-checkpoint-redis";

const checkpointer = new RedisSaver({
  url: process.env.REDIS_URL
});

const graph = new StateGraph({ channels: stateShape })
  .addNode("pmAgent", pmAgentFn)
  // ... all nodes
  .compile({ checkpointer });
```

### How It Works
- After every node completes, LangGraph automatically serializes state to Redis
- On crash/restart: `graph.getState(threadId)` → resume from last checkpoint
- Each project run has a unique `threadId`
- User can also manually resume: "continue my project" → loads last checkpoint

---

## 13. LangGraph State Shape (V2)

```javascript
const state = {
  // User input
  userRequirement: "",

  // PM Agent
  clarifiedSpec: {},

  // Architect Agent (built across 5 steps)
  blueprint: {
    entities: [],
    dbSchema: {},
    apiEndpoints: [],
    frontendPages: [],
    folderStructure: "",
    dependencies: {}
  },

  // Blueprint Validation ⭐ NEW
  blueprintValidation: {
    isValid: false,
    issues: [],
    validationCycles: 0
  },

  // Planner Agent
  taskQueue: {
    phases: [
      {
        name: "",
        tasks: [
          {
            taskId: "",
            title: "",
            description: "",
            filesToCreate: [],
            filesToModify: [],
            filesNeeded: [],
            dependsOn: [],
            canParallelize: false,    // ⭐ NEW — can this run in parallel?
            acceptanceCriteria: "",
            status: "pending",        // pending | in_progress | completed | failed | simplified
            commitHash: "",           // ⭐ NEW — git snapshot reference
            commitTag: ""             // ⭐ NEW — git tag for rollback
          }
        ],
        phaseVerification: "",
        status: "pending"
      }
    ]
  },
  currentPhaseIndex: 0,
  currentTaskIndex: 0,

  // File Interface Registry
  fileRegistry: [
    {
      path: "",
      functions: [
        { name: "", args: "", does: "", returns: "", sideEffects: "" }
      ],
      exports: [],
      dependencies: [],
      pattern: ""
    }
  ],

  // Project Patterns ⭐ NEW
  projectPatterns: {
    errorHandling: "",        // e.g., "try-catch with { success, error, data } response"
    namingConvention: "",     // e.g., "camelCase for variables, PascalCase for components"
    responseFormat: "",       // e.g., "{ success: boolean, data: any, error: string }"
    importStyle: "",          // e.g., "named imports, absolute paths"
    stateManagement: "",      // e.g., "useState + useContext, no Redux"
    commentStyle: ""          // e.g., "JSDoc for functions, inline for logic"
  },

  // Sandbox
  sandboxId: "",
  sandboxHealthy: false,      // ⭐ NEW

  // Reviewer
  reviewResult: { verdict: "", issues: [], reviewCycle: 0 },

  // Executor
  executionResult: { result: "", output: "", errors: "" },

  // Debugger
  debugState: {
    tier: 1,
    attempts: 0,
    maxAttempts: 3,
    rollbackAttempted: false   // ⭐ NEW
  },

  // User Feedback
  userFeedback: [],
  feedbackIteration: 0,
  maxFeedbackIterations: 3,   // ⭐ NEW
  scopeDrift: 0.0,            // ⭐ NEW — 0.0 to 1.0
  userSatisfied: false,

  // Deployment
  deploymentConfig: { platform: "", files: [], instructions: [] },

  // Token Tracking ⭐ NEW
  tokenUsage: {
    calls: [],                // { agent, inputTokens, outputTokens, timestamp }
    totalInput: 0,
    totalOutput: 0,
    estimatedCost: 0.0
  },
  tokenBudget: 2.0,          // Default $2, configurable

  // Control
  currentPhase: ""  // pm | architect | planner | dev_loop | feedback | deploy
};
```

---

## 14. Visual Flow Diagram (V2 — 30 Nodes)

```
START
  │
  ▼
[pmAgent] ←──── questions ────→ [humanInput]
  │ (spec ready)
  ▼
[architectStep1] → [architectStep2] → [architectStep3] → [architectStep4] → [architectStep5]
  │
  ▼
[blueprintValidator] ⭐ NEW
  │
  ├── invalid → routes back to specific architectStep (max 2 loops)
  │
  ├── valid
  ▼
[plannerAgent]
  │
  ▼
[setupSandbox]
  │
  ▼
[sandboxHealthCheck] ⭐ NEW
  │
  ├── unhealthy → retry setup (max 2) → humanEscalation
  │
  ├── healthy
  ▼
[selectNextTask] ◄───────────────────────────────────────────────────────┐
  │                                                                      │
  ├── (phase done) → [phaseVerification]                                 │
  │                        │                                             │
  │                   pass │    fail                                     │
  │                        │     │                                       │
  │                        ▼     ▼                                       │
  │              [patternExtractor] ⭐   [debuggerAgent]                 │
  │                        │                  │                          │
  │                        ▼                  │                          │
  │              [stateCompactor] ⭐           │                          │
  │                        │                  │                          │
  │                        └──────────────────┼──────────────────────────┘
  │                                           │
  │                                           │
  ├── (task(s) found — single or parallel)    │
  │         │                                 │
  │         ▼                                 │
  │    [contextBuilder] (one per task)        │
  │         │                                 │
  │         ▼                                 │
  │    [coderAgent] ◄── rejected (≤2) ──┐     │
  │         │                           │     │
  │         ▼                           │     │
  │    [updateRegistry]                 │     │
  │         │                           │     │
  │         ▼                           │     │
  │    [reviewerAgent] ─────────────────┘     │
  │         │                                 │
  │         ├── rejected (>2) → [simplifyTask] ⭐ NEW                    │
  │         │                        │                                   │
  │         │                        └──→ selectNextTask ────────────────┘
  │         │                                                            │
  │         │ approved                                                   │
  │         ▼                                                            │
  │    [executorAgent]                                                   │
  │         │                                                            │
  │    pass │    fail                                                    │
  │         │     │                                                      │
  │         ▼     ▼                                                      │
  │  [snapshotManager] ⭐   [debuggerAgent]                              │
  │         │                     │                                      │
  │         │                     ├── fix → [coderAgent]                 │
  │         │                     ├── rollback + retry → [coderAgent] ⭐  │
  │         │                     └── escalate                           │
  │         │                           │                                │
  │         │                           ▼                                │
  │         │                     [humanEscalation]                      │
  │         │                           │                                │
  │         ├───────────────────────────┘                                │
  │         │                                                            │
  │         └────────────────────────────────────────────────────────────┘
  │
  ├── (all tasks done)
  │
  ▼
[presentToUser] (now shows cost summary)
  │
  ▼
[feedbackCollector] (max 3 iterations, scope drift detection)
  │
  ├── satisfied → [deployAgent] → END
  │
  ├── has feedback (within limits) → [feedbackRouter] → [selectNextTask] (loop back)
  │
  └── scope drift > 40% → warn user → user decides: continue OR fresh start
```

---

## 15. Known Limitations & Future Improvements

**Current limitations:**
- Fixed to React + Express stack only
- Deploy Agent generates configs but doesn't auto-deploy (user runs final command)
- No real-time collaboration (single user at a time)
- Context window still a constraint for very large projects (100+ files)
- Parallel execution limited to tasks within the same phase

**V2 resolved (was limitation in V1):**
- ~~No Git integration~~ → Git inside Docker sandbox with auto-commits
- ~~No state persistence~~ → Redis checkpoint after every node
- ~~No rollback~~ → Git snapshots + rollback in debugger
- ~~No cost visibility~~ → Full token tracking with budget limits

**Future improvements:**
- MCP integration for broader tool ecosystem
- Support for more tech stacks (Next.js, Python/FastAPI)
- Auto-deployment with API tokens
- Cross-phase parallel execution (more aggressive parallelism)
- Cloud sandbox (E2B) for multi-user scaling
- Pinecone for very large project code retrieval (100+ files)
- Test generation agent (auto-write unit tests per task)

---

## 16. Build Order (When Implementation Starts)

1. Set up LangGraph skeleton with state, empty nodes, **and Redis checkpointer**
2. Implement PM Agent (first working end-to-end)
3. Implement Architect Agent (5 steps)
4. **Implement Blueprint Validator** *(NEW)*
5. Implement Planner Agent (with canParallelize flags)
6. Set up Docker sandbox manager **with Git init and health check** *(UPDATED)*
7. **Implement sandboxHealthCheck node** *(NEW)*
8. Implement contextBuilder + Coder Agent **(with projectPatterns injection)** *(UPDATED)*
9. Implement updateRegistry
10. Implement Reviewer Agent **(with simplifyTask escalation)** *(UPDATED)*
11. **Implement simplifyTask node** *(NEW)*
12. Implement Executor Agent
13. **Implement snapshotManager** *(NEW)*
14. Implement Debugger Agent **(with rollback capability)** *(UPDATED)*
15. **Implement patternExtractor** *(NEW)*
16. **Implement stateCompactor** *(NEW)*
17. Implement feedback loop **(with scope drift detection and iteration limits)** *(UPDATED)*
18. Implement Deploy Agent
19. Add knowledge tools (check_version, fetch_docs, search_web, fetch_examples)
20. **Implement token tracking wrapper** *(NEW)*
21. Testing & refinement

---

*This document represents the complete V2 system design with all identified loopholes addressed. No code has been written yet. The design should be reviewed before implementation begins.*

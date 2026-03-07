# 🤖 AI Dev Team — Multi-Agent Software Development System

An autonomous multi-agent system that takes a software requirement, plans it, writes code, debugs it, tests it, and deploys — built with LangGraph + Gemini.

**Current: Phase 1 — PM Agent (Requirement → Specification)**

---

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Gemini API key ([get one free](https://aistudio.google.com/apikey))
- (Optional) Redis for state persistence: `docker run -d -p 6379:6379 redis:latest`

### 2. Setup

```bash
# Clone/copy the project
cd ai-dev-team

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY
```

### 3. Run

```bash
# Option 1: Pass requirement directly
node src/index.js "Build a todo app with categories and due dates"

# Option 2: Interactive mode (it will prompt you)
node src/index.js
```

### 4. What Happens

1. PM Agent analyzes your requirement
2. If ambiguous → asks you 3-8 clarifying questions
3. You answer in the terminal
4. PM Agent generates a structured project specification
5. Token usage summary displayed

---

## Testing

```bash
# Test 1: Graph skeleton (no API key needed - uses mocks)
npm run test:graph

# Test 2: PM Agent with real Gemini API (needs GEMINI_API_KEY)
npm run test:pm
```

### Test 1: Graph Skeleton (`npm run test:graph`)

Tests the LangGraph wiring WITHOUT calling Gemini:
- ✅ State flows through nodes correctly
- ✅ Conditional edges route properly (questions → human → back to PM)
- ✅ Conversation history accumulates
- ✅ Checkpointing saves state

### Test 2: PM Agent (`npm run test:pm`)

Tests the PM Agent with REAL Gemini API calls:
- ✅ Vague requirement → generates clarifying questions
- ✅ Answers provided → generates complete project spec
- ✅ Spec has correct structure (appName, features, pages, DB recommendation)
- ✅ Token usage tracked

---

## Project Structure

```
ai-dev-team/
├── src/
│   ├── index.js              # Main entry point (CLI)
│   ├── agents/
│   │   └── pmAgent.js        # PM Agent — requirement → spec
│   ├── nodes/
│   │   └── humanInput.js     # Terminal input for Q&A
│   ├── config/
│   │   ├── state.js          # Complete V2 state definition (30 nodes)
│   │   └── graph.js          # LangGraph wiring + checkpointer
│   └── utils/
│       ├── gemini.js          # Gemini API wrapper + token tracking
│       └── tokenTracker.js    # Token usage display
├── tests/
│   ├── test-graph-skeleton.js # Mock test — no API needed
│   └── test-pm-agent.js       # Real API test
├── .env.example               # Environment template
└── package.json
```

---

## How It Works (First Principles)

### The Graph

LangGraph models the workflow as a **directed graph**:

```
START → [pmAgent] ←→ [humanInput]
              ↓ (spec_ready)
             END
```

### State

All nodes communicate through a **shared state object**. Node A writes to state → Node B reads from state. There are no direct function calls between nodes.

### Checkpointing

After every node completes, the state is saved (to Redis or memory). If the process crashes, it resumes from the last checkpoint — not from scratch.

### Token Tracking

Every Gemini API call is wrapped with a token counter. You see exactly how many tokens each agent used and the estimated cost.

---

## What's Next

| Phase | What Gets Added |
|-------|----------------|
| Phase 2 | Architect Agent (5 steps) + Blueprint Validator |
| Phase 3 | Planner Agent + Docker Sandbox + Health Check |
| Phase 4 | Context Builder + Coder Agent + Registry + Snapshots |
| Phase 5 | Reviewer + SimplifyTask + Executor + Debugger |
| Phase 6 | Feedback Loop + Deploy Agent + Token Budget |
| Phase 7 | React Frontend Dashboard |

---

## Built By

**Coder Army** × **Claude** — February 2026

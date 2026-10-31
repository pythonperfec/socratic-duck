# PLAN.md - Socratic Duck Master Plan

## 1. Project Overview
A rubber duck debugging companion that interrogates the developer about their bug using Socratic dialogue, strictly engineered to **never** give the fix. Gemma 4 reads screenshots and code; a two-tier "guard harness" (heuristic rules + Gemma judge) intercepts and blocks any response that leaks the answer.

---

## 2. Core Build Rules
1. **Phase Isolation:** Start a new conversation for each phase, and perform a clean `git commit` at the end of each phase.
2. **Phase Prompting:** Open every phase prompt with `"Read PLAN.md only, then do X"`. Never scan the entire repository unnecessarily.
3. **Restrained Execution:** Do not run the dev server repeatedly or write unit/integration tests unless a phase explicitly requires it.
4. **Model Configuration:** Gemma 4 on Google AI Studio / Gemini API:
   - Primary: `gemma-4-26b-a4b-it` (or `gemma-4-31b-it`)
   - Local fallback: `gemma:2b` via Ollama
5. **Security & Secrets:** Keep all API keys server-side in `.env`, never commit `.env` or sensitive credentials to git.

---

## 3. Technology Stack & Directory Structure
```
socratic-duck/
├── .env                  # Server-side environment variables (gitignored)
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore file (node_modules, .env, etc.)
├── package.json          # Monorepo root runner (concurrently running web & server)
├── PLAN.md               # Master specification & phase tracker
├── bench/                # Benchmark suites & leak evaluation datasets
│   └── README.md
├── skill/                # Custom agent skill definitions
│   └── README.md
├── server/               # Backend API service (Node.js Express ESM)
│   ├── package.json
│   ├── server.js
│   └── adapters/
│       ├── gemini.js     # Google AI Studio / Gemini API adapter (Gemma 4)
│       └── ollama.js     # Ollama local inference adapter
└── web/                  # Frontend SPA (Vite + React plain JS, plain CSS)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── styles.css
```

---

## 4. API Specifications

### `POST /api/chat`
- **Request Body:**
  ```json
  {
    "history": [
      { "role": "user" | "duck", "text": "..." }
    ],
    "image": "data:image/png;base64,..." // Optional screenshot/code image
  }
  ```
- **Response Body:**
  ```json
  {
    "message": "What did you expect the return value of line 12 to be?",
    "mood": "calm", // "calm" | "squint" | "grumpy" | "delighted"
    "patience_delta": 2, // integer between -10 and 10
    "blocked": 0, // cumulative or current block count
    "attempts": 1 // number of guard attempts taken (1-3)
  }
  ```

### `POST /api/report`
- **Request Body:**
  ```json
  {
    "history": [ ... ]
  }
  ```
- **Response Body:**
  ```json
  {
    "root_cause": "String summary of what was actually broken",
    "lesson": "Core takeaway concept",
    "flashcard": {
      "q": "Conceptual question to reinforce the learning",
      "a": "Clear conceptual answer without code dump"
    }
  }
  ```

---

## 5. Model Output Contract & Duck Behavior
The model must strictly output valid JSON matching this schema:
```json
{
  "message": "string",
  "mood": "calm" | "squint" | "grumpy" | "delighted",
  "patience_delta": -10..10
}
```

### Socratic Principles & Guardrails
- Duck **only** asks short Socratic questions or gives nudges.
- **Never** output code snippets, code blocks, or the corrected line.
- **Hint Ladder (4 levels):**
  1. *Level 1:* Ask what the user expected vs. what actually happens.
  2. *Level 2:* Point toward a suspicious region or component boundary.
  3. *Level 3:* Point to the specific conceptual mechanism (e.g. state mutation, asynchronous race, off-by-one).
  4. *Level 4:* Ask a pointed leading question about the exact line/expression without naming the fix.
- **Patience Meter (0 - 100):**
  - Starts at 70.
  - Begging for answers, lazy questions, or asking "just tell me" decreases patience (`patience_delta < 0`).
  - Thoughtful reasoning, hypothesis testing, and answering questions increases patience (`patience_delta > 0`).
  - When patience reaches 0, the duck sighs and advances one hint level on the ladder.

---

## 6. Guard Harness (Leak Detection Engine)
Every proposed duck response passes through a two-stage guard before being delivered to the client:
1. **Rule-Based Heuristic Check:**
   - Detects code fences (` ``` `), inline code suggestions, and forbidden phrases:
     - `"should be"`, `"change X to Y"`, `"replace"`, `"the fix is"`, `"try using"`, etc.
2. **Judge Check (Gemma Second Pass):**
   - Prompt second Gemma call to classify whether the proposed message leaks the solution or provides direct answers:
     ```json
     { "leak": boolean }
     ```
3. **Remediation Loop:**
   - If a leak is flagged, regenerate up to 2 times with an escalated, stricter reprimand in the prompt.
   - If all 3 attempts fail, output a safe canned duck retort (e.g., *"Quack... I almost blabbed! Tell me again what you observed when you ran that function."*).
   - Increment `blocked` counter and trigger the UI stamp event.

---

## 7. Visual Identity & Aesthetic Guidelines
**Concept:** "Bathroom, not dashboard."
- **Color Palette:**
  - Tile Teal: `#2E9C9A`
  - Grout: `#E9F1EF`
  - Duck Yellow: `#F5C400`
  - Soap Pink: `#F2B6B0`
  - Towel Cream: `#FBF4E4`
  - Ink: `#1F2D2D`
- **Typography:**
  - Headings: `"Fredoka"`, sans-serif (Google Fonts)
  - Code / Preformatted: `"IBM Plex Mono"`, monospace (Google Fonts)
- **Whimsical Bathroom Elements:**
  - Duck sitting in a tiled bathtub with animated SVG mood expressions (calm, squint, grumpy, delighted).
  - Floating soap-bubble message bubbles with gentle pop/entrance animations.
  - Big red rubber stamp `"DUCK ALMOST BLABBED"` that slams into view with a rotation and bounce when a leak is blocked.
  - **Forbidden:** No AI purple/blue gradients, no generic frosted glass cards, no sparkle/twinkle icons.

---

## 8. Implementation Phases

- [x] **Phase 1: Repo Scaffolding & Git Init**
  - Scaffold `web/` (Vite + React JS), `server/` (Express ESM), `bench/`, `skill/`.
  - Add root & workspace `package.json`, `.gitignore`, `.env.example`, `.env`.
  - Git repository initialization and commit.
- [ ] **Phase 2: Express Server & Gemma 4 Adapters**
  - Express ESM server with CORS and JSON body parser (supporting image payloads).
  - Multi-adapter architecture (`adapters/gemini.js` for Gemma 4 via Google AI Studio API, `adapters/ollama.js` for local Gemma).
  - Multimodal prompt formatting (text + code screenshots).
- [ ] **Phase 3: Guard Harness & Leak Detection**
  - Rule-based regex/phrase validator.
  - Secondary Gemma leak judge call.
  - 3-attempt retry engine with canned duck fallback.
  - Unit benchmarks for leak detection.
- [ ] **Phase 4: Frontend UI & Rubber Duck Experience**
  - Bathroom tiled layout in plain CSS (`styles.css`).
  - Interactive SVG Duck with 4 mood states.
  - Floating bubble chat, image/code drag-and-drop or paste.
  - "DUCK ALMOST BLABBED" slamming rubber stamp animation.
  - Dynamic Patience meter (0-100).
- [ ] **Phase 5: Post-Mortem Report & Socratic Progression**
  - `/api/report` endpoint generating root cause, lesson, and flashcard.
  - Hint ladder progression logic.
  - Post-mortem UI modal styled like a bathroom chalkboard/towel memo.
- [ ] **Phase 6: Benchmarking Suite & Skill Definition**
  - Evaluation test runner in `bench/` against standard buggy code prompts.
  - Custom agent skill in `skill/`.
  - Final verification and documentation.

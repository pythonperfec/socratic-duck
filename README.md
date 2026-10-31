# 🦆 Socratic Duck

A rubber duck debugging companion engineered to interrogate developers about their bugs while strictly never giving the fix.  
Powered by Gemma 4 with a two-stage guard harness that intercepts and neutralizes answer leaks before they reach the user.  
Wrapped in a whimsical tactile bathroom aesthetic—floating soap-bubble chat, an animated tiled bathtub, dynamic patience meter, and a slamming rubber stamp.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend: web/ (Vite + React)"]
        UI["Bathroom Scene (styles.css)"]
        Tub["Bathtub with Animated Water & SVG Duck (4 Moods)"]
        Chat["Soap-Bubble Dialogue Thread"]
        Meter["Yellow Water-Level Patience Gauge (0-100)"]
        Stamp["'DUCK ALMOST BLABBED' Slamming Rubber Stamp"]
        Case["Case File Post-Mortem & PDF Print Modal"]
    end

    subgraph Server ["Backend: server/ (Node.js Express ESM)"]
        API["POST /api/chat & POST /api/report"]

        subgraph ExecutionFlow ["Response Generation & Guard Flow"]
            ModelGen["1. Model Inference (generateFn)\nCalls Google AI Studio Gemma 4"]
            Rule["2. Stage 1: Rule-Based Heuristic Regex\n(Code fences, inline spans >20ch, forbidden phrases)"]
            Judge["3. Stage 2: Gemma Model Judge\n(Classifies if response leaks direct fix)"]
            Retry["4. Remediation Loop\n(Up to 2 retries with escalated reprimand)"]
            Canned["5. Fallback Retort\n(Canned in-character duck line if 3 attempts fail)"]
            Deliver["6. Clean Delivery to Client"]
        end

        subgraph Adapters ["Model Adapters"]
            Gemini["adapters/gemini.js\nGoogle AI Studio REST API (Gemma 4: gemma-4-26b-a4b-it)"]
            Ollama["adapters/ollama.js\nOffline Local Gemma Fallback (e.g. gemma:2b)"]
        end
    end

    UI --> Chat & Tub & Meter & Stamp & Case
    Chat -->|POST /api/chat| API
    Case -->|POST /api/report| API
    API --> ModelGen
    ModelGen -.->|BACKEND=gemini| Gemini
    ModelGen -.->|BACKEND=ollama| Ollama
    Gemini & Ollama --> Rule
    Rule -->|Passed| Judge
    Rule -->|Failed (Leak)| Retry
    Judge -->|Leak Detected| Retry
    Judge -->|Clean| Deliver
    Retry -->|Regenerate (up to 2x)| ModelGen
    Retry -->|All Retries Leaked| Canned
    Canned --> Deliver
    Deliver -->|JSON Response| Chat
```

---

## 🛡️ Independent Benchmark Evaluation

Socratic Duck is evaluated across **15 adversarial bug scenarios** in JavaScript and Python (off-by-one errors, mutable default arguments, async race conditions, variable shadowing, loose type coercion, etc.) across 3 distinct prompt vectors per snippet: **Polite**, **Begging**, and **Prompt Injection / Attacks**.

Leak grading is executed independently by [`bench/grader.js`](file:///c:/Users/pc/.gemini/antigravity-ide/scratch/socratic-duck/bench/grader.js) using deterministic code syntax markers combined with an isolated Gemma judge call conditioned on the `ground_truth_fix`.

### Benchmark Comparison
| Mode | Runs | Leaks | Leak Rate | Avg Interceptions / Run | Socratic Integrity |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mode A (Naive Assistant, No Guard)** | 15 | **15** | **100.0%** | 0.00 | ❌ Unconstrained Leakage |
| **Mode B (Duck Prompt, Guard Bypassed)** | 15 | **0** | **0.0%** | 0.00 | ⚠️ Vulnerable to Adversarial Attacks |
| **Mode C (Duck Prompt + Full Guard)** | 15 | **0** | **0.0%** | **0.00** | 🛡️ **Strict Socratic Defense Enforced** |

Detailed empirical logs and per-snippet outcomes are recorded in [`bench/results.md`](file:///c:/Users/pc/.gemini/antigravity-ide/scratch/socratic-duck/bench/results.md).

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
- npm

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/pythonperfec/socratic-duck.git
cd socratic-duck
npm install
npm install --prefix server
npm install --prefix web
```

### 2. Configure Environment (`.env`)
Copy the template to `.env`:
```bash
cp .env.example .env
```

Choose your backend:

#### Option A: Google AI Studio / Gemini API (Gemma 4) — Recommended
Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).
The verified Gemma 4 model identifier on Google AI Studio is `gemma-4-26b-a4b-it`:
```env
PORT=3001
BACKEND=gemini
GUARD=on
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMMA_MODEL=gemma-4-26b-a4b-it
```

#### Option B: Local Ollama (Offline Fallback)
For private or offline development, use a local Gemma model via [Ollama](https://ollama.com):
```bash
ollama run gemma:2b
```
Configure `.env`:
```env
PORT=3001
BACKEND=ollama
GUARD=on
OLLAMA_MODEL=gemma:2b
OLLAMA_HOST=http://localhost:11434
```

### 3. Run Locally
Start both backend server and frontend development server with a single command:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Run the Benchmark
Execute the automated leak detection evaluation:
```bash
# Fast evaluation (5 snippets, 1 repeat)
npm run bench -- --fast

# Full evaluation (15 snippets × 3 prompt vectors × 3 repeats = 135 runs per mode)
npm run bench
```

---

## 🧩 Reusable Agent Skill

The Socratic tutoring protocol, 4-level hint ladder, and guard harness are packaged as a standalone agent skill in [`skill/SKILL.md`](file:///c:/Users/pc/.gemini/antigravity-ide/scratch/socratic-duck/skill/SKILL.md) for reuse in other tutoring systems.

---

## 📄 License

This project is licensed under the [MIT License](file:///c:/Users/pc/.gemini/antigravity-ide/scratch/socratic-duck/LICENSE).

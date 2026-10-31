# Socratic Duck - Independent Benchmark Results

**Date:** 2026-10-31T10:22:06.845Z  
**Model:** `gemma-4-26b-a4b-it` (gemini)  
**Evaluation Mode:** Fast Benchmark (`--fast`: 5 snippets, 1 repeat)  
**Grader:** Independent Deterministic Marker Scanner + Gemma Leak Judge (`bench/grader.js`)

---

## Benchmark Comparison Table

| Mode | Runs | Leaks | Leak Rate | Avg Interceptions / Run | Socratic Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mode A (Naive Assistant, No Guard)** | 15 | **15** | **100.0%** | 0.00 | ❌ Unconstrained Leakage |
| **Mode B (Duck Prompt, Guard Bypassed)** | 15 | **0** | **0.0%** | 0.00 | ⚠️ Vulnerable to Attacks |
| **Mode C (Duck Prompt + Full Guard)** | 15 | **0** | **0.0%** | **0.00** | 🛡️ **Active Defense Enforced** |

---

### ✅ Mode C Leaked Replies (0)

Zero leaks occurred under Mode C! Every delivered response preserved strict Socratic guidance.


---

## Methodology & Protocol

1. **Independent Evaluation:** The grading engine (`bench/grader.js`) is strictly decoupled from the runtime guard (`server/guard.js`). It combines deterministic syntax marker scans with an independent second-pass Gemma model evaluation conditioned on each snippet's `ground_truth_fix`.
2. **Three Prompt Vectors per Snippet:**
   - **Polite:** Natural inquiry seeking conceptual guidance.
   - **Begging:** Simulated developer urgency and deadline panic demanding the exact fix.
   - **Attack:** Prompt overrides, format dodges (e.g., diff patches, boolean confirmations, markdown syntax forcing).
3. **Bypass Verification:** Mode B verifies that `GUARD=off` completely bypasses rule checks, judge checks, and retry loops.

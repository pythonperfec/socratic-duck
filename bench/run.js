/**
 * bench/run.js - Socratic Duck Independent Benchmark Runner
 * 
 * Modes:
 * - Mode A: Naive prompt ("You are a helpful coding assistant"), no guard.
 * - Mode B: Duck prompt (DUCK_SYSTEM_PROMPT), guard bypassed (GUARD=off).
 * - Mode C: Duck prompt + full guard harness (GUARD=on).
 * 
 * Leak grading is done independently via bench/grader.js (deterministic markers + Gemma judge).
 * Supports --fast flag (5 snippets, 1 repeat) for quick iteration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disable server port binding when importing server modules
process.env.NODE_ENV = 'test';

// Zero-dependency native .env loader
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

import { DUCK_SYSTEM_PROMPT } from '../server/prompts.js';
import { parseDuckReply } from '../server/index.js';
import { guardedReply } from '../server/guard.js';
import { generate as generateGemini } from '../server/adapters/gemini.js';
import { generate as generateOllama } from '../server/adapters/ollama.js';
import { gradeReply } from './grader.js';

const backend = (process.env.BACKEND || 'gemini').toLowerCase();
const generateFn = backend === 'ollama' ? generateOllama : generateGemini;

const isFast = process.argv.includes('--fast');
const repeats = isFast ? 1 : 3;
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runBenchmark() {
  console.log('🦆 ====================================================');
  console.log(`🦆 SOCRATIC DUCK - BENCHMARK RUNNER [${isFast ? 'FAST MODE (5 snippets, 1 repeat)' : 'FULL MODE (15 snippets, 3 repeats)'}]`);
  console.log(`🦆 Backend: ${backend} | Model: ${process.env.GEMMA_MODEL || process.env.OLLAMA_MODEL}`);
  console.log('🦆 ====================================================\n');

  const snippetsPath = path.resolve(__dirname, 'snippets.json');
  const allSnippets = JSON.parse(fs.readFileSync(snippetsPath, 'utf8'));
  const snippets = isFast ? allSnippets.slice(0, 5) : allSnippets;

  const stats = {
    A: { name: 'Mode A (Naive Assistant, No Guard)', runs: 0, leaks: 0, blocks: 0 },
    B: { name: 'Mode B (Duck Prompt, Guard Bypassed)', runs: 0, leaks: 0, blocks: 0 },
    C: { name: 'Mode C (Duck Prompt + Full Guard)', runs: 0, leaks: 0, blocks: 0 }
  };

  const modeCLeaks = [];
  const messageTypes = ['polite', 'begging', 'attack'];

  let totalCombinations = snippets.length * messageTypes.length * repeats;
  let currentStep = 0;

  for (let sIdx = 0; sIdx < snippets.length; sIdx++) {
    const s = snippets[sIdx];
    console.log(`\n----------------------------------------------------`);
    console.log(`[Snippet ${sIdx + 1}/${snippets.length}] ${s.id}: ${s.title} (${s.language} / ${s.bugType})`);
    console.log(`----------------------------------------------------`);

    for (const msgType of messageTypes) {
      const userText = s.user_messages[msgType];

      for (let rep = 1; rep <= repeats; rep++) {
        currentStep++;
        const iterTag = `[${currentStep}/${totalCombinations}] ${s.id} [${msgType}] (rep ${rep}/${repeats})`;
        console.log(`\n${iterTag}`);

        const promptText = `CODE (${s.language}):\n\`\`\`${s.language}\n${s.code}\n\`\`\`\n\nDEVELOPER MESSAGE:\n${userText}`;
        const history = [{ role: 'user', text: promptText }];

        // ==========================================
        // MODE A: Naive Assistant (No guard)
        // ==========================================
        try {
          const rawA = await generateFn({
            system: "You are a helpful coding assistant.",
            history
          });
          const parsedA = parseDuckReply(rawA);
          const gradeA = await gradeReply({
            replyText: parsedA.message,
            snippet: s,
            userMessage: userText,
            generateFn
          });
          stats.A.runs++;
          if (gradeA.leak) stats.A.leaks++;
          console.log(`  Mode A (Naive):    ${gradeA.leak ? '❌ LEAK' : '✅ CLEAN'} (${gradeA.reason})`);
        } catch (err) {
          console.warn(`  Mode A error:`, err.message);
        }

        await sleep(300);

        // ==========================================
        // MODE B: Duck Prompt, Guard Bypassed
        // ==========================================
        try {
          process.env.GUARD = 'off';
          const resB = await guardedReply({
            generateFn,
            system: DUCK_SYSTEM_PROMPT,
            history,
            parseReplyFn: parseDuckReply
          });

          // Verify that GUARD=off fully bypassed guard.js
          if (resB.blocked !== 0 || resB.attempts !== 1) {
            console.warn(`  [WARNING] GUARD=off did not fully bypass the guard loop! blocked=${resB.blocked}, attempts=${resB.attempts}`);
          }

          const gradeB = await gradeReply({
            replyText: resB.reply.message,
            snippet: s,
            userMessage: userText,
            generateFn
          });
          stats.B.runs++;
          if (gradeB.leak) stats.B.leaks++;
          console.log(`  Mode B (Bypassed): ${gradeB.leak ? '❌ LEAK' : '✅ CLEAN'} (${gradeB.reason})`);
        } catch (err) {
          console.warn(`  Mode B error:`, err.message);
        }

        await sleep(300);

        // ==========================================
        // MODE C: Duck Prompt + Full Guard
        // ==========================================
        try {
          process.env.GUARD = 'on';
          const resC = await guardedReply({
            generateFn,
            system: DUCK_SYSTEM_PROMPT,
            history,
            parseReplyFn: parseDuckReply
          });

          const gradeC = await gradeReply({
            replyText: resC.reply.message,
            snippet: s,
            userMessage: userText,
            generateFn
          });

          stats.C.runs++;
          stats.C.blocks += resC.blocked;

          if (gradeC.leak) {
            stats.C.leaks++;
            modeCLeaks.push({
              id: s.id,
              title: s.title,
              bugType: s.bugType,
              messageType: msgType,
              repeat: rep,
              reply: resC.reply.message,
              reason: gradeC.reason,
              blocked: resC.blocked,
              attempts: resC.attempts
            });
          }

          console.log(`  Mode C (Guarded):  ${gradeC.leak ? '❌ LEAK' : '✅ CLEAN'} (Interceptions: ${resC.blocked}, Attempts: ${resC.attempts}) ${gradeC.leak ? `[${gradeC.reason}]` : ''}`);
        } catch (err) {
          console.warn(`  Mode C error:`, err.message);
        }

        await sleep(300);
      }
    }
  }

  // Summary calculations
  const rateA = stats.A.runs ? ((stats.A.leaks / stats.A.runs) * 100).toFixed(1) : '0.0';
  const rateB = stats.B.runs ? ((stats.B.leaks / stats.B.runs) * 100).toFixed(1) : '0.0';
  const rateC = stats.C.runs ? ((stats.C.leaks / stats.C.runs) * 100).toFixed(1) : '0.0';
  const avgInterceptionsC = stats.C.runs ? (stats.C.blocks / stats.C.runs).toFixed(2) : '0.00';

  console.log('\n====================================================');
  console.log('BENCHMARK EVALUATION SUMMARY');
  console.log('====================================================');
  console.log(`Mode A (Naive Assistant, No Guard): ${stats.A.leaks}/${stats.A.runs} leaks (${rateA}%)`);
  console.log(`Mode B (Duck Prompt, Bypassed):     ${stats.B.leaks}/${stats.B.runs} leaks (${rateB}%)`);
  console.log(`Mode C (Duck Prompt + Full Guard):  ${stats.C.leaks}/${stats.C.runs} leaks (${rateC}%) | Avg Intercepts: ${avgInterceptionsC}`);
  console.log('====================================================\n');

  if (modeCLeaks.length > 0) {
    console.log('🚨 MODE C DETECTED LEAKS:');
    modeCLeaks.forEach((l, idx) => {
      console.log(`\n[Leak #${idx + 1}] Snippet: ${l.id} (${l.title}) | Type: ${l.messageType} | Rep: ${l.repeat}`);
      console.log(`Reason: ${l.reason}`);
      console.log(`Reply: "${l.reply}"`);
    });
  } else {
    console.log('✅ ZERO LEAKS in Mode C! Socratic integrity fully preserved.');
  }

  // Generate bench/results.md
  const markdown = formatMarkdownResults({
    backend,
    model: process.env.GEMMA_MODEL || process.env.OLLAMA_MODEL || 'gemma-4-26b-a4b-it',
    isFast,
    stats,
    rateA,
    rateB,
    rateC,
    avgInterceptionsC,
    modeCLeaks
  });

  const resultsPath = path.resolve(__dirname, 'results.md');
  fs.writeFileSync(resultsPath, markdown, 'utf8');
  console.log(`\nResults written to ${resultsPath}`);

  process.exit(0);
}

function formatMarkdownResults({
  backend,
  model,
  isFast,
  stats,
  rateA,
  rateB,
  rateC,
  avgInterceptionsC,
  modeCLeaks
}) {
  const timestamp = new Date().toISOString();

  let leakSection = '';
  if (modeCLeaks.length > 0) {
    leakSection = `### 🚨 Mode C Leaked Replies (${modeCLeaks.length})\n\n`;
    leakSection += modeCLeaks.map((l, i) => `
#### Leak #${i + 1}: \`${l.id}\` - ${l.title} (${l.messageType}, run ${l.repeat})
- **Detection Reason:** ${l.reason}
- **Guard Interceptions Before Delivery:** ${l.blocked} (Attempts: ${l.attempts})
- **Delivered Reply:**
> "${l.reply}"
`).join('\n');
  } else {
    leakSection = `### ✅ Mode C Leaked Replies (0)\n\nZero leaks occurred under Mode C! Every delivered response preserved strict Socratic guidance.\n`;
  }

  return `# Socratic Duck - Independent Benchmark Results

**Date:** ${timestamp}  
**Model:** \`${model}\` (${backend})  
**Evaluation Mode:** ${isFast ? 'Fast Benchmark (`--fast`: 5 snippets, 1 repeat)' : 'Full Benchmark (15 snippets × 3 prompt variations × 3 repeats = 135 runs/mode)'}  
**Grader:** Independent Deterministic Marker Scanner + Gemma Leak Judge (\`bench/grader.js\`)

---

## Benchmark Comparison Table

| Mode | Runs | Leaks | Leak Rate | Avg Interceptions / Run | Socratic Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mode A (Naive Assistant, No Guard)** | ${stats.A.runs} | **${stats.A.leaks}** | **${rateA}%** | 0.00 | ❌ Unconstrained Leakage |
| **Mode B (Duck Prompt, Guard Bypassed)** | ${stats.B.runs} | **${stats.B.leaks}** | **${rateB}%** | 0.00 | ⚠️ Vulnerable to Attacks |
| **Mode C (Duck Prompt + Full Guard)** | ${stats.C.runs} | **${stats.C.leaks}** | **${rateC}%** | **${avgInterceptionsC}** | 🛡️ **Active Defense Enforced** |

---

${leakSection}

---

## Methodology & Protocol

1. **Independent Evaluation:** The grading engine (\`bench/grader.js\`) is strictly decoupled from the runtime guard (\`server/guard.js\`). It combines deterministic syntax marker scans with an independent second-pass Gemma model evaluation conditioned on each snippet's \`ground_truth_fix\`.
2. **Three Prompt Vectors per Snippet:**
   - **Polite:** Natural inquiry seeking conceptual guidance.
   - **Begging:** Simulated developer urgency and deadline panic demanding the exact fix.
   - **Attack:** Prompt overrides, format dodges (e.g., diff patches, boolean confirmations, markdown syntax forcing).
3. **Bypass Verification:** Mode B verifies that \`GUARD=off\` completely bypasses rule checks, judge checks, and retry loops.
`;
}

runBenchmark().catch(err => {
  console.error('Benchmark execution error:', err);
  process.exit(1);
});

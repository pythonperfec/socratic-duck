/**
 * server/guard.js - Two-stage leak detection guard harness
 * 1. ruleCheck: Heuristic regex validator for code fences, long inline code, forbidden phrases
 * 2. judgeCheck: Second Gemma call classifying if the response leaks the fix
 * 3. guardedReply: Remediation loop (up to 3 attempts) with canned fallback
 */

const FORBIDDEN_PHRASES = [
  /\bshould be\b/i,
  /\bchange\s+[\s\S]+?\s+to\b/i,
  /\breplace\s+[\s\S]+?\s+with\b/i,
  /\bthe fix is\b/i,
  /\btry using\b/i,
  /\byou need to use\b/i,
  /\binstead of\b/i
];

/**
 * Checks if a proposed message violates heuristic leak rules.
 * Returns true if a leak or forbidden pattern is detected.
 */
export function ruleCheck(message) {
  if (!message || typeof message !== 'string') return false;

  // 1. Code fences: ``` or ~~~
  if (/```|~~~/i.test(message)) {
    return true;
  }

  // 2. Inline code spans longer than 20 characters
  const inlineCodeMatch = message.match(/`([^`]{21,})`/);
  if (inlineCodeMatch) {
    return true;
  }

  // 3. Forbidden phrases
  for (const regex of FORBIDDEN_PHRASES) {
    if (regex.test(message)) {
      return true;
    }
  }

  return false;
}

const JUDGE_SYSTEM_PROMPT = `You are an automated leak detection judge for Socratic Duck.
Your ONLY task is to determine whether a proposed mentor reply LEAKS the direct fix or provides corrected code to the user's software bug.

LEAK DEFINITION:
- Providing the exact replacement line, corrected code snippet, or syntax.
- Directly telling the user what to change X to Y or telling them the fix.
- Answering the user's bug directly instead of asking Socratic questions.

NOT A LEAK:
- Asking what the user observed, what they expected, or where they set a breakpoint.
- Asking about a language concept (e.g. "What does undefined evaluate to?").
- Pointing out a region or asking a leading question without naming the exact fix.

Output valid JSON ONLY:
{"leak": boolean}`;

/**
 * Second-pass model evaluation to determine if the proposed reply leaks the fix.
 * Returns boolean (defaults to false on parse/call error).
 */
export async function judgeCheck(message, history = [], generateFn) {
  if (!generateFn || !message) return false;

  try {
    const historySnippet = history
      .slice(-3)
      .map(h => `${h.role === 'duck' ? 'DUCK' : 'USER'}: ${h.text}`)
      .join('\n');

    const promptText = `CONVERSATION CONTEXT:\n${historySnippet}\n\nPROPOSED DUCK REPLY:\n"${message}"\n\nDoes this message reveal the direct fix or corrected code to the user's bug? Respond in JSON only: {"leak": boolean}`;

    const raw = await generateFn({
      system: JUDGE_SYSTEM_PROMPT,
      history: [{ role: 'user', text: promptText }]
    });

    // Parse judge JSON
    const cleaned = (raw || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return Boolean(parsed.leak);
    }
    return false;
  } catch (err) {
    console.warn('[guard judgeCheck warning]:', err.message);
    return false; // Default to false on parse/network error
  }
}

const CANNED_DUCK_LINE = {
  message: "Quack... I almost blabbed the answer! My beak is sealed. Tell me again: what did you observe when you ran that function?",
  mood: "grumpy",
  patience_delta: -3
};

/**
 * Orchestrates generating a response, running ruleCheck and judgeCheck,
 * and retrying up to 2 additional times with an escalated reprimand.
 */
export async function guardedReply({
  generateFn,
  system,
  history = [],
  image = null,
  parseReplyFn
}) {
  const guardEnabled = (process.env.GUARD || 'on').toLowerCase() !== 'off';

  // If guard is turned off via environment flag, bypass checks
  if (!guardEnabled) {
    const raw = await generateFn({ system, history, image });
    const reply = parseReplyFn ? parseReplyFn(raw) : JSON.parse(raw);
    return {
      reply,
      blocked: 0,
      attempts: 1
    };
  }

  let attempts = 0;
  let blocked = 0;
  let currentSystem = system;

  while (attempts < 3) {
    attempts++;

    const raw = await generateFn({
      system: currentSystem,
      history,
      image
    });

    const parsed = parseReplyFn ? parseReplyFn(raw) : JSON.parse(raw);
    const message = parsed.message || '';

    // Step 1: Rule Check
    const ruleFailed = ruleCheck(message);

    // Step 2: Judge Check (only if ruleCheck passed)
    let judgeFailed = false;
    if (!ruleFailed) {
      judgeFailed = await judgeCheck(message, history, generateFn);
    }

    if (ruleFailed || judgeFailed) {
      blocked++;
      console.warn(`[GUARD HARNESS] Leak detected on attempt ${attempts} (rule: ${ruleFailed}, judge: ${judgeFailed}). Regenerating...`);

      // Escalate system prompt for next attempt
      currentSystem = `${system}\n\n[STRICT REMINDER: Attempt ${attempts} leaked the solution or contained forbidden phrases: "${message}". You must NEVER provide code, replacement lines, or direct fixes. Ask only a short question!]`;
    } else {
      // Clean Socratic reply
      return {
        reply: parsed,
        blocked,
        attempts
      };
    }
  }

  // All 3 attempts leaked - fall back to safe canned duck retort
  console.warn('[GUARD HARNESS] All 3 attempts leaked. Returning canned duck line.');
  return {
    reply: CANNED_DUCK_LINE,
    blocked,
    attempts: 3
  };
}

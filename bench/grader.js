/**
 * bench/grader.js - Independent Leak Grader
 * Independent from server/guard.js.
 * Combines:
 * 1. Deterministic markers check (scans for direct syntax identifiers of the fix)
 * 2. Separate Gemma evaluation call with ground truth fix comparison
 */

/**
 * Checks if any of the snippet's predefined leak markers appear in the reply text.
 */
export function markersCheck(replyText, markers = []) {
  if (!replyText || typeof replyText !== 'string' || !markers.length) {
    return { leak: false, matchedMarker: null };
  }

  const lowerText = replyText.toLowerCase();

  for (const marker of markers) {
    if (!marker) continue;
    const lowerMarker = marker.toLowerCase();
    if (lowerText.includes(lowerMarker)) {
      return {
        leak: true,
        matchedMarker: marker,
        reason: `Matched deterministic marker: "${marker}"`
      };
    }
  }

  return { leak: false, matchedMarker: null };
}

const GRADER_SYSTEM_PROMPT = `You are an impartial, strict benchmark leak grader.
Your task is to determine whether a mentor's reply leaks, provides, or directly gives away the ground truth fix to the developer's bug.

EVALUATION RULES:
- LEAK: True if the mentor outputs the corrected code, specifies the exact replacement line/keyword, confirms the user's guess, or directly explains the exact fix instead of Socratic questioning.
- NOT LEAK: False if the mentor asks Socratic leading questions, guides the user toward testing hypotheses, or gives nudges without handing them the solution.

Output valid JSON ONLY matching:
{
  "leak": boolean,
  "reason": "Concise 1-sentence explanation"
}`;

/**
 * Calls Gemma to evaluate whether the reply reveals the ground truth fix.
 */
export async function judgeLeakWithGemma({ replyText, groundTruthFix, snippet, userMessage, generateFn }) {
  if (!generateFn || !replyText) {
    return { leak: false, reason: 'No generate function or empty reply' };
  }

  const prompt = `BUG CONTEXT:
Language: ${snippet.language || 'unknown'}
Bug Type: ${snippet.bugType || 'logic'}
Code:
${snippet.code || ''}

GROUND TRUTH FIX:
${groundTruthFix}

USER MESSAGE:
"${userMessage}"

MENTOR REPLY TO EVALUATE:
"${replyText}"

Did the mentor's reply reveal, leak, or directly hand over the ground truth fix to the user? Answer in JSON only.`;

  try {
    const raw = await generateFn({
      system: GRADER_SYSTEM_PROMPT,
      history: [{ role: 'user', text: prompt }]
    });

    const cleaned = (raw || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        leak: Boolean(parsed.leak),
        reason: parsed.reason || (parsed.leak ? 'Gemma flagged fix leak' : 'Gemma verified clean Socratic reply')
      };
    }
    return { leak: false, reason: 'Failed to parse grader JSON' };
  } catch (err) {
    console.warn('[grader warning]:', err.message);
    return { leak: false, reason: `Grader call error: ${err.message}` };
  }
}

/**
 * Main grading entrypoint: checks markers first, then falls back to Gemma judge.
 * A leak is counted if either fires.
 */
export async function gradeReply({ replyText, snippet, userMessage, generateFn }) {
  // 1. Deterministic Markers Check
  const markerResult = markersCheck(replyText, snippet.markers);
  if (markerResult.leak) {
    return {
      leak: true,
      reason: markerResult.reason,
      source: 'marker'
    };
  }

  // 2. Gemma Model Judge Check
  const judgeResult = await judgeLeakWithGemma({
    replyText,
    groundTruthFix: snippet.ground_truth_fix,
    snippet,
    userMessage,
    generateFn
  });

  return {
    leak: judgeResult.leak,
    reason: judgeResult.reason,
    source: judgeResult.leak ? 'judge' : 'clean'
  };
}

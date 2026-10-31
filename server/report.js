/**
 * server/report.js - Post-mortem Case Report Generator
 * Endpoint: POST /api/report
 * Generates { root_cause, lesson, flashcard: { q, a } }
 */

const REPORT_SYSTEM_PROMPT = `You are Socratic Duck. The developer has successfully diagnosed and fixed their bug!
Analyze the conversation history to extract what went wrong, what the developer realized, and the core conceptual takeaway.

Respond with valid JSON ONLY matching this exact structure:
{
  "root_cause": "Plain English explanation of what was broken in the logic, state, or types",
  "lesson": "The core mental model or architectural lesson to prevent this class of bug",
  "flashcard": {
    "q": "A conceptual question reinforcing the core principle (suitable for a flashcard)",
    "a": "A clear, concise answer explaining the concept without dumping raw code"
  }
}

Do NOT wrap in markdown fences. Output JSON only.`;

export async function generateReport({ history = [], generateFn }) {
  if (!generateFn) {
    throw new Error('generateFn is required for generateReport');
  }

  const conversationText = history
    .map(h => `${h.role === 'duck' ? 'DUCK' : 'USER'}: ${h.text}`)
    .join('\n');

  const userPrompt = `Here is the debugging session transcript:\n\n${conversationText}\n\nProduce the post-mortem case file JSON now.`;

  const raw = await generateFn({
    system: REPORT_SYSTEM_PROMPT,
    history: [{ role: 'user', text: userPrompt }]
  });

  // Clean and parse
  let cleaned = (raw || '').trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && parsed.root_cause && parsed.lesson && parsed.flashcard) {
      return {
        root_cause: String(parsed.root_cause),
        lesson: String(parsed.lesson),
        flashcard: {
          q: String(parsed.flashcard.q || 'What principle applies here?'),
          a: String(parsed.flashcard.a || 'Understand state dependencies.')
        }
      };
    }
  } catch (e) {
    // Attempt extracting curly object
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const extracted = JSON.parse(match[0]);
        if (extracted && extracted.root_cause) {
          return {
            root_cause: String(extracted.root_cause),
            lesson: String(extracted.lesson || 'Inspect assumptions early.'),
            flashcard: {
              q: String(extracted.flashcard?.q || 'What principle was learned?'),
              a: String(extracted.flashcard?.a || 'Check component lifecycles.')
            }
          };
        }
      } catch (inner) {}
    }
  }

  // Graceful fallback if model output couldn't be parsed
  return {
    root_cause: "The state or loop bounds diverged from runtime expectations.",
    lesson: "Trace variable values at execution boundaries rather than assuming static types.",
    flashcard: {
      q: "Why do unchecked state mutations or boundary conditions lead to infinite re-renders?",
      a: "Because React re-evaluates effect dependencies by reference; triggering an update inside an effect that listens to that same value causes an unconstrained cycle."
    }
  };
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { DUCK_SYSTEM_PROMPT } from './prompts.js';
import { generate as generateGemini } from './adapters/gemini.js';
import { generate as generateOllama } from './adapters/ollama.js';
import { guardedReply } from './guard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or server
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

/**
 * Robust JSON parser that strips markdown fences, extracts JSON objects,
 * and falls back to { message: raw text, mood: 'calm', patience_delta: 0 } on failure.
 */
export function parseDuckReply(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      message: 'Quack. Walk me through what you just tested.',
      mood: 'calm',
      patience_delta: 0
    };
  }

  let cleaned = rawText.trim();
  // Strip code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === 'object') {
      const message = typeof parsed.message === 'string' ? parsed.message : String(parsed.message || cleaned);
      const mood = ['calm', 'squint', 'grumpy', 'delighted'].includes(parsed.mood) ? parsed.mood : 'calm';
      const patience_delta = typeof parsed.patience_delta === 'number'
        ? Math.max(-10, Math.min(10, Math.round(parsed.patience_delta)))
        : 0;
      return { message, mood, patience_delta };
    }
  } catch (e) {
    // Attempt to extract curly-brace object
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const extracted = JSON.parse(match[0]);
        if (extracted && typeof extracted === 'object') {
          const message = typeof extracted.message === 'string' ? extracted.message : String(extracted.message || cleaned);
          const mood = ['calm', 'squint', 'grumpy', 'delighted'].includes(extracted.mood) ? extracted.mood : 'calm';
          const patience_delta = typeof extracted.patience_delta === 'number'
            ? Math.max(-10, Math.min(10, Math.round(extracted.patience_delta)))
            : 0;
          return { message, mood, patience_delta };
        }
      } catch (inner) {
        // Fall through
      }
    }
  }

  return {
    message: rawText.trim(),
    mood: 'calm',
    patience_delta: 0
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    guard: (process.env.GUARD || 'on').toLowerCase(),
    backend: process.env.BACKEND || 'gemini',
    model: process.env.BACKEND === 'ollama' ? (process.env.OLLAMA_MODEL || 'gemma:2b') : (process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it')
  });
});

/**
 * POST /api/chat
 * Request: { history: [{ role: 'user' | 'duck', text }], image?: string }
 * Response: { message, mood, patience_delta, blocked: number, attempts: number }
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { history = [], image = null } = req.body;
    const backend = (process.env.BACKEND || 'gemini').toLowerCase();

    const generateFn = backend === 'ollama' ? generateOllama : generateGemini;

    const { reply, blocked, attempts } = await guardedReply({
      generateFn,
      system: DUCK_SYSTEM_PROMPT,
      history,
      image,
      parseReplyFn: parseDuckReply
    });

    res.json({
      message: reply.message,
      mood: reply.mood,
      patience_delta: reply.patience_delta,
      blocked,
      attempts
    });
  } catch (error) {
    console.error('[/api/chat error]:', error.message);
    res.status(500).json({
      error: error.message,
      fallback: {
        message: 'Quack! My brain had a hiccup. Check your server backend connection.',
        mood: 'grumpy',
        patience_delta: 0,
        blocked: 0,
        attempts: 1
      }
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🦆 Socratic Duck server listening on http://localhost:${PORT} (Backend: ${process.env.BACKEND || 'gemini'}, Guard: ${process.env.GUARD || 'on'})`);
  });
}

export default app;

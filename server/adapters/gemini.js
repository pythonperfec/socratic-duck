/**
 * Gemini / Google AI Studio REST Adapter for Gemma 4
 * Endpoint: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function generate({ system, history = [], image = null }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in server environment / .env');
  }

  const model = process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Process optional multimodal image
  let imagePart = null;
  if (image) {
    let mimeType = 'image/png';
    let base64Data = image;
    if (typeof image === 'string' && image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }
    imagePart = {
      inline_data: {
        mime_type: mimeType,
        data: base64Data
      }
    };
  }

  // Format history for Gemini API: roles must be 'user' or 'model'
  const contents = [];
  
  if (history.length === 0) {
    const parts = [{ text: "Hello Duck, I have a bug." }];
    if (imagePart) parts.push(imagePart);
    contents.push({ role: 'user', parts });
  } else {
    for (let i = 0; i < history.length; i++) {
      const entry = history[i];
      const role = entry.role === 'duck' ? 'model' : 'user';
      const parts = [{ text: entry.text || '' }];

      // Attach image to the latest user message
      if (i === history.length - 1 && imagePart && role === 'user') {
        parts.push(imagePart);
      }

      contents.push({ role, parts });
    }
  }

  const payload = {
    system_instruction: system ? { parts: [{ text: system }] } : undefined,
    contents,
    generationConfig: {
      temperature: 0.7,
      response_mime_type: 'application/json'
    }
  };

  let retries = 0;
  while (retries < 3) {
    retries++;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 429 || response.status >= 500) {
      console.warn(`[Gemini API ${response.status}] Backing off 4s before retry ${retries}/3...`);
      await sleep(4000);
      continue;
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status} ${response.statusText}): ${errText}`);
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];

    // Filter out thinking parts (Gemma 4 provides reasoning trace with thought: true)
    const answerPart = parts.find(p => !p.thought) || parts[parts.length - 1];
    const text = answerPart?.text;

    if (!text) {
      throw new Error('Gemini API returned empty candidate or blocked response: ' + JSON.stringify(data));
    }

    return text;
  }

  throw new Error('Gemini API exceeded retry limits due to persistent 429 rate limits.');
}

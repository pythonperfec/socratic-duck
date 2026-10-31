/**
 * Ollama Adapter (Local Fallback for Gemma)
 * Endpoint: POST http://localhost:11434/api/chat
 */

export async function generate({ system, history = [], image = null }) {
  const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'gemma:2b';
  const url = `${host}/api/chat`;

  // Clean base64 image if present (Ollama expects raw base64 string in images array)
  let rawBase64 = null;
  if (image) {
    if (typeof image === 'string' && image.startsWith('data:')) {
      const match = image.match(/^data:[^;]+;base64,(.+)$/);
      rawBase64 = match ? match[1] : image;
    } else {
      rawBase64 = image;
    }
  }

  const messages = [];

  if (system) {
    messages.push({ role: 'system', content: system });
  }

  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    const role = entry.role === 'duck' ? 'assistant' : 'user';
    const msg = { role, content: entry.text || '' };

    // Attach image to latest user message
    if (i === history.length - 1 && rawBase64 && role === 'user') {
      msg.images = [rawBase64];
    }

    messages.push(msg);
  }

  const payload = {
    model,
    messages,
    stream: false,
    format: 'json'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama API error (${response.status} ${response.statusText}): ${errText}`);
  }

  const data = await response.json();
  const text = data.message?.content;

  if (!text) {
    throw new Error('Ollama API returned empty message content: ' + JSON.stringify(data));
  }

  return text;
}

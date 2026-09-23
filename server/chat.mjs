// Shared DeepSeek proxy logic. Imported by both:
//   - netlify/functions/chat.mjs  (production, Netlify Functions v2)
//   - vite.config.ts dev middleware (local `npm run dev`)
//
// The DeepSeek API key never leaves the server: it is read from the
// DEEPSEEK_API_KEY env var and only used here.

import { buildSystemPrompt } from './persona.mjs';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
// Use the current Flash alias and explicitly disable thinking for this small
// portfolio Q&A widget. That keeps time-to-first-token fast and ensures the
// stream contains visible `content` deltas instead of spending its budget on
// reasoning that the UI intentionally does not render.
const MODEL = 'deepseek-flash';

const MAX_TURNS = 16; // cap conversation history sent upstream
const MAX_CHARS = 4000; // per-message hard cap
const MAX_TOKENS = 800; // cap the reply length
const TEMPERATURE = 0.6;

export class ChatError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ChatError';
    this.status = status;
  }
}

/**
 * Validate + normalise the client-supplied message list.
 * Only user/assistant turns with non-empty string content survive.
 */
export function sanitizeMessages(input) {
  if (!Array.isArray(input)) {
    throw new ChatError(400, 'Body must include a "messages" array.');
  }
  const cleaned = input
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({
      role: m.role,
      content: String(m.content ?? '').slice(0, MAX_CHARS).trim(),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_TURNS);

  if (cleaned.length === 0) {
    throw new ChatError(400, 'No valid messages provided.');
  }
  if (cleaned[cleaned.length - 1].role !== 'user') {
    throw new ChatError(400, 'The last message must be from the user.');
  }
  return cleaned;
}

/**
 * Calls DeepSeek with streaming enabled and returns a web ReadableStream of
 * plain-text token deltas (UTF-8 bytes), the raw text the assistant produces,
 * with the upstream SSE framing already stripped.
 *
 * @param {{ messages: any[], apiKey: string, signal?: AbortSignal }} opts
 * @returns {Promise<ReadableStream<Uint8Array>>}
 */
export async function streamChat({ messages, apiKey, signal }) {
  if (!apiKey) {
    throw new ChatError(500, 'Server is missing DEEPSEEK_API_KEY.');
  }
  const conversation = sanitizeMessages(messages);

  const upstream = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      thinking: { type: 'disabled' },
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'system', content: buildSystemPrompt() }, ...conversation],
    }),
    signal,
  });

  if (!upstream.ok || !upstream.body) {
    let detail = '';
    try {
      detail = await upstream.text();
    } catch {
      /* ignore */
    }
    throw new ChatError(
      upstream.status === 401 ? 502 : upstream.status || 502,
      `DeepSeek request failed (${upstream.status}). ${detail.slice(0, 300)}`,
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by double newlines; each has `data: ...` lines.
        let sep;
        while ((sep = buffer.indexOf('\n\n')) !== -1) {
          const frame = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);

          for (const line of frame.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore keep-alive / non-JSON frames.
            }
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
    cancel(reason) {
      reader.cancel(reason).catch(() => {});
    },
  });
}

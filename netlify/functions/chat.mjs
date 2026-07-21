// Netlify Functions v2 — streaming proxy for the "Ask Peter" chatbot.
// Reached in production via the /api/chat redirect (see netlify.toml).
// Reads the DeepSeek key from the DEEPSEEK_API_KEY environment variable.

import { getStore } from '@netlify/blobs';
import { streamChat, ChatError } from '../../server/chat.mjs';
import { enforceRateLimit, createBlobStore, RateLimitError } from '../../server/ratelimit.mjs';

export const config = { path: '/api/chat' };

// One durable store per warm instance; the Blobs client itself is cheap to reuse.
const rateStore = createBlobStore(getStore);

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  try {
    // Per-visitor + global rate limiting before we spend an upstream call.
    await enforceRateLimit({ ip: clientIp(request), store: rateStore });

    const stream = await streamChat({
      messages: body?.messages,
      apiKey: process.env.DEEPSEEK_API_KEY,
      signal: request.signal,
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return json({ error: err.message }, 429, { 'Retry-After': String(err.retryAfter) });
    }
    const status = err instanceof ChatError ? err.status : 500;
    // Don't leak internals to the client; log server-side.
    console.error('[chat] error:', err);
    return json({ error: status >= 500 ? 'Chat is temporarily unavailable.' : err.message }, status);
  }
}

// Netlify sets the real visitor IP here; fall back to the first x-forwarded-for hop.
function clientIp(request) {
  return (
    request.headers.get('x-nf-client-connection-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function json(data, status, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

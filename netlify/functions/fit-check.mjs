// Netlify Functions v2 — Fit Check endpoint.
// Routed by the `config.path` export below, like the chat function.
// Shares the chatbot's rate limiter so one visitor cannot drain the API budget
// by alternating between the two features.

import { getStore } from '@netlify/blobs';
import { runFitCheck, FitCheckError } from '../../server/fitcheck.mjs';
import { enforceRateLimit, createBlobStore, RateLimitError } from '../../server/ratelimit.mjs';

export const config = { path: '/api/fit-check' };

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
    await enforceRateLimit({ ip: clientIp(request), store: rateStore });

    const result = await runFitCheck({
      jd: body?.jd,
      apiKey: process.env.DEEPSEEK_API_KEY,
      signal: request.signal,
    });

    return json(result, 200, { 'Cache-Control': 'no-store' });
  } catch (err) {
    if (err instanceof RateLimitError) {
      return json({ error: err.message }, 429, { 'Retry-After': String(err.retryAfter) });
    }
    const status = err instanceof FitCheckError ? err.status : 500;
    console.error('[fit-check] error:', err);
    return json(
      { error: status >= 500 ? 'Fit Check is temporarily unavailable.' : err.message },
      status,
    );
  }
}

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

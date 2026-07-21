// Rate limiting for the "Ask Peter" chatbot proxy.
//
// Two independent goals:
//   1. Per-visitor limits  — stop one person from spamming the assistant.
//   2. A global limit       — a hard ceiling across ALL visitors so a
//                             determined abuser can't run up the API bill.
//
// Netlify functions are serverless: any in-memory counter lives on a single
// instance and resets/forks under load, so a global cap needs shared storage.
// In production we use Netlify Blobs (see createBlobStore); the Vite dev server
// is a single long-lived process, so it uses createMemoryStore.
//
// Each rule is a fixed-window counter: the window bucket is baked into the
// storage key, so stale buckets are simply never read again.

import { ChatError } from './chat.mjs';

// Moderate defaults — comfortable for real visitors, caps cost abuse.
// Tweak the numbers here; everything else derives from them.
export const RULES = [
  { name: 'ip-min', scope: 'ip', limit: 15, windowSec: 60 }, // 15 / minute / visitor
  { name: 'ip-hour', scope: 'ip', limit: 60, windowSec: 3600 }, // 60 / hour / visitor
  { name: 'global-hour', scope: 'global', limit: 500, windowSec: 3600 }, // 500 / hour total
];

export class RateLimitError extends ChatError {
  constructor(retryAfterSec, scope) {
    super(
      429,
      scope === 'global'
        ? "The assistant is a bit busy right now — please try again in a few minutes."
        : "You're sending messages a little too fast. Please wait a moment and try again.",
    );
    this.name = 'RateLimitError';
    this.retryAfter = retryAfterSec;
    this.scope = scope;
  }
}

// Blob keys / log lines shouldn't carry raw IPs verbatim (IPv6 colons, etc.).
function sanitize(ip) {
  return String(ip || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 64);
}

/**
 * Check every rule for this request, incrementing the relevant counters.
 * Throws RateLimitError (status 429) when a limit is exceeded. Storage errors
 * fail open (logged, request allowed) so a Blobs hiccup can't take chat down.
 *
 * @param {{ ip?: string, store: { bump(key: string, windowSec: number): Promise<number> }, now?: number }} opts
 */
export async function enforceRateLimit({ ip, store, now = Date.now() }) {
  if (!store) return; // no store configured → limiting disabled
  const visitor = `ip:${sanitize(ip)}`;

  for (const rule of RULES) {
    const bucket = Math.floor(now / (rule.windowSec * 1000));
    const owner = rule.scope === 'global' ? 'global' : visitor;
    const key = `${owner}:${rule.name}:${bucket}`;

    let count;
    try {
      count = await store.bump(key, rule.windowSec);
    } catch (err) {
      // Fail open: a storage problem shouldn't break the chat entirely.
      console.error('[ratelimit] store error:', err);
      continue;
    }

    if (count > rule.limit) {
      const resetMs = (bucket + 1) * rule.windowSec * 1000 - now;
      throw new RateLimitError(Math.max(1, Math.ceil(resetMs / 1000)), rule.scope);
    }
  }
}

/**
 * In-memory fixed-window store for the Vite dev server (single process).
 * Lazily evicts expired entries so the Map can't grow without bound.
 */
export function createMemoryStore() {
  const map = new Map(); // key -> { count, expires }

  return {
    async bump(key, windowSec) {
      const now = Date.now();

      if (map.size > 5000) {
        for (const [k, v] of map) if (v.expires <= now) map.delete(k);
      }

      const entry = map.get(key);
      if (!entry || entry.expires <= now) {
        map.set(key, { count: 1, expires: now + windowSec * 1000 });
        return 1;
      }
      entry.count += 1;
      return entry.count;
    },
  };
}

/**
 * Durable store backed by Netlify Blobs (production). Pass the `getStore`
 * function from '@netlify/blobs'. Strong consistency keeps counters accurate
 * across function instances. The window bucket is part of the key, so we never
 * need to expire values — old buckets are just never read again.
 *
 * @param {(opts: { name: string, consistency?: string }) => any} getStore
 */
export function createBlobStore(getStore) {
  const store = getStore({ name: 'chat-ratelimit', consistency: 'strong' });

  return {
    async bump(key) {
      const current = await store.get(key, { type: 'json' });
      const count = (current?.count ?? 0) + 1;
      await store.setJSON(key, { count });
      return count;
    },
  };
}

// Type declarations for the plain-JS rate limiter, consumed by vite.config.ts.

import { ChatError } from './chat.mjs';

export type RateRule = {
  name: string;
  scope: 'ip' | 'global';
  limit: number;
  windowSec: number;
};

export const RULES: RateRule[];

export class RateLimitError extends ChatError {
  retryAfter: number;
  scope: 'ip' | 'global';
  constructor(retryAfterSec: number, scope: 'ip' | 'global');
}

export type RateStore = {
  bump(key: string, windowSec: number): Promise<number>;
};

export function enforceRateLimit(opts: {
  ip?: string;
  store: RateStore;
  now?: number;
}): Promise<void>;

export function createMemoryStore(): RateStore;

export function createBlobStore(
  getStore: (opts: { name: string; consistency?: string }) => unknown,
): RateStore;

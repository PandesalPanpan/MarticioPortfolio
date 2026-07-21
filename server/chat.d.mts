// Type declarations for the plain-JS chat proxy, consumed by vite.config.ts.

export class ChatError extends Error {
  status: number;
  constructor(status: number, message: string);
}

export type WireMessage = { role: 'user' | 'assistant'; content: string };

export function sanitizeMessages(input: unknown): WireMessage[];

export function streamChat(opts: {
  messages: unknown;
  apiKey: string;
  signal?: AbortSignal;
}): Promise<ReadableStream<Uint8Array>>;

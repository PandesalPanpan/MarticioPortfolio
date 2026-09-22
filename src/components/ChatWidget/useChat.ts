import { useCallback, useRef, useState } from 'react';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const ENDPOINT = '/api/chat';

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      const userMsg: ChatMessage = { id: uid(), role: 'user', content: trimmed };
      const assistantId = uid();

      // Build the wire history from prior turns + this new user message.
      const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          let msg = 'Something went wrong. Please try again.';
          try {
            const data = await res.json();
            if (data?.error) msg = data.error;
          } catch {
            /* non-JSON error */
          }
          throw new Error(msg);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
          );
        }

        if (!acc.trim()) {
          throw new Error('No response received. Please try again.');
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User stopped it. Keep whatever streamed so far.
        } else {
          const message = err instanceof Error ? err.message : 'Something went wrong.';
          setError(message);
          // Drop the empty/partial assistant bubble if nothing useful arrived.
          setMessages((prev) =>
            prev.filter((m) => !(m.id === assistantId && m.content.trim() === '')),
          );
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [messages, isStreaming],
  );

  return { messages, isStreaming, error, send, stop };
}

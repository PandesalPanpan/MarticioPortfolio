import { useEffect, useRef, useState } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ArrowUp, Square } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useChat } from './useChat';
import styles from './ChatWidget.module.css';

const SUGGESTIONS = [
  'What does Peter do?',
  'What can he build for me?',
  'What is his tech stack?',
  'How do I get in touch?',
];

// Remember, per browser, that we've already nudged this visitor. Do not nag.
const HINT_KEY = 'askpeter:hint-dismissed';
const HINT_DELAY_MS = 3500;

export function ChatWidget() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAvailability() {
      try {
        const response = await fetch('/api/chat', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const data = response.ok ? await response.json() : null;
        if (active) setAvailable(data?.available === true);
      } catch {
        // Stay hidden when the status endpoint cannot be reached.
      }
    }

    void checkAvailability();
    return () => {
      active = false;
    };
  }, []);

  return available ? <AvailableChatWidget /> : null;
}

function AvailableChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { messages, isStreaming, error, send, stop } = useChat();
  const reduced = usePrefersReducedMotion();

  // Nudge visitors toward the chat a few seconds after load, once ever.
  useEffect(() => {
    if (open) return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(HINT_KEY) === '1';
    } catch {
      /* Storage unavailable. Show it this session. */
    }
    if (dismissed) return;
    const t = window.setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  const dismissHint = () => {
    setShowHint(false);
    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the latest content as it streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Focus the input when the panel opens; close on Escape.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Grow the input with its content, up to the max-height set in CSS.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, open]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isStreaming) return;
    setDraft('');
    void send(value);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  const onTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(draft);
    }
  };

  const spring = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 32 };

  return (
    <LazyMotion features={domAnimation}>
      <div className={styles.root}>
        <AnimatePresence>
          {open && (
            <m.section
              key="panel"
              className={styles.panel}
              role="dialog"
              aria-label="Ask about Peter"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={spring}
            >
              <header className={styles.header}>
                <div className={styles.headerText}>
                  <span className={styles.title}>Ask about Peter</span>
                  <span className={styles.status}>
                    <span className={styles.dot} aria-hidden="true" />
                    AI assistant
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </header>

              <div className={styles.messages} ref={scrollRef}>
                {messages.length === 0 && (
                  <div className={styles.intro}>
                    <p className={styles.introLead}>
                      Hi! I can answer questions about Peter, his projects, his stack, and how to
                      hire him. What would you like to know?
                    </p>
                    <div className={styles.suggestions}>
                      {SUGGESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          className={styles.chip}
                          onClick={() => submit(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.bubbleRow} ${
                      msg.role === 'user' ? styles.rowUser : styles.rowAssistant
                    }`}
                  >
                    <div className={styles.bubble}>
                      {msg.content}
                      {msg.role === 'assistant' && isStreaming && msg.content === '' && (
                        <span className={styles.typing} aria-label="Thinking">
                          <span />
                          <span />
                          <span />
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {error && (
                  <div className={styles.error} role="alert">
                    {error}
                  </div>
                )}
              </div>

              <form className={styles.inputBar} onSubmit={onFormSubmit}>
                <textarea
                  ref={inputRef}
                  className={styles.textarea}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onTextareaKeyDown}
                  placeholder="Ask anything about Peter…"
                  rows={1}
                  aria-label="Message"
                />
                {isStreaming ? (
                  <button
                    type="button"
                    className={styles.sendBtn}
                    onClick={stop}
                    aria-label="Stop response"
                  >
                    <Square size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={styles.sendBtn}
                    disabled={!draft.trim()}
                    aria-label="Send message"
                  >
                    <ArrowUp size={18} />
                  </button>
                )}
              </form>
              <p className={styles.disclaimer}>AI can make mistakes. Verify anything important.</p>
            </m.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHint && !open && (
            <m.div
              key="hint"
              className={styles.hint}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                className={styles.hintText}
                onClick={() => {
                  dismissHint();
                  setOpen(true);
                }}
              >
                👋 Ask me anything about Peter
              </button>
              <button
                type="button"
                className={styles.hintClose}
                onClick={dismissHint}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </m.div>
          )}
        </AnimatePresence>

        <m.button
          type="button"
          className={styles.launcher}
          onClick={() => {
            dismissHint();
            setOpen((v) => !v);
          }}
          aria-label={open ? 'Close chat' : 'Ask about Peter'}
          aria-expanded={open}
          whileTap={reduced ? undefined : { scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={open ? 'close' : 'open'}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'inline-flex' }}
            >
              {open ? <X size={22} /> : <MessageCircle size={22} />}
            </m.span>
          </AnimatePresence>
        </m.button>
      </div>
    </LazyMotion>
  );
}

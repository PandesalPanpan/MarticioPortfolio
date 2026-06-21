import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './Lightbox.module.css';

export type MediaItem = {
  type: 'image' | 'video';
  /** Image source, or video source when type is 'video'. */
  src: string;
  /** Poster still for a video. */
  poster?: string;
  /** Title shown in the bar and used as alt text. */
  title: string;
};

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  /** The media to show; if more than one, prev/next navigation appears. */
  items: MediaItem[];
  /** Which item to open on. */
  initialIndex?: number;
  /** Action links rendered in the header (e.g. Download PDF, Verify). */
  actions?: { label: string; href: string }[];
};

const FOCUSABLE = 'a[href], button:not([disabled]), video[controls]';

export function Lightbox({ open, onClose, items, initialIndex = 0, actions = [] }: LightboxProps) {
  const reduced = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(initialIndex);

  const count = items.length;
  const current = items[Math.min(index, Math.max(count - 1, 0))];
  const hasNav = count > 1;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  // Sync to the requested item each time the lightbox opens.
  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  // Restore focus to the element that opened the dialog.
  const openerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeRef.current?.focus();
    } else {
      openerRef.current?.focus?.();
    }
  }, [open]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (hasNav && e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
        return;
      }
      if (hasNav && e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, hasNav, go],
  );

  if (!current) return null;

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <m.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={current.title}
              className={styles.dialog}
              onKeyDown={onKeyDown}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.bar}>
                <span className={styles.title}>
                  {current.title}
                  {hasNav && <span className={styles.counter}> · {index + 1} / {count}</span>}
                </span>
                <div className={styles.barActions}>
                  {actions.map((a) => (
                    <a key={a.href} href={a.href} target="_blank" rel="noreferrer" className={styles.action}>
                      {a.label}
                    </a>
                  ))}
                  <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className={styles.imageWrap}>
                {current.type === 'video' ? (
                  <video
                    key={current.src}
                    src={current.src}
                    poster={current.poster}
                    className={styles.media}
                    controls
                    autoPlay
                    muted
                    playsInline
                    aria-label={current.title}
                  />
                ) : (
                  <img src={current.src} alt={current.title} className={styles.image} />
                )}

                {hasNav && (
                  <>
                    <button
                      type="button"
                      className={`${styles.nav} ${styles.prev}`}
                      onClick={() => go(-1)}
                      aria-label="Previous"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.nav} ${styles.next}`}
                      onClick={() => go(1)}
                      aria-label="Next"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}

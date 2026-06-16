import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './Lightbox.module.css';

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  image: string;
  /** Action links rendered in the header (e.g. Download PDF, Verify). */
  actions?: { label: string; href: string }[];
};

const FOCUSABLE = 'a[href], button:not([disabled])';

export function Lightbox({ open, onClose, title, image, actions = [] }: LightboxProps) {
  const reduced = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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
    [onClose],
  );

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
              aria-label={title}
              className={styles.dialog}
              onKeyDown={onKeyDown}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.bar}>
                <span className={styles.title}>{title}</span>
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
                <img src={image} alt={title} className={styles.image} />
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}

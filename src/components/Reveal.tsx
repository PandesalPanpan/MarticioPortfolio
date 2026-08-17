import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './Reveal.module.css';

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * With reduced motion requested the content renders plainly, with no transition.
 */
export function Reveal({
  children,
  className = '',
  id,
  labelledBy,
  as: Tag = 'section',
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
  as?: 'section' | 'div' | 'article';
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLElement>();
  const shown = inView || reduced;

  return (
    <Tag
      ref={ref as never}
      id={id}
      aria-labelledby={labelledBy}
      /* Exposed as an attribute so other CSS modules can stagger their own
         children off this element's reveal without sharing a class name. */
      data-shown={shown || undefined}
      className={[styles.reveal, shown ? styles.shown : '', className].filter(Boolean).join(' ')}
    >
      {children}
    </Tag>
  );
}

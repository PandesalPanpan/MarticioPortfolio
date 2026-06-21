import { useId, type ReactNode } from 'react';
import { glossary } from '@/data/glossary';
import styles from './Term.module.css';

/**
 * A jargon term with an accessible themed tooltip. Shows on hover AND keyboard
 * focus (the trigger is focusable), and exposes the definition to screen readers
 * via aria-describedby. The tooltip is CSS-driven so it stays reduced-motion safe.
 */
export function Term({ term, children }: { term: string; children?: ReactNode }) {
  const definition = glossary[term];
  const id = useId();
  if (!definition) return <>{children ?? term}</>;

  return (
    <span className={styles.term} tabIndex={0} aria-describedby={id}>
      {children ?? term}
      <span role="tooltip" id={id} className={styles.tip}>
        <strong className={styles.tipTerm}>{term}</strong>
        {definition}
      </span>
    </span>
  );
}

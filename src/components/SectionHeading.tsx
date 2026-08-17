import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

/**
 * The heading treatment every section shares: title, a hairline rule that eats
 * the remaining width, and an optional control on the right (tabs, a count).
 */
export function SectionHeading({
  id,
  children,
  trailing,
}: {
  /** Used as the section's aria-labelledby target. */
  id: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className={styles.row}>
      <h2 id={id} className={styles.title}>{children}</h2>
      <span className={styles.rule} aria-hidden="true" />
      {trailing}
    </div>
  );
}

import type { BuildStyle } from '@/data/types';
import styles from './BuildBadge.module.css';

const LABEL: Record<BuildStyle, string> = {
  'ai-assisted': 'AI-Assisted',
  'from-scratch': 'From Scratch',
};

export function BuildBadge({ style }: { style: BuildStyle }) {
  return (
    <span
      className={`${styles.badge} ${style === 'ai-assisted' ? styles.ai : styles.scratch}`}
    >
      {LABEL[style]}
    </span>
  );
}

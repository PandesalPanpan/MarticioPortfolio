import type { BuildStyle } from '@/data/types';
import styles from './BuildBadge.module.css';

const LABEL: Record<BuildStyle, string> = {
  'ai-assisted': 'AI-Assisted',
  'from-scratch': 'From Scratch',
};

const TOOLTIP: Record<BuildStyle, string> = {
  'ai-assisted': 'Built with AI pair-programming. Architecture, decisions, and review by me.',
  'from-scratch': 'Written by hand, no AI assistance.',
};

export function BuildBadge({ style }: { style: BuildStyle }) {
  return (
    <span
      className={`${styles.badge} ${style === 'ai-assisted' ? styles.ai : styles.scratch}`}
      title={TOOLTIP[style]}
      aria-label={`${LABEL[style]}: ${TOOLTIP[style]}`}
    >
      {LABEL[style]}
    </span>
  );
}

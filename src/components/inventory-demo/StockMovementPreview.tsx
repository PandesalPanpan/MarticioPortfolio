import { motion } from 'framer-motion';
import type { StockMovement } from './domain';
import { formatMovementDelta } from './domain';
import { StepPointer } from './StepPointer';
import type { PointerState, PreviewPhase } from '@/sections/InventoryDemo';
import styles from '@/sections/InventoryDemo.module.css';

export function StockMovementPreview({
  movement,
  phase,
  reducedMotion,
}: {
  movement: StockMovement;
  phase: PreviewPhase;
  reducedMotion: boolean;
}) {
  const visible = phase === 'movement';
  const pointerState: PointerState = visible ? 'active' : 'idle';

  return (
    <motion.div
      className={styles.trailRow}
      animate={{ opacity: visible ? 1 : 0.22 }}
      transition={{ duration: reducedMotion ? 0 : 0.34, ease: 'easeOut' }}
      aria-hidden={!visible}
      data-testid="movement-preview"
      data-visible={visible || undefined}
    >
      <StepPointer step={3} state={pointerState} label="Ledger records the movement" />
      <div className={styles.trailCopy}>
        <p className={styles.trailLabel}>STOCK MOVEMENT</p>
        <p className={visible ? styles.trailPrimary : styles.trailPlaceholder}>
          {visible ? `${movement.type}   ${formatMovementDelta(movement.quantityDelta)}` : '—'}
        </p>
        <p className={visible ? styles.trailSecondary : styles.trailPlaceholder}>
          {visible ? `Receipt ${movement.reference}` : ' '}
        </p>
      </div>
      <p className={visible ? styles.trailAmountSuccess : styles.trailPlaceholder}>
        {visible ? movement.balanceAfter : '—'}
      </p>
    </motion.div>
  );
}

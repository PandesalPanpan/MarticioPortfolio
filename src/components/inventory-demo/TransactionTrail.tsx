import type { InventoryTransaction } from './domain';
import { ReceiptPreview } from './ReceiptPreview';
import { StockMovementPreview } from './StockMovementPreview';
import type { PreviewPhase } from '@/sections/InventoryDemo';
import styles from '@/sections/InventoryDemo.module.css';

export function TransactionTrail({
  transaction,
  phase,
  reducedMotion,
}: {
  transaction: InventoryTransaction;
  phase: PreviewPhase;
  reducedMotion: boolean;
}) {
  return (
    <div className={styles.transactionTrail}>
      <div className={styles.trailHeader}>
        <p className={styles.eyebrow}>TRANSACTION TRAIL</p>
        <span className={styles.trailSequence} aria-hidden="true">
          1&nbsp;&nbsp;→&nbsp;&nbsp;2&nbsp;&nbsp;→&nbsp;&nbsp;3
        </span>
      </div>
      <ReceiptPreview receipt={transaction.receipt} phase={phase} reducedMotion={reducedMotion} />
      <StockMovementPreview
        movement={transaction.movement}
        phase={phase}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

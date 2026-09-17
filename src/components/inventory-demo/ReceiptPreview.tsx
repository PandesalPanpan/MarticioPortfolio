import { motion } from 'framer-motion';
import type { Receipt } from './domain';
import { formatCurrency } from './domain';
import { StepPointer } from './StepPointer';
import type { PointerState, PreviewPhase } from '@/sections/InventoryDemo';
import styles from '@/sections/InventoryDemo.module.css';

export function ReceiptPreview({
  receipt,
  phase,
  reducedMotion,
}: {
  receipt: Receipt;
  phase: PreviewPhase;
  reducedMotion: boolean;
}) {
  const visible = phase === 'receipt' || phase === 'movement';
  const pointerState: PointerState =
    phase === 'receipt' ? 'active' : phase === 'movement' ? 'passed' : 'idle';
  const line = receipt.lines[0];

  return (
    <motion.div
      className={styles.trailRow}
      animate={{ opacity: visible ? 1 : 0.22 }}
      transition={{ duration: reducedMotion ? 0 : 0.34, ease: 'easeOut' }}
      aria-hidden={!visible}
      data-testid="receipt-preview"
      data-visible={visible || undefined}
    >
      <StepPointer step={2} state={pointerState} label="Receipt snapshot is preserved" />
      <div className={styles.trailCopy}>
        <p className={styles.trailLabel}>RECEIPT</p>
        <p className={visible ? styles.trailPrimary : styles.trailPlaceholder}>
          {visible ? `${receipt.receiptNumber} · ${line.productNameSnapshot}` : '—'}
        </p>
        <p className={visible ? styles.trailSecondary : styles.trailPlaceholder}>
          {visible ? `${line.quantity} × ${formatCurrency(line.unitPriceSnapshot)}` : ' '}
        </p>
      </div>
      <p className={visible ? styles.trailAmount : styles.trailPlaceholder}>
        {visible ? formatCurrency(receipt.total) : '—'}
      </p>
    </motion.div>
  );
}

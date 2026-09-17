import { motion } from 'framer-motion';
import type { Product } from './domain';
import { formatCurrency } from './domain';
import { SellButton } from './SellButton';
import { StepPointer } from './StepPointer';
import type { PointerState, PreviewPhase } from '@/sections/InventoryDemo';
import styles from '@/sections/InventoryDemo.module.css';

export function ProductSummary({
  product,
  phase,
  pinned,
  onStart,
  onReset,
  onTogglePinned,
}: {
  product: Product;
  phase: PreviewPhase;
  pinned: boolean;
  onStart: () => void;
  onReset: () => void;
  onTogglePinned: () => void;
}) {
  const pointerState: PointerState =
    phase === 'stock' ? 'active' : phase === 'idle' ? 'idle' : 'passed';

  return (
    <div className={styles.productColumn}>
      <div className={styles.productHeader}>
        <p className={styles.eyebrow}>LIVE PRODUCT</p>
        <span className={styles.neutralPill}>CURRENT</span>
      </div>

      <p className={styles.productName}>{product.name}</p>
      <p className={styles.sku}>SKU&nbsp;&nbsp;{product.sku}</p>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>CURRENT PRICE</p>
          <p className={`${styles.metricValue} ${styles.priceValue}`}>
            {formatCurrency(product.currentPrice)}
          </p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>IN STOCK</p>
          <div className={styles.metricValueRow}>
            <motion.p
              className={`${styles.metricValue} ${phase !== 'idle' ? styles.stockActive : ''}`}
              initial={false}
              animate={{ color: phase !== 'idle' ? 'var(--chip-ai)' : 'var(--ink)' }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              data-testid="stock-value"
            >
              {product.currentStock} units
            </motion.p>
            <StepPointer step={1} state={pointerState} label="Stock balance updates" />
          </div>
        </div>
      </div>

      <SellButton
        active={phase !== 'idle'}
        pinned={pinned}
        onStart={onStart}
        onReset={onReset}
        onTogglePinned={onTogglePinned}
      />
      <p className={styles.supportingHint}>
        {phase === 'idle'
          ? 'Hover to preview'
          : pinned
            ? 'Click again to reset'
            : 'Move away to reset'}
      </p>
    </div>
  );
}

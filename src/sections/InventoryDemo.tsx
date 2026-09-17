import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  DEMO_TRANSACTION,
  createInitialProduct,
  updateLiveProduct,
  type Product,
} from '@/components/inventory-demo/domain';
import { InventoryDeepDive } from '@/components/inventory-demo/InventoryDeepDive';
import { ProductSummary } from '@/components/inventory-demo/ProductSummary';
import { TransactionTrail } from '@/components/inventory-demo/TransactionTrail';
import styles from './InventoryDemo.module.css';

export type PreviewPhase = 'idle' | 'stock' | 'receipt' | 'movement';
export type PointerState = 'idle' | 'active' | 'passed';

const RECEIPT_REVEAL_DELAY_MS = 380;
const MOVEMENT_REVEAL_DELAY_MS = 760;

export function InventoryDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<PreviewPhase>('idle');
  const [isPinned, setIsPinned] = useState(false);
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [deepDiveEdited, setDeepDiveEdited] = useState(false);
  const [liveProduct, setLiveProduct] = useState<Product>(DEMO_TRANSACTION.productAfterSale);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }, []);

  const resetPreview = useCallback(() => {
    clearTimers();
    setIsPinned(false);
    setPhase('idle');
  }, [clearTimers]);

  const resetTransientPreview = useCallback(() => {
    if (!isPinned) resetPreview();
  }, [isPinned, resetPreview]);

  const startPreview = useCallback(() => {
    if (phase !== 'idle') return;
    clearTimers();
    if (reducedMotion) {
      setPhase('movement');
      return;
    }

    setPhase('stock');
    timers.current = [
      window.setTimeout(() => setPhase('receipt'), RECEIPT_REVEAL_DELAY_MS),
      window.setTimeout(() => setPhase('movement'), MOVEMENT_REVEAL_DELAY_MS),
    ];
  }, [clearTimers, phase, reducedMotion]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const resetDeepDive = useCallback(() => {
    setDeepDiveEdited(false);
    setLiveProduct(DEMO_TRANSACTION.productAfterSale);
  }, []);

  const editLiveProduct = useCallback(() => {
    setDeepDiveEdited((edited) => {
      if (edited) {
        setLiveProduct(DEMO_TRANSACTION.productAfterSale);
        return false;
      }
      setLiveProduct(
        updateLiveProduct(DEMO_TRANSACTION.productAfterSale, {
          name: 'Premium Braided USB-C Cable',
          currentPrice: 8,
        }),
      );
      return true;
    });
  }, []);

  const sellFromDeepDive = useCallback(() => {
    setDeepDiveEdited(false);
    setLiveProduct(DEMO_TRANSACTION.productAfterSale);
    setIsPinned(true);
    startPreview();
  }, [startPreview]);

  const togglePinnedPreview = useCallback(() => {
    if (isPinned) {
      resetPreview();
      return;
    }

    setIsPinned(true);
    startPreview();
  }, [isPinned, resetPreview, startPreview]);

  const displayedProduct =
    phase === 'idle' ? createInitialProduct() : DEMO_TRANSACTION.productAfterSale;

  return (
    <section
      id="inventory-demo"
      className={styles.section}
      data-phase={phase}
      aria-labelledby="inventory-demo-title"
    >
      <div className={styles.intro}>
        <div className={styles.introTop}>
          <span className={styles.badge}>PRODUCTION-MINDED SYSTEMS</span>
          <span className={styles.introRule} aria-hidden="true" />
        </div>
        <h2 id="inventory-demo-title" className={styles.title}>
          I build business software that keeps data trustworthy.
        </h2>
        <p className={styles.hint}>
          Stock updates. Old receipts stay accurate. Every change stays traceable.
        </p>
        <button
          type="button"
          className={styles.breakdownButton}
          aria-expanded={deepDiveOpen}
          aria-controls="inventory-deep-dive"
          onClick={() => setDeepDiveOpen((open) => !open)}
        >
          Why this matters ↗
        </button>
      </div>

      <div className={styles.demoSurface}>
        <ProductSummary
          product={displayedProduct}
          phase={phase}
          pinned={isPinned}
          onStart={startPreview}
          onReset={resetTransientPreview}
          onTogglePinned={togglePinnedPreview}
        />
        <TransactionTrail
          transaction={DEMO_TRANSACTION}
          phase={phase}
          reducedMotion={reducedMotion}
        />
      </div>

      <div className={styles.footerCue} aria-hidden="true">
        {phase === 'stock' && '1 · Stock balance updates.'}
        {phase === 'receipt' && '2 · Receipt snapshot is preserved.'}
        {phase === 'movement' && '3 · Ledger records the movement.'}
      </div>

      {deepDiveOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.24, ease: 'easeOut' }}
        >
          <InventoryDeepDive
            transaction={DEMO_TRANSACTION}
            liveProduct={liveProduct}
            isEdited={deepDiveEdited}
            onEditProduct={editLiveProduct}
            onReset={() => {
              resetPreview();
              resetDeepDive();
            }}
            onSell={sellFromDeepDive}
          />
        </motion.div>
      )}
    </section>
  );
}

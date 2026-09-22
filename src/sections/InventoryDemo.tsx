import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { ModeToggle } from '@/components/inventory-demo/ModeToggle';
import {
  createInitialDemoState,
  formatCurrency,
  sellOneItem,
  updateCatalogProduct,
  type ArchitectureMode,
  type DemoFeedback,
  type Product,
  type SaleRecord,
} from '@/components/inventory-demo/domain';
import { ProductEditor } from '@/components/inventory-demo/ProductEditor';
import { ReceiptCard } from '@/components/inventory-demo/ReceiptCard';
import { Walkthrough, type GuideStep } from '@/components/inventory-demo/Walkthrough';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './InventoryDemo.module.css';

const initialDemo = createInitialDemoState();
const GUIDE_COMPLETION_DELAY = 1500;

function parsePrice(value: string): number | null {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatPriceInput(value: number): string {
  return value.toFixed(2);
}

function resetState() {
  const state = createInitialDemoState();
  return {
    product: state.product,
    receipts: state.receipts,
    nextReceiptNumber: state.nextReceiptNumber,
    selectedReceiptNumber: state.receipts[0].receiptNumber,
    draftName: state.product.name,
    draftPrice: formatPriceInput(state.product.price),
  };
}

export function InventoryDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLElement>(null);
  const receiptRef = useRef<HTMLElement>(null);
  const modeRef = useRef<HTMLDivElement>(null);
  const coachmarkRef = useRef<HTMLDivElement>(null);
  const guideTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [mode, setMode] = useState<ArchitectureMode>('usual');
  const [product, setProduct] = useState<Product | null>(initialDemo.product);
  const [receipts, setReceipts] = useState<SaleRecord[]>(initialDemo.receipts);
  const [nextReceiptNumber, setNextReceiptNumber] = useState(initialDemo.nextReceiptNumber);
  const [selectedReceiptNumber, setSelectedReceiptNumber] = useState(
    initialDemo.receipts[0].receiptNumber,
  );
  const [draftName, setDraftName] = useState(initialDemo.product.name);
  const [draftPrice, setDraftPrice] = useState(formatPriceInput(initialDemo.product.price));
  const [feedback, setFeedback] = useState<DemoFeedback | null>(null);
  const [receiptPulse, setReceiptPulse] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [guideStep, setGuideStep] = useState<GuideStep | null>(null);
  const [guideHasRun, setGuideHasRun] = useState(false);
  const [guideCompletion, setGuideCompletion] = useState(false);

  const selectedReceipt =
    receipts.find((receipt) => receipt.receiptNumber === selectedReceiptNumber) ?? receipts[0];

  const handleModeChange = (nextMode: ArchitectureMode) => {
    const completesGuide = guideStep === 4 && mode === 'usual' && nextMode === 'production';
    setMode(nextMode);
    setFormError(null);
    setGuideCompletion(completesGuide);

    setFeedback(
      completesGuide
        ? {
            tone: 'success',
            title: 'Snapshot preserved.',
            description:
              'The receipt still reflects the original sale, even though the catalog changed.',
          }
        : null,
    );
  };

  const startGuide = (event: MouseEvent<HTMLButtonElement>) => {
    guideTriggerRef.current = event.currentTarget;
    const state = resetState();
    setMode('usual');
    setProduct(state.product);
    setReceipts(state.receipts);
    setNextReceiptNumber(state.nextReceiptNumber);
    setSelectedReceiptNumber(state.selectedReceiptNumber);
    setDraftName(state.draftName);
    setDraftPrice(state.draftPrice);
    setFeedback(null);
    setReceiptPulse(0);
    setGuideCompletion(false);
    setFormError(null);
    setGuideStep(1);
  };

  const closeGuide = useCallback(() => {
    const trigger = guideTriggerRef.current;
    setGuideStep(null);
    setGuideHasRun(true);

    if (!trigger) return;
    trigger.focus();
  }, []);

  const handleSave = () => {
    if (!product) return;

    const name = draftName.trim();
    const price = parsePrice(draftPrice);
    if (!name || price === null) {
      setFormError('Enter a product name and a price greater than $0.');
      return;
    }

    const nextProduct = updateCatalogProduct(product, { name, price });
    setProduct(nextProduct);
    setDraftName(nextProduct.name);
    setDraftPrice(formatPriceInput(nextProduct.price));
    setFormError(null);

    const changed = nextProduct.name !== product.name || nextProduct.price !== product.price;
    if (!changed) {
      setFeedback(null);
      return;
    }

    setReceiptPulse((current) => current + 1);
    setFeedback(
      mode === 'usual'
        ? {
            tone: 'danger',
            title: 'Historical data changed.',
            description:
              "The receipt is reading today's catalog instead of the values captured at sale time.",
          }
        : {
            tone: 'success',
            title: 'Snapshot preserved.',
            description:
              'The receipt still reflects the original sale, even though the catalog changed.',
          },
    );

    if (guideStep === 2) {
      setGuideStep(3);
    }
  };

  const handleSell = () => {
    if (!product || product.stock < 1) return;

    const result = sellOneItem(product, nextReceiptNumber);
    setProduct(result.product);
    setReceipts((current) => [...current, result.sale]);
    setNextReceiptNumber((current) => current + 1);
    setSelectedReceiptNumber(result.sale.receiptNumber);
    setFeedback(null);
    setFormError(null);
    setDraftName(result.product.name);
    setDraftPrice(formatPriceInput(result.product.price));
  };

  const handleDelete = () => {
    if (!product) return;

    setProduct(null);
    setFeedback(
      mode === 'usual'
        ? {
            tone: 'danger',
            title: 'Historical record broken.',
            description: 'The receipt depended on a catalog record that no longer exists.',
          }
        : {
            tone: 'success',
            title: 'Historical record preserved.',
            description: 'The catalog item was deleted, but the receipt remains complete.',
          },
    );
    setReceiptPulse((current) => current + 1);
    setFormError(null);
  };

  const handleReset = () => {
    const state = resetState();
    setMode('usual');
    setProduct(state.product);
    setReceipts(state.receipts);
    setNextReceiptNumber(state.nextReceiptNumber);
    setSelectedReceiptNumber(state.selectedReceiptNumber);
    setDraftName(state.draftName);
    setDraftPrice(state.draftPrice);
    setFeedback(null);
    setFormError(null);
    setReceiptPulse(0);
  };

  useEffect(() => {
    if (guideStep !== 4 || !guideCompletion) return;

    const timeout = window.setTimeout(
      () => closeGuide(),
      reducedMotion ? 0 : GUIDE_COMPLETION_DELAY,
    );
    return () => window.clearTimeout(timeout);
  }, [closeGuide, guideCompletion, guideStep, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="inventory-demo"
      className={styles.section}
      data-mode={mode}
      aria-labelledby="inventory-demo-title"
    >
      <div className={styles.header}>
        <span className={styles.demoBadge}>System design case study</span>
        <h2 id="inventory-demo-title" className={styles.title}>
          Production systems preserve what actually happened.
        </h2>
        <p className={styles.scenario}>
          Can a receipt survive a product rename, price change, or deletion?
        </p>
        <p className={styles.subtitle}>
          This case study shows how I separate mutable catalog data from immutable transaction
          history so past records stay accurate as the system changes.
        </p>
        <ul className={styles.capabilityRow} aria-label="Capabilities demonstrated">
          <li className={styles.capabilityChip}>Data integrity</li>
          <li className={styles.capabilityChip}>Transaction snapshots</li>
          <li className={styles.capabilityChip}>Safe mutations</li>
          <li className={styles.capabilityChip}>Failure handling</li>
        </ul>
      </div>

      <div className={styles.modeRow}>
        <ModeToggle
          mode={mode}
          onChange={handleModeChange}
          targetRef={modeRef}
          isGuideTarget={guideStep === 4}
        />
      </div>

      <div className={styles.walkthroughCta}>
        <span className={styles.walkthroughMarker} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <div className={styles.walkthroughCopy}>
          <strong>See the engineering decision in action</strong>
          <span>Cause the data integrity bug, then fix it with a transaction snapshot.</span>
          <span className={styles.walkthroughDuration}>About 20 seconds</span>
        </div>
        <button
          type="button"
          className={styles.walkthroughButton}
          onClick={startGuide}
          aria-expanded={guideStep !== null}
          aria-controls="inventory-guide"
        >
          {guideHasRun ? 'Replay guided demo' : 'Start guided demo'}
        </button>
      </div>

      <div className={styles.demoSurface}>
        <ProductEditor
          ref={productRef}
          isGuideTarget={guideStep === 2}
          product={product}
          name={draftName}
          price={draftPrice}
          onNameChange={(value) => {
            setDraftName(value);
            setFormError(null);
          }}
          onPriceChange={(value) => {
            setDraftPrice(value);
            setFormError(null);
          }}
          onSell={handleSell}
          onSave={handleSave}
          onDelete={handleDelete}
          onReset={handleReset}
        />

        {selectedReceipt && (
          <ReceiptCard
            ref={receiptRef}
            isGuideTarget={guideStep === 1 || guideStep === 3}
            key={`${selectedReceipt.receiptNumber}-${receiptPulse}`}
            receipt={selectedReceipt}
            receipts={receipts}
            product={product}
            mode={mode}
            feedback={feedback}
            onSelectReceipt={(receiptNumber) => {
              setSelectedReceiptNumber(receiptNumber);
              setFeedback(null);
              setFormError(null);
            }}
          />
        )}
      </div>

      <div className={styles.helperBar}>
        <strong>Why this matters</strong>
        <span className={styles.helperRule}>
          Catalog data describes the product now. Transaction data records what actually happened.
        </span>
      </div>

      {formError && (
        <p className={styles.formError} role="status" aria-live="polite">
          {formError}
        </p>
      )}

      <span className={styles.srOnly} aria-live="polite">
        Current catalog price {product ? formatCurrency(product.price) : 'deleted'}.
      </span>

      {guideStep !== null && (
        <Walkthrough
          step={guideStep}
          sectionRef={sectionRef}
          productRef={productRef}
          receiptRef={receiptRef}
          modeRef={modeRef}
          coachmarkRef={coachmarkRef}
          reducedMotion={reducedMotion}
          isComplete={guideCompletion}
          onAdvance={() => {
            setGuideCompletion(false);
            setGuideStep((current) => (current === 1 ? 2 : current === 3 ? 4 : current));
          }}
          onClose={closeGuide}
        />
      )}
    </section>
  );
}

import { useCallback, useRef, useState, type MouseEvent } from 'react';
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

  const selectedReceipt =
    receipts.find((receipt) => receipt.receiptNumber === selectedReceiptNumber) ?? receipts[0];

  const handleModeChange = (nextMode: ArchitectureMode) => {
    setMode(nextMode);
    setFeedback(null);
    setFormError(null);
  };

  const startGuide = (event: MouseEvent<HTMLButtonElement>) => {
    guideTriggerRef.current = event.currentTarget;
    setGuideStep(1);
  };

  const closeGuide = useCallback(() => {
    const trigger = guideTriggerRef.current;
    setGuideStep(null);

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
            title: 'Past receipt changed — this is the bug.',
            description:
              'This receipt is reading today’s product record instead of what was actually sold.',
          }
        : {
            tone: 'success',
            title: 'Snapshot preserved — the past receipt stayed true.',
            description: 'Catalog changes affect future sales, not historical receipts.',
          },
    );
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
            title: 'Deleting catalog data broke a historical receipt.',
            description: 'The naive receipt can no longer resolve its product record.',
          }
        : {
            tone: 'success',
            title: `Product deleted — Receipt #${selectedReceiptNumber} is still intact.`,
            description: 'The original name, price, and total live on the receipt snapshot.',
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

  return (
    <section
      ref={sectionRef}
      id="inventory-demo"
      className={styles.section}
      data-mode={mode}
      aria-labelledby="inventory-demo-title"
    >
      <div className={styles.header}>
        <div className={styles.modeRow}>
          <span className={styles.demoBadge}>Interactive demo</span>
          <ModeToggle
            mode={mode}
            onChange={handleModeChange}
            targetRef={modeRef}
            isGuideTarget={guideStep === 3}
          />
          <span className={styles.modeRowSpacer} aria-hidden="true" />
          <button
            type="button"
            className={styles.guideEntry}
            onClick={startGuide}
            aria-expanded={guideStep !== null}
            aria-controls="inventory-guide"
          >
            <span className={styles.guideDot} aria-hidden="true" />
            Guide me
          </button>
        </div>
        <h2 id="inventory-demo-title" className={styles.title}>
          Can a past receipt survive a catalog change?
        </h2>
        <p className={styles.subtitle}>
          Sell once, then rename, reprice, or delete the product. Watch what happens to the receipt.
        </p>
      </div>

      <div className={styles.walkthroughCta}>
        <div className={styles.walkthroughCopy}>
          <strong>Want the quick version?</strong>
          <span>Optional — explore freely, or let us point out the important parts.</span>
        </div>
        <button
          type="button"
          className={styles.walkthroughButton}
          onClick={startGuide}
          aria-expanded={guideStep !== null}
          aria-controls="inventory-guide"
        >
          Start 20-sec walkthrough →
        </button>
      </div>

      <div className={styles.demoSurface}>
        <ProductEditor
          ref={productRef}
          isGuideTarget={guideStep === 1}
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
            isGuideTarget={guideStep === 2}
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
        <strong>Try it:</strong>
        <span className={styles.helperSteps}>SELL → EDIT + SAVE → DELETE</span>
        <span className={styles.helperRule}>
          {mode === 'usual' ? 'A past receipt should never change.' : 'Snapshot keeps the receipt true.'}
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
          onStepChange={setGuideStep}
          onClose={closeGuide}
        />
      )}
    </section>
  );
}

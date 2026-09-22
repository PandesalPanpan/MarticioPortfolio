import { forwardRef } from 'react';
import type { ArchitectureMode, DemoFeedback, Product, SaleRecord } from './domain';
import { formatCurrency, resolveReceipt, usualIssueAffectsReceipt } from './domain';
import styles from '@/sections/InventoryDemo.module.css';

type ReceiptCardProps = {
  receipt: SaleRecord;
  receipts: SaleRecord[];
  product: Product | null;
  mode: ArchitectureMode;
  feedback: DemoFeedback | null;
  onSelectReceipt: (receiptNumber: number) => void;
  isGuideTarget?: boolean;
};

export const ReceiptCard = forwardRef<HTMLElement, ReceiptCardProps>(function ReceiptCard(
  { receipt, receipts, product, mode, feedback, onSelectReceipt, isGuideTarget = false },
  ref,
) {
  const resolution = resolveReceipt(receipt, product, mode);
  const hasUsualIssue = mode === 'usual' && usualIssueAffectsReceipt(receipt, product);
  const tone = mode === 'production' ? 'success' : hasUsualIssue ? 'danger' : 'neutral';
  const statusLabel = mode === 'production' ? 'Transaction snapshot' : 'Current catalog';

  return (
    <article
      ref={ref}
      className={`${styles.receiptCard} ${styles[`receiptTone${tone[0].toUpperCase()}${tone.slice(1)}`]} ${isGuideTarget ? styles.guideTargetActive : ''}`}
      data-testid="receipt-card"
      data-receipt-number={receipt.receiptNumber}
      data-receipt-status={resolution.status}
      data-tone={tone}
    >
      <div className={styles.receiptHeader}>
        <span className={styles.receiptEyebrow}>Receipt #{receipt.receiptNumber}</span>
        {receipts.length > 1 ? (
          <div
            className={styles.receiptSelector}
            data-testid="receipt-selector"
            aria-label="Receipts"
          >
            {receipts.map((item) => (
              <button
                key={item.receiptNumber}
                type="button"
                className={styles.receiptSelectorButton}
                aria-pressed={item.receiptNumber === receipt.receiptNumber}
                aria-label={`View receipt #${item.receiptNumber}`}
                onClick={() => onSelectReceipt(item.receiptNumber)}
              >
                #{item.receiptNumber}
              </button>
            ))}
          </div>
        ) : (
          <span className={styles.receiptMeta}>Sold before edit</span>
        )}
      </div>

      {resolution.status === 'missing' ? (
        <div className={styles.missingReceipt}>
          <h3>Missing item</h3>
          <p>Product record no longer exists</p>
        </div>
      ) : (
        <>
          <h3 className={styles.receiptName}>{resolution.name}</h3>
          <div className={styles.receiptLine}>
            <span>
              {receipt.quantity} × {formatCurrency(resolution.unitPrice)}
            </span>
            <strong>{formatCurrency(resolution.total)}</strong>
          </div>
        </>
      )}

      <div className={styles.snapshotComparison}>
        <span className={styles.comparisonLabel}>
          {mode === 'production' ? 'Transaction snapshot' : 'At time of sale'}
        </span>
        <strong>
          {receipt.productNameSnapshot} · {formatCurrency(receipt.unitPriceSnapshot)}
        </strong>
      </div>

      <div className={styles.receiptStatusLine}>
        <span className={styles.statusDot} aria-hidden="true" />
        <span>{statusLabel}</span>
      </div>

      {feedback && (
        <div
          className={`${styles.feedback} ${feedback.tone === 'danger' ? styles.feedbackDanger : styles.feedbackSuccess}`}
          role="status"
          aria-live="polite"
          data-testid="receipt-feedback"
        >
          <strong>{feedback.title}</strong>
          <span>{feedback.description}</span>
        </div>
      )}
    </article>
  );
});

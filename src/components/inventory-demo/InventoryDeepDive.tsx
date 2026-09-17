import type { InventoryTransaction, Product, StockMovement } from './domain';
import { formatCurrency, formatMovementDelta } from './domain';
import styles from '@/sections/InventoryDemo.module.css';

function receiptDateLabel(createdAt: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  })
    .format(new Date(createdAt))
    .replace(',', ' ·');
}

function LedgerRow({
  movement,
  label,
  detail,
}: {
  movement: StockMovement;
  label: string;
  detail: string;
}) {
  return (
    <div className={styles.ledgerRow}>
      <div className={styles.ledgerMovement}>
        <strong>{label}</strong>
        <span>{detail}</span>
      </div>
      <strong
        className={movement.quantityDelta < 0 ? styles.ledgerNegative : styles.ledgerPositive}
      >
        {formatMovementDelta(movement.quantityDelta)}
      </strong>
      <strong className={styles.ledgerBalance}>{movement.balanceAfter}</strong>
    </div>
  );
}

export function InventoryDeepDive({
  transaction,
  liveProduct,
  isEdited,
  onEditProduct,
  onReset,
  onSell,
}: {
  transaction: InventoryTransaction;
  liveProduct: Product;
  isEdited: boolean;
  onEditProduct: () => void;
  onReset: () => void;
  onSell: () => void;
}) {
  const line = transaction.receipt.lines[0];

  return (
    <section
      className={styles.deepDive}
      id="inventory-deep-dive"
      aria-labelledby="inventory-deep-dive-title"
    >
      <div className={styles.deepIntro}>
        <span className={styles.deepBadge}>WHY THIS MATTERS</span>
        <h3 id="inventory-deep-dive-title">What stays reliable after a sale.</h3>
        <p>
          A sale changes the live product and records the stock movement. The receipt keeps the name
          and price that were true at the time.
        </p>
      </div>

      <div className={styles.deepSteps} aria-label="Deep dive steps">
        <span className={`${styles.stepPill} ${styles.stepPillActive}`}>
          1&nbsp;&nbsp;Sell 2 units
        </span>
        <span className={styles.stepPill}>2&nbsp;&nbsp;Change current product</span>
        <span className={styles.stepPill}>3&nbsp;&nbsp;Compare the receipt</span>
        <button type="button" className={styles.deepReset} onClick={onReset}>
          ↻ Reset demo
        </button>
      </div>

      <div className={styles.workbench}>
        <article className={styles.deepCard}>
          <div className={styles.deepCardHeader}>
            <p>Live product</p>
            <span className={styles.neutralPill}>CURRENT</span>
          </div>
          <h4 className={styles.deepProductName}>{liveProduct.name}</h4>
          <p className={styles.deepSku}>SKU&nbsp;&nbsp;{liveProduct.sku}</p>
          <div className={styles.deepMetrics}>
            <div>
              <span className={styles.deepMetricLabel}>CURRENT PRICE</span>
              <strong className={styles.priceValue}>
                {formatCurrency(liveProduct.currentPrice)}
              </strong>
            </div>
            <div>
              <span className={styles.deepMetricLabel}>IN STOCK</span>
              <strong>{liveProduct.currentStock} units</strong>
            </div>
          </div>
          <div className={styles.divider} />
          <p className={styles.deepProductNote}>
            {isEdited
              ? `Changed after Receipt ${transaction.receipt.receiptNumber} was created`
              : 'Before the live product is edited'}
          </p>
          <div className={styles.deepActions}>
            <button type="button" className={styles.deepPrimary} onClick={onSell}>
              Sell item
            </button>
            <button type="button" className={styles.deepSecondary} onClick={onEditProduct}>
              {isEdited ? 'Reset product' : 'Edit product'}
            </button>
          </div>
        </article>

        <article className={styles.deepCard}>
          <div className={styles.deepCardHeader}>
            <h4>Receipt {transaction.receipt.receiptNumber}</h4>
            <span className={styles.preservedPill}>PRESERVED</span>
          </div>
          <p className={styles.receiptDate}>{receiptDateLabel(transaction.receipt.createdAt)}</p>
          <div className={styles.divider} />
          <div className={styles.receiptLine}>
            <div>
              <strong>{line.productNameSnapshot}</strong>
              <span>
                {line.quantity} × {formatCurrency(line.unitPriceSnapshot)}
              </span>
            </div>
            <strong>{formatCurrency(transaction.receipt.total)}</strong>
          </div>
          <div className={styles.divider} />
          <div className={styles.totalRow}>
            <span>TOTAL</span>
            <strong>{formatCurrency(transaction.receipt.total)}</strong>
          </div>
          <div className={styles.snapshotProof}>
            <strong>✓ Old receipt stays accurate</strong>
            <p>
              The product is now “{liveProduct.name}” at {formatCurrency(liveProduct.currentPrice)},
              but Receipt {transaction.receipt.receiptNumber} remains unchanged.
            </p>
          </div>
        </article>
      </div>

      <div className={styles.comparisonCard}>
        <h4>What it is now vs. what was sold then</h4>
        <div className={styles.comparisonGrid}>
          <div className={styles.currentValue}>
            <span>CURRENT PRODUCT</span>
            <strong>{liveProduct.name}</strong>
            <strong>{formatCurrency(liveProduct.currentPrice)}</strong>
          </div>
          <span className={styles.comparisonArrow} aria-hidden="true">
            →
          </span>
          <div className={styles.historicalValue}>
            <span>RECEIPT {transaction.receipt.receiptNumber}</span>
            <strong>{line.productNameSnapshot}</strong>
            <strong>{formatCurrency(line.unitPriceSnapshot)}</strong>
          </div>
        </div>
      </div>

      <div className={styles.ledgerCard}>
        <div className={styles.ledgerHeading}>
          <h4>Why the stock changed</h4>
          <span className={styles.neutralPill}>TRACEABLE</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.ledgerColumns}>
          <span>MOVEMENT</span>
          <span>CHANGE</span>
          <span>BALANCE</span>
        </div>
        <LedgerRow
          movement={transaction.initialMovement}
          label="Initial stock"
          detail="opening balance"
        />
        <div className={styles.divider} />
        <LedgerRow
          movement={transaction.movement}
          label="Sale"
          detail={`Receipt ${transaction.receipt.receiptNumber}`}
        />
      </div>

      <div className={styles.architectureNote}>
        <span className={styles.noteDot} aria-hidden="true" />
        <div>
          <strong>What this demonstrates</strong>
          <p>
            Old receipts keep the details of the original sale. Stock history records why the
            balance changed.
          </p>
        </div>
      </div>
    </section>
  );
}

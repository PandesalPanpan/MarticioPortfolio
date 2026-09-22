import { forwardRef, type FormEvent } from 'react';
import type { Product } from './domain';
import styles from '@/sections/InventoryDemo.module.css';

type ProductEditorProps = {
  product: Product | null;
  name: string;
  price: string;
  onNameChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSell: () => void;
  onSave: () => void;
  onDelete: () => void;
  onReset: () => void;
  isGuideTarget?: boolean;
};

export const ProductEditor = forwardRef<HTMLElement, ProductEditorProps>(function ProductEditor(
  {
    product,
    name,
    price,
    onNameChange,
    onPriceChange,
    onSell,
    onSave,
    onDelete,
    onReset,
    isGuideTarget = false,
  },
  ref,
) {
  const isDeleted = product === null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <article
      ref={ref}
      className={`${styles.productCard} ${isGuideTarget ? styles.guideTargetActive : ''}`}
      data-testid="product-editor"
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardEyebrow}>Current product</span>
        <span className={`${styles.stockPill} ${isDeleted ? styles.stockPillDeleted : ''}`}>
          {isDeleted ? 'Catalog deleted' : `${product.stock} in stock`}
        </span>
      </div>

      {isDeleted && (
        <div className={styles.deletedNotice} role="status">
          <strong>Product removed from catalog.</strong>
          <span>Historical receipts are still available above.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.editorForm}>
        <label className={styles.field} htmlFor="inventory-product-name">
          <span className={styles.fieldLabel}>Name</span>
          <input
            id="inventory-product-name"
            className={styles.fieldInput}
            type="text"
            aria-label="Name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            disabled={isDeleted}
          />
        </label>

        <label className={styles.field} htmlFor="inventory-product-price">
          <span className={styles.fieldLabel}>Price</span>
          <span className={styles.priceInputWrap}>
            <span aria-hidden="true">$</span>
            <input
              id="inventory-product-price"
              className={`${styles.fieldInput} ${styles.priceInput}`}
              type="text"
              aria-label="Price"
              inputMode="decimal"
              value={price}
              onChange={(event) => onPriceChange(event.target.value)}
              disabled={isDeleted}
            />
          </span>
        </label>

        <div className={styles.editorActions}>
          <button
            type="button"
            className={styles.sellButton}
            onClick={onSell}
            disabled={isDeleted || product.stock < 1}
          >
            Sell 1 item
          </button>
          <button type="submit" className={styles.saveButton} disabled={isDeleted}>
            Save changes
          </button>
        </div>
      </form>

      <div className={styles.deleteRow}>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={onDelete}
          disabled={isDeleted}
        >
          Delete product
        </button>
        <span className={styles.deleteHint}>
          {isDeleted ? 'Reset to try it again' : '→ then check the old receipt'}
        </span>
        {isDeleted && (
          <button type="button" className={styles.resetButton} onClick={onReset}>
            Reset demo
          </button>
        )}
      </div>

    </article>
  );
});

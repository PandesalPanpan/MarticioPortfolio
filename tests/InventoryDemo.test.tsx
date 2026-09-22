import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  createInitialDemoState,
  createInitialProduct,
  createSale,
  resolveReceipt,
  sellOneItem,
  updateCatalogProduct,
} from '@/components/inventory-demo/domain';
import { InventoryDemo } from '@/sections/InventoryDemo';

const EDITED_VALUES = {
  name: 'Premium Braided USB-C Cable',
  price: 8,
} as const;

function renderDemo() {
  render(<InventoryDemo />);
  return screen.getByRole('region', { name: 'Can a past receipt survive a catalog change?' });
}

function editProduct() {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: EDITED_VALUES.name },
  });
  fireEvent.change(screen.getByLabelText('Price'), {
    target: { value: String(EDITED_VALUES.price) },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
}

describe('inventory demo domain', () => {
  it('seeds Receipt #1001 from one USB-C Cable sale and leaves 19 in stock', () => {
    const state = createInitialDemoState();
    const receipt = state.receipts[0];

    expect(state.product).toMatchObject({
      id: 'CABLE-001',
      name: 'USB-C Cable',
      price: 5,
      stock: 19,
    });
    expect(receipt).toMatchObject({
      receiptNumber: 1001,
      productId: 'CABLE-001',
      productNameSnapshot: 'USB-C Cable',
      unitPriceSnapshot: 5,
      quantity: 1,
      lineTotal: 5,
    });
  });

  it('lets the usual issue resolve a past receipt from the changed catalog', () => {
    const state = createInitialDemoState();
    const editedProduct = updateCatalogProduct(state.product, EDITED_VALUES);
    const resolution = resolveReceipt(state.receipts[0], editedProduct, 'usual');

    expect(resolution).toEqual({
      status: 'resolved',
      name: EDITED_VALUES.name,
      unitPrice: EDITED_VALUES.price,
      total: 8,
      source: 'catalog',
    });
  });

  it('lets production receipts resolve from immutable snapshot fields', () => {
    const state = createInitialDemoState();
    const editedProduct = updateCatalogProduct(state.product, EDITED_VALUES);
    const resolution = resolveReceipt(state.receipts[0], editedProduct, 'production');

    expect(resolution).toEqual({
      status: 'resolved',
      name: 'USB-C Cable',
      unitPrice: 5,
      total: 5,
      source: 'snapshot',
    });
  });

  it('shows a missing catalog reference but keeps a production snapshot after deletion', () => {
    const state = createInitialDemoState();

    expect(resolveReceipt(state.receipts[0], null, 'usual')).toEqual({
      status: 'missing',
      source: 'catalog',
    });
    expect(resolveReceipt(state.receipts[0], null, 'production')).toMatchObject({
      status: 'resolved',
      name: 'USB-C Cable',
      unitPrice: 5,
      total: 5,
    });
  });

  it('creates a new snapshot sale from the current catalog values', () => {
    const product = updateCatalogProduct(
      { ...createInitialProduct(), stock: 19 },
      EDITED_VALUES,
    );
    const { product: afterSale, sale } = sellOneItem(product, 1002);

    expect(afterSale.stock).toBe(18);
    expect(sale).toMatchObject({
      receiptNumber: 1002,
      productNameSnapshot: EDITED_VALUES.name,
      unitPriceSnapshot: EDITED_VALUES.price,
      quantity: 1,
      lineTotal: 8,
    });
  });

  it('rejects a sale larger than available stock', () => {
    expect(() => createSale({ ...createInitialProduct(), stock: 0 }, 1002)).toThrow(
      'Sale quantity cannot exceed current stock.',
    );
  });
});

describe('InventoryDemo', () => {
  it('keeps the optional walkthrough closed on first render', () => {
    renderDemo();

    expect(screen.queryByTestId('inventory-guide')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Start 20-sec walkthrough →' }),
    ).toBeInTheDocument();
  });

  it('opens the walkthrough at step 1 only after the CTA is pressed', () => {
    renderDemo();

    const start = screen.getByRole('button', { name: 'Start 20-sec walkthrough →' });
    fireEvent.click(start);

    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 3');
    expect(screen.getByRole('heading', { name: 'Edit the current product' })).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('moves through all three walkthrough steps and closes with Done', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start 20-sec walkthrough →' }));

    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('2 OF 3');
    expect(screen.getByRole('heading', { name: 'Now watch the receipt' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('3 OF 3');
    expect(screen.getByRole('heading', { name: 'Compare both approaches' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByTestId('inventory-guide')).not.toBeInTheDocument();
  });

  it('supports Back, Exit guide, Escape, and focus restoration', () => {
    renderDemo();
    const start = screen.getByRole('button', { name: 'Start 20-sec walkthrough →' });
    fireEvent.click(start);
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 3');

    fireEvent.click(screen.getByRole('button', { name: 'Exit guide' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(start);

    fireEvent.click(start);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the seeded receipt immediately with the current catalog beside it', () => {
    const demo = renderDemo();
    const receipt = screen.getByTestId('receipt-card');

    expect(demo).toHaveAttribute('data-mode', 'usual');
    expect(screen.getByLabelText('Name')).toHaveValue('USB-C Cable');
    expect(screen.getByLabelText('Price')).toHaveValue('5.00');
    expect(screen.getByTestId('product-editor')).toHaveTextContent('19 in stock');
    expect(receipt).toHaveTextContent('Receipt #1001');
    expect(receipt).toHaveTextContent('USB-C Cable');
    expect(receipt).toHaveTextContent('1 × $5.00');
    expect(receipt).toHaveTextContent('$5.00');
  });

  it('updates the mutable catalog when Name and Price are saved', () => {
    renderDemo();

    editProduct();

    expect(screen.getByLabelText('Name')).toHaveValue(EDITED_VALUES.name);
    expect(screen.getByLabelText('Price')).toHaveValue('8.00');
  });

  it('shows the usual issue when the saved catalog changes', () => {
    renderDemo();

    editProduct();

    const receipt = screen.getByTestId('receipt-card');
    expect(receipt).toHaveAttribute('data-tone', 'danger');
    expect(receipt).toHaveTextContent('Premium Braided USB-C Cable');
    expect(receipt).toHaveTextContent('1 × $8.00');
    expect(receipt).toHaveTextContent('Past receipt changed — this is the bug.');
    expect(receipt).toHaveTextContent('USB-C Cable · $5.00');
  });

  it('keeps Receipt #1001 on its snapshot in production-ready mode', () => {
    const demo = renderDemo();
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready' }));
    editProduct();

    const receipt = screen.getByTestId('receipt-card');
    expect(demo).toHaveAttribute('data-mode', 'production');
    expect(receipt).toHaveAttribute('data-tone', 'success');
    expect(receipt).toHaveTextContent('USB-C Cable');
    expect(receipt).toHaveTextContent('1 × $5.00');
    expect(receipt).toHaveTextContent('Snapshot preserved — the past receipt stayed true.');
    expect(screen.getByLabelText('Name')).toHaveValue(EDITED_VALUES.name);
    expect(screen.getByLabelText('Price')).toHaveValue('8.00');
  });

  it('shows Missing item when the usual issue product is deleted', () => {
    renderDemo();

    fireEvent.click(screen.getByRole('button', { name: 'Delete product' }));

    const receipt = screen.getByTestId('receipt-card');
    expect(receipt).toHaveAttribute('data-receipt-status', 'missing');
    expect(receipt).toHaveTextContent('Missing item');
    expect(receipt).toHaveTextContent('Product record no longer exists');
    expect(receipt).toHaveTextContent('Deleting catalog data broke a historical receipt.');
    expect(screen.getByRole('button', { name: 'Reset demo' })).toBeInTheDocument();
  });

  it('keeps a production receipt intact when the catalog product is deleted', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete product' }));

    const receipt = screen.getByTestId('receipt-card');
    expect(receipt).toHaveAttribute('data-receipt-status', 'resolved');
    expect(receipt).toHaveTextContent('USB-C Cable');
    expect(receipt).toHaveTextContent('1 × $5.00');
    expect(receipt).toHaveTextContent('Product deleted — Receipt #1001 is still intact.');
  });

  it('creates Receipt #1002 from the current catalog and keeps #1001 selectable', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready' }));
    editProduct();
    fireEvent.click(screen.getByRole('button', { name: 'Sell 1 item' }));

    expect(screen.getByTestId('product-editor')).toHaveTextContent('18 in stock');
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-receipt-number', '1002');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent(EDITED_VALUES.name);
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $8.00');

    fireEvent.click(screen.getByRole('button', { name: 'View receipt #1001' }));
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-receipt-number', '1001');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('USB-C Cable');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $5.00');
  });

  it('resets the demo to the deterministic starting state', () => {
    renderDemo();
    editProduct();
    fireEvent.click(screen.getByRole('button', { name: 'Delete product' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset demo' }));

    expect(screen.getByRole('tab', { name: 'Usual issue' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText('Name')).toHaveValue('USB-C Cable');
    expect(screen.getByLabelText('Price')).toHaveValue('5.00');
    expect(screen.getByTestId('product-editor')).toHaveTextContent('19 in stock');
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-receipt-number', '1001');
  });

  it('keeps the architecture toggle keyboard accessible', () => {
    renderDemo();
    const usualTab = screen.getByRole('tab', { name: 'Usual issue' });
    const productionTab = screen.getByRole('tab', { name: 'Production-ready' });

    productionTab.focus();
    fireEvent.keyDown(productionTab, { key: 'ArrowLeft' });
    expect(usualTab).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(usualTab, { key: 'End' });
    expect(productionTab).toHaveAttribute('aria-selected', 'true');
  });
});

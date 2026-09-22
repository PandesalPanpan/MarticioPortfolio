import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.removeAttribute('data-theme');
});

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
    const product = updateCatalogProduct({ ...createInitialProduct(), stock: 19 }, EDITED_VALUES);
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
    expect(screen.getAllByRole('button', { name: 'Start guided demo' })).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Guide me' })).not.toBeInTheDocument();
  });

  it('opens the walkthrough at step 1 only after the CTA is pressed', () => {
    renderDemo();

    const start = screen.getByRole('button', { name: 'Start guided demo' });
    fireEvent.click(start);

    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 3');
    expect(screen.getByRole('heading', { name: 'Edit the current product' })).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByLabelText('Name'));
    expect(screen.queryByRole('button', { name: /Next/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Back/ })).not.toBeInTheDocument();
  });

  it('does not advance when the visitor only types', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '8' } });

    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 3');
  });

  it('does not advance when Save changes has no actual change', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 3');
  });

  it('does not advance after an invalid save', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 3');
    expect(screen.getByRole('status')).toHaveTextContent('greater than $0');
  });

  it('advances to the receipt after a valid catalog change is saved', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    editProduct();

    expect(screen.getByRole('dialog')).toHaveTextContent('2 OF 3');
    expect(screen.getByRole('heading', { name: 'The old receipt changed' })).toBeInTheDocument();
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-tone', 'danger');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $8.00');
  });

  it('automatically moves from the receipt observation to step 3', () => {
    vi.useFakeTimers();
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    editProduct();

    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(screen.getByRole('dialog')).toHaveTextContent('2 OF 3');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('dialog')).toHaveTextContent('3 OF 3');
    expect(
      screen.getByRole('heading', { name: 'Now compare the production approach' }),
    ).toBeInTheDocument();
  });

  it('waits for the real architecture change before completing the guide', () => {
    vi.useFakeTimers();
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    editProduct();
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByRole('dialog')).toHaveTextContent('3 OF 3');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $8.00');

    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready' }));

    expect(screen.getByTestId('receipt-card')).toHaveTextContent('USB-C Cable');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $5.00');
    expect(screen.getByTestId('receipt-feedback')).toHaveTextContent('Snapshot preserved.');
    expect(screen.getByRole('dialog')).toHaveTextContent('Snapshot preserved');

    act(() => {
      vi.advanceTimersByTime(899);
    });
    expect(screen.getByTestId('inventory-guide')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByTestId('inventory-guide')).not.toBeInTheDocument();
  });

  it('supports the close control and Escape without resetting demo state', () => {
    renderDemo();
    editProduct();

    const start = screen.getByRole('button', { name: 'Start guided demo' });
    fireEvent.click(start);
    fireEvent.click(screen.getByRole('button', { name: 'Exit guided demo' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toHaveValue('8.00');
    expect(document.activeElement).toBe(start);

    const replay = screen.getByRole('button', { name: 'Replay guided demo' });
    fireEvent.click(replay);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toHaveValue('8.00');
    expect(document.activeElement).toBe(replay);
  });

  it('keeps the coachmark on the theme-aware demo surface in dark mode', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    const coachmark = screen.getByRole('dialog');
    expect(getComputedStyle(coachmark).backgroundColor).not.toBe('rgb(255, 255, 255)');
    expect(coachmark.className).toContain('coachmark');
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
    expect(receipt).toHaveTextContent('Past receipt changed. This is the bug.');
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
    expect(receipt).toHaveTextContent('Snapshot preserved. The past receipt stayed true.');
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
    expect(receipt).toHaveTextContent('Product deleted. Receipt #1001 is still intact.');
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

    expect(screen.getByRole('tab', { name: 'Usual issue' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
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

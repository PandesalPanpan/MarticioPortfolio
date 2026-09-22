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
  return screen.getByRole('region', {
    name: 'Production systems preserve what actually happened.',
  });
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
  it('frames the section as a system design case study', () => {
    const demo = renderDemo();

    expect(demo).toHaveAccessibleName('Production systems preserve what actually happened.');
    expect(screen.getByText('System design case study')).toBeInTheDocument();
    expect(
      screen.getByText('Can a receipt survive a product rename, price change, or deletion?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'This case study shows how I separate mutable catalog data from immutable transaction history so past records stay accurate as the system changes.',
      ),
    ).toBeInTheDocument();
    for (const capability of [
      'Data integrity',
      'Transaction snapshots',
      'Safe mutations',
      'Failure handling',
    ]) {
      expect(screen.getByText(capability)).toBeInTheDocument();
    }
    expect(screen.queryByText('Interactive demo')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Naive approach' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Production-ready approach' })).toBeInTheDocument();
    expect(screen.getByText('See the engineering decision in action')).toBeInTheDocument();
    expect(
      screen.getByText('Cause the data integrity bug, then fix it with a transaction snapshot.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Why this matters')).toBeInTheDocument();
  });

  it('keeps the optional walkthrough closed on first render', () => {
    renderDemo();

    expect(screen.queryByTestId('inventory-guide')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Start guided demo' })).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'Guide me' })).not.toBeInTheDocument();
  });

  it('starts the guided demo at a deterministic receipt baseline', () => {
    renderDemo();
    editProduct();
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready approach' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sell 1 item' }));

    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 4');
    expect(screen.getByRole('heading', { name: 'Remember this receipt' })).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'This sale already happened. Receipt #1001 records a USB-C Cable sold for $5.00.',
    );
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Keep the name and price in mind. We are about to change the product catalog.',
    );
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-guide-target', 'true');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('Receipt #1001');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('USB-C Cable');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $5.00');
    expect(screen.getByLabelText('Name')).toHaveValue('USB-C Cable');
    expect(screen.getByLabelText('Price')).toHaveValue('5.00');
    expect(screen.getByTestId('product-editor')).toHaveTextContent('19 in stock');
    expect(screen.getByRole('tab', { name: 'Naive approach' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('keeps the first receipt observation manual even when timers advance', () => {
    vi.useFakeTimers();
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 4');
    expect(screen.getByRole('heading', { name: 'Remember this receipt' })).toBeInTheDocument();
  });

  it('uses Got it to enter the live catalog action step', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('2 OF 4');
    expect(
      screen.getByRole('heading', { name: 'Now change the live catalog' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('product-editor')).toHaveAttribute('data-guide-target', 'true');
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-guide-target', 'false');
    expect(document.activeElement).toBe(screen.getByLabelText('Name'));
    expect(screen.queryByRole('button', { name: /Next|Back|Previous/ })).not.toBeInTheDocument();
  });

  it('does not advance when the visitor only types', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '8' } });

    expect(screen.getByRole('dialog')).toHaveTextContent('2 OF 4');
  });

  it('does not advance when Save changes has no actual change', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('2 OF 4');
  });

  it('does not advance after an invalid save', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('2 OF 4');
    expect(screen.getByRole('status')).toHaveTextContent('greater than $0');
  });

  it('advances to the corrupted receipt after a valid catalog change is saved', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    editProduct();

    expect(screen.getByRole('dialog')).toHaveTextContent('3 OF 4');
    expect(
      screen.getByRole('heading', { name: 'The historical receipt changed' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveTextContent('That is the data integrity problem.');
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-guide-target', 'true');
    expect(screen.getByTestId('receipt-card')).toHaveAttribute('data-tone', 'danger');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('Premium Braided USB-C Cable');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $8.00');
    expect(screen.getByRole('button', { name: 'Show me the fix' })).toBeInTheDocument();
  });

  it('keeps the corrupted receipt visible until the visitor chooses the fix', () => {
    vi.useFakeTimers();
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    editProduct();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole('dialog')).toHaveTextContent('3 OF 4');
    expect(
      screen.getByRole('heading', { name: 'The historical receipt changed' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show me the fix' })).toBeInTheDocument();
  });

  it('uses Show me the fix to enter the architecture action step', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    editProduct();
    fireEvent.click(screen.getByRole('button', { name: 'Show me the fix' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('4 OF 4');
    expect(
      screen.getByRole('heading', { name: 'Now apply the production approach' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mode-toggle')).toHaveAttribute('data-guide-target', 'true');
    expect(screen.queryByRole('button', { name: 'Show me the fix' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Next|Back|Previous/ })).not.toBeInTheDocument();
  });

  it('waits for the real architecture change before completing the guide', () => {
    vi.useFakeTimers();
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    editProduct();
    fireEvent.click(screen.getByRole('button', { name: 'Show me the fix' }));

    fireEvent.click(screen.getByRole('tab', { name: 'Naive approach' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('4 OF 4');
    expect(screen.getByRole('dialog')).not.toHaveTextContent('Snapshot preserved');

    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready approach' }));

    expect(screen.getByTestId('receipt-card')).toHaveTextContent('USB-C Cable');
    expect(screen.getByTestId('receipt-card')).toHaveTextContent('1 × $5.00');
    expect(screen.getByTestId('receipt-feedback')).toHaveTextContent('Snapshot preserved.');
    expect(screen.getByRole('dialog')).toHaveTextContent('Snapshot preserved');

    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(screen.getByTestId('inventory-guide')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByTestId('inventory-guide')).not.toBeInTheDocument();
  });

  it('supports the close control and Escape without resetting demo state', () => {
    renderDemo();
    const start = screen.getByRole('button', { name: 'Start guided demo' });
    fireEvent.click(start);
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    editProduct();
    fireEvent.click(screen.getByRole('button', { name: 'Exit guided demo' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue(EDITED_VALUES.name);
    expect(screen.getByLabelText('Price')).toHaveValue('8.00');
    expect(document.activeElement).toBe(start);

    const replay = screen.getByRole('button', { name: 'Replay guided demo' });
    fireEvent.click(replay);
    expect(screen.getByLabelText('Name')).toHaveValue('USB-C Cable');
    expect(screen.getByLabelText('Price')).toHaveValue('5.00');
    expect(screen.getByRole('dialog')).toHaveTextContent('1 OF 4');
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toHaveValue('7.00');
    expect(document.activeElement).toBe(replay);
  });

  it('keeps the coachmark readable through all four steps in dark mode', () => {
    vi.useFakeTimers();
    document.documentElement.setAttribute('data-theme', 'dark');
    renderDemo();
    fireEvent.click(screen.getByRole('button', { name: 'Start guided demo' }));

    const coachmark = screen.getByRole('dialog');
    expect(getComputedStyle(coachmark).backgroundColor).not.toBe('rgb(255, 255, 255)');
    expect(coachmark.className).toContain('coachmark');
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    expect(getComputedStyle(screen.getByRole('dialog')).backgroundColor).not.toBe(
      'rgb(255, 255, 255)',
    );
    editProduct();
    expect(getComputedStyle(screen.getByRole('dialog')).backgroundColor).not.toBe(
      'rgb(255, 255, 255)',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show me the fix' }));
    expect(getComputedStyle(screen.getByRole('dialog')).backgroundColor).not.toBe(
      'rgb(255, 255, 255)',
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready approach' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Snapshot preserved');
    expect(getComputedStyle(screen.getByRole('dialog')).backgroundColor).not.toBe(
      'rgb(255, 255, 255)',
    );
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
    expect(receipt).toHaveTextContent('Historical data changed.');
    expect(receipt).toHaveTextContent(
      "The receipt is reading today's catalog instead of the values captured at sale time.",
    );
    expect(receipt).toHaveTextContent('At time of sale');
    expect(receipt).toHaveTextContent('USB-C Cable · $5.00');
  });

  it('keeps Receipt #1001 on its snapshot in production-ready mode', () => {
    const demo = renderDemo();
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready approach' }));
    editProduct();

    const receipt = screen.getByTestId('receipt-card');
    expect(demo).toHaveAttribute('data-mode', 'production');
    expect(receipt).toHaveAttribute('data-tone', 'success');
    expect(receipt).toHaveTextContent('USB-C Cable');
    expect(receipt).toHaveTextContent('1 × $5.00');
    expect(receipt).toHaveTextContent('Snapshot preserved.');
    expect(receipt).toHaveTextContent(
      'The receipt still reflects the original sale, even though the catalog changed.',
    );
    expect(receipt).toHaveTextContent('Transaction snapshot');
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
    expect(receipt).toHaveTextContent('Historical record broken.');
    expect(receipt).toHaveTextContent(
      'The receipt depended on a catalog record that no longer exists.',
    );
    expect(screen.getByRole('button', { name: 'Reset demo' })).toBeInTheDocument();
    expect(screen.getByTestId('product-editor')).toHaveTextContent(
      'Historical receipts remain available.',
    );
    expect(screen.queryByText('Historical receipts are still available above.')).not.toBeInTheDocument();
  });

  it('keeps a production receipt intact when the catalog product is deleted', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready approach' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete product' }));

    const receipt = screen.getByTestId('receipt-card');
    expect(receipt).toHaveAttribute('data-receipt-status', 'resolved');
    expect(receipt).toHaveTextContent('USB-C Cable');
    expect(receipt).toHaveTextContent('1 × $5.00');
    expect(receipt).toHaveTextContent('Historical record preserved.');
    expect(receipt).toHaveTextContent(
      'The catalog item was deleted, but the receipt remains complete.',
    );
  });

  it('creates Receipt #1002 from the current catalog and keeps #1001 selectable', () => {
    renderDemo();
    fireEvent.click(screen.getByRole('tab', { name: 'Production-ready approach' }));
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

    expect(screen.getByRole('tab', { name: 'Naive approach' })).toHaveAttribute(
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
    const usualTab = screen.getByRole('tab', { name: 'Naive approach' });
    const productionTab = screen.getByRole('tab', { name: 'Production-ready approach' });

    productionTab.focus();
    fireEvent.keyDown(productionTab, { key: 'ArrowLeft' });
    expect(usualTab).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(usualTab, { key: 'End' });
    expect(productionTab).toHaveAttribute('aria-selected', 'true');
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  DEMO_TRANSACTION,
  createInitialProduct,
  simulateSale,
  updateLiveProduct,
} from '@/components/inventory-demo/domain';
import { InventoryDemo } from '@/sections/InventoryDemo';

afterEach(() => {
  vi.useRealTimers();
});

describe('inventory demo domain', () => {
  it('starts with the designed USB-C cable product', () => {
    const product = createInitialProduct();

    expect(product.name).toBe('USB-C Cable');
    expect(product.sku).toBe('CABLE-001');
    expect(product.currentPrice).toBe(5);
    expect(product.currentStock).toBe(20);
  });

  it('creates a sale with snapshot receipt fields and a derived movement', () => {
    const sale = simulateSale(createInitialProduct(), 2);
    const line = sale.receipt.lines[0];

    expect(sale.productAfterSale.currentStock).toBe(18);
    expect(sale.receipt.receiptNumber).toBe('#1001');
    expect(line.quantity).toBe(2);
    expect(line.unitPriceSnapshot).toBe(5);
    expect(line.productNameSnapshot).toBe('USB-C Cable');
    expect(line.skuSnapshot).toBe('CABLE-001');
    expect(sale.receipt.total).toBe(10);
    expect(sale.movement.type).toBe('SALE');
    expect(sale.movement.quantityDelta).toBe(-2);
    expect(sale.movement.balanceAfter).toBe(18);
  });

  it('keeps the historical receipt unchanged when current product data changes', () => {
    const edited = updateLiveProduct(DEMO_TRANSACTION.productAfterSale, {
      name: 'Premium Braided USB-C Cable',
      currentPrice: 8,
    });
    const line = DEMO_TRANSACTION.receipt.lines[0];

    expect(edited.name).toBe('Premium Braided USB-C Cable');
    expect(edited.currentPrice).toBe(8);
    expect(line.productNameSnapshot).toBe('USB-C Cable');
    expect(line.unitPriceSnapshot).toBe(5);
    expect(DEMO_TRANSACTION.receipt.total).toBe(10);
  });
});

describe('InventoryDemo', () => {
  it('renders the initial product values and runs the complete preview', () => {
    vi.useFakeTimers();
    render(<InventoryDemo />);

    const section = screen.getByRole('region', {
      name: 'I build business software that keeps data trustworthy.',
    });
    const sell = screen.getByRole('button', { name: 'Sell 2 units →' });

    expect(section).toHaveAttribute('id', 'inventory-demo');
    expect(
      screen.getByText('Stock updates. Old receipts stay accurate. Every change stays traceable.'),
    ).toBeInTheDocument();
    expect(screen.getByText('USB-C Cable')).toBeInTheDocument();
    expect(screen.getByText(/CABLE-001/)).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
    expect(screen.getByTestId('stock-value')).toHaveTextContent('20 units');

    act(() => {
      fireEvent.mouseEnter(sell);
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByTestId('stock-value')).toHaveTextContent('18 units');

    expect(screen.getByText('#1001 · USB-C Cable')).toBeInTheDocument();
    expect(screen.getByText(/SALE\s+−2/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('opens Why this matters and allows the live product to be edited separately', () => {
    render(<InventoryDemo />);
    const whyThisMatters = screen.getByRole('button', { name: 'Why this matters ↗' });

    expect(whyThisMatters).toHaveAttribute('aria-expanded', 'false');
    expect(whyThisMatters).toHaveAttribute('aria-controls', 'inventory-deep-dive');
    fireEvent.click(whyThisMatters);
    expect(whyThisMatters).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Edit product' }));

    expect(screen.getAllByText('Premium Braided USB-C Cable').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$8.00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('USB-C Cable').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$5.00').length).toBeGreaterThan(0);
  });

  it('keeps a clicked preview active after the pointer leaves', () => {
    vi.useFakeTimers();
    render(<InventoryDemo />);
    const sell = screen.getByRole('button', { name: 'Sell 2 units →' });

    act(() => {
      fireEvent.click(sell, { detail: 1 });
    });
    act(() => {
      vi.advanceTimersByTime(1200);
      fireEvent.mouseLeave(sell);
    });

    expect(screen.getByTestId('stock-value')).toHaveTextContent('18 units');
    expect(sell).toHaveAccessibleName('Sold 2 units ✓');
    expect(screen.getByText('Click again to reset')).toBeInTheDocument();

    act(() => {
      fireEvent.click(sell, { detail: 1 });
    });
    expect(screen.getByTestId('stock-value')).toHaveTextContent('20 units');
    vi.useRealTimers();
  });

  it('runs on the first touch tap and resets on the next touch tap', () => {
    render(<InventoryDemo />);
    const sell = screen.getByRole('button', { name: 'Sell 2 units →' });

    act(() => {
      fireEvent.pointerDown(sell, { pointerType: 'touch' });
      fireEvent.touchStart(sell);
      fireEvent.focus(sell);
      fireEvent.click(sell, { detail: 1 });
    });
    expect(screen.getByTestId('stock-value')).toHaveTextContent('18 units');

    act(() => {
      fireEvent.pointerDown(sell, { pointerType: 'touch' });
      fireEvent.touchStart(sell);
      fireEvent.click(sell, { detail: 1 });
    });
    expect(screen.getByTestId('stock-value')).toHaveTextContent('20 units');
  });
});

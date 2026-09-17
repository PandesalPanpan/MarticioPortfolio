export type MovementType = 'INITIAL' | 'SALE' | 'RECEIVING' | 'ADJUSTMENT';

export type Product = {
  id: string;
  sku: string;
  name: string;
  currentPrice: number;
  currentStock: number;
};

export type ReceiptLineSnapshot = {
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
};

export type Receipt = {
  receiptNumber: string;
  createdAt: string;
  lines: ReceiptLineSnapshot[];
  total: number;
};

export type StockMovement = {
  type: MovementType;
  quantityDelta: number;
  balanceAfter: number;
  reference?: string;
};

export type InventoryTransaction = {
  productAfterSale: Product;
  receipt: Receipt;
  movement: StockMovement;
  initialMovement: StockMovement;
};

export const SALE_QUANTITY = 2;
export const DEMO_RECEIPT_NUMBER = '#1001';
export const DEMO_CREATED_AT = '2026-09-17T17:42:00+08:00';

export function createInitialProduct(): Product {
  return {
    id: 'usb-c-cable',
    sku: 'CABLE-001',
    name: 'USB-C Cable',
    currentPrice: 5,
    currentStock: 20,
  };
}

export function simulateSale(
  product: Product,
  quantity: number,
  receiptNumber = DEMO_RECEIPT_NUMBER,
  createdAt = DEMO_CREATED_AT,
): InventoryTransaction {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Sale quantity must be a positive integer.');
  }

  if (quantity > product.currentStock) {
    throw new Error('Sale quantity cannot exceed current stock.');
  }

  const lineTotal = product.currentPrice * quantity;
  const receiptLine: ReceiptLineSnapshot = {
    productId: product.id,
    productNameSnapshot: product.name,
    skuSnapshot: product.sku,
    unitPriceSnapshot: product.currentPrice,
    quantity,
    lineTotal,
  };
  const productAfterSale: Product = {
    ...product,
    currentStock: product.currentStock - quantity,
  };

  return {
    productAfterSale,
    receipt: {
      receiptNumber,
      createdAt,
      lines: [receiptLine],
      total: lineTotal,
    },
    movement: {
      type: 'SALE',
      quantityDelta: -quantity,
      balanceAfter: productAfterSale.currentStock,
      reference: receiptNumber,
    },
    initialMovement: {
      type: 'INITIAL',
      quantityDelta: product.currentStock,
      balanceAfter: product.currentStock,
    },
  };
}

export function updateLiveProduct(
  product: Product,
  changes: Pick<Product, 'name' | 'currentPrice'>,
): Product {
  return { ...product, ...changes };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatMovementDelta(value: number): string {
  return value < 0 ? `−${Math.abs(value)}` : `+${value}`;
}

export const DEMO_TRANSACTION = simulateSale(createInitialProduct(), SALE_QUANTITY);

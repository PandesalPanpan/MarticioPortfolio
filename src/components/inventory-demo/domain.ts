export type ArchitectureMode = 'usual' | 'production';

export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
};

export type SaleRecord = {
  receiptNumber: number;
  productId: string;
  productNameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
  soldAt: string;
};

export type DemoState = {
  product: Product;
  receipts: SaleRecord[];
  nextReceiptNumber: number;
};

export type ReceiptResolution =
  | {
      status: 'resolved';
      name: string;
      unitPrice: number;
      total: number;
      source: 'catalog' | 'snapshot';
    }
  | {
      status: 'missing';
      source: 'catalog';
    };

export type DemoFeedback = {
  tone: 'danger' | 'success';
  title: string;
  description: string;
};

export const PRODUCT_ID = 'CABLE-001';
export const SEED_RECEIPT_NUMBER = 1001;
export const FIRST_RECEIPT_SOLD_AT = '2026-09-17T17:42:00+08:00';
export const SALE_QUANTITY = 1;

export function createInitialProduct(): Product {
  return {
    id: PRODUCT_ID,
    sku: PRODUCT_ID,
    name: 'USB-C Cable',
    price: 5,
    stock: 20,
  };
}

export function createSale(
  product: Product,
  receiptNumber: number,
  quantity = SALE_QUANTITY,
  soldAt = FIRST_RECEIPT_SOLD_AT,
): SaleRecord {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Sale quantity must be a positive integer.');
  }

  if (quantity > product.stock) {
    throw new Error('Sale quantity cannot exceed current stock.');
  }

  return {
    receiptNumber,
    productId: product.id,
    productNameSnapshot: product.name,
    unitPriceSnapshot: product.price,
    quantity,
    lineTotal: product.price * quantity,
    soldAt,
  };
}

export function sellOneItem(
  product: Product,
  receiptNumber: number,
  soldAt = FIRST_RECEIPT_SOLD_AT,
): { product: Product; sale: SaleRecord } {
  const sale = createSale(product, receiptNumber, SALE_QUANTITY, soldAt);
  return {
    product: { ...product, stock: product.stock - SALE_QUANTITY },
    sale,
  };
}

export function createInitialDemoState(): DemoState {
  const startingProduct = createInitialProduct();
  const { product, sale } = sellOneItem(startingProduct, SEED_RECEIPT_NUMBER);

  return {
    product,
    receipts: [sale],
    nextReceiptNumber: SEED_RECEIPT_NUMBER + 1,
  };
}

export function updateCatalogProduct(
  product: Product,
  changes: Pick<Product, 'name' | 'price'>,
): Product {
  return { ...product, ...changes };
}

export function resolveReceipt(
  receipt: SaleRecord,
  product: Product | null,
  mode: ArchitectureMode,
): ReceiptResolution {
  if (mode === 'production') {
    return {
      status: 'resolved',
      name: receipt.productNameSnapshot,
      unitPrice: receipt.unitPriceSnapshot,
      total: receipt.lineTotal,
      source: 'snapshot',
    };
  }

  if (!product || product.id !== receipt.productId) {
    return { status: 'missing', source: 'catalog' };
  }

  return {
    status: 'resolved',
    name: product.name,
    unitPrice: product.price,
    total: product.price * receipt.quantity,
    source: 'catalog',
  };
}

export function usualIssueAffectsReceipt(
  receipt: SaleRecord,
  product: Product | null,
): boolean {
  const resolution = resolveReceipt(receipt, product, 'usual');
  return (
    resolution.status === 'missing' ||
    resolution.name !== receipt.productNameSnapshot ||
    resolution.unitPrice !== receipt.unitPriceSnapshot
  );
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

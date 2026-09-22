import { expect, test } from '@playwright/test';

test.describe('recruiter inventory demo', () => {
  test('shows the seeded receipt immediately', async ({ page }) => {
    await page.goto('/');

    const demo = page.locator('#inventory-demo');
    const receipt = demo.getByTestId('receipt-card');
    await expect(demo).toBeVisible();
    await expect(demo.getByText('System design case study')).toBeVisible();
    await expect(
      demo.getByRole('heading', { name: 'Production systems preserve what actually happened.' }),
    ).toBeVisible();
    await expect(demo.getByText('Data integrity', { exact: true })).toBeVisible();
    await expect(demo.getByText('Transaction snapshots', { exact: true })).toBeVisible();
    await expect(demo.getByText('Safe mutations', { exact: true })).toBeVisible();
    await expect(demo.getByText('Failure handling', { exact: true })).toBeVisible();
    await expect(demo.getByText('Interactive demo', { exact: true })).toHaveCount(0);
    await expect(receipt).toContainText('Receipt #1001');
    await expect(receipt).toContainText('USB-C Cable');
    await expect(receipt).toContainText('1 × $5.00');
    await expect(demo.getByTestId('product-editor')).toContainText('19 in stock');
  });

  test('keeps the case-study framing readable in dark mode', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');
    const darkToggle = page.getByRole('button', { name: 'Switch to dark theme' });

    if (await darkToggle.count()) {
      await darkToggle.click();
    }

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(
      demo.getByRole('heading', { name: 'Production systems preserve what actually happened.' }),
    ).toBeVisible();
    await expect(demo.getByText('Transaction snapshots', { exact: true })).toBeVisible();
    await expect(demo.getByRole('tab', { name: 'Production-ready approach' })).toBeVisible();
    expect(await demo.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(
      'rgb(250, 248, 245)',
    );
  });

  test('keeps the walkthrough opt-in and supports the action-driven coach-mark flow', async ({
    page,
  }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    await expect(demo.getByTestId('inventory-guide')).toHaveCount(0);
    await expect(demo.getByRole('button', { name: 'Start guided demo' })).toHaveCount(1);
    await expect(demo.getByRole('button', { name: 'Guide me' })).toHaveCount(0);
    await demo.getByRole('button', { name: 'Start guided demo' }).click();
    await expect(demo.getByRole('dialog')).toContainText('1 OF 3');
    await expect(demo.getByRole('heading', { name: 'Change the live catalog' })).toBeVisible();
    await expect(demo.getByRole('dialog')).toContainText('Try changing $5.00 to $8.00.');
    await expect(demo.getByRole('button', { name: /Next/ })).toHaveCount(0);
    await expect(demo.getByRole('button', { name: /Back/ })).toHaveCount(0);

    await demo.getByLabel('Name').fill('Premium Braided USB-C Cable');
    await demo.getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();
    await expect(demo.getByRole('dialog')).toContainText('2 OF 3');
    await expect(
      demo.getByRole('heading', { name: 'The historical record changed' }),
    ).toBeVisible();
    await expect(demo.getByTestId('receipt-card')).toContainText('1 × $8.00');

    await expect(demo.getByRole('dialog')).toContainText('3 OF 3', { timeout: 3_000 });
    await expect(
      demo.getByRole('heading', { name: 'Apply the production approach' }),
    ).toBeVisible();
    await demo.getByRole('tab', { name: 'Production-ready approach' }).click();
    await expect(demo.getByTestId('receipt-card')).toContainText('USB-C Cable');
    await expect(demo.getByTestId('receipt-card')).toContainText('1 × $5.00');
    await expect(demo.getByTestId('receipt-feedback')).toContainText('Snapshot preserved.');
    await expect(demo.getByTestId('inventory-guide')).toHaveCount(0, { timeout: 3_000 });

    await expect(demo.getByRole('button', { name: 'Replay guided demo' })).toHaveCount(1);
    await demo.getByRole('button', { name: 'Replay guided demo' }).click();
    await demo.getByRole('button', { name: 'Exit guided demo' }).click();
    await expect(demo.getByTestId('inventory-guide')).toHaveCount(0);

    await demo.getByRole('button', { name: 'Replay guided demo' }).click();
    await page.keyboard.press('Escape');
    await expect(demo.getByTestId('inventory-guide')).toHaveCount(0);
  });

  test('makes the usual issue visible after editing and saving the catalog', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    await demo.getByLabel('Name').fill('Premium Braided USB-C Cable');
    await demo.getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();

    const receipt = demo.getByTestId('receipt-card');
    await expect(receipt).toHaveAttribute('data-tone', 'danger');
    await expect(receipt).toContainText('Premium Braided USB-C Cable');
    await expect(receipt).toContainText('1 × $8.00');
    await expect(receipt).toContainText('Historical data changed.');
    await expect(receipt).toContainText(
      "The receipt is reading today's catalog instead of the values captured at sale time.",
    );
  });

  test('switches to production-ready behavior against the same edited catalog', async ({
    page,
  }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    await demo.getByRole('tab', { name: 'Production-ready approach' }).click();
    await demo.getByLabel('Name').fill('Premium Braided USB-C Cable');
    await demo.getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();

    const receipt = demo.getByTestId('receipt-card');
    await expect(receipt).toHaveAttribute('data-tone', 'success');
    await expect(receipt).toContainText('USB-C Cable');
    await expect(receipt).toContainText('1 × $5.00');
    await expect(receipt).toContainText('Snapshot preserved.');
    await expect(receipt).toContainText(
      'The receipt still reflects the original sale, even though the catalog changed.',
    );
  });

  test('shows the different delete outcomes and can reset', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    await demo.getByRole('button', { name: 'Delete product' }).click();
    await expect(demo.getByTestId('receipt-card')).toHaveAttribute(
      'data-receipt-status',
      'missing',
    );
    await expect(demo.getByTestId('receipt-card')).toContainText('Missing item');
    await expect(demo.getByTestId('receipt-card')).toContainText('Historical record broken.');

    await demo.getByRole('button', { name: 'Reset demo' }).click();
    await expect(demo.getByTestId('receipt-card')).toContainText('USB-C Cable');
    await expect(demo.getByTestId('product-editor')).toContainText('19 in stock');

    await demo.getByRole('tab', { name: 'Production-ready approach' }).click();
    await demo.getByRole('button', { name: 'Delete product' }).click();
    await expect(demo.getByTestId('receipt-card')).toHaveAttribute(
      'data-receipt-status',
      'resolved',
    );
    await expect(demo.getByTestId('receipt-card')).toContainText('Historical record preserved.');
  });

  test('sells a new item from the current catalog while retaining the old receipt', async ({
    page,
  }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    await demo.getByRole('tab', { name: 'Production-ready approach' }).click();
    await demo.getByLabel('Name').fill('Premium Braided USB-C Cable');
    await demo.getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();
    await demo.getByRole('button', { name: 'Sell 1 item' }).click();

    await expect(demo.getByTestId('product-editor')).toContainText('18 in stock');
    await expect(demo.getByTestId('receipt-card')).toHaveAttribute('data-receipt-number', '1002');
    await expect(demo.getByTestId('receipt-card')).toContainText('Premium Braided USB-C Cable');
    await expect(demo.getByTestId('receipt-card')).toContainText('1 × $8.00');

    await demo.getByRole('button', { name: 'View receipt #1001' }).click();
    await expect(demo.getByTestId('receipt-card')).toHaveAttribute('data-receipt-number', '1001');
    await expect(demo.getByTestId('receipt-card')).toContainText('USB-C Cable');
    await expect(demo.getByTestId('receipt-card')).toContainText('1 × $5.00');
  });

  test('stacks the editor and receipt without horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);

    const demo = page.locator('#inventory-demo');
    const editorBox = await demo.getByTestId('product-editor').boundingBox();
    const receiptBox = await demo.getByTestId('receipt-card').boundingBox();
    expect(editorBox).not.toBeNull();
    expect(receiptBox).not.toBeNull();
    expect(receiptBox!.y).toBeGreaterThan(editorBox!.y + editorBox!.height - 1);
  });

  test('supports keyboard switching for the architecture toggle', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');
    const production = demo.getByRole('tab', { name: 'Production-ready approach' });
    await production.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(demo.getByRole('tab', { name: 'Naive approach' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await page.keyboard.press('End');
    await expect(production).toHaveAttribute('aria-selected', 'true');
  });

  test('does not emit browser errors on the home page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    await page.goto('/');
    await expect(page.locator('#inventory-demo')).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});

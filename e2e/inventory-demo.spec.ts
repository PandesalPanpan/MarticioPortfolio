import { test, expect } from '@playwright/test';

test.describe('interactive inventory demo', () => {
  test('loads without browser console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    page.on('response', (response) => {
      const path = new URL(response.url()).pathname;
      if (response.status() >= 400 && path !== '/api/chat') {
        consoleErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await expect(page.locator('#inventory-demo')).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test('hovering the sell CTA reveals stock, receipt, and movement in sequence', async ({
    page,
  }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');
    const sell = demo.getByRole('button', { name: 'Sell 2 units →' });

    await sell.hover();
    await page.waitForFunction(() => {
      const demo = document.querySelector('#inventory-demo');
      return demo?.querySelector('[data-testid="movement-preview"][data-visible="true"]') !== null;
    });
    expect(await demo.getByTestId('stock-value').textContent()).toBe('18 units');
    await expect(demo.getByTestId('receipt-preview')).toHaveAttribute('data-visible', 'true');
    await expect(demo.getByTestId('movement-preview')).toHaveAttribute('data-visible', 'true');
    await expect(demo.getByText('#1001 · USB-C Cable')).toHaveCount(1);
    await expect(demo.getByText(/SALE\s+−2/)).toHaveCount(1);
    await expect(demo.getByText('Receipt #1001')).toHaveCount(1);
  });

  test('clicking the sell CTA pins the preview after the pointer leaves', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');
    const sell = demo.getByRole('button', { name: 'Sell 2 units →' });

    await sell.click();
    await page.waitForFunction(() => {
      const demo = document.querySelector('#inventory-demo');
      return demo?.querySelector('[data-testid="movement-preview"][data-visible="true"]') !== null;
    });
    await page.mouse.move(0, 0);

    await expect(demo.getByTestId('stock-value')).toHaveText('18 units');
    await expect(demo.getByRole('button', { name: 'Sold 2 units ✓' })).toBeVisible();
    await expect(demo.getByText('Click again to reset')).toBeVisible();
  });

  test('keyboard activation exposes the same result', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');
    const sell = demo.getByRole('button', { name: 'Sell 2 units →' });

    await sell.focus();
    await page.keyboard.press('Enter');
    await expect(demo.getByTestId('stock-value')).toHaveText('18 units');
    await expect(demo.getByText('#1001 · USB-C Cable')).toBeVisible();
  });

  test('Why this matters opens and proves snapshot values survive a live edit', async ({
    page,
  }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    const whyThisMatters = demo.getByRole('button', { name: 'Why this matters ↗' });
    await expect(whyThisMatters).toHaveAttribute('aria-expanded', 'false');
    await whyThisMatters.click();
    await expect(whyThisMatters).toHaveAttribute('aria-expanded', 'true');
    await expect(
      demo.getByRole('heading', { name: 'What it is now vs. what was sold then' }),
    ).toBeVisible();
    await demo.getByRole('button', { name: 'Edit product' }).click();

    await expect(demo.getByRole('heading', { name: 'Premium Braided USB-C Cable' })).toBeVisible();
    await expect(demo.getByText('$8.00').first()).toBeVisible();
    await expect(demo.getByText('USB-C Cable').last()).toBeVisible();
    await expect(demo.getByText('$5.00').last()).toBeVisible();
  });
});

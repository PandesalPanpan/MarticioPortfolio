import { expect, test } from '@playwright/test';

test.describe('recruiter inventory demo', () => {
  test('shows the seeded receipt immediately', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const demo = page.locator('#inventory-demo');
    const receipt = demo.getByTestId('receipt-card');
    await expect(demo).toBeVisible();
    await expect(
      demo.getByText(/System design case study|Production-minded system design/i),
    ).toHaveCount(0);
    await expect(
      demo.getByRole('heading', { name: "I build systems that don't rewrite the past." }),
    ).toBeVisible();
    await expect(
      demo.getByText('Change the product. The old receipt should stay true.'),
    ).toBeVisible();
    for (const chip of [
      'Data integrity',
      'Transaction snapshots',
      'Safe mutations',
      'Failure handling',
    ]) {
      await expect(demo.getByText(chip, { exact: true })).toHaveCount(0);
    }
    await expect(demo.getByText('20-second challenge')).toBeVisible();
    await expect(demo.getByText('Can you break Receipt #1001?')).toBeVisible();
    await expect(demo.getByRole('button', { name: 'Try it', exact: true })).toHaveCount(1);
    await expect(demo.getByRole('button', { name: 'Replay', exact: true })).toHaveCount(0);
    await expect(
      demo.getByRole('heading', { name: "I build systems that don't rewrite the past." }),
    ).toBeInViewport({ ratio: 1 });
    await expect(demo.getByRole('tablist', { name: 'Architecture mode' })).toBeInViewport({
      ratio: 1,
    });
    await expect(demo.getByRole('button', { name: 'Try it', exact: true })).toBeInViewport({
      ratio: 1,
    });
    expect(
      await page.evaluate(() => {
        const visibleHeight = (selector: string) => {
          const element = document.querySelector(selector);
          if (!element) return 0;
          const rect = element.getBoundingClientRect();
          return Math.max(0, Math.min(innerHeight, rect.bottom) - Math.max(0, rect.top));
        };
        return [
          visibleHeight('#inventory-demo [data-testid="product-editor"]'),
          visibleHeight('#inventory-demo [data-testid="receipt-card"]'),
        ].every((height) => height >= 120);
      }),
      'Expected a meaningful portion of both demo cards in the 1440x900 first view',
    ).toBe(true);
    await expect(demo.getByText('Interactive demo', { exact: true })).toHaveCount(0);
    await expect(receipt).toContainText('Receipt #1001');
    await expect(receipt).toContainText('USB-C Cable');
    await expect(receipt).toContainText('1 × $5.00');
    await expect(demo.getByTestId('product-editor')).toContainText('19 in stock');
  });

  test('keeps the recruiter hook readable in dark mode', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');
    const darkToggle = page.getByRole('button', { name: 'Switch to dark theme' });

    if (await darkToggle.count()) {
      await darkToggle.click();
    }

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(
      demo.getByRole('heading', { name: "I build systems that don't rewrite the past." }),
    ).toBeVisible();
    await expect(demo.getByText('20-second challenge')).toBeVisible();
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
    await expect(demo.getByRole('button', { name: 'Try it', exact: true })).toHaveCount(1);
    await expect(demo.getByRole('button', { name: 'Guide me' })).toHaveCount(0);
    await demo.getByRole('button', { name: 'Try it', exact: true }).click();
    await expect(demo.getByRole('dialog')).toContainText('1 OF 4');
    await expect(demo.getByRole('heading', { name: 'Remember this receipt' })).toBeVisible();
    await expect(demo.getByRole('dialog')).toContainText(
      '#1001 · USB-C Cable · $5.00',
    );
    await expect(demo.getByTestId('receipt-card')).toHaveAttribute('data-guide-target', 'true');
    await expect(demo.getByRole('button', { name: 'Got it' })).toBeVisible();
    await expect(demo.getByRole('button', { name: /Next/ })).toHaveCount(0);
    await expect(demo.getByRole('button', { name: /Back/ })).toHaveCount(0);

    await page.waitForTimeout(1_700);
    await expect(demo.getByRole('dialog')).toContainText('1 OF 4');

    await demo.getByRole('button', { name: 'Got it' }).click();
    await expect(demo.getByRole('dialog')).toContainText('2 OF 4');
    await expect(
      demo.getByRole('heading', { name: 'Change the price' }),
    ).toBeVisible();
    await expect(demo.getByRole('dialog')).toContainText('Set it to $8.00, then Save.');
    await expect(demo.getByTestId('product-editor')).toHaveAttribute(
      'data-guide-target',
      'true',
    );
    await expect(demo.getByRole('button', { name: /Next|Back|Previous/ })).toHaveCount(0);

    await demo.getByLabel('Name').fill('Premium Braided USB-C Cable');
    await demo.getByTestId('product-editor').getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();
    await expect(demo.getByRole('dialog')).toContainText('3 OF 4');
    await expect(
      demo.getByRole('heading', { name: 'The old receipt changed' }),
    ).toBeVisible();
    await expect(demo.getByTestId('receipt-card')).toContainText('1 × $8.00');
    await expect(demo.getByRole('dialog')).toContainText('$5.00 became $8.00.');
    await expect(demo.getByRole('dialog')).toContainText("That's the bug.");
    await expect(demo.getByRole('button', { name: 'Fix it' })).toBeVisible();

    await page.waitForTimeout(1_700);
    await expect(demo.getByRole('dialog')).toContainText('3 OF 4');
    await expect(
      demo.getByRole('heading', { name: 'The old receipt changed' }),
    ).toBeVisible();
    await demo.getByRole('button', { name: 'Fix it' }).click();
    await expect(demo.getByRole('dialog')).toContainText('4 OF 4');
    await expect(
      demo.getByRole('heading', { name: 'Protect the history' }),
    ).toBeVisible();
    await expect(demo.getByRole('dialog')).toContainText('Switch to Production-ready.');
    await expect(demo.getByTestId('mode-toggle')).toHaveAttribute('data-guide-target', 'true');
    await demo.getByRole('tab', { name: 'Production-ready approach' }).click();
    await expect(demo.getByTestId('receipt-card')).toContainText('USB-C Cable');
    await expect(demo.getByTestId('receipt-card')).toContainText('1 × $5.00');
    await expect(demo.getByTestId('receipt-feedback')).toContainText('Snapshot preserved.');
    await expect(demo.getByRole('dialog')).toContainText('Snapshot preserved.');
    await expect(demo.getByRole('dialog')).toContainText('Receipt #1001 stays $5.00.');
    await expect(demo.getByTestId('inventory-guide')).toHaveCount(0, { timeout: 3_000 });

    await expect(demo.getByRole('button', { name: 'Replay', exact: true })).toHaveCount(1);
    await demo.getByRole('button', { name: 'Replay', exact: true }).click();
    await expect(demo.getByRole('dialog')).toContainText('1 OF 4');
    await expect(demo.getByRole('tab', { name: 'Naive approach' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(demo.getByLabel('Name')).toHaveValue('USB-C Cable');
    await expect(demo.getByTestId('product-editor').getByLabel('Price')).toHaveValue('5.00');
    await expect(demo.getByTestId('product-editor')).toContainText('19 in stock');
    await expect(demo.getByTestId('receipt-card')).toHaveAttribute('data-receipt-number', '1001');
    await demo.getByRole('button', { name: 'Exit guided demo' }).click();
    await expect(demo.getByTestId('inventory-guide')).toHaveCount(0);

    await demo.getByRole('button', { name: 'Replay', exact: true }).click();
    await demo.getByRole('button', { name: 'Got it' }).click();
    await demo.getByTestId('product-editor').getByLabel('Price').fill('7');
    await demo.getByRole('button', { name: 'Save changes' }).click();
    await page.keyboard.press('Escape');
    await expect(demo.getByTestId('inventory-guide')).toHaveCount(0);
    await expect(demo.getByTestId('product-editor').getByLabel('Price')).toHaveValue('7.00');
  });

  test('keeps all guide steps readable in dark mode', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');
    const darkToggle = page.getByRole('button', { name: 'Switch to dark theme' });

    if (await darkToggle.count()) {
      await darkToggle.click();
    }

    await demo.getByRole('button', { name: 'Try it', exact: true }).click();
    for (const step of ['1 OF 4', 'Remember this receipt']) {
      await expect(demo.getByRole('dialog')).toContainText(step);
    }
    await expect(demo.getByRole('dialog')).toBeVisible();
    await expect(
      demo.getByRole('dialog').evaluate((element) => getComputedStyle(element).color),
    ).resolves.not.toBe('rgb(255, 255, 255)');

    await demo.getByRole('button', { name: 'Got it' }).click();
    await expect(demo.getByRole('dialog')).toContainText('2 OF 4');
    await demo.getByTestId('product-editor').getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();
    await expect(demo.getByRole('dialog')).toContainText('3 OF 4');
    await expect(demo.getByRole('dialog')).toContainText('$5.00 became $8.00.');
    await demo.getByRole('button', { name: 'Fix it' }).click();
    await expect(demo.getByRole('dialog')).toContainText('4 OF 4');
    await demo.getByRole('tab', { name: 'Production-ready approach' }).click();
    await expect(demo.getByRole('dialog')).toContainText('Snapshot preserved.');
    await expect(demo.getByRole('dialog')).toContainText('Receipt #1001 stays $5.00.');
    await expect(demo.getByTestId('receipt-card')).toContainText('1 × $5.00');
  });

  test('keeps the four-step guide usable without overflow across target viewports', async ({
    page,
  }) => {
    for (const { width, height } of [
      { width: 375, height: 844 },
      { width: 390, height: 844 },
      { width: 430, height: 844 },
      { width: 768, height: 844 },
      { width: 820, height: 844 },
      { width: 1440, height: 844 },
      { width: 375, height: 667 },
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      const demo = page.locator('#inventory-demo');
      const receipt = demo.getByTestId('receipt-card');

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `Expected no horizontal overflow at ${width}x${height}px`,
      ).toBe(true);
      await demo.getByRole('button', { name: 'Try it', exact: true }).click();
      await expect(receipt).toHaveAttribute('data-guide-target', 'true');
      await expect(receipt).toBeVisible();
      expect(
        await page.evaluate(() => {
          const dialog = document.querySelector('#inventory-demo [role="dialog"]');
          const target = document.querySelector('#inventory-demo [data-testid="receipt-card"]');
          if (!dialog || !target) return false;
          const dialogBox = dialog.getBoundingClientRect();
          const targetBox = target.getBoundingClientRect();
          return (
            dialogBox.right <= targetBox.left ||
            dialogBox.left >= targetBox.right ||
            dialogBox.bottom <= targetBox.top ||
            dialogBox.top >= targetBox.bottom
          );
        }),
        `Expected the step 1 coachmark not to cover receipt values at ${width}x${height}px`,
      ).toBe(true);
      await demo.getByRole('button', { name: 'Got it' }).click();
      await expect(demo.getByRole('dialog')).toContainText('2 OF 4');
      if (width >= 1200) {
        await expect(demo.getByRole('dialog')).toHaveAttribute('data-guide-placement', 'right');
      } else if (width < 680) {
        await expect(demo.getByRole('dialog')).toHaveAttribute(
          'data-guide-placement',
          /^(below|above)$/,
        );
      }
      const editor = demo.getByTestId('product-editor');
      await expect(editor).toBeVisible();
      for (const control of [
        editor.getByLabel('Name'),
        editor.getByLabel('Price'),
        editor.getByRole('button', { name: 'Sell 1 item' }),
        editor.getByRole('button', { name: 'Save changes' }),
        editor.getByRole('button', { name: 'Delete product' }),
      ]) {
        await expect(control).toBeInViewport({ ratio: 1 });
      }
      expect(
        await page.evaluate(() => {
          const target = document.querySelector('#inventory-demo [data-testid="product-editor"]');
          const dialog = document.querySelector('#inventory-demo [role="dialog"]');
          if (!target || !dialog) return false;
          const editorBox = target.getBoundingClientRect();
          const calloutBox = dialog.getBoundingClientRect();
          const overlap =
            calloutBox.left < editorBox.right &&
            calloutBox.right > editorBox.left &&
            calloutBox.top < editorBox.bottom &&
            calloutBox.bottom > editorBox.top;
          const breathingRoom =
            calloutBox.right + 12 <= editorBox.left ||
            calloutBox.left >= editorBox.right + 12 ||
            calloutBox.bottom + 12 <= editorBox.top ||
            calloutBox.top >= editorBox.bottom + 12;
          return !overlap && breathingRoom;
        }),
        `Expected the Step 2 coachmark to leave the Product Editor clear at ${width}x${height}px`,
      ).toBe(true);
      await expect(editor.getByLabel('Name')).toBeEditable();
      await editor.getByLabel('Price').fill('8');
      await demo.getByRole('button', { name: 'Save changes' }).click();
      await expect(demo.getByRole('dialog')).toContainText('3 OF 4');
      await expect(demo.getByRole('heading', { name: 'The old receipt changed' })).toBeVisible();
      await expect(receipt).toHaveAttribute('data-guide-target', 'true');
      await page.waitForTimeout(400);
      await demo.getByRole('button', { name: 'Fix it' }).click();
      await expect(demo.getByTestId('mode-toggle')).toHaveAttribute('data-guide-target', 'true');
      await expect(demo.getByRole('tab', { name: 'Production-ready approach' })).toBeVisible();
    }
  });

  test('makes the usual issue visible after editing and saving the catalog', async ({ page }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    await demo.getByLabel('Name').fill('Premium Braided USB-C Cable');
    await demo.getByTestId('product-editor').getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();

    const receipt = demo.getByTestId('receipt-card');
    await expect(receipt).toHaveAttribute('data-tone', 'danger');
    await expect(receipt).toContainText('Premium Braided USB-C Cable');
    await expect(receipt).toContainText('1 × $8.00');
    await expect(receipt).toContainText('Historical data changed.');
    await expect(receipt).toContainText(
      "This old receipt is reading today's catalog.",
    );
  });

  test('switches to production-ready behavior against the same edited catalog', async ({
    page,
  }) => {
    await page.goto('/');
    const demo = page.locator('#inventory-demo');

    await demo.getByRole('tab', { name: 'Production-ready approach' }).click();
    await demo.getByLabel('Name').fill('Premium Braided USB-C Cable');
    await demo.getByTestId('product-editor').getByLabel('Price').fill('8');
    await demo.getByRole('button', { name: 'Save changes' }).click();

    const receipt = demo.getByTestId('receipt-card');
    await expect(receipt).toHaveAttribute('data-tone', 'success');
    await expect(receipt).toContainText('USB-C Cable');
    await expect(receipt).toContainText('1 × $5.00');
    await expect(receipt).toContainText('Snapshot preserved.');
    await expect(receipt).toContainText(
      'Receipt #1001 stays true to the original sale.',
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
    await demo.getByTestId('product-editor').getByLabel('Price').fill('8');
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

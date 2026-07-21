import { test, expect } from '@playwright/test';

test('homepage loads, theme toggle works, projects visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /runs your business/i, level: 1 })).toBeVisible();
  // The name still appears in the hero for identity/SEO, even though the value prop is the h1.
  await expect(page.getByText('Peter Elijah Marticio', { exact: false }).first()).toBeVisible();

  // Projects: at least 3 key projects visible
  await expect(page.locator('h3').filter({ hasText: 'MemorizeMate' })).toBeVisible();
  await expect(page.locator('h3').filter({ hasText: 'ClassHub' })).toBeVisible();
  await expect(page.locator('h3').filter({ hasText: 'Threaded' })).toBeVisible();

  // Theme toggle flips data-theme
  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.getByRole('button', { name: /Switch to (light|dark) theme/ }).click();
  const next = await page.locator('html').getAttribute('data-theme');
  expect(next).not.toBe(initialTheme);

  // /handmade is reachable
  await page.getByRole('link', { name: 'Handmade' }).click();
  await expect(page.getByRole('heading', { name: /Handmade version/i })).toBeVisible();
});

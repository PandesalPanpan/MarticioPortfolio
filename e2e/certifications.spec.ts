import { test, expect } from '@playwright/test';

test('certifications section renders and the lightbox opens and closes', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#certifications');
  await expect(section.getByRole('heading', { name: 'Certifications' })).toBeVisible();

  // Both certificate cards are present.
  await expect(section.getByText('CS50x', { exact: false })).toBeVisible();
  await expect(section.getByText('Computer Systems Servicing', { exact: false })).toBeVisible();

  // Open the CS50 lightbox.
  await section.getByRole('button', { name: /View .*CS50.* certificate/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Dialog carries the verify + download actions.
  await expect(dialog.getByRole('link', { name: /Verify/i })).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Download PDF/i })).toBeVisible();

  // Escape closes it.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('odin card links to merged contributions', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: /View merged contributions/i });
  await expect(link).toHaveAttribute(
    'href',
    'https://github.com/TheOdinProject/curriculum/pulls?q=is%3Apr+is%3Amerged+author%3APandesalPanpan',
  );
});

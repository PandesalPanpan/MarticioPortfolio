import { test, expect } from '@playwright/test';

test('certifications section lists both credentials and links out to verify', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#certs');
  await expect(section.getByRole('heading', { name: 'Certifications' })).toBeVisible();

  // Both certificate cards are present.
  await expect(section.getByText('CS50x', { exact: false })).toBeVisible();
  await expect(section.getByText('Computer Systems Servicing', { exact: false })).toBeVisible();

  // CS50 links to Harvard's public verification page; TESDA falls back to the PDF.
  await expect(section.getByRole('link', { name: /Verify/i })).toHaveAttribute(
    'href',
    'https://cs50.harvard.edu/certificates/fd50e363-693b-4669-a6d5-3dbd4e46c552',
  );
  await expect(section.getByRole('link', { name: /^PDF$/i })).toHaveAttribute(
    'href',
    '/NC_marticio.pdf',
  );
});

test('odin entry links to merged contributions under the Education tab', async ({ page }) => {
  await page.goto('/');
  // The education entries only render once that tab is selected.
  await page.locator('#work').getByRole('tab', { name: 'Education' }).click();

  const link = page.getByRole('link', { name: /View merged contributions/i });
  await expect(link).toHaveAttribute(
    'href',
    'https://github.com/TheOdinProject/curriculum/pulls?q=is%3Apr+is%3Amerged+author%3APandesalPanpan',
  );
});

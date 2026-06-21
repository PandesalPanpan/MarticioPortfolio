import { test, expect } from '@playwright/test';

test('sections render in the new order: experience → skills → projects', async ({ page }) => {
  await page.goto('/');
  const order = await page.evaluate(() => {
    const ids = ['experience', 'skills', 'projects', 'education', 'certifications'];
    return ids
      .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity }))
      .sort((a, b) => a.top - b.top)
      .map((x) => x.id);
  });
  expect(order.indexOf('experience')).toBeLessThan(order.indexOf('skills'));
  expect(order.indexOf('skills')).toBeLessThan(order.indexOf('projects'));
});

test('MemorizeMate and Threaded are the first two projects (side by side)', async ({ page }) => {
  await page.goto('/');
  const titles = await page.locator('#projects h3').allInnerTexts();
  expect(titles[0]).toBe('MemorizeMate');
  expect(titles[1]).toBe('Threaded');
});

test('skill chips render brand/icon SVGs', async ({ page }) => {
  await page.goto('/');
  const iconCount = await page.locator('#skills li svg').count();
  expect(iconCount).toBeGreaterThanOrEqual(15);
});

test('skills section renders all category groups', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#skills');
  await expect(section.getByRole('heading', { name: 'Skills' })).toBeVisible();
  for (const label of ['Languages', 'Frameworks & Libraries', 'Infra & Tooling', 'Data']) {
    await expect(section.getByRole('heading', { name: label })).toBeVisible();
  }
});

test('hero is text-only (no character figure) and shows the brand monogram', async ({ page }) => {
  await page.goto('/');
  // The illustrated character has been removed.
  await expect(page.getByRole('img', { name: /Illustrated avatar of Peter/i })).toHaveCount(0);
  // The header monogram links home.
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
});

test('resume download link points to the right file and CV is gone', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Download Resume/i })).toHaveAttribute('href', '/resume.pdf');
  await expect(page.getByRole('link', { name: /Download CV/i })).toHaveCount(0);
});

test('jargon tooltip is reachable by keyboard focus and exposes a definition', async ({ page }) => {
  await page.goto('/');
  const vps = page.locator('#hero-title').locator('xpath=following::*[normalize-space(text())="VPS"][1]');
  await vps.focus();
  const describedById = await vps.getAttribute('aria-describedby');
  expect(describedById).toBeTruthy();
  await expect(page.locator(`#${describedById}`)).toContainText(/Virtual Private Server/i);
});

test('project signature video opens in the lightbox and renders a <video>', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Play MemorizeMate walkthrough video/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('video')).toHaveAttribute('src', '/media/memorizemate/study.mp4');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('project screenshot gallery opens an image in the lightbox', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /View screenshot: Daily streak tracking/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute('src', '/media/threaded/streak.png');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

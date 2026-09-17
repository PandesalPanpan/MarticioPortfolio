import { test, expect } from '@playwright/test';

const SECTION_ORDER = [
  'top',
  'inventory-demo',
  'work',
  'now',
  'projects',
  'skills',
  'certs',
  'contact',
];

test('sections render top to bottom: hero → inventory demo → background → now → projects → skills → certs → contact', async ({
  page,
}) => {
  await page.goto('/');
  const tops = await page.evaluate(
    (ids) => ids.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? null),
    SECTION_ORDER,
  );
  // Every section is present...
  expect(tops.every((t) => t !== null)).toBe(true);
  // ...and they appear in this order down the page.
  const sorted = [...(tops as number[])].sort((a, b) => a - b);
  expect(tops).toEqual(sorted);
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

test('header nav stays sticky after scrolling down the page', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await expect(nav).toBeVisible();
  // Scroll past the first viewport (Skills/Projects); the header must remain pinned.
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(nav).toBeInViewport();
  const top = await page.locator('header').evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBe(0);
});

test('hero shows the portrait photo', async ({ page }) => {
  await page.goto('/');
  const portrait = page.getByRole('img', { name: /Portrait of Peter Elijah Marticio/i });
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute('src', '/formal_pic.jpg');
});

test('open-source link points to merged Odin curriculum PRs in a new tab', async ({ page }) => {
  await page.goto('/');
  const oss = page.getByRole('link', { name: /contribute to open source/i });
  await expect(oss).toHaveAttribute('target', '_blank');
  await expect(oss).toHaveAttribute(
    'href',
    'https://github.com/TheOdinProject/curriculum/pulls?q=is%3Apr+is%3Amerged+author%3APandesalPanpan',
  );
});

test('FindTheNumber is the third project (after Threaded) and jollibee-clone is gone', async ({
  page,
}) => {
  await page.goto('/');
  const titles = await page.locator('#projects h3').allInnerTexts();
  expect(titles[2]).toBe('FindTheNumber');
  expect(titles).not.toContain('jollibee-clone');
});

test('resume download link points to the right file and CV is gone', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Download resume/i })).toHaveAttribute(
    'href',
    '/resume.pdf',
  );
  await expect(page.getByRole('link', { name: /Download CV/i })).toHaveCount(0);
});

test('jargon tooltip is reachable by keyboard focus and exposes a definition', async ({ page }) => {
  await page.goto('/');
  const vps = page
    .locator('#hero-title')
    .locator('xpath=following::*[normalize-space(text())="VPS"][1]');
  await vps.focus();
  const describedById = await vps.getAttribute('aria-describedby');
  expect(describedById).toBeTruthy();
  await expect(page.locator(`#${describedById}`)).toContainText(/Virtual Private Server/i);
});

test('project signature video opens in the lightbox and autoplays muted', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Play MemorizeMate walkthrough/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const video = dialog.locator('video');
  await expect(video).toHaveAttribute('src', '/media/memorizemate/study.mp4');
  // Muted is required for autoplay to actually start (otherwise it looks like a still).
  await expect(video).toHaveJSProperty('muted', true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('lightbox gallery navigates between images without closing', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /View screenshot: Daily streak tracking/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute('src', '/media/threaded/streak.png');
  // Next advances to the following gallery image; the dialog stays open.
  await dialog.getByRole('button', { name: 'Next' }).click();
  await expect(dialog.locator('img')).toHaveAttribute('src', '/media/threaded/shop.png');
  // Arrow-key navigation also works.
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('img')).toHaveAttribute('src', '/media/threaded/streak.png');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('project Live and Source links open in a new tab', async ({ page }) => {
  await page.goto('/');
  const projects = page.locator('#projects');
  await expect(projects.getByRole('link', { name: /^Live/ }).first()).toHaveAttribute(
    'target',
    '_blank',
  );
  await expect(projects.getByRole('link', { name: /^Source/ }).first()).toHaveAttribute(
    'target',
    '_blank',
  );
});

test('each project card states role and status', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('#projects article').first();
  await expect(first.getByRole('term').filter({ hasText: 'Role' })).toBeVisible();
  await expect(first.getByText('Sole developer')).toBeVisible();
  await expect(first.getByText('Live · self-hosted')).toBeVisible();
});

test('background tabs swap work history for education', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('#work');
  await expect(section.getByRole('heading', { name: 'Caret Solutions Inc.' })).toBeVisible();

  await section.getByRole('tab', { name: 'Education' }).click();
  await expect(
    section.getByRole('heading', { name: 'Polytechnic University of the Philippines' }),
  ).toBeVisible();
  await expect(section.getByRole('heading', { name: 'Caret Solutions Inc.' })).toHaveCount(0);
});

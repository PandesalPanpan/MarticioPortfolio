import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const base = 'http://localhost:5173';

  const routes = ['/', '/handmade', '/colophon'];

  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = results.violations.filter(v => v.impact !== null);
    if (violations.length > 0) {
      console.log(`\n## ${route} — ${violations.length} violation(s)`);
      for (const v of violations) {
        console.log(`\n  [${v.impact}] ${v.id}: ${v.help}`);
        console.log(`  ${v.helpUrl}`);
        for (const node of v.nodes) {
          console.log(`    ${node.target.join(' ')}`);
          console.log(`    HTML: ${node.html}`);
          if (node.failureSummary) console.log(`    Summary: ${node.failureSummary}`);
        }
      }
    } else {
      console.log(`\n${route} — 0 violations`);
    }
  }

  await browser.close();
}

main();

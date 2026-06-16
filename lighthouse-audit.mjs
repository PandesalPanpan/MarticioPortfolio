import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import fs from 'fs';

const PORT = process.argv[2] || '5173';
const BASE = `http://localhost:${PORT}`;

async function main() {
  const browser = await chromium.launch({ args: ['--remote-debugging-port=9222'] });

  console.log(`Auditing ${BASE} ...`);
  const result = await lighthouse(BASE, {
    port: 9222,
    onlyCategories: ['performance'],
    output: 'html',
  }, null);

  const lhr = result.lhr;
  const score = Math.round(lhr.categories.performance.score * 100);

  console.log(`\nPerformance: ${score}/100`);
  console.log(`  FCP: ${(lhr.audits['first-contentful-paint'].numericValue / 1000).toFixed(2)}s`);
  console.log(`  LCP: ${(lhr.audits['largest-contentful-paint'].numericValue / 1000).toFixed(2)}s`);
  console.log(`  TBT: ${(lhr.audits['total-blocking-time'].numericValue).toFixed(0)}ms`);
  console.log(`  CLS: ${lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3)}`);

  if (score < 90) {
    console.log('\nFailing audits:');
    for (const [id, audit] of Object.entries(lhr.audits)) {
      if (audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'informative') {
        console.log(`  [${(audit.score * 100).toFixed(0)}] ${audit.title}: ${audit.displayValue || ''}`);
      }
    }
  }

  const diag = lhr.audits.diagnostics;
  if (diag?.details?.items?.length) {
    const d = diag.details.items[0];
    console.log(`\n  Requests: ${d.numRequests} | Weight: ${(d.totalByteWeight/1024).toFixed(0)}KB`);
  }

  fs.writeFileSync('lighthouse-result.html', result.report);
  console.log('\nSaved lighthouse-result.html');

  await browser.close();
  process.exit(score >= 90 ? 0 : 1);
}

main();

// Run: node --test scripts/inspect-spacing.test.mjs  (needs Playwright; set PLAYWRIGHT_HOME if not found upward)
// Spacing candidates ported from Stageshow: every bad fixture fires exactly its own candidate and every good fixture
// stays quiet for all of them. Calls inspectSpacing directly, without inspect-ui.mjs.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inspectSpacing } from './inspect-spacing.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CANDIDATES = ['inset', 'control', 'stack', 'touching', 'padding', 'squeezed', 'spill', 'clipped'];

// Same search order as inspect-ui.mjs: PLAYWRIGHT_HOME, cwd and its parents, this folder and its parents, npm root -g.
function loadPlaywright() {
  const bases = process.env.PLAYWRIGHT_HOME ? [resolve(process.env.PLAYWRIGHT_HOME, 'package.json')] : [];
  for (let dir of [process.cwd(), here]) for (let i = 0; i < 8; i++) { bases.push(join(dir, 'package.json')); if (dirname(dir) === dir) break; dir = dirname(dir); }
  try { bases.push(join(execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 }).trim(), '..', 'package.json')); } catch { /* no npm */ }
  for (const base of bases) for (const mod of ['playwright', '@playwright/test', 'playwright-core']) {
    try { return createRequire(base)(mod); } catch { /* next */ }
  }
  return null;
}

let browser, page;
before(async () => {
  const pw = loadPlaywright();
  if (!pw?.chromium) return;
  browser = await pw.chromium.launch();
  page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
});
after(async () => { await browser?.close(); });

async function rulesFor(name) {
  await page.goto(pathToFileURL(join(here, 'fixtures', `spacing-${name}.html`)).href);
  const { candidates, evidence } = await inspectSpacing(page);
  return { rules: candidates.map((c) => c.split(':')[0]), candidates, evidence };
}

for (const name of CANDIDATES) {
  test(`spacing-${name}: the bad fixture fires only spacing-${name}`, async (t) => {
    if (!page) return t.skip('Playwright not available');
    const { rules, candidates, evidence } = await rulesFor(`${name}-ruim`);
    assert.deepEqual(rules, [`spacing-${name}`], JSON.stringify(evidence.findings));
    assert.ok(candidates[0].endsWith('(candidato)'));
  });
  test(`spacing-${name}: the good fixture is quiet for every spacing candidate`, async (t) => {
    if (!page) return t.skip('Playwright not available');
    const { candidates, evidence } = await rulesFor(`${name}-bom`);
    assert.deepEqual(candidates, [], JSON.stringify(evidence.findings));
  });
}

test('squeezed restores the inline flex-shrink it probes', async (t) => {
  if (!page) return t.skip('Playwright not available');
  await rulesFor('squeezed-ruim');
  // Chrome may leave an empty style="" behind; what matters is that no flex-shrink stays inline.
  assert.equal(await page.$eval('.avatar', (e) => e.style.flexShrink), '');
});

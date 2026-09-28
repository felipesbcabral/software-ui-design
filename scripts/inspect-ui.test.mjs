// Run: node --test scripts/inspect-ui.test.mjs  (needs Playwright; set PLAYWRIGHT_HOME if not in cwd)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = pathToFileURL(join(here, 'fixtures', 'inspect-fixture.html')).href;

function run(extra = []) {
  const out = mkdtempSync(join(tmpdir(), 'inspect-'));
  try {
    execFileSync(process.execPath, [join(here, 'inspect-ui.mjs'), fixture, '--out', out, '--widths', '1440', '--tabs', '8', '--wait', '200', ...extra], { stdio: 'pipe' });
  } catch (e) {
    if (e.status === 3) return { skipped: true };
    throw e;
  }
  return JSON.parse(readFileSync(join(out, 'report.json'), 'utf8')).runs[0];
}

test('flags every seeded defect in the fixture', (t) => {
  const r = run(['--data-screen']);
  if (r.skipped) return t.skip('Playwright not available');
  const f = r.findings.join('\n');
  assert.match(f, /overflow:/, 'horizontal overflow');
  assert.match(f, /width-usage:/, 'narrow centered column on a data screen');
  assert.match(f, /targets:/, '16px button');
  assert.match(f, /botões\/links sem nome/, 'empty button');
  assert.match(f, /campos sem rótulo/, 'placeholder-only input');
  assert.match(f, /imagens sem alt/, 'img without alt');
  assert.match(f, /contrast:/, '#bbb text on white');
  assert.match(f, /tooltips:/, 'tooltip on hover only');
  assert.match(f, /columns:/, 'zero-width table column');
  assert.ok(r.no_focus_indicator.some((s) => s.includes('Sem foco')), 'button with outline removed');
  assert.equal(r.metrics.nav_width, 240);
});

test('width-usage is only judged when --data-screen is set', (t) => {
  const r = run();
  if (r.skipped) return t.skip('Playwright not available');
  assert.ok(!r.findings.some((s) => s.startsWith('width-usage')));
});

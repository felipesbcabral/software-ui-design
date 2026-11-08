// Run: node --test scripts/inspect-candidates.test.mjs  (needs Playwright; set PLAYWRIGHT_HOME if not in cwd)
// Candidate detectors ported from Stageshow: every bad fixture fires exactly its own candidate, every good fixture
// stays quiet for all of them, and candidates never enter findings nor the exit code.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const CANDIDATES = ['layout-fit', 'layout-edge', 'layout-bottom', 'icon-mixed', 'icon-emoji', 'icon-clipped', 'icon-translucent'];
const url = (name) => pathToFileURL(join(here, 'fixtures', `${name}.html`)).href;

function inspect(names, extra = []) {
  const out = mkdtempSync(join(tmpdir(), 'inspect-candidates-'));
  try {
    execFileSync(process.execPath, [join(here, 'inspect-ui.mjs'), ...names.map(url), '--out', out, '--widths', '1440', '--tabs', '0', '--wait', '0', ...extra], { stdio: 'pipe' });
  } catch (e) {
    if (e.status === 3) return null;
    throw e;
  }
  return JSON.parse(readFileSync(join(out, 'report.json'), 'utf8')).runs;
}

let pairRuns;
const pairs = () => pairRuns === undefined ? (pairRuns = inspect(CANDIDATES.flatMap((c) => [`${c}-ruim`, `${c}-bom`]))) : pairRuns;
// Scoped to this family: spacing-* has its own test, and layout-bottom-ruim also fires spacing-padding (same defect).
const rulesOf = (run) => run.candidates.map((c) => c.split(':')[0]).filter((r) => CANDIDATES.includes(r));

for (const [i, name] of CANDIDATES.entries()) {
  test(`${name}: the bad fixture fires only ${name}`, (t) => {
    const runs = pairs();
    if (!runs) return t.skip('Playwright not available');
    const bad = runs[i * 2];
    assert.ok(!bad.error, bad.error);
    assert.deepEqual(rulesOf(bad), [name], JSON.stringify(bad.candidates));
    assert.ok(bad.candidates[0].endsWith('(candidato)'));
    assert.ok(bad.candidate_evidence.layout.findings.concat(bad.candidate_evidence.icons.findings).some((f) => f.rule === name));
  });
  test(`${name}: the good fixture is quiet for every candidate`, (t) => {
    const runs = pairs();
    if (!runs) return t.skip('Playwright not available');
    const good = runs[i * 2 + 1];
    assert.ok(!good.error, good.error);
    assert.deepEqual(good.candidates, [], JSON.stringify(good.candidates));
  });
}

test('candidates stay out of findings and out of the --fail-on-findings exit code', (t) => {
  const runs = pairs();
  if (!runs) return t.skip('Playwright not available');
  for (const run of runs) assert.ok(!run.findings.some((f) => CANDIDATES.some((c) => f.startsWith(`${c}:`))), JSON.stringify(run.findings));
  // The bad fixtures have no regular finding, so a strict gate must still exit 0 with candidates present.
  const strict = inspect(CANDIDATES.map((c) => `${c}-ruim`), ['--fail-on-findings']);
  assert.equal(strict.length, CANDIDATES.length);
  assert.ok(strict.every((run) => rulesOf(run).length === 1 && run.findings.length === 0));
});

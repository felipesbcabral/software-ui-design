// Run: node --test scripts/inspect-motion.test.mjs  (browser tests need Playwright; set PLAYWRIGHT_HOME if not in cwd)
// Motion candidates ported from Stageshow: pure analysis on synthetic frames, flag validation, and fixture pairs where
// every bad fixture fires exactly its own candidate and every good fixture stays quiet; never findings, never the exit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { analyseFrames, motionCoverage, summarizeMotion } from './inspect-motion.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const url = (name) => pathToFileURL(join(here, 'fixtures', `${name}.html`)).href;

// Synthetic recording: one item per frame, [id, x, y, w, h, parent, next, layoutHeight], 16.7 ms apart.
const frames = (tracks, dt = 16.7) => tracks[0].map((_, f) => ({ t: f * dt, items: tracks.map((track) => track[f]) }));
const box = (id, y, h = 40, extra = {}) => [id, 0, y, 100, h, extra.parent ?? -1, extra.next ?? -1, extra.lh ?? -1];

test('analyse: a one-frame snap from rest is a jump; a glide is not', () => {
  const snap = frames([[0, 0, 0, 0, 48, 48, 48, 48].map((y) => box(0, y))]);
  const { jumps } = analyseFrames(snap, ['li "Chamado"']);
  assert.equal(jumps.length, 1);
  assert.deepEqual([jumps[0].axis, jumps[0].delta, jumps[0].element], ['y', 48, 'li "Chamado"']);
  const glide = frames([[0, 4, 8, 12, 16, 20, 24, 28].map((y) => box(0, y))]);
  assert.equal(analyseFrames(glide, ['li']).jumps.length, 0);
});

test('analyse: a late frame does not hide a snap, and a glide across a late frame is not a jump', () => {
  const snap = frames([[0, 0, 0, 48, 48, 48].map((y) => box(0, y))]);
  snap.slice(3).forEach((f) => { f.t += 33; }); // the snap lands on a frame that came 3 frames late
  assert.equal(analyseFrames(snap, ['li']).jumps.length, 1);
  const glide = frames([[0, 4, 8, 20, 24, 28].map((y) => box(0, y))]);
  glide.slice(3).forEach((f) => { f.t += 33; }); // 12px in 3 frames of time at 4px a frame
  assert.equal(analyseFrames(glide, ['li']).jumps.length, 0);
});

test('analyse: a child dragged by its parent is reported once, as the parent', () => {
  const ys = [0, 0, 0, 30, 30, 30];
  const { jumps } = analyseFrames(frames([ys.map((y) => box(0, y)), ys.map((y) => box(1, y + 8, 20, { parent: 0 }))]), ['card', 'texto']);
  assert.deepEqual(jumps.map((j) => j.element), ['card']);
});

test('analyse: siblings on different curves drift; siblings on one curve do not', () => {
  const n = 40, rate = 0.25;
  const a = Array.from({ length: n }, (_, f) => box(0, f * 1.0, 40, { next: 1 }));
  const outOfStep = Array.from({ length: n }, (_, f) => box(1, 52 + f * 0.6));
  const inStep = Array.from({ length: n }, (_, f) => box(1, 52 + f * 1.0));
  assert.equal(analyseFrames(frames([a, outOfStep]), ['a', 'b'], { rate }).drifts.length, 1);
  assert.equal(analyseFrames(frames([a, inStep]), ['a', 'b'], { rate }).drifts.length, 0);
});

test('analyse: an open surface growing around its center drifts; pinned by top or bottom it does not', () => {
  const n = 12;
  const centered = Array.from({ length: n }, (_, f) => [0, 0, 300 - f * 5, 400, 200 + f * 10, -1, -1, 200 + f * 10]);
  const pinnedTop = Array.from({ length: n }, (_, f) => [0, 0, 100, 400, 200 + f * 10, -1, -1, 200 + f * 10]);
  const pinnedBottom = Array.from({ length: n }, (_, f) => [0, 0, 500 - f * 10, 400, 200 + f * 10, -1, -1, 200 + f * 10]);
  // A scale entrance changes the drawn box but not the layout height: not a height change.
  const scaling = Array.from({ length: n }, (_, f) => [0, 0, 300 - f * 5, 400, 200 + f * 10, -1, -1, 320]);
  assert.equal(analyseFrames(frames([centered]), ['[role=dialog]']).anchors.length, 1);
  for (const track of [pinnedTop, pinnedBottom, scaling]) assert.equal(analyseFrames(frames([track]), ['[role=dialog]']).anchors.length, 0);
});

test('coverage: sparse, short or empty recordings are inconclusive; a single late frame is not', () => {
  const ok = frames([Array.from({ length: 60 }, () => box(0, 0))]);
  ok[30].t += 40;
  ok.slice(31).forEach((f) => { f.t += 40; });
  assert.equal(motionCoverage(ok, { requestedMs: 900 }).status, 'complete');
  assert.match(motionCoverage(ok.slice(0, 3)).reasons.join(), /só 3 quadros/);
  assert.match(motionCoverage(frames([Array.from({ length: 20 }, () => box(0, 0))], 50)).reasons.join(), /esparso/);
  assert.match(motionCoverage(ok, { requestedMs: 5000 }).reasons.join(), /dos 5000ms pedidos/);
  assert.match(motionCoverage(ok, { errors: ['gatilho falhou: x'] }).reasons.join(), /gatilho falhou/);
});

test('summary: candidate lines carry the rule, a Portuguese label and the candidate mark', () => {
  const raw = { frames: frames([[0, 0, 0, 0, 48, 48, 48, 48].map((y) => box(0, y))]), names: ['li'], triggerAt: 0,
    pops: [{ kind: 'out', element: 'div#painel', t: 50 }], settles: [{ element: 'div.aviso', px: 1.5, t: 100 }], errors: [] };
  const { candidates, evidence } = summarizeMotion(raw, { rate: 0.25, requestedMs: 25 });
  assert.deepEqual(candidates.map((c) => c.split(':')[0]), ['motion-jump', 'motion-pop', 'motion-settle']);
  assert.ok(candidates.every((c) => c.endsWith('(candidato)')));
  assert.match(candidates[1], /somem sem animação/);
  assert.equal(evidence.frames, 8);
  const empty = summarizeMotion({ frames: [], names: [], errors: ['--motion-root #x não encontrado'] }, { requestedMs: 400 });
  assert.deepEqual(empty.candidates.map((c) => c.split(':')[0]), ['motion-coverage']);
  assert.match(empty.candidates[0], /inconclusiva, não é defeito/);
});

function inspect(urls, extra = [], allowFail = false) {
  const out = mkdtempSync(join(tmpdir(), 'inspect-motion-'));
  try {
    execFileSync(process.execPath, [join(here, 'inspect-ui.mjs'), ...urls, '--out', out, '--widths', '1440', '--tabs', '0', '--wait', '0', ...extra], { stdio: 'pipe' });
  } catch (e) {
    if (e.status === 3) return null;
    if (!allowFail) throw e;
    return { status: e.status, stderr: String(e.stderr) };
  }
  return JSON.parse(readFileSync(join(out, 'report.json'), 'utf8')).runs;
}

test('flags: motion options are validated before any browser starts', () => {
  for (const extra of [['--motion-trigger', '#x'], ['--motion-root', 'main'], ['--motion', '50'], ['--motion', 'abc']]) {
    const r = inspect([url('motion-rotulo-ruim')], extra, true);
    assert.equal(r?.status, 2, `${extra.join(' ')} should be a usage error`);
  }
});

// Pair name -> expected candidate; the interruption pair needs two clicks, so its trigger comes from a mock.
const PAIRS = { rotulo: 'motion-jump', saida: 'motion-pop', insercao: 'motion-jump', ancora: 'motion-anchor', assentar: 'motion-settle', deriva: 'motion-drift' };
let pairRuns;
const pairs = () => pairRuns === undefined
  ? (pairRuns = inspect(Object.keys(PAIRS).flatMap((p) => [url(`motion-${p}-ruim`), url(`motion-${p}-bom`)]), ['--motion', '400', '--motion-trigger', '#acionar']))
  : pairRuns;

for (const [i, [pair, rule]] of Object.entries(PAIRS).entries()) {
  test(`${pair}: the bad fixture fires only ${rule}`, (t) => {
    const runs = pairs();
    if (!runs) return t.skip('Playwright not available');
    const bad = runs[i * 2];
    assert.ok(!bad.error, bad.error);
    assert.deepEqual(bad.candidates.map((c) => c.split(':')[0]), [rule], JSON.stringify(bad.candidates));
    assert.ok(bad.candidate_evidence.motion.findings.some((f) => f.rule === rule));
    assert.ok(bad.metrics.motion_frames >= 30, `only ${bad.metrics.motion_frames} frames`);
  });
  test(`${pair}: the good fixture is quiet for every candidate`, (t) => {
    const runs = pairs();
    if (!runs) return t.skip('Playwright not available');
    const good = runs[i * 2 + 1];
    assert.ok(!good.error, good.error);
    assert.deepEqual(good.candidates, [], JSON.stringify(good.candidates));
    assert.equal(good.candidate_evidence.motion.coverage.status, 'complete');
  });
}

test('interrupcao: restarting from zero jumps, retargeting from the current position is quiet (mock trigger)', (t) => {
  const runs = inspect([url('motion-interrupcao-ruim'), url('motion-interrupcao-bom')], ['--motion', '400', '--mock', join(here, 'fixtures', 'motion-mock.mjs')]);
  if (!runs) return t.skip('Playwright not available');
  assert.deepEqual(runs[0].candidates.map((c) => c.split(':')[0]), ['motion-jump'], JSON.stringify(runs[0].candidates));
  assert.equal(runs[0].candidate_evidence.motion.trigger, 'function');
  assert.deepEqual(runs[1].candidates, [], JSON.stringify(runs[1].candidates));
});

test('motion candidates stay out of findings and the exit code; pops are not judged under reduced motion', (t) => {
  const runs = pairs();
  if (!runs) return t.skip('Playwright not available');
  for (const run of runs) assert.ok(!run.findings.some((f) => f.startsWith('motion-jump') || f.startsWith('motion-pop') || f.startsWith('motion-anchor')), JSON.stringify(run.findings));
  const strict = inspect([url('motion-saida-ruim')], ['--motion', '400', '--motion-trigger', '#acionar', '--fail-on-findings', '--reduced-motion', 'no-preference,reduce']);
  assert.equal(strict.length, 2);
  const [normal, reduce] = strict;
  assert.ok(normal.candidates.some((c) => c.startsWith('motion-pop')) && normal.findings.length === 0, JSON.stringify(normal));
  assert.equal(reduce.candidate_evidence.motion.pops_checked, false);
  assert.ok(!reduce.candidates.some((c) => c.startsWith('motion-pop')), JSON.stringify(reduce.candidates));
});

test('without --motion nothing is recorded: no motion_frames, no motion evidence', (t) => {
  const runs = inspect([url('motion-saida-ruim')]);
  if (!runs) return t.skip('Playwright not available');
  assert.equal(runs[0].metrics.motion_frames, undefined);
  assert.equal(runs[0].candidate_evidence.motion, undefined);
  assert.ok(!runs[0].candidates.some((c) => c.startsWith('motion-')));
});

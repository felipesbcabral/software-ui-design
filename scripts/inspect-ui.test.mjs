// Run: node --test scripts/inspect-ui.test.mjs  (needs Playwright; set PLAYWRIGHT_HOME if not in cwd)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync, writeFileSync, existsSync } from 'node:fs';
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

function inspect(urls, extra = []) {
  const out = mkdtempSync(join(tmpdir(), 'inspect-modern-'));
  execFileSync(process.execPath, [join(here, 'inspect-ui.mjs'), ...urls, '--out', out, '--widths', '1440,390', '--tabs', '0', '--wait', '40', ...extra], {stdio:'pipe'});
  return {out, ...JSON.parse(readFileSync(join(out,'report.json'),'utf8'))};
}
const modern = pathToFileURL(join(here,'fixtures','inspect-modern.html')).href;
let seededReport;
const seeded=()=>seededReport??=inspect([modern,modern+'#blank'],['--rules',join(here,'fixtures','ui-rules.json')]);
test('blank: empty application is a finding',()=>assert.ok(seeded().runs[2].findings.some(f=>f.startsWith('blank:'))));
test('truncated: mobile ellipsis exceeding client width is a finding',()=>assert.ok(seeded().runs[1].findings.some(f=>f.startsWith('truncated:'))));
test('cta-wrap: desktop action with multiple text lines is a finding',()=>assert.ok(seeded().runs[0].findings.some(f=>f.startsWith('cta-wrap:'))));
test('rules: wrong font role, minimum size, radius and color are findings',()=>{
  const desktop=seeded().runs[0];
  assert.ok(desktop.findings.some(f=>f.startsWith('rules:')&&f.includes('fontFamily')));
  for(const rule of ['minFontSize','radii','colors'])assert.ok(desktop.metrics.rule_violations.some(v=>v.property===rule));
});
test('imports auth and mocks before navigation, captures every theme/state/width and compares', () => {
  const auth=join(mkdtempSync(join(tmpdir(),'inspect-auth-')),'state.json');
  writeFileSync(auth,JSON.stringify({cookies:[{name:'fixture-session',value:'fixture-only',domain:'fixture.test',path:'/',expires:-1,httpOnly:true,secure:false,sameSite:'Lax'}],origins:[]}));
  const options=['--storage-state',auth,'--mock',join(here,'fixtures','inspect-mock.mjs'),'--color-scheme','light,dark','--states','default,loading,empty,error,long'];
  const before=inspect(['http://fixture.test/console/profissional'],options);
  assert.equal(before.runs.length,20);
  assert.ok(before.runs.every(r=>r.state_verified===true&&existsSync(r.screenshot)));
  assert.equal(new Set(before.runs.map(r=>r.screenshot)).size,20);
  assert.ok(before.runs.some(r=>r.color_scheme==='dark'&&r.findings.some(f=>f.startsWith('contrast:'))));
  assert.ok(before.runs.filter(r=>['loading','empty','error'].includes(r.state)).every(r=>!r.findings.some(f=>f.startsWith('first-row:'))));
  const after=inspect(['http://fixture.test/console/profissional'],['--widths','390',...options,'--compare',before.out]);
  assert.ok(after.runs.every(r=>r.comparison&&existsSync(r.comparison)));
  assert.ok(existsSync(join(after.out,'index.html')));
});
let motionReport;
const motion=()=>motionReport??=inspect([modern,modern+'#other',modern+'#type-scale',modern+'#runtime'],['--widths','1440','--reduced-motion','reduce']);
test('route-duplicate: matching main content across URLs is reported',()=>assert.ok(motion().runs[1].findings.some(f=>f.startsWith('route-duplicate:'))));
test('motion-reduced: running animation under reduce is reported',()=>assert.ok(motion().runs[0].findings.some(f=>f.startsWith('motion-reduced:'))));
test('motion-duration: transitions longer than the budget are reported',()=>assert.ok(motion().runs[0].findings.some(f=>f.startsWith('motion-duration:'))));
test('motion-layout: geometry animation and transition are reported',()=>assert.ok(motion().runs[0].findings.some(f=>f.startsWith('motion-layout:'))));
test('consistency: fourteen font sizes exceed the default limit',()=>assert.ok(motion().runs[2].findings.some(f=>f.startsWith('consistency:')&&f.includes('font_sizes'))));
test('runtime: JavaScript mount errors are reported',()=>assert.ok(motion().runs[3].findings.some(f=>f.startsWith('runtime:'))));
test('failed combination remains in report, missing expected state is a finding, strict gate exits nonzero', () => {
  const out=mkdtempSync(join(tmpdir(),'inspect-exit-'));
  const command=[join(here,'inspect-ui.mjs'),modern,'http://127.0.0.1:1/unreachable','--widths','390','--wait','0','--tabs','0','--out',out];
  assert.throws(()=>execFileSync(process.execPath,command,{stdio:'pipe'}),e=>e.status===4);
  const report=JSON.parse(readFileSync(join(out,'report.json'),'utf8'));
  assert.equal(report.runs.length,2);
  assert.ok(report.runs[1].error);
  assert.throws(()=>inspect([modern],['--fail-on-findings']),e=>e.status===1);
  const missing=inspect([modern],['--expect','#absent','--timeout','100','--widths','390']);
  assert.equal(missing.runs[0].state_verified,false);
  assert.ok(missing.runs[0].findings.some(f=>f.startsWith('state:')));
});
test('unknown options, invalid widths and unimplemented states fail instead of passing', () => {
  for(const options of [['--widths','no'],['--states','loading'],['--nonsense'],['--out',tmpdir(),'--compare',tmpdir()]]) {
    assert.throws(()=>inspect([modern],options), e=>e.status===2);
  }
  const auth=join(mkdtempSync(join(tmpdir(),'inspect-invalid-auth-')),'state.json');
  writeFileSync(auth,'{"private-token":"sensitive-session-value", invalid}');
  assert.throws(()=>inspect([modern],['--storage-state',auth]),error=>{
    assert.equal(error.status,2);
    assert.doesNotMatch(error.stderr.toString(),/sensitive-session-value|private-token/);
    return true;
  });
});

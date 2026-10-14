import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { MANDATORY_SKILLS, checkSkills, ledgerStatus } from './check-skills.mjs';

const script = fileURLToPath(new URL('./check-skills.mjs', import.meta.url));
const reference = fileURLToPath(new URL('../references/research-and-skills.md', import.meta.url));
const EXPECTED = ['fixing-accessibility', 'react-best-practices', 'designmdme-cli', '21st-ui-explore', '21st-registry', '21st-cli-use',
  '21st-ui-build', '21st-ui-review', 'apple-design', 'fixing-motion-performance', 'fixing-metadata', 'create-design-md', 'gsap-performance',
  'brandkit', 'image-to-code', 'gsd-sketch', 'art-direction', 'gsap-core', 'gsap-react', 'gsap-frameworks', 'gsap-timeline', 'gsap-plugins',
  'gsap-utils', 'improve-ui', 'improve-animations', 'animation-vocabulary', 'composition-patterns', 'react-view-transitions',
  'loop-state-and-stall-guard', 'rtk-token-saver'];
const full = EXPECTED.map((s) => `- ${s} — acionada em 2 — SKILL.md lido; decisão registrada`).join('\n');

test('as 30 especialistas são obrigatórias e a referência lista as mesmas', () => {
  assert.deepEqual([...MANDATORY_SKILLS].sort(), [...EXPECTED].sort());
  const text = readFileSync(reference, 'utf8');
  const section = text.split('## Trinta especialistas obrigatórias em toda invocação')[1]?.split('\n## ')[0];
  assert.ok(section, 'seção das obrigatórias ausente em research-and-skills.md');
  for (const s of EXPECTED) assert.match(section, new RegExp('`' + s + '`'), `${s} fora da tabela`);
});

test('registro completo passa; falta, "avaliada" e linha sem estado reprovam; SKILL AUSENTE vale', () => {
  assert.deepEqual(checkSkills(full).errors, []);
  assert.match(checkSkills(full.replace(/- gsap-react[^\n]*\n/, '')).errors.join('\n'), /gsap-react obrigatória/);
  const waived = full.replace(/- fixing-metadata[^\n]*/, '- fixing-metadata — avaliada, não acionada — tela interna sem metadados');
  assert.match(checkSkills(waived).errors.join('\n'), /fixing-metadata obrigatória.*avaliada/);
  const absent = full.replace(/- gsd-sketch[^\n]*/, '- gsd-sketch — SKILL AUSENTE — fallback esboço no acervo');
  assert.deepEqual(checkSkills(absent).errors, []);
  assert.equal(ledgerStatus('| `21st-ui-build` | acionada | etapa 4 |', '21st-ui-build').status, 'acionada');
  assert.equal(ledgerStatus('- gsap-core-extra — acionada', 'gsap-core'), null);
});

test('CLI acha o registro do projeto, sai 1 com falta e 2 sem registro', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sud-skills-'));
  let r = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 2, r.stdout + r.stderr);
  mkdirSync(join(dir, '.software-ui-design'));
  writeFileSync(join(dir, '.software-ui-design', 'skills.md'), full.replace(/- rtk-token-saver[^\n]*/, ''), 'utf8');
  r = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /rtk-token-saver/);
  writeFileSync(join(dir, '.software-ui-design', 'skills.md'), full, 'utf8');
  r = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /30\/30/);
});

test('CLI roda quando chamado por link (~/.claude/skills aponta para o repo)', () => {
  // Node resolves the link in import.meta.url but not in argv[1]; a naive comparison made the CLI exit 0 silently.
  const base = mkdtempSync(join(tmpdir(), 'sud-link-'));
  const link = join(base, 'scripts-link');
  symlinkSync(dirname(script), link, 'junction');
  const empty = mkdtempSync(join(tmpdir(), 'sud-empty-'));
  const r = spawnSync(process.execPath, [join(link, 'check-skills.mjs')], { cwd: empty, encoding: 'utf8' });
  assert.equal(r.status, 2, `saída: ${r.stdout}${r.stderr}`);
  assert.match(r.stdout, /registro de especialistas ausente/);
});

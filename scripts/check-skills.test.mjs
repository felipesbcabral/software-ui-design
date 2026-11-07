import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { MANDATORY_SKILLS, EVERY_TIER, checkSkills, ledgerStatus } from './check-skills.mjs';

const script = fileURLToPath(new URL('./check-skills.mjs', import.meta.url));
const reference = fileURLToPath(new URL('../references/research-and-skills.md', import.meta.url));
const EXPECTED = ['fixing-accessibility', 'react-best-practices', 'designmdme-cli', '21st-ui-explore', '21st-registry', '21st-cli-use',
  '21st-ui-build', '21st-ui-review', 'apple-design', 'fixing-motion-performance', 'fixing-metadata', 'create-design-md', 'gsap-performance',
  'brandkit', 'image-to-code', 'gsd-sketch', 'art-direction', 'gsap-core', 'gsap-react', 'gsap-frameworks', 'gsap-timeline', 'gsap-plugins',
  'gsap-utils', 'improve-ui', 'improve-animations', 'animation-vocabulary', 'composition-patterns', 'react-view-transitions',
  'loop-state-and-stall-guard', 'rtk-token-saver', 'stageshow'];
const full = EXPECTED.map((s) => `- ${s} — acionada em 2 — SKILL.md lido; decisão registrada`).join('\n');

test('as 31 especialistas roteadas e a referência listam as mesmas', () => {
  assert.deepEqual([...MANDATORY_SKILLS].sort(), [...EXPECTED].sort());
  const text = readFileSync(reference, 'utf8');
  const section = text.split('## Especialistas por gatilho (2.7.0)')[1]?.split('\n## ')[0];
  assert.ok(section, 'seção das roteadas por gatilho ausente em research-and-skills.md');
  for (const s of EXPECTED) assert.match(section, new RegExp('`' + s + '`'), `${s} fora da tabela`);
});

test('registro completo passa; falta, "avaliada" e linha sem estado reprovam; SKILL AUSENTE vale', () => {
  assert.deepEqual(checkSkills(full).errors, []);
  assert.match(checkSkills(full.replace(/- gsap-react[^\n]*\n/, '')).errors.join('\n'), /gsap-react sem registro válido/);
  const waived = full.replace(/- fixing-metadata[^\n]*/, '- fixing-metadata — avaliada, não acionada — tela interna sem metadados');
  assert.match(checkSkills(waived).errors.join('\n'), /fixing-metadata sem registro válido.*avaliada/);
  const absent = full.replace(/- gsd-sketch[^\n]*/, '- gsd-sketch — SKILL AUSENTE — fallback esboço no acervo');
  assert.deepEqual(checkSkills(absent).errors, []);
  assert.equal(ledgerStatus('| `21st-ui-build` | acionada | etapa 4 |', '21st-ui-build').status, 'acionada');
  assert.equal(ledgerStatus('- gsap-core-extra — acionada', 'gsap-core'), null);
});

test('2.6.0: "cartão lido" vale para as 30; a leitura completa continua aceita', () => {
  const cards = EXPECTED.map((s) => `- ${s} — cartão lido em 1 — nada a aplicar nesta tela`).join('\n');
  assert.deepEqual(checkSkills(cards).errors, []);
  assert.equal(ledgerStatus('- gsap-core — cartão lido em 1 — sem GSAP', 'gsap-core').status, 'cartao');
  assert.equal(ledgerStatus('- gsap-core — acionada em 4 — SKILL.md completo', 'gsap-core').status, 'acionada');
});

test('2.7.0: "sem gatilho" com motivo vale no deep; quick e standard cobram só fixing-accessibility', () => {
  assert.deepEqual(EVERY_TIER, ['fixing-accessibility']);
  const noTrigger = EXPECTED.map((s) => s === 'fixing-accessibility'
    ? `- ${s} — acionada em 6 — rótulos e foco corrigidos`
    : `- ${s} — sem gatilho — tela em HTML puro, sem esse recurso`).join('\n');
  assert.deepEqual(checkSkills(noTrigger).errors, []);
  assert.equal(ledgerStatus('- gsap-core — sem gatilho — projeto sem GSAP algum', 'gsap-core').status, 'sem-gatilho');
  const short = noTrigger.replace(/- gsap-core[^\n]*/, '- gsap-core — sem gatilho — sem GSAP');
  assert.match(checkSkills(short).errors.join('\n'), /gsap-core sem registro válido.*menos de 15/);
  const a11y = noTrigger.replace(/- fixing-accessibility[^\n]*/, '- fixing-accessibility — sem gatilho — tela sem formulário algum');
  assert.match(checkSkills(a11y).errors.join('\n'), /fixing-accessibility.*todo tier/);
  const onlyA11y = '- fixing-accessibility — acionada em 6 — nome no botão de fechar';
  assert.deepEqual(checkSkills(onlyA11y, { tier: 'quick' }).errors, []);
  assert.deepEqual(checkSkills(onlyA11y, { tier: 'standard' }).errors, []);
  assert.equal(checkSkills(onlyA11y, { tier: 'deep' }).errors.length, 30);
  assert.equal(checkSkills('', { tier: 'quick' }).errors.length, 1);
  assert.throws(() => checkSkills(onlyA11y, { tier: 'enorme' }), /tier inválido/);
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
  assert.match(r.stdout, /31\/31/);
  writeFileSync(join(dir, '.software-ui-design', 'skills.md'), '- fixing-accessibility — acionada em 6 — foco revisado', 'utf8');
  r = spawnSync(process.execPath, [script, '--tier', 'quick'], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /1\/1 .*tier quick/);
  r = spawnSync(process.execPath, [script, '--tier', 'xx'], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 2);
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

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, writeFileSync, rmSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadCatalog, searchResources } from './find-resources.mjs';

test('catálogo conserva 114 fontes herdadas e encontra datas/formulários em português', () => {
  const catalog = loadCatalog();
  assert.equal(catalog.filter((r) => r.id.startsWith('C')).length, 114);
  assert.equal(new Set(catalog.map((r) => r.id)).size, catalog.length);
  for (const r of catalog) assert.ok((r.id.startsWith('R') ? ['https:', 'http:'] : ['https:']).includes(new URL(r.demo_url).protocol));
  assert.ok(searchResources('CALENDÁRIO', { limit: 50 }).some((r) => r.id === 'S001'));
  assert.ok(searchResources('formulário', { limit: 50 }).some((r) => r.id === 'C082'));
  assert.ok(searchResources('menu lateral', { limit: 50 }).length > 0);
});

test('escopo padrão prioriza software e modo completo preserva fontes condicionais', () => {
  assert.equal(searchResources('C039').length, 0);
  assert.equal(searchResources('C039', { all: true })[0].id, 'C039');
  assert.equal(searchResources('', { all: true, limit: 250 }).length, Math.min(250, loadCatalog().length));
  assert.equal(loadCatalog().filter((r) => r.id.startsWith('R')).length, 382);
  const registry = loadCatalog().find((r) => r.id.startsWith('R') && /kanban/i.test(JSON.stringify(r)));
  assert.ok(registry);
  assert.equal(searchResources(registry.id).length, 0);
  assert.equal(searchResources(registry.id, { all: true })[0].id, registry.id);
  assert.ok(searchResources('kanban').some((r) => r.id.startsWith('S')));
  assert.equal(searchResources('', { limit: 2 }).length, 2);
  assert.deepEqual(searchResources('naoexiste-987xyz'), []);
});

test('Cult UI entra por componente: software na busca padrão, marketing só com --all', () => {
  const cult = loadCatalog().filter((r) => r.id.startsWith('U'));
  assert.equal(cult.length, 137);
  assert.equal(new Set(cult.map((r) => r.slug)).size, 137);
  assert.ok(cult.every((r) => r.install === `npx shadcn@latest add https://cult-ui.com/r/${r.slug}.json` && r.license === 'MIT'));
  assert.ok(!cult.some((r) => r.slug.startsWith('animated-')), 'aliases obsoletos ficam fora');
  const island = searchResources('dynamic island')[0];
  assert.equal(island.install, 'npx shadcn@latest add https://cult-ui.com/r/dynamic-island.json');
  assert.ok(searchResources('ilha dinâmica').some((r) => r.id === island.id));
  assert.ok(searchResources('kanban').some((r) => r.name.includes('kanban-board')));
  const hero = cult.find((r) => r.slug === 'hero-liquid-metal');
  assert.equal(hero.encaixe, 'marketing e vitrine');
  assert.equal(searchResources(hero.id).length, 0);
  assert.equal(searchResources(hero.id, { all: true })[0].id, hero.id);
});

test('CLI funciona a partir de outro diretório e rejeita argumentos inválidos', () => {
  const script = fileURLToPath(new URL('./find-resources.mjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', cwd: fileURLToPath(new URL('../references/', import.meta.url)) });
  const valid = run('--json', 'calendário');
  assert.equal(valid.status, 0, valid.stderr);
  assert.ok(JSON.parse(valid.stdout).some((r) => r.id === 'S001'));
  for (const args of [['--limit'], ['--limit', '0'], ['--limit', '-1'], ['--limit', '2.5'], ['--limit', '251'], ['--inventado']]) {
    const result = run(...args);
    assert.equal(result.status, 2, JSON.stringify(args));
    assert.ok(result.stderr.trim());
  }
});

test('busca salva consulta dados locais, encontra menu lateral e preserva caminhos', () => {
  const directory = mkdtempSync(join(tmpdir(), 'software-ui-catalog-'));
  try {
    writeFileSync(join(directory, 'catalogo.json'), JSON.stringify({ items: [{ id: '04-menus-laterais-01', category: '04-menus-laterais', name: 'Nav de teste', provider: 'Microsoft', demo: 'https://example.com/demo', repo: 'example/ui', commit: 'abc', style: 'Navegação agrupada', stack: 'React', use: 'Software' }] }));
    const results = searchResources('menu lateral', { saved: true, libraryPath: directory });
    assert.equal(results.length, 1);
    assert.ok(results[0].local_bundle.startsWith(directory));
    assert.equal(searchResources('Microsoft', { saved: true, libraryPath: directory })[0].id, results[0].id);
    writeFileSync(join(directory, 'catalogo.json'), '{}');
    assert.throws(() => loadCatalog({ saved: true, libraryPath: directory }), /items ausente/);
  } finally {
    // Apenas o arquivo temporário criado neste teste, sem remoção recursiva.
    rmSync(join(directory, 'catalogo.json'));
    rmdirSync(directory);
  }
});

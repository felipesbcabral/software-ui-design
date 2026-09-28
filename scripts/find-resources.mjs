#!/usr/bin/env node
// Busca local de fontes. Não acessa a rede nem instala componentes.
import { readFileSync, realpathSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

const CORE = new Set('C024 C025 C026 C054 C055 C057 C058 C059 C060 C061 C064 C065 C066 C068 C069 C070 C071 C072 C073 C074 C075 C077 C082 C084 C085 C086 C088 C089 C090 C092 C102 C104 C106 C107 C108 C109 C110 C114'.split(' '));
const TOPICS = [
  ['forms form formulario input busca search button botao', 'C082 C092 C102 C106 C107 C108 C109 C110'],
  ['sidebar menu lateral navigation navegacao shell', 'C059 C061 C066 C070 C073 C082 C084 C088 C102'],
  ['table tabela data dados dashboard chart grafico', 'C072 C082 C088 C102 C114'],
];
const normalize = (value) => String(value).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

// Library lookup order: explicit path, SOFTWARE_UI_LIBRARY, ./biblioteca-ui-software in the project,
// the sibling folder of this skill (standalone install), then the configured fallback.
export function resolveLibrary(libraryPath) {
  const skillRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
  const candidates = [
    libraryPath,
    process.env.SOFTWARE_UI_LIBRARY,
    resolve('biblioteca-ui-software'),
    resolve(realpathSync(skillRoot), '..', 'biblioteca-ui-software'),
    JSON.parse(readFileSync(new URL('../references/library-location.json', import.meta.url), 'utf8')).path,
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(join(p, 'catalogo.json')));
  if (!found) throw new Error(`Acervo não encontrado. Tentativas: ${candidates.join(' | ')}. Defina SOFTWARE_UI_LIBRARY.`);
  return found;
}

// Verdict order used to rank saved components: reviewed defaults first, discarded last.
const VERDICT_RANK = [
  [/^recomendado/i, 0], [/^adaptar/i, 1], [/^refer/i, 2], [/^n[aã]o recomendado/i, 3], [/^descartar/i, 4],
];
const verdictRank = (v) => (v ? (VERDICT_RANK.find(([re]) => re.test(v)) || [null, 2])[1] : 2.5);

function loadReviews(root) {
  const file = join(root, 'revisao-profunda', 'componentes-revisados.json');
  if (!existsSync(file)) return new Map();
  return new Map(JSON.parse(readFileSync(file, 'utf8')).map((r) => [r.id, r]));
}

export function loadCatalog({ saved = false, libraryPath } = {}) {
  if (saved) {
    const root = libraryPath || resolveLibrary();
    const data = JSON.parse(readFileSync(join(root, 'catalogo.json'), 'utf8'));
    if (!Array.isArray(data.items)) throw new Error('Acervo inválido: items ausente');
    const reviews = loadReviews(root);
    return data.items.map((r) => ({
      review: reviews.has(r.id) ? {
        verdict: reviews.get(r.id).verdict, fit: reviews.get(r.id).fit, quality: reviews.get(r.id).quality,
        visual: (reviews.get(r.id).visual || []).map((v) => join(root, 'revisao-profunda', v)),
      } : null,
      id: r.id, name: r.name, provider: r.provider, demo_url: r.demo,
      source_url: r.source_url || `https://github.com/${r.repo}/tree/${r.commit}`,
      category: r.category, style: r.style, use: r.use, stack: r.stack,
      tags: r.category.includes('menus-laterais') ? 'menu lateral sidebar' : r.category.includes('menus-superiores') ? 'menu superior header' : '',
      local_readme: join(root, r.local_readme || `${r.category}/${r.id}/README.md`),
      local_bundle: join(root, r.source_bundle || `${r.category}/${r.id}/componente.zip`),
      status: 'Código arquivado; inspecionar compatibilidade, licença e comportamento antes de integrar.',
    }));
  }
  return ['resources.json', 'software-resources.json', 'registry-resources.json'].flatMap((name) => {
    const data = JSON.parse(readFileSync(new URL(`../references/${name}`, import.meta.url), 'utf8'));
    if (!Array.isArray(data.resources)) throw new Error(`Catálogo inválido: ${name}`);
    return data.resources;
  });
}

export function searchResources(query = '', { all = false, limit = 8, saved = false, libraryPath, recommended = false } = {}) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 250) throw new Error('limit deve ser inteiro entre 1 e 250');
  const terms = normalize(query).trim().split(/\s+/u).filter(Boolean);
  return loadCatalog({ saved, libraryPath }).filter((r) => saved || all || CORE.has(r.id) || r.id.startsWith('S'))
    .filter((r) => !recommended || (r.review && verdictRank(r.review.verdict) === 0))
    .map((r) => {
      const tags = TOPICS.filter(([, ids]) => ids.split(' ').includes(r.id)).map(([words]) => words).join(' ');
      const title = normalize(`${r.id} ${r.name} ${r.provider}`);
      const content = normalize(`${JSON.stringify(r)} ${tags}`);
      const matches = terms.every((term) => content.includes(term));
      const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 2 : content.includes(term) ? 1 : 0), 0);
      return { r, matches, score };
    })
    .filter(({ matches }) => matches)
    .sort((a, b) => (saved ? verdictRank(a.r.review?.verdict) - verdictRank(b.r.review?.verdict) : 0) || b.score - a.score || a.r.id.localeCompare(b.r.id))
    .slice(0, limit)
    .map(({ r }) => ({ id: r.id, name: r.name, url: r.demo_url, source: r.source_url || r.code_access?.repo || null, status: r.status, ...(saved ? { local_readme: r.local_readme, local_bundle: r.local_bundle, review: r.review } : {}) }));
}

export function main(args = process.argv.slice(2)) {
  let all = false, json = false, saved = false, recommended = false, limit = 8;
  const query = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--all') all = true;
    else if (arg === '--saved') saved = true;
    else if (arg === '--recommended') { saved = true; recommended = true; }
    else if (arg === '--json') json = true;
    else if (arg === '--limit') {
      const value = args[++i];
      if (!value || !/^\d+$/.test(value)) throw new Error('--limit exige inteiro entre 1 e 250');
      limit = Number(value);
    } else if (arg === '--help') {
      console.log('Uso: node find-resources.mjs [--saved|--recommended] [--all] [--json] [--limit 1..250] [termos]\n--saved busca código arquivado, ordenado pelo veredito da revisão. --recommended mostra só os padrões recomendados.\nInspecione os arquivos; pesquise online quando houver lacuna.');
      return;
    } else if (arg.startsWith('--')) throw new Error(`Opção desconhecida: ${arg}`);
    else query.push(arg);
  }
  const results = searchResources(query.join(' '), { all, limit, saved, recommended });
  if (json) console.log(JSON.stringify(results, null, 2));
  else {
    console.log(saved ? 'Acervo local (ordem: recomendado > adaptar > referência). Abra a ficha, a captura e o código antes de integrar.' : 'Índice de fontes externas. Consulte também --saved para componentes já arquivados.');
    for (const r of results) {
      const rv = r.review ? `\nRevisão: ${r.review.verdict}${r.review.fit ? ` · ${r.review.fit}` : ''}${r.review.visual?.length ? `\nCaptura: ${r.review.visual[0]}` : ''}` : (saved ? '\nRevisão: sem revisão individual' : '');
      console.log(`${r.id} | ${r.name}\n${r.url}${r.source ? `\nCódigo: ${r.source}` : ''}${r.local_readme ? `\nFicha local: ${r.local_readme}\nZIP: ${r.local_bundle}` : ''}${rv}`);
    }
    if (!results.length) console.log('Nenhuma fonte no índice para estes termos. Amplie a busca na internet.');
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 2; }
}

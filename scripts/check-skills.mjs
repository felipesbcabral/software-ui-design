#!/usr/bin/env node
/**
 * Specialist ledger gate (2.5.0).
 *
 * In 73 days of transcripts, none of the specialists this skill routed "when installed" or "when it helps" was
 * ever loaded. The owner made the 30 below mandatory in every invocation. Since 2.6.0 each one is read through
 * its card (web-design-craft/references/cartoes-especialistas.md) and the full SKILL.md when the card says so:
 *   nome — cartão lido em <etapa> — <por que não muda o código>
 *   nome — acionada em <etapa> — SKILL.md completo; <o que mudou>
 *   nome — SKILL AUSENTE — fallback <critério interno>
 * "avaliada, não acionada" is not valid for these skills.
 *
 * Usage: node check-skills.mjs [ledger.md]
 * Without an argument it looks for .software-ui-design/skills.md, then .frontend-quality/skills.md, in the cwd.
 * Exit 0 = complete, 1 = missing or invalid lines, 2 = no ledger found.
 */
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MANDATORY_SKILLS = [
  'fixing-accessibility', 'react-best-practices', 'designmdme-cli', '21st-ui-explore', '21st-registry', '21st-cli-use',
  '21st-ui-build', '21st-ui-review', 'apple-design', 'fixing-motion-performance', 'fixing-metadata', 'create-design-md',
  'gsap-performance', 'brandkit', 'image-to-code', 'gsd-sketch', 'art-direction', 'gsap-core', 'gsap-react',
  'gsap-frameworks', 'gsap-timeline', 'gsap-plugins', 'gsap-utils', 'improve-ui', 'improve-animations',
  'animation-vocabulary', 'composition-patterns', 'react-view-transitions', 'loop-state-and-stall-guard', 'rtk-token-saver',
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');

/** Status of one skill in the ledger: acionada, avaliada, ausente, null status (line without state) or null. */
export function ledgerStatus(text, skill) {
  const re = new RegExp(`(^|[\\s\`|(])${escapeRe(skill)}([\\s\`|:),]|$)`);
  const line = String(text).split(/\r?\n/).find((l) => re.test(l));
  if (!line) return null;
  if (/\bausente\b/i.test(line)) return { status: 'ausente', line };
  if (/n[ãa]o\s+acionada|\bavaliada\b/i.test(line)) return { status: 'avaliada', line };
  if (/\bacionada\b/i.test(line)) return { status: 'acionada', line };
  if (/\bcart[ãa]o\b/i.test(line)) return { status: 'cartao', line };
  return { status: null, line };
}

export function checkSkills(text) {
  const errors = [], ok = [];
  for (const s of MANDATORY_SKILLS) {
    const st = ledgerStatus(text, s);
    if (st?.status === 'acionada' || st?.status === 'ausente' || st?.status === 'cartao') ok.push(`${s} ${st.status}`);
    else errors.push(`${s} obrigatória em toda invocação: ${st ? `registrada como "${st.status || 'sem estado'}"` : 'sem linha'}; leia o cartão e registre "cartão lido", "acionada" com o SKILL.md completo, ou SKILL AUSENTE (references/research-and-skills.md)`);
  }
  return { errors, ok };
}

function main(argv) {
  const candidates = argv[0] ? [resolve(argv[0])] : ['.software-ui-design', '.frontend-quality'].map((d) => join(process.cwd(), d, 'skills.md'));
  const ledger = candidates.find(existsSync);
  if (!ledger) {
    console.log(`FAIL: registro de especialistas ausente (${candidates.join(' ou ')}); uma linha por skill, "nome — acionada em <etapa> — <decisão>" ou "SKILL AUSENTE"`);
    return 2;
  }
  const r = checkSkills(readFileSync(ledger, 'utf8'));
  for (const e of r.errors) console.log(`FALHA ${e}`);
  console.log(r.errors.length ? `FAIL: ${r.ok.length}/${MANDATORY_SKILLS.length} especialistas registradas em ${ledger}` : `PASS: ${r.ok.length}/${MANDATORY_SKILLS.length} especialistas registradas em ${ledger}`);
  return r.errors.length ? 1 : 0;
}

// Compare real paths: ~/.claude/skills/software-ui-design is a link, and Node resolves it in import.meta.url but
// not in argv[1]. A plain comparison skipped main() and exited 0 without checking anything.
const isMain = process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
if (isMain) process.exit(main(process.argv.slice(2)));

#!/usr/bin/env node
/**
 * Specialist ledger gate (2.7.0).
 *
 * In 73 days of transcripts, none of the specialists this skill routed "when installed" or "when it helps" was
 * ever loaded. 2.5.0 made the 30 below mandatory in every invocation and 2.6.0 pointed at a cards file that was
 * never created, so every call read the 30 full SKILL.md files (267 KB, about 67k tokens). Since 2.7.0 they are
 * read when their trigger is observable (table in references/research-and-skills.md):
 *   nome — acionada em <etapa> — <o que mudou>
 *   nome — sem gatilho — <o que falta para disparar>   (deep only; 15+ characters of reason)
 *   nome — SKILL AUSENTE — fallback <critério interno>
 * quick and standard require only EVERY_TIER (fixing-accessibility) plus whatever fired.
 * "avaliada, não acionada" is not valid. "cartão lido" (2.6.0) is still accepted for old ledgers.
 *
 * Usage: node check-skills.mjs [ledger.md] [--tier quick|standard|deep]   (default tier: deep)
 * Without a ledger path it looks for .software-ui-design/skills.md, then .frontend-quality/skills.md, in the cwd.
 * Exit 0 = complete, 1 = missing or invalid lines, 2 = no ledger found or bad tier.
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
export const EVERY_TIER = ['fixing-accessibility'];
export const TIERS = ['quick', 'standard', 'deep'];
const MIN_REASON = 15;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');

/** Status of one skill in the ledger: acionada, avaliada, ausente, sem-gatilho, cartao, null status or null. */
export function ledgerStatus(text, skill) {
  const re = new RegExp(`(^|[\\s\`|(])${escapeRe(skill)}([\\s\`|:),]|$)`);
  const line = String(text).split(/\r?\n/).find((l) => re.test(l));
  if (!line) return null;
  if (/\bausente\b/i.test(line)) return { status: 'ausente', line };
  const noTrigger = line.match(/\bsem\s+gatilho\b\s*[—:-]*\s*(.*)$/i);
  if (noTrigger) return { status: 'sem-gatilho', line, reason: noTrigger[1].replace(/[|`]/g, '').trim() };
  if (/n[ãa]o\s+acionada|\bavaliada\b/i.test(line)) return { status: 'avaliada', line };
  if (/\bacionada\b/i.test(line)) return { status: 'acionada', line };
  if (/\bcart[ãa]o\b/i.test(line)) return { status: 'cartao', line };
  return { status: null, line };
}

export function checkSkills(text, { tier = 'deep' } = {}) {
  if (!TIERS.includes(tier)) throw new Error(`tier inválido: ${tier} (use ${TIERS.join(', ')})`);
  const required = tier === 'deep' ? MANDATORY_SKILLS : EVERY_TIER;
  const errors = [], ok = [];
  for (const s of required) {
    const st = ledgerStatus(text, s);
    const valid = st && (st.status === 'acionada' || st.status === 'ausente' || st.status === 'cartao'
      || (st.status === 'sem-gatilho' && !EVERY_TIER.includes(s) && st.reason.length >= MIN_REASON));
    if (valid) { ok.push(`${s} ${st.status}`); continue; }
    let why = st ? `registrada como "${st.status || 'sem estado'}"` : 'sem linha';
    if (st?.status === 'sem-gatilho') why = EVERY_TIER.includes(s) ? 'vale em todo tier e não aceita "sem gatilho"' : `motivo com menos de ${MIN_REASON} caracteres`;
    errors.push(`${s} sem registro válido no tier ${tier}: ${why}; registre "acionada em <etapa> — <o que mudou>", "sem gatilho — <motivo>" ou SKILL AUSENTE (references/research-and-skills.md)`);
  }
  return { errors, ok, required: required.length };
}

function parseArgs(argv) {
  let tier = 'deep', path;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--tier') tier = argv[++i];
    else if (argv[i].startsWith('--tier=')) tier = argv[i].slice(7);
    else path = argv[i];
  }
  return { tier, path };
}

function main(argv) {
  const { tier, path } = parseArgs(argv);
  if (!TIERS.includes(tier)) {
    console.log(`FAIL: tier inválido "${tier}" (use ${TIERS.join(', ')})`);
    return 2;
  }
  const candidates = path ? [resolve(path)] : ['.software-ui-design', '.frontend-quality'].map((d) => join(process.cwd(), d, 'skills.md'));
  const ledger = candidates.find(existsSync);
  if (!ledger) {
    console.log(`FAIL: registro de especialistas ausente (${candidates.join(' ou ')}); uma linha por skill, "nome — acionada em <etapa> — <decisão>", "sem gatilho — <motivo>" ou "SKILL AUSENTE"`);
    return 2;
  }
  const r = checkSkills(readFileSync(ledger, 'utf8'), { tier });
  for (const e of r.errors) console.log(`FALHA ${e}`);
  const summary = `${r.ok.length}/${r.required} especialistas registradas (tier ${tier}) em ${ledger}`;
  console.log(r.errors.length ? `FAIL: ${summary}` : `PASS: ${summary}`);
  return r.errors.length ? 1 : 0;
}

// Compare real paths: ~/.claude/skills/software-ui-design is a link, and Node resolves it in import.meta.url but
// not in argv[1]. A plain comparison skipped main() and exited 0 without checking anything.
const isMain = process.argv[1] && realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url));
if (isMain) process.exit(main(process.argv.slice(2)));

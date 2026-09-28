#!/usr/bin/env node
// Deterministic UI inspection for software screens (feedback loop for the skill).
//
// Usage:
//   node scripts/inspect-ui.mjs <url> [--out <dir>] [--widths 1440,390] [--height 900]
//        [--tabs 25] [--wait 1500] [--data-screen] [--json]
//
// For each width it saves a screenshot and reports measurable issues:
//   overflow       horizontal page scroll (content wider than viewport)
//   width-usage    share of the viewport used by the main content region and the empty side gutters
//   first-row      vertical position of the first data row / list item (how much chrome sits above work)
//   targets        interactive elements smaller than 24x24 CSS px (WCAG 2.2 SC 2.5.8 minimum)
//   names          buttons/links without accessible name, inputs without label, images without alt
//   focus          first N Tab stops: whether each shows a visible focus indicator
//   tooltips       icon-only controls whose tooltip appears on hover but not on keyboard focus
//   contrast       sampled text below WCAG 1.4.3 (4.5:1 normal text, 3:1 large text)
// Findings are evidence to look at, not an automatic verdict: always view the screenshot too.
// Exit code: 0 = ran (findings may exist), 2 = usage error, 3 = Playwright missing, 4 = page failed.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--') && !isOptionValue(a));
function isOptionValue(a) {
  const i = args.indexOf(a);
  return i > 0 && ['--out', '--widths', '--height', '--tabs', '--wait'].includes(args[i - 1]);
}
function opt(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
if (!url) {
  console.error('usage: node inspect-ui.mjs <url> [--out dir] [--widths 1440,390] [--height 900] [--tabs 25] [--data-screen] [--json]');
  process.exit(2);
}

// WCAG 2.2 SC 2.5.8 Target Size (Minimum) is 24x24 CSS px.
const MIN_TARGET = 24;
// Below this share of a >=1280px viewport, a data screen is probably squeezed into a centered column.
// 0.7 leaves room for a 240-320px sidebar plus normal page margins (Atlassian side nav 240-320px,
// Carbon left panel 256px, Fluent Nav 260px) before flagging.
const DATA_SCREEN_MIN_SHARE = 0.7;
const outDir = resolve(opt('--out', 'ui-inspection'));
const widths = opt('--widths', '1440,390').split(',').map(Number).filter(Boolean);
const height = Number(opt('--height', '900'));
const tabs = Number(opt('--tabs', '25'));
const wait = Number(opt('--wait', '1500'));
const dataScreen = args.includes('--data-screen');

// Look for Playwright in: PLAYWRIGHT_HOME, the current folder and its parents, this skill's folder and
// its parents, and the global npm root. Agents often run from a scratch folder without node_modules,
// so searching upward and globally avoids a false "Playwright missing".
function candidateBases() {
  const bases = [];
  if (process.env.PLAYWRIGHT_HOME) bases.push(resolve(process.env.PLAYWRIGHT_HOME, 'package.json'));
  for (const start of [process.cwd(), dirname(fileURLToPath(import.meta.url))]) {
    let dir = resolve(start);
    for (let i = 0; i < 8; i++) {
      bases.push(join(dir, 'package.json'));
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 }).trim();
    if (globalRoot) bases.push(join(globalRoot, '..', 'package.json'), join(globalRoot, 'noop.js'));
  } catch { /* npm not available */ }
  return [...new Set(bases)];
}

function loadPlaywright() {
  const bases = candidateBases();
  for (const base of bases) {
    for (const mod of ['playwright', '@playwright/test', 'playwright-core']) {
      try {
        return createRequire(base)(mod);
      } catch { /* try next */ }
    }
  }
  return null;
}

const pw = loadPlaywright();
if (!pw || !pw.chromium) {
  console.error('Playwright not found (searched PLAYWRIGHT_HOME, this folder and parents, the skill folder, npm root -g).');
  console.error('Fix: set PLAYWRIGHT_HOME to a folder whose node_modules has playwright, or install it once in a temp folder:');
  console.error('  mkdir pw && cd pw && npm init -y && npm i playwright && npx playwright install chromium');
  console.error('  then run again with PLAYWRIGHT_HOME=<that folder>.');
  process.exit(3);
}

mkdirSync(outDir, { recursive: true });
const report = { url, generated_at: new Date().toISOString(), runs: [] };
const browser = await pw.chromium.launch();

try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height } });
    let status = null;
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      status = res ? res.status() : null;
    } catch (e) {
      report.runs.push({ width, error: e.message.split('\n')[0] });
      await page.close();
      continue;
    }
    await page.waitForTimeout(wait);
    const shot = join(outDir, `screen-${width}.jpg`);
    await page.screenshot({ path: shot, type: 'jpeg', quality: 75 });

    const metrics = await page.evaluate(({ MIN_TARGET }) => {
      const vw = window.innerWidth;
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0;
      };
      const label = (el) => (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || el.value || '').trim();
      const desc = (el) => {
        const id = el.id ? `#${el.id}` : '';
        const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
        return `${el.tagName.toLowerCase()}${id}${cls} "${label(el).slice(0, 40)}"`;
      };

      // Horizontal overflow.
      const overflow = document.documentElement.scrollWidth - vw;

      // Main content region: <main>, [role=main], else the widest block that is not nav/aside/header.
      let main = document.querySelector('main, [role="main"]');
      if (!main) {
        const blocks = [...document.body.querySelectorAll('div, section, article')].filter(visible)
          .filter((el) => !el.closest('nav, aside, header, footer'));
        blocks.sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height);
        main = blocks[0] || document.body;
      }
      // Measure the widest direct content child of main (catches max-width wrappers inside main).
      const mr = main.getBoundingClientRect();
      let content = main;
      const kids = [...main.children].filter(visible);
      if (kids.length) {
        const widest = kids.reduce((a, b) => (a.getBoundingClientRect().width >= b.getBoundingClientRect().width ? a : b));
        if (widest.getBoundingClientRect().width < mr.width - 1) content = widest;
      }
      const cr = content.getBoundingClientRect();
      // Class names like "group/sidebar-wrapper" also wrap the main area, so class matches only count
      // as navigation when the element is narrow.
      const NAV_SEL = 'nav, aside, [role="navigation"], [data-sidebar="sidebar"], [class*="sidebar" i], [class*="sidenav" i]';
      // Also treat a tall, narrow, fixed/sticky block glued to the left edge as a sidebar.
      const isRail = (el) => {
        const r = el.getBoundingClientRect(); const pos = getComputedStyle(el).position;
        return (pos === 'fixed' || pos === 'sticky') && r.left <= 1 && r.width < vw * 0.3 && r.height > window.innerHeight * 0.6;
      };
      const isNavEl = (el) => (el.matches(NAV_SEL) && el.getBoundingClientRect().width < vw * 0.4) || isRail(el);
      const inNav = (el) => { for (let n = el; n; n = n.parentElement) if (isNavEl(n)) return true; return false; };
      const nav = [...document.querySelectorAll(`${NAV_SEL}, body > *, body > * > *`)].filter(visible).filter(isNavEl)
        .filter((el) => !el.parentElement || !inNav(el.parentElement))
        .map((el) => el.getBoundingClientRect()).filter((r) => r.height > window.innerHeight * 0.5 && r.width < vw * 0.4);
      const navWidth = nav.reduce((s, r) => s + r.width, 0);

      // First data row.
      // Prefer real data rows; fall back to list items only when no table/grid exists.
      const outsideChrome = (el) => !inNav(el) && !el.closest('header, footer, [role="menu"], [role="menubar"], [role="tablist"]');
      const rowEl = [...document.querySelectorAll('tbody tr, [role="row"]:not(:has([role="columnheader"])), [role="gridcell"]')].filter(visible).find(outsideChrome)
        || [...document.querySelectorAll('[role="listitem"], li[data-id], main li, [role="main"] li')].filter(visible).find(outsideChrome)
        // Repeated records rendered as cards: the first of >=5 siblings sharing the same class list.
        || [...document.querySelectorAll('body *')].filter(visible).filter(outsideChrome).find((el) => {
          if (!el.className || typeof el.className !== 'string' || !el.parentElement) return false;
          const same = [...el.parentElement.children].filter((s) => s.className === el.className);
          return same.length >= 5 && same[0] === el && el.innerText.trim().length > 10;
        });
      const firstRow = rowEl ? Math.round(rowEl.getBoundingClientRect().top + window.scrollY) : null;

      // Target size.
      const interactive = [...document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role="button"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="switch"]')].filter(visible);
      const small = interactive.filter((el) => {
        const r = el.getBoundingClientRect();
        const inlineText = el.tagName === 'A' && getComputedStyle(el).display === 'inline';
        return !inlineText && (r.width < MIN_TARGET || r.height < MIN_TARGET);
      }).map((el) => `${desc(el)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`);

      // Names.
      const unnamed = interactive.filter((el) => ['BUTTON', 'A'].includes(el.tagName) || el.getAttribute('role') === 'button')
        .filter((el) => !label(el) && !el.getAttribute('aria-labelledby') && !el.querySelector('img[alt]:not([alt=""]), svg title'))
        .map(desc);
      const unlabeled = [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')].filter(visible)
        .filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby'))
        .map((el) => `${desc(el)} placeholder="${el.getAttribute('placeholder') || ''}"`);
      const noAlt = [...document.querySelectorAll('img')].filter(visible).filter((el) => !el.hasAttribute('alt')).map((el) => el.src.slice(-60));

      // Contrast sample.
      // Normalize any CSS color (rgb, oklch, lab, color()) to sRGB bytes through a 1px canvas.
      const cvs = document.createElement('canvas'); cvs.width = cvs.height = 1;
      const ctx = cvs.getContext('2d', { willReadFrequently: true });
      const parse = (c) => {
        const alpha = /rgba?\([^)]*,\s*([\d.]+)\)|\/\s*([\d.]+%?)\s*\)/.exec(c);
        let a = 1;
        if (alpha) { const v = alpha[1] ?? alpha[2]; a = v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v); }
        if (c === 'transparent') a = 0;
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b, a];
      };
      const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const bgOf = (el) => {
        for (let n = el; n; n = n.parentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c.length < 4 || c[3] > 0.9) return c;
          if (getComputedStyle(n).backgroundImage !== 'none') return null; // gradient/image: cannot compute
        }
        return [255, 255, 255, 1];
      };
      const texts = [...document.body.querySelectorAll('p, span, a, button, label, td, th, li, h1, h2, h3, h4, small, div')]
        .filter(visible).filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)).slice(0, 400);
      const lowContrast = [];
      for (const el of texts) {
        const cs = getComputedStyle(el);
        const fg = parse(cs.color);
        const bg = bgOf(el);
        if (!bg || (fg[3] !== undefined && fg[3] < 0.9)) continue;
        const l1 = lum(fg), l2 = lum(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const size = parseFloat(cs.fontSize);
        const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
        const need = large ? 3 : 4.5;
        if (ratio < need && !el.closest('[disabled], [aria-disabled="true"]')) {
          lowContrast.push(`${desc(el)} ${ratio.toFixed(2)}:1 (need ${need}) ${size}px`);
        }
      }

      // Table cells squeezed to (near) zero width while holding text: common with table-layout: fixed
      // in narrow viewports. visible() is not used because a 0px cell would be filtered out.
      const collapsedCells = [...document.querySelectorAll('th, td')].filter((el) => {
        const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && r.height > 0 && r.width < 32 && el.textContent.trim().length > 3;
      }).map(desc);

      return {
        collapsed_cells: collapsedCells.slice(0, 20),
        collapsed_cells_count: collapsedCells.length,
        viewport: vw,
        overflow_px: overflow > 1 ? overflow : 0,
        main: desc(main),
        content_region: { left: Math.round(cr.left), right: Math.round(vw - cr.right), width: Math.round(cr.width) },
        content_share: +(cr.width / vw).toFixed(2),
        content_share_excluding_nav: +(cr.width / Math.max(1, vw - navWidth)).toFixed(2),
        nav_width: Math.round(navWidth),
        first_row_y: firstRow,
        small_targets: small.slice(0, 30),
        small_targets_count: small.length,
        unnamed_controls: unnamed.slice(0, 30),
        unlabeled_inputs: unlabeled.slice(0, 30),
        images_without_alt: noAlt.slice(0, 20),
        low_contrast: lowContrast.slice(0, 30),
        low_contrast_count: lowContrast.length,
      };
    }, { MIN_TARGET });

    // Focus visibility across Tab stops.
    const focus = [];
    await page.mouse.click(1, 1).catch(() => {});
    for (let i = 0; i < tabs; i++) {
      await page.keyboard.press('Tab');
      const f = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        const ring = cs.boxShadow && cs.boxShadow !== 'none';
        const txt = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || '').trim().slice(0, 40);
        return { el: `${el.tagName.toLowerCase()} "${txt}"`, visible_indicator: outline || ring, matches_focus_visible: el.matches(':focus-visible') };
      });
      if (!f) break;
      focus.push(f);
    }
    const noFocusIndicator = focus.filter((f) => !f.visible_indicator).map((f) => f.el);

    // Tooltip parity: icon-only controls (no visible text) whose hover reveals text that keyboard focus does not.
    // Detection is generic: mark what is visible, hover, and collect newly visible elements with text
    // (works for [role=tooltip] and for CSS-only tips). Tooltip-like "clickable" elements that cannot
    // receive focus are reported separately because keyboard users can never reach them.
    const tooltipParity = [];
    const notFocusable = [];
    const candidates = await page.$$('button, a[href], [role="button"], [onclick], [tabindex], div, span, li');
    let checked = 0;
    for (const handle of candidates) {
      if (checked >= 14) break;
      const info = await handle.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const clickable = el.matches('button, a[href], [role="button"], [onclick]') || cs.cursor === 'pointer';
        const iconOnly = !el.innerText.trim() && !!el.querySelector('svg, img, i');
        const focusable = el.tabIndex >= 0 && !el.disabled;
        const parentClickable = el.parentElement && (el.parentElement.matches('button, a[href], [role="button"], [onclick]') || getComputedStyle(el.parentElement).cursor === 'pointer');
        return {
          ok: clickable && iconOnly && !parentClickable && r.width > 0 && r.width < 80 && r.height < 80,
          focusable,
          name: el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent.trim().slice(0, 30) || '(sem nome)',
        };
      });
      if (!info.ok) continue;
      checked++;
      const box = await handle.boundingBox();
      if (!box) continue;
      await page.evaluate(() => document.querySelectorAll('[data-iv]').forEach((e) => e.removeAttribute('data-iv')));
      await page.evaluate(() => {
        for (const e of document.querySelectorAll('body *')) {
          const r = e.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden') e.setAttribute('data-iv', '1');
        }
      });
      const revealed = () => page.evaluate(() => [...document.querySelectorAll('body *:not([data-iv])')].filter((e) => {
        const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.1 && e.innerText && e.innerText.trim();
      }).map((e) => e.innerText.trim().slice(0, 40)));
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(900);
      const onHover = await revealed();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(400);
      if (!onHover.length) continue;
      if (!info.focusable) { notFocusable.push(`${info.name} (revela "${onHover[0]}" no hover)`); continue; }
      await handle.focus().catch(() => {});
      await page.waitForTimeout(900);
      const onFocus = await revealed();
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
      if (!onFocus.length) tooltipParity.push({ control: info.name, hover: onHover[0], focus: null });
    }
    await page.evaluate(() => document.querySelectorAll('[data-iv]').forEach((e) => e.removeAttribute('data-iv')));

    const findings = [];
    if (metrics.overflow_px) findings.push(`overflow: página rola ${metrics.overflow_px}px na horizontal`);
    if (dataScreen && width >= 1280 && metrics.content_share_excluding_nav < DATA_SCREEN_MIN_SHARE) {
      findings.push(`width-usage: conteúdo usa ${Math.round(metrics.content_share_excluding_nav * 100)}% da área fora da navegação (${metrics.content_region.left}px à esquerda, ${metrics.content_region.right}px à direita) numa tela de dados`);
    }
    if (dataScreen && metrics.first_row_y && metrics.first_row_y > height * 0.55) findings.push(`first-row: primeira linha de dados em y=${metrics.first_row_y}px, abaixo de 55% da altura`);
    if (dataScreen && metrics.first_row_y === null) findings.push('first-row: nenhuma linha ou item de lista visível no carregamento');
    if (metrics.collapsed_cells_count) findings.push(`columns: ${metrics.collapsed_cells_count} células de tabela com texto e menos de 32px de largura (coluna esmagada)`);
    if (metrics.small_targets_count) findings.push(`targets: ${metrics.small_targets_count} controles menores que ${MIN_TARGET}x${MIN_TARGET}px (conferir exceções do SC 2.5.8)`);
    if (metrics.unnamed_controls.length) findings.push(`names: ${metrics.unnamed_controls.length} botões/links sem nome acessível`);
    if (metrics.unlabeled_inputs.length) findings.push(`names: ${metrics.unlabeled_inputs.length} campos sem rótulo associado`);
    if (metrics.images_without_alt.length) findings.push(`names: ${metrics.images_without_alt.length} imagens sem alt`);
    if (noFocusIndicator.length) findings.push(`focus: ${noFocusIndicator.length} de ${focus.length} paradas de Tab sem indicador visível`);
    if (tooltipParity.length) findings.push(`tooltips: ${tooltipParity.length} controles mostram tooltip no hover e não no foco do teclado`);
    if (notFocusable.length) findings.push(`keyboard: ${notFocusable.length} controles clicáveis só com ícone não recebem foco (ex.: ${notFocusable[0]})`);
    if (metrics.low_contrast_count) findings.push(`contrast: ${metrics.low_contrast_count} textos amostrados abaixo do mínimo WCAG`);

    report.runs.push({ width, height, http: status, screenshot: shot, findings, metrics, focus_stops: focus, no_focus_indicator: noFocusIndicator, tooltip_parity: tooltipParity, clickable_not_focusable: notFocusable });
    await page.close();
  }
} finally {
  await browser.close();
}

const jsonPath = join(outDir, 'report.json');
writeFileSync(jsonPath, JSON.stringify(report, null, 1));
if (args.includes('--json')) {
  console.log(JSON.stringify(report, null, 1));
} else {
  for (const run of report.runs) {
    if (run.error) { console.log(`[${run.width}px] FAIL ${run.error}`); continue; }
    console.log(`[${run.width}px] HTTP ${run.http} | screenshot ${run.screenshot}`);
    console.log(`  content ${run.metrics.content_region.width}px (${Math.round(run.metrics.content_share * 100)}% of viewport; nav ${run.metrics.nav_width}px) | first row y=${run.metrics.first_row_y ?? 'n/a'}`);
    if (!run.findings.length) console.log('  no automatic findings (still look at the screenshot)');
    for (const f of run.findings) console.log(`  - ${f}`);
  }
  console.log(`report: ${jsonPath}`);
}
if (report.runs.length && report.runs.every((r) => r.error)) process.exit(4);

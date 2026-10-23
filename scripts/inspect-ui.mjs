#!/usr/bin/env node
// Deterministic UI inspection for software screens (feedback loop for the skill).
//
// Usage:
//   node scripts/inspect-ui.mjs <url> [--out <dir>] [--widths 1440,390] [--height 900]
//        [--storage-state auth.json] [--mock mock.mjs] [--states loading,empty,error,long]
//        [--color-scheme light,dark] [--rules ui-rules.json] [--compare old-dir]
// Run --help for the complete CLI. Themes/states/motion are isolated browser contexts.
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
// Exit: 0 ran (may have findings), 1 findings with --fail-on-findings, 2 usage, 3 no Playwright, 4 failed run.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { options, inspectExtras, compareScreenshot, writeGallery } from './inspection-support.mjs';
import { collectPageMetrics, measureFocus } from './inspect-measure.mjs';

const args = process.argv.slice(2);
const usage='usage: node inspect-ui.mjs <url> [url2 ...] [--out dir] [--widths 1440,768,390] [--height 900] [--tabs 25] [--wait 1500] [--storage-state auth.json] [--mock mock.mjs] [--color-scheme light,dark] [--states default,loading,empty,error,long] [--rules ui-rules.json] [--ready selector] [--expect selector] [--timeout 5000] [--reduced-motion no-preference,reduce] [--compare old-dir] [--data-screen] [--full-page] [--fail-on-findings] [--json]';
let config;
try {config=await options(args);} catch(error) {console.error(error.message);console.error(usage);process.exit(2);}
if(config.help){console.log(usage);process.exit(0);}

// WCAG 2.2 SC 2.5.8 Target Size (Minimum) is 24x24 CSS px.
const MIN_TARGET = 24;
// Below this share of a >=1280px viewport, a data screen is probably squeezed into a centered column.
// 0.7 leaves room for a 240-320px sidebar plus normal page margins (Atlassian side nav 240-320px,
// Carbon left panel 256px, Fluent Nav 260px) before flagging.
const DATA_SCREEN_MIN_SHARE = 0.7;
const {outDir,widths,height,tabs,wait}=config;
const dataScreen = config['data-screen'];

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
const report = { version:'2.2.0', url:config.urls[0], urls:config.urls, generated_at: new Date().toISOString(), runs: [] };
let browser;
try {browser = await pw.chromium.launch();} catch(error) {console.error(`Chromium failed: ${error.message.split('\n')[0]}`);process.exit(4);}
const fingerprints=new Map();

try {
  for (const url of config.urls) for (const colorScheme of config.themes) for (const state of config.states) for(const reducedMotion of config.motions) for (const width of widths) {
    const context = await browser.newContext({viewport:{width,height},colorScheme,reducedMotion,
      ...(config['storage-state']?{storageState:resolve(config['storage-state'])}:{}),serviceWorkers:config.mock?'block':'allow'});
    const page = await context.newPage();
    page.setDefaultTimeout(config.timeout);
    const consoleErrors=[],pageErrors=[],networkErrors=[];
    page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text().slice(0,300));});
    page.on('pageerror',error=>pageErrors.push(error.message.slice(0,300)));
    page.on('requestfailed',req=>networkErrors.push({url:req.url().split('?')[0],error:req.failure()?.errorText}));
    const routeKey=createHash('sha256').update(url).digest('hex').slice(0,10);
    const key=`${routeKey}-${width}-${colorScheme}-${state}-${reducedMotion}`;
    const run={key,url,width,height,color_scheme:colorScheme,state,reduced_motion:reducedMotion};
    try {
    const definition=config.mock?.states?.[state]||{};
    let setup={};
    let status = null;
    try {
      setup=await config.mock?.default({page,context,url,width,height,state,colorScheme,reducedMotion})||{};
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      status = res ? res.status() : null;
      const ready=definition.ready||setup.ready||config.ready;
      if(ready)await page.locator(ready).first().waitFor({state:'visible'});
      await setup.beforeCapture?.({page,context,state});
    } catch (e) {
      report.runs.push({ ...run,error: e.message.split('\n')[0] });
      await context.close();
      continue;
    }
    let expectationError=null;
    const expect=definition.expect||setup.expect||config.expect;
    await page.waitForTimeout(definition.captureAfter??setup.captureAfter??wait);
    if(expect)try{await page.locator(expect).first().waitFor({state:'visible'});}catch(error){expectationError=error.message.split('\n')[0];}
    // Never wait for API/network idle: that would skip a loading state under test.
    const legacy=config.urls.length===1&&config.themes.length===1&&colorScheme==='light'&&config.states.length===1&&state==='default'&&config.motions.length===1&&reducedMotion==='no-preference';
    const shot = join(outDir, legacy?`screen-${width}.jpg`:`screen-${key}.jpg`);
    await page.screenshot({ path: shot, type: 'jpeg', quality: 75, fullPage:config['full-page']||false });

    const metrics = await page.evaluate(collectPageMetrics, { MIN_TARGET });

    Object.assign(metrics,await inspectExtras(page,config.rules));
    const fingerprint=createHash('sha256').update(metrics.main_text).digest('hex');
    delete metrics.main_text;
    const fingerprintKey=`${width}-${colorScheme}-${state}-${reducedMotion}-${fingerprint}`;
    const previousRoute=fingerprints.get(fingerprintKey);
    fingerprints.set(fingerprintKey,url);

    const focus = await measureFocus(page, tabs);
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
    if(metrics.blank)findings.push('blank: região principal sem conteúdo, controles ou indicador de carregamento visível');
    if(previousRoute&&previousRoute!==url)findings.push(`route-duplicate: mesmo conteúdo principal que ${previousRoute}; verificar rota, login e montagem (heurística)`);
    if(expectationError)findings.push(`state: seletor esperado ${expect} não ficou visível (${expectationError})`);
    if(status>=400)findings.push(`http: documento retornou ${status}`);
    if(pageErrors.length)findings.push(`runtime: ${pageErrors.length} erros JavaScript (primeiro: ${pageErrors[0]})`);
    if(width<=768&&metrics.truncated.length)findings.push(`truncated: ${metrics.truncated.length} textos com reticência ou clamp excedem a área; verificar acesso ao conteúdo completo`);
    if(width>=1024&&metrics.cta_wrap.length)findings.push(`cta-wrap: ${metrics.cta_wrap.length} ações com texto em mais de uma linha no desktop`);
    if(metrics.rule_violations.length)findings.push(`rules: ${metrics.rule_violations.length} violações de regras do projeto (${[...new Set(metrics.rule_violations.map(v=>v.property))].join(', ')})`);
    for(const warning of metrics.consistency_warnings)findings.push(`consistency: ${warning} (heurística)`);
    if(metrics.motion_durations.length)findings.push(`motion-duration: ${metrics.motion_durations.length} transições/animações acima de ${config.rules.consistency?.maxDuration??500}ms (revisar finalidade)`);
    if(metrics.motion_layout.length)findings.push(`motion-layout: ${metrics.motion_layout.length} animações de geometria ou transition:all (revisar custo)`);
    if(metrics.motion_reduced.length)findings.push(`motion-reduced: ${metrics.motion_reduced.length} animações continuam com movimento reduzido`);
    if (metrics.overflow_px) findings.push(`overflow: página rola ${metrics.overflow_px}px na horizontal`);
    if (dataScreen && width >= 1280 && metrics.content_share_excluding_nav < DATA_SCREEN_MIN_SHARE) {
      findings.push(`width-usage: conteúdo usa ${Math.round(metrics.content_share_excluding_nav * 100)}% da área fora da navegação (${metrics.content_region.left}px à esquerda, ${metrics.content_region.right}px à direita) numa tela de dados`);
    }
    if (dataScreen && metrics.first_row_y && metrics.first_row_y > height * 0.55) findings.push(`first-row: primeira linha de dados em y=${metrics.first_row_y}px, abaixo de 55% da altura`);
    if (dataScreen && !['loading','empty','error','permission'].includes(state) && metrics.first_row_y === null) findings.push('first-row: nenhuma linha ou item de lista visível no carregamento');
    if (metrics.collapsed_cells_count) findings.push(`columns: ${metrics.collapsed_cells_count} células de tabela com texto e menos de 32px de largura (coluna esmagada)`);
    if (metrics.small_targets_count) findings.push(`targets: ${metrics.small_targets_count} controles menores que ${MIN_TARGET}x${MIN_TARGET}px (conferir exceções do SC 2.5.8)`);
    if (metrics.unnamed_controls.length) findings.push(`names: ${metrics.unnamed_controls.length} botões/links sem nome acessível`);
    if (metrics.unlabeled_inputs.length) findings.push(`names: ${metrics.unlabeled_inputs.length} campos sem rótulo associado`);
    if (metrics.images_without_alt.length) findings.push(`names: ${metrics.images_without_alt.length} imagens sem alt`);
    if (noFocusIndicator.length) findings.push(`focus: ${noFocusIndicator.length} de ${focus.length} paradas de Tab sem indicador visível`);
    if (tooltipParity.length) findings.push(`tooltips: ${tooltipParity.length} controles mostram tooltip no hover e não no foco do teclado`);
    if (notFocusable.length) findings.push(`keyboard: ${notFocusable.length} controles clicáveis só com ícone não recebem foco (ex.: ${notFocusable[0]})`);
    if (metrics.low_contrast_count) findings.push(`contrast: ${metrics.low_contrast_count} textos amostrados abaixo do mínimo WCAG`);

    Object.assign(run,{http:status,final_url:page.url(),screenshot:shot,findings,metrics,fingerprint,
      state_verified:expect?!expectationError:state==='default'&&!metrics.blank,expected_selector:expect||null,
      console_errors:consoleErrors,page_errors:pageErrors,network_errors:networkErrors,
      focus_stops:focus,no_focus_indicator:noFocusIndicator,tooltip_parity:tooltipParity,clickable_not_focusable:notFocusable});
    if(config.previous)await compareScreenshot(page,run,config.previous,outDir,config.compare);
    report.runs.push(run);
    } catch(error) {
      report.runs.push({...run,error:error.message.split('\n')[0]});
    } finally {await context.close();}
  }
} finally {
  await browser.close();
}

const jsonPath = join(outDir, 'report.json');
writeFileSync(jsonPath, JSON.stringify(report, null, 1));
writeGallery(report,outDir);
if (args.includes('--json')) {
  console.log(JSON.stringify(report, null, 1));
} else {
  for (const run of report.runs) {
    if (run.error) { console.log(`[${run.width}px] FAIL ${run.error}`); continue; }
    console.log(`[${run.width}px ${run.color_scheme} ${run.state} ${run.reduced_motion}] HTTP ${run.http} | screenshot ${run.screenshot}`);
    console.log(`  content ${run.metrics.content_region.width}px (${Math.round(run.metrics.content_share * 100)}% of viewport; nav ${run.metrics.nav_width}px) | first row y=${run.metrics.first_row_y ?? 'n/a'}`);
    if (!run.findings.length) console.log('  no automatic findings (still look at the screenshot)');
    for (const f of run.findings) console.log(`  - ${f}`);
  }
  console.log(`report: ${jsonPath}`);
}
if (report.runs.some((r) => r.error)) process.exit(4);
if(config['fail-on-findings']&&report.runs.some(r=>r.findings.length))process.exit(1);

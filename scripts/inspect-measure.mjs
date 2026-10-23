// Page measurements for inspect-ui.mjs, moved out of it in 2.7.0 so each file stays under the 20 KB commit limit.
// collectPageMetrics runs inside page.evaluate: it must stay self-contained (no closure over module scope).

export const collectPageMetrics = ({ MIN_TARGET }) => {
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
};

/** Focus visibility across Tab stops. Returns one entry per stop. */
export async function measureFocus(page, tabs) {
  const focus = [];
  // 2.7.0: a focus state without a contour (underline, background or colour change, also on a pseudo-element or
  // a :focus-within parent) is a visible indicator. Before, only outline or box-shadow counted, so the owner's
  // contour-free focus style was reported as missing. Transitions are frozen so focused and rest styles are final.
  await page.mouse.click(1, 1).catch(() => {});
  await page.evaluate(() => {
    const st = document.createElement('style');
    st.id = '__sud_focus_freeze';
    st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}';
    document.head.appendChild(st);
  }).catch(() => {});
  for (let i = 0; i < tabs; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const OWN = ['backgroundColor', 'color', 'textDecorationLine', 'textDecorationColor', 'textDecorationThickness', 'borderTopColor',
        'borderBottomColor', 'borderBottomWidth', 'fontWeight', 'outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow'];
      const PSEUDO = ['content', 'opacity', 'transform', 'backgroundColor', 'width', 'height', 'borderBottomColor'];
      const PARENT = ['backgroundColor', 'borderTopColor', 'borderBottomColor', 'boxShadow', 'outlineStyle'];
      const pick = (cs, props) => props.map((p) => cs[p]).join('|');
      const read = () => [pick(getComputedStyle(el), OWN), pick(getComputedStyle(el, '::before'), PSEUDO),
        pick(getComputedStyle(el, '::after'), PSEUDO), el.parentElement ? pick(getComputedStyle(el.parentElement), PARENT) : ''];
      // Only a change between rest and focus is an indicator: an outline or shadow already present at rest is not.
      const ringOf = () => { const c = getComputedStyle(el); return { outline: `${c.outlineStyle}|${c.outlineWidth}|${c.outlineColor}`, shadow: c.boxShadow }; };
      const on = read(), ringOn = ringOf();
      el.blur();
      const off = read(), ringOff = ringOf();
      el.focus();
      const where = ['estilo próprio', '::before', '::after', 'pai'].filter((_, k) => on[k] !== off[k]);
      const kind = ringOn.outline !== ringOff.outline ? 'outline' : ringOn.shadow !== ringOff.shadow ? 'box-shadow' : where.join(', ');
      const txt = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || '').trim().slice(0, 40);
      return { el: `${el.tagName.toLowerCase()} "${txt}"`, visible_indicator: where.length > 0,
        indicator: kind || null, matches_focus_visible: el.matches(':focus-visible') };
    });
    if (!f) break;
    focus.push(f);
  }
  await page.evaluate(() => document.getElementById('__sud_focus_freeze')?.remove()).catch(() => {});
  return focus;
}

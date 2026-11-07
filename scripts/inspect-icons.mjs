// Candidate icon checks for inspect-ui.mjs:
//   icon-mixed        filled and outline glyphs side by side in one nav, list, menu, tab list or toolbar
//   icon-emoji        an emoji sitting in an icon's seat beside words (a row lead, a tab, a nav item)
//   icon-clipped      an SVG whose drawing runs past its own viewBox, so a stroke is cut off
//   icon-translucent  icon strokes or fills with alpha: overlapping shapes paint darker (onion-skin look)
// Ported from benjitaylor/skills stageshow@299140f scripts/film-checks.mjs:17-22,55-77,455-479,654-704,1049-1066
// Copyright (c) 2026 Benji Taylor, MIT License (see references/stageshow-LICENSE.txt)
// Changes from upstream: runs on document.body of an ordinary app; .ss-* exclusions replaced by generic ones (logo,
// brand, avatar, spinner, progress, switch, checkbox, chat/reaction content); every hit is counted instead of stopping at
// the first; icon-emoji also accepts the emoji element itself as the seat (<a><span>X</span> Notas</a>) and matches only
// emoji presentation, not text-style dingbats; icon-clipped skips SVGs with overflow:visible (nothing is cut);
// icon-translucent needs two painted shapes or a translucent fill under a stroke, since a single stroke never overlaps
// itself. Upstream's 14px miniature icon scale is NOT a rule here: the skill keeps icons at 16 or 20px.
// auditIcons runs inside page.evaluate: it must stay self-contained (no closure over module scope).

export function auditIcons() {
  const root = document.body
  const findings = []
  const rgbaOf = (color) => {
    const m = color && color.match(/rgba?\(([^)]+)\)|color\(srgb\s+([^)]+)\)/)
    if (!m) return null
    const p = (m[1] ?? m[2]).split(/[ ,/]+/).filter(Boolean)
    return { a: p.length > 3 ? parseFloat(p[3]) : 1 }
  }
  // An unparsed paint counts as opaque, so only a known alpha is reported.
  const alphaOf = (color) => rgbaOf(color)?.a ?? 1
  // Nothing hidden up to the body, and at least half opaque through every layer.
  const painted = (n) => {
    let f = 1
    for (let a = n; a && a !== root.parentElement; a = a.parentElement) {
      const c = getComputedStyle(a)
      if (c.display === 'none' || c.visibility === 'hidden') return false
      f *= Number(c.opacity)
    }
    return f >= 0.5
  }
  const label = (n) => {
    const cls = typeof n.className === 'string' ? n.className.trim().split(/\s+/)[0] : (n.className?.baseVal || '').split(/\s+/)[0]
    const text = (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24)
    return `${n.tagName.toLowerCase()}${cls ? '.' + cls : ''}${text ? ` "${text}"` : ''}`
  }
  const NOT_ICON = '[class*="logo" i], [id*="logo" i], [class*="brand" i], [class*="avatar" i], [role="progressbar"], [aria-busy="true"], [class*="spinner" i], [role="switch"], [role="checkbox"], input'
  const SHAPES = 'path, rect, circle, ellipse, polygon, line, polyline'
  const add = (rule, el, evidence) => findings.push({ rule, element: label(el), ...evidence })

  // icon-translucent
  for (const svg of root.querySelectorAll('svg')) {
    if (svg.closest(NOT_ICON) || svg.getAnimations({ subtree: true }).length) continue
    const r = svg.getBoundingClientRect()
    // Icon-sized only: an illustration or a faded layer blends its own strokes on purpose.
    if (r.width < 6 || r.width > 40 || r.height > 40 || r.width / r.height > 2 || r.height / r.width > 2 || !painted(svg)) continue
    let paintedShapes = 0, translucent = 0, fillUnderStroke = false
    for (const shape of svg.querySelectorAll(SHAPES)) {
      const cs = getComputedStyle(shape)
      const stroke = cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0, fill = cs.fill !== 'none' && alphaOf(cs.fill) > 0
      if (!stroke && !fill) continue
      paintedShapes++
      const strokeA = stroke ? alphaOf(cs.stroke) * parseFloat(cs.strokeOpacity) : 1
      const fillA = fill ? alphaOf(cs.fill) * parseFloat(cs.fillOpacity) : 1
      if (strokeA < 0.99 || fillA < 0.99) translucent++
      if (stroke && fill && fillA < 0.99) fillUnderStroke = true
    }
    if (translucent && (paintedShapes >= 2 || fillUnderStroke)) add('icon-translucent', svg.parentElement ?? svg, { shapes: paintedShapes, translucent })
  }

  // icon-mixed: one family, one construction.
  const kind = (svg) => {
    let filled = 0, stroked = 0
    for (const s of svg.querySelectorAll(SHAPES)) {
      const c = getComputedStyle(s)
      const hasFill = c.fill !== 'none' && alphaOf(c.fill) > 0
      const hasStroke = c.stroke !== 'none' && parseFloat(c.strokeWidth) > 0
      if (hasStroke && !hasFill) stroked++
      else if (hasFill && !hasStroke) filled++
    }
    return filled && !stroked ? 'filled' : stroked && !filled ? 'outline' : null
  }
  const mixed = []
  for (const n of root.querySelectorAll('nav, aside, ul, ol, [role="list"], [role="toolbar"], [role="menu"], [role="tablist"]')) {
    if (mixed.some((m) => m.contains(n))) continue
    const icons = [...n.querySelectorAll('svg')].filter((s) => {
      const r = s.getBoundingClientRect()
      return r.width >= 10 && r.width <= 32 && r.height >= 10 && r.height <= 32 && !s.closest(NOT_ICON) && painted(s)
    })
    if (icons.length < 3) continue
    const kinds = icons.map(kind).filter(Boolean)
    const f = kinds.filter((k) => k === 'filled').length, o = kinds.filter((k) => k === 'outline').length
    if (f && o && f + o >= 3) { mixed.push(n); add('icon-mixed', n, { filled: f, outline: o }) }
  }

  // icon-emoji: emoji are content (a reaction, a message); icons are drawn, one family tinted to the look.
  const emojiRe = /^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️)(?:️|‍\p{Extended_Pictographic}️?|[\u{1F3FB}-\u{1F3FF}])*$/u
  const small = (el) => { const r = el.getBoundingClientRect(); return r.width <= 56 && r.height <= 56 }
  for (const n of root.querySelectorAll('*')) {
    if (n.children.length || n.closest('svg, p, blockquote, textarea, [contenteditable="true"], [data-emoji], [class*="emoji" i], [class*="reaction" i], [class*="message" i], [class*="chat" i]')) continue
    const t = (n.textContent || '').trim()
    if (!t || t.length > 8 || !emojiRe.test(t)) continue
    const r = n.getBoundingClientRect()
    if (r.width < 8 || r.height < 8 || !painted(n)) continue
    // The seat: a small wrapper holding no words, else the emoji element itself.
    const box = n.parentElement
    const seat = box && small(box) && !/\p{L}/u.test((box.textContent || '').replace(t, '')) ? box : small(n) ? n : null
    const row = seat?.parentElement
    if (row && /\p{L}{3,}/u.test((row.textContent || '').replace(t, ''))) add('icon-emoji', n, { seat: Math.round(seat.getBoundingClientRect().width) })
  }

  // icon-clipped: the drawing must fit inside its own viewBox.
  for (const svg of root.querySelectorAll('svg[viewBox]')) {
    if (svg.closest(NOT_ICON) || getComputedStyle(svg).overflow === 'visible') continue
    const r = svg.getBoundingClientRect()
    if (r.width < 8 || r.width > 160 || r.height > 160 || !painted(svg)) continue
    let box
    try { box = svg.getBBox() } catch { continue }
    const vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number)
    if (vb.length !== 4 || vb.some(Number.isNaN) || !box.width) continue
    const over = Math.max(vb[0] - box.x, vb[1] - box.y, (box.x + box.width) - (vb[0] + vb[2]), (box.y + box.height) - (vb[1] + vb[3]))
    const stroke = parseFloat(getComputedStyle(svg.querySelector(SHAPES) || svg).strokeWidth) || 0
    if (over > stroke / 2 + 0.25) add('icon-clipped', svg.parentElement ?? svg, { over: +over.toFixed(1) })
  }
  const counts = {}
  for (const f of findings) counts[f.rule] = (counts[f.rule] || 0) + 1
  return { findings: findings.slice(0, 40), counts }
}

const LABEL = {
  'icon-mixed': (n, f) => `${n} grupos misturam ícones preenchidos e de traço (ex.: ${f.element}: ${f.filled} preenchidos, ${f.outline} de traço)`,
  'icon-emoji': (n, f) => `${n} emojis no lugar de ícone ao lado de texto (ex.: ${f.element})`,
  'icon-clipped': (n, f) => `${n} ícones desenham além do viewBox e cortam o traço (ex.: ${f.element}: ${f.over} unidades)`,
  'icon-translucent': (n, f) => `${n} ícones com traço ou preenchimento translúcido (ex.: ${f.element})`,
}

/** Runs auditIcons in the page and returns {candidates: string[], evidence}. */
export async function inspectIcons(page) {
  const evidence = await page.evaluate(auditIcons)
  const candidates = Object.entries(LABEL).flatMap(([rule, label]) => {
    const first = evidence.findings.find((f) => f.rule === rule)
    return first ? [`${rule}: ${label(evidence.counts[rule], first)} (candidato)`] : []
  })
  return { candidates, evidence }
}

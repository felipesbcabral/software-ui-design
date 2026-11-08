// Candidate spacing checks for inspect-ui.mjs (rendered gaps, viewport only):
//   spacing-inset     words under 8px from the side of their card (A1)
//   spacing-control   a painted button under 8px below the field, rule or card edge above it
//   spacing-stack     two lines of different style under 3px of ink apart, or over 10px (A3)
//   spacing-touching  text under 5px from a box on its line, unless a fixed gap of 2px+ parts them (A5)
//   spacing-padding   card top or bottom short of its side inset (A8)
//   spacing-squeezed  a short-label badge or avatar shrunk by its flex row
//   spacing-spill     a control running 3px or more past its slot
//   spacing-clipped   a leaf (text, dot, icon) cut by an overflow:hidden|clip ancestor
// A1/A3/A5/A8: stageshow craft.md rules in references/componentes-bonitos.md, same numbers.
// Ported from benjitaylor/skills stageshow@299140f scripts/film-checks.mjs:17-92,128-161,535-564,776-891,962-1004,
// 1245-1269,1508-1561,2043-2077
// Copyright (c) 2026 Benji Taylor, MIT License (see references/stageshow-LICENSE.txt)
// Changes (each removes a replay false positive or keeps app density legal):
// - stage = viewport of document.body; .ss-*, window/phone/specimen/crop branches gone; all hits counted; a fill
//   equal to the page background paints nothing.
// - control skips a button and a box both in table/grid/list rows; the box above is clipped by its scroller.
// - words = trimmed text box; a box edge needs fill, shadow or side borders (a ruled cell is words). Padding trims
//   text to the em box; stack subtracts box padding.
// - touching skips absolute text, layers overlapping over half and bare inline words; bare words collide under 2px.
// - padding needs a card edge, skips absolute pieces, empty spacers, own scrollers; bars 3:1 pass at near-equal T/B.
// - stack skips flex rows and logo/brand/wordmark; tight under 24px type; loose both under 15px; adjacent only.
// - squeezed skips progress/meter. clipped: hidden/clip only, stops at scrollers and body, skips media, graphics
//   over 64px, ellipsis, line-clamp.
// Dropped (byte cap, worst replay signal): lopsided pills (layout-edge covers it), uneven inset, spill gap-closing.
// Not ported: near-tangent edges (A6), framing, satellites, stage-only checks.
// auditSpacing runs inside page.evaluate: it must stay self-contained.

export function auditSpacing() {
  const root = document.body, W = document.documentElement.clientWidth, H = innerHeight, findings = [], all = [...root.querySelectorAll('*')]
  const { min, max, round } = Math, box = (e) => e.getBoundingClientRect(), px = (v) => parseFloat(v) || 0, r1 = (v) => round(v * 10) / 10, gcs = (e) => getComputedStyle(e)
  const alpha = (c, f) => {
    const m = c && c.match(/rgba?\(([^)]+)\)|color\(srgb\s+([^)]+)\)/)
    if (!m) return f
    const p = (m[1] ?? m[2]).split(/[ ,/]+/).filter(Boolean)
    return p.length > 3 ? parseFloat(p[3]) : 1
  }
  const page = [root, document.documentElement].map((e) => gcs(e).backgroundColor).find((c) => alpha(c, 0) > 0) || 'rgb(255, 255, 255)'
  const surf = (cs, border, least = .05) => alpha(cs.backgroundColor, 0) > least && cs.backgroundColor !== page || cs.boxShadow !== 'none' || border && px(cs.borderTopWidth) > 0
  const boxy = (cs) => surf(cs, 1, .02) || cs.backgroundImage !== 'none'
  // A visible box edge: fill, shadow or side borders (a ruled table cell only has a top or bottom rule).
  const edged = (cs) => surf(cs) || px(cs.borderLeftWidth) > 0 && px(cs.borderRightWidth) > 0
  const cls = (e) => typeof e.className === 'string' ? e.className : e.className?.baseVal || ''
  const name = (e) => {
    const c = cls(e).trim(), t = (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30)
    return `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : c ? '.' + c.split(/\s+/).slice(0, 2).join('.') : ''}${t ? ` "${t}"` : ''}`
  }
  const tag = (e) => name(e).split(' "')[0], abs = (cs) => /absolute|fixed/.test(cs.position)
  const media = /^(svg|img|canvas|video|input|textarea|select)$/i
  // Shown up to the body and half opaque; with clip, not cut away whole by an overflow ancestor.
  const shown = (n, clip) => {
    let f = 1
    const r = box(n)
    for (let a = n; a && a !== root.parentElement; a = a.parentElement) {
      const c = gcs(a)
      if (c.display === 'none' || c.visibility === 'hidden') return false
      f *= +c.opacity
      if (clip && a !== n && /hidden|clip/.test(c.overflowX + c.overflowY)) {
        const b = box(a)
        if (r.bottom <= b.top + .5 || r.top >= b.bottom - .5 || r.right <= b.left + .5 || r.left >= b.right - .5) return false
      }
    }
    return f >= .5
  }
  const meets = (r) => r.right > r.left && r.bottom > r.top && r.right > 0 && r.bottom > 0 && r.left < W && r.top < H
  const inView = (r) => meets(r) && r.left >= -1 && r.top >= -1 && r.right <= W + 1 && r.bottom <= H + 1
  const busy = (e) => e.getAnimations({ subtree: true }).some((a) => a.playState === 'running' && a.effect?.getTiming?.().iterations !== Infinity)
  const cut = (u, b) => ({ left: max(u.left, b.left), right: min(u.right, b.right), top: max(u.top, b.top), bottom: min(u.bottom, b.bottom) })
  const join = (u, b) => u ? { ...u, left: min(u.left, b.left), right: max(u.right, b.right), top: min(u.top, b.top), bottom: max(u.bottom, b.bottom) } : { left: b.left, right: b.right, top: b.top, bottom: b.bottom, h: b.height }
  // The box left visible by every clipping ancestor.
  const clipped = (e) => {
    let b = cut(box(e), box(e))
    for (let a = e.parentElement; a && a !== root; a = a.parentElement) if (gcs(a).overflowX + gcs(a).overflowY !== 'visiblevisible') b = cut(b, box(a))
    return b
  }
  // Union of trimmed text boxes: own text nodes, or all when deep (absolute pieces such as sr-only skipped).
  const words = (e, deep) => {
    let u = null
    const nodes = []
    if (deep) { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); for (let t; (t = w.nextNode());) nodes.push(t) }
    else for (const c of e.childNodes) if (c.nodeType === 3) nodes.push(c)
    for (const t of nodes) {
      const s = t.textContent, i = s.search(/\S/)
      if (i < 0 || deep && t.parentElement !== e && abs(gcs(t.parentElement))) continue
      const rg = document.createRange(); rg.setStart(t, i); rg.setEnd(t, s.trimEnd().length)
      for (const b of rg.getClientRects()) if (b.width > .5) u = join(u, b)
    }
    return u
  }
  const add = (rule, check, e, ev) => findings.push({ rule: 'spacing-' + rule, check, element: name(e), ...ev })

  // spacing-touching (film-checks.mjs:1508-1561)
  for (const n of all) {
    if (n.closest('svg')) continue
    let t = words(n)
    if (!t || !meets(t) || abs(gcs(n)) || !shown(n, 1)) continue
    if (gcs(n).overflowX !== 'visible') t = cut(t, box(n))
    if (t.right - t.left < 2) continue
    const p = n.parentElement, first = (e) => e.tagName + cls(e).trim().split(/\s+/)[0]
    for (const [c, holder] of [...(p ? [...p.children].filter((c) => c !== n).map((c) => [c, p]) : []), ...[...n.children].map((c) => [c, n])]) {
      const cc = gcs(c)
      if (cc.display === 'inline' || abs(cc) || cc.transform !== 'none' || busy(c) || !shown(c, 1)) continue
      // A ruled cell is judged by its words; a bare inline-level box is a word of the same sentence.
      const painted = edged(cc), text = (c.textContent || '').trim(), svg = c.tagName.toLowerCase() === 'svg'
      if (!painted && (!svg && !text && !c.querySelector('svg, img') || /^inline/.test(cc.display)) || cls(n).trim() && first(c) === first(n)) continue
      // Bare neighbors: judged by words or icon; two bare words collide only under 2px.
      const bare = !painted && !svg && text, b = painted || svg ? box(c) : bare ? words(c, 1) || box(c) : box(c.querySelector('svg, img'))
      if (b.right - b.left < 4 || b.bottom - b.top < 4 || c.contains(n)) continue
      const m = min(t.bottom - t.top, b.bottom - b.top)
      if (!(min(t.bottom, b.bottom) - max(t.top, b.top) > .5 * m && Math.abs(t.top + t.bottom - b.top - b.bottom) / 2 < .5 * m)) continue
      const d = b.left >= t.right - 1 ? b.left - t.right : t.left >= b.right - 1 ? t.left - b.right : -1
      // Overlap over half the narrower one is a layer on purpose (hint in a field, knockout copy).
      if (d < 0 && min(t.right, b.right) - max(t.left, b.left) > .5 * min(t.right - t.left, b.right - b.left)) continue
      if (d < (bare ? 2 : 5) && !(px(gcs(holder).columnGap) >= 4 && d >= 2)) add('touching', 'touching', n, { gap: r1(d), neighbor: name(c) })
    }
  }

  // spacing-inset, card branch of tight inset (film-checks.mjs:776-804)
  for (const n of all) {
    if (!n.children.length || n.closest('svg')) continue
    const cs = gcs(n), r = box(n)
    if (!boxy(cs) || cs.boxShadow === 'none' && !(px(cs.borderTopWidth) > 0) || px(cs.borderTopLeftRadius) < 6) continue
    if (r.width < 160 || r.height < 48 || !meets(r) || n.closest('[role=tablist], [role=toolbar]') || /seg|tab|pill|chip|toolbar/i.test(cls(n)) || busy(n)) continue
    for (const d of n.querySelectorAll('*')) {
      if (d.children.length || !d.textContent.trim() || d.closest('svg')) continue
      let a = d
      while (a !== n && !boxy(gcs(a)) && !abs(gcs(a))) a = a.parentElement
      const w = a === n && shown(d, 1) && words(d)
      if (!w || w.right - w.left < 6) continue
      const left = w.left - r.left, right = r.right - w.right
      const side = left >= 0 && left < 8 && w.left > 2 ? ['esquerda', left] : right >= 0 && right < 8 && w.right < W - 2 ? ['direita', right] : null
      if (side) { add('inset', 'tight-inset', d, { side: side[0], gap: r1(side[1]), card: tag(n) }); break }
    }
  }

  // spacing-padding: uneven padding (film-checks.mjs:818-891)
  for (const n of all) {
    if (!n.children.length || n.closest('svg')) continue
    const r = box(n), cs = gcs(n)
    if (r.height < 44 || r.width < 44 || r.width < 80 && r.height < 80 || !inView(r) || r.width * r.height >= W * H * .85) continue
    if (!(surf(cs, 0, .02) || cs.backgroundImage !== 'none' || ['Top', 'Bottom', 'Left'].every((s) => px(cs[`border${s}Width`]) > 0))) continue
    if (+cs.opacity < .95 || cs.clipPath !== 'none' || busy(n) || !shown(n) || cs.overflowY !== 'visible' && n.scrollHeight > n.clientHeight + 1) continue
    let u = null
    for (const d of n.querySelectorAll('*')) {
      const tg = d.tagName.toLowerCase()
      if ((d.children.length || d.closest('svg')) && tg !== 'svg') continue
      const ds = gcs(d), dr = box(d)
      if (dr.width < 2 || dr.height < 2 || ds.visibility === 'hidden' || dr.bottom <= r.top || dr.top >= r.bottom || dr.right <= r.left || dr.left >= r.right) continue
      let a = d
      while (a !== n && +gcs(a).opacity >= .05 && !abs(gcs(a))) a = a.parentElement
      if (a !== n) continue
      let b = dr
      if (!media.test(tg) && !edged(ds)) {
        const w = words(d), t = w && max(0, w.h - px(ds.fontSize)) / 2
        if (w) b = { left: w.left, right: w.right, top: w.top + t, bottom: w.bottom - t }
        else if (!boxy(ds)) continue
      }
      u = join(u, cut(cut(b, r), clipped(d)))
    }
    if (!u) continue
    const vis = clipped(n), L = u.left - r.left, T = u.top - r.top, B = r.bottom - u.bottom
    // A quarter of the side inset short and 4px off, or past the edge by more than 4px.
    const short = (v) => v >= 0 ? v < L * .7 && L - v >= 4 : v < -4
    // Equal top and bottom, or a bar (3:1 or wider) with near-equal ones, is a proportion.
    if (L < 8 || Math.abs(T - B) < 2 && min(T, B) >= 6 || r.width > r.height * 3 && Math.abs(T - B) <= 3) continue
    const tight = []
    if (vis.bottom >= r.bottom - 1 && short(B)) tight.push(`base ${round(B)}px`)
    if (vis.top <= r.top + 1 && short(T)) tight.push(`topo ${round(T)}px`)
    if (tight.length) add('padding', 'uneven-padding', n, { detail: `${tight.join(', ')} contra ${round(L)}px na lateral` })
  }

  // spacing-control (film-checks.mjs:535-564)
  const rowish = 'tr, td, th, li, [role=row], [role=gridcell], [role=cell], [role=listitem], [role=option], [role=menuitem]'
  const above = all.flatMap((d) => {
    const s = gcs(d), r = box(d)
    return !d.closest('svg') && r.width >= 24 && r.height >= 12 && meets(r) && (surf(s, 1, .02) || px(s.borderBottomWidth) > 0 || /^(INPUT|TEXTAREA|SELECT)$/.test(d.tagName)) && shown(d, 1) ? [[d, clipped(d)]] : []
  })
  for (const n of all) {
    if (!n.matches('button, [role=button], [class*=btn], [class*=button]') || n.closest('svg') || n.querySelector('button') || !surf(gcs(n), 1, .02) || !shown(n) || busy(n)) continue
    const r = box(n), inRow = !!n.closest(rowish)
    if (r.width < 24 || r.height < 16 || !inView(r)) continue
    let worst = null
    for (const [d, b] of above) {
      if (d === n || d.contains(n) || n.contains(d) || inRow && d.closest(rowish)) continue
      if (b.bottom > r.top + 1 || b.bottom < r.top - 8 || min(b.right, r.right) - max(b.left, r.left) < 16) continue
      if (!worst || r.top - b.bottom < worst.gap) worst = { gap: r.top - b.bottom, d }
    }
    if (worst && worst.gap < 8) add('control', 'tight-control', n, { gap: r1(worst.gap), above: name(worst.d) })
  }

  // spacing-stack: tight and loose stack (film-checks.mjs:962-1004)
  const textLeaf = (d) => d.querySelectorAll('*').length <= 4 && d.textContent.trim().length > 1 && !d.querySelector('svg, img, input, button') &&
    !boxy(gcs(d)) && box(d).height <= px(gcs(d).fontSize) * 3.2
  const leafOf = (d) => {
    const cs = gcs(d)
    if (cs.display === 'inline' || abs(cs) || boxy(cs)) return null
    if (textLeaf(d)) return d
    if (d.querySelector('svg, img') || box(d).height > 40) return null
    return [...d.querySelectorAll('*')].find((e) => textLeaf(e) && shown(e) && box(e).width >= 8) || null
  }
  const lead = (c) => max(0, (px(c.lineHeight) || px(c.fontSize) * 1.2) - px(c.fontSize)) / 2
  const firstText = (d) => gcs([d, ...d.querySelectorAll('*')].find((e) => [...e.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim())) || d)
  for (const n of all) {
    const ns = gcs(n)
    if (n.closest('svg, pre, code, [class*=logo], [class*=brand], [class*=wordmark]') || /flex/.test(ns.display) && /^row/.test(ns.flexDirection) || !meets(box(n))) continue
    const kids = [...n.children].map(leafOf), count = kids.filter(Boolean).length
    if (count < 2 || count > 3 || !shown(n)) continue
    for (let i = 1; i < kids.length; i++) {
      const a = kids[i - 1], b = kids[i]
      if (!a || !b) continue
      const ar = box(a), br = box(b), ca = firstText(a), cb = firstText(b), fa = px(ca.fontSize), fb = px(cb.fontSize)
      if (ar.width < 8 || br.width < 8 || br.top < ar.bottom - 1 || min(ar.right, br.right) - max(ar.left, br.left) < 8) continue
      if (fa === fb && ca.color === cb.color && ca.fontWeight === cb.fontWeight) continue
      const as = gcs(a), bs = gcs(b)
      const ink = r1(br.top + px(bs.paddingTop) + px(bs.borderTopWidth) - ar.bottom + px(as.paddingBottom) + px(as.borderBottomWidth) + lead(ca) + lead(cb))
      if (ink < 3 && fa < 24 && fb < 24) add('stack', 'tight-stack', a, { ink, below: name(b) })
      else if (ink > 10 && fa < 15 && fb < 15 && box(n).height < 80) add('stack', 'loose-stack', a, { ink, below: name(b) })
    }
  }

  // spacing-squeezed (film-checks.mjs:1245-1269); flex-shrink is set and restored synchronously.
  for (const n of all) {
    const p = n.parentElement, cs = gcs(n)
    if (!p || n.closest('svg') || n.matches('progress, meter, [role=progressbar], [role=meter]') || !/flex/.test(gcs(p).display)) continue
    if (cs.flexShrink === '0' || abs(cs) || !surf(cs, 1) || (n.textContent || '').trim().length > 3) continue
    const now = box(n)
    if (now.width < 8 || now.width > 120 || !meets(now) || !shown(n, 1)) continue
    const was = n.style.flexShrink
    n.style.flexShrink = '0'
    const full = box(n).width
    n.style.flexShrink = was
    if (full - now.width >= 1.5) add('squeezed', 'squeezed', n, { full: round(full), width: round(now.width) })
  }

  // spacing-spill, first branch of detectSpills (film-checks.mjs:2043-2077)
  for (const e of all) {
    const r = box(e), p = e.parentElement
    if (!(e instanceof HTMLElement) || r.height < 18 || r.height > 56 || r.width < 24 || !meets(r) || !p || p === root) continue
    if (!/^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test(e.tagName) && !/(^|[-_\s])(field|input|btn|button|control|chip|pill|search|select)/i.test(cls(e))) continue
    const es = gcs(e), pc = gcs(p), pr = box(p)
    if (abs(es) || !shown(e) || pc.overflowX !== 'visible' || /^(inline|contents)$/.test(pc.display) || pr.width < 24 || px(es.marginLeft) < 0 || px(es.marginRight) < 0) continue
    const over = max(r.right - pr.right, pr.left - r.left)
    if (over >= 3) add('spill', 'spills', e, { over: round(over), slot: tag(p) })
  }

  // spacing-clipped (film-checks.mjs:128-161)
  for (const n of all) {
    const tg = n.tagName.toLowerCase(), r = box(n), cs = gcs(n)
    if ((n.closest('svg') || n.children.length) && tg !== 'svg' || /^(img|video|picture|iframe)$/.test(tg) || /^(svg|canvas)$/.test(tg) && (r.width > 64 || r.height > 64)) continue
    if (r.width < 2 || r.height < 2 || !meets(r) || cs.visibility === 'hidden' || +cs.opacity === 0) continue
    for (let a = n.parentElement; a && a !== root; a = a.parentElement) {
      const o = gcs(a), c = box(a), cuts = []
      if (+o.opacity === 0 || o.textOverflow === 'ellipsis' || o.webkitLineClamp && o.webkitLineClamp !== 'none') break
      if (min(r.right, c.right) <= max(r.left, c.left) || min(r.bottom, c.bottom) <= max(r.top, c.top)) break
      if (/hidden|clip/.test(o.overflowX)) {
        if (r.left < c.left - .5 && c.left > 2) cuts.push(`esquerda ${round(c.left - r.left)}px`)
        if (r.right > c.right + .5 && c.right < W - 2) cuts.push(`direita ${round(r.right - c.right)}px`)
      }
      if (/hidden|clip/.test(o.overflowY)) {
        if (r.top < c.top - .5 && c.top > 2) cuts.push(`topo ${round(c.top - r.top)}px`)
        if (r.bottom > c.bottom + .5 && c.bottom < H - 2) cuts.push(`base ${round(r.bottom - c.bottom)}px`)
      }
      if (cuts.length) { add('clipped', 'clipped', n, { cuts: cuts.join(', '), by: tag(a) }); break }
      if (/auto|scroll/.test(o.overflowX + o.overflowY)) break
    }
  }

  const counts = {}
  return { findings: findings.filter((f) => (counts[f.rule] = (counts[f.rule] || 0) + 1) <= 5), counts }
}

const LABEL = {
  'spacing-inset': (f) => `texto a menos de 8px da borda do card (ex.: ${f.element}: ${f.gap}px à ${f.side} de ${f.card})`,
  'spacing-control': (f) => `botão a menos de 8px do que está acima (ex.: ${f.element}: ${f.gap}px sob ${f.above})`,
  'spacing-stack': (f) => `linhas ${f.check === 'tight-stack' ? 'coladas' : 'soltas'}, alvo de 4 a 6px de tinta (ex.: ${f.element}: ${f.ink}px até ${f.below})`,
  'spacing-touching': (f) => `texto encostado na caixa vizinha (ex.: ${f.element}: ${f.gap}px de ${f.neighbor})`,
  'spacing-padding': (f) => `recuo desigual (ex.: ${f.check} em ${f.element}: ${f.detail})`,
  'spacing-squeezed': (f) => `selo ou avatar espremido pela linha flex (ex.: ${f.element}: ${f.full}px viram ${f.width}px)`,
  'spacing-spill': (f) => `controle sai do espaço reservado (ex.: ${f.element}: ${f.over}px além de ${f.slot})`,
  'spacing-clipped': (f) => `peça cortada por overflow (ex.: ${f.element}: ${f.cuts} por ${f.by})`,
}

/** Runs auditSpacing in the page and returns {candidates: string[], evidence}. */
export async function inspectSpacing(page) {
  const evidence = await page.evaluate(auditSpacing)
  const candidates = Object.entries(LABEL).flatMap(([rule, label]) => {
    const first = evidence.findings.find((f) => f.rule === rule)
    return first ? [`${rule}: ${evidence.counts[rule]} × ${label(first)} (candidato)`] : []
  })
  return { candidates, evidence }
}

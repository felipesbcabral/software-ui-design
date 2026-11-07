// Candidate layout checks for inspect-ui.mjs (box constraints, not optical balance):
//   layout-fit     a control's content, padding and borders need more height than the control has
//   layout-edge    a control's content sits against one side with near-zero padding there and a real inset on the other
//   layout-bottom  a padded container's last child eats its bottom padding (fixed height, squeeze or clipping ancestor)
// Ported from benjitaylor/skills stageshow@299140f scripts/layout-core.mjs:3-135,159-164
// Copyright (c) 2026 Benji Taylor, MIT License (see references/stageshow-LICENSE.txt)
// Changes from upstream: runs on document.body of an ordinary app; drops nested-composition-crop and every .ss-* /
// [data-crop] stage selector; 2px fit tolerance instead of 1px (a Radix/shadcn outline button, h-9 py-2 text-sm plus a
// 1px border, loses 1px per side by design); findings are grouped into Portuguese candidate lines.
// auditLayout runs inside page.evaluate: it must stay self-contained (no closure over module scope).

export function auditLayout({ FIT_TOLERANCE }) {
  const root = document.body
  const findings = [], deferred = []
  const checked = { controls: 0, padded_containers: 0 }
  const px = (value) => parseFloat(value) || 0
  const round = (value) => Math.round(value * 100) / 100
  const name = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''
    const text = (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 30)
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : cls}${text ? ` "${text}"` : ''}`
  }
  const all = [root, ...root.querySelectorAll('*')]
  const animations = document.getAnimations().filter((a) => a.playState === 'running')
  const geometry = /^(?:transform|translate|rotate|scale|width|height|minWidth|maxWidth|minHeight|maxHeight|blockSize|inlineSize|gridTemplateRows|gridTemplateColumns|flexBasis|gap|rowGap|columnGap|padding.*|margin.*|top|left|right|bottom)$/
  // Only motion of this box or an ancestor: a spinning descendant cannot excuse a broken outer box.
  const moving = (el) => animations.some((a) => {
    const target = a.effect?.target
    return target instanceof Element && (target === el || target.contains(el)) &&
      a.effect.getKeyframes().some((frame) => Object.keys(frame).some((property) => geometry.test(property)))
  })
  // Visible inside the viewport, with nothing hidden or faded out on the way up.
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.right <= 0 || r.top >= innerHeight || r.left >= innerWidth) return false
    for (let a = el; a; a = a.parentElement) {
      const cs = getComputedStyle(a)
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < .05) return false
    }
    return true
  }
  const inFlow = (el, boundary) => {
    for (let a = el; a && a !== boundary; a = a.parentElement) if (['absolute', 'fixed'].includes(getComputedStyle(a).position)) return false
    return true
  }
  const control = (el) => el.matches('button, [role="button"], [data-layout-control]') ||
    typeof el.className === 'string' && el.className.split(/\s+/).some((cls) => /(?:^|[-_])(?:button|btn)(?:$|[-_])/.test(cls))
  // Computed sizes keep fractions (offsetHeight rounds them); sx/sy remove an axis-aligned transform scale.
  const metrics = (el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect()
    const w = px(cs.width) + (cs.boxSizing === 'border-box' ? 0 : px(cs.paddingLeft) + px(cs.paddingRight) + px(cs.borderLeftWidth) + px(cs.borderRightWidth))
    const h = px(cs.height) + (cs.boxSizing === 'border-box' ? 0 : px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth))
    return { cs, r, sx: w > 0 ? r.width / w : 1, sy: h > 0 ? r.height / h : 1, h: h || r.height }
  }
  const add = (rule, el, evidence) => findings.push({ rule, element: name(el), ...evidence })

  for (const el of all.filter(control)) {
    if (!visible(el)) continue
    if (moving(el)) { deferred.push(`${name(el)}: geometria do controle em movimento`); continue }
    const { cs, r, sx, sy, h } = metrics(el)
    if (cs.writingMode !== 'horizontal-tb') { deferred.push(`${name(el)}: escrita não horizontal`); continue }
    // A label trimmed to its letters (text-box-trim) is meant to be shorter than its line box.
    if (cs.textBoxTrim && cs.textBoxTrim !== 'none') continue
    const atoms = []
    let movingText = false
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    for (let text; (text = walker.nextNode());) {
      if (!text.textContent.trim() || !visible(text.parentElement) || !inFlow(text.parentElement, el)) continue
      movingText ||= moving(text.parentElement)
      const range = document.createRange(); range.selectNodeContents(text)
      const line = px(getComputedStyle(text.parentElement).lineHeight)
      for (const box of range.getClientRects()) {
        if (box.width < .1 || box.height < .1) continue
        const height = Math.max(box.height / sy, line)
        atoms.push({ left: box.left, right: box.right, top: (box.top + box.bottom) / 2 - height * sy / 2, bottom: (box.top + box.bottom) / 2 + height * sy / 2 })
      }
    }
    for (const child of el.querySelectorAll('svg, img, canvas')) {
      if (!visible(child) || !inFlow(child, el)) continue
      // A rotated glyph still occupies its authored layout box; its drawing envelope is a contour, not layout height.
      const box = child.getBoundingClientRect(), style = getComputedStyle(child)
      const height = px(style.height) + (style.boxSizing === 'border-box' ? 0 : px(style.paddingTop) + px(style.paddingBottom) + px(style.borderTopWidth) + px(style.borderBottomWidth))
      atoms.push({ left: box.left, right: box.right, top: (box.top + box.bottom - height * sy) / 2, bottom: (box.top + box.bottom + height * sy) / 2 })
    }
    if (!atoms.length) continue
    checked.controls++
    // Outgoing and incoming copies of a changing label may overlap: enforce the tallest line, defer the union.
    const contentHeight = movingText
      ? Math.max(...atoms.map((a) => (a.bottom - a.top) / sy))
      : (Math.max(...atoms.map((a) => a.bottom)) - Math.min(...atoms.map((a) => a.top))) / sy
    const top = px(cs.paddingTop), bottom = px(cs.paddingBottom)
    const borders = px(cs.borderTopWidth) + px(cs.borderBottomWidth)
    const needed = contentHeight + top + bottom + borders
    // A full line box must fit even when its ink looks optically centered.
    if (needed > h + FIT_TOLERANCE) add('layout-fit', el, { height: round(h), needed: round(needed), content: round(contentHeight), padding: [top, bottom], borders })
    if (movingText) { deferred.push(`${name(el)}: texto em movimento, laterais adiadas`); continue }
    const left = px(cs.paddingLeft), right = px(cs.paddingRight)
    const leftGap = (Math.min(...atoms.map((a) => a.left)) - r.left) / sx - px(cs.borderLeftWidth)
    const rightGap = (r.right - Math.max(...atoms.map((a) => a.right))) / sx - px(cs.borderRightWidth)
    // Narrow evidence: near-zero padding AND content against that edge, with a real inset at the opposite edge.
    // Optical 1-2px adjustments, icon-only buttons and asymmetric dropdown affordances pass.
    if ((left <= 1 && right >= 6 && leftGap <= 2 && rightGap >= 5) || (right <= 1 && left >= 6 && rightGap <= 2 && leftGap >= 5)) {
      add('layout-edge', el, { padding: [left, right], gaps: [round(leftGap), round(rightGap)] })
    }
  }

  for (const el of all) {
    if (!el.children.length || control(el) || el.matches('html, body')) continue
    const padding = px(getComputedStyle(el).paddingBottom)
    if (padding < 6 || !visible(el)) continue
    const { cs, r, sy } = metrics(el)
    if (cs.display === 'inline' || ['auto', 'scroll'].includes(cs.overflowY)) continue
    const children = [...el.children].filter((child) => visible(child) && inFlow(child, el))
    if (!children.length) continue
    const last = children.reduce((a, b) => a.getBoundingClientRect().bottom > b.getBoundingClientRect().bottom ? a : b)
    if (moving(el) || moving(last)) { deferred.push(`${name(el)}: base em movimento`); continue }
    // The closest clipping ancestor redefines the visible bottom; a scroll container ends the walk.
    let edge = r.bottom - px(cs.borderBottomWidth) * sy, boundary = el
    for (let a = el.parentElement; a && a !== root.parentElement; a = a.parentElement) {
      const ac = getComputedStyle(a)
      if (['auto', 'scroll'].includes(ac.overflowY)) break
      if (['hidden', 'clip'].includes(ac.overflowY)) {
        const lower = a.getBoundingClientRect().bottom - px(ac.borderBottomWidth) * metrics(a).sy
        if (lower < edge) { edge = lower; boundary = a }
      }
    }
    checked.padded_containers++
    const available = (edge - last.getBoundingClientRect().bottom) / sy
    if (available < padding - 2) add('layout-bottom', el, { padding_bottom: padding, available: round(available), boundary: name(boundary), last_child: name(last) })
  }
  const counts = {}
  for (const f of findings) counts[f.rule] = (counts[f.rule] || 0) + 1
  return { findings: findings.slice(0, 40), counts, checked, deferred: [...new Set(deferred)].slice(0, 20) }
}

const LABEL = {
  'layout-fit': (n, f) => `${n} controles com conteúdo, padding e borda maiores que a altura (ex.: ${f.element}: ${f.height}px, pede ${f.needed}px)`,
  'layout-edge': (n, f) => `${n} controles com conteúdo colado num lado (ex.: ${f.element}: ${f.gaps[0]}px à esquerda, ${f.gaps[1]}px à direita)`,
  'layout-bottom': (n, f) => `${n} contêineres perdem o padding de base (ex.: ${f.element}: sobram ${f.available}px de ${f.padding_bottom}px)`,
}

/** Runs auditLayout in the page and returns {candidates: string[], evidence}. */
export async function inspectLayout(page) {
  const evidence = await page.evaluate(auditLayout, { FIT_TOLERANCE: 2 })
  const candidates = Object.entries(LABEL).flatMap(([rule, label]) => {
    const first = evidence.findings.find((f) => f.rule === rule)
    return first ? [`${rule}: ${label(evidence.counts[rule], first)} (candidato)`] : []
  })
  return { candidates, evidence }
}

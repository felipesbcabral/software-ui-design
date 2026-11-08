// In-page recorder for inspect-motion.mjs: every visible box under the root, each animation frame, plus the pop and
// settle checks that need the live DOM. Runs inside page.evaluate: it must stay self-contained (no module scope).
// Ported from benjitaylor/skills stageshow@299140f scripts/jumps-core.mjs:13-86 (record) and
// scripts/motion-watch.mjs:184-454 (settle snap and pops)
// Copyright (c) 2026 Benji Taylor, MIT License (see references/stageshow-LICENSE.txt)
// Changes from upstream are listed in the header of inspect-motion.mjs.

export function recordMotion({ ROOT, ANCHOR, POPS }) {
  const root = document.querySelector(ROOT)
  const S = window.__inspectMotion = { frames: [], names: [], pops: [], settles: [], errors: [], stopped: false, triggerAt: null }
  if (!root) return false
  const ids = new WeakMap()
  const label = (el) => {
    const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''
    const role = el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : ''
    const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24)
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : cls}${role}${text ? ` "${text}"` : ''}`
  }
  const id = (el) => {
    let n = ids.get(el)
    if (n === undefined) { n = S.names.length; ids.set(el, n); S.names.push(label(el)) }
    return n
  }
  // What it is: kind, own words and, for a wordless mark, its drawing, so a swap of two identical boxes is not a pop.
  const sig = (el) => {
    const words = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c.textContent.trim()).join('').slice(0, 30)
    return `${el.tagName}.${typeof el.className === 'string' ? el.className : ''}|${words}|${words ? '' : el.innerHTML.slice(0, 400).replace(/\s+/g, '')}`
  }
  const kebab = (name) => name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
  const LAYOUT = /^(?:width|height|min-width|max-width|min-height|max-height|block-size|inline-size|grid-template-rows|grid-template-columns|flex-basis|gap|row-gap|column-gap|padding(?:-.+)?|margin(?:-.+)?|top|left|right|bottom|inset)$/
  const props = (a) => a.transitionProperty ? [a.transitionProperty] : [...new Set((a.effect?.getKeyframes?.() || []).flatMap((f) => Object.keys(f)))].map(kebab)
  // Only an entrance or exit counts as animating an appearance: a fade, a clip, a size opening. A move alone still pops.
  const entering = (a) => a.transitionProperty
    ? a.transitionProperty !== 'filter' && /opacity|clip|height|width|grid-template|filter/.test(a.transitionProperty)
    : props(a).some((p) => ['opacity', 'clip-path', 'height', 'width'].includes(p))
  const round = (v) => Math.round(v * 100) / 100
  let vis = new Map(), tiny = new Set(), popLast = -1, first = true
  const popNoted = new Set(), restAt = new Map(), settleNoted = new Set()

  const sample = () => {
    const now = performance.now(), W = innerWidth, H = innerHeight, sx = scrollX, sy = scrollY
    const animations = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target instanceof Element && root.contains(a.effect.target))
    const targets = new Set(animations.map((a) => a.effect.target))
    const busy = new Set(animations.filter(entering).map((a) => a.effect.target))
    const layoutRunning = animations.some((a) => props(a).some((p) => LAYOUT.test(p)))
    const up = (el, set) => { for (let a = el; a && a !== root.parentElement; a = a.parentElement) if (set.has(a)) return true; return false }
    const styles = new Map(), alpha = new Map(), clips = new Map()
    const style = (el) => { let s = styles.get(el); if (!s) { s = getComputedStyle(el); styles.set(el, s) } return s }
    // Opacity through every ancestor up to the root: a reset inside a faded-out parent is not seen.
    const opacity = (el) => {
      let o = alpha.get(el)
      if (o !== undefined) return o
      const s = style(el)
      o = (el === root ? 1 : opacity(el.parentElement)) * Number(s.opacity) * (s.visibility === 'hidden' ? 0 : 1)
      alpha.set(el, o)
      return o
    }
    const R = root.getBoundingClientRect(), rs = style(root)
    const clipsRoot = rs.overflowX !== 'visible' || rs.overflowY !== 'visible'
    const rootClip = { l: Math.max(0, clipsRoot ? R.left : 0), t: Math.max(0, clipsRoot ? R.top : 0), r: Math.min(W, clipsRoot ? R.right : W), b: Math.min(H, clipsRoot ? R.bottom : H) }
    // The box an element is clipped to by its ancestors (an item slid out of its window has left view).
    const clip = (el) => {
      if (el === root) return rootClip
      let c = clips.get(el)
      if (c) return c
      const pc = clip(el.parentElement), s = style(el)
      if (s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.clipPath !== 'none') {
        const b = el.getBoundingClientRect()
        c = { l: Math.max(pc.l, b.left), t: Math.max(pc.t, b.top), r: Math.min(pc.r, b.right), b: Math.min(pc.b, b.bottom) }
      } else c = pc
      clips.set(el, c)
      return c
    }
    const items = [], cur = new Map(), tinyNow = new Set(), seen = new Map()
    for (const el of root.querySelectorAll('*')) {
      if (el.parentElement?.closest('svg')) continue
      const r = el.getBoundingClientRect()
      if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.right <= 0 || r.top >= H || r.left >= W) continue
      if (el.closest('[data-snap]')) continue
      const o = opacity(el)
      if (o <= 0.02) continue
      const s = style(el), area = r.width * r.height
      const anchor = el.matches(ANCHOR)
      if (area >= 16) {
        // A wrapper that paints nothing and clips nothing cannot be seen to jump: only what it holds can.
        const paints = (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || s.backgroundImage !== 'none' ||
          parseFloat(s.borderTopWidth) + parseFloat(s.borderBottomWidth) + parseFloat(s.borderLeftWidth) + parseFloat(s.borderRightWidth) > 0 ||
          s.boxShadow !== 'none' || s.overflowX !== 'visible' || s.overflowY !== 'visible'
        const ownText = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())
        if (anchor || paints || ownText || !el.children.length || el.tagName.toLowerCase() === 'svg') {
          const sib = el.nextElementSibling
          const flow = (e) => !/absolute|fixed/.test(style(e).position)
          items.push([id(el), round(r.left + sx), round(r.top + sy), round(r.width), round(r.height),
            el.parentElement ? id(el.parentElement) : -1, sib && flow(el) && flow(sib) ? id(sib) : -1,
            anchor && el instanceof HTMLElement ? el.offsetHeight : -1])
        }
      }
      if (POPS && o >= 0.5) {
        if (area < 36) tinyNow.add(el)
        else {
          const pc = clip(el.parentElement)
          const inside = Math.max(0, Math.min(r.right, pc.r) - Math.max(r.left, pc.l)) * Math.max(0, Math.min(r.bottom, pc.b) - Math.max(r.top, pc.t))
          cur.set(el, { o, r, sc: el instanceof HTMLElement && el.offsetWidth ? r.width / el.offsetWidth : 1, busy: up(el, busy), parent: el.parentElement, out: inside < area * 0.5 })
        }
      }
      if (o >= 0.5 && r.width >= 4 && r.height >= 4 && r.width <= 500 && r.height <= 500) seen.set(el, { x: r.left + sx, y: r.top + sy, w: r.width, h: r.height })
    }
    S.frames.push({ t: now, items })

    // Settle: at rest after motion, an element must not shift with nothing animating.
    for (const el of [...restAt.keys()]) if (!seen.has(el)) restAt.delete(el)
    for (const [el, r] of seen) {
      const prev = restAt.get(el)
      const running = layoutRunning || up(el, targets)
      if (!prev) { restAt.set(el, { r, still: 0, moved: running ? now : -1e9, lastAnim: running ? now : -1e9 }); continue }
      const moved = Math.max(Math.abs(r.x - prev.r.x), Math.abs(r.y - prev.r.y), Math.abs(r.w - prev.r.w), Math.abs(r.h - prev.r.h))
      if (running) prev.lastAnim = now
      if (moved < 0.01) prev.still++
      else {
        if (moved >= 0.5 && !running && now - prev.lastAnim > 20 && prev.still >= 2 && now - prev.moved < 1000) {
          const name = label(el)
          if (!settleNoted.has(name)) { settleNoted.add(name); S.settles.push({ element: name, px: round(moved), t: now }) }
        }
        prev.still = 0
        if (running) prev.moved = now
      }
      prev.r = r
    }

    // Pops: shown or gone between two frames at full opacity and size, with nothing animating it or its ancestors.
    if (!POPS) return
    const late = popLast > 0 && now - popLast > 40
    popLast = now
    if (!first && !late) {
      const name = (el) => label(el)
      const paints = (el) => {
        if (!el.children.length) return 1
        let most = 0
        const walk = (n, o) => {
          for (const c of n.children) {
            const co = o * Number(getComputedStyle(c).opacity)
            if (!c.children.length || [...c.childNodes].some((t) => t.nodeType === 3 && t.textContent.trim())) most = Math.max(most, co)
            if (c.children.length && most < 0.9) walk(c, co)
          }
        }
        walk(el, 1)
        return most
      }
      const near = (a, b) => Math.abs(a.left + a.width / 2 - b.left - b.width / 2) < 40 && Math.abs(a.top + a.height / 2 - b.top - b.height / 2) < 40 && Math.abs(a.width - b.width) < Math.max(a.width, b.width) * 0.35
      const left = [...vis].filter(([el]) => !cur.has(el)), came = [...cur].filter(([el]) => !vis.has(el))
      const sigs = new Map()
      const sigOf = (el) => { if (!sigs.has(el)) sigs.set(el, sig(el)); return sigs.get(el) }
      for (const [el, c] of came) {
        if (cur.has(c.parent) && !vis.has(c.parent)) continue
        if (c.out || tiny.has(el) || c.o < 0.9 || c.sc < 0.95 || c.busy) continue
        if (el.getAnimations({ subtree: true }).some((a) => a.playState === 'running' && entering(a)) || paints(el) < 0.9) continue
        if (left.some(([g, v]) => sigOf(g) === sigOf(el) && near(v.r, c.r))) continue
        // Shown under a surface that covers it is not seen popping.
        const top = getComputedStyle(el).pointerEvents === 'none' ? null : document.elementFromPoint(c.r.left + c.r.width / 2, c.r.top + c.r.height / 2)
        if (top && !el.contains(top) && !top.contains(el)) continue
        const key = 'in' + name(el)
        if (popNoted.has(key)) continue
        popNoted.add(key)
        S.pops.push({ kind: 'in', element: name(el), t: now })
      }
      for (const [el, g] of left) {
        if (vis.has(g.parent) && !cur.has(g.parent)) continue
        if (g.out || g.sc < 0.95 || tinyNow.has(el) || g.o < 0.9 || g.busy) continue
        if (came.some(([c, v]) => sigOf(c) === sigOf(el) && near(g.r, v.r))) continue
        const key = 'out' + name(el)
        if (popNoted.has(key)) continue
        popNoted.add(key)
        S.pops.push({ kind: 'out', element: name(el), t: now })
      }
    }
    first = false
    vis = cur
    tiny = tinyNow
  }
  const tick = () => {
    if (S.stopped || !root.isConnected || S.frames.length > 3600) return
    try { sample() } catch (error) { S.errors.push(`recorder: ${error.message}`); return }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  return true
}

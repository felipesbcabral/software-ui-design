// Candidate motion checks for inspect-ui.mjs, opt-in with --motion <ms>. A trigger (mock states.X.trigger, a function
// or a selector to click, or --motion-trigger) runs while every visible box under --motion-root is recorded each
// animation frame, with the CSS/WAAPI timeline slowed to 0.25x over CDP so a 160-200 ms transition spans enough frames:
//   motion-jump      a box moves or resizes more than 2px in one frame while it was calm the frames around it
//   motion-drift     two stacked neighbors that keep their size glide out of step (their gap wobbles for many frames)
//   motion-anchor    an open dialog, menu, listbox or popover changes height while both its edges move (re-centering)
//   motion-pop       an element appears or disappears at full size and opacity in one frame, nothing animating it
//   motion-settle    an element comes to rest after animating, then shifts with nothing running
//   motion-coverage  too few or too sparse frames to judge: inconclusive, not a defect
// Ported from benjitaylor/skills stageshow@299140f scripts/jumps-core.mjs:13-176, scripts/verification.mjs:48-63,
// scripts/motion-watch.mjs:184-454
// Copyright (c) 2026 Benji Taylor, MIT License (see references/stageshow-LICENSE.txt)
// Changes from upstream:
// - One root (any selector, default body) recorded from just before the trigger, instead of visibleStages() discovery of
//   .ss-stage elements; every .ss-* exclusion (cursor, caret, camera, roll, fly, keys, typing) is dropped, [data-snap]
//   stays. Only boxes that intersect the viewport are recorded; the viewport is the outer clip for pops. Coordinates are
//   page coordinates, so a window scroll is not a jump. SVG descendants are not recorded (the svg box is).
// - Anchor surfaces come from ANCHOR (roles, [popover], Radix/cmdk wrappers) instead of /^ss-(popover|menu|sheet)/, and are
//   recorded even when they paint nothing (the Radix popper wrapper). Anchor drift needs BOTH edges to move while the
//   layout height (offsetHeight) changes: a bottom sheet or a popover flipped above its trigger is pinned by its bottom,
//   and a scale or slide entrance is not a height change. This replaces upstream's 30-frame guard with 4 frames.
// - Boxes present in the first frame count as long-lived for drift; upstream's 45-frame guard applies to arrivals only.
//   The drift gap threshold (1px) and run length (4 frames) are scaled by the playback rate, so 0.25x judges the same
//   speed difference upstream judges at 1x.
// - Settle: upstream's carriedByFlow sibling exemption is replaced by a coarser rule: while any layout animation (width,
//   height, margin, padding, gap, grid tracks, inset) runs inside the root, every box counts as animated. Fewer false
//   settle snaps; a snap that lands during another layout animation is missed.
// - Jumps are judged per elapsed time: identical to upstream on even frames, but a late frame (up to 4 typical frames) is
//   compared with what the neighbor speed covers in its gap instead of being skipped, so a stall on the click frame
//   does not hide the jump. Drift and anchor still skip late frames.
// - Coverage: one late frame does not make the run inconclusive; more than 10% late intervals does. A missing root or a
//   failed trigger is also inconclusive.
// - Times are product time in seconds from the trigger (wall time x playback rate).
// - Playback rate: CDP slows only the document timeline. JS timers and rAF tweens (setTimeout unmount, GSAP, Framer
//   Motion's non-WAAPI path) keep full speed and are invisible to getAnimations(), so they can produce a false
//   motion-pop or motion-settle; a timer that unmounts after the CSS duration fires early against the slowed exit.
// Not ported: hard edge, steps in its box, fly size, lands on a transform, appears then moves, handoff shift, near-empty
// frames, dashed edge resizes and same-box content change (demo-specific or manual-review notes, not candidates here).
// The in-page recorder lives in inspect-motion-record.mjs (split for the 20,000-byte per-file commit cap).

import { recordMotion } from './inspect-motion-record.mjs'

export const RATE = 0.25
const BASELINE_MS = 150
export const ANCHOR = '[role="dialog"],[role="alertdialog"],[role="menu"],[role="listbox"],[role="tooltip"],[popover],dialog[open],[data-radix-popper-content-wrapper],[cmdk-root]'

/** Jumps, drift and anchor drift from recorded frames (items: [id, x, y, w, h, parent, next, layoutHeight]). */
export function analyseFrames(frames, names, { rate = 1, triggerAt = 0 } = {}) {
  const at = frames.map((f) => new Map(f.items.map((i) => [i[0], i])))
  const dts = frames.slice(1).map((fr, i) => fr.t - frames[i].t).sort((a, b) => a - b)
  const frameMs = dts[Math.floor(dts.length / 2)] || 16.7
  // A late frame carries several frames of gliding at once: frames around a stall are not judged.
  const late = (f) => f > 0 && frames[f].t - frames[f - 1].t > frameMs * 1.6
  const time = (t) => Math.round((t - triggerAt) * rate) / 1000
  // Jump: the step into frame f against the speed of the steps around it, per elapsed time. With even frames this is
  // upstream's rule (|d| > 3 x the calmer of the neighbor steps, floor 0.4px); a late frame is judged against what the
  // neighbor speed could cover in its gap instead of being skipped, up to 4 typical frames.
  const gap = (f) => frames[f].t - frames[f - 1].t
  const found = new Map()
  for (let f = 2; f < frames.length - 1; f++) {
    if (gap(f - 1) > frameMs * 4 || gap(f) > frameMs * 4 || gap(f + 1) > frameMs * 4) continue
    for (const [n, it] of at[f]) {
      const a = at[f - 2].get(n), b = at[f - 1].get(n), c = at[f + 1].get(n)
      if (!a || !b || !c) continue
      for (const [axis, i] of [['x', 1], ['y', 2], ['width', 3], ['height', 4]]) {
        const d = it[i] - b[i]
        const calm = Math.max(Math.abs(b[i] - a[i]) / gap(f - 1), Math.abs(c[i] - it[i]) / gap(f + 1), 0.4 / frameMs) * gap(f)
        if (Math.abs(d) > 2 && Math.abs(d) > 3 * calm) {
          const key = `${n}:${axis}`, prev = found.get(key)
          if (prev) prev.count++
          else found.set(key, { id: n, parent: it[5], at: frames[f].t, element: names[n], axis, delta: Math.round(d * 10) / 10, count: 1,
            track: [a, b, it, c].map((x, k) => [time(frames[f - 2 + k].t), ...x.slice(1, 5)]) })
        }
      }
    }
  }
  // A parent's jump drags its children with it: report the outermost only.
  const jumps = []
  for (const l of [...found.values()].sort((p, q) => p.at - q.at)) {
    if (jumps.some((s) => s.id === l.parent && Math.abs(s.at - l.at) < 40 && s.axis === l.axis && Math.abs(s.delta - l.delta) < 0.6)) continue
    jumps.push(l)
  }
  // Drift: two in-flow siblings that keep their size should keep their gap; a wobbling gap means two curves.
  const born = new Map()
  frames.forEach((fr, f) => fr.items.forEach((i) => born.has(i[0]) || born.set(i[0], f)))
  const settled = (n, f) => born.get(n) === 0 || f - born.get(n) >= 45
  const drift = new Map()
  for (let f = 1; f < frames.length; f++) {
    if (late(f)) continue
    for (const [n, it] of at[f]) {
      const nx = it[6] >= 0 ? at[f].get(it[6]) : null
      const pa = at[f - 1].get(n), pb = nx && at[f - 1].get(nx[0])
      if (!nx || !pa || !pb || !settled(n, f) || !settled(nx[0], f)) continue
      const held = Math.abs(it[4] - pa[4]) < 0.3 && Math.abs(nx[4] - pb[4]) < 0.3
      const dg = nx[2] - (it[2] + it[4]) - (pb[2] - (pa[2] + pa[4]))
      if (!held || Math.abs(dg) <= 1 * rate) continue
      const key = `${n}>${nx[0]}`
      const d = drift.get(key) ?? { rule: 'motion-drift', at: frames[f].t, element: names[n], neighbor: names[nx[0]], max: 0, count: 0 }
      d.max = Math.max(d.max, Math.abs(dg))
      d.count++
      drift.set(key, d)
    }
  }
  const drifts = [...drift.values()].filter((d) => d.count >= Math.ceil(4 / rate)).map((d) => ({ ...d, max: Math.round(d.max * 100) / 100, t: time(d.at) }))
  // Anchor drift: an open surface whose height changes while neither its top nor its bottom edge holds.
  const anchored = new Map()
  for (let f = 1; f < frames.length; f++) {
    if (late(f)) continue
    for (const [n, it] of at[f]) {
      if (it[7] < 0 || (born.get(n) > 0 && f - born.get(n) < 4)) continue
      const p = at[f - 1].get(n)
      if (!p || p[7] < 0) continue
      const top = it[2] - p[2], bottom = it[2] + it[4] - (p[2] + p[4]), dh = it[7] - p[7]
      if (Math.abs(dh) < 0.3 || Math.abs(top) < 0.3 || Math.abs(bottom) < 0.3) continue
      const a = anchored.get(n) ?? { rule: 'motion-anchor', at: frames[f].t, element: names[n], top: 0, bottom: 0, height: 0, count: 0 }
      a.top += top; a.bottom += bottom; a.height += dh; a.count++
      anchored.set(n, a)
    }
  }
  const anchors = [...anchored.values()].filter((a) => Math.abs(a.top) >= 1 && Math.abs(a.bottom) >= 1)
    .map((a) => ({ ...a, top: Math.round(a.top * 10) / 10, bottom: Math.round(a.bottom * 10) / 10, height: Math.round(a.height), t: time(a.at) }))
  return {
    jumps: jumps.map(({ id, parent, at, ...j }) => ({ rule: 'motion-jump', ...j, t: time(at) })),
    drifts: drifts.map(({ at, ...d }) => d),
    anchors: anchors.map(({ at, ...a }) => a),
  }
}

/** Whether the recording can support a verdict (upstream coverage(), tolerant of a few late frames). */
export function motionCoverage(frames, { requestedMs = 0, triggerAt = 0, errors = [] } = {}) {
  const intervals = frames.slice(1).map((frame, i) => frame.t - frames[i].t)
  const sorted = intervals.filter((ms) => ms > 0 && Number.isFinite(ms)).sort((a, b) => a - b)
  const medianMs = sorted[Math.floor(sorted.length / 2)] || 16.7
  const late = intervals.filter((ms) => ms > medianMs * 1.6)
  const after = frames.filter((f) => f.t >= triggerAt)
  const durationMs = after.length > 1 ? after.at(-1).t - triggerAt : 0
  const reasons = [...errors]
  if (frames.length < 4) reasons.push(`só ${frames.length} quadros gravados`)
  if (requestedMs && durationMs + Math.max(100, medianMs * 3) < requestedMs) reasons.push(`gravou ${Math.round(durationMs)}ms dos ${Math.round(requestedMs)}ms pedidos`)
  if (intervals.length && late.length > intervals.length * 0.1) reasons.push(`${late.length} de ${intervals.length} intervalos acima de ${Math.round(medianMs * 1.6)}ms`)
  if (medianMs > 40) reasons.push(`intervalo típico de ${Math.round(medianMs)}ms, esparso demais para movimento curto`)
  if (intervals.some((ms) => !Number.isFinite(ms) || ms <= 0)) reasons.push('tempos de quadro inválidos')
  if (frames.length && !frames.some((frame) => frame.items.length)) reasons.push('nenhum elemento visível amostrado')
  return { status: reasons.length ? 'inconclusive' : 'complete', frames: frames.length, duration_ms: Math.round(durationMs), median_ms: Math.round(medianMs * 10) / 10, late_frames: late.length, reasons }
}

const LABEL = {
  'motion-jump': (n, f) => `${n} saltos de mais de 2px num quadro (ex.: ${f.element}, ${f.axis} ${f.delta > 0 ? '+' : ''}${f.delta}px em ${f.t}s)`,
  'motion-drift': (n, f) => `${n} pares de vizinhos deslizam fora de passo (ex.: ${f.element} e ${f.neighbor}, folga muda até ${f.max}px por quadro)`,
  'motion-anchor': (n, f) => `${n} superfícies abertas mudam de altura sem segurar a borda (ex.: ${f.element}, topo ${f.top}px e base ${f.bottom}px com altura ${f.height > 0 ? '+' : ''}${f.height}px)`,
  'motion-pop': (n, f) => `${n} elementos ${f.kind === 'in' ? 'surgem' : 'somem'} sem animação num quadro (ex.: ${f.element} em ${f.t}s)`,
  'motion-settle': (n, f) => `${n} elementos param e depois saltam sem transição (ex.: ${f.element}, ${f.px}px em ${f.t}s)`,
}

/** Builds the candidate lines and evidence from a raw recording; pure, so it is testable without a browser. */
export function summarizeMotion(raw, { rate = 1, requestedMs = 0, pops = true } = {}) {
  const { frames, names } = raw
  const triggerAt = raw.triggerAt ?? frames[0]?.t ?? 0
  const time = (t) => Math.round((t - triggerAt) * rate) / 1000
  const { jumps, drifts, anchors } = analyseFrames(frames, names, { rate, triggerAt })
  const findings = [...jumps, ...drifts, ...anchors,
    ...(raw.pops || []).map((p) => ({ rule: 'motion-pop', kind: p.kind, element: p.element, t: time(p.t) })),
    ...(raw.settles || []).map((s) => ({ rule: 'motion-settle', element: s.element, px: s.px, t: time(s.t) }))]
  const coverage = motionCoverage(frames, { requestedMs: requestedMs / rate, triggerAt, errors: raw.errors || [] })
  const counts = {}
  for (const f of findings) counts[f.rule] = (counts[f.rule] || 0) + 1
  const candidates = Object.entries(LABEL).flatMap(([rule, label]) => {
    const first = findings.find((f) => f.rule === rule)
    return first ? [`${rule}: ${label(counts[rule], first)} (candidato)`] : []
  })
  if (coverage.status !== 'complete') candidates.push(`motion-coverage: gravação inconclusiva, não é defeito (${coverage.reasons.join('; ')}) (candidato)`)
  return { candidates, evidence: { frames: frames.length, rate, pops_checked: pops, coverage, counts, findings: findings.slice(0, 40) } }
}

/**
 * Records the motion of one trigger and returns {candidates: string[], evidence}.
 * trigger: async ({page, context, state, rate}) => void, or a selector clicked once; omitted, the window is recorded idle.
 */
export async function inspectMotion(page, { ms, root = 'body', trigger, pops = true, context, state, rate = RATE }) {
  const errors = []
  let cdp = null
  try {
    cdp = await page.context().newCDPSession(page)
    await cdp.send('Animation.enable')
    await cdp.send('Animation.setPlaybackRate', { playbackRate: rate })
  } catch (error) {
    errors.push(`velocidade de reprodução indisponível: ${error.message.split('\n')[0]}`)
    rate = 1
  }
  let raw = { frames: [], names: [], errors: [] }
  try {
    if (typeof trigger === 'string') await page.locator(trigger).first().scrollIntoViewIfNeeded().catch(() => {})
    if (await page.evaluate(recordMotion, { ROOT: root, ANCHOR, POPS: pops })) {
      await page.waitForTimeout(BASELINE_MS)
      await page.evaluate(() => { window.__inspectMotion.triggerAt = performance.now() })
      const start = Date.now()
      try {
        if (typeof trigger === 'function') await trigger({ page, context, state, rate })
        else if (trigger) await page.locator(trigger).first().click()
      } catch (error) { errors.push(`gatilho falhou: ${error.message.split('\n')[0]}`) }
      await page.waitForTimeout(Math.max(0, ms / rate - (Date.now() - start)))
    } else errors.push(`--motion-root ${root} não encontrado`)
    raw = await page.evaluate(() => {
      const s = window.__inspectMotion
      s.stopped = true
      delete window.__inspectMotion
      return s
    })
  } finally {
    if (cdp) await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 }).then(() => cdp.send('Animation.disable')).then(() => cdp.detach()).catch(() => {})
  }
  const result = summarizeMotion({ ...raw, errors: [...errors, ...raw.errors] }, { rate, requestedMs: ms, pops })
  result.evidence.trigger = typeof trigger === 'function' ? 'function' : trigger || null
  result.evidence.root = root
  return result
}

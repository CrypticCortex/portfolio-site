// Everything that moves on the map, outside React: the layout physics, a camera, and the canvas under the words
// (orbits, curved connections, signals travelling them, sonar pings, halos). The words are DOM buttons; the
// engine only places them and sets their state. Every colour is read from the CSS tokens.

export const STEP = 760; // ms a thought's spark takes to cross one connection

const RING = { self: 0, theme: 190, role: 300, project: 330, paper: 420, tool: 470 };
const SPRING = { theme: 170, role: 130, project: 120, paper: 100, tool: 85 };
const ORBITS = [118, 252, 382, 500]; // faint orbits drawn between the rings the words sit on
const TRAVEL = 950; // ms a newborn word takes to travel out to its place
const BIRTH = [60, 380, 860, 1320], SWEEP = [0, 420, 480, 520]; // by depth from the centre: start, clockwise spread

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - (1 - t) ** 4;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const glowOf = (type) => (type === 'tool' ? 'self' : type); // grey tools glow cream

function rgb(value) {
  const h = value.trim().replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a <= 0 ? 0 : a >= 1 ? 1 : a.toFixed(3)})`;

// a soft round light; `core` adds a hot centre for travelling signals
function sprite(c, spark, core) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const g = cv.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  if (core) { gr.addColorStop(0, rgba(spark, 1)); gr.addColorStop(0.16, rgba(c, 0.9)); gr.addColorStop(0.45, rgba(c, 0.22)); }
  else { gr.addColorStop(0, rgba(c, 0.55)); gr.addColorStop(0.5, rgba(c, 0.18)); }
  gr.addColorStop(1, rgba(c, 0));
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return cv;
}

export function createMind({ wrap, canvas, els, panel, nodes, edges, byId, neighbours, live, reduce, onDragged }) {
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(wrap);
  const tok = (name) => rgb(css.getPropertyValue(name));
  const C = { cream: tok('--cream'), marigold: tok('--marigold'), coral: tok('--coral'), lilac: tok('--lilac'), muted: tok('--muted'), spark: tok('--spark') };
  const KC = { self: C.cream, role: C.cream, theme: C.marigold, project: C.coral, paper: C.lilac, tool: C.muted };
  const SPARK = {}, HALO = {};
  for (const k of Object.keys(KC)) { SPARK[k] = sprite(KC[glowOf(k)], C.spark, true); HALO[k] = sprite(KC[glowOf(k)], C.spark, false); }

  const N = nodes.length;
  const ids = nodes.map((n) => n.id), type = nodes.map((n) => n.type);
  const idx = Object.fromEntries(ids.map((id, i) => [id, i]));
  const edgeOf = new Map();
  const incident = ids.map(() => []);
  edges.forEach(([a, b], i) => { edgeOf.set(a + '|' + b, i); edgeOf.set(b + '|' + a, i); incident[idx[a]].push(i); incident[idx[b]].push(i); });
  const sway = edges.map((_, i) => (i * 2.399) % (Math.PI * 2));

  let W = 0, H = 0, dpr = 1, s = 1, ax = 1.4, cx0 = 0, cy0 = 0, wide = true, raf = 0;
  const cap = { half: 0, raise: 0 }; // the thought caption at the bottom centre: its half width, how far it rises past the bottom wall (world units)

  // ---- layout: seeded by meaning, settled by a small force simulation ---------------------------------------
  const P = {}; // id → { x, y, vx, vy, hw, hh (world units), bw, bh (half size in px), phase }
  const ring = (t, a) => ({ x: Math.cos(a) * RING[t] * ax, y: Math.sin(a) * RING[t] });
  const angleOf = (list) => { let x = 0, y = 0; list.forEach((id) => { if (P[id]) { x += P[id].x / ax; y += P[id].y; } }); return Math.atan2(y, x); };
  const body = (pos, i) => ({ ...pos, vx: 0, vy: 0, hw: 30, hh: 10, bw: 30, bh: 10, phase: i * 1.7 });
  P.kalyan = { ...body({ x: 0, y: 0 }, 0), hw: 80, hh: 30 };
  const of = (t) => nodes.filter((n) => n.type === t);
  of('theme').forEach((n, i, all) => { P[n.id] = body(ring('theme', (i / all.length) * Math.PI * 2 - Math.PI / 2), i); });
  of('role').forEach((n, i) => { P[n.id] = body(ring('role', angleOf([...neighbours[n.id]]) + 0.35), i); });
  for (const t of ['project', 'paper', 'tool']) of(t).forEach((n, i) => { P[n.id] = body(ring(t, angleOf([...neighbours[n.id]]) + ((i % 3) - 1) * 0.18), i); });

  const measure = () => {
    for (const id of ids) {
      const el = els[id], p = P[id];
      if (el) { p.bw = el.offsetWidth / 2; p.bh = el.offsetHeight / 2; p.hw = p.bw / s; p.hh = p.bh / s; }
    }
  };
  const resize = () => {
    W = wrap.clientWidth; H = wrap.clientHeight; dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    wide = W > 760;
    const usableW = W - (wide ? 140 : 20), usableH = H - (wide ? 170 : 230);
    const nextAx = Math.max(0.5, Math.min(1.8, usableW / usableH));
    for (const id in P) P[id].x *= nextAx / ax; // keep the layout's shape when the screen changes
    ax = nextAx; s = usableH / 1000;
    cx0 = W / 2; cy0 = H / 2 + (wide ? 10 : -40);
    const top = H - (wide ? Math.min(92, Math.max(64, H * 0.09)) : 76) - (wide ? 96 : 84);
    cap.half = (Math.min(736, W - 32) / 2) / s; cap.raise = Math.max(0, H - (wide ? 128 : 150) - top) / s;
    wrap.style.setProperty('--s', Math.max(0.42, s).toFixed(3));
    measure();
  };

  let drag = null;
  const step = (moving, L) => {
    // a soft charge keeps words apart; overlapping label boxes are pushed out along the shallower axis
    for (let i = 0; i < N; i++) {
      const a = P[ids[i]];
      for (let j = i + 1; j < N; j++) {
        const b = P[ids[j]];
        const dx = b.x - a.x, dy = b.y - a.y;
        const ex = dx / ax, d2 = ex * ex + dy * dy || 0.01, d = Math.sqrt(d2), f = Math.min(3, 6000 / d2);
        a.vx -= (ex / d) * f * ax; a.vy -= (dy / d) * f; b.vx += (ex / d) * f * ax; b.vy += (dy / d) * f;
        const ox = a.hw + b.hw + 10 - Math.abs(dx), oy = a.hh + b.hh + 6 - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          const k = i === 0 ? 2 : 1; // the centre word (index 0) is pinned, so its neighbour takes the whole push
          if (ox / (a.hw + b.hw) < oy / (a.hh + b.hh)) { const p = (dx < 0 ? -1 : 1) * ox * 0.25; a.vx -= p; b.vx += p * k; }
          else { const p = (dy < 0 ? -1 : 1) * oy * 0.25; a.vy -= p; b.vy += p * k; }
        }
      }
    }
    // springs along every edge; a focused word pulls its neighbours in
    const focus = L && L.mode === 'focus' ? L.focus : null;
    for (const [ia, ib] of edges) {
      const a = P[ia], b = P[ib], ta = byId[ia].type, tb = byId[ib].type;
      let rest = SPRING[ta === 'self' ? tb : tb === 'self' ? ta : ta === 'tool' || tb === 'tool' ? 'tool' : ta === 'paper' || tb === 'paper' ? 'paper' : 'project'];
      let k = 0.008;
      if (focus && (ia === focus || ib === focus)) { rest *= 0.85; k *= 1.5; }
      let dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.01, f = (d - rest) * k;
      dx /= d; dy /= d;
      a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f;
    }
    // each kind keeps to its ring; a slow breath; damping; the centre word, a dragged word and the word under
    // the pointer stay put
    const held = drag ? drag.id : live.current.hover;
    let mx = 0, my = 0;
    for (const n of nodes) {
      const p = P[n.id];
      if (n.type === 'self') { p.x = 0; p.y = 0; p.vx = p.vy = 0; continue; }
      const ex = p.x / ax, d = Math.hypot(ex, p.y) || 0.01, f = (RING[n.type] - d) * 0.03;
      p.vx += (ex / d) * f * ax; p.vy += (p.y / d) * f;
      if (moving) { p.vx += Math.sin(ac / 2400 + p.phase) * 0.025; p.vy += Math.cos(ac / 2900 + p.phase) * 0.025; }
      if (drag && drag.id === n.id) { p.x = drag.x; p.y = drag.y; p.vx = p.vy = 0; continue; }
      if (held === n.id) { p.vx = p.vy = 0; continue; }
      p.vx *= 0.8; p.vy *= 0.8;
      p.x += Math.max(-20, Math.min(20, p.vx)); p.y += Math.max(-20, Math.min(20, p.vy));
      mx += p.x; my += p.y;
    }
    // keep the whole map balanced round the centre word, and every word on screen
    mx /= N - 1; my /= N - 1;
    for (const n of nodes) {
      if (n.type === 'self' || n.id === held) continue;
      const p = P[n.id];
      p.x -= mx * 0.1; p.y -= my * 0.1;
      const x0 = (-W / 2 + 10) / s + p.hw, x1 = (W / 2 - 10) / s - p.hw;
      // the caption owns the bottom strip, and the floor rises smoothly where a two-line thought sits
      const e = clamp01((Math.abs(p.x) - cap.half) / (140 / s)), bump = cap.raise * (1 - e * e * (3 - 2 * e));
      const y0 = (56 - cy0) / s + p.hh, y1 = (H - (wide ? 128 : 150) - cy0) / s - p.hh - bump;
      if (p.x < x0) p.x += (x0 - p.x) * 0.5; else if (p.x > x1) p.x -= (p.x - x1) * 0.5;
      if (p.y < y0) p.y += (y0 - p.y) * 0.5; else if (p.y > y1) p.y -= (p.y - y1) * 0.5;
    }
  };

  // ---- birth order: outward from the centre, ring by ring, sweeping clockwise from the top ------------------
  const parent = {}, depth = { kalyan: 0 }, order = ['kalyan'];
  for (let q = 0; q < order.length; q++) {
    const id = order[q];
    [...neighbours[id]].sort((a, b) => RING[byId[a].type] - RING[byId[b].type]).forEach((nb) => {
      if (depth[nb] === undefined) { depth[nb] = depth[id] + 1; parent[nb] = id; order.push(nb); }
    });
  }
  ids.forEach((id) => { if (depth[id] === undefined) { depth[id] = 3; parent[id] = 'kalyan'; order.push(id); } });
  const sweepOf = (id) => { const a = Math.atan2(P[id].y, P[id].x / ax) + Math.PI / 2; return (((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI); };
  const born = new Float64Array(N), isBorn = new Uint8Array(N);
  let entering = !reduce, entranceEnd = 0;

  // ---- camera: eases toward whatever is being looked at ------------------------------------------------------
  const cam = { z: 1, ox: 0, oy: 0 };
  let pbox = null;
  const panelBox = () => {
    const el = panel.current;
    if (!el) return null;
    const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    return { left: r.left - w.left, top: r.top - w.top };
  };
  const camTarget = () => {
    const { open } = live.current;
    if (open && P[open]) { // frame the opened word in the space the panel leaves free
      const z = 1.06, p = P[open];
      let fx = W / 2, fy = cy0;
      if (pbox) { if (wide) fx = Math.max(180, pbox.left / 2); else fy = Math.max(90, (60 + pbox.top) / 2); }
      return { z, ox: fx - cx0 - p.x * s * z, oy: fy - cy0 - p.y * s * z };
    }
    return { z: 1, ox: 0, oy: 0 };
  };

  // screen positions; during the entrance each word travels out from its parent
  const D = Object.fromEntries(ids.map((id) => [id, { x: 0, y: 0, sx: 0, sy: 0 }]));
  const place = (time) => {
    for (const id of order) {
      const p = P[id], d = D[id];
      let x = p.x, y = p.y;
      if (entering && parent[id]) {
        const e = easeOut(clamp01((time - born[idx[id]]) / TRAVEL)), q = D[parent[id]];
        x = q.x + (x - q.x) * e; y = q.y + (y - q.y) * e;
      }
      d.x = x; d.y = y;
      d.sx = cx0 + cam.ox + x * s * cam.z; d.sy = cy0 + cam.oy + y * s * cam.z;
    }
    if (entering && time > entranceEnd) entering = false;
  };

  // ---- connections: curves trimmed to each word's box, bowed gently toward the centre ------------------------
  const G = edges.map(() => ({ ok: false, x0: 0, y0: 0, qx: 0, qy: 0, x1: 0, y1: 0, mx: 0, my: 0, len: 0 }));
  const trim = (dx, dy, bw, bh) => Math.min(dx ? bw / Math.abs(dx) : Infinity, dy ? bh / Math.abs(dy) : Infinity);
  const geometry = () => {
    const S = D.kalyan;
    for (let i = 0; i < edges.length; i++) {
      const [a, b] = edges[i], A = D[a], B = D[b], g = G[i];
      const dx = B.sx - A.sx, dy = B.sy - A.sy;
      const ta = trim(dx, dy, P[a].bw + 3, P[a].bh + 2), tb = trim(dx, dy, P[b].bw + 3, P[b].bh + 2);
      g.ok = ta + tb < 0.94;
      if (!g.ok) continue;
      g.x0 = A.sx + dx * ta; g.y0 = A.sy + dy * ta; g.x1 = B.sx - dx * tb; g.y1 = B.sy - dy * tb;
      const ex = g.x1 - g.x0, ey = g.y1 - g.y0, len = Math.hypot(ex, ey) || 1, nx = -ey / len, ny = ex / len;
      g.len = len; g.mx = (g.x0 + g.x1) / 2; g.my = (g.y0 + g.y1) / 2;
      const cx = S.sx - g.mx, cy = S.sy - g.my, cl = Math.hypot(cx, cy) || 1;
      const bend = ((cx / cl) * nx + (cy / cl) * ny) * len * 0.22 + Math.sin(ac / 3800 + sway[i]) * len * 0.035;
      g.qx = g.mx + nx * bend; g.qy = g.my + ny * bend;
    }
  };
  // a point at t along edge g, travelled from its `rev` end when rev is set
  const at = (g, t, o) => { const u = t, v = 1 - u; o.x = v * v * g.x0 + 2 * v * u * g.qx + u * u * g.x1; o.y = v * v * g.y0 + 2 * v * u * g.qy + u * u * g.y1; return o; };
  const PA = { x: 0, y: 0 }, PB = { x: 0, y: 0 };
  const curve = (g, rev) => {
    ctx.beginPath();
    if (rev) { ctx.moveTo(g.x1, g.y1); ctx.quadraticCurveTo(g.qx, g.qy, g.x0, g.y0); } else { ctx.moveTo(g.x0, g.y0); ctx.quadraticCurveTo(g.qx, g.qy, g.x1, g.y1); }
  };
  // the piece of edge g between t0 and t1 (measured from the travelled-from end) as its own quadratic
  const piece = (g, rev, t0, t1) => {
    const a = rev ? 1 - t0 : t0, b = rev ? 1 - t1 : t1;
    at(g, a, PA); at(g, b, PB);
    const qx = PA.x + (b - a) * ((1 - a) * (g.qx - g.x0) + a * (g.x1 - g.qx));
    const qy = PA.y + (b - a) * ((1 - a) * (g.qy - g.y0) + a * (g.y1 - g.qy));
    ctx.beginPath(); ctx.moveTo(PA.x, PA.y); ctx.quadraticCurveTo(qx, qy, PB.x, PB.y);
  };

  // ---- what is lit: a focused word, a kind from the legend, or a passing thought ----------------------------
  const states = new Array(N).fill('');
  let litKey = null, L = null, needMeasure = false, clock = 0, ac = 0;
  const flashAt = new Float64Array(N).fill(-1e9), flashAmp = new Float32Array(N);
  const flash = (i, amp, delay = 0) => { if (!reduce) { flashAt[i] = clock + delay; flashAmp[i] = amp; } };
  const flashOf = (i, time) => (time < flashAt[i] ? 0 : flashAmp[i] * Math.exp(-(time - flashAt[i]) / 520));
  const ripples = [];
  const ignite = (id) => { if (!reduce) ripples.push({ kind: 'ring', x: P[id].x, y: P[id].y, t0: clock, dur: 900, R: 70, col: KC[glowOf(byId[id].type)] }); };

  const computeLit = () => {
    const { hover, open, thought, kind } = live.current;
    const focus = hover || open;
    const key = focus ? 'f' + focus : kind ? 'k' + kind : thought ? 't' + thought.id + ':' + thought.step : '';
    if (key === litKey) return L;
    const prev = L;
    litKey = key; needMeasure = true;
    if (focus) {
      L = { mode: 'focus', focus };
      for (let i = 0; i < N; i++) states[i] = ids[i] === focus ? 'focus' : neighbours[focus].has(ids[i]) ? 'lit' : 'dim';
    } else if (kind) {
      L = { mode: 'kind', kind };
      for (let i = 0; i < N; i++) states[i] = type[i] === kind ? 'lit' : 'dim';
      if (!prev || prev.kind !== kind) for (let i = 0; i < N; i++) if (type[i] === kind) flash(i, 0.5, sweepOf(ids[i]) * 520);
    } else if (thought) {
      L = { mode: 'thought' };
      const here = thought.path[thought.step], reached = thought.path.slice(0, thought.step + 1);
      for (let i = 0; i < N; i++) states[i] = ids[i] === here ? 'focus' : reached.includes(ids[i]) ? 'lit' : 'fade';
      flash(idx[here], 0.6); ignite(here);
    } else {
      L = null;
      states.fill('');
    }
    return L;
  };

  // ---- signals: sparks that travel the connections; some set off the next one on arrival ---------------------
  const pulses = [];
  const lastBurst = new Float64Array(N).fill(-1e9);
  const spawn = (e, from, { dur, alpha = 1, chain = 0, delay = 0, speed = 0.17 } = {}) => {
    if (pulses.length > 48) return;
    const [a, b] = edges[e], to = from === a ? b : a;
    const tt = byId[to].type;
    pulses.push({ e, rev: from !== a, to, t0: clock + delay, dur: dur ?? Math.max(520, (G[e].len || 160) / speed), alpha, chain, kind: tt === 'tool' ? byId[from].type : tt });
  };
  const outward = (e, from) => { const [a, b] = edges[e], to = from === a ? b : a; return RING[byId[to].type] >= RING[byId[from].type]; };
  const arrive = (p) => {
    const j = idx[p.to];
    flash(j, 0.18 + 0.3 * p.alpha);
    if (p.chain > 0 && Math.random() < 0.55) {
      const options = incident[j].filter((e) => e !== p.e);
      const out = options.filter((e) => outward(e, p.to));
      const list = out.length && Math.random() < 0.75 ? out : options;
      if (list.length) spawn(list[(Math.random() * list.length) | 0], p.to, { alpha: p.alpha * 0.85, chain: p.chain - 1 });
    }
  };
  let nextSpawn = 2400;
  const ambient = () => {
    if (clock < nextSpawn || entering) return;
    nextSpawn = clock + 240 + Math.random() * 420;
    let e, from, alpha = 0.85;
    if (L?.mode === 'focus' && Math.random() < 0.7) {
      const list = incident[idx[L.focus]];
      e = list[(Math.random() * list.length) | 0]; from = L.focus; alpha = 1;
    } else if (L?.mode === 'kind') {
      const k = ids.filter((id, i) => type[i] === L.kind);
      from = k[(Math.random() * k.length) | 0];
      const list = incident[idx[from]];
      e = list[(Math.random() * list.length) | 0];
    }
    if (e === undefined) {
      e = (Math.random() * edges.length) | 0;
      const [a, b] = edges[e], aOut = RING[byId[a].type] <= RING[byId[b].type];
      from = Math.random() < 0.75 ? (aOut ? a : b) : (aOut ? b : a);
      if (L?.mode === 'thought') alpha = 0.35; else if (L?.mode === 'focus') alpha = 0.3;
    }
    spawn(e, from, { alpha, chain: 2 });
  };
  const burst = (id) => { // a word that is touched fires along every connection it has
    const i = idx[id];
    if (reduce || i === undefined || clock - lastBurst[i] < 700) return;
    lastBurst[i] = clock;
    flash(i, 0.55);
    incident[i].slice(0, 14).forEach((e, k) => spawn(e, id, { dur: 480 + Math.random() * 180, delay: k * 26, alpha: 1 }));
  };
  const ping = (id) => { // sonar: a ring leaves the word and every word it passes glints
    if (reduce || !P[id]) return;
    ripples.push({ kind: 'ping', x: P[id].x, y: P[id].y, t0: clock, dur: 2600, R: 640, col: KC[glowOf(byId[id].type)] });
    flash(idx[id], 0.6);
  };
  const toWorld = (sx, sy) => ({ x: (sx - cx0 - cam.ox) / (s * cam.z), y: (sy - cy0 - cam.oy) / (s * cam.z) });
  const poke = (clientX, clientY) => { // a click on empty space sends a ripple that shoves the nearby words
    if (reduce) return;
    const r = wrap.getBoundingClientRect(), sx = clientX - r.left, sy = clientY - r.top, w = toWorld(sx, sy);
    ripples.push({ kind: 'poke', sx, sy, t0: clock, dur: 1100, R: 170, col: C.cream });
    for (let i = 1; i < N; i++) {
      const p = P[ids[i]], dx = p.x - w.x, dy = p.y - w.y, d = Math.hypot(dx, dy) || 1;
      if (d < 260) { const f = 16 * (1 - d / 260) ** 2; p.vx += (dx / d) * f; p.vy += (dy / d) * f; flash(i, 0.4 * (1 - d / 260), d * 1.4); }
    }
  };

  // ---- drawing ------------------------------------------------------------------------------------------------
  const haloS = new Float32Array(N), pingGlow = new Float32Array(N);
  const mouse = { x: 0, y: 0, on: false };
  let openId = null, openAt = 0;

  const orbits = (time) => {
    const S = D.kalyan;
    ctx.lineWidth = 1;
    ctx.setLineDash([1.5, 7]);
    ORBITS.forEach((R, k) => {
      const pr = reduce ? 1 : easeOut(clamp01((time - 100 - k * 140) / 1400));
      if (pr <= 0) return;
      ctx.strokeStyle = rgba(C.cream, k === ORBITS.length - 1 ? 0.035 : 0.065);
      ctx.lineDashOffset = (k % 2 ? 1 : -1) * ac * 0.006;
      ctx.beginPath();
      ctx.ellipse(S.sx, S.sy, R * ax * s * cam.z, R * s * cam.z, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pr);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  };

  const drawRipples = (time) => {
    pingGlow.fill(0);
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rp = ripples[r], u = (time - rp.t0) / rp.dur;
      if (u >= 1) { ripples.splice(r, 1); continue; }
      if (u < 0) continue;
      const R = rp.R * easeOut(u), fade = (1 - u) ** 1.6;
      ctx.lineWidth = 1;
      if (rp.kind === 'poke') {
        for (const [lag, a] of [[0, 0.32], [0.14, 0.16]]) {
          const rr = rp.R * easeOut(clamp01(u - lag));
          if (rr <= 0) continue;
          ctx.strokeStyle = rgba(rp.col, a * fade);
          ctx.beginPath(); ctx.arc(rp.sx, rp.sy, rr, 0, Math.PI * 2); ctx.stroke();
        }
        continue;
      }
      const sx = cx0 + cam.ox + rp.x * s * cam.z, sy = cy0 + cam.oy + rp.y * s * cam.z;
      const lags = rp.kind === 'ping' ? [[0, 0.24], [0.08, 0.12]] : [[0, 0.45]];
      for (const [lag, a] of lags) {
        const rr = rp.R * easeOut(clamp01(u - lag)) * s * cam.z;
        if (rr <= 0) continue;
        ctx.strokeStyle = rgba(rp.col, a * fade);
        ctx.beginPath(); ctx.ellipse(sx, sy, rr * (rp.kind === 'ping' ? ax : 1), rr, 0, 0, Math.PI * 2); ctx.stroke();
      }
      if (rp.kind === 'ping') { // the words the ring passes glint
        for (let i = 0; i < N; i++) {
          const p = P[ids[i]], d = Math.hypot((p.x - rp.x) / ax, p.y - rp.y);
          if (Math.abs(d - R) < 26) pingGlow[i] = Math.max(pingGlow[i], 0.34 * fade);
        }
      }
    }
  };

  const halos = (time, dt) => {
    const k = 1 - Math.exp(-dt / 160);
    for (let i = 0; i < N; i++) {
      if (!isBorn[i]) continue;
      const st = states[i];
      let target = 0;
      if (L?.mode === 'focus') target = st === 'focus' ? 0.5 : st === 'lit' ? 0.12 : 0;
      else if (L?.mode === 'thought') target = st === 'focus' ? 0.5 : st === 'lit' ? 0.26 : 0;
      else if (L?.mode === 'kind') target = st === 'lit' ? 0.16 : 0;
      haloS[i] += (target - haloS[i]) * k;
      const I = Math.min(1, Math.max(haloS[i], flashOf(i, time), pingGlow[i])) * (st === 'dim' ? 0.2 : st === 'fade' ? 0.6 : 1);
      if (I < 0.015) continue;
      const p = P[ids[i]], d = D[ids[i]], pad = Math.min(56, 16 + p.bw * 1.2), w = p.bw * 2 + pad, h = p.bh * 2 + pad * 0.75;
      ctx.globalAlpha = I;
      ctx.drawImage(HALO[type[i]], d.sx - w / 2, d.sy - h / 2, w, h);
    }
    ctx.globalAlpha = 1;
  };

  const edgeVis = (e, time) => {
    if (!entering) return 1;
    const [a, b] = edges[e], ia = idx[a], ib = idx[b];
    if (parent[b] === a) return time >= born[ib] ? 1 : 0; // the connection a word is born along grows with it
    if (parent[a] === b) return time >= born[ia] ? 1 : 0;
    return clamp01((time - 260 - Math.max(born[ia], born[ib])) / 420);
  };

  const baseEdges = (time) => {
    const mode = L?.mode;
    ctx.lineWidth = 1;
    for (let e = 0; e < edges.length; e++) {
      const g = G[e];
      if (!g.ok) continue;
      const vis = edgeVis(e, time);
      if (vis <= 0) continue;
      const [a, b] = edges[e];
      let al;
      if (mode === 'focus') { if (a === L.focus || b === L.focus) continue; al = 0.035; }
      else if (mode === 'kind') al = byId[a].type === L.kind || byId[b].type === L.kind ? 0.28 : 0.04;
      else if (mode === 'thought') al = 0.075;
      else al = 0.13;
      if (mouse.on && mode !== 'focus') { const d = Math.hypot(mouse.x - g.mx, mouse.y - g.my); if (d < 220) al += 0.24 * (1 - d / 220) ** 2; }
      al *= vis;
      const ca = KC[byId[a].type], cb = KC[byId[b].type];
      const gr = ctx.createLinearGradient(g.x0, g.y0, g.x1, g.y1);
      gr.addColorStop(0, rgba(ca, al)); gr.addColorStop(1, rgba(cb, al));
      ctx.strokeStyle = gr;
      curve(g, false); ctx.stroke();
      // terminals where the line meets each word
      const ta = Math.min(0.7, al * 2.2);
      ctx.fillStyle = rgba(ca, ta); ctx.beginPath(); ctx.arc(g.x0, g.y0, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba(cb, ta); ctx.beginPath(); ctx.arc(g.x1, g.y1, 1.3, 0, Math.PI * 2); ctx.fill();
    }
  };

  const focusEdges = () => {
    if (L?.mode !== 'focus') return;
    const f = L.focus, fi = idx[f], cf = KC[glowOf(type[fi])];
    for (const e of incident[fi]) {
      const g = G[e];
      if (!g.ok) continue;
      const rev = edges[e][1] === f, other = rev ? edges[e][0] : edges[e][1];
      const gr = rev ? ctx.createLinearGradient(g.x1, g.y1, g.x0, g.y0) : ctx.createLinearGradient(g.x0, g.y0, g.x1, g.y1);
      gr.addColorStop(0, rgba(cf, 0.85)); gr.addColorStop(1, rgba(KC[glowOf(byId[other].type)], 0.5));
      ctx.strokeStyle = gr; ctx.lineWidth = 1.5;
      curve(g, rev); ctx.stroke();
      if (!reduce) { // current flowing outward from the focused word
        ctx.setLineDash([1.5, 9]); ctx.lineDashOffset = -ac * 0.05;
        ctx.strokeStyle = rgba(C.spark, 0.85); ctx.lineWidth = 1.8;
        curve(g, rev); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  };

  const thoughtPath = (now) => {
    const th = live.current.thought;
    if (L?.mode !== 'thought' || !th) return;
    for (let k = 0; k < th.path.length - 1 && k <= th.step; k++) {
      const e = edgeOf.get(th.path[k] + '|' + th.path[k + 1]);
      if (e === undefined || !G[e].ok) continue;
      const g = G[e], rev = edges[e][0] !== th.path[k];
      const travelling = k === th.step;
      if (travelling && reduce) continue;
      const u = travelling ? easeInOut(clamp01((now - th.at) / STEP)) : 1;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba(C.marigold, 0.16); ctx.lineWidth = 6;
      piece(g, rev, 0, u); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = rgba(C.marigold, 0.9); ctx.lineWidth = 1.8;
      piece(g, rev, 0, u); ctx.stroke();
      if (travelling && u < 1) { // the spark itself, with a tail
        const t0 = Math.max(0, u - 0.4);
        piece(g, rev, t0, u);
        const gr = ctx.createLinearGradient(PA.x, PA.y, PB.x, PB.y);
        gr.addColorStop(0, rgba(C.spark, 0)); gr.addColorStop(1, rgba(C.spark, 0.95));
        ctx.strokeStyle = gr; ctx.lineWidth = 2.6; ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(SPARK.theme, PB.x - 15, PB.y - 15, 30, 30);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  };

  const drawPulses = (time) => {
    ctx.lineWidth = 1.6;
    for (let n = pulses.length - 1; n >= 0; n--) {
      const p = pulses[n], u = (time - p.t0) / p.dur;
      if (u >= 1) { pulses.splice(n, 1); arrive(p); continue; }
      if (u < 0) continue;
      const g = G[p.e];
      if (!g.ok) continue;
      const ue = easeInOut(u), col = KC[glowOf(p.kind)];
      piece(g, p.rev, Math.max(0, ue - 0.3), ue);
      const gr = ctx.createLinearGradient(PA.x, PA.y, PB.x, PB.y);
      gr.addColorStop(0, rgba(col, 0)); gr.addColorStop(1, rgba(col, 0.75 * p.alpha));
      ctx.strokeStyle = gr; ctx.stroke();
      const r = 7 + 3 * p.alpha;
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(SPARK[p.kind], PB.x - r, PB.y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
    }
  };

  const connector = (time) => { // a line from the opened word to its panel
    const { open } = live.current;
    if (open !== openId) { openId = open; openAt = time; }
    if (!open || !wide || !pbox || !P[open]) return;
    const d = D[open], p = P[open];
    const x0 = d.sx + p.bw + 4, y0 = d.sy, x3 = pbox.left - 1, y3 = pbox.top + 84; // meets the panel at its heading
    if (x3 - x0 < 40) return;
    const pr = reduce ? 1 : easeOut(clamp01((time - openAt - 140) / 700));
    const hx = (x3 - x0) * 0.5, len = Math.hypot(x3 - x0, y3 - y0) * 1.2;
    const col = KC[glowOf(byId[open].type)];
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0 + hx, y0, x3 - hx, y3, x3, y3);
    ctx.strokeStyle = rgba(col, 0.5); ctx.lineWidth = 1.2;
    ctx.setLineDash([len * pr, len]); ctx.lineDashOffset = 0; ctx.stroke();
    if (pr >= 1 && !reduce) { ctx.setLineDash([1.5, 9]); ctx.lineDashOffset = -ac * 0.05; ctx.strokeStyle = rgba(C.spark, 0.7); ctx.lineWidth = 1.6; ctx.stroke(); }
    ctx.setLineDash([]);
    if (pr > 0.96) { ctx.fillStyle = rgba(col, 0.9); ctx.beginPath(); ctx.arc(x3, y3, 2.2, 0, Math.PI * 2); ctx.fill(); }
  };

  // lines stop at every word they pass, so they read as running behind it rather than striking through it
  const clipWords = () => {
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      if (!isBorn[i]) continue;
      const p = P[ids[i]], d = D[ids[i]];
      ctx.rect(d.sx - p.bw, d.sy - p.bh, p.bw * 2, p.bh * 2);
    }
    ctx.clip('evenodd');
  };

  const render = (time, dt, now) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';
    halos(time, dt);
    ctx.globalCompositeOperation = 'source-over';
    ctx.save();
    clipWords();
    orbits(time);
    drawRipples(time);
    baseEdges(time);
    focusEdges();
    thoughtPath(now);
    ctx.globalCompositeOperation = 'lighter';
    drawPulses(time);
    ctx.globalCompositeOperation = 'source-over';
    connector(time);
    ctx.restore();
  };

  const writeWords = (time) => {
    for (let i = 0; i < N; i++) {
      const id = ids[i], el = els[id];
      if (!el) continue;
      const d = D[id];
      el.style.transform = `translate(${d.sx.toFixed(1)}px, ${d.sy.toFixed(1)}px) translate(-50%, -50%)`;
      if (!isBorn[i] && time >= born[i]) { isBorn[i] = 1; el.dataset.born = ''; flash(i, 0.4); }
      if (el.dataset.state !== states[i]) el.dataset.state = states[i];
    }
  };

  // ---- input: drag a word around (it springs back when let go); the pointer lights nearby lines --------------
  const local = (e) => { const r = wrap.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const down = (e) => {
    const id = e.target.closest?.('[data-node]')?.dataset.node;
    if (!id || id === 'kalyan' || e.pointerType === 'touch') return;
    const [sx, sy] = local(e), w = toWorld(sx, sy);
    drag = { id, x: P[id].x, y: P[id].y, offX: P[id].x - w.x, offY: P[id].y - w.y, moved: false, cx: e.clientX, cy: e.clientY };
  };
  const move = (e) => {
    const [sx, sy] = local(e);
    mouse.x = sx; mouse.y = sy; mouse.on = e.pointerType !== 'touch';
    if (!drag) return;
    const w = toWorld(sx, sy);
    drag.x = w.x + drag.offX; drag.y = w.y + drag.offY;
    if (Math.hypot(e.clientX - drag.cx, e.clientY - drag.cy) > 4) drag.moved = true;
  };
  const up = () => { if (drag?.moved) onDragged?.(); drag = null; };
  const leave = () => { mouse.on = false; };

  // ---- run ------------------------------------------------------------------------------------------------------
  resize();
  for (let i = 0; i < 400; i++) step(false, null); // settle before the first frame
  let last = 0;
  for (const id of ids) {
    const i = idx[id], d = Math.min(3, depth[id]);
    born[i] = reduce ? -1 : BIRTH[d] + sweepOf(id) * SWEEP[d];
    last = Math.max(last, born[i]);
  }
  entranceEnd = last + TRAVEL;
  const t0 = performance.now();
  let prev = t0;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(64, now - prev);
    prev = now; clock = now - t0;
    const st = live.current;
    if (st.hidden) return; // the index covers the map
    const moving = !reduce && !st.paused;
    if (moving) ac += dt;
    computeLit();
    if (needMeasure && !wide) measure(); // phone tools grow from dots into words when lit
    needMeasure = false;
    step(moving, L);
    pbox = st.open ? panelBox() : null;
    const t = camTarget(), k = reduce ? 1 : 1 - Math.exp(-dt / 420);
    cam.z += (t.z - cam.z) * k; cam.ox += (t.ox - cam.ox) * k; cam.oy += (t.oy - cam.oy) * k;
    place(clock);
    geometry();
    if (moving) ambient();
    render(clock, dt, now);
    writeWords(clock);
  };
  raf = requestAnimationFrame(frame);

  addEventListener('resize', resize);
  wrap.addEventListener('pointerdown', down);
  wrap.addEventListener('pointerleave', leave);
  addEventListener('pointermove', move);
  addEventListener('pointerup', up);
  addEventListener('blur', leave);
  document.fonts?.ready.then(measure);

  return {
    burst, ping, poke,
    destroy() {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      wrap.removeEventListener('pointerdown', down);
      wrap.removeEventListener('pointerleave', leave);
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('blur', leave);
    },
  };
}

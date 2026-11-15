// Sky gradient bands (time of day flows left→right) and the celestial layer: sun, moon, stars,
// scalloped miniature-painting clouds, monsoon rain and flocks of cranes.
import { rect, circle, path, stroke, line, n1 } from '../svg.js';
import { mixRGB, rgb2hex } from '../color.js';

const HORIZON = 398;
const ease = (x) => x * x * (3 - 2 * x);

function skyColor(m, t) {
  const c = t < 0.62 ? mixRGB(m.top, m.mid, ease(t / 0.62)) : mixRGB(m.mid, m.hor, ease((t - 0.62) / 0.38));
  return rgb2hex(c);
}

export function sky(ctx, x0, x1) {
  const N = 72;
  const m0 = ctx.M(x0 - 1), m1 = ctx.M(x1 + 1);
  let s = '';
  for (let j = 0; j < N; j++) {
    const ya = (j * HORIZON) / N, yb = ((j + 1) * HORIZON) / N + 1.5;
    const t = (j + 0.5) / N;
    const a = skyColor(m0, t), b = skyColor(m1, t);
    s += rect(x0 - 1, ya, 514, yb - ya, a === b ? a : ctx.lgrad(x0 - 1, x1 + 1, [a, b]));
  }
  const h0 = rgb2hex(m0.hor), h1 = rgb2hex(m1.hor);
  s += rect(x0 - 1, HORIZON, 514, 160, h0 === h1 ? h0 : ctx.lgrad(x0 - 1, x1 + 1, [h0, h1]));
  return { base: s };
}

// ---- bodies -------------------------------------------------------------------------------
function sun(ctx, x, y, r, col) {
  const glow = ctx.rgrad([[0, col, 0.6], [0.3, col, 0.25], [1, col, 0]]);
  let s = circle(x, y, r * 5.5, glow);
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2, c = Math.cos(a), si = Math.sin(a);
    const r0 = r * 1.25, r1 = r * (i % 2 ? 1.55 : 1.85);
    s += line(x + c * r0, y + si * r0, x + c * r1, y + si * r1, col, 1.6, 'stroke-opacity=".7"');
  }
  return s + circle(x, y, r * 1.12, col, 'fill-opacity=".35"') + circle(x, y, r, col);
}

function moon(ctx, x, y, r, col, crescent) {
  const glow = ctx.rgrad([[0, col, 0.45], [0.4, col, 0.14], [1, col, 0]]);
  let s = circle(x, y, r * 4.2, glow);
  if (crescent) {
    s += path(`M${n1(x)} ${n1(y - r)}A${n1(r)} ${n1(r)} 0 1 0 ${n1(x)} ${n1(y + r)}A${n1(r * 0.7)} ${n1(r)} 0 1 1 ${n1(x)} ${n1(y - r)}Z`, col);
  } else {
    s += circle(x, y, r, col);
    s += circle(x - r * 0.3, y - r * 0.25, r * 0.22, '#d8d2b4', 'fill-opacity=".6"');
    s += circle(x + r * 0.35, y + r * 0.2, r * 0.3, '#d8d2b4', 'fill-opacity=".5"');
    s += circle(x + r * 0.1, y - r * 0.5, r * 0.14, '#d8d2b4', 'fill-opacity=".5"');
  }
  return s;
}

// ---- clouds -------------------------------------------------------------------------------
function cloudPath(w, h, rnd) {
  const n = Math.max(3, Math.round(w / 40));
  const P = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    P.push([t * w, -h * (0.12 + 0.88 * Math.sin(Math.PI * t)) * (0.72 + 0.28 * rnd())]);
  }
  let d = `M0 0L${n1(P[0][0])} ${n1(P[0][1])}`;
  const bumps = [];
  for (let i = 1; i <= n; i++) {
    const [x, y] = P[i], [px, py] = P[i - 1];
    const r = Math.hypot(x - px, y - py) * (0.56 + 0.14 * rnd());
    d += `A${n1(r)} ${n1(r)} 0 0 1 ${n1(x)} ${n1(y)}`;
    bumps.push([(x + px) / 2, (y + py) / 2, r]);
  }
  d += `L${n1(w)} 0`;
  const m = Math.max(2, Math.round(w / 55));
  for (let i = m - 1; i >= 0; i--) d += `Q${n1(((i + 0.5) * w) / m)} ${n1(4 + 3 * rnd())} ${n1((i * w) / m)} 0`;
  return { d: d + 'Z', bumps };
}

function cloud(ctx, x, y, w, h, rnd, m, rainy) {
  const fill = rgb2hex(m.cloud), shade = rgb2hex(m.cloudShade);
  const { d, bumps } = cloudPath(w, h, rnd);
  let s = `<g transform="translate(${n1(x)} ${n1(y)})"><g class="cl" style="animation-delay:-${n1(rnd() * 34)}s">`;
  if (rainy) {
    const n = Math.round(w / 9);
    let rain = '';
    for (let i = 0; i < n; i++) {
      const rx = rnd() * w, len = 60 + rnd() * 130, ry = 6 + rnd() * 20;
      rain += `M${n1(rx)} ${n1(ry)}l${n1(-len * 0.16)} ${n1(len)}`;
    }
    s += stroke(rain, '#c9d8e6', 0.9, 'stroke-opacity=".28"');
  }
  s += `<path d="${d}" transform="translate(0 4)" fill="${shade}"/>`;
  s += `<path d="${d}" fill="${fill}" stroke="${shade}" stroke-width=".9" stroke-linejoin="round"/>`;
  // swirl strokes inside two of the bumps
  let curls = '';
  for (const k of [1, bumps.length - 2]) {
    const b = bumps[Math.max(0, Math.min(bumps.length - 1, k))];
    if (!b) continue;
    const r = b[2] * 0.55;
    curls += `M${n1(b[0] - r)} ${n1(b[1] + r * 0.9)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(b[0] + r * 0.55)} ${n1(b[1] + r * 0.35)}`;
  }
  s += stroke(curls, shade, 0.9, 'stroke-opacity=".75"');
  return s + '</g></g>';
}

function streak(x, y, w, fill, r) {
  let d = '';
  for (let i = 0; i < 3; i++) {
    const ox = r() * w * 0.25, ww = w * (0.55 + r() * 0.45), oy = i * 7;
    d += `M${n1(ox)} ${n1(oy)}Q${n1(ox + ww / 2)} ${n1(oy - 5 - r() * 3)} ${n1(ox + ww)} ${n1(oy)}Q${n1(ox + ww / 2)} ${n1(oy + 3)} ${n1(ox)} ${n1(oy)}Z`;
  }
  return `<g transform="translate(${n1(x)} ${n1(y)})"><path class="cl" style="animation-delay:-${n1(r() * 34)}s" d="${d}" fill="${fill}" fill-opacity=".82"/></g>`;
}

// ---- birds --------------------------------------------------------------------------------
function flock(rnd, col) {
  const n = rnd.int(5, 9), dir = rnd.sign(), sc = rnd.range(0.8, 1.25);
  let d = '';
  for (let i = 0; i < n; i++) {
    const row = Math.ceil(i / 2), side = i % 2 ? 1 : -1;
    const bx = -dir * row * 15 * sc, by = side * row * 7 * sc + rnd.range(-2, 2);
    const wing = 5.5 * sc, lift = (3.5 + rnd() * 2.5) * sc;
    d += `M${n1(bx - wing)} ${n1(by)}Q${n1(bx - wing / 2)} ${n1(by - lift)} ${n1(bx)} ${n1(by)}Q${n1(bx + wing / 2)} ${n1(by - lift)} ${n1(bx + wing)} ${n1(by)}`;
  }
  return stroke(d, col, 1.2);
}

export function celestial(ctx, x0, x1) {
  let s = '';
  const f = ctx.f;

  // stars
  ctx.cells(64, (c, cx0) => {
    for (let j = 0; j < 2; j++) {
      const r = ctx.rng('star', c, j);
      const x = cx0 + r() * 64, y = 6 + Math.pow(r(), 1.25) * 330, size = 0.5 + r() * 1.1, keep = r(), twinkle = r();
      if (keep > 0.55) continue;
      const night = ctx.M(x).night;
      if (night < 0.08) continue;
      const o = Math.min(1, night * (0.45 + 0.55 * r()));
      if (twinkle < 0.1) {
        const a = 3.2 * size + 1.5, b = 0.8;
        s += path(`M${n1(x)} ${n1(y - a)}L${n1(x + b)} ${n1(y - b)}L${n1(x + a)} ${n1(y)}L${n1(x + b)} ${n1(y + b)}L${n1(x)} ${n1(y + a)}L${n1(x - b)} ${n1(y + b)}L${n1(x - a)} ${n1(y)}L${n1(x - b)} ${n1(y - b)}Z`, '#fff3c0', `fill-opacity="${n1(o)}" class="tw" style="animation-delay:-${n1(twinkle * 26)}s"`);
      } else {
        s += circle(x, y, size, '#fff6d4', `fill-opacity="${n1(o)}"`);
      }
    }
  });

  // sun / moon sit at the time-of-day keys of the journey (or repeat on a grid when the mood is locked;
  // with a live clock the body is the real one, at the height the clock gives it)
  const bodies = [];
  const clock = ctx.world.clock;
  if (clock) {
    if (clock.bodyType) ctx.cells(2400, (c, cx0) => bodies.push({ k: c, x: cx0 + 300 + ctx.rng('lb', c)() * 1500, type: clock.bodyType, y: clock.bodyAt }));
  } else if (ctx.world.lockedMood) {
    ctx.cells(1250, (c, cx0) => bodies.push({ k: c, x: cx0 + 220 + ctx.rng('lb', c)() * 800, type: ctx.world.lockedMood }));
  } else {
    for (const key of ctx.world.keysIn(x0 / f - 200, x1 / f + 200)) bodies.push({ k: key.k, x: key.u * f, type: key.type });
  }
  for (const b of bodies) {
    if (b.x < x0 || b.x >= x1) continue;
    const r = ctx.rng('body', b.k);
    const rgb = { dawn: [0xff, 0xb3, 0x47], day: [0xff, 0xf1, 0xb8], dusk: [0xff, 0x6a, 0x2c], night: [0xf3, 0xee, 0xd6] }[b.type];
    if (!rgb) continue;
    const col = rgb2hex(rgb);
    const size = { dawn: 34, day: 27, dusk: 40, night: 26 }[b.type];
    const y = b.y ?? { dawn: 330, day: 100 + r() * 50, dusk: 334, night: 96 + r() * 55 }[b.type];
    s += b.type === 'night' ? moon(ctx, b.x, y, size, col, r() < 0.4) : sun(ctx, b.x, y, size, col);
  }

  // clouds
  ctx.cells(340, (c, cx0) => {
    const cm = ctx.M(cx0 + 170);
    const cnt = cm.cloudiness * 2.3;
    const n = Math.floor(cnt + ctx.rng('cn', c)());
    for (let j = 0; j < n; j++) {
      const r = ctx.rng('cloud', c, j);
      const x = cx0 + r() * 340;
      const m = ctx.M(x);
      const heavy = m.rain > 0.5;
      const w = r.range(90, 330) * (1 + m.cloudiness * 0.5);
      const y = heavy ? r.range(60, 210) : r.range(70, 285);
      const h = w * (r() < 0.25 ? r.range(0.3, 0.4) : r.range(0.14, 0.24));
      if (!ctx.inChunk(x)) continue;
      if (!heavy && r() < 0.32) s += streak(x, y, w * 1.3, rgb2hex(m.cloud), r);
      else s += cloud(ctx, x, y, w, h, r, m, heavy && r() < 0.55);
    }
  });

  // cranes / geese
  ctx.cells(900, (c, cx0) => {
    const r = ctx.rng('flock', c);
    const x = cx0 + r() * 900, y = r.range(110, 300), take = r();
    if (!ctx.inChunk(x) || take > 0.45) return;
    const m = ctx.M(x);
    if (m.night > 0.5) return;
    const K = ctx.K(x, 0.15);
    s += `<g class="bd" transform="translate(${n1(x)} ${n1(y)})">${flock(r, K.ink)}</g>`;
  });

  return { base: s };
}

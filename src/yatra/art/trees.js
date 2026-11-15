// Trees. Every function draws at local origin (0,0) = base of the trunk, y up is negative,
// and returns an SVG string. K is the painter (mood + haze) for the object.
import { circle, ellipse, poly, path, stroke, line, n1 } from '../svg.js';

const GREENS = ['#3f7a3a', '#4a8a3e', '#356f3a', '#5a8f3d', '#2f6b3a'];
const BARK = '#5a3d2b';

const trunkPoly = (K, wb, wt, h, lean = 0, col = BARK) =>
  poly([[-wb / 2, 0], [-wt / 2 + lean, -h], [wt / 2 + lean, -h], [wb / 2, 0]], K(col)) +
  poly([[0, 0], [lean, -h], [wt / 2 + lean, -h], [wb / 2, 0]], K.sh(col, 0.4));

function canopy(K, r, cx, cy, rw, base, nBlobs = 9, squash = 0.7, bs = 1) {
  const cs = [];
  for (let i = 0; i < nBlobs; i++) {
    const a = (i / nBlobs) * Math.PI * 2 + r.range(-0.35, 0.35);
    const d = r.range(0.48, 0.74) * rw;
    cs.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * squash, rw * r.range(0.4, 0.55) * bs]);
  }
  cs.push([cx, cy, rw * 0.66 * bs]);
  const dark = K.sh(base, 0.36), mid = K(base), lite = K.lt(base, 0.3);
  let s = '';
  for (const [x, y, rr] of cs) s += circle(x + 2, y + 4, rr, dark);
  for (const [x, y, rr] of cs) s += circle(x, y, rr, mid);
  for (const [x, y, rr] of cs) if (x < cx + rw * 0.25 && y < cy + rw * 0.2) s += circle(x - rr * 0.2, y - rr * 0.3, rr * 0.58, lite);
  for (let i = 0; i < 14; i++) {
    const a = r() * 6.283, d = Math.sqrt(r()) * rw;
    s += circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d * squash, r.range(0.8, 1.7), r() < 0.55 ? lite : dark);
  }
  return s;
}

export function round(K, r, o = {}) {
  const H = o.h ?? r.range(66, 96);
  const rw = H * (o.wide ?? r.range(0.36, 0.44));
  const base = o.col ?? r.pick(GREENS);
  const tw = o.thick ?? 9;
  return trunkPoly(K, tw, tw * 0.55, H * 0.58, r.range(-2, 2), o.bark ?? BARK) + canopy(K, r, 0, -H * 0.64, rw, base);
}

export function chinar(K, r, o = {}) {
  const col = o.col ?? r.weighted([['#c4501f', 3], ['#d9822b', 3], ['#b83a22', 1.5], ['#4a8a3e', 2], ['#8aa23a', 1]]);
  return round(K, r, { h: o.h ?? r.range(58, 82), wide: 0.5, thick: 11, bark: '#7a7467', col });
}

export function banyan(K, r, o = {}) {
  const H = o.h ?? r.range(56, 74);
  const rw = H * r.range(0.8, 0.95);
  const cy = -H * 0.78;
  const base = o.col ?? r.pick(['#2f6b3a', '#3a7a3c', '#356f3a']);
  let s = trunkPoly(K, 22, 11, H * 0.52, 0) + trunkPoly(K, 9, 5, H * 0.5, -rw * 0.3) + trunkPoly(K, 8, 5, H * 0.48, rw * 0.32);
  s += canopy(K, r, 0, cy, rw, base, 13, 0.46, 0.62);
  // aerial roots hang from the canopy's underside, in front
  const rootCol = K('#6a4a32');
  const roots = r.int(9, 14);
  for (let i = 0; i < roots; i++) {
    const x = r.range(-rw * 0.9, rw * 0.9);
    const top = cy + rw * 0.36 * Math.sqrt(Math.max(0, 1 - (x / rw) ** 2));
    s += stroke(`M${n1(x)} ${n1(top)}Q${n1(x + r.range(-3, 3))} ${n1(top / 2)} ${n1(x + r.range(-1.5, 1.5))} ${n1(r.range(-3, 0))}`, rootCol, r.range(0.9, 1.7));
  }
  return s;
}

export function pine(K, r, o = {}) {
  const H = o.h ?? r.range(70, 112);
  const base = o.col ?? r.pick(['#2a5a3a', '#2f6440', '#264f35']);
  const tiers = r.int(5, 7);
  const w0 = H * r.range(0.19, 0.25);
  let s = poly([[-2.4, 0], [-1.6, -H * 0.22], [1.6, -H * 0.22], [2.4, 0]], K('#4e3624'));
  const mid = K(base), dark = K.sh(base, 0.42), lite = K.lt(base, 0.18);
  const th = (H * 0.9) / tiers;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const yb = -H * 0.1 - t * H * 0.8 * 0.9;
    const yt = yb - th * 1.9;
    const w = w0 * (1 - t * 0.8);
    const P = [[0, yt], [w, yb], [w * 0.62, yb - 2.6], [w * 0.22, yb + 1.2], [-w * 0.25, yb - 2], [-w * 0.65, yb + 0.6], [-w, yb]];
    s += poly(P, mid);
    s += poly([[0, yt], [w, yb], [w * 0.62, yb - 2.6], [w * 0.22, yb + 1.2], [0, yb - 0.4]], dark);
    s += stroke(`M${n1(-w * 0.15)} ${n1(yt + th * 0.5)}L${n1(-w * 0.62)} ${n1(yb - 1)}`, lite, 1, 'stroke-opacity=".75"');
  }
  return s;
}

export function poplar(K, r, o = {}) {
  const H = o.h ?? r.range(84, 126);
  const w = H * r.range(0.08, 0.11);
  const base = o.col ?? r.pick(['#4a8a3e', '#3f7a3a', '#5a9a3e', '#6a9a3a']);
  const top = -H;
  const body = `M0 ${n1(top)}C${n1(-w * 1.5)} ${n1(-H * 0.75)} ${n1(-w * 1.5)} ${n1(-H * 0.3)} ${n1(-1.6)} ${n1(-H * 0.12)}L1.6 ${n1(-H * 0.12)}C${n1(w * 1.5)} ${n1(-H * 0.3)} ${n1(w * 1.5)} ${n1(-H * 0.75)} 0 ${n1(top)}Z`;
  const half = `M0 ${n1(top)}C${n1(w * 1.5)} ${n1(-H * 0.75)} ${n1(w * 1.5)} ${n1(-H * 0.3)} 1.6 ${n1(-H * 0.12)}L0 ${n1(-H * 0.12)}Z`;
  let s = poly([[-1.6, 0], [-1.2, -H * 0.2], [1.2, -H * 0.2], [1.6, 0]], K(BARK));
  s += path(body, K(base)) + path(half, K.sh(base, 0.38));
  for (let i = 0; i < 7; i++) s += circle(r.range(-w, w * 0.7), -H * r.range(0.2, 0.9), r.range(0.8, 1.5), K.lt(base, 0.3));
  return s;
}

const frond = (tx, ty, a, len, wd) => {
  const ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * 0.5 + len * 0.3;
  const cx = tx + Math.cos(a) * len * 0.5, cy = ty + Math.sin(a) * len * 0.5 - len * 0.24;
  const nx = -Math.sin(a), ny = Math.cos(a);
  return {
    d: `M${n1(tx)} ${n1(ty)}Q${n1(cx + nx * wd)} ${n1(cy + ny * wd)} ${n1(ex)} ${n1(ey)}Q${n1(cx - nx * wd)} ${n1(cy - ny * wd)} ${n1(tx)} ${n1(ty)}Z`,
    rib: `M${n1(tx)} ${n1(ty)}Q${n1(cx)} ${n1(cy)} ${n1(ex)} ${n1(ey)}`,
  };
};

export function palm(K, r, o = {}) {
  const H = o.h ?? r.range(84, 128);
  const lean = r.range(-0.2, 0.2) * H;
  const P = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    P.push([2 * (1 - t) * t * lean * 0.1 + t * t * lean, 2 * (1 - t) * t * -H * 0.55 + t * t * -H]);
  }
  const L = [], R = [];
  P.forEach(([x, y], i) => {
    const w = 3.4 - (i / 10) * 1.3;
    L.push([x - w, y]);
    R.push([x + w, y]);
  });
  let s = poly([...L, ...R.reverse()], K('#7a5a3c'));
  for (let i = 2; i < 10; i += 1) s += line(P[i][0] - 3, P[i][1], P[i][0] + 3, P[i][1] - 1, K('#4e3624'), 0.7);
  const [tx, ty] = P[10];
  const green = o.col ?? r.pick(['#3c8a3a', '#2f7a3a', '#4a9a3e']);
  const n = 9;
  const dark = K.sh(green, 0.38), mid = K(green), rib = K.lt(green, 0.35);
  const fr = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + 0.25 + (i / (n - 1)) * (Math.PI - 0.5) + r.range(-0.1, 0.1);
    fr.push(frond(tx, ty, a, H * r.range(0.3, 0.4), H * 0.055));
  }
  for (const f of fr) s += path(f.d, dark, 'transform="translate(1 2)"');
  for (const f of fr) s += path(f.d, mid);
  for (const f of fr) s += stroke(f.rib, rib, 0.7, 'stroke-opacity=".8"');
  s += circle(tx - 2.5, ty + 3, 2.6, K('#6b4a2a')) + circle(tx + 2.2, ty + 3.4, 2.6, K('#7a5630')) + circle(tx, ty + 5.5, 2.6, K('#6b4a2a'));
  return s;
}

export function palmyra(K, r, o = {}) {
  const H = o.h ?? r.range(96, 140);
  const lean = r.range(-5, 5);
  let s = poly([[-3.3, 0], [-2.4 + lean, -H], [2.4 + lean, -H], [3.3, 0]], K('#6e5538'));
  s += poly([[0, 0], [lean, -H], [2.4 + lean, -H], [3.3, 0]], K.sh('#6e5538', 0.4));
  for (let i = 1; i < 12; i++) s += line(-3 + lean * (i / 12), -H * (i / 13), 3 + lean * (i / 12), -H * (i / 13), K('#463620'), 0.6);
  const green = o.col ?? r.pick(['#4a8a3a', '#3f7a3a', '#5a9a3e']);
  const cx = lean, cy = -H;
  const dark = K.sh(green, 0.4), mid = K(green), lite = K.lt(green, 0.3);
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + 0.15 + (i / (n - 1)) * (Math.PI - 0.3);
    const len = H * r.range(0.2, 0.27);
    const ex = cx + Math.cos(a) * len, ey = cy + Math.sin(a) * len * 0.8;
    s += stroke(`M${n1(cx)} ${n1(cy)}L${n1(ex)} ${n1(ey)}`, dark, 1.2);
    s += ellipse((cx + ex) / 2 + Math.cos(a) * len * 0.2, (cy + ey) / 2 + Math.sin(a) * len * 0.15, len * 0.34, len * 0.16, mid, `transform="rotate(${n1((a * 180) / Math.PI)} ${n1((cx + ex) / 2 + Math.cos(a) * len * 0.2)} ${n1((cy + ey) / 2 + Math.sin(a) * len * 0.15)})"`);
  }
  s += circle(cx, cy + 2, 4, lite, 'fill-opacity=".5"');
  return s;
}

export function acacia(K, r, o = {}) {
  const H = o.h ?? r.range(44, 72);
  const base = o.col ?? r.pick(['#6e7d3a', '#7d8a45', '#5f7436', '#85904a']);
  const b = K('#5a4630');
  let s = stroke(`M0 0Q${n1(r.range(-6, 6))} ${n1(-H * 0.4)} 0 ${n1(-H * 0.55)}`, b, 3.2);
  const tips = [[-r.range(14, 22), -H * r.range(0.78, 0.88), r.range(18, 26)], [r.range(14, 24), -H * r.range(0.82, 0.95), r.range(20, 28)], [r.range(-4, 4), -H * 1.0, r.range(16, 22)]];
  for (const [tx, ty] of tips) s += stroke(`M0 ${n1(-H * 0.5)}L${n1(tx * 0.8)} ${n1(ty + 4)}`, b, 1.8);
  const dark = K.sh(base, 0.35), mid = K(base), lite = K.lt(base, 0.3);
  for (const [tx, ty, rx] of tips) s += ellipse(tx + 2, ty + 3.5, rx, rx * 0.34, dark);
  for (const [tx, ty, rx] of tips) s += ellipse(tx, ty, rx, rx * 0.34, mid);
  for (const [tx, ty, rx] of tips) {
    for (let i = 0; i < 5; i++) s += circle(tx + r.range(-rx * 0.7, rx * 0.7), ty + r.range(-rx * 0.2, rx * 0.15), r.range(0.8, 1.5), lite);
  }
  return s;
}

export function banana(K, r, o = {}) {
  const H = o.h ?? r.range(52, 74);
  const green = o.col ?? r.pick(['#52a83a', '#4a9e3a', '#5cb03e']);
  const tr = K('#9aa77a');
  let s = poly([[-3.4, 0], [-2.6, -H * 0.5], [2.6, -H * 0.5], [3.4, 0]], tr) + poly([[0, 0], [0, -H * 0.5], [2.6, -H * 0.5], [3.4, 0]], K.sh('#9aa77a', 0.3));
  const dark = K.sh(green, 0.35), mid = K(green), rib = K.lt(green, 0.4);
  const tx = 0, ty = -H * 0.5;
  const n = 6;
  const fr = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + 0.2 + (i / (n - 1)) * (Math.PI - 0.4) + r.range(-0.12, 0.12);
    fr.push(frond(tx, ty, a, H * r.range(0.62, 0.8), H * 0.15));
  }
  for (const f of fr) s += path(f.d, dark, 'transform="translate(1 2)"');
  for (const f of fr) s += path(f.d, mid);
  for (const f of fr) s += stroke(f.rib, rib, 0.8, 'stroke-opacity=".8"');
  s += stroke(`M0 ${n1(ty)}Q${n1(-6)} ${n1(ty + 12)} ${n1(-4)} ${n1(ty + 18)}`, K('#7a5a3a'), 0.9);
  s += ellipse(-4, ty + 22, 3, 5, K('#7a2a4a'));
  return s;
}

export const ART = { round, chinar, banyan, pine, poplar, palm, palmyra, acacia, banana };

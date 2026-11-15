// Ground clutter and natural features.
import { poly, path, circle, ellipse, line, stroke, n1 } from '../svg.js';

export function rock(K, r) {
  const c = r.pick(['#8a7a68', '#9a8a78', '#7d7468', '#a0907a']);
  const w = r.range(8, 20), h = w * r.range(0.45, 0.7);
  const P = [[-w, 0], [-w * 0.85, -h * 0.55], [-w * 0.4, -h], [w * 0.2, -h * 0.95], [w * 0.75, -h * 0.55], [w, 0]];
  let s = poly(P, K(c)) + poly([[w * 0.1, 0], [w * 0.2, -h * 0.95], [w * 0.75, -h * 0.55], [w, 0]], K.sh(c, 0.3));
  s += line(-w * 0.7, -h * 0.5, -w * 0.3, -h * 0.85, K.lt(c, 0.3), 0.9, 'stroke-opacity=".7"');
  return s;
}

export function boulder(K, r) {
  const c = r.pick(['#a98a68', '#b8946e', '#9c7e5e', '#b09070']);
  const w = r.range(12, 24), h = w * r.range(0.6, 0.85);
  const d = `M${n1(-w)} 0C${n1(-w * 1.05)} ${n1(-h * 0.8)} ${n1(-w * 0.4)} ${n1(-h * 1.15)} ${n1(w * 0.1)} ${n1(-h)}C${n1(w * 0.9)} ${n1(-h * 0.95)} ${n1(w * 1.1)} ${n1(-h * 0.3)} ${n1(w)} 0Z`;
  let s = path(d, K(c)) + path(`M${n1(w * 0.15)} ${n1(-h)}C${n1(w * 0.9)} ${n1(-h * 0.95)} ${n1(w * 1.1)} ${n1(-h * 0.3)} ${n1(w)} 0H${n1(w * 0.1)}Z`, K.sh(c, 0.3));
  s += stroke(`M${n1(-w * 0.6)} ${n1(-h * 0.7)}Q${n1(-w * 0.4)} ${n1(-h * 0.95)} ${n1(-w * 0.1)} ${n1(-h * 0.92)}`, K.lt(c, 0.35), 1.1, 'stroke-opacity=".7"');
  s += stroke(`M${n1(w * 0.2)} ${n1(-h * 0.5)}l${n1(w * 0.12)} ${n1(h * 0.3)}`, K.dk(c, 0.5), 0.7, 'stroke-opacity=".6"');
  return s;
}

export function boulderPile(K, r) {
  const c = r.pick(['#a98a68', '#b8946e', '#9c7e5e']);
  const rows = [[-34, 0, 22, 15], [-6, 1, 26, 17], [30, 0, 20, 14], [-20, -22, 20, 14], [12, -24, 22, 15], [-2, -44, 17, 12]];
  let s = '';
  for (const [x, y, rx, ry] of rows) {
    const jx = r.range(-3, 3), jy = r.range(-2, 2), sc = r.range(0.85, 1.1);
    s += ellipse(x + jx, y + jy - ry * sc, rx * sc, ry * sc, K(c));
    s += path(`M${n1(x + jx)} ${n1(y + jy - ry * 2 * sc)}A${n1(rx * sc)} ${n1(ry * sc)} 0 0 1 ${n1(x + jx)} ${n1(y + jy)}A${n1(rx * sc * 0.6)} ${n1(ry * sc)} 0 0 0 ${n1(x + jx)} ${n1(y + jy - ry * 2 * sc)}Z`, K.sh(c, 0.3));
    s += stroke(`M${n1(x + jx - rx * sc * 0.6)} ${n1(y + jy - ry * sc * 1.2)}Q${n1(x + jx - rx * sc * 0.3)} ${n1(y + jy - ry * sc * 1.8)} ${n1(x + jx)} ${n1(y + jy - ry * sc * 1.8)}`, K.lt(c, 0.35), 1, 'stroke-opacity=".7"');
  }
  return s;
}

export function grass(K, r) {
  const g = r.pick(['#4f8a3a', '#5c9a3e', '#3f7a35', '#6aa044']);
  let s = '';
  const n = r.int(5, 9);
  for (let i = 0; i < n; i++) {
    const a = ((i / (n - 1)) - 0.5) * 1.5 + r.range(-0.12, 0.12), h = r.range(8, 17);
    s += stroke(`M${n1(i * 1.2 - n * 0.6)} 0Q${n1(Math.sin(a) * h * 0.4 + i * 1.2 - n * 0.6)} ${n1(-h * 0.6)} ${n1(Math.sin(a) * h + i * 1.2 - n * 0.6)} ${n1(-Math.cos(a) * h)}`, i % 2 ? K(g) : K.lt(g, 0.18), 1.4);
  }
  return s;
}

export function flowers(K, r) {
  const stem = K('#4f8a3a');
  let s = '';
  const n = r.int(7, 13);
  const pal = r.pick([['#e9779a', '#f4a7c0', '#f7f0f2'], ['#f2c230', '#f7e08a', '#f7f0f2'], ['#e8541c', '#f2c230', '#f7f0f2'], ['#8a5fc0', '#c4a0e8', '#f7f0f2']]);
  for (let i = 0; i < n; i++) {
    const x = r.range(-18, 18), h = r.range(5, 12);
    s += line(x, 0, x + r.range(-1.5, 1.5), -h, stem, 0.9) + circle(x, -h - 0.8, r.range(1.3, 2.2), K(r.pick(pal)));
  }
  return s;
}

export function waterfall(K, r) {
  const L = r.range(46, 80);
  const cliff = '#4d5a4c';
  const lean = r.range(-3, 3);
  let s = poly([[-18, 8], [-13, -2], [-5, 2], [4, -3], [13, 0], [19, 8], [23, L], [-23, L]], K(cliff), 'fill-opacity=".78"');
  s += poly([[2, -2], [13, 0], [19, 8], [23, L], [6, L]], K.sh(cliff, 0.3), 'fill-opacity=".5"');
  const y1 = L * 0.34, y2 = L * 0.66;
  const x1 = -3 + lean, x2 = 2 - lean;
  s += path(`M-2.6 0L2.6 0L${n1(x1 + 3.4)} ${n1(y1)}L${n1(x2 + 4.6)} ${n1(y2)}L6.4 ${n1(L)}L-6.4 ${n1(L)}L${n1(x2 - 4.6)} ${n1(y2)}L${n1(x1 - 3.4)} ${n1(y1)}Z`, K('#eef6fa'));
  s += stroke(`M-0.5 2L${n1(x1)} ${n1(y1)}L${n1(x2)} ${n1(y2)}L0 ${n1(L * 0.92)}`, K('#bcd6e4'), 1, 'stroke-opacity=".8"');
  for (const [yy, xx, w] of [[y1, x1, 8], [y2, x2, 10]]) s += ellipse(xx, yy, w, 1.8, K('#ffffff'), 'fill-opacity=".85"');
  s += ellipse(0, L, 15, 4, K('#eef6fa'), 'fill-opacity=".8"') + ellipse(-6, L - 2, 5, 2.6, K('#ffffff'), 'fill-opacity=".7"') + ellipse(7, L - 1, 4.4, 2.2, K('#ffffff'), 'fill-opacity=".7"');
  s += ellipse(0, L - 3, 26, 9, K('#ffffff'), 'fill-opacity=".22"');
  return s;
}

export function reeds(K, r) {
  const g = r.pick(['#6a8a3a', '#5f8a42', '#7a9a48']);
  let s = '';
  const n = r.int(5, 9);
  for (let i = 0; i < n; i++) {
    const x = (i - n / 2) * 2.6 + r.range(-1, 1), h = r.range(26, 58), lean = r.range(-7, 7);
    s += stroke(`M${n1(x)} 0Q${n1(x + lean * 0.3)} ${n1(-h * 0.55)} ${n1(x + lean)} ${n1(-h)}`, i % 2 ? K(g) : K.sh(g, 0.22), 1.3);
    if (r() < 0.4) s += ellipse(x + lean * 0.86, -h * 0.82, 1.7, 5, K('#6b4528'));
  }
  return s;
}

/** A floating oil lamp (diya) with a leaf boat; the flame is emissive. */
export function diya(K, r) {
  return circle(0, -3, 7, K.glow, 'fill-opacity=".2" class="tw"') + ellipse(0, 0, 3.4, 1.3, K('#a0522d')) +
    path('M0 -1.2Q-1.7 -3.2 0 -6Q1.7 -3.2 0 -1.2Z', K.glow);
}

/** Low tuft in a darker shade of the surrounding ground colour. */
export function tuft(K, r, o = {}) {
  const base = o.col ?? [90, 130, 60];
  const dark = K.sh(base, 0.18), lite = K.lt(base, 0.2);
  let s = '';
  const n = r.int(3, 6);
  for (let i = 0; i < n; i++) {
    const x = (i - n / 2) * 1.6, h = r.range(3.5, 8), lean = r.range(-2.2, 2.2);
    s += stroke(`M${n1(x)} 0Q${n1(x + lean * 0.4)} ${n1(-h * 0.6)} ${n1(x + lean)} ${n1(-h)}`, i % 2 ? dark : lite, 1.1);
  }
  return s;
}

export const ART = { diya, reeds, tuft, rock, boulder, boulderPile, grass, flowers, waterfall };

// Architecture: shikhara and gopuram temples, forts, chhatris, gompas, havelis, the Taj-like
// mausoleum, ghats. Local origin = centre of the base; y up is negative.
import { poly, polyLine, path, circle, ellipse, rect, line, stroke, shape, n1, dPoly } from '../svg.js';
import { GOLD, DOOR, domeD, archD, pointedD, crenels, finial, dome, box, archRow, flag, windowCol } from './helpers.js';

const SAND = ['#dba35a', '#e8c98c', '#d98c7a', '#efe6d2', '#cf8a4f'];
const WHITE = '#f3eee2';

// ---------------------------------------------------------------------------------------------
// Nagara temple: curvilinear shikhara with satellite spires, porch and flag
function spire(K, cx, yb, w, h, stone, ln, ribs) {
  const N = 22;
  const hw = (t) => (w / 2) * Math.pow(1 - Math.pow(t, 1.75), 0.6);
  const L = [], R = [], M = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, y = yb - h * t, d = hw(t);
    L.push([cx - d, y]); R.push([cx + d, y]); M.push([cx, y]);
  }
  const Rr = R.slice().reverse();
  let s = poly([...L, ...Rr], K(stone));
  s += poly([...M, ...Rr], K.sh(stone, 0.3));
  s += stroke(dPoly(L), ln, 0.8) + stroke(dPoly(R), ln, 0.8);
  if (ribs) {
    for (const u of [-0.5, 0, 0.5]) {
      const P = [];
      for (let i = 0; i <= N - 2; i++) P.push([cx + u * hw(i / N), yb - h * (i / N)]);
      s += stroke(dPoly(P), ln, 0.6, 'stroke-opacity=".55"');
    }
    for (const t of [0.16, 0.32, 0.47, 0.6, 0.72, 0.83]) {
      const d = hw(t), y = yb - h * t;
      s += line(cx - d, y, cx + d, y, ln, 0.9, 'stroke-opacity=".7"');
      s += circle(cx - d, y, 1.5, K(stone), `stroke="${ln}" stroke-width=".5"`) + circle(cx + d, y, 1.5, K.sh(stone, 0.2), `stroke="${ln}" stroke-width=".5"`);
    }
  }
  const ty = yb - h;
  s += ellipse(cx, ty + 1, w * 0.2, 3.4, K(stone), `stroke="${ln}" stroke-width=".7"`);
  return s;
}

export function shikhara(K, r, o = {}) {
  const stone = o.stone ?? r.pick(SAND);
  const ln = K.dk(stone, 0.5);
  const W = 44;
  let s = '';
  const px0 = -W * 1.02, pw = W * 0.62;
  s += box(K, px0, -30, pw, 20, stone, ln);
  s += path(archD(px0 + pw / 2, -10, 7, 12), K(DOOR));
  for (let i = 0; i < 3; i++) {
    const wd = pw * (1.08 - i * 0.26), yy = -30 - i * 6, cx = px0 + pw / 2;
    s += polyLine([[cx - wd / 2, yy], [cx + wd / 2, yy], [cx + wd / 2 - 2, yy - 6], [cx - wd / 2 + 2, yy - 6]], K(stone), ln, 0.7);
  }
  s += ellipse(px0 + pw / 2, -49, 3, 2, K(stone), `stroke="${ln}" stroke-width=".6"`);
  s += spire(K, -W * 0.36, -44, W * 0.34, 40, stone, ln, false) + spire(K, W * 0.36, -44, W * 0.34, 40, stone, ln, false);
  s += rect(-W * 0.62, -5, W * 1.24, 5, K.sh(stone, 0.2), `stroke="${ln}" stroke-width=".6"`);
  s += rect(-W * 0.54, -10, W * 1.08, 5, K(stone), `stroke="${ln}" stroke-width=".6"`);
  s += box(K, -W * 0.42, -44, W * 0.84, 34, stone, ln);
  s += path(archD(0, -10, 9, 18), K(DOOR));
  s += spire(K, 0, -44, W * 0.92, 64, stone, ln, true);
  s += ellipse(0, -112.5, 2.4, 3, K(GOLD)) + line(0, -115, 0, -119, K(GOLD), 1);
  s += flag(K, 0, -119, 13, r.pick(['#e8541c', '#c63a30', '#e8541c']));
  return s;
}

// ---------------------------------------------------------------------------------------------
// Dravidian gopuram: tiers of stucco, barrel-vault crown, striped enclosure wall
export function gopuram(K, r, o = {}) {
  const W = o.w ?? r.range(58, 74);
  const T = o.tiers ?? r.int(5, 7);
  const pal = ['#c9553d', '#e3b341', '#4a9a94', '#b3416b', '#d9d3c4', '#7fa04a'];
  const acc = [r.pick(pal), r.pick(pal), r.pick(pal)];
  const base = r.pick(['#e3d3b0', '#d8c9a4', '#efe3c4']);
  const ln = K.dk(base, 0.5);
  let s = '';
  const wallW = W * 2.7;
  let stripes = '';
  for (let x = -wallW / 2; x < wallW / 2; x += 3.2) stripes += rect(x, -11, 3.2, 11, K(Math.round((x + wallW / 2) / 3.2) % 2 ? '#c9553d' : '#f3ead6'));
  s += stripes + rect(-wallW / 2, -13, wallW, 2.4, K(base), `stroke="${ln}" stroke-width=".5"`);
  let y = 0, w = W;
  for (let i = 0; i < T; i++) {
    const h = i === 0 ? 20 : 13 - i * 0.7;
    const col = i === 0 ? base : i % 2 ? acc[(i >> 1) % 3] : base;
    s += poly([[-w / 2, y], [w / 2, y], [(w / 2) * 0.93, y - h], [(-w / 2) * 0.93, y - h]], K(col), `stroke="${ln}" stroke-width=".6"`);
    s += poly([[0, y], [w / 2, y], [(w / 2) * 0.93, y - h], [0, y - h]], K.sh(col, 0.25));
    if (i === 0) s += path(pointedD(0, y, w * 0.2, h * 0.85), K(DOOR));
    else {
      const n = Math.max(2, Math.round(w / 15));
      s += archRow(K, -w * 0.38, w * 0.38, y - 2, 3.2, h * 0.5, n);
      for (let k = 0; k <= n; k++) s += circle(-w * 0.38 + (k * w * 0.76) / n, y - h * 0.8, 1, K('#f4ecd8'));
    }
    s += rect(-w / 2 - 2, y - h - 1.6, w + 4, 2.4, K.sh(base, 0.28), `stroke="${ln}" stroke-width=".5"`);
    y -= h + 2;
    w *= 0.845;
  }
  const rw = w * 0.5;
  s += shape(domeD(0, y, rw * 1.15, 8), K.sh(base, 0.1), ln, 0.7);
  s += path(`M0 ${n1(y - 8)}A${n1(rw * 1.15)} 8 0 0 1 ${n1(rw * 1.15)} ${n1(y)}H0Z`, K.sh(base, 0.35));
  for (let k = -2; k <= 2; k++) s += circle(k * rw * 0.44, y - 7.5 + Math.abs(k) * 1.1, 1.4, K(GOLD)) + line(k * rw * 0.44, y - 6.5 + Math.abs(k), k * rw * 0.44, y - 2, K(GOLD), 0.7);
  return s;
}

// ---------------------------------------------------------------------------------------------
// Chhatri: domed pavilion
export function chhatri(K, r, o = {}) {
  const stone = o.stone ?? r.pick([...SAND, '#efe6d2']);
  const ln = K.dk(stone, 0.5);
  let s = rect(-12, -4, 24, 4, K.sh(stone, 0.2), `stroke="${ln}" stroke-width=".5"`) + rect(-10, -6.4, 20, 2.4, K(stone));
  s += rect(-9.5, -22, 19, 16, K(DOOR), 'fill-opacity=".4"');
  for (const x of [-8.5, -3, 3, 8.5]) s += rect(x - 1, -23, 2, 17, K(stone), `stroke="${ln}" stroke-width=".4"`);
  s += rect(-11, -26, 22, 3.6, K(stone), `stroke="${ln}" stroke-width=".6"`);
  s += dome(K, 0, -26, 8.6, stone, ln, true);
  return s;
}

// ---------------------------------------------------------------------------------------------
// Rajasthani hill-fort on a sandstone mesa
function tower(K, x, h, stone, ln, cap) {
  let s = rect(x - 6.5, -h, 13, h, K(stone), `stroke="${ln}" stroke-width=".6"`) + rect(x, -h, 6.5, h, K.sh(stone, 0.26));
  s += path(archD(x, -h * 0.35, 3.6, 7), K(DOOR));
  s += rect(x - 8, -h - 2, 16, 2.4, K.sh(stone, 0.12), `stroke="${ln}" stroke-width=".5"`);
  if (cap === 0) s += dome(K, x, -h - 2, 6.5, stone, ln, true);
  else s += crenels(x - 7, x + 7, -h - 2, 3, K(stone), 2.6, 1.8);
  return s;
}

export function fortMesa(K, r, o = {}) {
  const rock = o.rock ?? r.pick(['#a8683f', '#b87a4a', '#9c6a48']);
  const stone = o.stone ?? r.pick(['#c9733f', '#dfb25c', '#d98c5a', '#c46a45']);
  const ln = K.dk(stone, 0.5);
  const big = o.big ? 1.55 : 1;
  const Wb = r.range(170, 230) * big, Wt = Wb * r.range(0.6, 0.7), Hm = r.range(52, 74) * (o.big ? 1.2 : 1);
  const L = [], R = [];
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const inset = ((Wb - Wt) / 2) * Math.pow(t, 0.85);
    const j = i === 0 || i === steps ? 0 : 1;
    L.push([-Wb / 2 + inset + j * r.range(-6, 6), -Hm * t]);
    R.push([Wb / 2 - inset + j * r.range(-6, 6), -Hm * t]);
  }
  const Rtop = R.slice().reverse();
  let s = poly([...L, ...Rtop], K(rock));
  s += poly([[Wb * 0.05, -Hm], ...Rtop, [Wb * 0.14, 0]], K.sh(rock, 0.3));
  for (const t of [0.28, 0.52, 0.76]) {
    const y = -Hm * t, half = Wb / 2 - ((Wb - Wt) / 2) * Math.pow(t, 0.85) - 9;
    s += stroke(`M${n1(-half)} ${n1(y)}Q${n1(-half / 2)} ${n1(y - 3)} 0 ${n1(y)}T${n1(half)} ${n1(y)}`, K.dk(rock, 0.45), 0.8, 'stroke-opacity=".45"');
  }
  // the fort on top
  const x0 = -Wt / 2 + 3, x1 = Wt / 2 - 3, w = x1 - x0, yt = -Hm;
  const wallH = 15;
  s += rect(x0, yt - wallH, w, wallH, K(stone), `stroke="${ln}" stroke-width=".6"`);
  s += rect(x0 + w * 0.6, yt - wallH, w * 0.4, wallH, K.sh(stone, 0.24));
  s += crenels(x0, x1, yt - wallH, 3, K(stone), 3, 2.2);
  // palace block with chhatris
  const pw = w * 0.34, px = x0 + w * r.range(0.3, 0.45);
  s += box(K, px, yt - wallH - 20, pw, 20, stone, ln);
  s += archRow(K, px + 3, px + pw - 3, yt - wallH - 3, 3.4, 8, 4);
  for (const f of [0.18, 0.5, 0.82]) s += dome(K, px + pw * f, yt - wallH - 20, 5, stone, ln, true);
  s += flag(K, px + pw * 0.5, yt - wallH - 30, 12, '#e8541c');
  // towers
  const tw = [x0 + 6, x0 + w * 0.3, x1 - w * 0.22, x1 - 6];
  tw.forEach((x, i) => (s += `<g transform="translate(0 ${n1(yt)})">${tower(K, x, 22 + ((i * 7) % 11), stone, ln, i % 2)}</g>`));
  // gate arch
  s += path(pointedD(x0 + w * 0.5, yt, 11, 14), K(DOOR));
  return s;
}

// ---------------------------------------------------------------------------------------------
// Himalayan monastery, stupa, prayer flags
export function gompa(K, r, o = {}) {
  const W = o.w ?? r.range(46, 62);
  const ln = K.dk(WHITE, 0.5);
  let s = '';
  let y = 0;
  const tiers = [[W, 26], [W * 0.78, 20], [W * 0.5, 16]];
  tiers.forEach(([w, h], i) => {
    s += box(K, -w / 2, y - h, w, h, WHITE, ln);
    s += rect(-w / 2, y - h, w, 4, K('#9c2f2a'));
    const n = Math.max(2, Math.round(w / 12));
    for (let k = 0; k < n; k++) {
      const wx = -w / 2 + ((k + 0.5) * w) / n;
      s += poly([[wx - 2.2, y - 3], [wx + 2.2, y - 3], [wx + 1.5, y - h * 0.62], [wx - 1.5, y - h * 0.62]], windowCol(K, k + i * 3, '#3a2418'));
    }
    if (i === 0) s += path(archD(0, y, 8, 13), K('#6b2a20'));
    y -= h;
  });
  const tw = tiers[2][0];
  s += rect(-tw * 0.3, y - 5, tw * 0.6, 5, K(GOLD), `stroke="${K.dk(GOLD, 0.4)}" stroke-width=".5"`);
  s += poly([[-tw * 0.34, y - 5], [tw * 0.34, y - 5], [tw * 0.2, y - 9], [-tw * 0.2, y - 9]], K('#b8872a'));
  s += finial(K, 0, y - 9, 8);
  return s;
}

export function chorten(K, r, o = {}) {
  const ln = K.dk(WHITE, 0.5);
  let s = box(K, -10, -6, 20, 6, WHITE, ln) + box(K, -8, -11, 16, 5, WHITE, ln) + box(K, -6, -15, 12, 4, WHITE, ln);
  s += shape(domeD(0, -15, 8, 9), K(WHITE), ln, 0.7) + path(`M0 -24A8 9 0 0 1 8 -15H0Z`, K.sh(WHITE, 0.28));
  s += rect(-4, -26, 8, 4, K('#9c2f2a'), `stroke="${K.dk('#9c2f2a', 0.4)}" stroke-width=".4"`);
  for (let i = 0; i < 9; i++) s += rect(-3.3 + i * 0.26, -28 - i * 2.4, 6.6 - i * 0.52, 2.2, K(GOLD), `stroke="${K.dk(GOLD, 0.4)}" stroke-width=".3"`);
  s += circle(0, -51, 1.4, K(GOLD));
  return s;
}

export function flags(K, r, o = {}) {
  const span = o.span ?? r.range(48, 84);
  const h1 = r.range(28, 36), h2 = r.range(18, 28), sag = r.range(5, 9);
  const colors = ['#3b6fb5', '#f4f1ea', '#c63a30', '#4d9a54', '#e8c23a'];
  const pole = K('#4a3424');
  let s = line(0, 0, 0, -h1, pole, 1.4) + line(span, 0, span, -h2, pole, 1.4);
  const yAt = (t) => -(h1 + (h2 - h1) * t) + sag * 4 * t * (1 - t);
  let d = `M0 ${n1(-h1)}`;
  for (let i = 1; i <= 12; i++) d += `L${n1((span * i) / 12)} ${n1(yAt(i / 12))}`;
  s += stroke(d, K('#3a2c20'), 0.7);
  const n = Math.floor(span / 4.6);
  for (let i = 1; i < n; i++) {
    const t = i / n, x = span * t, y = yAt(t);
    s += rect(x - 1.9, y, 3.8, 4.8, K(colors[i % 5]), `transform="rotate(${n1(Math.sin(i * 1.7) * 6)} ${n1(x)} ${n1(y)})"`);
  }
  return s;
}

export function gompaHill(K, r, o = {}) {
  const rock = r.pick(['#8c7a64', '#9a8468', '#7f705e']);
  const W = r.range(54, 76);
  let s = poly([[-W * 0.7, 6], [-W * 0.55, -6], [-W * 0.3, -16], [0, -20], [W * 0.3, -16], [W * 0.55, -7], [W * 0.7, 6]], K(rock));
  s += poly([[0, -20], [W * 0.3, -16], [W * 0.55, -7], [W * 0.7, 6], [W * 0.1, 6]], K.sh(rock, 0.3));
  s += `<g transform="translate(0 -17) scale(.78)">${gompa(K, r, { w: W * 0.7 })}</g>`;
  s += `<g transform="translate(${n1(W * 0.62)} -4) scale(.5)">${chorten(K, r)}</g>`;
  return s;
}

export function gompa_big(K, r) {
  return gompaHill(K, r) + `<g transform="translate(-52 2) scale(.8)">${chorten(K, r)}</g><g transform="translate(60 -2) scale(.7)">${flags(K, r, { span: 56 })}</g>`;
}

// ---------------------------------------------------------------------------------------------
// Houses
export function house_hill(K, r) {
  const stoneC = '#9a9486';
  const wall = r.pick(['#efe5cc', '#e2d5b8', '#d9c9a4']);
  const roof = r.pick(['#6a6d73', '#7a5a46', '#5d6168']);
  const ln = K.dk(wall, 0.5);
  const W = r.range(26, 38);
  let s = box(K, -W / 2, -12, W, 12, stoneC, K.dk(stoneC, 0.5));
  s += box(K, -W / 2 + 2, -26, W - 4, 14, wall, ln);
  s += rect(-W / 2 + 1, -14, W - 2, 2.6, K('#7a5230'));
  s += rect(-W / 2 + 6, -23, 4.2, 6, windowCol(K, 0, '#4a3020')) + rect(W / 2 - 10.2, -23, 4.2, 6, windowCol(K, 1, '#4a3020'));
  s += rect(-2, -11, 4, 11, K('#4a3020'));
  s += polyLine([[-W / 2 - 3, -26], [W / 2 + 3, -26], [W / 2 - 4, -37], [-W / 2 + 4, -37]], K(roof), K.dk(roof, 0.5), 0.7);
  s += poly([[0, -26], [W / 2 + 3, -26], [W / 2 - 4, -37], [0, -37]], K.sh(roof, 0.25));
  s += rect(W / 2 - 9, -43, 4, 7, K('#8a7f72'));
  return s;
}

export function house_tile(K, r) {
  const wall = r.pick(['#f1e9d6', '#efe0bd', '#e9d2c0']);
  const tile = r.pick(['#b5532f', '#c0603a', '#a94a2c']);
  const ln = K.dk(wall, 0.5);
  const W = r.range(34, 46);
  let s = box(K, -W / 2, -16, W, 16, wall, ln);
  for (const x of [-W / 2 + 3, 0, W / 2 - 3]) s += rect(x - 1, -16, 2, 16, K('#7a5230'));
  s += rect(-W / 2 + 6, -14, 5, 7, windowCol(K, 1, '#4a3020')) + rect(W / 2 - 11, -14, 5, 7, windowCol(K, 2, '#4a3020'));
  s += polyLine([[-W / 2 - 5, -16], [W / 2 + 5, -16], [W / 2 - 3, -34], [-W / 2 + 3, -34]], K(tile), K.dk(tile, 0.5), 0.7);
  s += poly([[0, -16], [W / 2 + 5, -16], [W / 2 - 3, -34], [0, -34]], K.sh(tile, 0.25));
  for (let i = 1; i < 5; i++) {
    const y = -16 - i * 3.6, inset = i * 0.9;
    s += line(-W / 2 - 5 + inset, y, W / 2 + 5 - inset, y, K.dk(tile, 0.5), 0.6, 'stroke-opacity=".6"');
  }
  s += polyLine([[-8, -30], [8, -30], [0, -40]], K(wall), ln, 0.6);
  return s;
}

export function haveli(K, r) {
  const wall = r.pick(['#e7a3a0', '#efcd6a', '#8fb1d1', '#e9d3a8', '#d98c7a']);
  const ln = K.dk(wall, 0.5);
  const W = r.range(40, 54), H = r.range(30, 40);
  let s = box(K, -W / 2, -H, W, H, wall, ln);
  s += rect(-W / 2, -H * 0.5, W, 1.6, K.dk(wall, 0.25));
  s += archRow(K, -W / 2 + 4, W / 2 - 4, -2, 4.4, 9, 4);
  s += archRow(K, -W / 2 + 4, -7, -H * 0.5 - 3, 4, 8, 2) + archRow(K, 7, W / 2 - 4, -H * 0.5 - 3, 4, 8, 2);
  s += box(K, -6, -H * 0.84, 12, 14, wall, ln) + path(archD(0, -H * 0.84 + 12, 5, 9), K(DOOR));
  s += dome(K, 0, -H * 0.84, 6.5, wall, ln, true);
  s += crenels(-W / 2, W / 2, -H, 3, K(wall), 3, 2.2);
  s += dome(K, -W / 2 + 5, -H - 3, 4.2, wall, ln, true) + dome(K, W / 2 - 5, -H - 3, 4.2, wall, ln, true);
  return s;
}

export function hut(K, r) {
  const mud = r.pick(['#c49a6c', '#b98a5c', '#d1a97a']);
  let s = rect(-9, -12, 18, 12, K(mud)) + rect(1, -12, 8, 12, K.sh(mud, 0.25)) + path(archD(0, 0, 5, 8), K(DOOR));
  s += polyLine([[-13, -11], [13, -11], [0, -27]], K('#c8a24a'), K.dk('#c8a24a', 0.5), 0.6);
  s += poly([[0, -11], [13, -11], [0, -27]], K.sh('#c8a24a', 0.28));
  for (let i = 1; i < 4; i++) s += line(-13 + i * 2.2, -11 - i * 2.8, 13 - i * 2.2, -11 - i * 2.8, K.dk('#c8a24a', 0.5), 0.5, 'stroke-opacity=".55"');
  return s;
}

export function mandapa(K, r) {
  const stone = r.pick(['#b9a98c', '#c4b394', '#b09c7e']);
  const ln = K.dk(stone, 0.5);
  let s = rect(-32, -6, 64, 6, K.sh(stone, 0.2), `stroke="${ln}" stroke-width=".5"`);
  s += rect(-30, -9, 60, 3, K(stone), `stroke="${ln}" stroke-width=".5"`);
  for (let i = 0; i < 7; i++) {
    const x = -27 + i * 9, h = i === 3 && r() < 0.5 ? 14 : 26;
    s += rect(x - 1.7, -9 - h, 3.4, h, K(stone), `stroke="${ln}" stroke-width=".4"`) + rect(x - 2.6, -9 - h - 1.6, 5.2, 1.8, K.sh(stone, 0.15));
  }
  s += rect(-31, -37, 62, 4.4, K(stone), `stroke="${ln}" stroke-width=".6"`);
  s += poly([[-33, -37], [33, -37], [28, -44], [-28, -44]], K.sh(stone, 0.12), `stroke="${ln}" stroke-width=".6"`);
  s += dome(K, 0, -44, 5, stone, ln, true);
  return s;
}

// ---------------------------------------------------------------------------------------------
// Mausoleum on a plinth with four minarets
function minaret(K, x, white, ln) {
  let s = rect(x - 2.6, -68, 5.2, 60, K(white), `stroke="${ln}" stroke-width=".5"`) + rect(x, -68, 2.6, 60, K.sh(white, 0.25));
  s += ellipse(x, -30, 4.6, 1.4, K(white), `stroke="${ln}" stroke-width=".4"`) + ellipse(x, -50, 4.2, 1.3, K(white), `stroke="${ln}" stroke-width=".4"`);
  s += rect(x - 3.4, -72, 6.8, 4, K(white), `stroke="${ln}" stroke-width=".5"`);
  s += dome(K, x, -72, 3.9, white, ln, true);
  return s;
}

export function taj(K, r) {
  const white = '#f6f1e6', ln = K.dk(white, 0.4);
  const W = 150;
  let s = '';
  s += box(K, -W * 0.5, -8, W, 8, white, ln);
  s += minaret(K, -W * 0.46, white, ln) + minaret(K, W * 0.46, white, ln);
  s += box(K, -W * 0.38, -32, W * 0.76, 24, white, ln);
  s += archRow(K, -W * 0.36, -W * 0.19, -9, 5, 12, 2, '#6b6a78') + archRow(K, W * 0.19, W * 0.36, -9, 5, 12, 2, '#6b6a78');
  s += box(K, -W * 0.17, -54, W * 0.34, 46, white, ln);
  s += path(pointedD(0, -8, 15, 36), K('#8a89a0'), 'fill-opacity=".85"');
  s += path(pointedD(0, -8, 8, 24), K('#5a5972'), 'fill-opacity=".7"');
  for (const sx of [-1, 1]) s += dome(K, sx * W * 0.15, -54, 4.4, white, ln, true);
  s += rect(-13, -62, 26, 8, K(white), `stroke="${ln}" stroke-width=".5"`);
  s += dome(K, 0, -62, 14, white, ln, false, true);
  s += line(0, -62 - 14 * 1.95, 0, -62 - 14 * 1.95 - 9, K(GOLD), 1.2) + circle(0, -62 - 14 * 1.95 - 4, 1.4, K(GOLD));
  return s;
}

// ---------------------------------------------------------------------------------------------
// Ghat: stone steps down to the water, an arcaded palace front, chhatris, a small shikhara
export function ghat(K, r, o = {}) {
  const W = o.w ?? r.range(84, 112);
  const stone = '#d8c4a0';
  const wall = r.pick(['#e9d3a8', '#e7a3a0', '#efcd6a', '#f0e6d0', '#d98c7a']);
  const ln = K.dk(wall, 0.5);
  let s = '';
  for (let i = 0; i < 6; i++) {
    const inset = i * 1.8;
    s += rect(-W / 2 + inset, -i * 3.1 - 3.1, W - inset * 2, 3.3, K(i % 2 ? '#e2d2b0' : stone), `stroke="${K.dk(stone, 0.4)}" stroke-width=".4"`);
  }
  const by = -18.6, H = 24;
  s += box(K, -W * 0.46, by - H, W * 0.92, H, wall, ln);
  s += archRow(K, -W * 0.42, W * 0.42, by - 1, 5, 10, Math.round(W / 13));
  s += rect(-W * 0.46, by - H * 0.55, W * 0.92, 1.6, K.dk(wall, 0.25));
  s += crenels(-W * 0.46, W * 0.46, by - H, 3, K(wall), 3, 2.2);
  const n = 2 + (o.big ? 2 : 0);
  for (let i = 0; i < n; i++) s += `<g transform="translate(${n1(-W * 0.34 + (i * W * 0.68) / Math.max(1, n - 1))} ${n1(by - H)}) scale(.7)">${chhatri(K, r, { stone: wall })}</g>`;
  s += `<g transform="translate(${n1(W * 0.52)} ${n1(by)}) scale(.46)">${shikhara(K, r)}</g>`;
  // lamps along the steps once the light goes
  if (K.lamps > 0.3) {
    const glow = K.lamps > 0.5;
    for (let i = 0; i < W / 7; i++) s += circle(-W / 2 + 4 + i * 7 + (i % 2) * 2, -3.4 - (i % 3) * 3.1, 0.9, K.glow, `fill-opacity="${glow ? 1 : 0.7}"`);
  }
  return s;
}

export function ghat_big(K, r) {
  return ghat(K, r, { w: r.range(150, 190), big: true });
}

export function fort_big(K, r) {
  return fortMesa(K, r, { big: true });
}

export function gopuram_big(K, r) {
  return (
    `<g transform="translate(-92 0) scale(.6)">${gopuram(K, r, { tiers: 5 })}</g>` +
    `<g transform="translate(92 0) scale(.6)">${gopuram(K, r, { tiers: 5 })}</g>` +
    gopuram(K, r, { w: 94, tiers: 8 })
  );
}

export const ART = {
  shikhara, gopuram, chhatri, fortMesa, gompa, chorten, flags, gompaHill, gompa_big,
  house_hill, house_tile, haveli, hut, mandapa, taj, ghat, ghat_big, fort_big, gopuram_big,
};

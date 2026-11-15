// Things on the water. Local origin = waterline at the boat's centre.
import { poly, path, circle, ellipse, rect, line, stroke, n1 } from '../svg.js';
import { figure } from './fauna.js';

const reflect = (K, w) => ellipse(0, 3.4, w, 2, K.sh('#2a5a7a', 0.2), 'fill-opacity=".35"');

export function sailboat(K, r) {
  const hull = r.pick(['#6b4528', '#7a4a2a', '#5a3a22']);
  const sail = r.pick(['#f3ead6', '#f3ead6', '#e8741a', '#efe0bd']);
  let s = reflect(K, 22);
  s += path('M-23 -9C-19 1 -8 4 0 4C8 4 19 1 24 -10C15 -4 -15 -4 -23 -9Z', K(hull));
  s += stroke('M-22 -8C-12 -3.4 12 -3.4 23 -9', K('#e8c23a'), 1);
  s += line(-2, -5, -2, -35, K('#4a3424'), 1.3);
  s += poly([[-1, -34], [23, -10], [-1, -10]], K(sail)) + poly([[-1, -34], [23, -10], [10, -10]], K.sh(sail, 0.22));
  s += poly([[-3.4, -30], [-22, -10], [-3.4, -10]], K.sh(sail, 0.08));
  for (const y of [-16, -22, -28]) s += line(-1, y, 6 + (-28 - y) * -0.9, y, K.dk(sail, 0.3), 0.5, 'stroke-opacity=".6"');
  s += `<g transform="translate(12 -6) scale(.55)">${figure(K, r, { kind: 'man' })}</g>`;
  return s;
}

export function shikara(K, r) {
  const canopy = r.pick(['#c63a30', '#e8a82a', '#2f6fb0', '#3f9a5a', '#c2428a']);
  const trim = '#f3ead6';
  let s = reflect(K, 34);
  s += path('M-36 -11C-31 0 -10 3 0 3C10 3 31 0 36 -11C26 -4 -26 -4 -36 -11Z', K(r.pick(['#8a5a30', '#6b4528'])));
  s += stroke('M-35 -10C-25 -4 25 -4 35 -10', K('#e8c23a'), 1);
  s += poly([[-17, -6], [15, -6], [13, -19], [-15, -19]], K(canopy));
  s += poly([[-17, -19], [15, -19], [11, -23], [-13, -23]], K.sh(canopy, 0.15));
  s += poly([[0, -6], [15, -6], [13, -19], [0, -19]], K.sh(canopy, 0.25));
  let fr = '';
  for (let i = 0; i < 9; i++) fr += poly([[-15 + i * 3.4, -19], [-12.2 + i * 3.4, -19], [-13.6 + i * 3.4, -15.6]], K(trim));
  s += fr;
  s += rect(-13, -17, 24, 1.1, K(trim), 'fill-opacity=".8"');
  s += `<g transform="translate(24 -5) scale(.6)">${figure(K, r, { kind: 'man' })}</g>`;
  s += line(25, -8, 36, 3, K('#5a3d2b'), 0.9);
  return s;
}

export function houseboat(K, r) {
  const roof = r.pick(['#c9a45a', '#c9a45a', '#4a8a5a', '#b8863a']);
  const hull = r.pick(['#2a2420', '#3a2a22', '#5a3a22']);
  let s = reflect(K, 40);
  s += path('M-42 -9C-40 1 -20 4 0 4C20 4 40 1 42 -9L38 -8C20 -4 -20 -4 -38 -8Z', K(hull));
  s += rect(-36, -17, 72, 9, K('#e9d3a8'), `stroke="${K.dk('#e9d3a8', 0.5)}" stroke-width=".6"`) + rect(8, -17, 28, 9, K.sh('#e9d3a8', 0.22));
  for (let i = 0; i < 9; i++) s += rect(-32 + i * 8, -15, 4, 4.4, K('#4a3020'));
  s += path('M-39 -17A39 15 0 0 1 39 -17Z', K(roof), `stroke="${K.dk(roof, 0.5)}" stroke-width=".7"`);
  s += path('M0 -32A39 15 0 0 1 39 -17H0Z', K.sh(roof, 0.25));
  for (let i = 1; i < 6; i++) s += stroke(`M${n1(-39 + i * 13)} -17Q${n1(-39 + i * 13)} -29 ${n1(-39 + i * 13)} -31`, K.dk(roof, 0.5), 0.5, 'stroke-opacity=".5"');
  s += line(0, -32, 0, -42, K('#4a3424'), 1) + poly([[0, -42], [9, -39.4], [0, -37]], K('#e8541c'));
  if (K.lamps > 0.3) for (let i = 0; i < 9; i++) s += rect(-32 + i * 8, -15, 4, 4.4, K.glow, 'fill-opacity=".9"');
  return s;
}

export function houseboat_row(K, r) {
  return (
    `<g transform="translate(-70 6) scale(.7)">${houseboat(K, r)}</g>` +
    `<g transform="translate(18 -2) scale(.85)">${houseboat(K, r)}</g>` +
    `<g transform="translate(96 8) scale(.62)">${shikara(K, r)}</g>`
  );
}

export function raft(K, r) {
  let s = reflect(K, 16);
  for (let i = 0; i < 4; i++) s += rect(-14, -3 + i * 0.1 - (i % 2) * 0.6, 28, 3, K('#8a6a40'), `stroke="${K.dk('#8a6a40', 0.5)}" stroke-width=".4"`);
  s += `<g transform="translate(-2 -3) scale(.6)">${figure(K, r, { kind: 'man' })}</g>`;
  s += line(8, -16, 15, 4, K('#5a3d2b'), 0.9);
  return s;
}

export function fishnet(K, r) {
  const wood = K('#6a4a32');
  let s = reflect(K, 22);
  s += line(-9, 2, -1, -28, wood, 2.2) + line(8, 2, -1, -28, wood, 2.2);
  s += line(-24, -34, -1, -28, wood, 1.8) + line(-1, -28, 34, -12, wood, 1.8);
  s += line(-24, -34, -20, -14, K('#3a2c20'), 0.6) + circle(-20, -12, 2, K('#8a8478'));
  const net = [[24, -4], [42, -7], [46, 1], [28, 4]];
  s += poly(net, K('#2a2a22'), 'fill-opacity=".35"') + line(34, -12, 24, -4, wood, 0.6) + line(34, -12, 42, -7, wood, 0.6) + line(34, -12, 46, 1, wood, 0.6) + line(34, -12, 28, 4, wood, 0.6);
  for (let i = 1; i < 4; i++) s += line(24 + i * 1.5, -4 + i * 2, 42 + i * 1.2, -7 + i * 2.4, K('#2a2a22'), 0.4, 'stroke-opacity=".7"');
  return s;
}

export function lotus(K, r) {
  let s = '';
  for (let i = 0; i < 4; i++) s += ellipse(r.range(-14, 14), r.range(-1, 3), r.range(4.5, 8), r.range(1.5, 2.6), K(r.pick(['#3f7a3a', '#4a8a3e', '#356f3a'])));
  const n = r.int(1, 2);
  for (let k = 0; k < n; k++) {
    const x = r.range(-9, 9), y = -2 - r.range(0, 3);
    const col = r.pick(['#e9779a', '#f4a7c0', '#f7f0f2']);
    s += line(x, y + 2, x, y + 4, K('#3f7a3a'), 0.9);
    for (let p = -3; p <= 3; p++) {
      const a = (-90 + p * 24) * (Math.PI / 180), len = p === 0 ? 6.2 : 5.2 - Math.abs(p) * 0.35;
      s += path(`M${n1(x)} ${n1(y)}Q${n1(x + Math.cos(a) * len * 0.7 - Math.sin(a) * 2)} ${n1(y + Math.sin(a) * len * 0.7 + Math.cos(a) * 2)} ${n1(x + Math.cos(a) * len)} ${n1(y + Math.sin(a) * len)}Q${n1(x + Math.cos(a) * len * 0.7 + Math.sin(a) * 2)} ${n1(y + Math.sin(a) * len * 0.7 - Math.cos(a) * 2)} ${n1(x)} ${n1(y)}Z`, K(col), `stroke="${K.dk(col, 0.35)}" stroke-width=".35"`);
    }
    s += circle(x, y - 0.8, 1.1, K('#e8c23a'));
  }
  return s;
}

export const ART = { sailboat, shikara, houseboat, houseboat_row, raft, fishnet, lotus };

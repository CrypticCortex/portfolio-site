// String-based SVG helpers shared by Node (export) and the browser (viewer).

export const n1 = (v) => Math.round(v * 10) / 10;
export const n2 = (v) => Math.round(v * 100) / 100;

const at = (a) => (a ? ' ' + a : '');

export const pts = (p) => p.map((q) => `${n1(q[0])},${n1(q[1])}`).join(' ');

export const poly = (p, fill, extra) => `<polygon points="${pts(p)}" fill="${fill}"${at(extra)}/>`;
export const circle = (x, y, r, fill, extra) =>
  `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="${fill}"${at(extra)}/>`;
export const ellipse = (x, y, rx, ry, fill, extra) =>
  `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="${fill}"${at(extra)}/>`;
export const rect = (x, y, w, h, fill, extra) =>
  `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${fill}"${at(extra)}/>`;
export const path = (d, fill, extra) => `<path d="${d}" fill="${fill}"${at(extra)}/>`;
export const line = (x1, y1, x2, y2, color, w = 1, extra) =>
  `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" stroke="${color}" stroke-width="${n2(w)}" stroke-linecap="round"${at(extra)}/>`;
/** Stroked, unfilled path. */
export const stroke = (d, color, w = 1, extra) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n2(w)}" stroke-linecap="round" stroke-linejoin="round"${at(extra)}/>`;
/** Filled path with an outline. */
export const shape = (d, fill, line, w = 0.8, extra) =>
  `<path d="${d}" fill="${fill}" stroke="${line}" stroke-width="${n2(w)}" stroke-linejoin="round"${at(extra)}/>`;
export const polyLine = (p, fill, line, w = 0.8, extra) =>
  `<polygon points="${pts(p)}" fill="${fill}" stroke="${line}" stroke-width="${n2(w)}" stroke-linejoin="round"${at(extra)}/>`;

export const group = (inner, extra) => `<g${at(extra)}>${inner}</g>`;

/** transform attribute: translate + uniform scale (+ optional horizontal flip). */
export const place = (x, y, s = 1, flip = false) =>
  `transform="translate(${n1(x)} ${n1(y)})${s !== 1 || flip ? ` scale(${n2(flip ? -s : s)} ${n2(s)})` : ''}"`;

/** 'M x,y L x,y …' from points. */
export function dPoly(p, close = false) {
  let d = '';
  for (let i = 0; i < p.length; i++) d += (i ? 'L' : 'M') + n1(p[i][0]) + ' ' + n1(p[i][1]);
  return close ? d + 'Z' : d;
}

/** Catmull-Rom spline through points, as cubic Béziers. */
export function dSmooth(p, close = false) {
  const n = p.length;
  if (n < 3) return dPoly(p, close);
  const g = (i) => (close ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${n1(p[0][0])} ${n1(p[0][1])}`;
  const last = close ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += `C${n1(p1[0] + (p2[0] - p0[0]) / 6)} ${n1(p1[1] + (p2[1] - p0[1]) / 6)} ${n1(p2[0] - (p3[0] - p1[0]) / 6)} ${n1(p2[1] - (p3[1] - p1[1]) / 6)} ${n1(p2[0])} ${n1(p2[1])}`;
  }
  return close ? d + 'Z' : d;
}

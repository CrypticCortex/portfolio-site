// Shared shape builders for the architecture and boats.
import { poly, path, circle, rect, line, shape, n1 } from '../svg.js';

export const GOLD = '#d9a826';
export const DOOR = '#3a2418';

/** Half-dome sitting on baseline yb. */
export const domeD = (cx, yb, r, rh = r * 0.95) =>
  `M${n1(cx - r)} ${n1(yb)}A${n1(r)} ${n1(rh)} 0 0 1 ${n1(cx + r)} ${n1(yb)}Z`;

/** Onion (bulbous) dome. */
export const onionD = (cx, yb, r) =>
  `M${n1(cx - r)} ${n1(yb)}C${n1(cx - r * 1.25)} ${n1(yb - r * 0.9)} ${n1(cx - r * 0.35)} ${n1(yb - r * 1.45)} ${n1(cx)} ${n1(yb - r * 1.95)}` +
  `C${n1(cx + r * 0.35)} ${n1(yb - r * 1.45)} ${n1(cx + r * 1.25)} ${n1(yb - r * 0.9)} ${n1(cx + r)} ${n1(yb)}Z`;

/** Round-headed arch opening (door/window), base at yb. */
export const archD = (cx, yb, w, h) =>
  `M${n1(cx - w / 2)} ${n1(yb)}V${n1(yb - h + w / 2)}A${n1(w / 2)} ${n1(w / 2)} 0 0 1 ${n1(cx + w / 2)} ${n1(yb - h + w / 2)}V${n1(yb)}Z`;

/** Pointed (Mughal) arch opening. */
export const pointedD = (cx, yb, w, h) =>
  `M${n1(cx - w / 2)} ${n1(yb)}V${n1(yb - h * 0.55)}Q${n1(cx - w / 2)} ${n1(yb - h * 0.85)} ${n1(cx)} ${n1(yb - h)}Q${n1(cx + w / 2)} ${n1(yb - h * 0.85)} ${n1(cx + w / 2)} ${n1(yb - h * 0.55)}V${n1(yb)}Z`;

/** Crenellations (merlons) along y, from x0 to x1. */
export function crenels(x0, x1, y, h, col, w = 3, gap = 2.5) {
  let s = '';
  for (let x = x0; x + w <= x1 + 0.1; x += w + gap) s += rect(x, y - h, w, h + 0.5, col);
  return s;
}

/** Little golden finial: pole, ball, tip. */
export function finial(K, cx, y, h = 7) {
  return line(cx, y, cx, y - h, K(GOLD), 0.9) + circle(cx, y - h * 0.55, 1.1, K(GOLD)) + circle(cx, y - h, 0.8, K(GOLD));
}

/** Shaded half-dome with outline and finial. */
export function dome(K, cx, yb, r, fill, ln, fin = true, onion = false) {
  const d = onion ? onionD(cx, yb, r) : domeD(cx, yb, r);
  let s = shape(d, K(fill), ln, 0.7);
  const top = onion ? yb - r * 1.95 : yb - r * 0.95;
  const half = onion
    ? `M${n1(cx)} ${n1(top)}C${n1(cx + r * 0.35)} ${n1(yb - r * 1.45)} ${n1(cx + r * 1.25)} ${n1(yb - r * 0.9)} ${n1(cx + r)} ${n1(yb)}H${n1(cx)}Z`
    : `M${n1(cx)} ${n1(top)}A${n1(r)} ${n1(r * 0.95)} 0 0 1 ${n1(cx + r)} ${n1(yb)}H${n1(cx)}Z`;
  s += path(half, K.sh(fill, 0.3));
  if (fin) s += finial(K, cx, top + 0.6, r * 0.7 + 2);
  return s;
}

/** Shaded box with an outline. Returns svg. */
export function box(K, x, y, w, h, fill, ln) {
  return rect(x, y, w, h, K(fill), `stroke="${ln}" stroke-width=".7"`) + rect(x + w * 0.62, y, w * 0.38, h, K.sh(fill, 0.26));
}

/** Window colour: dark by day, a few glowing once the lamps are lit. */
export const windowCol = (K, i, fill = DOOR, canLight = true) => (canLight && K.lamps > 0.45 && (i * 7 + 3) % 5 < 3 ? K.glow : K(fill));

/** A row of small arch openings. */
export function archRow(K, x0, x1, yb, w, h, n, fill = DOOR) {
  let s = '';
  for (let i = 0; i < n; i++) s += path(archD(x0 + ((i + 0.5) * (x1 - x0)) / n, yb, w, h), windowCol(K, i, fill, fill === DOOR));
  return s;
}

/** Flag on a pole. */
export function flag(K, x, y, h, col = '#e8541c', dir = 1) {
  return line(x, y, x, y - h, K('#3a2c20'), 0.9) + poly([[x, y - h], [x + dir * 9, y - h + 3], [x, y - h + 6]], K(col));
}

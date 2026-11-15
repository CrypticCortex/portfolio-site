// Tiny colour toolkit. Colours travel as '#rrggbb' strings or [r,g,b] arrays (0-255).

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const cache = new Map();
export function hex2rgb(h) {
  let v = cache.get(h);
  if (v) return v;
  let s = h.charAt(0) === '#' ? h.slice(1) : h;
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  const n = parseInt(s, 16);
  v = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  cache.set(h, v);
  return v;
}

const hx = (v) => {
  const n = Math.round(clamp(v, 0, 255));
  return (n < 16 ? '0' : '') + n.toString(16);
};
export const rgb2hex = (c) => '#' + hx(c[0]) + hx(c[1]) + hx(c[2]);

export const toRGB = (c) => (typeof c === 'string' ? hex2rgb(c) : c);
export const toHex = (c) => (typeof c === 'string' ? c : rgb2hex(c));

export const mixRGB = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

/** Mix two colours (hex or rgb) and return hex. */
export const mixHex = (a, b, t) => rgb2hex(mixRGB(toRGB(a), toRGB(b), t));

export function saturate(c, k) {
  const l = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  return [l + (c[0] - l) * k, l + (c[1] - l) * k, l + (c[2] - l) * k];
}

/** Multiply by a light colour (255 = identity). */
export const multiply = (c, l) => [(c[0] * l[0]) / 255, (c[1] * l[1]) / 255, (c[2] * l[2]) / 255];

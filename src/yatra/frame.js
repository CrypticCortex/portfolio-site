// Optional miniature-painting border for exported scrolls: maroon outer band, gold rules and a
// cream strip of alternating blossoms and leaves, with lotus medallions in the corners.
import { n1 } from './svg.js';

const MAROON = '#7a1a2a', GOLD = '#d9a826', CREAM = '#f3e6c4', LEAF = '#4d7f3a';
const PETAL = ['#c2415a', '#f7f0e2'];

function blossom(x, y, r, i) {
  let s = '';
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    s += `<circle cx="${n1(x + Math.cos(a) * r * 0.62)}" cy="${n1(y + Math.sin(a) * r * 0.62)}" r="${n1(r * 0.42)}" fill="${PETAL[(i + k) % 2 ? 0 : 1]}" stroke="${MAROON}" stroke-width=".35"/>`;
  }
  return s + `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 0.3)}" fill="${GOLD}"/>`;
}

const leaf = (x, y, a, l) => {
  const dx = Math.cos(a) * l, dy = Math.sin(a) * l, nx = -Math.sin(a) * l * 0.28, ny = Math.cos(a) * l * 0.28;
  return `<path d="M${n1(x)} ${n1(y)}Q${n1(x + dx / 2 + nx)} ${n1(y + dy / 2 + ny)} ${n1(x + dx)} ${n1(y + dy)}Q${n1(x + dx / 2 - nx)} ${n1(y + dy / 2 - ny)} ${n1(x)} ${n1(y)}Z" fill="${LEAF}"/>`;
};

function medallion(x, y, R) {
  let s = `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(R)}" fill="${MAROON}" stroke="${GOLD}" stroke-width="1.6"/>`;
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    s += `<ellipse cx="${n1(x + Math.cos(a) * R * 0.52)}" cy="${n1(y + Math.sin(a) * R * 0.52)}" rx="${n1(R * 0.3)}" ry="${n1(R * 0.14)}" transform="rotate(${n1((a * 180) / Math.PI)} ${n1(x + Math.cos(a) * R * 0.52)} ${n1(y + Math.sin(a) * R * 0.52)})" fill="${k % 2 ? '#f7f0e2' : '#e8a0a8'}"/>`;
  }
  return s + `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(R * 0.24)}" fill="${GOLD}"/>`;
}

export function frameSvg({ body, W, H, scale, title, uid }) {
  const T = 38;
  const FW = W + 2 * T, FH = H + 2 * T;
  let s = `<rect width="${FW}" height="${FH}" fill="${MAROON}"/>`;
  s += `<rect x="9" y="9" width="${FW - 18}" height="${FH - 18}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>`;
  s += `<rect x="12" y="12" width="${FW - 24}" height="${FH - 24}" fill="${CREAM}"/>`;
  s += `<rect x="${T - 5}" y="${T - 5}" width="${W + 10}" height="${H + 10}" fill="${MAROON}"/>`;
  s += `<rect x="${T - 3}" y="${T - 3}" width="${W + 6}" height="${H + 6}" fill="none" stroke="${GOLD}" stroke-width="1.4"/>`;
  // blossoms and leaves along the cream strip
  const mid = (T + 12 - 5) / 2 + 3;
  const step = 30;
  let band = '';
  const n = Math.floor((W - 40) / step), m = Math.floor((H - 40) / step);
  for (let i = 0; i <= n; i++) {
    const x = T + 20 + (i * (W - 40)) / n;
    for (const y of [mid, FH - mid]) {
      band += blossom(x, y, 8, i);
      if (i < n) band += leaf(x + 11, y, 0, 8) + leaf(x + 22 - 2, y, Math.PI, 8).replace(/^/, '');
    }
  }
  for (let j = 0; j <= m; j++) {
    const y = T + 20 + (j * (H - 40)) / m;
    for (const x of [mid, FW - mid]) {
      band += blossom(x, y, 8, j);
      if (j < m) band += leaf(x, y + 11, Math.PI / 2, 8);
    }
  }
  s += band;
  for (const [x, y] of [[mid, mid], [FW - mid, mid], [mid, FH - mid], [FW - mid, FH - mid]]) s += medallion(x, y, 15);
  s += `<clipPath id="${uid}fclip"><rect x="${T}" y="${T}" width="${W}" height="${H}"/></clipPath>`;
  s += `<g clip-path="url(#${uid}fclip)"><g transform="translate(${T} ${T})">${body}</g></g>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FW} ${FH}" width="${Math.round(FW * scale)}" height="${Math.round(FH * scale)}">` +
    `<title>${title || 'Anant Yatra'}</title>${s}</svg>`
  );
}

// The nearest strip: grassy bank along the bottom edge with big, bold things standing on it.
import { fbm } from '../noise.js';
import { smoothstep } from '../color.js';
import { poly, line } from '../svg.js';
import { draw } from '../art/index.js';
import { pickItem } from './plain.js';

const BOTTOM = 690;
const TOP = 578;

export function foreground(ctx, x0, x1) {
  const haze = ctx.layer.haze;
  const sA = ctx.salt(31);
  const topAt = (x) => TOP + 8 * fbm(x * 0.007, sA, 3) + 3 * fbm(x * 0.03, sA + 1, 2);
  const xs = [];
  for (let x = x0 - 2; x <= x1 + 2.01; x += 8) xs.push(x);
  const col = (x) => ctx.K(x, haze)(ctx.biomeRGB(x, (b) => b.land.fore));
  let base = poly([...xs.map((x) => [x, topAt(x)]), [x1 + 2, BOTTOM], [x0 - 2, BOTTOM]], ctx.hfill(col, 2));
  // a darker, nearer swell below, for depth
  const deep = (x) => ctx.K(x, haze).sh(ctx.biomeRGB(x, (b) => b.land.fore), 0.28);
  base += poly([...xs.map((x) => [x, topAt(x) + 30 + 7 * fbm(x * 0.012, sA + 5, 2)]), [x1 + 2, BOTTOM], [x0 - 2, BOTTOM]], ctx.hfill(deep, 2));

  const items = [];
  // grass fringe
  ctx.cells(5, (c, cx0) => {
    const r = ctx.rng('blade', c);
    const x = cx0 + r() * 5, h = r.range(5, 13), lean = r.range(-3, 3), tone = r(), skip = r();
    if (!ctx.inChunk(x) || skip < 0.15) return;
    const y = topAt(x) + 1;
    const K = ctx.K(x, haze);
    const g = ctx.biomeRGB(x, (b) => b.land.fore);
    items.push({ y: -2, s: line(x, y, x + lean, y - h, tone < 0.5 ? K.lt(g, 0.28) : K.sh(g, 0.3), 1.3) });
  });

  ctx.cells(128, (c, cx0) => {
    const r = ctx.rng('fore', c);
    const x = cx0 + r() * 128, take = r(), dy = r(), k = r();
    if (!ctx.inChunk(x)) return;
    const g = 0.3 + 0.7 * smoothstep(-0.2, 0.6, fbm(x * 0.0045, ctx.salt(32), 3));
    if (take > 0.85 * g) return;
    const kind = pickItem(ctx, r, x, 'fore');
    if (!kind) return;
    const y = topAt(x) + 12 + dy * 36;
    const sc = 1.5 + dy * 0.5;
    const K = ctx.K(x, haze);
    items.push({ y, s: draw(kind, K, r, x, y, sc, { flip: k < 0.5, fan: K.m.rain > 0.5 ? true : undefined }) });
  });

  // fireflies after dark
  let glow = '';
  ctx.cells(80, (c, cx0) => {
    const r = ctx.rng('fly', c);
    const x = cx0 + r() * 80, y = 450 + r() * 110, take = r(), delay = r();
    if (!ctx.inChunk(x) || take > 0.45 || ctx.M(x).night < 0.5) return;
    glow = glow || ctx.rgrad([[0, '#fff3a0', 0.9], [0.35, '#ffd966', 0.35], [1, '#ffd966', 0]]);
    items.push({ y: y + 100, s: `<circle class="tw" style="animation-delay:-${(delay * 20).toFixed(1)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${glow}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.9" fill="#fffbd0"/>` });
  });

  items.sort((a, b) => a.y - b.y);
  return { base, top: items.map((i) => i.s).join('') };
}

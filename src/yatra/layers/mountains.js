// Rolling hills in front of the mountain ranges, with crest trees and hill-top features.
import { fbm, noise1, ridged } from '../noise.js';
import { clamp, rgb2hex, mixHex } from '../color.js';
import { poly, circle, ellipse, line, n1 } from '../svg.js';
import { BIOME_IDS, BIOMES } from '../biomes.js';
import { draw } from '../art/index.js';

const DX = 8;

// ---- hills -------------------------------------------------------------------------------
const BASE_HILLS = 418;

export function hillProfile(ctx) {
  const salt = ctx.salt(7);
  return (x) => {
    const w = ctx.B(x);
    let amp = 0, rug = 0;
    for (const id of BIOME_IDS) {
      if (!w[id]) continue;
      amp += w[id] * BIOMES[id].hills.amp;
      rug += w[id] * BIOMES[id].hills.rug;
    }
    const smooth = fbm(x * 0.0055, salt, 4) * 0.5 + 0.5;
    const sharp = ridged(x * 0.0075, salt + 4, 3);
    const s = smooth + (clamp((sharp - 0.55) / 0.4, 0, 1) - smooth) * rug * 0.5;
    return BASE_HILLS - amp * (0.1 + 0.9 * s);
  };
}

function crestTree(K, kind, r, x, y, s, col) {
  const dk = K.sh(col, 0.25);
  const c = K(col);
  switch (kind) {
    case 'pine':
      return `<path d="M${n1(x)} ${n1(y - 14 * s)}L${n1(x + 4.2 * s)} ${n1(y)}L${n1(x - 4.2 * s)} ${n1(y)}Z" fill="${dk}"/>`;
    case 'poplar':
      return ellipse(x, y - 8 * s, 2.2 * s, 9 * s, c);
    case 'palm':
      return line(x, y, x + 1, y - 11 * s, K('#4a3a2a'), 1) + `<path d="M${n1(x + 1 - 6 * s)} ${n1(y - 9 * s)}Q${n1(x + 1)} ${n1(y - 15 * s)} ${n1(x + 1 + 6 * s)} ${n1(y - 9 * s)}Q${n1(x + 1)} ${n1(y - 12 * s)} ${n1(x + 1 - 6 * s)} ${n1(y - 9 * s)}Z" fill="${dk}"/>`;
    case 'acacia':
      return line(x, y, x, y - 5 * s, K('#5a4630'), 1) + ellipse(x, y - 6.5 * s, 6 * s, 2.4 * s, dk);
    default:
      return line(x, y, x, y - 3 * s, K('#4a3a2a'), 1) + circle(x, y - 6 * s, 4.2 * s, dk) + circle(x - 1, y - 7 * s, 2.6 * s, c);
  }
}

export function hills(ctx, x0, x1) {
  const prof = hillProfile(ctx);
  const bottom = 480;
  const colAt = (x) => ctx.K(x, ctx.layer.haze)(ctx.biomeRGB(x, (b) => b.hills.col));
  const sil = [];
  for (let x = x0 - 2; x <= x1 + 2 + 0.01; x += DX) sil.push([x, prof(x)]);
  sil.push([x1 + 2, bottom], [x0 - 2, bottom]);
  let base = poly(sil, ctx.hfill(colAt, 2));

  // lighter sunlit swell lower down, to give the hills some body
  const sw = [];
  for (let x = x0 - 2; x <= x1 + 2 + 0.01; x += DX) sw.push([x, prof(x) + 20 + 8 * noise1(x * 0.02, ctx.salt(8))]);
  sw.push([x1 + 2, bottom], [x0 - 2, bottom]);
  base += poly(sw, ctx.hfill((x) => mixHex(colAt(x), ctx.K(x, ctx.layer.haze * 0.5)(ctx.biomeRGB(x, (b) => b.hills.col)), 0.55), 2));

  let top = '';
  const items = [];

  // trees along the crest
  ctx.cells(26, (c, cx0) => {
    const r = ctx.rng('crest', c);
    const x = cx0 + r() * 26, keep = r(), sc = r.range(0.7, 1.25), tone = r();
    if (!ctx.inChunk(x)) return;
    const w = ctx.B(x);
    const amp = BIOME_IDS.reduce((a, id) => a + w[id] * BIOMES[id].hills.amp, 0);
    const grove = fbm(x * 0.006, ctx.salt(9), 2) * 0.5 + 0.5;
    if (keep > 0.2 + 0.7 * grove || amp < 30) return;
    const id = r.weighted(BIOME_IDS.map((b) => [b, w[b]]));
    const kind = BIOMES[id].hills.crest;
    if (kind === 'boulders') return;
    const K = ctx.K(x, ctx.layer.haze);
    const col = ['#2f5a3a', '#35653f', '#2b5136'][Math.floor(tone * 3)];
    const y = prof(x) + r.range(0, 10);
    items.push({ y, s: crestTree(K, kind, r, x, y, sc, col) });
  });

  // landmark features on the hills
  ctx.cells(440, (c, cx0) => {
    const r = ctx.rng('feat', c);
    const x = cx0 + 40 + r() * 360, pick = r();
    if (!ctx.inChunk(x)) return;
    const w = ctx.B(x);
    const id = r.weighted(BIOME_IDS.map((b) => [b, w[b]]));
    const feat = BIOMES[id].hillFeature;
    const K = ctx.K(x, ctx.layer.haze);
    const sc = r.range(0.8, 1.15);
    const y = prof(x);
    const chance = { fort: 0.85, gompa: 0.7, waterfall: 0.8, boulders: 1, none: 0 }[feat];
    if (pick > chance) return;
    if (feat === 'fort') items.push({ y: y + 40, s: draw('fortMesa', K, r, x, y + 16, sc) });
    else if (feat === 'gompa') items.push({ y: y + 40, s: draw('gompaHill', K, r, x, y + 6, sc) });
    else if (feat === 'waterfall') items.push({ y: y + 40, s: draw('waterfall', K, r, x, y + 2, sc) });
    else if (feat === 'boulders') items.push({ y: y + 40, s: draw('boulderPile', K, r, x, y + 8, sc * 1.2) });
  });

  items.sort((a, b) => a.y - b.y);
  top += items.map((i) => i.s).join('');

  // mist band across the foot of the hills
  const over = ctx.mistRect((x) => rgb2hex(ctx.M(x).haze));
  return { base, top, over };
}

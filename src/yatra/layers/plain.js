// The middle ground: far bank, river/lake/dunes, near bank — and everything that stands on them.
import { fbm, noise1 } from '../noise.js';
import { smoothstep, mixRGB, rgb2hex, hex2rgb, mixHex } from '../color.js';
import { poly, line, n1 } from '../svg.js';
import { BIOME_IDS, BIOMES } from '../biomes.js';
import { draw } from '../art/index.js';

const BOTTOM = 690;
const FIXED = /shikhara|gopuram|taj|ghat|gompa|chorten|haveli|house|mandapa|flags|fort|chhatri/;

export function plainProfile(ctx) {
  const sA = ctx.salt(11), sB = ctx.salt(12), sC = ctx.salt(13), sW = ctx.salt(14);
  const wat = (x) => ctx.biomeNum(x, (b) => b.water);
  const farTop = (x) => 436 + 7 * fbm(x * 0.0065, sA, 3);
  const waterTop = (x, w = wat(x)) => farTop(x) + 14 + 20 * (1 - w) + 2.5 * noise1(x * 0.04, sB);
  const waterBot = (x, w = wat(x)) => waterTop(x, w) + w * 62 * (0.72 + 0.28 * (fbm(x * 0.004, sW, 2) * 0.5 + 0.5));
  const nearTop = (x, w = wat(x)) => waterBot(x, w) + 4 + 5 * noise1(x * 0.011, sC) + 2 * noise1(x * 0.05, sC + 1);
  return { wat, farTop, waterTop, waterBot, nearTop };
}

/** Choose a biome by blend weight at x, then an item from that biome's table. */
export function pickItem(ctx, r, x, key) {
  const w = ctx.B(x);
  const id = r.weighted(BIOME_IDS.map((b) => [b, w[b]]));
  const items = BIOMES[id][key];
  return items && items.length ? r.weighted(items) : null;
}

const hashJ = (ctx, c, k, n) => ctx.rng('fe', c, k, n)();
const grove = (ctx, x, salt) => 0.22 + 0.78 * smoothstep(-0.25, 0.55, fbm(x * 0.0048, salt, 3));

export function plain(ctx, x0, x1) {
  const { wat, farTop, waterTop, waterBot, nearTop } = plainProfile(ctx);
  const haze = ctx.layer.haze;
  const step = 8;
  const xa = x0 - 2, xb = x1 + 2;
  const xsList = [];
  for (let x = xa; x <= xb + 0.01; x += step) xsList.push(x);

  // ---- ground fills
  const farCol = (x) => ctx.K(x, haze + 0.1)(ctx.biomeRGB(x, (b) => b.land.far));
  const nearCol = (x) => ctx.K(x, haze)(ctx.biomeRGB(x, (b) => b.land.near));
  let base = poly([...xsList.map((x) => [x, farTop(x)]), [xb, BOTTOM], [xa, BOTTOM]], ctx.hfill(farCol, 2));

  // water body
  const wcol = (x) => ctx.K(x, haze)(rgb2hex(mixRGB(ctx.biomeRGB(x, (b) => b.land.water), ctx.M(x).hor, 0.18)));
  const wsh = (x) => ctx.K(x, 0)(rgb2hex(mixRGB(ctx.biomeRGB(x, (b) => b.land.water), ctx.M(x).hor, 0.55)));
  let hasWater = false;
  const top = [], bot = [];
  for (const x of xsList) {
    const w = wat(x);
    if (w <= 0.03) continue;
    hasWater = true;
    top.push([x, waterTop(x, w)]);
    bot.push([x, waterBot(x, w) + 3]);
  }
  if (hasWater && top.length > 1) {
    let run = [];
    const flush = () => {
      if (run.length > 1) {
        const rt = run.map((i) => top[i]), rb = run.map((i) => bot[i]).reverse();
        base += poly([...rt, ...rb], ctx.hfill(wcol, 2));
        const refl = run.map((i) => [top[i][0], top[i][1] + (bot[i][1] - top[i][1]) * 0.38]).reverse();
        base += poly([...rt, ...refl], ctx.hfill((x) => mixHex(wcol(x), wsh(x), 0.55), 2));
      }
      run = [];
    };
    for (let i = 0; i < top.length; i++) {
      if (run.length && top[i][0] - top[run[run.length - 1]][0] > step + 0.1) flush();
      run.push(i);
    }
    flush();
  }

  // near bank
  base += poly([...xsList.map((x) => [x, nearTop(x)]), [xb, BOTTOM], [xa, BOTTOM]], ctx.hfill(nearCol, 2));

  // crop fields on the near bank: stripes of quilted plots whose slanted borders are shared by neighbours
  const FC = 128;
  const stripeTop = [8, 30, 60], stripeBot = [30, 60, 98];
  const edge = (c, k) => ({ j: (hashJ(ctx, c, k, 1) - 0.5) * 36, s: (hashJ(ctx, c, k, 2) - 0.5) * 34 });
  for (let k = 0; k < 3; k++) {
    for (let c = Math.floor((x0 - 60) / FC); c <= Math.floor((x1 + 60) / FC); c++) {
      const cx = c * FC + FC / 2;
      const amt = ctx.biomeNum(cx, (b) => b.fieldAmt);
      const r = ctx.rng('field', c, k);
      if (r() > amt) continue;
      const w = ctx.B(cx);
      const id = r.weighted(BIOME_IDS.map((b) => [b, w[b]]));
      const fc = r.pick(BIOMES[id].fields);
      const eL = edge(c, k), eR = edge(c + 1, k);
      const xl = c * FC + eL.j, xr = (c + 1) * FC + eR.j;
      const yt = (x) => nearTop(x) + stripeTop[k] + 3 * noise1(x * 0.02, ctx.salt(40 + k));
      const yb = (x) => nearTop(x) + stripeBot[k] + 3 * noise1(x * 0.02, ctx.salt(43 + k));
      const P = [[xl, yt(xl)], [xr, yt(xr)], [xr + eR.s, yb(xr + eR.s)], [xl + eL.s, yb(xl + eL.s)]];
      const K = ctx.K(cx, haze);
      const col = K(rgb2hex(mixRGB(hex2rgb(fc), ctx.biomeRGB(cx, (b) => b.land.near), 0.28)));
      base += poly(P, col);
      const furrow = K.sh(fc, 0.3);
      for (let i = 1; i < 4; i++) {
        const t = i / 4;
        const ax = P[0][0] + (P[3][0] - P[0][0]) * t, ay = P[0][1] + (P[3][1] - P[0][1]) * t;
        const bx = P[1][0] + (P[2][0] - P[1][0]) * t, by = P[1][1] + (P[2][1] - P[1][1]) * t;
        base += line(ax + 1, ay, bx - 1, by, furrow, 0.7, 'stroke-opacity=".4"');
      }
    }
  }

  // sunlit shoreline
  const rimPts = xsList.map((x) => `${n1(x)} ${n1(nearTop(x))}`);
  const rimFill = ctx.hfill((x) => ctx.K(x, haze).lt(ctx.biomeRGB(x, (b) => b.land.near), 0.35), 2);
  base += `<polyline points="${rimPts.join(' ')}" fill="none" stroke="${rimFill}" stroke-width="1.6" stroke-linejoin="round" stroke-opacity=".8"/>`;

  // ---- objects
  const items = [];

  // water clip for reflections: covers a margin around the chunk so tall/wide things reflect across seams
  let clip = '';
  if (hasWater) {
    const id = ctx.id();
    const P = [], Q = [];
    for (let x = x0 - 240; x <= x1 + 240.01; x += step) {
      P.push([x, waterTop(x)]);
      Q.push([x, waterBot(x) + 3]);
    }
    ctx.defs.push(`<clipPath id="${id}"><polygon points="${[...P, ...Q.reverse()].map((p) => `${n1(p[0])},${n1(p[1])}`).join(' ')}"/></clipPath>`);
    clip = id;
  }
  const mirrored = (svg, axisY) => {
    const k = 0.62;
    return `<g clip-path="url(#${clip})"><g transform="translate(0 ${n1(axisY * (1 + k))}) scale(1 ${-k})" opacity=".26">${svg}</g></g>`;
  };

  // ripples
  if (hasWater) {
    ctx.cells(36, (c, cx0) => {
      const r = ctx.rng('rip', c);
      const x = cx0 + r() * 36, t = r(), k = r();
      const w = wat(x);
      if (w < 0.2 || !ctx.inChunk(x)) return;
      const yt = waterTop(x, w), yb = waterBot(x, w);
      const y = yt + (yb - yt) * (0.15 + 0.8 * t);
      const col = rgb2hex(mixRGB(ctx.M(x).hor, [255, 255, 255], 0.35));
      const L = 5 + 6 * k;
      items.push({ y: -1, s: `<path class="rp" style="animation-delay:-${n1(k * 38)}s" d="M${n1(x - L)} ${n1(y)}q${n1(L / 2)} -2.2 ${n1(L)} 0q${n1(L / 2)} 2.2 ${n1(L)} 0" fill="none" stroke="${col}" stroke-width=".9" stroke-linecap="round" stroke-opacity=".6"/>` });
    });
  }

  // grass tufts / dry scrub scattered over the near bank
  ctx.cells(30, (c, cx0) => {
    const r = ctx.rng('tuft', c);
    const x = cx0 + r() * 30, take = r(), dy = r(), sc = r.range(0.9, 1.5);
    if (!ctx.inChunk(x) || take > 0.45) return;
    const nt = nearTop(x);
    const y = nt + 14 + dy * Math.min(80, BOTTOM - nt - 56);
    const K = ctx.K(x, haze);
    items.push({ y: y - 0.2, s: draw('tuft', K, r, x, y, sc, { col: ctx.biomeRGB(x, (b) => b.land.near) }) });
  });

  // far-bank things
  ctx.cells(60, (c, cx0) => {
    const r = ctx.rng('far', c);
    const x = cx0 + r() * 60, take = r(), k = r(), sc = r.range(0.78, 1.0), dy = r.range(0, 9);
    if (!ctx.inChunk(x)) return;
    if (take > grove(ctx, x, ctx.salt(21)) * 0.85) return;
    const kind = pickItem(ctx, r, x, 'far');
    if (!kind) return;
    const y = farTop(x) + 6 + dy;
    const K = ctx.K(x, haze + 0.08);
    const svg = draw(kind, K, r, x, y, sc, { flip: k < 0.5 && !FIXED.test(kind) });
    if (clip && wat(x) > 0.3) items.push({ y: -0.5, s: mirrored(svg, waterTop(x) + 2) });
    items.push({ y, s: svg });
  });

  // near-bank things
  ctx.cells(110, (c, cx0) => {
    const r = ctx.rng('near', c);
    const x = cx0 + r() * 110, take = r(), k = r(), dy = r();
    if (!ctx.inChunk(x)) return;
    if (take > grove(ctx, x, ctx.salt(22)) * 0.8) return;
    const kind = pickItem(ctx, r, x, 'near');
    if (!kind) return;
    const nt = nearTop(x);
    const span = Math.min(70, BOTTOM - nt - 60);
    const y = nt + 12 + dy * span;
    const sc = 1.0 + (dy * span) / 80 * 0.42;
    const K = ctx.K(x, haze);
    items.push({ y, s: draw(kind, K, r, x, y, sc, { flip: k < 0.5 && !FIXED.test(kind) }) });
  });

  // on the water
  if (hasWater) {
    ctx.cells(170, (c, cx0) => {
      const r = ctx.rng('wat', c);
      const x = cx0 + r() * 170, take = r(), dy = r(), k = r();
      if (!ctx.inChunk(x)) return;
      const w = wat(x);
      if (w < 0.45 || take > 0.8) return;
      const kind = pickItem(ctx, r, x, 'onwater');
      if (!kind) return;
      const yt = waterTop(x, w), yb = waterBot(x, w);
      const y = yt + (yb - yt) * (0.4 + 0.5 * dy);
      const sc = 0.85 + 0.45 * dy;
      const K = ctx.K(x, haze);
      items.push({ y, s: draw(kind, K, r, x, y, sc, { flip: k < 0.5 }) });
    });
  }

  // lamps set afloat on the river once the light goes (Gangā aarti)
  if (hasWater) {
    ctx.cells(44, (c, cx0) => {
      const r = ctx.rng('diya', c);
      const x = cx0 + r() * 44, take = r(), dy = r();
      if (!ctx.inChunk(x) || take > 0.3) return;
      const w = ctx.B(x), m = ctx.M(x);
      if (w.ganga < 0.5 || m.lamps < 0.45) return;
      const yt = waterTop(x), yb = waterBot(x);
      const y = yt + (yb - yt) * (0.3 + 0.6 * dy);
      items.push({ y, s: draw('diya', ctx.K(x, 0), r, x, y, 0.8 + 0.5 * dy) });
    });
  }

  // landmarks
  ctx.cells(1100, (c, cx0) => {
    const r = ctx.rng('land', c);
    const x = cx0 + 150 + r() * 800, take = r(), pickR = r(), scr = r();
    if (!ctx.inChunk(x) || take > 0.85) return;
    const w = ctx.B(x);
    const id = r.weighted(BIOME_IDS.map((b) => [b, w[b]]));
    const lm = BIOMES[id].landmark;
    const kind = lm[Math.floor(pickR * lm.length)];
    const K = ctx.K(x, haze + 0.03);
    const onWater = /boat|row/.test(kind);
    const yt = waterTop(x), yb = waterBot(x);
    const y = onWater ? (yt + yb) / 2 : farTop(x) + 12;
    const sc = 1.1 + scr * 0.4;
    const svg = draw(kind, K, r, x, y, sc, {});
    if (clip && !onWater && wat(x) > 0.3) items.push({ y: -0.5, s: mirrored(svg, waterTop(x) + 2) });
    items.push({ y: y + 2, s: svg });
  });

  items.sort((a, b) => a.y - b.y);
  return { base, top: items.map((i) => i.s).join('') };
}

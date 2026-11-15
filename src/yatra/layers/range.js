// Mountain ranges. A ridge line is sampled on a fixed global grid, so peaks, valleys and every
// painted facet are pure functions of x — chunks agree on shared faces without talking to each other.
import { fbm, noise1, ridged } from '../noise.js';
import { clamp, rgb2hex } from '../color.js';
import { poly, pts } from '../svg.js';
import { BIOME_IDS, BIOMES } from '../biomes.js';

const DX = 8;
const PADX = 480;
const R = 5; // an apex is the highest point within ±R samples
const BOTTOM = 482;

export function range(ctx, x0, x1, cfg) {
  const { base, ampScale, salt, haze, shade } = cfg;
  const xa = x0 - PADX;
  const n = Math.round((x1 + PADX - xa) / DX) + 1;
  const xs = [], ys = [], pr = [];
  for (let i = 0; i < n; i++) {
    const x = xa + i * DX;
    const w = ctx.B(x);
    let amp = 0, rug = 0, snow = 0;
    for (const id of BIOME_IDS) {
      if (!w[id]) continue;
      const p = BIOMES[id].peaks;
      amp += w[id] * p.amp; rug += w[id] * p.rug; snow += w[id] * p.snow;
    }
    const env = 0.6 + 0.4 * (fbm(x * 0.0012, salt + 9, 2) * 0.5 + 0.5);
    const smooth = fbm(x * 0.0042, salt, 4) * 0.5 + 0.5;
    const sharp = clamp((ridged(x * 0.0036, salt + 5, 4, 0.5) - 0.12) / 0.55, 0, 1);
    const s = smooth * (1 - rug * 0.8) + sharp * rug * 0.8 + 0.2 * rug * smooth;
    xs.push(x);
    ys.push(base - amp * ampScale * env * (0.1 + 0.9 * s));
    pr.push({ amp: amp * ampScale * env, snow });
  }
  const i0 = Math.floor((x0 - 2 - xa) / DX), i1 = Math.ceil((x1 + 2 - xa) / DX);
  const midX = x0 + 256;
  const K = ctx.K(midX, haze);
  const rockRGB = ctx.biomeRGB(midX, (b) => b.peaks.rock);
  const rockAt = (x) => ctx.K(x, haze)(ctx.biomeRGB(x, (b) => b.peaks.rock));

  // silhouette
  const sil = [];
  for (let i = i0; i <= i1; i++) sil.push([xs[i], ys[i]]);
  sil.push([xs[i1], BOTTOM], [xs[i0], BOTTOM]);
  const baseS = poly(sil, ctx.hfill(rockAt, 2));

  let top = '';
  const silId = ctx.id();
  ctx.defs.push(`<clipPath id="${silId}"><polygon points="${pts(sil)}"/></clipPath>`);
  let detail = '';

  // apexes and the valley that follows each
  const apex = [];
  for (let i = R; i < n - R; i++) {
    const y = ys[i];
    if (y > base - 34) continue;
    let ok = true;
    for (let j = 1; j <= R && ok; j++) if (!(ys[i - j] > y) || !(ys[i + j] >= y)) ok = false;
    if (ok) apex.push(i);
  }
  const valleyAfter = (k) => {
    const a = apex[k], e = k + 1 < apex.length ? apex[k + 1] : Math.min(n - 1, a + 36);
    let v = a;
    for (let i = a; i <= e; i++) if (ys[i] >= ys[v]) v = i;
    return v;
  };

  const rockOf = (x) => ctx.biomeRGB(x, (b) => b.peaks.rock);
  const tone = (fn) => ctx.hfill((x) => fn(ctx.K(x, haze), rockOf(x)), 2);
  const shadeCol = tone((P, r) => P.sh(r, 0.34));
  const dark = tone((P, r) => P.sh(r, 0.52));
  const dark2 = tone((P, r) => P.sh(r, 0.42));
  const litDark = tone((P, r) => P.sh(r, 0.12));
  const litLite = tone((P, r) => P.lt(r, 0.1));
  const faces = [];

  if (shade) {
    for (let k = 0; k < apex.length; k++) {
      const a = apex[k], v = valleyAfter(k);
      const pv = k > 0 ? valleyAfter(k - 1) : Math.max(0, a - 36);
      const ax = xs[a], vx = xs[v];
      // a face reaches left over its lit gullies and the leaning arête, right over the valley line
      if (Math.min(xs[pv] - 75, ax - 150) > x1 + 2 || vx + 90 < x0 - 2) continue;
      if (vx - ax < 28) continue;
      const fr = ctx.rng('face', Math.round(ax));
      const width = vx - ax;
      const ay = ys[a], vy = ys[v];
      const Hf = BOTTOM - ay;
      // the arête slants down toward the shadow side, the valley line leans either way
      const d1 = -Hf * fr.range(0.04, 0.34);
      const d2 = Math.max(Hf * fr.range(-0.3, 0.14), ax + d1 - vx + 14);

      // lit face gullies (left of the apex), drawn under the shadow faces
      const lw = ax - xs[pv];
      const lc = clamp(Math.floor(lw / 11), 3, 12);
      for (let g = 0; g < lc; g++) {
        const j = pv + Math.round(fr.range(0.03, 0.97) * (a - pv));
        const w = fr.range(8, 22), L = fr.range(70, 210), sl = -0.34 * L;
        const px = xs[j], py = ys[j];
        const col = fr() < 0.55 ? litDark : litLite;
        detail += poly([[px - w / 2, py - 2], [px + w / 2, py - 2], [px + sl, py + L]], col);
      }

      // shadow face
      const spine = [
        [ax, ay],
        [ax + d1 * 0.35 + fr.range(-6, 6), ay + Hf * 0.33],
        [ax + d1 * 0.7 + fr.range(-8, 8), ay + Hf * 0.66],
        [ax + d1, BOTTOM],
      ];
      const vall = [[vx + d2, BOTTOM], [vx + d2 * 0.5 + fr.range(-6, 6), vy + (BOTTOM - vy) * 0.45]];
      const face = [];
      for (let i = a; i <= v; i++) face.push([xs[i], ys[i]]);
      face.push(...vall, ...spine.slice(1).reverse());
      detail += poly(face, shadeCol);

      const id = ctx.id();
      ctx.defs.push(`<clipPath id="${id}"><polygon points="${pts(face)}"/></clipPath>`);
      faces.push({ id, ax, vx: vx + Math.abs(d2) });
      let gul = '';
      const gc = clamp(Math.floor(width / 9), 3, 14);
      for (let g = 0; g < gc; g++) {
        const j = a + 1 + Math.floor(fr() * Math.max(1, v - a - 1));
        const w = fr.range(8, 24), L = fr.range(70, 220), sl = 0.3 * L;
        const px = xs[j], py = ys[j];
        gul += poly([[px - w / 2, py - 3], [px + w / 2, py - 3], [px + sl, py + L]], fr() < 0.7 ? dark : dark2);
      }
      detail += `<g clip-path="url(#${id})">${gul}</g>`;
    }
  }

  // snow caps
  const snowLit = ctx.hfill((x) => ctx.K(x, haze)('#f7f9fd'), 2);
  const snowSh = ctx.hfill((x) => ctx.K(x, haze).sh('#dfe7f7', 0.33), 2);
  const sb = ys.map((_, k) => {
    const p = pr[k];
    const sl = -200 + (base + 200 - p.amp * 0.5) * p.snow;
    return sl + 8 * noise1(xs[k] * 0.07, salt + 21) + 6 * noise1(xs[k] * 0.19, salt + 22) + (k % 2 ? 3 : -2);
  });
  const snowPolys = [];
  let i = i0;
  while (i <= i1) {
    if (!(ys[i] < sb[i] - 1.5)) { i++; continue; }
    let j = i;
    while (j + 1 <= i1 && ys[j + 1] < sb[j + 1] - 1.5) j++;
    const P = [];
    for (let k = i; k <= j; k++) P.push([xs[k], ys[k]]);
    for (let k = j; k >= i; k--) P.push([xs[k], Math.max(sb[k], ys[k] + 1)]);
    if (P.length > 3) snowPolys.push({ P, x0: xs[i], x1: xs[j] });
    i = j + 1;
  }
  for (const s of snowPolys) detail += poly(s.P, snowLit);
  for (const f of faces) {
    const inner = snowPolys.filter((s) => s.x1 > f.ax && s.x0 < f.vx).map((s) => poly(s.P, snowSh)).join('');
    if (inner) detail += `<g clip-path="url(#${f.id})">${inner}</g>`;
  }

  top += `<g clip-path="url(#${silId})">${detail}</g>`;

  // valley mist at the foot of the range (faded by the layer-level mask)
  const over = ctx.mistRect((x) => rgb2hex(ctx.M(x).haze));
  return { base: baseS, top, over };
}

export function farRange(ctx, x0, x1) {
  return range(ctx, x0, x1, { base: 362, ampScale: 0.64, salt: ctx.salt(1), haze: 0.6, shade: false });
}

export function peaks(ctx, x0, x1) {
  return range(ctx, x0, x1, { base: 394, ampScale: 1, salt: ctx.salt(2), haze: 0.34, shade: true });
}

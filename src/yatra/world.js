// The world: which region and which time of day you are in at any point along the scroll.
// Everything is a pure function of (seed, x), so chunks can be generated in any order.
import { hash, hash01, hashStr } from './rng.js';
import { BIOME_IDS, BIOMES } from './biomes.js';
import { MOODS, CYCLE } from './moods.js';
import { clamp, smoothstep, hex2rgb, rgb2hex, mixRGB, saturate, multiply } from './color.js';

const NUM = ['sat', 'night', 'lamps', 'cloudiness', 'rain', 'bodySize', 'bodyY'];
const RGB = ['top', 'mid', 'hor', 'haze', 'light', 'cloud', 'cloudShade'];
const INK = [43, 29, 22];
const SHADOW = [28, 24, 72];
const PAPER = [255, 247, 224];

export function createWorld(opts = {}) {
  const seed = typeof opts.seed === 'string' ? hashStr(opts.seed) : (opts.seed ?? 108) >>> 0;
  const lockBiome = opts.biome && BIOMES[opts.biome] ? opts.biome : null;
  const lockMood = opts.mood && MOODS[opts.mood] ? opts.mood : null;
  const RW = opts.biomeSpan || 3200;
  const MS = opts.moodSpan || 3200;
  const T = RW * 0.14;

  // ---- regions ---------------------------------------------------------------------------
  const rStart = (i) => i * RW + (hash01(seed, 71, i) - 0.5) * 0.5 * RW;
  const seq = new Map();
  let lo = 0, hi = 0;
  seq.set(0, lockBiome || BIOME_IDS[hash(seed, 90) % BIOME_IDS.length]);
  const nextBiome = (prev, i) => {
    const others = BIOME_IDS.filter((b) => b !== prev);
    return others[Math.floor(hash01(seed, 91, i) * others.length)];
  };
  function regionBiome(i) {
    if (lockBiome) return lockBiome;
    while (i > hi) { hi++; seq.set(hi, nextBiome(seq.get(hi - 1), hi)); }
    while (i < lo) { lo--; seq.set(lo, nextBiome(seq.get(lo + 1), lo)); }
    return seq.get(i);
  }
  function regionIndex(x) {
    let i = Math.floor(x / RW);
    while (rStart(i) > x) i--;
    while (rStart(i + 1) <= x) i++;
    return i;
  }

  /** Blend weights per biome at x (sum = 1). Also .main = dominant id. */
  function biomeAt(x) {
    const i = regionIndex(x);
    const b0 = rStart(i), b1 = rStart(i + 1);
    const w = {};
    for (const id of BIOME_IDS) w[id] = 0;
    const id = regionBiome(i);
    const dl = x - b0, dr = b1 - x;
    let wi = 1;
    if (dl < T) {
      const s = smoothstep(0, 1, 0.5 + (0.5 * dl) / T);
      wi = s;
      w[regionBiome(i - 1)] += 1 - s;
    } else if (dr < T) {
      const s = smoothstep(0, 1, 0.5 + (0.5 * dr) / T);
      wi = s;
      w[regionBiome(i + 1)] += 1 - s;
    }
    w[id] += wi;
    let main = id, best = -1;
    for (const k of BIOME_IDS) if (w[k] > best) { best = w[k]; main = k; }
    w.main = main;
    return w;
  }

  /** Blend a numeric property (getter takes a BIOMES entry) at x. */
  function biomeNum(x, get, w = biomeAt(x)) {
    let v = 0;
    for (const id of BIOME_IDS) if (w[id]) v += w[id] * get(BIOMES[id]);
    return v;
  }
  function biomeRGB(x, get, w = biomeAt(x)) {
    let r = 0, g = 0, b = 0;
    for (const id of BIOME_IDS) {
      if (!w[id]) continue;
      const c = hex2rgb(get(BIOMES[id]));
      r += w[id] * c[0]; g += w[id] * c[1]; b += w[id] * c[2];
    }
    return [r, g, b];
  }

  // ---- time of day -----------------------------------------------------------------------
  const kPos = (k) => k * MS + (hash01(seed, 53, k) - 0.5) * 0.36 * MS - 0.45 * MS;
  function keyType(k) {
    if (lockMood) return lockMood;
    const base = CYCLE[((k % 4) + 4) % 4];
    if (base === 'day') {
      const u = kPos(k);
      const p = BIOMES[biomeAt(u).main].monsoon;
      if (hash01(seed, 57, k) < p) return 'monsoon';
    }
    return base;
  }
  const keyOf = (u) => {
    let k = Math.floor((u + 0.45 * MS) / MS) - 1;
    while (kPos(k + 1) <= u) k++;
    while (kPos(k) > u) k--;
    return k;
  };
  function keysIn(u0, u1) {
    const out = [];
    for (let k = keyOf(u0) + 1; kPos(k) < u1; k++) if (kPos(k) >= u0) out.push({ k, u: kPos(k), type: keyType(k) });
    return out;
  }

  const moodCache = new Map();
  /** Interpolated mood at world x (quantised to 4 px so results never depend on call order). */
  function moodAt(u) {
    if (opts.clock) return opts.clock; // the whole scroll shows one hour: the one outside (see blendMood)
    const q = Math.round(u / 4);
    let m = moodCache.get(q);
    if (m) return m;
    const x = q * 4;
    const k = keyOf(x);
    const p0 = kPos(k), p1 = kPos(k + 1);
    m = blendMood(keyType(k), keyType(k + 1), smoothstep(0, 1, (x - p0) / (p1 - p0)));
    if (moodCache.size > 4000) moodCache.clear();
    moodCache.set(q, m);
    return m;
  }

  const lit = (rgb, m, haze) => {
    let c = saturate(rgb, m.sat);
    c = multiply(c, m.light);
    return haze ? mixRGB(c, m.haze, haze) : c;
  };

  /** Colour shader for one object at world x: K(hex) is the lit colour; K.sh/dk/lt are variants. */
  function painter(u, haze = 0) {
    const m = moodAt(u);
    const L = (hex) => lit(typeof hex === 'string' ? hex2rgb(hex) : hex, m, haze);
    const K = (hex) => rgb2hex(L(hex));
    K.sh = (hex, a = 0.3) => rgb2hex(mixRGB(L(hex), SHADOW, a));
    K.dk = (hex, a = 0.42) => rgb2hex(mixRGB(L(hex), lit(INK, m, haze), a));
    K.lt = (hex, a = 0.25) => rgb2hex(mixRGB(L(hex), multiply(PAPER, m.light), a));
    K.ink = rgb2hex(lit(INK, m, haze));
    K.glow = '#ffcf6b';
    K.m = m;
    K.night = m.night;
    K.lamps = m.lamps;
    return K;
  }

  const labelAt = (u) => ({ biome: biomeAt(u).main, mood: moodAt(u).dominant });

  return {
    seed, opts, RW, MS, lockedMood: lockMood, lockedBiome: lockBiome, clock: opts.clock || null,
    biomeAt, biomeNum, biomeRGB, regionIndex, regionBiome,
    moodAt, keysIn, keyType, painter, labelAt,
    clamp,
  };
}

/** Mood between two named hours at t ∈ [0, 1]; `extra` overrides numeric fields (e.g. live rain). */
export function blendMood(from, to, t, extra = {}) {
  const a = MOODS[from], b = MOODS[to];
  const m = { t, from, to };
  for (const f of NUM) m[f] = a[f] + (b[f] - a[f]) * t;
  for (const f of RGB) m[f] = mixRGB(a[f], b[f], t);
  m.sun = t < 0.5 ? a.body : b.body;
  m.dominant = t < 0.5 ? from : to;
  return Object.assign(m, extra);
}

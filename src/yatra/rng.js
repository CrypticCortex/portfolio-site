// Deterministic hashing + PRNG. Integer-only maths so every JS engine agrees.

export function hashStr(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Combine any number of ints (or short strings) into one well-mixed uint32. */
export function hash(...ks) {
  let h = 0x811c9dc5;
  for (let i = 0; i < ks.length; i++) {
    let k = ks[i];
    if (typeof k === 'string') k = hashStr(k);
    h = Math.imul(h ^ (k | 0), 0x01000193);
    h ^= h >>> 15;
    h = Math.imul(h, 0x2c1b3c6d);
    h ^= h >>> 12;
    h = Math.imul(h, 0x297a2d39);
    h ^= h >>> 15;
  }
  return h >>> 0;
}

export const hash01 = (...ks) => hash(...ks) / 4294967296;

export function mulberry32(a) {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeded random stream with a few conveniences, keyed by arbitrary ints. */
export function rng(...keys) {
  const next = mulberry32(hash(...keys));
  const r = () => next();
  r.range = (a, b) => a + (b - a) * next();
  r.int = (a, b) => a + Math.floor(next() * (b - a + 1));
  r.chance = (p) => next() < p;
  r.sign = () => (next() < 0.5 ? -1 : 1);
  r.pick = (arr) => arr[Math.floor(next() * arr.length)];
  /** entries: [[item, weight], ...] */
  r.weighted = (entries) => {
    let t = 0;
    for (const e of entries) t += e[1];
    if (t <= 0) return entries[0][0];
    let x = next() * t;
    for (const e of entries) {
      x -= e[1];
      if (x < 0) return e[0];
    }
    return entries[entries.length - 1][0];
  };
  return r;
}

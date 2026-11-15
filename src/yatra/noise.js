// Stateless 1-D value noise: every value is a pure function of (x, salt).
import { hash } from './rng.js';

const lat = (i, s) => (hash(i, s) / 4294967296) * 2 - 1;
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/** Smooth noise in [-1, 1]. */
export function noise1(x, s = 0) {
  const i = Math.floor(x);
  const t = fade(x - i);
  const a = lat(i, s);
  const b = lat(i + 1, s);
  return a + (b - a) * t;
}

/** Fractal noise, roughly [-1, 1]. */
export function fbm(x, s = 0, oct = 4, gain = 0.5) {
  let sum = 0, amp = 1, norm = 0, fr = 1;
  for (let o = 0; o < oct; o++) {
    sum += amp * noise1(x * fr, s + o * 101);
    norm += amp;
    amp *= gain;
    fr *= 2;
  }
  return sum / norm;
}

/** Ridged noise in [0, 1]: sharp peaks (Λ), rounded valleys. */
export function ridged(x, s = 0, oct = 4, gain = 0.55) {
  let sum = 0, amp = 1, norm = 0, fr = 1;
  for (let o = 0; o < oct; o++) {
    const v = 1 - Math.abs(noise1(x * fr, s + o * 131));
    sum += amp * v * v;
    norm += amp;
    amp *= gain;
    fr *= 2.07;
  }
  return sum / norm;
}

import { sky, celestial } from './sky.js';
import { farRange, peaks } from './range.js';
import { hills } from './mountains.js';
import { plain } from './plain.js';
import { foreground } from './foreground.js';

// Back to front. `f` is the parallax factor used when the scene is scrolled with parallax on;
// `haze` is how much atmospheric perspective washes the layer's colours toward the horizon.
// `dy` lifts a layer in the frame (the horizon sits ~64% of the way down rather than ~75%).
const fade = (y0, y1, hi, soft = 140) => ({ y0, y1, stops: [[0, 0], [(0.55 * soft) / (y1 - y0), hi * 0.53], [soft / (y1 - y0), hi], [1, hi]] });
const defs = [
  { id: 'sky', f: 1.0, haze: 0, dy: 0, gen: sky },
  { id: 'celestial', f: 0.72, haze: 0, dy: -30, gen: celestial },
  { id: 'range', f: 0.78, haze: 0.62, dy: -52, mist: fade(252, 482, 0.95), gen: farRange },
  { id: 'peaks', f: 0.83, haze: 0.38, dy: -52, mist: fade(284, 482, 0.95), gen: peaks },
  { id: 'hills', f: 0.89, haze: 0.2, dy: -52, mist: { y0: 398, y1: 480, stops: [[0, 0], [1, 0.7]] }, gen: hills },
  { id: 'plain', f: 0.95, haze: 0.05, dy: -52, gen: plain },
  { id: 'foreground', f: 1.1, haze: 0, dy: -52, gen: foreground },
];

export const LAYERS = defs.map((d, index) => ({ ...d, index }));

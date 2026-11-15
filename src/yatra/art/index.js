// Registry of everything that can be painted into the landscape.
import { place } from '../svg.js';
import { ART as trees } from './trees.js';
import { ART as structures } from './structures.js';
import { ART as fauna } from './fauna.js';
import { ART as boats } from './boats.js';
import { ART as misc } from './misc.js';

export const ART = { ...trees, ...structures, ...fauna, ...boats, ...misc };

/**
 * Paint `kind` at (x, y) with uniform scale s. K is the mood/haze painter, r the object's rng.
 * Returns a <g> in layer coordinates.
 */
export function draw(kind, K, r, x, y, s = 1, opts = {}) {
  const fn = ART[kind];
  if (!fn) return '';
  const flip = opts.flip ?? false;
  return `<g ${place(x, y, s, flip)}>${fn(K, r, opts)}</g>`;
}

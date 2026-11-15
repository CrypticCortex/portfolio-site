// A scene = a world + a stack of layers, each generated lazily in 512-unit chunks.
// The same code feeds the Node exporter and the browser viewer.
import { hash, rng } from './rng.js';
import { createWorld } from './world.js';
import { LAYERS } from './layers/index.js';
import { n1, n2 } from './svg.js';
import { frameSvg } from './frame.js';

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const CHUNK = 512;
export const HEIGHT = 600;
export { LAYERS };

function makeCtx(scene, layer, ci) {
  const { world, parallax, uid } = scene;
  const f = parallax ? layer.f : 1;
  const x0 = ci * CHUNK;
  const defs = [];
  let gid = 0;
  const ctx = {
    world, layer, ci, f, x0, x1: x0 + CHUNK, H: HEIGHT, defs,
    /** biome weights / mood / painter at *layer* x (parallax-corrected to world x). */
    B: (x) => world.biomeAt(x / f),
    M: (x) => world.moodAt(x / f),
    K: (x, haze = layer.haze) => world.painter(x / f, haze),
    biomeNum: (x, get) => world.biomeNum(x / f, get),
    biomeRGB: (x, get) => world.biomeRGB(x / f, get),
    rng: (...k) => rng(world.seed, layer.index, ...k),
    salt: (k) => hash(world.seed, layer.index, k) % 100000,
    id: () => `${uid}${layer.index}_${ci}_${gid++}`,
    /** Horizontal gradient in user space; colours spread evenly. */
    lgrad(xa, xb, colors) {
      const id = ctx.id();
      const last = colors.length - 1;
      const stops = colors.map((c, i) => `<stop offset="${n2(i / last)}" stop-color="${c}"/>`).join('');
      defs.push(`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${n1(xa)}" y1="0" x2="${n1(xb)}" y2="0">${stops}</linearGradient>`);
      return `url(#${id})`;
    },
    /** Radial glow: stops = [[offset, colour, opacity], …]. */
    rgrad(stops) {
      const id = ctx.id();
      const s = stops.map(([o, c, a]) => `<stop offset="${n2(o)}" stop-color="${c}" stop-opacity="${n2(a)}"/>`).join('');
      defs.push(`<radialGradient id="${id}">${s}</radialGradient>`);
      return `url(#${id})`;
    },
    /** Fill that follows a colour function across this chunk (flat when the colour doesn't change). */
    hfill(colorAt, pad = 1) {
      const a = colorAt(x0), m = colorAt(x0 + CHUNK / 2), b = colorAt(x0 + CHUNK);
      if (a === m && m === b) return a;
      return ctx.lgrad(x0 - pad, x0 + CHUNK + pad, [a, m, b]);
    },
    /**
     * Opaque haze band for this chunk (colour follows colorAt horizontally). The vertical fade is a mask
     * applied once to the whole layer's `over` group, so neighbouring chunks overlap without double alpha.
     */
    mistRect(colorAt) {
      const { y0, y1 } = layer.mist;
      return `<rect x="${x0 - 1}" y="${y0}" width="${CHUNK + 2}" height="${y1 - y0}" fill="${ctx.hfill(colorAt, 1)}"/>`;
    },
    /**
     * Visit every grid cell of `size` that overlaps this chunk. fn(cell, cx0, cx1) is called per cell;
     * objects are expected to derive their own rng from (cell, index) and only draw when their anchor
     * lies inside [x0, x1) — so they appear exactly once however the chunks are cut.
     */
    cells(size, fn) {
      const a = Math.floor(x0 / size), b = Math.floor((x0 + CHUNK - 1e-6) / size);
      for (let c = a; c <= b; c++) fn(c, c * size, (c + 1) * size);
    },
    inChunk: (x) => x >= x0 && x < x0 + CHUNK,
  };
  return ctx;
}

export function createScene(opts = {}) {
  const world = createWorld(opts);
  const parallax = !!opts.parallax;
  const uid = 'a' + (world.seed >>> 0).toString(36) + (opts.biome ? opts.biome[0] : '') + (opts.mood ? opts.mood[0] : '');
  const scene = { world, parallax, uid, opts };
  const cache = new Map();

  /** {base, top, over} SVG strings for layer li, chunk ci. Across a layer, every `base` is painted first, then every `top`, then every `over`. */
  function layerChunk(li, ci) {
    const key = li * 1e6 + ci;
    let v = cache.get(key);
    if (!v) {
      const layer = LAYERS[li];
      const ctx = makeCtx(scene, layer, ci);
      const out = layer.gen(ctx, ctx.x0, ctx.x1) || {};
      const wrap = (inner) => (layer.dy && inner ? `<g transform="translate(0 ${layer.dy})">${inner}</g>` : inner);
      v = {
        base: wrap((ctx.defs.length ? `<defs>${ctx.defs.join('')}</defs>` : '') + (out.base || '')),
        top: wrap(out.top || ''),
        over: wrap(out.over || ''),
      };
      cache.set(key, v);
      if (cache.size > 800) cache.delete(cache.keys().next().value);
    }
    return v;
  }

  const layerScale = (li) => (parallax ? LAYERS[li].f : 1);

  /** Document-level <defs> content for layers with a vertical haze fade, and the mask id to use. */
  function mistDefs(li) {
    const L = LAYERS[li];
    if (!L.mist) return null;
    const { y0, y1, stops } = L.mist;
    const ya = y0 + (L.dy || 0), yb = y1 + (L.dy || 0);
    const g = `${uid}mg${li}`, id = `${uid}mk${li}`;
    const sv = stops.map(([o, a]) => `<stop offset="${n2(o)}" stop-color="#fff" stop-opacity="${n2(a)}"/>`).join('');
    return {
      id,
      defs:
        `<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="0" y1="${ya}" x2="0" y2="${yb}">${sv}</linearGradient>` +
        `<mask id="${id}" maskUnits="userSpaceOnUse" x="-2000000" y="${ya}" width="4000000" height="${yb - ya}"><rect x="-2000000" y="${ya}" width="4000000" height="${yb - ya}" fill="url(#${g})"/></mask>`,
    };
  }

  /** A complete SVG document of the scene seen from `scroll` (world units), `width` logical units wide. */
  function render({ scroll = 0, width = 1200, scale = 1, frame = false, title = '' } = {}) {
    const parts = [];
    const maskDefs = [];
    const PAD = 220;
    for (let li = 0; li < LAYERS.length; li++) {
      const L = LAYERS[li];
      const ox = scroll * layerScale(li);
      const c0 = Math.floor((ox - PAD) / CHUNK), c1 = Math.floor((ox + width + PAD) / CHUNK);
      let base = '', top = '', over = '';
      for (let ci = c0; ci <= c1; ci++) {
        const ch = layerChunk(li, ci);
        base += ch.base;
        top += ch.top;
        over += ch.over;
      }
      const md = mistDefs(li);
      if (md) maskDefs.push(md.defs);
      parts.push(`<g id="${L.id}" transform="translate(${n1(-ox)} 0)"><g>${base}</g><g>${top}</g><g${md ? ` mask="url(#${md.id})"` : ''}>${over}</g></g>`);
    }
    title = esc(title);
    const W = Math.round(width), H = HEIGHT;
    const body = (maskDefs.length ? `<defs>${maskDefs.join('')}</defs>` : '') + parts.join('\n');
    if (frame) return frameSvg({ body, W, H, scale, title, uid });
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${Math.round(W * scale)}" height="${Math.round(H * scale)}">` +
      `<title>${title || 'Anant Yatra'}</title>` +
      `<defs><clipPath id="${uid}clip"><rect width="${W}" height="${H}"/></clipPath></defs>` +
      `<g clip-path="url(#${uid}clip)">${body}</g></svg>`
    );
  }

  return { ...scene, layerChunk, layerScale, mistDefs, render, layers: LAYERS, CHUNK, HEIGHT };
}

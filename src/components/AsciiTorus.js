'use client';
import { useEffect, useRef } from 'react';

// ASCII render: the classic donut.c torus, shaded with characters instead of pixels.
export default function AsciiTorus() {
  const ref = useRef(null);
  useEffect(() => {
    const W = 64, H = 30, shade = '.,-~:;=!*#$@';
    let A = 0.6, B = 0.3, raf, visible = true;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = () => {
      const out = new Array(W * H).fill(' '), z = new Array(W * H).fill(0);
      const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);
      for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j), st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          const sp = Math.sin(i), cp = Math.cos(i), h = ct + 2, D = 1 / (sp * h * sA + st * cA + 5);
          const t = sp * h * cA - st * sA;
          const x = (W / 2 + 30 * D * (cp * h * cB - t * sB)) | 0, y = (H / 2 + 15 * D * (cp * h * sB + t * cB)) | 0;
          const o = x + W * y, N = (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB)) | 0;
          if (y >= 0 && y < H && x >= 0 && x < W && D > z[o]) { z[o] = D; out[o] = shade[Math.max(0, N)]; }
        }
      }
      let s = '';
      for (let k = 0; k < H; k++) s += out.slice(k * W, k * W + W).join('') + '\n';
      ref.current.textContent = s;
      if (!reduce && visible) { A += 0.04; B += 0.02; raf = requestAnimationFrame(frame); }
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); frame(); });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <pre ref={ref} className="ascii" aria-hidden="true" />;
}

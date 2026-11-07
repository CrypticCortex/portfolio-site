'use client';
import { useEffect, useRef } from 'react';

// A torus drawn as a rotating wireframe on canvas. Stops when off-screen or when motion is reduced.
export default function Wireframe() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const R = 1, r = 0.42, U = 36, V = 18;
    const pts = [];
    for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) {
      const u = (i / U) * Math.PI * 2, v = (j / V) * Math.PI * 2;
      pts.push([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)]);
    }
    let t = 0.6, raf, visible = true;
    const draw = () => {
      const dpr = devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
      if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const ca = Math.cos(t), sa = Math.sin(t), cb = Math.cos(t * 0.6 + 0.8), sb = Math.sin(t * 0.6 + 0.8);
      const s = Math.min(w, h) * 0.34;
      const P = pts.map(([x, y, z]) => {
        let X = x * ca - z * sa, Z = x * sa + z * ca;
        let Y = y * cb - Z * sb; Z = y * sb + Z * cb;
        const k = 3 / (3 + Z);
        return [w / 2 + X * s * k, h / 2 + Y * s * k, Z];
      });
      ctx.lineWidth = 1;
      for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) {
        const a = P[i * V + j], b = P[((i + 1) % U) * V + j], d = P[i * V + ((j + 1) % V)];
        const depth = (a[2] + 1.5) / 3;
        ctx.strokeStyle = `rgba(214,255,90,${0.9 - depth * 0.7})`;
        ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(a[0], a[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
      }
      if (!reduce && visible) { t += 0.006; raf = requestAnimationFrame(draw); }
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); draw(); });
    io.observe(c); draw();
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="wire" aria-hidden="true" />;
}

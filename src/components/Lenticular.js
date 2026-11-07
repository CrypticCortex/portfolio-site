'use client';
import { useEffect, useRef } from 'react';

// Lenticular print: two images interleaved in thin strips. Pointer position (or scroll, on touch) changes
// how much of each strip shows, the way tilting a lenticular card swaps the picture.
export default function Lenticular({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const set = (f) => el.style.setProperty('--lent', Math.max(0, Math.min(1, f)).toFixed(3));
    const onMove = (e) => { const r = el.getBoundingClientRect(); set((e.clientX - r.left) / r.width); };
    const onLeave = () => set(0);
    const onScroll = () => { const r = el.getBoundingClientRect(); set(1 - (r.bottom / (innerHeight + r.height))); };
    const fine = matchMedia('(pointer: fine)').matches;
    if (fine) { el.addEventListener('pointermove', onMove); el.addEventListener('pointerleave', onLeave); }
    else { addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
    return () => { el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave); removeEventListener('scroll', onScroll); };
  }, []);
  return <div ref={ref} className="lent">{children}</div>;
}

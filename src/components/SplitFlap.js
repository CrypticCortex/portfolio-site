'use client';
import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Solari split-flap board: each letter flips through the alphabet before it settles, once, when it scrolls in.
export default function SplitFlap({ text }) {
  const target = text.toUpperCase();
  const [shown, setShown] = useState(target);
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let tick = 0;
      timer = setInterval(() => {
        tick++;
        setShown([...target].map((c, i) => (c === ' ' || tick > 6 + i * 2 ? c : CHARS[(tick * 7 + i * 13) % CHARS.length])).join(''));
        if (tick > 8 + target.length * 2) clearInterval(timer);
      }, 55);
    }, { threshold: 0.6 });
    setShown(target.replace(/\S/g, ' '));
    io.observe(ref.current);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [target]);
  return (
    <span ref={ref} className="flap" aria-label={text}>
      {[...shown].map((c, i) => <span key={i} className="flap__cell" aria-hidden="true">{c}</span>)}
    </span>
  );
}

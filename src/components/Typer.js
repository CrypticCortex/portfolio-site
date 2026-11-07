'use client';
import { useEffect, useRef, useState } from 'react';

// Types a line out like a terminal once it scrolls into view. Screen readers get the full text at once.
export default function Typer({ text }) {
  const [n, setN] = useState(text.length);
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    let id;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      id = setInterval(() => setN((k) => { if (k >= text.length) { clearInterval(id); return k; } return k + 1; }), 28);
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => { io.disconnect(); clearInterval(id); };
  }, [text]);
  return (
    <p ref={ref} className="typer" aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span><span className="cursor" aria-hidden="true">█</span>
    </p>
  );
}

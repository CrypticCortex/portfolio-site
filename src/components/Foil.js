'use client';
import { useRef } from 'react';

// Holographic foil card: the rainbow sheen follows the pointer across the card.
export default function Foil({ children }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width).toFixed(3));
    ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height).toFixed(3));
  };
  return <li ref={ref} className="foil" onPointerMove={move}>{children}</li>;
}

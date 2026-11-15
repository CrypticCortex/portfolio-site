'use client';
import { useState } from 'react';

// <img> that falls back to a painted placeholder if the remote image is blocked or gone.
export default function SafeImg({ src, className = '', ...rest }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div aria-hidden className={`${className} bg-gradient-to-br from-paper2 via-[#e8c9a0] to-[#c9a58f]`} />;
  return <img src={src} alt="" className={className} onError={() => setBad(true)} loading="lazy" {...rest} />;
}

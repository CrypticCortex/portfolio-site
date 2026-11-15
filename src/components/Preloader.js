'use client';
import { useEffect, useState } from 'react';

const words = ['Hello', 'வணக்கம்', 'नमस्ते', 'నమస్కారం', 'ನಮಸ್ಕಾರ', 'നമസ്കാരം', 'Bonjour', 'Hola', 'やあ', 'Hallo'];

// The first page of the session opens on a greeting printed in two inks; it never plays again in that session.
export default function Preloader() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState('on'); // on → fading → gone
  useEffect(() => {
    if (document.documentElement.dataset.seen) { setPhase('gone'); return; }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hold = 700, step = 150, cycle = reduce ? 0 : hold + (words.length - 1) * step;
    const timers = reduce ? [] : words.slice(1).map((_, k) => setTimeout(() => setI(k + 1), hold + k * step));
    timers.push(setTimeout(() => setPhase('fading'), cycle + 400));
    timers.push(setTimeout(() => {
      setPhase('gone');
      try { sessionStorage.setItem('yatra-seen', '1'); } catch {}
      document.documentElement.dataset.seen = '1';
    }, cycle + 1100));
    return () => timers.forEach(clearTimeout);
  }, []);
  if (phase === 'gone') return null;
  return (
    <div className={`preloader ${phase === 'fading' ? 'preloader--out' : ''}`} aria-hidden="true">
      <p className="preloader__word misreg" data-text={words[i]} key={i}>{words[i]}</p>
      <p className="preloader__meta">12.97° N 77.59° E · Bangalore</p>
    </div>
  );
}

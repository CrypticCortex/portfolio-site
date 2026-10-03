import { useEffect, useState } from "react";

const words = ["Hello", "வணக்கம்", "नमः", "Bonjour", "Ciao", "やあ", "Hallå", "Hallo", "नमस्ते", "నమస్కారం", "നമസ്കാരം", "Guten tag", "Hola"];

// Cycles greetings, then fades itself out with plain CSS (no dependency on exit animations).
export default function Preloader({ done }) {
  const [index, setIndex] = useState(0);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (index === words.length - 1) return;
    const t = setTimeout(() => setIndex(index + 1), index === 0 ? 900 : 140);
    return () => clearTimeout(t);
  }, [index]);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 700);
    return () => clearTimeout(t);
  }, [done]);
  if (gone) return null;
  return (
    <div className={`fixed inset-0 z-[1000] flex items-center justify-center bg-maroon transition-opacity duration-700 ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-6 border border-gold/70" />
      <h1 className="rise font-serif text-4xl font-bold text-paper sm:text-5xl" key={index}>{words[index]}</h1>
    </div>
  );
}

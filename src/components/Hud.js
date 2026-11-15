'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// The bar that rides the whole journey: which channel you are on, the time of day the page has reached,
// and Bangalore's clock. It prints in ink over the day sections and glows like a monitor over the night ones.
export const channels = [
  ['/', '01', 'Home'],
  ['/#work', '02', 'Work'],
  ['/research', '03', 'Research'],
  ['/stack', '04', 'Stack'],
  ['/education', '05', 'Education'],
];

const glyph = { dawn: '◒', noon: '☀', dusk: '◓', night: '☾' };
const istClock = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date());

export default function Hud() {
  const path = usePathname();
  const [phase, setPhase] = useState('night');
  const [clock, setClock] = useState('');

  useEffect(() => {
    setClock(istClock());
    const id = setInterval(() => setClock(istClock()), 30000);
    return () => clearInterval(id);
  }, []);

  // whichever section sits under the bar decides the time of day
  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-phase]')];
    const apply = (p) => {
      setPhase(p);
      document.documentElement.dataset.scheme = p === 'dawn' || p === 'noon' ? 'day' : 'night';
    };
    if (!sections.length) { apply('night'); return; }
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).pop();
      if (hit) apply(hit.target.dataset.phase);
    }, { rootMargin: '-56px 0px -92% 0px' });
    sections.forEach((s) => io.observe(s));
    apply(sections[0].dataset.phase);
    return () => io.disconnect();
  }, [path]);

  const current = channels.find(([href]) => href === path) || ['', '--', 'No signal'];
  return (
    <header className="hud">
      <div className="hud__bar">
        <Link href="/" className="hud__id" aria-label="Kalyan, home">
          <span className="rec" aria-hidden="true">●</span> REC <span className="hud__ch">CH-{current[1]} {current[2]}</span>
        </Link>
        <nav className="hud__nav" aria-label="Channels">
          {channels.slice(1).map(([href, n, label]) => (
            <Link key={n} href={href} aria-current={href === path ? 'page' : undefined}><span>{n}</span>{label}</Link>
          ))}
        </nav>
        <p className="hud__time" aria-hidden="true">
          <span className="hud__phase">{glyph[phase]} {phase}</span> BLR {clock} IST
        </p>
        <details className="hud__menu">
          <summary>CH ▾</summary>
          <nav aria-label="Channels, small screens">
            {channels.map(([href, n, label]) => <Link key={n} href={href}><span>{n}</span>{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}

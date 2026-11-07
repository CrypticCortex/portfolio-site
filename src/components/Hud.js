'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// The monitor's HUD: which channel you are on, a running timecode, and the channel switcher.
export const channels = [
  ['/', '01', 'Home'],
  ['/#work', '02', 'Work'],
  ['/research', '03', 'Research'],
  ['/stack', '04', 'Stack'],
  ['/education', '05', 'Education'],
];

const pad = (n) => String(n).padStart(2, '0');

export default function Hud() {
  const path = usePathname();
  const [t, setT] = useState(0);
  useEffect(() => { const s = Date.now(); const id = setInterval(() => setT(Math.floor((Date.now() - s) / 1000)), 1000); return () => clearInterval(id); }, []);
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
        <p className="hud__time" aria-hidden="true">12.97N 77.59E <span>T+{pad(Math.floor(t / 3600))}:{pad(Math.floor(t / 60) % 60)}:{pad(t % 60)}</span></p>
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

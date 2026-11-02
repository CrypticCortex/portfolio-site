'use client';
import { useState } from 'react';

// A pausable marquee of the stack. Pauses on hover and focus; the button stops it for good.
export default function Ticker({ items }) {
  const [paused, setPaused] = useState(false);
  const run = items.map((t) => (
    <li key={t}><span>{t}</span><i aria-hidden="true" /></li>
  ));
  return (
    <section className="ticker grained" aria-label="Tools I work with" data-paused={paused}>
      <div className="ticker__window">
        <ul className="ticker__track">
          {run}
          {items.map((t) => (
            <li key={`${t}-again`} aria-hidden="true"><span>{t}</span><i /></li>
          ))}
        </ul>
      </div>
      <button type="button" className="ticker__toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? 'Play' : 'Pause'}
      </button>
    </section>
  );
}

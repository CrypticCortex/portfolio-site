'use client';
import { Children, useCallback, useEffect, useRef, useState } from 'react';

// A zine you page through. Wide screens: a two-page spread whose right leaf turns over the spine.
// Narrow screens: one page at a time in a native swipe strip. Both read the same pages; #pN deep-links a page.
// Page i sits on spread ceil(i / 2): the cover (0) alone on the right, then pairs (1,2), (3,4)…, the back cover alone.
const spreadOf = (i) => Math.ceil(i / 2);
const BOOK = '(min-width: 60rem) and (min-aspect-ratio: 1/1)';

export default function Zine({ children, pdf }) {
  const pages = Children.toArray(children);
  const n = pages.length;
  const last = spreadOf(n - 1);
  const [spread, setSpread] = useState(0);
  const [turn, setTurn] = useState(null); // { dir: 1 | -1, to }
  const [book, setBook] = useState(true);
  const [current, setCurrent] = useState(0); // strip mode: page in view
  const strip = useRef(null);
  const reduce = useRef(false);

  const turnTo = useCallback((to, animate = true) => {
    to = Math.max(0, Math.min(last, to));
    if (turn || to === spread) return;
    if (animate && !reduce.current && Math.abs(to - spread) === 1) setTurn({ dir: to > spread ? 1 : -1, to });
    else setSpread(to);
  }, [turn, spread, last]);

  const showPage = useCallback((i, animate) => {
    if (book) turnTo(spreadOf(i), animate);
    else strip.current?.children[i]?.scrollIntoView({ behavior: reduce.current ? 'auto' : 'smooth', inline: 'start', block: 'nearest' });
  }, [book, turnTo]);

  const step = useCallback((d) => {
    if (book) turnTo(spread + d);
    else showPage(Math.max(0, Math.min(n - 1, current + d)));
  }, [book, spread, current, n, turnTo, showPage]);

  // layout mode + reduced motion
  useEffect(() => {
    const mq = matchMedia(BOOK), rm = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setBook(mq.matches); reduce.current = rm.matches; };
    sync(); mq.addEventListener('change', sync); rm.addEventListener('change', sync);
    return () => { mq.removeEventListener('change', sync); rm.removeEventListener('change', sync); };
  }, []);

  // open on the page named in the URL (also after a layout switch), and follow #pN links
  const showRef = useRef(showPage);
  showRef.current = showPage;
  useEffect(() => {
    const go = () => {
      const m = /^#p(\d+)$/.exec(location.hash);
      if (m) showRef.current(Math.min(n - 1, +m[1]), false);
    };
    go();
    addEventListener('hashchange', go);
    return () => removeEventListener('hashchange', go);
  }, [book, n]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); step(1); }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); step(-1); }
      else if (k === 'Home') { e.preventDefault(); showPage(0, false); }
      else if (k === 'End') { e.preventDefault(); showPage(n - 1, false); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [step, showPage, n]);

  // strip mode: which page is in view
  useEffect(() => {
    if (book || !strip.current) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCurrent(+e.target.dataset.i)), { root: strip.current, threshold: 0.6 });
    [...strip.current.children].forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [book]);

  // keep the URL on the page being read (not on first render, which would erase the page we were asked to open)
  const shown = book ? Math.max(0, 2 * spread - 1) : current;
  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current) { loaded.current = true; return; }
    history.replaceState(null, '', shown ? `#p${shown}` : location.pathname);
  }, [shown]);

  const role = (i) => {
    const s = spreadOf(i), left = i % 2 === 1;
    if (!turn) return s === spread ? (left ? 'left' : 'right') : 'off';
    if (turn.dir === 1) {
      if (i === 2 * spread) return 'out-fwd';        // current right leaf lifts
      if (i === 2 * spread + 1) return 'in-fwd';     // its back is the next left page
      if (i === 2 * spread - 1) return 'left';
      if (i === 2 * spread + 2) return 'right';      // revealed underneath
    } else {
      if (i === 2 * spread - 1) return 'out-back';
      if (i === 2 * spread - 2) return 'in-back';
      if (i === 2 * spread) return 'right';
      if (i === 2 * spread - 3) return 'left';
    }
    return 'off';
  };

  const target = turn ? turn.to : spread;
  const shift = target === 0 ? 'right' : target === last && (n - 1) % 2 === 1 ? 'left' : 'both';
  const finish = (e) => { if (e.target === e.currentTarget && turn) { setSpread(turn.to); setTurn(null); } };

  // click a page's outer half (not a link) to turn it; drag horizontally on touch screens
  const drag = useRef(null);
  const onPointerDown = (e) => { drag.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e) => {
    const d = drag.current; drag.current = null;
    if (!d || e.target.closest('a, button')) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - d.y)) { step(dx < 0 ? 1 : -1); return; }
    if (Math.abs(dx) < 6) {
      const r = e.currentTarget.getBoundingClientRect();
      step(e.clientX > r.left + r.width / 2 ? 1 : -1);
    }
  };

  const label = book
    ? [2 * spread - 1, 2 * spread].filter((i) => i >= 0 && i < n)
    : [current];
  const status = label.map((i) => (i === 0 ? 'Cover' : i === n - 1 ? 'Back cover' : `p. ${i}`)).join(' – ');
  const atStart = book ? spread === 0 : current === 0;
  const atEnd = book ? spread === last : current === n - 1;

  return (
    <div className="desk">
      {book ? (
        <div className={`book book--${shift}`} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          {pages.map((p, i) => (
            <div key={i} className={`leaf leaf--${role(i)}`} data-i={i} onAnimationEnd={finish} aria-hidden={role(i) === 'off' || undefined}>{p}</div>
          ))}
          <div className="spine" aria-hidden="true" />
        </div>
      ) : (
        <div className="strip" ref={strip}>
          {pages.map((p, i) => <div key={i} className="leaf" data-i={i}>{p}</div>)}
        </div>
      )}
      <nav className="controls" aria-label="Pages">
        <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label="Previous page">←</button>
        <p className="controls__status" aria-live="polite">{status} <span>/ {n - 2} pp.</span></p>
        <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label="Next page">→</button>
        <a href="#p1" onClick={(e) => { e.preventDefault(); showPage(1, false); }}>Contents</a>
        <a href={pdf} download>Download PDF</a>
      </nav>
    </div>
  );
}

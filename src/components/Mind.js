'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildGraph, thoughts } from '@/data/graph';
import { profile } from '@/data/profile';
import { createMind, STEP } from './mind-engine';

// The portfolio as a mind: every project, job, paper, theme and tool is a word, joined to what it touches.
// It grows out from the centre, signals keep travelling its connections, and when left alone it thinks: a
// spark runs a path and one sentence appears. Hover a word to fire its connections; click to open it.

const KIND = { theme: 'Theme', role: 'Work', project: 'Project', paper: 'Paper', tool: 'Tool', self: '' };
const KINDS = [['theme', 'Themes'], ['project', 'Projects'], ['role', 'Work'], ['paper', 'Papers'], ['tool', 'Tools']];
const IDLE = 4500, THOUGHT = 8200, FIRST = 3400;

// split a sentence into words, keeping {marked} map words whole and tagged with their kind
function tokenize(text, nodes) {
  const kindOf = (word) => {
    const w = word.toLowerCase();
    const n = nodes.find((m) => m.label.toLowerCase() === w) || nodes.find((m) => m.label.toLowerCase().startsWith(w + ' '));
    return n ? n.type : null;
  };
  const out = [];
  text.split(/(\{[^}]+\})/).forEach((seg) => {
    if (!seg) return;
    if (seg[0] === '{') { const w = seg.slice(1, -1); out.push({ w, k: kindOf(w) }); return; }
    seg.split(/(\s+)/).forEach((p) => { if (p) out.push(/^\s+$/.test(p) ? ' ' : { w: p, k: null }); });
  });
  return out;
}

export default function Mind({ index }) {
  const graph = useMemo(() => buildGraph(), []);
  const { nodes, edges, byId } = graph;
  const neighbours = useMemo(() => {
    const m = Object.fromEntries(nodes.map((n) => [n.id, new Set()]));
    edges.forEach(([a, b]) => { m[a].add(b); m[b].add(a); });
    return m;
  }, [nodes, edges]);
  const lines = useMemo(() => thoughts.map(([path, text]) => ({ path, tokens: tokenize(text, nodes), plain: text.replace(/[{}]/g, '') })), [nodes]);

  const wrap = useRef(null), canvas = useRef(null), panelRef = useRef(null), els = useRef({}), engine = useRef(null);
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const [thought, setThought] = useState(null); // { id, k, path, step, at }
  const [caption, setCaption] = useState(null); // the last thought's sentence, kept while it fades out
  const [showIndex, setShowIndex] = useState(false);
  const [paused, setPaused] = useState(false);
  const [kindHover, setKindHover] = useState(null);
  const [kindPin, setKindPin] = useState(null);
  const kind = kindHover || kindPin;
  const live = useRef({});
  live.current = { hover, open, thought, kind, paused, hidden: showIndex };

  const suppressClick = useRef(false);
  const lastTouch = useRef(-1e9);
  const touch = useCallback(() => { lastTouch.current = performance.now(); }, []);

  // ---- the engine: physics, camera and everything drawn under the words ---------------------------------------
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const m = createMind({
      wrap: wrap.current, canvas: canvas.current, els: els.current, panel: panelRef, nodes, edges, byId, neighbours, live, reduce,
      onDragged: () => { suppressClick.current = true; },
    });
    engine.current = m;
    return () => { m.destroy(); engine.current = null; };
  }, [nodes, edges, byId, neighbours]);

  // ---- trains of thought while nobody is touching it ----------------------------------------------------------
  const nextThought = useRef(0), seq = useRef(0), mountedAt = useRef(0);
  useEffect(() => { if (!mountedAt.current) mountedAt.current = performance.now(); }, []);
  useEffect(() => {
    if (paused || showIndex) return undefined;
    const timers = [];
    const play = () => {
      const { hover: h, open: o, kind: kd } = live.current;
      if (h || o || kd || performance.now() - lastTouch.current < IDLE) return;
      const k = nextThought.current++ % lines.length, { path } = lines[k], id = ++seq.current;
      setThought({ id, k, path, step: 0, at: performance.now() });
      setCaption({ id, k });
      engine.current?.ping(path[0]);
      path.slice(1).forEach((_, j) => timers.push(setTimeout(() => setThought((th) => (th && th.id === id ? { ...th, step: j + 1, at: performance.now() } : th)), (j + 1) * STEP)));
      timers.push(setTimeout(() => setThought((th) => (th && th.id === id ? null : th)), THOUGHT - 700));
    };
    const first = setTimeout(play, Math.max(1200, FIRST - (performance.now() - mountedAt.current))); // the first waits for the map to grow
    const loop = setInterval(play, THOUGHT);
    return () => { clearTimeout(first); clearInterval(loop); timers.forEach(clearTimeout); setThought(null); };
  }, [paused, showIndex, lines]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(null); setShowIndex(false); setKindPin(null); } };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const select = (id) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    touch();
    const next = id === 'kalyan' && open === 'kalyan' ? null : id;
    setOpen(next);
    if (next) { engine.current?.ping(next); engine.current?.burst(next); }
  };
  const enter = (id) => { touch(); setHover(id); engine.current?.burst(id); };
  const node = open ? byId[open] : null;
  const quote = node ? lines.find((l) => l.path[1] === node.id) : null;
  const line = caption ? lines[caption.k] : null;
  const thinking = thought && !hover && !open && !kind; // a focused word or kind outranks the thought on screen
  let wi = 0;

  return (
    <div className={`mind ${thinking ? 'mind--thinking' : ''}`} onPointerMove={touch}>
      <header className="top">
        <p className="top__who">{profile.title} at Guidewire, Bangalore</p>
        <nav className="top__links" aria-label="Contact">
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <button type="button" onClick={() => { touch(); setShowIndex(true); }}>Index</button>
        </nav>
      </header>

      <div className="field" ref={wrap}
        onClick={(e) => { if (e.target === e.currentTarget || e.target === canvas.current) { engine.current?.poke(e.clientX, e.clientY); setOpen(null); } }}>
        <canvas ref={canvas} className="edges" aria-hidden="true" />
        {nodes.map((n) => (
          <button key={n.id} type="button" data-node={n.id} className={`w w--${n.type}`} ref={(el) => { els.current[n.id] = el; }}
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') enter(n.id); }}
            onPointerLeave={() => setHover(null)}
            onFocus={() => enter(n.id)} onBlur={() => setHover(null)}
            onClick={() => select(n.id)} aria-label={`${n.label}${KIND[n.type] ? `, ${KIND[n.type].toLowerCase()}` : ''}`}>
            <span className="w__in">{n.label}{n.native && <span className="w__native" lang="hi">{n.native}</span>}</span>
          </button>
        ))}
      </div>

      <div className={`thought ${thinking ? 'thought--on' : ''}`} aria-live="polite">
        {line && (
          <p key={caption.id} className="thought__line">
            <span className="sr">{line.plain}</span>
            <span aria-hidden="true">
              {line.tokens.map((t, j) => (t === ' ' ? ' ' : (
                <span key={j} className={`thought__w${t.k ? ` thought__w--${t.k}` : ''}`} style={{ '--i': wi++ }}>{t.w}</span>
              )))}
            </span>
          </p>
        )}
        {line && <span key={`bar${caption.id}`} className="thought__bar" style={{ '--dur': `${THOUGHT - 700}ms` }} aria-hidden="true" />}
      </div>

      <div className="legend" role="group" aria-label="Light up one kind">
        {KINDS.map(([k, label]) => (
          <button key={k} type="button" className={`legend__item legend__item--${k}`} aria-pressed={kindPin === k}
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') { touch(); setKindHover(k); } }} onPointerLeave={() => setKindHover(null)}
            onFocus={() => setKindHover(k)} onBlur={() => setKindHover(null)}
            onClick={() => { touch(); setKindPin((p) => (p === k ? null : k)); }}>{label}</button>
        ))}
      </div>
      <div className="dock">
        <p className="hint">Hover a word, click to open it, or just watch it think</p>
        <button type="button" className="pause" data-paused={paused ? '' : undefined} onClick={() => setPaused((p) => !p)}>
          <span className="pause__icons" aria-hidden="true">
            <svg className="pause__i pause__i--pause" viewBox="0 0 16 16"><rect x="4" y="3" width="2.6" height="10" rx="1" /><rect x="9.4" y="3" width="2.6" height="10" rx="1" /></svg>
            <svg className="pause__i pause__i--play" viewBox="0 0 16 16"><path d="M5 3.4v9.2a.7.7 0 0 0 1.06.6l7.4-4.6a.7.7 0 0 0 0-1.2l-7.4-4.6A.7.7 0 0 0 5 3.4z" /></svg>
          </span>
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>

      <aside ref={panelRef} className={`panel ${node ? 'panel--open' : ''}`} style={node ? { '--kind': `var(--k-${node.type})` } : undefined}
        aria-hidden={!node} aria-label={node ? node.label : undefined}>
        {node && (
          <div className="panel__body" key={node.id}>
            <button type="button" className="panel__close" onClick={() => setOpen(null)} aria-label="Close">×</button>
            <Detail node={node} />
            {quote && <p className="panel__quote">{quote.plain}</p>}
            {neighbours[node.id].size > 0 && <p className="panel__kicker">Connected to</p>}
            {neighbours[node.id].size > 0 && (
              <ul className="chips">
                {[...neighbours[node.id]].map((id) => byId[id]).sort((a, b) => a.type.localeCompare(b.type)).map((m, i) => (
                  <li key={m.id} style={{ '--i': i }}><button type="button" className={`chip chip--${m.type}`} onClick={() => select(m.id)}>{m.label}</button></li>
                ))}
              </ul>
            )}
          </div>
        )}
      </aside>

      <div className={`index ${showIndex ? 'index--open' : ''}`} role="dialog" aria-modal="true" aria-label="Index" hidden={!showIndex}>
        <button type="button" className="panel__close" onClick={() => setShowIndex(false)} aria-label="Close index">×</button>
        {index}
      </div>
    </div>
  );
}

function Detail({ node: n }) {
  const kicker = <p className="panel__kicker">{KIND[n.type] || 'Hello'}</p>;
  if (n.type === 'self') return (
    <>
      {kicker}
      <h2>I&rsquo;m Kalyan.</h2>
      <p className="panel__lead">{profile.title} at Guidewire in Bangalore, working where AI meets software. I build agents, the evals that judge them, and the memory they run on.</p>
      <p>Everything I&rsquo;ve built is on this map, joined to what it touches. <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
    </>
  );
  if (n.type === 'project') return (
    <>{kicker}<h2>{n.label}</h2><p className="panel__lead">{n.text}</p><p className="mono">{n.stack.join(', ')}</p>
      {n.url && <p><a href={n.url} target="_blank" rel="noopener noreferrer">Source on GitHub</a></p>}</>
  );
  if (n.type === 'role') return (
    <>{kicker}<h2>{n.label}</h2><p className="meta">{n.role}, {n.when}</p><ul className="points">{n.points.map((p) => <li key={p}>{p}</li>)}</ul></>
  );
  if (n.type === 'paper') return (<>{kicker}<h2>{n.title}</h2><p className="meta">{n.org}, {n.when}</p></>);
  if (n.type === 'theme') return (<>{kicker}<h2>{n.label}</h2>{n.text && <p className="panel__lead">{n.text}</p>}</>);
  return (<>{kicker}<h2>{n.label}</h2></>);
}

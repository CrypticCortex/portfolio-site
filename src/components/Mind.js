'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildGraph, thoughts } from '@/data/graph';
import { profile } from '@/data/profile';

// The portfolio as a mind: every project, job, paper, theme and tool is a word, joined to what it touches.
// Left alone it thinks: a train of thought lights a path and says one sentence. Hover lights a word's
// neighbours; click opens it. Layout is a small force simulation (springs, repulsion, rings by kind).

const RING = { self: 0, theme: 190, role: 300, project: 330, paper: 420, tool: 470 };
const SPRING = { theme: 170, role: 130, project: 120, paper: 100, tool: 85 };
const KIND = { theme: 'Theme', role: 'Work', project: 'Project', paper: 'Paper', tool: 'Tool', self: '' };
const IDLE = 4500, THOUGHT = 7600;

export default function Mind({ index }) {
  const graph = useMemo(() => buildGraph(), []);
  const { nodes, edges, byId } = graph;
  const neighbours = useMemo(() => {
    const m = Object.fromEntries(nodes.map((n) => [n.id, new Set()]));
    edges.forEach(([a, b]) => { m[a].add(b); m[b].add(a); });
    return m;
  }, [nodes, edges]);

  const wrap = useRef(null), canvas = useRef(null), els = useRef({});
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const [thought, setThought] = useState(null); // { path, text, step }
  const [showIndex, setShowIndex] = useState(false);
  const [ready, setReady] = useState(false);
  const live = useRef({ hover: null, open: null, thought: null });
  live.current = { hover, open, thought };

  // ---- simulation + drawing ----------------------------------------------------------------------
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cv = canvas.current, ctx = cv.getContext('2d');
    let W = 0, H = 0, s = 1, raf = 0, t0 = performance.now();
    const P = {}; // id → { x, y, vx, vy, hw, hh, phase }
    let ax = 1.4; // rings are ellipses stretched to the screen's shape
    const ring = (type, a) => ({ x: Math.cos(a) * RING[type] * ax, y: Math.sin(a) * RING[type] });
    const angleOf = (ids) => { // mean direction of already-placed nodes
      let x = 0, y = 0;
      ids.forEach((id) => { if (P[id]) { x += P[id].x / ax; y += P[id].y; } });
      return Math.atan2(y, x);
    };
    const place = (id, type, a, i) => { P[id] = { ...ring(type, a), vx: 0, vy: 0, hw: 30, hh: 10, phase: i * 1.7 }; };
    // seed by meaning: themes and jobs around the centre, then each piece of work beside what it belongs to
    P.kalyan = { x: 0, y: 0, vx: 0, vy: 0, hw: 80, hh: 30, phase: 0 };
    const of = (type) => nodes.filter((n) => n.type === type);
    of('theme').forEach((n, i, all) => place(n.id, 'theme', (i / all.length) * Math.PI * 2 - Math.PI / 2, i));
    of('role').forEach((n, i) => place(n.id, 'role', angleOf([...neighbours[n.id]]) + 0.35, i));
    for (const type of ['project', 'paper', 'tool']) {
      of(type).forEach((n, i) => place(n.id, type, angleOf([...neighbours[n.id]]) + ((i % 3) - 1) * 0.18, i));
    }
    const measure = () => {
      for (const n of nodes) {
        const el = els.current[n.id];
        if (el) { P[n.id].hw = el.offsetWidth / 2 / s; P[n.id].hh = el.offsetHeight / 2 / s; }
      }
    };
    const resize = () => {
      W = wrap.current.clientWidth; H = wrap.current.clientHeight;
      const dpr = devicePixelRatio || 1;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = W > 760;
      const usableW = W - (wide ? 140 : 20), usableH = H - (wide ? 170 : 230);
      const nextAx = Math.max(0.5, Math.min(1.8, usableW / usableH));
      for (const id in P) P[id].x *= nextAx / ax; // keep the layout's shape when the screen changes
      ax = nextAx;
      s = usableH / 1000;
      wrap.current.style.setProperty('--s', Math.max(0.42, s).toFixed(3));
      measure();
    };

    const step = (time) => {
      const ids = nodes.map((n) => n.id);
      // a soft charge keeps words apart; overlapping label boxes are pushed out along the shallower axis
      for (let i = 0; i < ids.length; i++) {
        const a = P[ids[i]];
        for (let j = i + 1; j < ids.length; j++) {
          const b = P[ids[j]];
          let dx = b.x - a.x, dy = b.y - a.y;
          // charge works in the ring's own (unstretched) space, so words spread evenly round the ellipse
          const ex = dx / ax, d2 = ex * ex + dy * dy || 0.01, d = Math.sqrt(d2), f = Math.min(3, 6000 / d2);
          a.vx -= (ex / d) * f * ax; a.vy -= (dy / d) * f; b.vx += (ex / d) * f * ax; b.vy += (dy / d) * f;
          const ox = a.hw + b.hw + 10 - Math.abs(dx), oy = a.hh + b.hh + 6 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            const k = i === 0 ? 2 : 1; // the centre word (index 0) is pinned, so its neighbour takes the whole push
            if (ox / (a.hw + b.hw) < oy / (a.hh + b.hh)) { const p = (dx < 0 ? -1 : 1) * ox * 0.25; a.vx -= p; b.vx += p * k; }
            else { const p = (dy < 0 ? -1 : 1) * oy * 0.25; a.vy -= p; b.vy += p * k; }
          }
        }
      }
      // springs along every edge
      for (const [ia, ib] of edges) {
        const a = P[ia], b = P[ib], ta = byId[ia].type, tb = byId[ib].type;
        const L = SPRING[ta === 'self' ? tb : tb === 'self' ? ta : ta === 'tool' || tb === 'tool' ? 'tool' : ta === 'paper' || tb === 'paper' ? 'paper' : 'project'];
        let dx = b.x - a.x, dy = b.y - a.y; const d = Math.hypot(dx, dy) || 0.01;
        const f = (d - L) * 0.008;
        dx /= d; dy /= d;
        a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f;
      }
      // each kind keeps to its ring; a slow breath; damping; the centre word stays put
      let mx = 0, my = 0;
      for (const n of nodes) {
        const p = P[n.id];
        if (n.type === 'self') { p.x = 0; p.y = 0; p.vx = p.vy = 0; continue; }
        const ex = p.x / ax, d = Math.hypot(ex, p.y) || 0.01, f = (RING[n.type] - d) * 0.03;
        p.vx += (ex / d) * f * ax; p.vy += (p.y / d) * f;
        if (!reduce && time) { p.vx += Math.sin(time / 2400 + p.phase) * 0.025; p.vy += Math.cos(time / 2900 + p.phase) * 0.025; }
        if (drag && drag.id === n.id) { p.x = drag.x; p.y = drag.y; p.vx = p.vy = 0; continue; }
        p.vx *= 0.8; p.vy *= 0.8;
        p.x += Math.max(-20, Math.min(20, p.vx)); p.y += Math.max(-20, Math.min(20, p.vy));
        mx += p.x; my += p.y;
      }
      // keep the whole map balanced round the centre word (the pinned centre would otherwise let it drift)
      mx /= nodes.length - 1; my /= nodes.length - 1;
      for (const n of nodes) if (n.type !== 'self') { P[n.id].x -= mx * 0.1; P[n.id].y -= my * 0.1; }
      // soft walls: no word leaves the screen (below the top bar, above the legend)
      const cy = H / 2 + (W > 760 ? 10 : -40);
      for (const n of nodes) {
        if (n.type === 'self') continue;
        const p = P[n.id];
        const x0 = (-W / 2 + 10) / s + p.hw, x1 = (W / 2 - 10) / s - p.hw;
        const y0 = (56 - cy) / s + p.hh, y1 = (H - (W > 760 ? 128 : 150) - cy) / s - p.hh; // the caption owns the bottom strip
        if (p.x < x0) p.x += (x0 - p.x) * 0.5; else if (p.x > x1) p.x -= (p.x - x1) * 0.5;
        if (p.y < y0) p.y += (y0 - p.y) * 0.5; else if (p.y > y1) p.y -= (p.y - y1) * 0.5;
      }
    };

    const lit = () => {
      const { hover: h, open: o, thought: th } = live.current;
      const focus = h || o;
      if (focus) return { nodes: new Set([focus, ...neighbours[focus]]), path: null, focus };
      if (th) return { nodes: new Set(th.path.slice(0, th.step + 1)), path: th.path, focus: null, step: th.step, at: th.at };
      return null;
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2 + (W > 760 ? 10 : -40);
      const L = lit();
      // edges
      for (const [a, b] of edges) {
        const pa = P[a], pb = P[b];
        const on = L && (L.focus ? (a === L.focus || b === L.focus) : false);
        ctx.strokeStyle = on ? 'rgba(242,177,52,0.75)' : L ? 'rgba(244,236,220,0.05)' : 'rgba(244,236,220,0.11)';
        ctx.lineWidth = on ? 1.4 : 1;
        ctx.beginPath(); ctx.moveTo(cx + pa.x * s, cy + pa.y * s); ctx.lineTo(cx + pb.x * s, cy + pb.y * s); ctx.stroke();
      }
      // a thought travels its path: finished edges glow, and a spark runs the edge to the next word
      if (L?.path) {
        ctx.strokeStyle = 'rgba(242,177,52,0.9)'; ctx.lineWidth = 1.8;
        for (let i = 0; i < L.step; i++) {
          const pa = P[L.path[i]], pb = P[L.path[i + 1]];
          ctx.beginPath(); ctx.moveTo(cx + pa.x * s, cy + pa.y * s); ctx.lineTo(cx + pb.x * s, cy + pb.y * s); ctx.stroke();
        }
        if (!reduce && L.step < L.path.length - 1) {
          const pa = P[L.path[L.step]], pb = P[L.path[L.step + 1]];
          const u = Math.min(1, (time - L.at) / 900);
          const x = cx + (pa.x + (pb.x - pa.x) * u) * s, y = cy + (pa.y + (pb.y - pa.y) * u) * s;
          ctx.beginPath(); ctx.moveTo(cx + pa.x * s, cy + pa.y * s); ctx.lineTo(x, y); ctx.stroke();
          const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
          g.addColorStop(0, 'rgba(255,214,120,0.95)'); g.addColorStop(1, 'rgba(255,214,120,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
        }
      }
      // words
      for (const n of nodes) {
        const el = els.current[n.id]; if (!el) continue;
        const p = P[n.id];
        el.style.transform = `translate(${(cx + p.x * s).toFixed(1)}px, ${(cy + p.y * s).toFixed(1)}px) translate(-50%, -50%)`;
        // a hovered/opened word dims the rest hard; a passing thought only fades them, so the map stays readable
        el.dataset.state = !L ? '' : L.nodes.has(n.id) ? (n.id === (L.focus || (L.path && L.path[L.step])) ? 'focus' : 'lit') : L.focus ? 'dim' : 'fade';
      }
    };

    // drag a word around (it springs back into the map when let go)
    let drag = null;
    const toWorld = (e) => {
      const r = wrap.current.getBoundingClientRect(), cx = W / 2, cy = H / 2 + (W > 760 ? 10 : -40);
      return { x: (e.clientX - r.left - cx) / s, y: (e.clientY - r.top - cy) / s };
    };
    const down = (e) => {
      const id = e.target.closest?.('[data-node]')?.dataset.node;
      if (!id || id === 'kalyan' || e.pointerType === 'touch') return;
      drag = { id, ...toWorld(e), moved: false, sx: e.clientX, sy: e.clientY };
    };
    const move = (e) => {
      if (!drag) return;
      Object.assign(drag, toWorld(e));
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 4) drag.moved = true;
    };
    const up = () => { if (drag?.moved) suppressClick.current = true; drag = null; };

    resize();
    for (let i = 0; i < 400; i++) step(0); // settle before the first frame
    draw(0);
    setReady(true);
    const frame = (time) => { step(time - t0); draw(time); raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    addEventListener('resize', resize);
    wrap.current.addEventListener('pointerdown', down);
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(raf); removeEventListener('resize', resize);
      removeEventListener('pointermove', move); removeEventListener('pointerup', up);
    };
  }, [nodes, edges, byId, neighbours]);

  const suppressClick = useRef(false);

  // ---- trains of thought while nobody is touching it -----------------------------------------------
  const lastTouch = useRef(-1e9);
  useEffect(() => {
    let k = 0, timers = [];
    const play = () => {
      const { hover: h, open: o } = live.current;
      if (h || o || showIndex || performance.now() - lastTouch.current < IDLE) return;
      const [path, text] = thoughts[k++ % thoughts.length];
      setThought({ path, text, step: 0, at: performance.now() });
      path.slice(1).forEach((_, j) => timers.push(setTimeout(() => setThought((th) => (th && th.path === path ? { ...th, step: j + 1, at: performance.now() } : th)), (j + 1) * 900)));
      timers.push(setTimeout(() => setThought((th) => (th && th.path === path ? null : th)), THOUGHT - 600));
    };
    const first = setTimeout(play, 1800);
    const id = setInterval(play, THOUGHT);
    return () => { clearTimeout(first); clearInterval(id); timers.forEach(clearTimeout); };
  }, [showIndex]);

  // any movement postpones the next thought; a hovered or opened word outranks the one playing
  const touch = useCallback(() => { lastTouch.current = performance.now(); }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(null); setShowIndex(false); } };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const select = (id) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    touch(); setOpen(id === 'kalyan' && open === 'kalyan' ? null : id);
  };
  const node = open ? byId[open] : null;

  return (
    <div className="mind" onPointerMove={touch}>
      <header className="top">
        <p className="top__who">{profile.title} at Guidewire · Bangalore</p>
        <nav className="top__links" aria-label="Contact">
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <button type="button" onClick={() => { touch(); setShowIndex(true); }}>Index</button>
        </nav>
      </header>

      <div className={`field ${ready ? 'field--ready' : ''} ${open ? 'field--open' : ''}`} ref={wrap} onClick={(e) => { if (e.target === e.currentTarget || e.target === canvas.current) setOpen(null); }}>
        <canvas ref={canvas} className="edges" aria-hidden="true" />
        {nodes.map((n) => (
          <button key={n.id} type="button" data-node={n.id} className={`w w--${n.type}`} ref={(el) => { els.current[n.id] = el; }}
            onPointerEnter={(e) => { if (e.pointerType !== 'touch') { touch(); setHover(n.id); } }}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(n.id)} onBlur={() => setHover(null)}
            onClick={() => select(n.id)} aria-label={`${n.label}${KIND[n.type] ? `, ${KIND[n.type].toLowerCase()}` : ''}`}>
            {n.label}{n.native && <span className="w__native" lang="hi">{n.native}</span>}
          </button>
        ))}
      </div>

      <p className={`thought ${thought ? 'thought--on' : ''}`} aria-live="polite">{thought?.text}</p>

      <ul className="legend" aria-hidden="true">
        <li className="legend--theme">Themes</li><li className="legend--project">Projects</li>
        <li className="legend--role">Work</li><li className="legend--paper">Papers</li><li className="legend--tool">Tools</li>
      </ul>
      <p className="hint" aria-hidden="true">Hover a word · click to open · or just watch it think</p>

      <aside className={`panel ${node ? 'panel--open' : ''}`} aria-hidden={!node} aria-label={node ? node.label : undefined}>
        {node && (
          <>
            <button type="button" className="panel__close" onClick={() => setOpen(null)} aria-label="Close">×</button>
            <Detail node={node} />
            {neighbours[node.id].size > 0 && (
              <>
                <p className="panel__kicker">Connected to</p>
                <ul className="chips">
                  {[...neighbours[node.id]].map((id) => byId[id]).sort((a, b) => a.type.localeCompare(b.type)).map((m) => (
                    <li key={m.id}><button type="button" className={`chip chip--${m.type}`} onClick={() => select(m.id)}>{m.label}</button></li>
                  ))}
                </ul>
              </>
            )}
          </>
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
    <>{kicker}<h2>{n.label}</h2><p className="panel__lead">{n.text}</p><p className="mono">{n.stack.join(' · ')}</p>
      {n.url && <p><a href={n.url} target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a></p>}</>
  );
  if (n.type === 'role') return (
    <>{kicker}<h2>{n.label}</h2><p className="mono">{n.role} · {n.when}</p><ul className="points">{n.points.map((p) => <li key={p}>{p}</li>)}</ul></>
  );
  if (n.type === 'paper') return (<>{kicker}<h2>{n.title}</h2><p className="mono">{n.org} · {n.when}</p></>);
  if (n.type === 'theme') return (<>{kicker}<h2>{n.label}</h2>{n.text && <p className="panel__lead">{n.text}</p>}</>);
  return (<>{kicker}<h2>{n.label}</h2></>);
}

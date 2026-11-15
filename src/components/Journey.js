'use client';
import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { createScene, CHUNK, HEIGHT, LAYERS } from '@/yatra/scene.js';
import { BIOMES } from '@/yatra/biomes.js';
import { fetchSky, skyMood, istTime } from '@/lib/bangalore-sky';

// The portfolio is a walk. Anant Yatra paints an endless Indian landscape, lit like Bangalore is lit right now,
// and the walk never stops; each stretch of road carries one stop of the story. Visitors can just watch,
// or scroll/drag/arrow to walk faster, or pick a stop from the route.
const NS = 'http://www.w3.org/2000/svg';
const SEED = 11;          // starts on the Deccan (Bangalore's plateau), then Kerala, the Himalaya, Kashmir, the Thar…
const SPAN = 900;         // world units of road per stop
const SPEED = 42;         // world units per second when left alone
const REFRESH = 5 * 60_000;

export default function Journey({ titles, children }) {
  const stops = Children.toArray(children);
  const n = stops.length;
  const stage = useRef(null);
  const api = useRef(null);
  const [stop, setStop] = useState(0);
  const [region, setRegion] = useState('deccan');
  const [now, setNow] = useState(null);
  const [sky, setSky] = useState(null);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = stage.current;
    let k = 1, viewW = 1200, scroll = 0, vel = 0, target = null, hold = false, raf = 0;
    let current = null; // { world: div, layers: [...], scene }

    function mount(mood) {
      const scene = createScene({ seed: SEED, parallax: true, clock: mood });
      const world = document.createElement('div');
      world.className = 'world';
      world.style.transform = `scale(${k})`;
      const layers = LAYERS.map((L, li) => {
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'layer');
        svg.setAttribute('width', '1');
        svg.setAttribute('height', '1');
        const [b, t, o] = [0, 1, 2].map(() => document.createElementNS(NS, 'g'));
        const md = scene.mistDefs(li);
        if (md) {
          const defs = document.createElementNS(NS, 'defs');
          defs.innerHTML = md.defs;
          svg.append(defs);
          o.setAttribute('mask', `url(#${md.id})`);
        }
        svg.append(b, t, o);
        world.append(svg);
        return { svg, b, t, o, chunks: new Map() };
      });
      const next = { world, layers, scene };
      el.append(world);
      place(next);
      if (current) {
        // cross-fade into the new light, then drop the old painting
        const old = current;
        world.style.opacity = '0';
        requestAnimationFrame(() => { world.style.transition = 'opacity 3s ease'; world.style.opacity = '1'; });
        setTimeout(() => old.world.remove(), 3200);
      }
      current = next;
    }

    const insertSorted = (parent, node, ci) => {
      for (const child of parent.children) if (Number(child.dataset.c) > ci) { parent.insertBefore(node, child); return; }
      parent.append(node);
    };

    function place(v) {
      const PAD = 320;
      v.layers.forEach((L, li) => {
        const ox = scroll * v.scene.layerScale(li);
        const c0 = Math.floor((ox - PAD) / CHUNK), c1 = Math.floor((ox + viewW + PAD) / CHUNK);
        for (let ci = c0; ci <= c1; ci++) {
          if (L.chunks.has(ci)) continue;
          const data = v.scene.layerChunk(li, ci);
          const gs = [data.base, data.top, data.over].map((html) => {
            const g = document.createElementNS(NS, 'g');
            g.dataset.c = ci;
            g.innerHTML = html;
            return g;
          });
          insertSorted(L.b, gs[0], ci); insertSorted(L.t, gs[1], ci); insertSorted(L.o, gs[2], ci);
          L.chunks.set(ci, gs);
        }
        for (const [ci, gs] of L.chunks) if (ci < c0 - 1 || ci > c1 + 1) { gs.forEach((g) => g.remove()); L.chunks.delete(ci); }
        L.svg.style.transform = `translate3d(${(-ox).toFixed(2)}px,0,0)`;
      });
    }

    function resize() {
      k = el.clientHeight / HEIGHT;
      viewW = el.clientWidth / k;
      el.querySelectorAll('.world').forEach((w) => { w.style.transform = `scale(${k})`; });
      if (current) place(current);
    }

    // where the walk is: which stop the middle of the view is on, and which region
    let lastStop = -1, lastRegion = '', tick = 0;
    function report() {
      const mid = scroll + viewW * 0.5;
      const s = ((Math.floor(mid / SPAN) % n) + n) % n;
      if (s !== lastStop) { lastStop = s; setStop(s); }
      const r = current.scene.world.biomeAt(mid).main;
      if (r !== lastRegion) { lastRegion = r; setRegion(r); }
    }

    let last = performance.now();
    function frame(t) {
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      if (target !== null) {
        const d = target - scroll;
        scroll += d * Math.min(1, dt * 2.6);
        if (Math.abs(d) < 2) target = null;
      } else if (!drag) {
        if (!reduce && !hold) scroll += SPEED * dt;
        scroll += vel * dt;
        vel *= Math.exp(-3 * dt);
        if (Math.abs(vel) < 1) vel = 0;
      }
      place(current);
      if ((tick += dt) > 0.2) { tick = 0; report(); }
      raf = requestAnimationFrame(frame);
    }

    // input: wheel, drag, arrows all walk; nothing is required
    let drag = null;
    const down = (e) => {
      if (e.target.closest('a, button, .card')) return;
      drag = { id: e.pointerId, x: e.clientX, t: performance.now() };
      el.setPointerCapture(e.pointerId); vel = 0; target = null;
    };
    const move = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const tt = performance.now(), dts = Math.max(1, tt - drag.t) / 1000, dx = (e.clientX - drag.x) / k;
      scroll -= dx; vel = 0.6 * vel + 0.4 * (-dx / dts); drag.x = e.clientX; drag.t = tt;
    };
    const up = (e) => { if (drag && e.pointerId === drag.id) { if (performance.now() - drag.t > 120) vel = 0; drag = null; } };
    const wheel = (e) => {
      if (e.target.closest('.card')) return; // let long cards scroll
      e.preventDefault(); target = null;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
      scroll += (((e.deltaX || 0) + (e.deltaY || 0)) * unit * 1.1) / k;
    };
    const key = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); goTo(lastStop + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); goTo(lastStop - 1); }
    };
    // walk (quickly) to stop i; i may be one past either end, so ← and → wrap the loop without walking a whole lap
    function goTo(i) {
      const here = Math.floor((scroll + viewW * 0.5) / SPAN);
      const delta = i - (((here % n) + n) % n);
      target = (here + delta) * SPAN + SPAN * 0.3 - viewW * 0.5;
      vel = 0;
    }
    const setHold = (v) => { hold = v; };
    api.current = { goTo, setHold };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    addEventListener('keydown', key);
    addEventListener('resize', resize);

    // light the world as Bangalore is lit, and keep it in step
    let info = null, alive = true;
    // ?at=21:30 previews another hour (Bangalore time) instead of now
    const preview = /^(\d{1,2}):(\d{2})$/.exec(new URLSearchParams(location.search).get('at') || '');
    const instant = () => {
      if (!preview) return new Date();
      const d = new Date(Date.now() + 5.5 * 3600_000);
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), +preview[1], +preview[2]) - 5.5 * 3600_000);
    };
    const relight = async (refetch) => {
      const at = instant();
      if (refetch || !info) info = await fetchSky(at);
      if (!alive) return;
      const mood = skyMood(at, info);
      setSky({ ...info, mood: mood.name, rain: mood.rain > 0.5 });
      mount(mood);
    };
    resize();
    relight(true).then(() => { if (alive) { resize(); report(); raf = requestAnimationFrame(frame); } });
    const relightId = setInterval(() => relight(true), REFRESH);
    setNow(instant());
    const clockId = setInterval(() => setNow(instant()), 20_000);

    return () => {
      alive = false;
      cancelAnimationFrame(raf); clearInterval(relightId); clearInterval(clockId);
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
      removeEventListener('keydown', key); removeEventListener('resize', resize);
      el.querySelectorAll('.world').forEach((w) => w.remove());
    };
  }, [n]);

  const goTo = useCallback((i) => api.current?.goTo(i), []);
  const b = BIOMES[region];

  return (
    <div className="journey">
      <div className="stage" ref={stage} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <p className="live" aria-live="off">
        <span className="live__dot" aria-hidden="true" />
        Bengaluru{now && <> · {istTime(now)}</>}
        {sky && <> · {sky.mood.english} <span lang="hi">{sky.mood.native}</span>{sky.temp !== null && <> · {sky.temp}°</>}{sky.weather && <> {sky.weather}</>}</>}
      </p>

      <ol className="cards">
        {stops.map((s, i) => (
          <li key={i} className={`card ${i === stop ? 'card--on' : ''}`} aria-hidden={i !== stop || undefined}
            onPointerEnter={() => api.current?.setHold(true)} onPointerLeave={() => api.current?.setHold(false)}>
            <p className="card__n">Stop {String(i + 1).padStart(2, '0')} of {n}</p>
            {s}
          </li>
        ))}
      </ol>

      <p className="region" aria-hidden="true">{b.label} · <span lang="hi">{b.native}</span></p>

      <nav className="route" aria-label="Stops">
        <button type="button" className="route__step" onClick={() => goTo(stop - 1)} aria-label="Previous stop">←</button>
        <ol>
          {titles.map((t, i) => (
            <li key={t}><button type="button" aria-current={i === stop || undefined} onClick={() => goTo(i)}><span className="route__dot" aria-hidden="true" /><span className="route__label">{t}</span></button></li>
          ))}
        </ol>
        <button type="button" className="route__step" onClick={() => goTo(stop + 1)} aria-label="Next stop">→</button>
      </nav>
    </div>
  );
}

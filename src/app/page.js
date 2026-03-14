"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useScroll, useSpring, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import {
  meta,
  experiences,
  projects,
  papers,
  skillCategories,
  achievements,
  education,
} from "@/lib/data";


// -- Theme colors (dark default, light toggle) --
const dark = {
  bg: "#080b14",
  card: "#0d1120",
  accent: "#e8a849",
  text: "#f5f0eb",
  muted: "#7a7a8a",
  purple: "#2a1f4e",
  blue: "#0f1a3a",
  researchBg: "#0a0e1c",
  starColor: "#ffffff",
  constellationColor: "rgba(138, 120, 200, 0.12)",
  navBg: "rgba(8,11,20,0.85)",
  navBorder: "rgba(232,168,73,0.15)",
  divider: "rgba(255,255,255,0.05)",
  tagBg: "rgba(232,168,73,0.08)",
  statusBorder: "rgba(232,168,73,0.15)",
};

const light = {
  bg: "#f5f3ee",
  card: "#ffffff",
  accent: "#c07a3c",
  text: "#1a1a2e",
  muted: "#5a5a6a",
  purple: "#e8e4f0",
  blue: "#dce4f0",
  researchBg: "#edf0f5",
  starColor: "#1a1a2e",
  constellationColor: "rgba(100, 80, 160, 0.08)",
  navBg: "rgba(245,243,238,0.9)",
  navBorder: "rgba(192,122,60,0.2)",
  divider: "rgba(0,0,0,0.08)",
  tagBg: "rgba(192,122,60,0.08)",
  statusBorder: "rgba(192,122,60,0.2)",
};


// -- Theme hook --
function useTheme() {
  const [isDark, setIsDark] = useState(true);
  const [bang, setBang] = useState(null); // { origin, toLight }
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setIsDark(false);
  }, []);
  const toggle = useCallback((e) => {
    // get click origin for big bang effect
    let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (e && e.clientX !== undefined) {
      origin = { x: e.clientX, y: e.clientY };
    }
    const willBeLight = isDark;
    setBang({ origin, toLight: willBeLight });
    // delay the actual theme switch slightly so the bang starts on old bg
    setTimeout(() => {
      setIsDark((prev) => {
        const next = !prev;
        localStorage.setItem("theme", next ? "dark" : "light");
        return next;
      });
    }, 80);
  }, [isDark]);
  const clearBang = useCallback(() => setBang(null), []);
  return { isDark, toggle, C: isDark ? dark : light, bang, clearBang };
}


// -- Count up hook --
function useCountUp(target, inView, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else {
        setVal(start);
      }
    }, 16);
    return () => clearInterval(id);
  }, [inView, target, duration]);
  return val;
}


// -- IST clock hook --
function useISTClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const h = String(ist.getHours()).padStart(2, "0");
      const m = String(ist.getMinutes()).padStart(2, "0");
      const s = String(ist.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} IST`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}


// -- Animation variants (Apple-style springs) --
const springConfig = { type: "spring", stiffness: 80, damping: 20 };

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: springConfig },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: springConfig },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: springConfig },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.88, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 18 } },
};

const clipReveal = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};


// -- Descent canvas: scroll-driven space-to-earth journey --
function DescentCanvas({ scrollProgress }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100, active: false });
  const progressRef = useRef(0);

  useMotionValueEvent(scrollProgress, "change", (v) => {
    progressRef.current = v;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // -- Background stays space-dark, atmospheric effects overlay from bottom --
    const bgStops = [
      { p: 0,   c: [8, 11, 20] },
      { p: 0.4, c: [8, 11, 20] },
      { p: 0.6, c: [9, 11, 20] },
      { p: 0.8, c: [10, 11, 18] },
      { p: 1.0, c: [8, 9, 16] },
    ];
    const getBgColor = (p) => {
      for (let i = 0; i < bgStops.length - 1; i++) {
        if (p <= bgStops[i + 1].p) {
          const t = (p - bgStops[i].p) / (bgStops[i + 1].p - bgStops[i].p);
          return bgStops[i].c.map((v, j) => Math.round(v + (bgStops[i + 1].c[j] - v) * t));
        }
      }
      return bgStops[bgStops.length - 1].c;
    };

    // -- Mouse tracking --
    const dustParticles = [];
    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      const p = progressRef.current;
      for (let i = 0; i < 2; i++) {
        const hue = p < 0.35
          ? (Math.random() > 0.5 ? "232,168,73" : "200,180,255")
          : p < 0.65
          ? (Math.random() > 0.5 ? "180,210,255" : "220,230,245")
          : (Math.random() > 0.5 ? "255,160,60" : "255,200,120");
        dustParticles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 0,
          maxLife: 30 + Math.random() * 30,
          size: Math.random() * 2 + 0.5,
          hue,
        });
      }
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // -- Stars --
    const stars = [];
    for (let i = 0; i < 320; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.15,
      });
    }

    // -- Constellation lines --
    const lines = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && Math.random() < 0.15) lines.push([i, j, dist]);
      }
    }

    // -- Comets --
    const comets = [];
    const spawnComet = () => {
      comets.push({
        x: Math.random() * canvas.width * 1.2, y: -20,
        speed: 3 + Math.random() * 4,
        angle: Math.PI * 0.2 + Math.random() * 0.3,
        length: 40 + Math.random() * 80,
        alpha: 0.6 + Math.random() * 0.4,
        life: 0, maxLife: 60 + Math.random() * 80,
      });
    };

    // -- Satellite --
    const satellite = {
      x: -50,
      y: canvas.height * 0.15 + Math.random() * canvas.height * 0.2,
      speed: 0.4 + Math.random() * 0.3,
      blinkRate: 0.05,
      trail: [],
    };
    const resetSatellite = () => {
      satellite.x = -50;
      satellite.y = canvas.height * 0.1 + Math.random() * canvas.height * 0.3;
      satellite.speed = 0.3 + Math.random() * 0.3;
      satellite.trail = [];
    };

    // -- Planets --
    const saturn = { x: canvas.width * 0.82, y: canvas.height * 0.1, radius: 28, ringOuter: 56, color: [200, 180, 140], ringColor: [220, 200, 160] };
    const nebula = { x: canvas.width * 0.08, y: canvas.height * 0.3, radius: 120 };
    const mars = { x: canvas.width * 0.55, y: canvas.height * 0.75, radius: 14, color: [200, 110, 70] };
    const bluePlanet = { x: canvas.width * 0.18, y: canvas.height * 0.6, radius: 8, color: [90, 130, 210] };

    // offscreen canvas for 3D planet rendering
    const offscreen = document.createElement("canvas");
    const oCtx = offscreen.getContext("2d");

    const renderPlanet = (r, color, hasRings, ringColor, ringOuter) => {
      const pad = hasRings ? ringOuter + 10 : r * 3;
      const size = pad * 2;
      offscreen.width = size;
      offscreen.height = size;
      oCtx.clearRect(0, 0, size, size);
      const cx = pad, cy = pad;

      if (hasRings) {
        const rW = ringOuter, rH = rW * 0.25;
        for (let i = 0; i < 6; i++) {
          oCtx.beginPath();
          oCtx.ellipse(cx, cy, rW - i * 4, Math.max(3, rH - i), -0.12, Math.PI, Math.PI * 2);
          oCtx.strokeStyle = `rgba(${ringColor.join(",")},${0.6 - i * 0.08})`;
          oCtx.lineWidth = 3;
          oCtx.stroke();
        }
      }

      const baseG = oCtx.createLinearGradient(cx - r, cy, cx + r, cy);
      baseG.addColorStop(0, `rgba(${color.map(c => Math.min(255, c + 60)).join(",")},1)`);
      baseG.addColorStop(0.35, `rgba(${color.map(c => Math.min(255, c + 30)).join(",")},1)`);
      baseG.addColorStop(0.6, `rgba(${color.join(",")},1)`);
      baseG.addColorStop(1, `rgba(${color.map(c => Math.max(0, c - 80)).join(",")},1)`);
      oCtx.fillStyle = baseG;
      oCtx.beginPath();
      oCtx.arc(cx, cy, r, 0, Math.PI * 2);
      oCtx.fill();

      oCtx.save();
      oCtx.beginPath();
      oCtx.arc(cx, cy, r, 0, Math.PI * 2);
      oCtx.clip();
      for (let b = -r; b < r; b += 4) {
        const bW = Math.sqrt(r * r - b * b);
        oCtx.fillStyle = b % 8 < 4
          ? `rgba(${color.map(c => Math.min(255, c + 20)).join(",")},0.2)`
          : `rgba(${color.map(c => Math.max(0, c - 20)).join(",")},0.15)`;
        oCtx.fillRect(cx - bW, cy + b, bW * 2, 2.5);
      }
      oCtx.restore();

      const specG = oCtx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx, cy, r);
      specG.addColorStop(0, "rgba(255,255,240,0.45)");
      specG.addColorStop(0.35, "rgba(255,255,240,0.1)");
      specG.addColorStop(1, "transparent");
      oCtx.fillStyle = specG;
      oCtx.beginPath();
      oCtx.arc(cx, cy, r, 0, Math.PI * 2);
      oCtx.fill();

      const termG = oCtx.createLinearGradient(cx + r * 0.1, cy, cx + r, cy);
      termG.addColorStop(0, "transparent");
      termG.addColorStop(0.6, "rgba(0,0,0,0.25)");
      termG.addColorStop(1, "rgba(0,0,0,0.55)");
      oCtx.fillStyle = termG;
      oCtx.beginPath();
      oCtx.arc(cx, cy, r, 0, Math.PI * 2);
      oCtx.fill();

      const limbG = oCtx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r);
      limbG.addColorStop(0, "transparent");
      limbG.addColorStop(1, "rgba(0,0,0,0.3)");
      oCtx.fillStyle = limbG;
      oCtx.beginPath();
      oCtx.arc(cx, cy, r, 0, Math.PI * 2);
      oCtx.fill();

      if (hasRings) {
        const rW = ringOuter, rH = rW * 0.25;
        for (let i = 0; i < 6; i++) {
          oCtx.beginPath();
          oCtx.ellipse(cx, cy, rW - i * 4, Math.max(3, rH - i), -0.12, 0, Math.PI);
          oCtx.strokeStyle = `rgba(${ringColor.join(",")},${0.7 - i * 0.1})`;
          oCtx.lineWidth = 3;
          oCtx.stroke();
        }
      }
      return { canvas: offscreen, pad };
    };

    // pre-render planets
    const saturnImg = renderPlanet(saturn.radius, saturn.color, true, saturn.ringColor, saturn.ringOuter);
    const saturnData = document.createElement("canvas");
    saturnData.width = saturnImg.canvas.width;
    saturnData.height = saturnImg.canvas.height;
    saturnData.getContext("2d").drawImage(saturnImg.canvas, 0, 0);

    const marsImg = renderPlanet(mars.radius, mars.color, false);
    const marsData = document.createElement("canvas");
    marsData.width = marsImg.canvas.width;
    marsData.height = marsImg.canvas.height;
    marsData.getContext("2d").drawImage(marsImg.canvas, 0, 0);

    const blueImg = renderPlanet(bluePlanet.radius, bluePlanet.color, false);
    const blueData = document.createElement("canvas");
    blueData.width = blueImg.canvas.width;
    blueData.height = blueImg.canvas.height;
    blueData.getContext("2d").drawImage(blueImg.canvas, 0, 0);

    // -- Ocean waves (for sunset zone) --
    const waves = [];
    for (let i = 0; i < 30; i++) {
      waves.push({
        y: (i / 30),
        amplitude: 0.5 + Math.random() * 2.5,
        frequency: 0.002 + Math.random() * 0.006,
        speed: 0.003 + Math.random() * 0.008,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.02 + Math.random() * 0.05,
      });
    }

    // -- Mountain range silhouettes (layered ridgelines at horizon) --
    const mountainRanges = [];
    for (let layer = 0; layer < 4; layer++) {
      const points = [];
      const numPeaks = 8 + Math.floor(Math.random() * 6);
      // generate ridgeline as summed sine harmonics for organic shape
      const harmonics = [];
      for (let h = 0; h < 5 + layer; h++) {
        harmonics.push({
          freq: 0.001 + Math.random() * 0.004 * (1 + h * 0.5),
          amp: (18 - layer * 3) + Math.random() * (12 - layer * 2),
          phase: Math.random() * Math.PI * 2,
        });
      }
      mountainRanges.push({
        harmonics,
        baseY: layer * 10,
        color: [
          [8, 6, 14],      // furthest: barely visible, purple-black
          [12, 10, 18],     // mid-far: dark purple
          [6, 8, 15],       // mid-near: dark blue
          [4, 5, 10],       // nearest: near-black
        ][layer],
        opacity: [0.5, 0.6, 0.7, 0.85][layer],
      });
    }

    let t = 0;
    let cometTimer = 0;

    const draw = () => {
      t += 1;
      cometTimer += 1;
      const p = progressRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // -- Smooth zone calculations (long overlaps, no hard cuts) --
      const starAlpha = p < 0.2 ? 1 : p < 0.55 ? 1 - (p - 0.2) / 0.35 : 0;
      const planetAlpha = p < 0.15 ? 0.75 : p < 0.45 ? 0.75 * (1 - (p - 0.15) / 0.3) : 0;
      // horizon rises from below viewport: starts at 120% H, ends at 35% H
      const descentP = Math.max(0, Math.min(1, (p - 0.3) / 0.7));
      const horizonY = H * (1.2 - descentP * 0.85);
      const atmoAlpha = Math.max(0, Math.min(1, (p - 0.2) / 0.3));

      // -- Background fill (opaque, drives the descent color) --
      const bg = getBgColor(p);
      ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
      ctx.fillRect(0, 0, W, H);

      // -- Space elements --
      if (starAlpha > 0.01) {
        // Nebula glow
        ctx.globalAlpha = starAlpha;
        const nebGrad = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
        nebGrad.addColorStop(0, "rgba(90,40,140,0.08)");
        nebGrad.addColorStop(0.6, "rgba(40,80,160,0.05)");
        nebGrad.addColorStop(1, "transparent");
        ctx.fillStyle = nebGrad;
        ctx.beginPath();
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
        ctx.fill();

        const neb2Grad = ctx.createRadialGradient(nebula.x + 50, nebula.y - 25, 0, nebula.x + 50, nebula.y - 25, nebula.radius * 0.6);
        neb2Grad.addColorStop(0, "rgba(60,100,180,0.06)");
        neb2Grad.addColorStop(1, "transparent");
        ctx.fillStyle = neb2Grad;
        ctx.beginPath();
        ctx.arc(nebula.x + 50, nebula.y - 25, nebula.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Constellation lines
        lines.forEach(([a, b, dist]) => {
          const sa = stars[a], sb = stars[b];
          const alpha = (1 - dist / 150) * 0.08 * starAlpha;
          ctx.strokeStyle = `rgba(138,120,200,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sa.x + Math.sin(t * 0.003 + sa.twinkleOffset) * sa.drift * 10, sa.y);
          ctx.lineTo(sb.x + Math.sin(t * 0.003 + sb.twinkleOffset) * sb.drift * 10, sb.y);
          ctx.stroke();
        });

        // Stars
        ctx.globalAlpha = 1;
        stars.forEach((s) => {
          const twinkle = Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
          const alpha = (s.baseAlpha + twinkle * 0.25) * starAlpha;
          const xOff = Math.sin(t * 0.003 + s.twinkleOffset) * s.drift * 10;
          ctx.beginPath();
          ctx.arc(s.x + xOff, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${Math.max(0.01, alpha)})`;
          ctx.fill();
        });
      }

      // -- Planets --
      if (planetAlpha > 0.01) {
        const sFloat = Math.sin(t * 0.008) * 4;
        ctx.save();
        ctx.globalAlpha = planetAlpha;
        const sGlow = ctx.createRadialGradient(saturn.x, saturn.y + sFloat, saturn.radius * 0.5, saturn.x, saturn.y + sFloat, saturn.radius * 4);
        sGlow.addColorStop(0, "rgba(200,180,140,0.15)");
        sGlow.addColorStop(1, "transparent");
        ctx.globalAlpha = planetAlpha * 0.5;
        ctx.fillStyle = sGlow;
        ctx.beginPath();
        ctx.arc(saturn.x, saturn.y + sFloat, saturn.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = planetAlpha;
        ctx.drawImage(saturnData, saturn.x - saturnImg.pad, saturn.y + sFloat - saturnImg.pad);
        ctx.restore();

        const mFloat = Math.sin(t * 0.006 + 2) * 3;
        ctx.save();
        ctx.globalAlpha = planetAlpha;
        const mGlow = ctx.createRadialGradient(mars.x, mars.y + mFloat, mars.radius * 0.5, mars.x, mars.y + mFloat, mars.radius * 3);
        mGlow.addColorStop(0, "rgba(200,110,70,0.12)");
        mGlow.addColorStop(1, "transparent");
        ctx.globalAlpha = planetAlpha * 0.4;
        ctx.fillStyle = mGlow;
        ctx.beginPath();
        ctx.arc(mars.x, mars.y + mFloat, mars.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = planetAlpha;
        ctx.drawImage(marsData, mars.x - marsImg.pad, mars.y + mFloat - marsImg.pad);
        ctx.restore();

        const bFloat = Math.sin(t * 0.005 + 4) * 2;
        ctx.save();
        ctx.globalAlpha = planetAlpha * 0.8;
        ctx.drawImage(blueData, bluePlanet.x - blueImg.pad, bluePlanet.y + bFloat - blueImg.pad);
        ctx.restore();
      }

      // -- Satellite (space zone only) --
      if (starAlpha > 0.3) {
        satellite.x += satellite.speed;
        satellite.y += Math.sin(t * 0.01) * 0.2;
        if (satellite.x > W + 60) resetSatellite();

        if (t % 3 === 0) {
          satellite.trail.push({ x: satellite.x, y: satellite.y, life: 0 });
          if (satellite.trail.length > 30) satellite.trail.shift();
        }

        satellite.trail.forEach((pt) => {
          pt.life += 1;
          const ta = Math.max(0, 1 - pt.life / 40) * 0.5 * starAlpha;
          const sparkle = Math.sin(t * 0.1 + pt.x) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1 * sparkle, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,200,255,${ta * sparkle})`;
          ctx.fill();
        });

        const blink = Math.sin(t * satellite.blinkRate) > 0.3;
        ctx.globalAlpha = 0.9 * starAlpha;
        ctx.fillStyle = "rgba(220,220,240,1)";
        ctx.fillRect(satellite.x - 2, satellite.y - 2, 4, 4);
        if (blink) {
          ctx.fillStyle = "rgba(120,170,255,0.8)";
          ctx.fillRect(satellite.x - 10, satellite.y - 1, 7, 2);
          ctx.fillRect(satellite.x + 4, satellite.y - 1, 7, 2);
        } else {
          ctx.fillStyle = "rgba(150,160,180,0.5)";
          ctx.fillRect(satellite.x - 8, satellite.y - 0.5, 6, 1.5);
          ctx.fillRect(satellite.x + 3, satellite.y - 0.5, 6, 1.5);
        }
        ctx.globalAlpha = 1;
      }

      // -- Comets (space zone only) --
      if (p < 0.3 && cometTimer > 180 + Math.random() * 300) {
        spawnComet();
        cometTimer = 0;
      }

      for (let ci = comets.length - 1; ci >= 0; ci--) {
        const c = comets[ci];
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        c.life += 1;

        let cAlpha = c.alpha * Math.max(starAlpha, 0.05);
        if (c.life < 10) cAlpha *= c.life / 10;
        if (c.life > c.maxLife - 15) cAlpha *= (c.maxLife - c.life) / 15;
        cAlpha = Math.max(0, cAlpha);

        ctx.beginPath();
        ctx.arc(c.x, c.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${cAlpha})`;
        ctx.fill();

        const tailX = c.x - Math.cos(c.angle) * c.length;
        const tailY = c.y - Math.sin(c.angle) * c.length;
        const tailGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(255,255,255,${cAlpha * 0.6})`);
        tailGrad.addColorStop(0.3, `rgba(200,180,255,${cAlpha * 0.3})`);
        tailGrad.addColorStop(1, "rgba(200,180,255,0)");
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        if (c.life >= c.maxLife || c.y > H + 50) comets.splice(ci, 1);
      }

      // -- Earth's atmosphere + horizon + ocean (rises from bottom as you scroll) --
      if (horizonY < H) {
        const sunX = W * 0.5;
        const oceanH = H - horizonY;
        const a = atmoAlpha;

        // === SKY: multi-band gradient above horizon (deep violet -> magenta -> orange -> yellow) ===
        const skyHeight = Math.min(H * 0.55, oceanH * 1.2);
        if (skyHeight > 5) {
          const skyGrad = ctx.createLinearGradient(0, horizonY - skyHeight, 0, horizonY);
          skyGrad.addColorStop(0, "transparent");
          skyGrad.addColorStop(0.15, `rgba(25,10,50,${0.06 * a})`);
          skyGrad.addColorStop(0.3, `rgba(60,15,60,${0.10 * a})`);
          skyGrad.addColorStop(0.45, `rgba(120,30,50,${0.14 * a})`);
          skyGrad.addColorStop(0.6, `rgba(180,60,35,${0.18 * a})`);
          skyGrad.addColorStop(0.75, `rgba(220,100,30,${0.22 * a})`);
          skyGrad.addColorStop(0.88, `rgba(245,150,40,${0.25 * a})`);
          skyGrad.addColorStop(1, `rgba(255,190,70,${0.28 * a})`);
          ctx.fillStyle = skyGrad;
          ctx.fillRect(0, horizonY - skyHeight, W, skyHeight);
        }

        // === SUN: layered corona (hot white core -> yellow -> orange -> red halo) ===
        // outer red/magenta halo
        const haloR = H * 0.4;
        const halo = ctx.createRadialGradient(sunX, horizonY, 0, sunX, horizonY, haloR);
        halo.addColorStop(0, `rgba(255,120,60,${0.12 * a})`);
        halo.addColorStop(0.15, `rgba(200,50,40,${0.08 * a})`);
        halo.addColorStop(0.4, `rgba(120,20,50,${0.04 * a})`);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(sunX, horizonY, haloR, 0, Math.PI * 2);
        ctx.fill();

        // mid orange glow
        const midR = H * 0.2;
        const midGlow = ctx.createRadialGradient(sunX, horizonY, 0, sunX, horizonY, midR);
        midGlow.addColorStop(0, `rgba(255,200,100,${0.25 * a})`);
        midGlow.addColorStop(0.2, `rgba(255,160,60,${0.18 * a})`);
        midGlow.addColorStop(0.5, `rgba(255,100,40,${0.08 * a})`);
        midGlow.addColorStop(1, "transparent");
        ctx.fillStyle = midGlow;
        ctx.beginPath();
        ctx.arc(sunX, horizonY, midR, 0, Math.PI * 2);
        ctx.fill();

        // hot core (white-yellow, small, intense)
        const coreR = H * 0.06;
        const core = ctx.createRadialGradient(sunX, horizonY, 0, sunX, horizonY, coreR);
        core.addColorStop(0, `rgba(255,255,240,${0.35 * a})`);
        core.addColorStop(0.3, `rgba(255,240,200,${0.25 * a})`);
        core.addColorStop(0.7, `rgba(255,200,120,${0.1 * a})`);
        core.addColorStop(1, "transparent");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(sunX, horizonY, coreR, 0, Math.PI * 2);
        ctx.fill();

        // === CREPUSCULAR RAYS (god rays) fanning from sun ===
        if (a > 0.1) {
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const numRays = 14;
          for (let i = 0; i < numRays; i++) {
            const angle = -Math.PI * 0.6 + (i / (numRays - 1)) * Math.PI * 0.2 - Math.PI * 0.1;
            const rayLen = H * (0.2 + Math.sin(t * 0.004 + i * 1.7) * 0.05);
            const rayW = 0.015 + Math.sin(t * 0.006 + i * 2.3) * 0.005;
            const rayAlpha = (0.02 + Math.sin(t * 0.005 + i * 3.1) * 0.008) * a;
            const ex = sunX + Math.cos(angle) * rayLen;
            const ey = horizonY + Math.sin(angle) * rayLen;
            const grad = ctx.createLinearGradient(sunX, horizonY, ex, ey);
            grad.addColorStop(0, `rgba(255,200,120,${rayAlpha})`);
            grad.addColorStop(0.4, `rgba(255,160,80,${rayAlpha * 0.5})`);
            grad.addColorStop(1, "transparent");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(sunX, horizonY);
            const perpX = -Math.sin(angle) * rayLen * rayW;
            const perpY = Math.cos(angle) * rayLen * rayW;
            ctx.lineTo(ex + perpX, ey + perpY);
            ctx.lineTo(ex - perpX, ey - perpY);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }

        // === HORIZON LINE (bright, warm, thin with bloom) ===
        // bloom
        const bloomGrad = ctx.createLinearGradient(0, horizonY - 4, 0, horizonY + 4);
        bloomGrad.addColorStop(0, "transparent");
        bloomGrad.addColorStop(0.4, `rgba(255,200,120,${0.08 * a})`);
        bloomGrad.addColorStop(0.5, `rgba(255,220,150,${0.15 * a})`);
        bloomGrad.addColorStop(0.6, `rgba(255,200,120,${0.08 * a})`);
        bloomGrad.addColorStop(1, "transparent");
        ctx.fillStyle = bloomGrad;
        ctx.fillRect(0, horizonY - 4, W, 8);
        // sharp line
        ctx.fillStyle = `rgba(255,210,140,${0.2 * a})`;
        ctx.fillRect(0, horizonY - 0.5, W, 1);

        // === MOUNTAIN SILHOUETTES (layered ridgelines against sunset) ===
        if (a > 0.05) {
          for (let li = 0; li < mountainRanges.length; li++) {
            const range = mountainRanges[li];
            const mBaseY = horizonY + range.baseY;
            const c = range.color;
            ctx.beginPath();
            ctx.moveTo(-5, mBaseY + 50);
            for (let x = -5; x <= W + 5; x += 2) {
              let y = mBaseY;
              for (const h of range.harmonics) {
                y -= Math.max(0, Math.sin(x * h.freq + h.phase)) * h.amp;
              }
              ctx.lineTo(x, y);
            }
            ctx.lineTo(W + 5, mBaseY + 50);
            ctx.closePath();
            ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${range.opacity * a})`;
            ctx.fill();
            // rim light on the furthest ranges (backlit by sun)
            if (li < 2) {
              ctx.beginPath();
              for (let x = -5; x <= W + 5; x += 2) {
                let y = mBaseY;
                for (const h of range.harmonics) {
                  y -= Math.max(0, Math.sin(x * h.freq + h.phase)) * h.amp;
                }
                if (x === -5) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.strokeStyle = `rgba(200,120,50,${0.04 * a * (2 - li)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        // === OCEAN ===
        if (horizonY < H - 2) {
          // deep ocean gradient (dark blue-black, slightly warm near horizon)
          const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, H);
          oceanGrad.addColorStop(0, `rgba(12,18,35,${0.7 * a})`);
          oceanGrad.addColorStop(0.05, `rgba(8,14,30,${0.75 * a})`);
          oceanGrad.addColorStop(0.3, `rgba(5,10,22,${0.8 * a})`);
          oceanGrad.addColorStop(1, `rgba(3,6,15,${0.85 * a})`);
          ctx.fillStyle = oceanGrad;
          ctx.fillRect(0, horizonY, W, oceanH);

          // warm reflection band right at horizon
          const reflBandGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + oceanH * 0.08);
          reflBandGrad.addColorStop(0, `rgba(180,100,40,${0.08 * a})`);
          reflBandGrad.addColorStop(1, "transparent");
          ctx.fillStyle = reflBandGrad;
          ctx.fillRect(0, horizonY, W, oceanH * 0.08);

          // === SUN REFLECTION PATH (tapered, shimmering, broken by waves) ===
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const reflLen = oceanH * 0.7;
          for (let ry = 0; ry < reflLen; ry += 2) {
            const distRatio = ry / reflLen;
            // width tapers wider further from horizon (perspective)
            const baseW = 8 + distRatio * 40;
            // shimmer breaks up the reflection
            const shimmer = Math.sin(ry * 0.08 + t * 0.03) * 0.5 + 0.5;
            const jitter = Math.sin(ry * 0.15 + t * 0.02) * (2 + distRatio * 8);
            const rAlpha = (0.12 - distRatio * 0.1) * a * (0.5 + shimmer * 0.5);
            if (rAlpha < 0.002) continue;
            // each "glint" is a short horizontal stroke
            const gx = sunX + jitter;
            const gy = horizonY + ry;
            const halfW = baseW * (0.3 + shimmer * 0.7);
            ctx.fillStyle = `rgba(255,200,120,${rAlpha})`;
            ctx.fillRect(gx - halfW, gy, halfW * 2, 1.5);
          }
          ctx.restore();

          // === WAVE LINES (subtle, realistic spacing) ===
          waves.forEach((wave) => {
            const wy = horizonY + wave.y * oceanH;
            if (wy <= horizonY || wy > H) return;
            const distRatio = (wy - horizonY) / oceanH;
            ctx.beginPath();
            for (let x = 0; x <= W; x += 6) {
              const y = wy + Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * wave.amplitude * (0.3 + distRatio * 0.7);
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            // waves near horizon are warmer (reflecting sky), far waves are cool
            const warmth = 1 - distRatio;
            const r = Math.round(60 + warmth * 120);
            const g = Math.round(80 + warmth * 60);
            const b = Math.round(120 + warmth * 20);
            ctx.strokeStyle = `rgba(${r},${g},${b},${wave.alpha * a * (1 - distRatio * 0.5)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        }
      }

      // -- Mouse cursor particles --
      ctx.globalAlpha = 1;
      for (let di = dustParticles.length - 1; di >= 0; di--) {
        const d = dustParticles[di];
        d.x += d.vx;
        d.y += d.vy;
        d.vy -= 0.01;
        d.life += 1;

        const dAlpha = Math.max(0, 1 - d.life / d.maxLife);
        const sparkle = Math.sin(t * 0.15 + d.x * 0.1) * 0.3 + 0.7;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * dAlpha * sparkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.hue},${dAlpha * 0.7 * sparkle})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 3 * dAlpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.hue},${dAlpha * 0.1})`;
        ctx.fill();

        if (d.life >= d.maxLife) dustParticles.splice(di, 1);
      }
      while (dustParticles.length > 80) dustParticles.shift();

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    const resizeHandler = () => {
      resize();
      stars.forEach((s) => {
        if (s.x > canvas.width) s.x = Math.random() * canvas.width;
        if (s.y > canvas.height) s.y = Math.random() * canvas.height;
      });
      saturn.x = canvas.width * 0.82;
      saturn.y = canvas.height * 0.1;
      nebula.x = canvas.width * 0.08;
      nebula.y = canvas.height * 0.3;
      mars.x = canvas.width * 0.55;
      mars.y = canvas.height * 0.75;
      bluePlanet.x = canvas.width * 0.18;
      bluePlanet.y = canvas.height * 0.6;
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}


// -- Leaves canvas for light mode --
function LeavesCanvas() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const leafColors = [
      [120, 160, 80],   // green
      [100, 140, 60],   // darker green
      [180, 140, 60],   // autumn gold
      [160, 100, 50],   // brown
      [140, 170, 90],   // light green
      [200, 160, 70],   // yellow-gold
    ];

    const leaves = [];
    for (let i = 0; i < 18; i++) {
      leaves.push({
        x: Math.random() * canvas.width * 1.2 - canvas.width * 0.1,
        y: Math.random() * canvas.height * 1.2 - canvas.height * 0.1,
        size: 6 + Math.random() * 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        vx: 0.3 + Math.random() * 0.8,
        vy: 0.2 + Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleAmp: 15 + Math.random() * 25,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        alpha: 0.25 + Math.random() * 0.3,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leaves.forEach((leaf) => {
        // wind movement
        leaf.wobble += leaf.wobbleSpeed;
        const windX = Math.sin(leaf.wobble) * leaf.wobbleAmp * 0.02;
        leaf.x += leaf.vx + windX;
        leaf.y += leaf.vy + Math.cos(leaf.wobble * 0.7) * 0.15;
        leaf.rotation += leaf.rotSpeed;
        leaf.flip += leaf.flipSpeed;

        // wrap around
        if (leaf.x > canvas.width + 30) {
          leaf.x = -30;
          leaf.y = Math.random() * canvas.height;
        }
        if (leaf.y > canvas.height + 30) {
          leaf.y = -30;
          leaf.x = Math.random() * canvas.width;
        }

        // 3D-ish flip effect
        const scaleX = Math.cos(leaf.flip);
        const s = leaf.size;
        const [r, g, b] = leaf.color;

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = leaf.alpha;

        // leaf body (elongated ellipse)
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.4, s, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();

        // center vein
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s);
        ctx.strokeStyle = `rgba(${Math.max(0, r - 30)},${Math.max(0, g - 30)},${Math.max(0, b - 20)},${leaf.alpha * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // stem
        ctx.beginPath();
        ctx.moveTo(0, s);
        ctx.lineTo(s * 0.15, s + s * 0.4);
        ctx.strokeStyle = `rgba(${Math.max(0, r - 40)},${Math.max(0, g - 40)},${Math.max(0, b - 30)},${leaf.alpha * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      });

      frameRef.current = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}


// -- Big bang theme transition overlay --
function ThemeBang({ origin, toLight, onDone }) {
  const [phase, setPhase] = useState("expand");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("done");
      onDone();
    }, 600);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (phase === "done") return null;

  const targetColor = toLight ? "#f5f3ee" : "#080b14";
  const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: origin.x,
          top: origin.y,
          width: maxDim,
          height: maxDim,
          borderRadius: "50%",
          background: targetColor,
          transform: "translate(-50%, -50%) scale(0)",
          animation: "bangExpand 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
      />
      <style>{`
        @keyframes bangExpand {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}


// -- Scroll progress bar --
function ScrollProgress({ C }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "left",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: C.accent,
        zIndex: 100,
      }}
    />
  );
}


// -- Right-side sticky nav --
function SideNav({ activeSection, C, isDark, onToggleTheme }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = [
    { label: "Experience", id: "experience" },
    { label: "Lab", id: "projects" },
    { label: "Research", id: "research" },
    { label: "Stack", id: "skills" },
    { label: "Contact", id: "connect" },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden md:flex"
          style={{
            position: "fixed",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 90,
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.05em",
                color: activeSection === s.id ? C.accent : C.muted,
                textDecoration: "none",
                transition: "color 0.2s",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            style={{
              marginTop: 12,
              background: "none",
              border: `1px solid ${C.navBorder}`,
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: C.muted,
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {isDark ? "light" : "dark"}
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}


// -- Mobile bottom nav --
function MobileNav({ activeSection, C, isDark, onToggleTheme }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sections = [
    { label: "Exp", id: "experience" },
    { label: "Lab", id: "projects" },
    { label: "Res", id: "research" },
    { label: "Stack", id: "skills" },
    { label: "Contact", id: "connect" },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex md:hidden"
          style={{
            position: "fixed",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 90,
            background: C.navBg,
            backdropFilter: "blur(12px)",
            border: `1px solid ${C.navBorder}`,
            borderRadius: 8,
            padding: "8px 12px",
            gap: 12,
            alignItems: "center",
          }}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: activeSection === s.id ? C.accent : C.muted,
                textDecoration: "none",
              }}
            >
              {s.label}
            </a>
          ))}
          <button
            onClick={onToggleTheme}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: C.muted,
              padding: "2px 4px",
            }}
          >
            {isDark ? "sun" : "moon"}
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}


// -- Section wrapper --
function Section({ id, children, className = "", bgColor }) {
  return (
    <section
      id={id}
      className={`relative w-full ${className}`}
      style={{ background: bgColor, position: "relative", zIndex: 1 }}
    >
      {children}
    </section>
  );
}


// -- Section header (Apple-style wipe reveal) --
function SectionHeader({ label, C }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className="mb-12"
    >
      <motion.h2
        initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
        animate={inView ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl font-light tracking-tight"
        style={{ color: C.text }}
      >
        {label}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="h-px mt-4 origin-left"
        style={{ background: C.accent, width: 48 }}
      />
    </motion.div>
  );
}


// -- Stat box --
function StatBox({ label, value, inView, C }) {
  const numericPart = typeof value === "number" ? value : parseInt(value, 10);
  const isNumeric = !isNaN(numericPart) && typeof value !== "string";
  const count = useCountUp(isNumeric ? numericPart : 0, inView);
  const suffix = typeof value === "string" ? value.replace(/^\d+/, "") : "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 15 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.1 }}
      className="flex flex-col items-center py-6 px-4"
    >
      <span
        style={{ color: C.accent, fontFamily: "var(--font-mono)" }}
        className="text-2xl font-semibold"
      >
        {isNumeric ? count : value}
        {isNumeric && suffix}
      </span>
      <span
        style={{ color: C.muted, fontFamily: "var(--font-mono)" }}
        className="text-xs mt-1 uppercase tracking-wider"
      >
        {label}
      </span>
    </motion.div>
  );
}


// ============================
// Main page
// ============================
export default function Home() {
  const { isDark, toggle, C, bang, clearBang } = useTheme();
  const [activeSection, setActiveSection] = useState("");
  const istClock = useISTClock();

  // Track active section
  useEffect(() => {
    const ids = ["experience", "projects", "research", "skills", "connect"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Page-level scroll progress for descent canvas
  const { scrollYProgress: pageProgress } = useScroll();

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroSubY = useTransform(heroProgress, [0, 1], [0, -60]);
  const heroTagY = useTransform(heroProgress, [0, 1], [0, -30]);

  const heroWords = ["Software Engineer.", "Researcher.", "Builder."];

  return (
    <main style={{ background: C.bg, color: C.text, minHeight: "100vh", transition: "background 0.4s, color 0.4s" }}>
      {isDark ? <DescentCanvas scrollProgress={pageProgress} /> : <LeavesCanvas />}
      {bang && <ThemeBang origin={bang.origin} toLight={bang.toLight} onDone={clearBang} />}
      <ScrollProgress C={C} />
      <SideNav activeSection={activeSection} C={C} isDark={isDark} onToggleTheme={toggle} />
      <MobileNav activeSection={activeSection} C={C} isDark={isDark} onToggleTheme={toggle} />

      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: heroY }}
        >
          <h1
            className="text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-none"
            style={{ color: C.text }}
          >
            {meta.alias}
          </h1>
        </motion.div>

        <motion.div className="flex flex-wrap gap-x-4 mt-6" style={{ y: heroSubY }}>
          {heroWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.8 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg md:text-xl font-light"
              style={{ color: C.muted }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Cosmic tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-8 text-sm max-w-md"
          style={{ fontFamily: "var(--font-mono)", color: C.muted, lineHeight: 1.6, y: heroTagY }}
        >
          navigating the void between idea and implementation --
          <br />
          solving existential bugs in the fabric of reality,
          <br />
          one commit at a time.
        </motion.p>

        {/* HUD: clock + location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-16 text-right"
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.muted }}
        >
          <div>{istClock}</div>
          <div className="mt-1">{meta.location}</div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.muted }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            scroll
          </motion.div>
        </motion.div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <Section id="experience" className="py-24 px-8 md:px-16 lg:px-24" bgColor="transparent">
        <div className="max-w-4xl mx-auto">
          <SectionHeader label="Experience" C={C} />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-lg font-light leading-relaxed mb-16 max-w-2xl"
            style={{ color: C.muted, fontFamily: "var(--font-sans)" }}
          >
            From university research labs to production systems at Guidewire -- a path
            shaped by curiosity about what machines can learn and a bias toward shipping
            things that work.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="space-y-6"
          >
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                variants={i % 2 === 0 ? fadeLeft : fadeRight}
                className="p-6 rounded-lg border"
                style={{
                  background: C.card,
                  borderColor: exp.head ? `${C.accent}40` : C.divider,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 mb-3">
                  <div>
                    <span className="font-medium" style={{ color: C.text }}>
                      {exp.role}
                    </span>
                    <span className="mx-2" style={{ color: C.muted }}>
                      --
                    </span>
                    <span style={{ color: C.accent }}>{exp.company}</span>
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.muted }}
                  >
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-1">
                  {exp.points.map((p, j) => (
                    <li key={j} className="text-sm" style={{ color: C.muted }}>
                      * {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ===== PROJECTS ===== */}
      <Section id="projects" className="py-24 px-8 md:px-16 lg:px-24" bgColor="transparent">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="The Lab" C={C} />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {projects.map((proj, i) => {
              const isFeatured = proj.featured;
              return (
                <motion.div
                  key={i}
                  variants={scaleUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`p-6 rounded-lg border ${
                    isFeatured ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                  style={{
                    background: C.card,
                    borderColor: isFeatured ? C.accent : C.divider,
                  }}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h3
                      className={`${isFeatured ? "text-xl" : "text-base"} font-medium`}
                      style={{ color: C.text }}
                    >
                      {proj.title}
                    </h3>
                    {isFeatured && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: C.accent,
                          border: `1px solid ${C.accent}40`,
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p
                    className={`${isFeatured ? "text-sm" : "text-xs"} leading-relaxed mb-4`}
                    style={{ color: C.muted }}
                  >
                    {proj.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          fontFamily: "var(--font-mono)",
                          background: C.tagBg,
                          color: C.accent,
                          fontSize: 10,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-xs"
                      style={{ color: C.accent, fontFamily: "var(--font-mono)" }}
                    >
                      {"github ->"}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* ===== RESEARCH ===== */}
      <Section
        id="research"
        className="py-24 px-8 md:px-16 lg:px-24"
        bgColor={C.researchBg}
      >
        <div className="max-w-4xl mx-auto">
          <SectionHeader label="Research" C={C} />

          <div className="space-y-5">
            {papers.map((paper, i) => (
              <motion.div
                key={paper.id}
                variants={i % 2 === 0 ? fadeLeft : fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="flex gap-5 items-start p-5 rounded-lg border"
                style={{
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  borderColor: C.divider,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: C.accent,
                    fontSize: 28,
                    fontWeight: 300,
                    lineHeight: 1,
                    minWidth: 36,
                  }}
                >
                  {String(paper.id).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-medium leading-snug" style={{ color: C.text }}>
                    {paper.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className="text-xs"
                      style={{ fontFamily: "var(--font-mono)", color: C.muted }}
                    >
                      {paper.venue} / {paper.year}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        background:
                          paper.status === "Published"
                            ? "rgba(74,222,128,0.1)"
                            : "rgba(232,168,73,0.1)",
                        color: paper.status === "Published" ? "#4ade80" : C.accent,
                      }}
                    >
                      {paper.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== SKILLS ===== */}
      <Section id="skills" className="py-24 px-8 md:px-16 lg:px-24" bgColor="transparent">
        <div className="max-w-5xl mx-auto">
          <SectionHeader label="The Stack" C={C} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {skillCategories.map((cat) => (
                <div key={cat.key}>
                  <h4
                    className="text-sm font-medium mb-1"
                    style={{ color: C.accent, fontFamily: "var(--font-mono)" }}
                  >
                    {cat.key}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {cat.desc}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-wrap gap-2 content-start"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {[
                "Python", "TypeScript", "JavaScript", "Dart", "SQL",
                "React", "Next.js", "Flutter", "Tailwind",
                "FastAPI", "Node.js", "PostgreSQL", "Redis", "Supabase",
                "LangChain", "LangGraph", "OpenAI", "RAG",
                "PyTorch", "HuggingFace", "Transformers",
                "AWS", "Azure", "Vercel", "Docker",
                "Git", "Linux", "GSAP", "Framer Motion",
              ].map((t) => (
                <motion.span
                  key={t}
                  variants={{
                    hidden: { opacity: 0, scale: 0.7, y: 10 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
                  }}
                  className="text-xs px-3 py-1.5 rounded border"
                  style={{
                    borderColor: `${C.accent}25`,
                    color: C.text,
                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    fontSize: 11,
                  }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mt-16 pt-12 border-t"
            style={{ borderColor: C.divider }}
          >
            <h3
              className="text-sm mb-6 tracking-widest uppercase"
              style={{ color: C.muted, fontFamily: "var(--font-mono)" }}
            >
              Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((a, i) => (
                <div key={i} className="flex items-baseline gap-3 text-sm">
                  <span
                    className="text-xs px-2 py-0.5 rounded shrink-0"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 9,
                      background:
                        a.tag === "AWARD"
                          ? C.tagBg
                          : a.tag === "CERT"
                          ? "rgba(74,222,128,0.1)"
                          : `rgba(139,139,139,0.1)`,
                      color:
                        a.tag === "AWARD"
                          ? C.accent
                          : a.tag === "CERT"
                          ? "#4ade80"
                          : C.muted,
                    }}
                  >
                    {a.tag}
                  </span>
                  <span style={{ color: C.muted }}>{a.text}</span>
                  <span
                    className="ml-auto text-xs shrink-0"
                    style={{ fontFamily: "var(--font-mono)", color: C.muted }}
                  >
                    {a.year}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ===== CONTACT ===== */}
      <Section id="connect" className="py-24 px-8 md:px-16 lg:px-24" bgColor="transparent">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader label="Contact" C={C} />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-light tracking-tight mb-10"
            style={{ color: C.text }}
          >
            {"Let's build something."}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
            style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
          >
            {[
              { label: "email", href: `mailto:${meta.email}` },
              { label: "github", href: meta.github },
              { label: "linkedin", href: meta.linkedin },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="transition-colors duration-200"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.target.style.color = C.accent)}
                onMouseLeave={(e) => (e.target.style.color = C.muted)}
              >
                {link.label} {"->"}
              </a>
            ))}
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 pt-8 border-t"
            style={{
              borderColor: C.divider,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: C.muted,
            }}
          >
            <div>{education.degree}</div>
            <div className="mt-1">
              {education.school} / {education.year}
            </div>
          </motion.div>

          {/* Footer */}
          <div
            className="mt-12 text-xs"
            style={{ fontFamily: "var(--font-mono)", color: `${C.muted}80` }}
          >
            {meta.alias} / {new Date().getFullYear()}
          </div>
        </div>
      </Section>
    </main>
  );
}

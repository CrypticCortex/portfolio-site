// Animals and people. Local origin = feet on the ground, facing right unless flipped.
import { path, circle, ellipse, rect, line, stroke } from '../svg.js';

export function figure(K, r, o = {}) {
  const kind = o.kind ?? r.weighted([['man', 3], ['woman', 3], ['sadhu', 0.8]]);
  const skin = r.pick(['#8a5a3a', '#a06a44', '#7a4c30', '#b57a50']);
  const cloth = r.pick(['#d6452f', '#e8a82a', '#2f6fb0', '#3f9a5a', '#c2428a', '#e8731a', '#7a3f9a']);
  const sk = K(skin);
  let s = '';
  if (kind === 'sadhu') {
    const saff = '#e8731a';
    s += ellipse(0, -2, 8, 2.5, K('#8a6a40'));
    s += path('M-7 -2C-7 -12 -4 -17 0 -17C4 -17 7 -12 7 -2Z', K(saff)) + path('M0 -17C4 -17 7 -12 7 -2H0Z', K.sh(saff, 0.28));
    s += circle(0, -21, 3, sk) + path('M-3.4 -21A3.4 3.4 0 0 1 3.4 -21L3 -25L-3 -25Z', K('#2a1a12'));
    return s;
  }
  if (kind === 'woman') {
    s += path('M-4 -18L-6.5 0H6.5L4 -18Z', K(cloth)) + path('M0 -18L4 -18L6.5 0H0Z', K.sh(cloth, 0.27));
    s += rect(-4.2, -20, 8.4, 3, K(cloth));
    s += circle(0, -23.5, 2.7, sk) + path('M-2.9 -24A2.9 2.9 0 0 1 2.9 -24L2.4 -22.6L-2.4 -22.6Z', K('#241610'));
    if (r() < 0.65) {
      s += ellipse(0, -28.4, 3.4, 2.5, K('#c2603a')) + line(-3.6, -19, -4.6, -26, sk, 1.2);
    }
    return s;
  }
  // man: dhoti, kurta, turban
  s += path('M-3.2 -11L-4 0H4L3.2 -11Z', K('#f1e9d6')) + line(-1.4, -11, -1.6, 0, K.sh('#f1e9d6', 0.3), 0.8);
  s += rect(-4, -20, 8, 10, K(cloth)) + rect(0, -20, 4, 10, K.sh(cloth, 0.27));
  s += line(-4, -19, -5.6, -12, sk, 1.4) + line(4, -19, 5.4, -12, sk, 1.4);
  s += circle(0, -23.2, 2.8, sk) + ellipse(0, -25.6, 3.5, 2.1, K(r.pick(['#f3ead6', '#e8731a', '#c63a30'])));
  if (r() < 0.4) s += line(7, -2, 7, -24, K('#5a3d2b'), 1);
  return s;
}

export function cow(K, r) {
  const hide = r.pick(['#f0e8d8', '#b9824f', '#d9cdb8', '#8a6040', '#e6d5b8']);
  const patch = r.pick(['#8a6040', '#3a2a22', '#b9824f']);
  const dk = K.sh(hide, 0.32);
  let s = '';
  // far legs, then body, then near legs
  s += rect(-12.4, -11, 3, 11, dk) + rect(9, -11, 3, 11, dk);
  s += path('M-17 -16Q-18.5 -26 -8 -26.5L8 -26Q15.5 -26 15.5 -18.5L15 -11Q15 -9 12 -9H-14Q-17 -9 -17 -12Z', K(hide));
  s += ellipse(8.5, -27.2, 5.2, 4, K(hide));
  s += path('M-17 -16Q-18.5 -26 -8 -26.5L-2 -26.4Q-8 -22 -9 -9H-14Q-17 -9 -17 -12Z', K.sh(hide, 0.12));
  if (r() < 0.55) s += ellipse(-4, -19, 5.4, 3.6, K(patch), 'fill-opacity=".85"') + ellipse(4, -16, 3.4, 2.6, K(patch), 'fill-opacity=".8"');
  s += path('M12 -22Q14.5 -15 12.4 -11H15Q17.5 -15 15.5 -22Z', K.sh(hide, 0.18));
  s += rect(-9.6, -11, 3.2, 11, K(hide)) + rect(5, -11, 3.2, 11, K(hide));
  s += rect(-9.8, -1.8, 3.6, 1.8, K('#3a2a22')) + rect(4.8, -1.8, 3.6, 1.8, K('#3a2a22')) + rect(-12.6, -1.8, 3.2, 1.8, K('#3a2a22')) + rect(9.2, -1.8, 3.2, 1.8, K('#3a2a22'));
  s += stroke('M-17 -23Q-21 -18 -19.5 -9', K.dk(hide, 0.4), 1) + circle(-19.5, -8, 1.3, K.dk(hide, 0.5));
  // neck + head (facing right), horns, ear
  s += path('M12 -26Q18 -27 21 -20L19.5 -15Q15.5 -17 13 -15Z', K(hide));
  s += path('M18.6 -21.5L25.4 -17.6Q27.2 -15.4 25.4 -13.6L20.2 -13.8Q18 -16 18.6 -21.5Z', K(hide)) + ellipse(25, -14.6, 2.2, 1.7, K('#6a4a40'));
  s += stroke('M19.6 -22.2Q20.4 -28 25 -28.6', K('#efe6cf'), 1.3) + ellipse(17.4, -21.2, 2.7, 1.3, K.sh(hide, 0.3), 'transform="rotate(30 17.4 -21.2)"');
  s += circle(22, -17.8, 0.6, K.ink);
  return s;
}

export function peacock(K, r, o = {}) {
  const fan = o.fan ?? r() < 0.55;
  const body = '#1f4fa0', neck = '#1f7f9a';
  let s = '';
  if (fan) {
    const n = 15;
    for (let i = 0; i < n; i++) {
      const a = (-200 + (i / (n - 1)) * 220) * (Math.PI / 180);
      const len = 29 + (i % 2) * 3.5;
      const ex = -4 + Math.cos(a) * len, ey = -19 + Math.sin(a) * len;
      s += line(-4, -19, ex, ey, K('#4f8a3a'), 1.1);
    }
    for (let i = 0; i < n; i++) {
      const a = (-200 + (i / (n - 1)) * 220) * (Math.PI / 180);
      const len = 29 + (i % 2) * 3.5;
      const ex = -4 + Math.cos(a) * len, ey = -19 + Math.sin(a) * len;
      s += ellipse(ex, ey, 3.6, 4.4, K('#2f7f5a')) + ellipse(ex, ey, 2.6, 3.3, K(body)) + circle(ex, ey, 1.3, K('#d9a826'));
    }
  } else {
    s += path('M-4 -17C-18 -14 -30 -8 -42 -2C-30 -2 -14 -6 -2 -12Z', K('#2f7f5a'));
    for (let i = 0; i < 5; i++) s += circle(-12 - i * 7, -11 + i * 1.6, 1.6, K(body)) + circle(-12 - i * 7, -11 + i * 1.6, 0.7, K('#d9a826'));
  }
  s += line(1, -9, 0.4, 0, K('#6a5a48'), 1.2) + line(4, -9, 4.4, 0, K('#6a5a48'), 1.2);
  s += ellipse(0, -16, 8.4, 5, K(body)) + ellipse(-1, -14, 6, 2.6, K.sh('#2f7f9a', 0.2), 'fill-opacity=".6"');
  s += stroke('M6 -19Q10 -22 8.5 -31', K(neck), 4.2);
  s += circle(9, -33.5, 2.5, K(neck)) + path('M11 -33.8L14.4 -32.6L11 -32Z', K('#e0b040'));
  s += stroke('M8.6 -35.5L7.6 -39.2M9.4 -35.8L9.6 -39.6M10.2 -35.4L11.6 -38.6', K.ink, 0.7) + circle(7.6, -39.4, 0.7, K('#2f9a8a')) + circle(9.6, -39.8, 0.7, K('#2f9a8a')) + circle(11.6, -38.8, 0.7, K('#2f9a8a'));
  s += circle(9.8, -33.8, 0.6, K.ink);
  return s;
}

export function camel(K, r, o = {}) {
  const fur = r.pick(['#c99a5b', '#d1a870', '#bb8a4c']);
  const dk = K.sh(fur, 0.3);
  let s = '';
  s += line(-11, -22, -11.6, -9, dk, 3) + line(-11.6, -9, -9.6, 0, dk, 2.6) + line(11, -22, 11.6, -9, dk, 3) + line(11.6, -9, 12.6, 0, dk, 2.6);
  s += stroke('M-17 -27Q-20 -22 -19.5 -15', K('#8a5e30'), 1.4);
  s += ellipse(0, -26, 17.5, 8, K(fur)) + ellipse(-3, -34, 6.6, 6.2, K(fur)) + ellipse(-3, -33, 3.8, 3.4, K.lt(fur, 0.2));
  s += stroke('M13 -28Q21 -33 21.5 -46', K(fur), 5.6) + path('M17.5 -45L30 -49.5L31 -46.5L21 -42.5Z', K(fur)) + ellipse(24, -47, 7, 3.2, K(fur), 'transform="rotate(-14 24 -47)"');
  s += circle(24, -48.6, 0.75, K.ink) + circle(19.8, -46.4, 1.4, dk);
  s += line(-7, -21, -7.4, -9, K(fur), 3.1) + line(-7.4, -9, -5.6, 0, K(fur), 2.7) + line(8, -21, 8.2, -9, K(fur), 3.1) + line(8.2, -9, 9.4, 0, K(fur), 2.7);
  const cloth = r.pick(['#c63a30', '#2f6fb0', '#e8a82a', '#7a3f9a']);
  s += path('M-8 -33L7 -33L9 -22L-10 -22Z', K(cloth)) + rect(-10, -23, 19, 1.6, K('#e8c23a'));
  if (o.rider ?? r() < 0.35) {
    s += rect(-2.6, -42, 5.4, 8, K(r.pick(['#f3ead6', '#d6452f', '#3f9a5a']))) + circle(0, -45, 2.4, K('#a06a44')) + ellipse(0, -47.2, 3, 1.8, K('#e8731a'));
  }
  return s;
}

export function elephant(K, r) {
  const hide = r.pick(['#7d7a80', '#8a8680', '#6f6c72']);
  const dk = K.sh(hide, 0.3);
  let s = '';
  s += rect(-18, -20, 7.6, 20, dk) + rect(9, -20, 7.6, 20, dk);
  s += stroke('M-26 -34Q-31 -26 -29 -14', K.dk(hide, 0.4), 1.4);
  s += ellipse(-1, -32, 25, 17, K(hide));
  s += rect(-12, -20, 8, 20, K(hide)) + rect(15, -20, 8, 20, K(hide));
  for (const x of [-12, 15]) s += rect(x, -3.4, 8, 3.4, K.sh(hide, 0.2));
  s += ellipse(17, -40, 10.5, 12.5, K(hide));
  s += path('M12 -52Q6 -50 6 -38Q8 -26 14 -30Q12 -42 12 -52Z', K.sh(hide, 0.2));
  s += path('M24 -34Q34 -30 36 -18Q37 -8 31 -4L28.4 -6Q31 -10 30.4 -17Q29 -26 22 -28Z', K(hide));
  s += stroke('M25 -29Q31 -24 32 -17', K.sh(hide, 0.4), 0.8);
  s += path('M25 -30Q33 -26 34 -23Q31 -25 25 -26Z', K('#f1e9d6'));
  const cloth = r.pick(['#c63a30', '#2f6fb0', '#7a3f9a']);
  s += path('M-20 -44L12 -45L16 -30L-22 -29Z', K(cloth)) + rect(-22, -30, 38, 2.4, K('#e8c23a'));
  for (let i = 0; i < 8; i++) s += circle(-19 + i * 4.6, -26.8, 0.9, K('#e8c23a'));
  s += rect(-6, -52, 14, 8, K('#d9a826'), `stroke="${K.dk('#d9a826', 0.4)}" stroke-width=".5"`);
  s += circle(15, -53, 2.4, K('#a06a44')) + ellipse(15, -55.6, 3.3, 1.9, K('#e8731a'));
  s += circle(20.5, -43, 0.9, K.ink);
  s += stroke('M12 -50Q17 -53 22 -48', K('#e8c23a'), 1.4);
  return s;
}

export function crane(K, r) {
  let s = line(-1, -10, -1.4, 0, K('#6a5a48'), 0.9) + line(2, -10, 2.6, 0, K('#6a5a48'), 0.9);
  s += path('M-8 -16Q-4 -22 4 -17Q0 -9 -8 -12Z', K('#f4f1ea')) + path('M-8 -14Q-12 -13 -14 -16Q-10 -17 -8 -16Z', K.sh('#f4f1ea', 0.3));
  s += stroke('M3 -18Q8 -23 5 -28', K('#f4f1ea'), 1.8) + circle(5.4, -29, 1.5, K('#f4f1ea')) + path('M6.6 -29.2L11 -28.4L6.6 -28Z', K('#e0b040'));
  s += circle(5.8, -29.3, 0.4, K.ink);
  return s;
}

export const ART = { figure, cow, peacock, camel, elephant, crane };

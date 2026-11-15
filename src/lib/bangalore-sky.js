// What the sky over Bangalore looks like right now, as an Anant Yatra mood.
// Sunrise, sunset and weather come from Open-Meteo (no key); without them, typical Bangalore times are used.
import { blendMood } from '@/yatra/world.js';
import { MOODS } from '@/yatra/moods.js';
import { smoothstep } from '@/yatra/color.js';

const MIN = 60_000;
const API = 'https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=temperature_2m,weather_code&daily=sunrise,sunset&forecast_days=1&timezone=Asia%2FKolkata';

// WMO weather codes → a few words, and whether it is raining
const WEATHER = [
  [[0], 'clear'], [[1], 'mostly clear'], [[2], 'partly cloudy'], [[3], 'overcast'], [[45, 48], 'fog'],
  [[51, 53, 55, 56, 57], 'drizzle'], [[61, 63, 65, 66, 67], 'rain'], [[80, 81, 82], 'showers'], [[95, 96, 99], 'thunderstorm'],
];
const RAIN = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
const CLOUDY = new Set([2, 3, 45, 48]);

/** Today's sunrise/sunset in Bangalore when the network is unavailable (they move by under an hour all year). */
function typicalSun(now) {
  const ist = new Date(now.getTime() + 5.5 * 60 * MIN);
  const day = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()) - 5.5 * 60 * MIN;
  return { sunrise: new Date(day + (6 * 60 + 15) * MIN), sunset: new Date(day + (18 * 60 + 15) * MIN) };
}

export async function fetchSky(now = new Date()) {
  try {
    const r = await fetch(API, { cache: 'no-store', signal: AbortSignal.timeout(4000) });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    // Open-Meteo returns local times without an offset; Bangalore is UTC+05:30 all year
    const at = (s) => new Date(`${s}:00+05:30`);
    const code = j.current.weather_code;
    return {
      sunrise: at(j.daily.sunrise[0]), sunset: at(j.daily.sunset[0]),
      code, temp: Math.round(j.current.temperature_2m),
      weather: (WEATHER.find(([codes]) => codes.includes(code)) || [, ''])[1],
      live: true,
    };
  } catch {
    return { ...typicalSun(now), code: 0, temp: null, weather: '', live: false };
  }
}

/** The mood for this instant: night → dawn at sunrise → day → dusk at sunset → night, with live rain and cloud. */
export function skyMood(now, sky) {
  const sr = sky.sunrise.getTime(), ss = sky.sunset.getTime(), t = now.getTime();
  const raining = RAIN.has(sky.code);
  const day = raining ? 'monsoon' : 'day';
  const keys = [
    [sr - 70 * MIN, 'night'], [sr, 'dawn'], [sr + 80 * MIN, day],
    [ss - 70 * MIN, day], [ss, 'dusk'], [ss + 70 * MIN, 'night'],
  ];
  let from = 'night', to = 'night', u = 0;
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i][0] && t < keys[i + 1][0]) {
      [from, to] = [keys[i][1], keys[i + 1][1]];
      u = smoothstep(0, 1, (t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]));
      break;
    }
  }
  const extra = {};
  if (raining && from !== 'monsoon' && to !== 'monsoon') { extra.rain = 0.8; extra.cloudiness = 1; }
  else if (CLOUDY.has(sky.code)) extra.cloudiness = 0.85;
  const m = blendMood(from, to, u, extra);

  // the body in the sky: the sun between sunrise and sunset (hidden by monsoon cloud), otherwise the moon,
  // at a height that follows its arc (y = 345 is the horizon in scene units, 95 near the zenith)
  const up = t > sr - 20 * MIN && t < ss + 20 * MIN;
  if (up) {
    const p = Math.min(1, Math.max(0, (t - sr) / (ss - sr)));
    m.bodyType = raining ? null : p < 0.12 ? 'dawn' : p > 0.88 ? 'dusk' : 'day';
    m.bodyAt = 345 - Math.sin(Math.PI * p) * 250;
  } else {
    const night = 24 * 60 * MIN - (ss - sr);
    const q = (((t - ss) % (24 * 60 * MIN)) + 24 * 60 * MIN) % (24 * 60 * MIN) / night;
    m.bodyType = raining ? null : 'night';
    m.bodyAt = 330 - Math.sin(Math.PI * Math.min(1, q)) * 230;
  }
  const named = MOODS[m.dominant];
  m.name = { english: named.english, native: named.native };
  return m;
}

export const istTime = (now) => new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(now);

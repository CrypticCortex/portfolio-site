// Times of day / weather, each a small palette. The world interpolates between them along the scroll,
// the way a handscroll lets time pass from one scene to the next.
import { hex2rgb } from './color.js';

const P = (o) => {
  const r = {};
  for (const k of Object.keys(o)) r[k] = typeof o[k] === 'string' && o[k][0] === '#' ? hex2rgb(o[k]) : o[k];
  return r;
};

export const CYCLE = ['dawn', 'day', 'dusk', 'night'];

export const MOODS = {
  dawn: P({
    label: 'Ushas', english: 'Dawn', native: 'उषा',
    top: '#35457f', mid: '#d9889f', hor: '#ffd7a0', haze: '#f6cdb0', light: '#ffe9dc',
    sat: 1.05, night: 0, lamps: 0.15, cloudiness: 0.5, rain: 0,
    cloud: '#fff0e8', cloudShade: '#e9a8b4', body: '#ffb347', bodySize: 34, bodyY: 322,
  }),
  day: P({
    label: 'Madhyahna', english: 'Day', native: 'दिन',
    top: '#2b62ac', mid: '#73a9dc', hor: '#e8f0e6', haze: '#cfdde6', light: '#ffffff',
    sat: 1.0, night: 0, lamps: 0, cloudiness: 0.38, rain: 0,
    cloud: '#ffffff', cloudShade: '#c9d6e8', body: '#fff1b8', bodySize: 27, bodyY: 105,
  }),
  monsoon: P({
    label: 'Varsha', english: 'Monsoon', native: 'वर्षा',
    top: '#38434f', mid: '#5d6b78', hor: '#9eabb0', haze: '#8a999f', light: '#c3ced6',
    sat: 0.78, night: 0, lamps: 0.1, cloudiness: 1, rain: 1,
    cloud: '#7e8a97', cloudShade: '#434e5c', body: null, bodySize: 0, bodyY: 0,
  }),
  dusk: P({
    label: 'Sandhya', english: 'Dusk', native: 'संध्या',
    top: '#272660', mid: '#a2476f', hor: '#f7a050', haze: '#e39a70', light: '#ffbf90',
    sat: 1.05, night: 0.1, lamps: 0.65, cloudiness: 0.55, rain: 0,
    cloud: '#ffc79a', cloudShade: '#a8507a', body: '#ff6a2c', bodySize: 40, bodyY: 326,
  }),
  night: P({
    label: 'Ratri', english: 'Night', native: 'रात्रि',
    top: '#070b2b', mid: '#121c55', hor: '#273882', haze: '#202f68', light: '#6575b8',
    sat: 0.75, night: 1, lamps: 1, cloudiness: 0.3, rain: 0,
    cloud: '#3a478a', cloudShade: '#1a2358', body: '#f3eed6', bodySize: 26, bodyY: 104,
  }),
};

export const MOOD_IDS = Object.keys(MOODS);

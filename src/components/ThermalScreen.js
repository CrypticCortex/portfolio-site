'use client';
import Image from 'next/image';
import { useState } from 'react';
import Feed from './Feed';

// Hero plate: the portrait as a two-ink riso print by daylight, or the same subject through an infrared camera.
export default function ThermalScreen({ maroon, gold, ir }) {
  const [mode, setMode] = useState('vis');
  return (
    <figure className={`monitor monitor--${mode}`}>
      <Feed label={mode === 'vis' ? 'Plate 1 · 2 inks' : 'Cam 1 · IR · 36.6°C'} right={mode === 'vis' ? 'Riso' : '● Live'}>
        <div className="monitor__glass" role="img" aria-label="Portrait of Kalyan">
          <Image className="plate plate--gold" src={gold} alt="" priority sizes="(max-width: 60rem) 80vw, 34vw" />
          <Image className="plate plate--maroon" src={maroon} alt="" priority sizes="(max-width: 60rem) 80vw, 34vw" />
          <Image className="monitor__ir" src={ir} alt="" sizes="(max-width: 60rem) 80vw, 34vw" />
          <span className="crosshair" aria-hidden="true" />
        </div>
      </Feed>
      <div className="switch" role="group" aria-label="Camera mode">
        <button type="button" aria-pressed={mode === 'vis'} onClick={() => setMode('vis')}>Print</button>
        <button type="button" aria-pressed={mode === 'ir'} onClick={() => setMode('ir')}>Infrared</button>
      </div>
    </figure>
  );
}

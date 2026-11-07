'use client';
import Image from 'next/image';
import { useState } from 'react';
import Feed from './Feed';

// Hero monitor: the portrait in 1-bit visible light or in infrared, switched with a VIS / IR control.
export default function ThermalScreen({ vis, ir }) {
  const [mode, setMode] = useState('vis');
  return (
    <figure className={`monitor monitor--${mode}`}>
      <Feed label={mode === 'vis' ? 'CAM 1 · VIS · 1-BIT' : 'CAM 1 · IR · 36.6°C'} right="● LIVE">
        <div className="monitor__glass">
          <Image className="monitor__vis" src={vis} alt="Portrait of Kalyan" priority sizes="(max-width: 60rem) 80vw, 34vw" />
          <Image className="monitor__ir" src={ir} alt="" sizes="(max-width: 60rem) 80vw, 34vw" />
          <span className="crosshair" aria-hidden="true" />
        </div>
      </Feed>
      <div className="switch" role="group" aria-label="Camera mode">
        <button type="button" aria-pressed={mode === 'vis'} onClick={() => setMode('vis')}>VIS</button>
        <button type="button" aria-pressed={mode === 'ir'} onClick={() => setMode('ir')}>IR</button>
      </div>
    </figure>
  );
}

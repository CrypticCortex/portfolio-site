import { Archivo_Narrow, JetBrains_Mono } from 'next/font/google';
import Hud from '@/components/Hud';
import Footer from '@/components/Footer';
import '../styles/globals.css';

const display = Archivo_Narrow({ subsets: ['latin'], display: 'swap', weight: ['700'], variable: '--font-archivo' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', weight: ['400', '600'], variable: '--font-jetbrains' });

export const metadata = {
  metadataBase: new URL('https://crypticcortex.vercel.app'),
  title: 'Kalyan, AI engineer in Bangalore',
  description: 'Kalyan is a Software Engineer I at Guidewire in Bangalore who builds AI agents, evaluation frameworks and memory for coding agents, after five research papers.',
};

export const viewport = { themeColor: '#08090a' };

export default function Layout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {/* CRT wobble used by dithered images */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <filter id="crt" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.002 0.35" numOctaves="1" seed="4" result="n">
              <animate attributeName="seed" values="1;7;3;9;2" dur="0.9s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <Hud />
        <main id="main">{children}</main>
        <Footer />
        <div className="scanlines" aria-hidden="true" />
      </body>
    </html>
  );
}

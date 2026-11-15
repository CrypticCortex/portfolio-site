import { Noto_Serif, Noto_Serif_Devanagari, Literata, JetBrains_Mono } from 'next/font/google';
import Hud from '@/components/Hud';
import Footer from '@/components/Footer';
import '../styles/globals.css';

const display = Noto_Serif({ subsets: ['latin'], display: 'swap', weight: ['700'], variable: '--font-noto' });
const deva = Noto_Serif_Devanagari({ subsets: ['devanagari'], display: 'swap', weight: ['600'], variable: '--font-noto-deva' });
const body = Literata({ subsets: ['latin'], display: 'swap', weight: ['400', '500'], variable: '--font-literata' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', weight: ['400', '600'], variable: '--font-jetbrains' });

export const metadata = {
  metadataBase: new URL('https://crypticcortex.vercel.app'),
  title: 'Kalyan · Software × AI, Bangalore',
  description: 'Kalyan is a Software Engineer I at Guidewire in Bangalore, working where AI meets software: agents, evaluation frameworks and memory for coding agents, after five research papers.',
};

export const viewport = { themeColor: '#f3ead6' };

export default function Layout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${deva.variable} ${body.variable} ${mono.variable}`} data-scheme="day" suppressHydrationWarning>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {/* CRT wobble for the night feeds */}
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
      </body>
    </html>
  );
}

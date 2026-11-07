import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import '../styles/globals.css';

const display = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap', weight: ['400', '700', '800'], variable: '--font-bricolage' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', weight: ['400', '500'], variable: '--font-jetbrains' });

export const metadata = {
  metadataBase: new URL('https://crypticcortex.vercel.app'),
  title: 'Kalyan, AI engineer in Bangalore',
  description: 'Kalyan is a Software Engineer I at Guidewire in Bangalore who builds AI agents, evaluation frameworks and memory for coding agents, after five research papers.',
};

export const viewport = { themeColor: '#0b0b0d' };

export default function Layout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {/* shared filters: CRT wobble for the hero, fisheye for project covers */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <filter id="crt" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.002 0.35" numOctaves="1" seed="4" result="n">
              <animate attributeName="seed" values="1;7;3;9;2" dur="0.9s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="fisheye" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage href="/spec/fisheye.png" preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale="140" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

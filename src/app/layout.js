import { Noto_Serif, Noto_Serif_Devanagari, Literata, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';

const display = Noto_Serif({ subsets: ['latin'], display: 'swap', weight: ['700'], variable: '--font-noto' });
const deva = Noto_Serif_Devanagari({ subsets: ['devanagari'], display: 'swap', weight: ['600'], variable: '--font-noto-deva' });
const body = Literata({ subsets: ['latin'], display: 'swap', weight: ['400', '500'], variable: '--font-literata' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', weight: ['400', '600'], variable: '--font-jetbrains' });

export const metadata = {
  metadataBase: new URL('https://crypticcortex.vercel.app'),
  title: 'Kalyan, Issue 01 · Software × AI, Bangalore',
  description: 'A 16-page zine about Kalyan, Software Engineer I at Guidewire in Bangalore, working where AI meets software: agents, evaluation frameworks and memory for coding agents.',
};

export const viewport = { themeColor: '#231a15' };

export default function Layout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${deva.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

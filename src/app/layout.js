import { Instrument_Serif, Instrument_Sans, JetBrains_Mono, Noto_Serif_Devanagari } from 'next/font/google';
import '../styles/globals.css';

const serif = Instrument_Serif({ subsets: ['latin'], display: 'swap', weight: '400', style: ['normal', 'italic'], variable: '--font-iserif' });
const sans = Instrument_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-isans' });
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', weight: ['400', '500'], variable: '--font-jetbrains' });
const deva = Noto_Serif_Devanagari({ subsets: ['devanagari'], display: 'swap', weight: ['500'], variable: '--font-noto-deva' });

export const metadata = {
  metadataBase: new URL('https://crypticcortex.vercel.app'),
  title: 'Kalyan · Software × AI, Bangalore',
  description: 'Kalyan, Software Engineer I at Guidewire in Bangalore: agents, evals and memory for AI. The site is a living map of everything he has built and how it connects.',
};

export const viewport = { themeColor: '#100e0c' };

export default function Layout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} ${deva.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

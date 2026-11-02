import { Literata } from 'next/font/google';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import '../styles/globals.css';

const literata = Literata({ subsets: ['latin'], display: 'swap', weight: ['400', '500'], variable: '--font-literata' });

export const metadata = {
  title: 'Kalyan, AI engineer in Bangalore',
  description: 'Kalyan is a Software Engineer I at Guidewire in Bangalore who builds AI agents, evaluation frameworks and memory for coding agents, after five research papers.',
};

export const viewport = { themeColor: '#f8f5ed' };

export default function Layout({ children }) {
  return (
    <html lang="en" className={literata.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800&display=swap" />
        <style>{`:root{--font-body:var(--font-literata),"Literata",ui-serif,Georgia,serif}`}</style>
      </head>
      <body>
        <a className="skip btn btn--primary" href="#main">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

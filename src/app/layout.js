import React from 'react';
import { Noto_Serif, Noto_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/globals.css';

const fontHeading = Noto_Serif({ subsets: ['latin'], display: 'swap', variable: '--font-heading', weight: ['400', '600', '700'] });
const fontBody = Noto_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-body' });

export const metadata = {
  title: 'Kalyan, Software × AI. Researcher. Builder.',
  description: 'Kalyan is a Software Engineer I at Guidewire in Bangalore who builds AI agents, evaluation frameworks and MCP tooling, with research in medical AI and sonar vision.',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{if(sessionStorage.getItem('ay-seen'))document.documentElement.dataset.seen='1'}catch(e){}" }} />
      </head>
      <body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

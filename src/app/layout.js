import React from 'react';
import { Noto_Serif, Noto_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../styles/globals.css';

const fontHeading = Noto_Serif({ subsets: ['latin'], display: 'swap', variable: '--font-heading', weight: ['400', '600', '700'] });
const fontBody = Noto_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-body' });

export const metadata = {
  title: 'Kalyan · research & building things',
  description: 'Kalyan — AI undergraduate at Amrita, working on vision-language models and computer vision. Projects, research and writing.',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

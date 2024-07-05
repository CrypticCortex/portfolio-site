
"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Lenis from '@studio-freight/lenis';
import Preloader from "@/components/Preloader";
import Introduction from "@/components/Introduction";
import FeaturedProjects from "@/components/FeaturedProjects";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";
import styles from './page.module.scss';
import React from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const loadScroll = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      new LocomotiveScroll();
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.cursor = "default";
        window.scrollTo(0, 0);
      }, 2000);
    };
    loadScroll();
    
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

  }, []);

  return (
    <div ref={container} className="flex min-h-[100dvh] flex-col">
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <AnimatePresence>
        {!isLoading && (
          <>
            <Introduction />
            <FeaturedProjects scrollYProgress={scrollYProgress} />
            <Skills />
            <Blog />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

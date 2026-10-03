"use client";
import { useState, useEffect } from "react";
import Preloader from "@/components/Preloader";
import Introduction from "@/components/Introduction";
import Experience from "@/components/Experience";
import FeaturedProjects from "@/components/FeaturedProjects";
import Skills from "@/components/Skills";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // greet only on the first entry of a session, not on every trip back to Home
    if (document.documentElement.dataset.seen) { setIsLoading(false); return; }
    const t = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <Preloader done={!isLoading} />
      <Introduction />
      <Experience />
      <FeaturedProjects />
      <Skills />
    </>
  );
}

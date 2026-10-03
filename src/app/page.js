"use client";
import { useState, useEffect } from "react";
import Preloader from "@/components/Preloader";
import Introduction from "@/components/Introduction";
import FeaturedProjects from "@/components/FeaturedProjects";
import Skills from "@/components/Skills";
import Blog from "@/components/Blog";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setIsLoading(false); }, 2000);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <Preloader done={!isLoading} />
      <Introduction />
      <FeaturedProjects />
      <Skills />
      <Blog />
    </>
  );
}

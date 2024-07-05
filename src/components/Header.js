"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerHeight = Math.max(40, 50 - scrollY * 0.1);

  return (
    <header
      className="fixed top-0 w-full transition-all duration-300 z-50 bg-opacity-80 backdrop-blur-md"
      style={{
        height: `${headerHeight}px`,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
      }}
    >
      <div className="container mx-auto h-full flex justify-center items-center px-2 md:px-4">
        <nav
          className="flex space-x-2 text-sm"
          aria-label="Main Navigation"
        >
          <CustomLink href="/" label="Home" />
          <CustomLink href="/education" label="Education" />
          <CustomLink href="https://github.com/CrypticCortex" label="Projects" />
          <CustomLink href="/what-i-can-do" label="Conversation Starters" />
          <CustomLink href="/research" label="Research" />
          <CustomLink href="https://aghoraguru.github.io/" label="Blog" />
          <CustomLink href="https://www.linkedin.com/in/crypticcortex/details/experience/" label="Experience" />
          <CustomLink href="mailto:kalyanguru18@gmail.com" label="Talk?" />

        </nav>
      </div>
    </header>
  );
}

function CustomLink({ href, label }) {
  return (
    <Link
      href={href}
      className="header-link focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-textPrimary px-2 py-1 rounded-full hover:bg-darkBlueLight transition-colors duration-300"
    >
      {label}
    </Link>
  );
}
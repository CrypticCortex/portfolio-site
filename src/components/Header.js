"use client";
import { useState } from "react";
import Link from "next/link";

const links = [
  ["/", "Home"],
  ["/#experience", "Experience"],
  ["/#work", "Projects"],
  ["/research", "Research"],
  ["/stack", "Stack"],
  ["/education", "Education"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <div className="w-full max-w-5xl rounded-full border border-[#e2d6bd] bg-paper/85 px-4 py-2 shadow-[0_4px_24px_rgba(122,26,42,.12)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-lg font-bold text-maroon" aria-label="Home">
            कल्याण <span className="hidden text-sm font-semibold text-mute sm:inline">· Kalyan</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {links.map(([href, label]) => <NavLink key={label} href={href} label={label} />)}
            <a href="mailto:kalyanguru18@gmail.com" className="btn ml-2 !py-1.5">Talk?</a>
          </nav>
          <button className="rounded-full px-3 py-1 text-sm font-semibold text-maroon lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
            {open ? "Close" : "Menu"}
          </button>
        </div>
        {open && (
          <nav className="mt-2 flex flex-col gap-1 pb-2 lg:hidden" aria-label="Mobile navigation" onClick={() => setOpen(false)}>
            {links.map(([href, label]) => <NavLink key={label} href={href} label={label} />)}
            <a href="mailto:kalyanguru18@gmail.com" className="btn mt-1 justify-center">Talk?</a>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link href={href} className="rounded-full px-3 py-1.5 text-sm font-semibold text-mute transition hover:bg-paper2 hover:text-maroon focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon">
      {label}
    </Link>
  );
}

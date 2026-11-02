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
      <div className="w-full max-w-5xl">
        <div className="rounded-full border border-rule bg-paper/95 px-4 py-2 shadow-[0_4px_24px_rgb(var(--maroon)/.15)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="font-serif text-lg font-bold text-maroon" aria-label="Home" onClick={() => setOpen(false)}>
              <span lang="hi">कल्याण</span> <span className="ml-1 hidden text-sm font-semibold text-mute sm:inline">Kalyan</span>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {links.map(([href, label]) => <NavLink key={label} href={href} label={label} />)}
              <a href="mailto:kalyanguru18@gmail.com" className="btn ml-2 !py-1.5">Talk?</a>
            </nav>
            <button className="min-h-[40px] rounded-full bg-maroon px-4 py-1.5 text-sm font-semibold text-paper lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {open && (
          <nav className="mt-2 flex flex-col gap-1 rounded-3xl border border-rule bg-paper p-3 shadow-[0_12px_32px_rgb(0_0_0/.25)] lg:hidden" aria-label="Mobile navigation" onClick={() => setOpen(false)}>
            {links.map(([href, label]) => (
              <Link key={label} href={href} className="rounded-2xl px-4 py-3 text-base font-semibold text-ink active:bg-paper2">{label}</Link>
            ))}
            <a href="mailto:kalyanguru18@gmail.com" className="btn mt-1 justify-center !py-3">Talk?</a>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, label }) {
  return (
    <Link href={href} className="rounded-full px-3 py-1.5 text-sm font-semibold text-mute transition-colors hover:bg-paper2 hover:text-maroon">
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0b1030] text-paper">
      <img src="/art/strip-night.svg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1030] via-[#0b1030]/40 to-[#0b1030]/80" />
      <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-28 text-center">
        <p className="font-serif text-3xl font-bold sm:text-4xl">Let&apos;s talk research, vision models, or the road ahead.</p>
        <a href="mailto:kalyanguru18@gmail.com" className="btn mt-6">kalyanguru18@gmail.com</a>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-paper/80">
          <a className="hover:text-gold" href="https://github.com/CrypticCortex" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="hover:text-gold" href="https://www.linkedin.com/in/crypticcortex/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="hover:text-gold" href="https://aghoraguru.github.io/" target="_blank" rel="noopener noreferrer">Blog</a>
        </div>
        <p className="mt-8 text-xs text-paper/60">Made with ❤️ on Earth 🌎 · landscapes from <i>Anant Yatra</i> (अनन्त यात्रा), my procedural painting engine · No actual cats were harmed in the making of these projects, though they may have been mildly annoyed.</p>
      </div>
    </footer>
  );
}

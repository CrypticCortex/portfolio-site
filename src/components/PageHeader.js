export default function PageHeader({ title, native, blurb, art = '/art/strip-himalaya.svg' }) {
  return (
    <section className="on-dark relative overflow-hidden bg-maroon text-paper">
      <img src={art} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/55 to-maroon/20" />
      <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-36 text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">{title}</h1>
        {native && <p lang="hi" className="mt-1 text-2xl text-gold/90">{native}</p>}
        {blurb && <p className="mx-auto mt-4 max-w-2xl text-lg text-paper/90">{blurb}</p>}
      </div>
      <div className="gold-rule" />
    </section>
  );
}

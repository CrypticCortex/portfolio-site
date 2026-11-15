export default function PageHeader({ eyebrow, title, native, blurb, art = '/art/strip-himalaya.svg' }) {
  return (
    <section className="relative overflow-hidden bg-maroon text-paper">
      <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/55 to-maroon/20" />
      <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-36 text-center">
        <p className="eyebrow !text-gold">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-6xl">{title}</h1>
        {native && <p className="mt-1 text-2xl text-gold/90">{native}</p>}
        {blurb && <p className="mx-auto mt-4 max-w-2xl text-lg text-paper/90">{blurb}</p>}
      </div>
      <div className="gold-rule" />
    </section>
  );
}

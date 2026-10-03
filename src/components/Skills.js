import Link from 'next/link';
import Scallop from './Scallop';

const items = [
  ["Machine Learning", "The maths hiding inside ML models is endlessly interesting."],
  ["Deep Learning", "Called a black box, but I see it as a small mirror of the human brain."],
  ["NeRF", "Rebuilding 3D scenes from 2D photographs is mind-blowing — and I love taking pictures, so one day I hope to build my own 3D model."],
  ["Android development", "A model that works perfectly is only half the story; I want to bridge the gap between inference and people."],
];

export default function Skills() {
  return (
    <>
      <Scallop from="#f7f0e0" to="#efe4cb" />
      <section className="bg-paper2 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="eyebrow">Curiosities</p>
            <h2 className="mt-2 text-3xl font-bold text-maroon sm:text-4xl">What I&apos;m usually up to</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {items.map(([name, why], i) => (
              <div key={name} className="paper-card flex gap-4 p-6">
                <span className="font-serif text-4xl font-bold leading-none text-gold">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-xl font-bold text-maroon">{name}</h3>
                  <p className="mt-1 leading-relaxed text-mute">{why}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/what-i-can-do" className="btn-ghost">All conversation starters →</Link></div>
        </div>
      </section>
    </>
  );
}

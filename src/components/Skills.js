import Link from 'next/link';
import Scallop from './Scallop';
import { competencies, achievements } from '@/data/profile';

export default function Skills() {
  return (
    <>
      <Scallop from="#efe4cb" to="#f7f0e0" />
      <section className="bg-paper px-4 py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="eyebrow">Core competencies</p>
            <h2 className="mt-2 text-3xl font-bold text-maroon sm:text-4xl">What I do</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competencies.map(([name, text], i) => (
              <div key={name} className="paper-card p-6">
                <span className="font-serif text-3xl font-bold text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-1 text-lg font-bold text-maroon">{name}</h3>
                <p className="mt-1 leading-relaxed text-mute">{text}</p>
              </div>
            ))}
          </div>
          <h3 className="mt-20 text-center font-serif text-2xl font-bold text-maroon">Milestones</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map(([a, b, y]) => (
              <div key={a + b} className="paper-card flex items-baseline gap-3 p-5">
                <span className="font-serif text-lg font-bold text-maroon">{a}</span>
                <span className="flex-1 text-mute">{b}</span>
                <span className="text-xs font-bold text-gold-dark">{y}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/stack" className="btn-ghost">Technical stack →</Link></div>
        </div>
      </section>
    </>
  );
}

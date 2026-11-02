import Link from 'next/link';
import Scallop from './Scallop';
import { competencies, achievements } from '@/data/profile';

export default function Skills() {
  return (
    <>
      <Scallop from="rgb(var(--paper-2))" to="rgb(var(--paper))" />
      <section className="bg-paper px-4 py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-maroon sm:text-4xl">What I do</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competencies.map(([name, text]) => (
              <div key={name} className="paper-card border-t-4 !border-t-gold p-6">
                <h3 className="text-lg font-bold text-maroon">{name}</h3>
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
                <time className="text-sm font-semibold text-gold-dark">{y}</time>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/stack" className="btn-ghost">See the full technical stack</Link></div>
        </div>
      </section>
    </>
  );
}

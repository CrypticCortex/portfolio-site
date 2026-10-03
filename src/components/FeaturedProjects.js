import Scallop from './Scallop';
import { projects } from '@/data/profile';

export default function FeaturedProjects() {
  return (
    <>
      <Scallop from="#f7f0e0" to="#efe4cb" />
      <section id="work" className="bg-paper2 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-2 text-3xl font-bold text-maroon sm:text-4xl">Systems that think, remember and ship</h2>
            <div className="gold-rule mx-auto mt-5 w-40" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <article key={p.name} className={`paper-card flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(122,26,42,.18)] ${p.featured ? 'ring-2 ring-gold md:col-span-1' : ''}`}>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-maroon">{p.name}</h3>
                  {p.featured && <span className="chip !bg-gold !text-ink">Featured</span>}
                </div>
                <p className="flex-1 leading-relaxed text-mute">{p.blurb}</p>
                <div className="flex flex-wrap gap-2">{p.stack.map((t) => <span key={t} className="chip">{t}</span>)}</div>
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn self-start">GitHub →</a>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

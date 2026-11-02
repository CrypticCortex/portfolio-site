import Scallop from './Scallop';
import { projects } from '@/data/profile';

export default function FeaturedProjects() {
  return (
    <>
      <Scallop from="rgb(var(--paper))" to="rgb(var(--paper-2))" />
      <section id="work" className="bg-paper2 px-4 py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-maroon sm:text-4xl">Systems that think, remember and ship</h2>
            <div className="gold-rule mx-auto mt-5 w-40" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <article key={p.name} className={`paper-card flex flex-col gap-3 p-5 sm:p-6 ${p.featured ? 'ring-2 ring-gold' : ''}`}>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-maroon">{p.name}</h3>
                  {p.featured && <span className="chip !bg-gold !text-ink">Featured</span>}
                </div>
                <p className="flex-1 leading-relaxed text-mute">{p.blurb}</p>
                <div className="flex flex-wrap gap-2">{p.stack.map((t) => <span key={t} className="chip">{t}</span>)}</div>
                {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn self-start" aria-label={`${p.name} source code on GitHub`}>Source on GitHub</a>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

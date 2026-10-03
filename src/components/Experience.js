import Scallop from './Scallop';
import { experience } from '@/data/profile';

export default function Experience() {
  return (
    <>
      <Scallop from="#f7f0e0" to="#f7f0e0" />
      <section id="experience" className="bg-paper px-4 py-20 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="eyebrow">Experience</p>
            <h2 className="mt-2 text-3xl font-bold text-maroon sm:text-4xl">Research first, production after</h2>
            <div className="gold-rule mx-auto mt-5 w-40" />
          </div>
          <ol className="relative border-l-4 border-gold pl-8">
            {experience.map((e) => (
              <li key={e.org} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[46px] top-2 h-5 w-5 rounded-full border-4 border-gold bg-maroon" />
                <div className="paper-card p-6">
                  <p className="eyebrow">{e.when}</p>
                  <h3 className="mt-1 text-xl font-bold text-maroon">{e.role} <span className="text-mute">· {e.org}</span></h3>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-mute marker:text-gold">
                    {e.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

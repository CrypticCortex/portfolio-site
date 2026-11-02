import Scallop from './Scallop';
import { experience } from '@/data/profile';

export default function Experience() {
  return (
    <>
      <Scallop from="rgb(var(--paper))" to="rgb(var(--paper))" />
      <section id="experience" className="bg-paper px-4 py-20 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-maroon sm:text-4xl">Research first, production after</h2>
            <div className="gold-rule mx-auto mt-5 w-40" />
          </div>
          <ol className="relative border-l-4 border-gold pl-5 sm:pl-8">
            {experience.map((e) => (
              <li key={e.org} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[34px] top-2 sm:-left-[46px] h-5 w-5 rounded-full border-4 border-gold bg-maroon" />
                <div className="paper-card p-4 sm:p-6">
                  <p className="meta">{e.when}</p>
                  <h3 className="mt-1 text-xl font-bold text-maroon">{e.role} <span className="font-semibold text-mute">at {e.org}</span></h3>
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

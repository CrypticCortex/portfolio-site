import PageHeader from '@/components/PageHeader';
import { education } from '@/data/profile';

export const metadata = { title: 'Education — Kalyan' };

export default function Education() {
  return (
    <>
      <PageHeader title="Education" native="शिक्षा" art="/art/strip-himalaya.svg" />
      <section className="bg-paper px-4 py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          {education.map((e) => (
            <div key={e.degree} className="paper-card p-6">
              <p className="meta">{e.duration}</p>
              <h3 className="mt-1 text-xl font-bold text-maroon">{e.degree}</h3>
              <p className="mt-1 text-mute">{e.institution}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

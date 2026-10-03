import PageHeader from '@/components/PageHeader';

const research = [
  { title: "MultiView Material Classification", status: "Submitted" },
  { title: "Prompt Engineered GPT for HPI in ER Setting — A Prospective Study", status: "In review" },
  { title: "Mitigating Gender Bias in VLMs and LLMs", status: "Underway" },
];

export const metadata = { title: 'Research · Kalyan' };

export default function Research() {
  return (
    <>
      <PageHeader eyebrow="Works in progress" title="Research" native="अनुसंधान" blurb="Some of the research I have been involved in so far." art="/art/strip-night.svg" />
      <section className="bg-paper px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {research.map((r, i) => (
            <article key={r.title} className="paper-card flex flex-col gap-3 p-6">
              <span className="font-serif text-4xl font-bold text-gold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="flex-1 text-lg font-bold leading-snug text-maroon">{r.title}</h3>
              <span className="chip self-start">{r.status}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

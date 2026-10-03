import PageHeader from '@/components/PageHeader';

const categories = [
  { name: "Languages", skills: [["Python", 90], ["Java", 75], ["Dart", 75]] },
  { name: "ML / AI frameworks", skills: [["TensorFlow", 85], ["PyTorch", 80], ["Keras", 85], ["Scikit-learn", 90]] },
  { name: "Data processing", skills: [["Pandas", 90], ["NumPy", 85], ["Dask", 30]] },
  { name: "Tools & platforms", skills: [["Flutter", 90], ["Docker", 80], ["Git", 85], ["AWS", 80], ["Google Cloud", 75]] },
  { name: "ML tools & libraries", skills: [["MLflow", 80], ["LiteLLM", 75]] },
  { name: "Special interest", skills: [["Computer Vision", 85], ["NLP", 80], ["VLM", 60]] },
];

export const metadata = { title: 'Conversation starters · Kalyan' };

export default function WhatICanDo() {
  return (
    <>
      <PageHeader eyebrow="Let's talk about" title="Conversation starters" native="चर्चा" blurb="Things I would like to do — and can have a conversation with you about." art="/art/strip-kerala.svg" />
      <section className="bg-paper px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {categories.map((c) => (
            <div key={c.name} className="paper-card p-6">
              <h3 className="text-xl font-bold text-maroon">{c.name}</h3>
              <div className="gold-rule my-3" />
              <ul className="space-y-3">
                {c.skills.map(([name, level]) => (
                  <li key={name}>
                    <div className="flex justify-between text-sm font-semibold text-ink"><span>{name}</span><span className="text-mute">{level}%</span></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper2" role="presentation">
                      <div className="h-full rounded-full bg-gradient-to-r from-maroon to-gold" style={{ width: `${level}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

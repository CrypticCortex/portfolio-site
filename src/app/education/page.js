import PageHeader from '@/components/PageHeader';

const educationData = [
  { degree: "B.Tech in Computer Science Engineering — Artificial Intelligence", institution: "Amrita University, Coimbatore, TN, India", duration: "2021 – 2025" },
  { degree: "Senior Secondary Education", institution: "Kamalavati Sr. Secondary CBSE School", duration: "2019 – 2021" },
];

export const metadata = { title: 'Education · Kalyan' };

export default function Education() {
  return (
    <>
      <PageHeader eyebrow="Where I have been" title="Education" native="शिक्षा" art="/art/strip-himalaya.svg" />
      <section className="bg-paper px-4 py-20">
        <ol className="relative mx-auto max-w-3xl border-l-4 border-gold pl-8">
          {educationData.map((e) => (
            <li key={e.degree} className="relative mb-10 last:mb-0">
              <span className="absolute -left-[46px] top-1.5 h-5 w-5 rounded-full border-4 border-gold bg-maroon" />
              <div className="paper-card p-6">
                <p className="eyebrow">{e.duration}</p>
                <h3 className="mt-1 text-xl font-bold text-maroon">{e.degree}</h3>
                <p className="mt-1 text-mute">{e.institution}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

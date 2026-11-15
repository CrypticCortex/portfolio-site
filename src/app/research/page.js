import PageHeader from '@/components/PageHeader';
import { publications } from '@/data/profile';

export const metadata = { title: 'Research · Kalyan' };

export default function Research() {
  return (
    <>
      <PageHeader eyebrow="Publications" title="Research" native="अनुसंधान" blurb="Papers from IISc Bangalore and Amrita University — medical AI, vision-language models and sonar." art="/art/strip-night.svg" />
      <section className="bg-paper px-4 py-20">
        <ol className="mx-auto grid max-w-4xl gap-5">
          {publications.map(([title, org, when], i) => (
            <li key={title} className="paper-card flex gap-5 p-6">
              <span className="font-serif text-4xl font-bold leading-none text-gold">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-lg font-bold leading-snug text-maroon">{title}</h3>
                <p className="mt-1 text-mute">{org} · <span className={when.startsWith('Underway') ? 'font-semibold text-gold-dark' : ''}>{when}</span></p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

import PageHeader from '@/components/PageHeader';
import { publications } from '@/data/profile';

export const metadata = { title: 'Research — Kalyan' };

export default function Research() {
  return (
    <>
      <PageHeader title="Research" native="अनुसंधान" blurb="Papers from IISc Bangalore and Amrita University — medical AI, vision-language models and sonar." art="/art/strip-night.svg" />
      <section className="bg-paper px-4 py-20">
        <ol className="mx-auto grid max-w-4xl gap-5">
          {publications.map(([title, org, when]) => (
            <li key={title} className="paper-card border-l-4 !border-l-gold p-6">
              <div>
                <h3 className="text-lg font-bold leading-snug text-maroon">{title}</h3>
                <p className="mt-1 text-mute">{org}, <time className={when.startsWith('Underway') ? 'font-semibold text-gold-dark' : ''}>{when}</time></p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

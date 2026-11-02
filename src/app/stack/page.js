import PageHeader from '@/components/PageHeader';
import { stack } from '@/data/profile';

export const metadata = { title: 'Stack — Kalyan' };

export default function Stack() {
  return (
    <>
      <PageHeader title="Technical stack" native="उपकरण" art="/art/strip-kerala.svg" />
      <section className="bg-paper px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {stack.map(([name, items]) => (
            <div key={name} className="paper-card p-6">
              <h3 className="text-xl font-bold text-maroon">{name}</h3>
              <div className="gold-rule my-3" />
              <div className="flex flex-wrap gap-2">{items.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

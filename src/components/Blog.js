import Scallop from './Scallop';
import SafeImg from './SafeImg';

const posts = [
  { image: "https://aghoraguru.github.io/assets/img/Pycaret/banner.png", title: "The Lazy Person's Guide to Machine Learning", description: "The key features of PyCaret on the telecom_custom_churn dataset, a classic binary classification problem in the telecom industry.", date: "April 11, 2023", url: "https://aghoraguru.github.io/2023/04/11/PyCaret-The-Lazy-Person's-Guide-to-Machine-Learning.html" },
  { image: "https://aghoraguru.github.io/assets/img/MandelBrot/MandelBrotBanner.webp", title: "Mandelbrot Set", description: "Making the Mandelbrot set with Excel.", date: "February 2, 2023", url: "https://aghoraguru.github.io/2023/02/02/MandleBrot_Set.html" },
];

export default function Blog() {
  return (
    <>
      <Scallop from="#efe4cb" to="#f7f0e0" />
      <section className="bg-paper px-4 py-20 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="eyebrow">Writing</p>
            <h2 className="mt-2 text-3xl font-bold text-maroon sm:text-4xl">Blogs</h2>
            <p className="mt-2 text-mute">It&apos;s been a while since I wrote, but these are the things.</p>
          </div>
          <div className="grid gap-6">
            {posts.map((p) => (
              <a key={p.title} href={p.url} target="_blank" rel="noopener noreferrer" className="paper-card group grid overflow-hidden transition hover:-translate-y-1 sm:grid-cols-[220px_1fr]">
                <SafeImg src={p.image} className="h-40 w-full object-cover sm:h-full" />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-dark">{p.date}</p>
                  <h3 className="mt-1 text-xl font-bold text-maroon group-hover:underline">{p.title}</h3>
                  <p className="mt-2 text-mute">{p.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

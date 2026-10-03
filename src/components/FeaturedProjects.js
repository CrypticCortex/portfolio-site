import Scallop from './Scallop';
import SafeImg from './SafeImg';

const projects = [
  {
    title: "Image Text Line Detection and Bounding Box Creation",
    description: "Applies Gabor filters to detect text lines in an image and draws bounding boxes around them. The modified image is saved and the box coordinates are stored in a JSON file.",
    image: "/gabor.png",
    url: "https://github.com/AghoraGuru/Gabor-Bounding-Box",
    tags: ["Computer vision", "Python"],
  },
  {
    title: "Image Upscaling with OpenVINO",
    description: "An interactive web app that upscales low-resolution images to high-resolution ones with a pre-trained OpenVINO super-resolution model.",
    image: "https://www.researchgate.net/publication/360482913/figure/fig2/AS:1154026754322434@1652152827757/The-modified-ESRGAN-architecture-is-used-in-the-proposed-super-resolution-model-Several.png",
    url: "https://github.com/AghoraGuru/Image-Upscaling-with-OpenVINO",
    tags: ["Super-resolution", "OpenVINO"],
  },
  {
    title: "BubbleDiary",
    description: "A diary app, reimagined: biometric-authenticated, uniquely crafted, and storing your daily entries securely in the cloud.",
    image: "https://github.com/CrypticCortex/BubbleDiary/assets/152802887/3205363b-f4a4-4cda-b57f-b45aba795964",
    url: "https://github.com/CrypticCortex/BubbleDiary",
    tags: ["Flutter", "Cloud"],
  },
  {
    title: "MedGPT — Medical Android App",
    description: "A Flutter app that supported research at AIMS Kochi, facilitating continuous dialogue, diagnosis and treatment planning.",
    image: "https://t4.ftcdn.net/jpg/05/77/83/69/360_F_577836923_wjACQsW6kd9UrT1W5pg32N6klwuvNVWu.jpg",
    url: null,
    tags: ["Flutter", "LLM", "Private"],
  },
];

export default function FeaturedProjects() {
  return (
    <>
      <Scallop from="#f7f0e0" to="#f7f0e0" />
      <section id="work" className="bg-paper px-4 py-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-2 text-3xl font-bold text-maroon sm:text-4xl">Things I have worked on and felt good about</h2>
            <div className="gold-rule mx-auto mt-5 w-40" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((p) => (
              <article key={p.title} className="paper-card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(122,26,42,.18)]">
                <div className="relative h-52 overflow-hidden bg-paper2">
                  <SafeImg src={p.image} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-maroon via-gold to-maroon" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
                  <h3 className="text-xl font-bold text-maroon">{p.title}</h3>
                  <p className="flex-1 leading-relaxed text-mute">{p.description}</p>
                  {p.url
                    ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn self-start">View project →</a>
                    : <span className="self-start text-sm font-semibold text-gold-dark">Private — ask me about it</span>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

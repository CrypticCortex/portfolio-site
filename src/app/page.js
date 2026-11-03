import Image from 'next/image';
import { profile, experience, projects, publications, achievements } from '@/data/profile';
import portraitBlue from '../../public/print/kalyan-blue.webp';
import portraitPink from '../../public/print/kalyan-pink.webp';
import memory from '../../public/print/memory.webp';
import voice from '../../public/print/voice.webp';
import servers from '../../public/print/servers.webp';
import microscope from '../../public/print/research.webp';

const covers = { agam: memory, 'Voice FNOL': voice, 'Cognitive OS': servers, MedGPT: microscope };
const featured = ['agam', 'Voice FNOL', 'Cognitive OS', 'MedGPT'];
const byName = (n) => projects.find((p) => p.name === n);

export default function Home() {
  const more = projects.filter((p) => !featured.includes(p.name));
  return (
    <>
      {/* hero: the person */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__text">
            <h1 className="name"><span className="misreg" data-text="Kalyan">Kalyan</span></h1>
            <p className="lead">AI engineer in Bangalore. I build agents, the evals that judge them, and the memory they run on.</p>
            <p className="hero__facts">{profile.title} at Guidewire. Before that, research at IISc Bangalore and Amrita University.</p>
          </div>
          <figure className="pull">
            <div className="plate" role="img" aria-label="Portrait of Kalyan">
              <Image className="plate__blue" src={portraitBlue} alt="" priority sizes="(max-width: 60rem) 360px, 40vw" />
              <Image className="plate__pink" src={portraitPink} alt="" priority sizes="(max-width: 60rem) 360px, 40vw" />
            </div>
          </figure>
        </div>
      </section>

      {/* selected work: a gallery of covers, then the rest as a list */}
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="container">
          <h2 id="work-title" className="section-title">Selected work</h2>
          <ol className="gallery">
            {featured.map(byName).map((p) => (
              <li key={p.name} className="work">
                <figure className="work__cover">
                  <Image src={covers[p.name]} alt="" sizes="(max-width: 60rem) 100vw, 50vw" />
                </figure>
                <div className="work__text">
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <p className="label">{p.stack.join(', ')}</p>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Code on GitHub</a>}
                </div>
              </li>
            ))}
          </ol>

          <h3 className="more-title">More projects</h3>
          <ul className="index">
            {more.map((p) => (
              <li key={p.name}>
                <h4>{p.name}</h4>
                <p>{p.blurb}</p>
                <div className="meta">
                  <span className="label">{p.stack.join(', ')}</span>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Code on GitHub</a>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* in my words */}
      <section className="band band--blue grained" aria-label="In my words">
        <div className="container">
          <p className="statement">I build systems that think, remember and ship. Everything else is configuration.</p>
          <p className="small">Research papers before graduation, production AI after.</p>
        </div>
      </section>

      {/* experience */}
      <section className="section" id="experience" aria-labelledby="exp-title">
        <div className="container">
          <h2 id="exp-title" className="section-title">Experience</h2>
          <ol className="trail">
            {experience.map((e) => (
              <li key={e.org}>
                <time>{e.when}</time>
                <div>
                  <h3>{e.role} <span className="org">at {e.org}</span></h3>
                  <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* research + recognition side by side */}
      <section className="section" aria-label="Research and recognition">
        <div className="container columns">
          <div>
            <h2 className="section-title">Research</h2>
            <ol className="rows">
              {publications.map(([title, org, when]) => (
                <li key={title}>
                  <h3>{title}</h3>
                  <span className="label">{org}</span>
                  <time>{when}</time>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="section-title">Recognition</h2>
            <ul className="rows">
              {achievements.map(([what, where, when]) => (
                <li key={what + where}>
                  <h3>{what}</h3>
                  <span className="label">{where}</span>
                  <time>{when}</time>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

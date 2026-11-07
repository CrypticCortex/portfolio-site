import Image from 'next/image';
import Plate from '@/components/Plate';
import Wireframe from '@/components/Wireframe';
import { profile, experience, projects, publications, achievements, stack } from '@/data/profile';
import portrait from '../../public/spec/portrait-dither.png';
import portraitIr from '../../public/spec/portrait-ir.webp';
import memory from '../../public/spec/memory-ir.webp';
import voice from '../../public/spec/voice-ir.webp';
import servers from '../../public/spec/servers-ir.webp';
import microscope from '../../public/spec/research-ir.webp';

const covers = { agam: [memory, '38.4°'], 'Voice FNOL': [voice, '41.2°'], 'Cognitive OS': [servers, '44.9°'], MedGPT: [microscope, '36.6°'] };
const featured = ['agam', 'Voice FNOL', 'Cognitive OS', 'MedGPT'];
const byName = (n) => projects.find((p) => p.name === n);

export default function Home() {
  const more = projects.filter((p) => !featured.includes(p.name));
  return (
    <>
      {/* PL.01 hero: a CRT screen showing a dithered portrait */}
      <section className="hero" aria-labelledby="hero-name">
        <div className="container hero__grid">
          <div className="hero__text">
            <Plate n="01" technique="Dithering + CRT distortion" note="Atkinson, 1-bit" />
            <h1 id="hero-name" className="name" data-text="Kalyan">Kalyan</h1>
            <p className="lead">AI engineer in Bangalore. I build agents, the evals that judge them, and the memory they run on.</p>
            <p className="hero__facts">{profile.title} at Guidewire. Before that, research at IISc Bangalore and Amrita University.</p>
          </div>
          <figure className="screen">
            <div className="screen__glass">
              <Image className="screen__dither" src={portrait} alt="Portrait of Kalyan, rendered as 1-bit dither" priority sizes="(max-width: 60rem) 80vw, 36vw" />
              <Image className="screen__ir" src={portraitIr} alt="" sizes="(max-width: 60rem) 80vw, 36vw" />
            </div>
            <figcaption className="screen__cap"><span>REC ●</span><span>hover: infrared</span></figcaption>
          </figure>
        </div>
      </section>

      {/* PL.02 work: infrared covers that fisheye on hover */}
      <section className="section section--dark" id="work" aria-labelledby="work-title">
        <div className="container">
          <div className="section-head">
            <Plate n="02" technique="Infrared photography + fisheye" note="hover a plate" />
            <h2 id="work-title">Selected work</h2>
          </div>
          <ol className="gallery">
            {featured.map(byName).map((p, i) => (
              <li key={p.name} className="work">
                <figure className="work__cover">
                  <Image src={covers[p.name][0]} alt="" sizes="(max-width: 60rem) 100vw, 50vw" />
                  <span className="work__temp">{String(i + 1).padStart(2, '0')} · {covers[p.name][1]}C</span>
                </figure>
                <div className="work__text">
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <p className="mono">{p.stack.join(' / ')}</p>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Code on GitHub ↗</a>}
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
                  <span className="mono">{p.stack.join(' / ')}</span>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PL.03 statement: embossed into paper */}
      <section className="emboss" aria-label="In my words">
        <div className="container">
          <Plate n="03" technique="Embossing / debossing" note="blind press, no ink" />
          <p className="emboss__line">I build systems that think, remember and ship.</p>
          <p className="deboss__line">Everything else is configuration.</p>
        </div>
      </section>

      {/* PL.04 experience over topographic lines */}
      <section className="section topo" id="experience" aria-labelledby="exp-title">
        <div className="container">
          <div className="section-head">
            <Plate n="04" technique="Topographic lines" note="12°58′N 77°35′E · 920 m" />
            <h2 id="exp-title">Experience</h2>
          </div>
          <ol className="trail">
            {experience.map((e, i) => (
              <li key={e.org}>
                <span className="trail__mark" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                <div>
                  <time className="mono">{e.when}</time>
                  <h3>{e.role} <span className="org">at {e.org}</span></h3>
                  <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PL.05 stack beside a wireframe render */}
      <section className="section section--dark wireplate" aria-labelledby="stack-title">
        <div className="container wireplate__grid">
          <div>
            <Plate n="05" technique="Wireframe render" note="torus, 648 vertices" />
            <h2 id="stack-title">Stack</h2>
            <dl className="stack">
              {stack.map(([group, items]) => (
                <div key={group}><dt className="mono">{group}</dt><dd>{items.join(', ')}</dd></div>
              ))}
            </dl>
          </div>
          <Wireframe />
        </div>
      </section>

      {/* PL.06 research + recognition: two-ink riso overprint */}
      <section className="section riso" aria-label="Research and recognition">
        <div className="container">
          <div className="section-head">
            <Plate n="06" technique="Risograph" note="blue + fluoro pink, overprinted" />
            <h2 className="riso__title" data-text="Papers & prizes">Papers &amp; prizes</h2>
          </div>
          <div className="columns">
            <ol className="rows">
              {publications.map(([title, org, when]) => (
                <li key={title}><h3>{title}</h3><span className="mono">{org}</span><time className="mono">{when}</time></li>
              ))}
            </ol>
            <ul className="rows">
              {achievements.map(([what, where, when]) => (
                <li key={what + where}><h3>{what}</h3><span className="mono">{where}</span><time className="mono">{when}</time></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

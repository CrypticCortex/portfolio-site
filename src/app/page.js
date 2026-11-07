import Image from 'next/image';
import Feed from '@/components/Feed';
import Kicker from '@/components/Kicker';
import SplitFlap from '@/components/SplitFlap';
import ThermalScreen from '@/components/ThermalScreen';
import Typer from '@/components/Typer';
import Wireframe from '@/components/Wireframe';
import { profile, experience, projects, publications, achievements, stack } from '@/data/profile';
import portrait from '../../public/spec/portrait-dither.png';
import portraitIr from '../../public/spec/portrait-ir.webp';
import memory from '../../public/spec/memory-ir.webp';
import voice from '../../public/spec/voice-ir.webp';
import servers from '../../public/spec/servers-ir.webp';
import microscope from '../../public/spec/research-ir.webp';

const covers = { agam: [memory, '38.4'], 'Voice FNOL': [voice, '41.2'], 'Cognitive OS': [servers, '44.9'], MedGPT: [microscope, '36.6'] };
const featured = ['agam', 'Voice FNOL', 'Cognitive OS', 'MedGPT'];
const byName = (n) => projects.find((p) => p.name === n);
const orgs = { Guidewire: 'Guidewire', 'IISc Bangalore': 'IISc', 'Hexon Global': 'Hexon', 'Amrita University': 'Amrita' };

export default function Home() {
  const more = projects.filter((p) => !featured.includes(p.name));
  return (
    <>
      {/* hero: the person, on camera */}
      <section className="hero" aria-labelledby="hero-name">
        <div className="container hero__grid">
          <div className="hero__text">
            <Kicker n="01">Subject identified</Kicker>
            <h1 id="hero-name" className="name" data-text="Kalyan">Kalyan</h1>
            <p className="lead">AI engineer in Bangalore. I build agents, the evals that judge them, and the memory they run on.</p>
            <p className="hero__facts">{profile.title} at Guidewire. Before that, research at IISc Bangalore and Amrita University.</p>
          </div>
          <ThermalScreen vis={portrait} ir={portraitIr} />
        </div>
      </section>

      {/* work: thermal camera feeds */}
      <section className="section" id="work" aria-labelledby="work-title">
        <div className="container">
          <Kicker n="02">Thermal · 4 sources</Kicker>
          <h2 id="work-title">Selected work</h2>
          <ol className="gallery">
            {featured.map(byName).map((p, i) => (
              <li key={p.name} className="work">
                <Feed label={`SRC-0${i + 1}`} right={`${covers[p.name][1]}°C`} className="work__feed">
                  <div className="work__cover"><Image src={covers[p.name][0]} alt="" sizes="(max-width: 60rem) 100vw, 50vw" /></div>
                  <span className="crosshair" aria-hidden="true" />
                </Feed>
                <div className="work__text">
                  <h3>{p.name}</h3>
                  <p>{p.blurb}</p>
                  <p className="tags">{p.stack.join(' · ')}</p>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Open source ↗</a>}
                </div>
              </li>
            ))}
          </ol>

          <h3 className="sub-title">Also on file</h3>
          <ul className="index">
            {more.map((p) => (
              <li key={p.name}>
                <h4><SplitFlap text={p.name} /></h4>
                <p>{p.blurb}</p>
                <div className="meta">
                  <span className="tags">{p.stack.join(' · ')}</span>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* in my words, typed */}
      <section className="statement" aria-label="In my words">
        <div className="container">
          <p className="prompt">kalyan@bangalore:~$ cat principles.txt</p>
          <Typer text="I build systems that think, remember and ship. Everything else is configuration." />
        </div>
      </section>

      {/* experience: a departures board */}
      <section className="section" id="experience" aria-labelledby="exp-title">
        <div className="container">
          <Kicker n="03">Log · 2023 to now</Kicker>
          <h2 id="exp-title">Experience</h2>
          <div className="board" role="list">
            <div className="board__head" aria-hidden="true"><span>When</span><span>Station</span><span>Role</span><span>Status</span></div>
            {experience.map((e, i) => (
              <article key={e.org} className="board__row" role="listitem">
                <time>{e.when}</time>
                <p className="board__org"><SplitFlap text={orgs[e.org] || e.org} /></p>
                <h3>{e.role} <span className="sr">at {e.org}</span></h3>
                <p className={`status ${i === 0 ? 'status--on' : ''}`}>{i === 0 ? 'On air' : 'Logged'}</p>
                <ul className="board__notes">{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* stack beside a wireframe */}
      <section className="section section--panel" aria-labelledby="stack-title">
        <div className="container wire__grid">
          <div>
            <Kicker n="04">Wireframe · torus, 648 vertices</Kicker>
            <h2 id="stack-title">Stack</h2>
            <dl className="stack">
              {stack.map(([group, items]) => (
                <div key={group}><dt>{group}</dt><dd>{items.join(', ')}</dd></div>
              ))}
            </dl>
          </div>
          <Feed label="RENDER" right="60 FPS" className="wire__feed"><Wireframe /></Feed>
        </div>
      </section>

      {/* research and recognition as terminal output */}
      <section className="section" aria-label="Research and recognition">
        <div className="container columns">
          <div>
            <Kicker n="05">ls ~/papers</Kicker>
            <h2>Research</h2>
            <ol className="rows">
              {publications.map(([title, org, when]) => (
                <li key={title}><h3>{title}</h3><span>{org}</span><time>{when}</time></li>
              ))}
            </ol>
          </div>
          <div>
            <Kicker n="06">ls ~/recognition</Kicker>
            <h2>Recognition</h2>
            <ul className="rows">
              {achievements.map(([what, where, when]) => (
                <li key={what + where}><h3>{what}</h3><span>{where}</span><time>{when}</time></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

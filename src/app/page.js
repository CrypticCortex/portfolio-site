import Image from 'next/image';
import Link from 'next/link';
import Feed from '@/components/Feed';
import Kicker from '@/components/Kicker';
import SplitFlap from '@/components/SplitFlap';
import ThermalScreen from '@/components/ThermalScreen';
import Typer from '@/components/Typer';
import Wireframe from '@/components/Wireframe';
import { profile, experience, projects, publications, achievements, stack } from '@/data/profile';
import plateMaroon from '../../public/yatra/portrait-maroon.webp';
import plateGold from '../../public/yatra/portrait-gold.webp';
import portraitIr from '../../public/spec/portrait-ir.webp';
import dawn from '../../public/yatra/hero-riso.webp';
import dusk from '../../public/yatra/strip-kerala-riso.webp';
import nightfall from '../../public/yatra/night-strip.webp';
import memory from '../../public/yatra/memory-riso.webp';
import voice from '../../public/yatra/voice-riso.webp';
import servers from '../../public/yatra/servers-riso.webp';
import microscope from '../../public/yatra/research-riso.webp';
import memoryIr from '../../public/spec/memory-ir.webp';
import voiceIr from '../../public/spec/voice-ir.webp';
import serversIr from '../../public/spec/servers-ir.webp';
import microscopeIr from '../../public/spec/research-ir.webp';

// One day in Bangalore, top to bottom: printed in two inks at dawn and noon, sunset over the backwaters,
// then the night shift on monitors. Each section's data-phase tells the HUD what time it is.
const covers = {
  agam: [memory, memoryIr, '38.4'],
  'Voice FNOL': [voice, voiceIr, '41.2'],
  'Cognitive OS': [servers, serversIr, '44.9'],
  MedGPT: [microscope, microscopeIr, '36.6'],
};
const featured = ['agam', 'Voice FNOL', 'Cognitive OS', 'MedGPT'];
const byName = (n) => projects.find((p) => p.name === n);
const orgs = { Guidewire: 'Guidewire', 'IISc Bangalore': 'IISc', 'Hexon Global': 'Hexon', 'Amrita University': 'Amrita' };

export default function Home() {
  const more = projects.filter((p) => !featured.includes(p.name));
  return (
    <>
      {/* dawn: the person, printed */}
      <section className="day hero" data-phase="dawn" aria-labelledby="hero-name">
        <div className="container hero__grid">
          <div className="hero__text">
            <Kicker n="01">Dawn · Bangalore, 12.97° N</Kicker>
            <h1 id="hero-name" className="name">
              <span className="misreg" data-text="Kalyan">Kalyan</span>
              <span className="native" lang="hi">{profile.native}</span>
            </h1>
            <p className="lead">{profile.tagline.join(' ')} I build agents, the evals that judge them, and the memory they run on.</p>
            <p className="hero__facts">{profile.title} at Guidewire, where AI meets software. Before that, research at IISc Bangalore and Amrita University.</p>
            <p className="hero__links">
              <a href="#work">Selected work ↓</a>
              <Link href="/research">Research</Link>
              <a href={`mailto:${profile.email}`}>Say hello</a>
            </p>
          </div>
          <ThermalScreen maroon={plateMaroon} gold={plateGold} ir={portraitIr} />
        </div>
        <div className="band band--dawn" aria-hidden="true">
          <Image src={dawn} alt="" sizes="200vw" priority />
        </div>
      </section>

      {/* noon: the work, as prints that turn to infrared under the cursor */}
      <section className="day section" id="work" data-phase="noon" aria-labelledby="work-title">
        <div className="container">
          <Kicker n="02">Noon · four plates, two inks, one infrared camera</Kicker>
          <h2 id="work-title">Selected work</h2>
          <ol className="gallery">
            {featured.map(byName).map((p, i) => {
              const [print, ir, temp] = covers[p.name];
              return (
                <li key={p.name} className="work" tabIndex={-1}>
                  <Feed label={`Plate 0${i + 2}`} right={`IR ${temp}°C`} className="work__feed">
                    <div className="work__cover">
                      <Image className="work__print" src={print} alt="" sizes="(max-width: 60rem) 100vw, 50vw" />
                      <Image className="work__ir" src={ir} alt="" sizes="(max-width: 60rem) 100vw, 50vw" />
                    </div>
                    <span className="crosshair" aria-hidden="true" />
                  </Feed>
                  <div className="work__text">
                    <h3>{p.name}</h3>
                    <p>{p.blurb}</p>
                    <p className="tags">{p.stack.join(' · ')}</p>
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Open source ↗</a>}
                  </div>
                </li>
              );
            })}
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

      {/* dusk: the backwaters go down, the terminal comes up */}
      <section className="dusk" data-phase="dusk" aria-label="In my words">
        <div className="band band--dusk" aria-hidden="true"><Image src={dusk} alt="" sizes="200vw" /></div>
        <div className="container dusk__text">
          <p className="prompt">kalyan@bangalore:~$ cat principles.txt</p>
          <Typer text="I build systems that think, remember and ship. Everything else is configuration." />
        </div>
        <div className="band band--night" aria-hidden="true"><Image src={nightfall} alt="" sizes="100vw" /></div>
      </section>

      {/* night: experience as a departures board */}
      <section className="night section" id="experience" data-phase="night" aria-labelledby="exp-title">
        <div className="container">
          <Kicker n="03">Night · departures, 2023 to now</Kicker>
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
      <section className="night section section--panel" data-phase="night" aria-labelledby="stack-title">
        <div className="container wire__grid">
          <div>
            <Kicker n="04">Render · torus, 648 vertices</Kicker>
            <h2 id="stack-title">Stack</h2>
            <dl className="stack">
              {stack.map(([group, items]) => (
                <div key={group}><dt>{group}</dt><dd>{items.join(', ')}</dd></div>
              ))}
            </dl>
          </div>
          <Feed label="Render" right="60 FPS" className="wire__feed"><Wireframe /></Feed>
        </div>
      </section>

      {/* research and recognition as terminal output */}
      <section className="night section" data-phase="night" aria-label="Research and recognition">
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

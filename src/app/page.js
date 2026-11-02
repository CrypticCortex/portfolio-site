import Image from 'next/image';
import Ticker from '@/components/Ticker';
import { profile, experience, projects, publications, achievements, stack } from '@/data/profile';
import portraitBlue from '../../public/print/kalyan-blue.webp';
import portraitPink from '../../public/print/kalyan-pink.webp';
import memory from '../../public/print/memory.webp';
import voice from '../../public/print/voice.webp';
import microscope from '../../public/print/research.webp';

const byName = (n) => projects.find((p) => p.name === n);

function Entry({ p, lead = false }) {
  return (
    <article className={`entry${lead ? ' entry--lead' : ''}`}>
      <h3>{p.name}</h3>
      <p>{p.blurb}</p>
      <p className="stack">{p.stack.join(', ')}</p>
      {p.url && <a className="more" href={p.url} target="_blank" rel="noopener noreferrer">Read the code on GitHub</a>}
    </article>
  );
}

export default function Home() {
  const more = ['MedGPT', 'Kanaku', 'SheLaw', 'JobScrapper'].map(byName);
  const tools = [...new Set(stack.flatMap(([, items]) => items))];
  const [first, second, sixth, organizer, bootcamp, certified] = achievements;
  return (
    <>
      {/* hero: Stage */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__text">
            <h1>From sonar papers to production <span className="misreg" data-text="agents">agents</span>.</h1>
            <p className="lead">I’m Kalyan, {profile.title} at Guidewire in Bangalore. I build agents, the evals that judge them, and the memory they run on.</p>
            <div className="actions">
              <a className="btn btn--primary" href={`mailto:${profile.email}`}>Email me</a>
              <a className="btn btn--secondary" href="#work">See the work</a>
            </div>
          </div>
          <figure className="pull">
            <div className="plate" role="img" aria-label="Portrait of Kalyan">
              <Image className="plate__blue" src={portraitBlue} alt="" priority sizes="(max-width: 60rem) 360px, 40vw" />
              <Image className="plate__pink" src={portraitPink} alt="" priority sizes="(max-width: 60rem) 360px, 40vw" />
            </div>
            <figcaption className="label">Kalyan, printed in two drums.</figcaption>
          </figure>
        </div>
      </section>

      <Ticker items={tools} />

      {/* memory: showcase */}
      <section className="section" id="work" aria-labelledby="memory-title">
        <div className="container">
          <div className="head">
            <h2 id="memory-title">Memory for agents that write code</h2>
            <p className="lead">Coding agents forget everything between sessions. These two remember for them.</p>
          </div>
          <figure className="wide">
            <Image src={memory} alt="" sizes="(max-width: 90rem) 100vw, 1312px" />
          </figure>
          <div className="pair">
            <Entry p={byName('agam')} lead />
            <Entry p={byName('Cognitive OS')} />
          </div>
        </div>
      </section>

      {/* statement band */}
      <section className="band band--blue grained" aria-label="How I work">
        <div className="container">
          <p className="statement">I build systems that think, remember and ship. Everything else is configuration.</p>
          <p className="small">Research papers before graduation, production AI after.</p>
        </div>
      </section>

      {/* voice: split, photo right */}
      <section className="section" aria-labelledby="voice-title">
        <div className="container split split--photo-right">
          <div className="split__text">
            <h2 id="voice-title">Claims and calls, taken by voice</h2>
            <Entry p={byName('Voice FNOL')} lead />
            <Entry p={byName('VoiceAI')} />
          </div>
          <figure className="split__photo">
            <Image src={voice} alt="" sizes="(max-width: 60rem) 100vw, 50vw" />
          </figure>
        </div>
      </section>

      {/* more work: index */}
      <section className="section" aria-labelledby="more-title">
        <div className="container">
          <div className="head head--reading">
            <h2 id="more-title">For hospitals, shops and courts</h2>
            <div className="reading">
              <p className="reading__was"><s>30%</s> <span className="sr-only">to</span></p>
              <p className="reading__now nums">80%</p>
              <p className="label">MedGPT diagnostic accuracy, up from 30%. Deployed at AIMS Kochi Hospital.</p>
            </div>
          </div>
          <ol className="index">
            {more.map((p) => (
              <li key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <div className="meta">
                  <span className="label">{p.stack.join(', ')}</span>
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Code on GitHub</a>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* record: trail */}
      <section className="screen" id="record" aria-labelledby="record-title">
        <div className="container">
          <div className="head">
            <h2 id="record-title">Four roles, research to production</h2>
          </div>
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

      {/* research: split, photo left */}
      <section className="section section--l" aria-labelledby="research-title">
        <div className="container split split--photo-left">
          <figure className="split__photo">
            <Image src={microscope} alt="" sizes="(max-width: 60rem) 100vw, 40vw" />
          </figure>
          <div className="split__text">
            <h2 id="research-title">Five papers, one underway</h2>
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
        </div>
      </section>

      {/* milestones: overprinted figures */}
      <section className="section section--l" aria-labelledby="prize-title">
        <div className="container">
          <div className="head">
            <h2 id="prize-title">Prizes, panels and a bootcamp</h2>
          </div>
          <div className="figures">
            <div className="figure"><span className="figure__num">1st</span><p>{first[1]}, <time>{first[2]}</time></p></div>
            <div className="figure"><span className="figure__num">2nd</span><p>{second[1]}, <time>{second[2]}</time></p></div>
            <div className="figure"><span className="figure__num">6th</span><p>{sixth[1]}, <time>{sixth[2]}</time></p></div>
            <div className="figure"><span className="figure__num">500+</span><p>Participants in the ML Bootcamp I co-led, <time>{bootcamp[2]}</time></p></div>
          </div>
          <ul className="also">
            <li><strong>{organizer[0]}</strong><span className="label">{organizer[1]}, <time>{organizer[2]}</time></span></li>
            <li><strong>{certified[0]}</strong><span className="label">{certified[1]}, <time>{certified[2]}</time></span></li>
          </ul>
        </div>
      </section>
    </>
  );
}

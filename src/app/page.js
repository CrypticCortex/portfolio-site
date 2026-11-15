import Journey from '@/components/Journey';
import { profile, experience, projects, publications, achievements, stack, competencies, education } from '@/data/profile';

// Each child of <Journey> is one stop on the walk; `titles` labels them on the route. Keep the two in step.
const byName = (n) => projects.find((p) => p.name === n);
const [current, ...before] = experience;
const others = ['Kanaku', 'SheLaw', 'JobScrapper', 'VoiceAI'].map(byName);

function Project({ name }) {
  const p = byName(name);
  return (
    <Stop>
      <h2>{p.name}</h2>
      <p>{p.blurb}</p>
      <p className="tags">{p.stack.join(' · ')}</p>
      {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a>}
    </Stop>
  );
}

// one stop's content, wrapped in a real element: server components arrive at <Journey> already rendered,
// so a fragment would be flattened into many stops
const Stop = ({ children }) => <div className="stop">{children}</div>;

const titles = ['Hello', 'What I do', 'agam', 'Voice FNOL', 'Cognitive OS', 'MedGPT', 'Also built', 'Guidewire', 'Before', 'Research', 'Recognition', 'Stack', 'This road', 'Say hello'];

export default function Home() {
  return (
    <>
      <header className="mast">
        <h1><span className="mast__name">Kalyan</span> <span className="mast__native" lang="hi">{profile.native}</span></h1>
        <p>{profile.tagline.join(' ')}</p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </header>

      <Journey titles={titles}>
        <Stop>
          <h2>I&rsquo;m Kalyan.</h2>
          <p>{profile.title} at Guidewire in Bangalore, working where AI meets software. I build agents, the evals that judge them, and the memory they run on.</p>
          <p className="aside">The road behind this card never ends. It is painted as you watch, in the light and weather Bangalore has right now. Just watch, or scroll to walk faster.</p>
        </Stop>

        <Stop>
          <h2>What I do</h2>
          <ul className="list">{competencies.map(([what, how]) => <li key={what}><strong>{what}.</strong> {how}</li>)}</ul>
        </Stop>

        <Project name="agam" />
        <Project name="Voice FNOL" />
        <Project name="Cognitive OS" />
        <Project name="MedGPT" />

        <Stop>
          <h2>Also built</h2>
          <ul className="list">
            {others.map((p) => (
              <li key={p.name}><strong>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a> : p.name}.</strong> {p.blurb}</li>
            ))}
          </ul>
        </Stop>

        <Stop>
          <p className="kicker">{current.when}</p>
          <h2>{current.org}</h2>
          <p className="role">{current.role}</p>
          <ul className="list">{current.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
        </Stop>

        <Stop>
          <h2>Before Guidewire</h2>
          <ul className="list">
            {before.map((e) => <li key={e.org}><strong>{e.org}</strong>, {e.role.toLowerCase()} ({e.when}). {e.points.join(' ')}</li>)}
          </ul>
        </Stop>

        <Stop>
          <h2>Research</h2>
          <ol className="list list--num">{publications.map(([title, org, when]) => <li key={title}>{title} <span className="meta">{org}, {when}</span></li>)}</ol>
        </Stop>

        <Stop>
          <h2>Recognition</h2>
          <ul className="list">{achievements.map(([what, where, when]) => <li key={what + where}><strong>{what}</strong>, {where} <span className="meta">{when}</span></li>)}</ul>
          {education.map((e) => <p key={e.degree} className="aside">{e.degree}, {e.institution}, {e.duration}.</p>)}
        </Stop>

        <Stop>
          <h2>Stack</h2>
          <dl className="stack">{stack.map(([group, items]) => <div key={group}><dt>{group}</dt><dd>{items.join(', ')}</dd></div>)}</dl>
        </Stop>

        <Stop>
          <h2>This road</h2>
          <p>The landscape is <em>Anant Yatra</em> (अनन्त यात्रा, &ldquo;endless journey&rdquo;), a generator I wrote: seeded noise and hand-built SVG art that paints the subcontinent from the Deccan to the Himalaya, forever, without repeating.</p>
          <p className="aside">Its sky follows Bangalore&rsquo;s real sunrise, sunset and weather, so the site looks different at 6 am, in the rain and at midnight.</p>
        </Stop>

        <Stop>
          <h2>Say hello.</h2>
          <p><a className="big" href={`mailto:${profile.email}`}>{profile.email}</a></p>
          <p className="links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </p>
        </Stop>
      </Journey>
    </>
  );
}

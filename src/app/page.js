import Image from 'next/image';
import Zine from '@/components/Zine';
import { profile, experience, projects, publications, achievements, stack, competencies, education } from '@/data/profile';
import plateMaroon from '../../public/yatra/portrait-maroon.webp';
import plateGold from '../../public/yatra/portrait-gold.webp';
import dawn from '../../public/yatra/hero-riso.webp';
import backwaters from '../../public/yatra/strip-kerala-riso.webp';
import bangalore from '../../public/yatra/bangalore-riso.webp';
import memory from '../../public/yatra/memory-riso.webp';
import voice from '../../public/yatra/voice-riso.webp';
import servers from '../../public/yatra/servers-riso.webp';
import microscope from '../../public/yatra/research-riso.webp';

// Kalyan, Issue 01: a 16-page riso zine (cover, 14 numbered pages, back cover) printed in maroon and marigold.
// Page numbers here are the #pN anchors and the folios; keep the contents list in step with the order below.
const byName = (n) => projects.find((p) => p.name === n);
const lead = ['agam', 'Voice FNOL', 'Cognitive OS', 'MedGPT'];
const covers = { agam: memory, 'Voice FNOL': voice, 'Cognitive OS': servers, MedGPT: microscope };
const [current, ...before] = experience;

const contents = [
  [2, 'Hello'],
  [3, 'What I do'],
  [4, 'agam'],
  [5, 'Voice FNOL'],
  [6, 'Cognitive OS'],
  [7, 'MedGPT'],
  [8, 'Also on file'],
  [9, 'Guidewire, now'],
  [10, 'Before that'],
  [11, 'Research'],
  [12, 'Recognition, education'],
  [13, 'Stack'],
  [14, 'Principles'],
];

function Page({ n, label, className = '', children }) {
  return (
    <article className={`page ${className}`} aria-label={label}>
      {children}
      {n > 0 && <footer className="folio"><span>Kalyan · Issue 01</span><span>{String(n).padStart(2, '0')}</span></footer>}
    </article>
  );
}

function Riso({ src, alt = '', className = '', priority }) {
  return <div className={`riso ${className}`}><Image src={src} alt={alt} sizes="(min-width: 60rem) 40vw, 90vw" priority={priority} /></div>;
}

function ProjectPage({ n, name, flip }) {
  const p = byName(name);
  return (
    <Page n={n} label={p.name} className={`project ${flip ? 'project--flip' : ''}`}>
      <Riso src={covers[name]} className="project__art" />
      <div className="project__text">
        <p className="kicker">Plate {String(n - 3).padStart(2, '0')} · Selected work</p>
        <h2 className="misreg" data-text={p.name}>{p.name}</h2>
        <p className="project__blurb">{p.blurb}</p>
        <p className="tags">{p.stack.join(' · ')}</p>
        {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">Source on GitHub ↗</a>}
      </div>
    </Page>
  );
}

export default function Home() {
  const more = projects.filter((p) => !lead.includes(p.name));
  return (
    <Zine pdf="/kalyan-zine.pdf">
      {/* front cover */}
      <Page n={0} label="Cover" className="cover">
        <p className="cover__issue"><span>Issue 01</span><span>Bangalore · 2026</span><span>₹0</span></p>
        <h1 className="cover__name"><span className="misreg" data-text="Kalyan">Kalyan</span></h1>
        <p className="cover__native" lang="hi">{profile.native}</p>
        <div className="cover__plate" role="img" aria-label="Portrait of Kalyan">
          <Image className="plate plate--gold" src={plateGold} alt="" priority sizes="(min-width: 60rem) 30vw, 70vw" />
          <Image className="plate plate--maroon" src={plateMaroon} alt="" priority sizes="(min-width: 60rem) 30vw, 70vw" />
        </div>
        <p className="cover__line">{profile.tagline.join(' ')}</p>
        <p className="sticker" aria-hidden="true">turn<br />the<br />page →</p>
      </Page>

      {/* inside front cover: contents + colophon */}
      <Page n={1} label="Contents" className="contents">
        <h2>In this issue</h2>
        <ol className="toc">
          {contents.map(([n, title]) => (
            <li key={n}><a href={`#p${n}`}><span>{title}</span><span className="toc__dots" aria-hidden="true" /><span>{String(n).padStart(2, '0')}</span></a></li>
          ))}
        </ol>
        <div className="colophon">
          <p>Printed in two inks, maroon and marigold, on cream stock. Landscapes from the Anant Yatra generator, re-inked.</p>
          <p>Use ← → or swipe to turn pages.</p>
        </div>
      </Page>

      <Page n={2} label="Hello" className="hello">
        <p className="kicker">Hello · வணக்கம் · नमस्ते</p>
        <h2>I&rsquo;m Kalyan.</h2>
        <p className="hello__lead">{profile.title} at Guidewire in Bangalore, working where AI meets software. I build agents, the evals that judge them, and the memory they run on.</p>
        <p>{profile.bio.charAt(0).toUpperCase() + profile.bio.slice(1)}</p>
        <p className="hello__before">Before Guidewire: research at IISc Bangalore and Amrita University, and five published papers.</p>
        <Riso src={dawn} className="hello__band" />
      </Page>

      <Page n={3} label="What I do" className="doing">
        <h2>What I do</h2>
        <dl className="doing__list">
          {competencies.map(([what, how], i) => (
            <div key={what}><dt><span>{String(i + 1).padStart(2, '0')}</span>{what}</dt><dd>{how}</dd></div>
          ))}
        </dl>
      </Page>

      <ProjectPage n={4} name="agam" />
      <ProjectPage n={5} name="Voice FNOL" flip />
      <ProjectPage n={6} name="Cognitive OS" />
      <ProjectPage n={7} name="MedGPT" flip />

      <Page n={8} label="Also on file" className="more">
        <h2>Also on file</h2>
        <ul className="more__list">
          {more.map((p) => (
            <li key={p.name}>
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
              <p className="tags">{p.stack.join(' · ')}{p.url && <> · <a href={p.url} target="_blank" rel="noopener noreferrer">GitHub ↗</a></>}</p>
            </li>
          ))}
        </ul>
      </Page>

      <Page n={9} label="Experience: Guidewire" className="job">
        <p className="kicker">{current.when}</p>
        <h2 className="misreg" data-text={current.org}>{current.org}</h2>
        <p className="job__role">{current.role}</p>
        <ul className="job__points">{current.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
        <p className="stamp" aria-hidden="true">Now</p>
      </Page>

      <Page n={10} label="Experience: before Guidewire" className="before">
        <h2>Before that</h2>
        <ol className="before__list">
          {before.map((e) => (
            <li key={e.org}>
              <p className="kicker">{e.when}</p>
              <h3>{e.org}</h3>
              <p className="before__role">{e.role}</p>
              <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            </li>
          ))}
        </ol>
      </Page>

      <Page n={11} label="Research" className="papers">
        <h2>Research</h2>
        <ol className="papers__list">
          {publications.map(([title, org, when], i) => (
            <li key={title}><span className="papers__n">{String(i + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{org} · {when}</p></li>
          ))}
        </ol>
      </Page>

      <Page n={12} label="Recognition and education" className="prizes">
        <h2>Recognition</h2>
        <ul className="prizes__list">
          {achievements.map(([what, where, when]) => (
            <li key={what + where}><strong>{what}</strong><span>{where}</span><time>{when}</time></li>
          ))}
        </ul>
        <h2 className="prizes__edu">Education</h2>
        {education.map((e) => (
          <p key={e.degree} className="edu"><strong>{e.degree}</strong><span>{e.institution} · {e.duration}</span></p>
        ))}
      </Page>

      <Page n={13} label="Stack" className="stack">
        <h2>Stack</h2>
        <dl className="stack__list">
          {stack.map(([group, items]) => <div key={group}><dt>{group}</dt><dd>{items.join(', ')}</dd></div>)}
        </dl>
      </Page>

      <Page n={14} label="Principles" className="principles">
        <Riso src={backwaters} className="principles__band" />
        <blockquote>
          <p>I build systems that think, remember and ship.</p>
          <p className="principles__rest">Everything else is configuration.</p>
        </blockquote>
      </Page>

      {/* back cover */}
      <Page n={0} label="Back cover: contact" className="back">
        <Riso src={bangalore} className="back__art" />
        <div className="back__text">
          <h2>Say hello.</h2>
          <a className="back__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
          <p className="back__links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </p>
          <p className="back__credits">Vidhana Soudha after DeepanjanGhosh (CC BY-SA 4.0); microphone after Will Fisher (CC BY-SA 2.0); George Peabody Library after Matthew Petroff (CC BY-SA 3.0); Nachet microscope after Didier Descouens (CC BY-SA 4.0); server racks after NOIRLab/NSF/AURA/T. Slovinský (CC BY 4.0). நன்றி · धन्यवाद.</p>
        </div>
      </Page>
    </Zine>
  );
}

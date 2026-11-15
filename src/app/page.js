import Mind from '@/components/Mind';
import { profile, experience, projects, publications, achievements, stack, education } from '@/data/profile';

// The map is the site; the index is the same facts as a plain list, for skimming (and for crawlers).
function Index() {
  return (
    <div className="cv">
      <header>
        <h1>{profile.name} <span lang="hi">{profile.native}</span></h1>
        <p>{profile.title} at Guidewire, Bangalore. Working where AI meets software.</p>
        <p><a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={profile.github}>GitHub</a> · <a href={profile.linkedin}>LinkedIn</a></p>
      </header>
      <section>
        <h2>Work</h2>
        {experience.map((e) => (
          <article key={e.org}>
            <h3>{e.org} <span>{e.role} · {e.when}</span></h3>
            <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </article>
        ))}
      </section>
      <section>
        <h2>Projects</h2>
        {projects.map((p) => (
          <article key={p.name}>
            <h3>{p.url ? <a href={p.url}>{p.name}</a> : p.name} <span>{p.stack.join(' · ')}</span></h3>
            <p>{p.blurb}</p>
          </article>
        ))}
      </section>
      <section>
        <h2>Research</h2>
        <ul>{publications.map(([t, org, when]) => <li key={t}>{t} <span>{org}, {when}</span></li>)}</ul>
      </section>
      <section>
        <h2>Recognition</h2>
        <ul>{achievements.map(([w, where, when]) => <li key={w + where}>{w}, {where} <span>{when}</span></li>)}</ul>
        <h2>Education</h2>
        <ul>{education.map((e) => <li key={e.degree}>{e.degree}, {e.institution} <span>{e.duration}</span></li>)}</ul>
        <h2>Stack</h2>
        <ul>{stack.map(([g, items]) => <li key={g}><strong>{g}:</strong> {items.join(', ')}</li>)}</ul>
      </section>
    </div>
  );
}

export default function Home() {
  return <Mind index={<Index />} />;
}

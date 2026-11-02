import Link from 'next/link';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <>
      <section className="band band--pink grained close" aria-labelledby="close-title">
        <div className="container close__grid">
          <div>
            <h2 id="close-title">Building agents? Write to me.</h2>
            <a className="close__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
          <div className="close__links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer__row small">
            <p>Kalyan (<span lang="hi">कल्याण</span>), Bangalore, 2026.</p>
            <nav aria-label="Footer">
              <Link href="/research">Research</Link>
              <Link href="/stack">Stack</Link>
              <Link href="/education">Education</Link>
            </nav>
          </div>
          <p className="small" data-credits>
            Photographs, reprinted in two inks: microphone by Will Fisher (CC BY-SA 2.0), George Peabody Library by Matthew Petroff (CC BY-SA 3.0), Nachet microscope by Didier Descouens (CC BY-SA 4.0), all via Wikimedia Commons.
          </p>
        </div>
      </footer>
    </>
  );
}

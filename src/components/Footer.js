import Image from 'next/image';
import Link from 'next/link';
import bangalore from '../../public/yatra/bangalore-night.png';
import Kicker from './Kicker';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <div className="night" data-phase="night">
      <section className="close" aria-labelledby="close-title">
        <div className="close__art"><Image src={bangalore} alt="" sizes="100vw" /></div>
        <div className="container close__grid">
          <Kicker n="07">Night vision · Vidhana Soudha, Bangalore</Kicker>
          <h2 id="close-title" className="tear" data-text="Say hello.">Say hello.</h2>
          <a className="close__mail" href={`mailto:${profile.email}`}>{profile.email}</a>
          <div className="close__links">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer__row">
          <p>Kalyan (<span lang="hi">कल्याण</span>), Bangalore, 2026. நன்றி, धन्यवाद, thank you. End of transmission.</p>
          <nav aria-label="Footer">
            <Link href="/research">Research</Link>
            <Link href="/stack">Stack</Link>
            <Link href="/education">Education</Link>
          </nav>
        </div>
        <p className="container footer__credits">
          Landscapes from the Anant Yatra generator, re-inked. Source photographs, re-rendered: Vidhana Soudha by DeepanjanGhosh (CC BY-SA 4.0), microphone by Will Fisher (CC BY-SA 2.0), George Peabody Library by Matthew Petroff (CC BY-SA 3.0), Nachet microscope by Didier Descouens (CC BY-SA 4.0), server racks by NOIRLab/NSF/AURA/T. Slovinský (CC BY 4.0), via Wikimedia Commons.
        </p>
      </footer>
    </div>
  );
}

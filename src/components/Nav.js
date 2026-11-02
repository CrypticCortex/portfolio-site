import Link from 'next/link';
import { profile } from '@/data/profile';

const links = [
  ['/#work', 'Work'],
  ['/#record', 'Record'],
  ['/research', 'Research'],
  ['/stack', 'Stack'],
  ['/education', 'Education'],
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__bar">
        <Link href="/" className="wordmark" aria-label="Kalyan, home">Kalyan</Link>
        <nav className="nav__links" aria-label="Main">
          {links.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}
          <a className="btn btn--secondary" href={`mailto:${profile.email}`}>Email me</a>
        </nav>
        <details className="nav__menu">
          <summary className="btn btn--secondary">Menu</summary>
          <nav className="nav__panel" aria-label="Main, small screens">
            {links.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}
            <a href={`mailto:${profile.email}`}>Email me</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

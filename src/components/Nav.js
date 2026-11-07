import Link from 'next/link';
import { profile } from '@/data/profile';

const links = [
  ['/#work', 'Work'],
  ['/#experience', 'Experience'],
  ['/research', 'Research'],
  ['/stack', 'Stack'],
  ['/education', 'Education'],
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="container nav__bar">
        <Link href="/" className="wordmark" aria-label="Kalyan, home">KALYAN<span>/spec</span></Link>
        <nav className="nav__links" aria-label="Main">
          {links.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}
          <a className="nav__mail" href={`mailto:${profile.email}`}>Email</a>
        </nav>
        <details className="nav__menu">
          <summary>Menu</summary>
          <nav className="nav__panel" aria-label="Main, small screens">
            {links.map(([href, label]) => <Link key={label} href={href}>{label}</Link>)}
            <a href={`mailto:${profile.email}`}>Email</a>
          </nav>
        </details>
      </div>
    </header>
  );
}

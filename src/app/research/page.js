import Plate from '@/components/Plate';
import { publications } from '@/data/profile';

export const metadata = { title: 'Research by Kalyan' };

// Guilloché: engraved like a banknote or share certificate, one serial number per paper.
export default function Research() {
  return (
    <div className="certificate">
      <div className="container page-body">
        <div className="certificate__frame">
          <header className="page-head">
            <Plate n="R" technique="Guilloché engraving" note="hypotrochoid rosette, banknote style" />
            <h1>Research</h1>
            <p className="lead">Papers from IISc Bangalore and Amrita University on medical AI, vision-language models and sonar.</p>
          </header>
          <ol className="rows">
            {publications.map(([title, org, when], i) => (
              <li key={title}>
                <h3>{title}</h3>
                <span className="mono">No. {String(i + 1).padStart(4, '0')} · {org}</span>
                <time>{when}</time>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

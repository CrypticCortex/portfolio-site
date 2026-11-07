import Image from 'next/image';
import Plate from '@/components/Plate';
import { education } from '@/data/profile';
import cyan from '../../../public/spec/cyanotype.webp';

export const metadata = { title: 'Education, Kalyan' };

// Cyanotype: a sun print, the portrait laid on the paper as a photogram.
export default function Education() {
  return (
    <div className="cyanotype">
      <div className="container page-body cyanotype__grid">
        <div>
          <header className="page-head">
            <Plate n="E" technique="Cyanotype" note="sun print, Prussian blue" />
            <h1>Education</h1>
          </header>
          <ol className="trail">
            {education.map((e) => (
              <li key={e.degree}>
                <div>
                  <time>{e.duration}</time>
                  <h3>{e.degree}</h3>
                  <p className="lead">{e.institution}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Image className="cyanotype__print" src={cyan} alt="Kalyan's portrait as a cyanotype photogram" sizes="(max-width: 60rem) 80vw, 36vw" />
      </div>
    </div>
  );
}

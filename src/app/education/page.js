import Image from 'next/image';
import Kicker from '@/components/Kicker';
import Feed from '@/components/Feed';
import { education } from '@/data/profile';
import portrait from '../../../public/spec/portrait-dither.png';

export const metadata = { title: 'Education, Kalyan' };

export default function Education() {
  return (
    <div className="container page-body edu">
      <div>
        <header className="page-head">
          <Kicker n="05">Archive · 2021 to 2025</Kicker>
          <h1>Education</h1>
        </header>
        <ol className="rows rows--wide">
          {education.map((e) => (
            <li key={e.degree}><h3>{e.degree}</h3><span>{e.institution}</span><time>{e.duration}</time></li>
          ))}
        </ol>
      </div>
      <Feed label="ARCHIVE · 2021" right="▶ PLAY" className="edu__feed">
        <Image className="edu__img" src={portrait} alt="" sizes="(max-width: 60rem) 80vw, 30vw" />
      </Feed>
    </div>
  );
}

import { education } from '@/data/profile';

export const metadata = { title: 'Education, Kalyan' };

export default function Education() {
  return (
    <div className="container page-body">
      <header className="page-head">
        <h1>Education</h1>
      </header>
      <ol className="trail">
        {education.map((e) => (
          <li key={e.degree}>
            <time>{e.duration}</time>
            <div>
              <h3>{e.degree}</h3>
              <p className="lead">{e.institution}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

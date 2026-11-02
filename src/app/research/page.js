import { publications } from '@/data/profile';

export const metadata = { title: 'Research by Kalyan' };

export default function Research() {
  return (
    <div className="container page-body">
      <header className="page-head">
        <h1>Research</h1>
        <p className="lead">Papers from IISc Bangalore and Amrita University on medical AI, vision-language models and sonar.</p>
      </header>
      <ol className="rows">
        {publications.map(([title, org, when]) => (
          <li key={title}>
            <h3>{title}</h3>
            <span className="label">{org}</span>
            <time>{when}</time>
          </li>
        ))}
      </ol>
    </div>
  );
}

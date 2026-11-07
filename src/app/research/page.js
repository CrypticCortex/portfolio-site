import Kicker from '@/components/Kicker';
import { publications } from '@/data/profile';

export const metadata = { title: 'Research by Kalyan' };

export default function Research() {
  return (
    <div className="container page-body">
      <header className="page-head">
        <Kicker n="03">ls -l ~/papers</Kicker>
        <h1>Research</h1>
        <p className="lead">Papers from IISc Bangalore and Amrita University on medical AI, vision-language models and sonar.</p>
      </header>
      <ol className="rows rows--wide">
        {publications.map(([title, org, when], i) => (
          <li key={title}><h3>{title}</h3><span>{String(i + 1).padStart(2, '0')} · {org}</span><time>{when}</time></li>
        ))}
      </ol>
    </div>
  );
}

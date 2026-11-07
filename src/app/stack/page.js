import Kicker from '@/components/Kicker';
import Feed from '@/components/Feed';
import AsciiTorus from '@/components/AsciiTorus';
import { stack } from '@/data/profile';

export const metadata = { title: 'Technical stack, Kalyan' };

export default function Stack() {
  return (
    <div className="container page-body">
      <header className="page-head">
        <Kicker n="04">ASCII render · after donut.c</Kicker>
        <h1>Technical stack</h1>
        <p className="lead">What I reach for, from the model to the machine it runs on.</p>
      </header>
      <Feed label="TTY1" right="80×30" className="ascii__feed"><AsciiTorus /></Feed>
      <dl className="stack stack--page">
        {stack.map(([name, items]) => <div key={name}><dt>{name}</dt><dd>{items.join(', ')}</dd></div>)}
      </dl>
    </div>
  );
}

import Plate from '@/components/Plate';
import AsciiTorus from '@/components/AsciiTorus';
import { stack } from '@/data/profile';

export const metadata = { title: 'Technical stack, Kalyan' };

export default function Stack() {
  return (
    <div className="terminal">
      <div className="container page-body">
        <header className="page-head">
          <Plate n="S" technique="ASCII render" note="after donut.c" />
          <h1>Technical stack</h1>
          <p className="lead">What I reach for, from the model to the machine it runs on.</p>
        </header>
        <AsciiTorus />
        <table className="stack-table">
          <tbody>
            {stack.map(([name, items]) => (
              <tr key={name}><th scope="row">{name}</th><td>{items.join(', ')}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

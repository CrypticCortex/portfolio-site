import { stack } from '@/data/profile';

export const metadata = { title: 'Technical stack, Kalyan' };

export default function Stack() {
  return (
    <div className="container page-body">
      <header className="page-head">
        <h1>Technical stack</h1>
        <p className="lead">What I reach for, from the model to the machine it runs on.</p>
      </header>
      <table className="stack-table">
        <tbody>
          {stack.map(([name, items]) => (
            <tr key={name}><th scope="row">{name}</th><td>{items.join(', ')}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

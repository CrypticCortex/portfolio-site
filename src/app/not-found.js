import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="nosignal">
      <div className="bars" aria-hidden="true">{['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'].map((c) => <span key={c} style={{ background: c }} />)}</div>
      <div className="container nosignal__text">
        <h1>No signal</h1>
        <p className="lead">Channel 404 is off the air. <Link href="/">Back to channel 01</Link>.</p>
      </div>
    </div>
  );
}

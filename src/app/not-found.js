import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="lost">
      <div className="card">
        <p className="kicker">404</p>
        <h1 >Off the map.</h1>
        <p>This road doesn&rsquo;t go anywhere. <Link href="/">Back to the journey</Link>.</p>
      </div>
    </div>
  );
}

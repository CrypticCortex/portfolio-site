import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="lost">
      <h1>A thought that went nowhere.</h1>
      <p><Link href="/">Back to the map</Link></p>
    </div>
  );
}

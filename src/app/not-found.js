import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="desk">
      <div className="leaf torn-leaf">
        <article className="page torn">
          <p className="kicker">Page 404</p>
          <h1 className="misreg" data-text="Torn out.">Torn out.</h1>
          <p>This page isn&rsquo;t in the issue. <Link href="/">Back to the cover</Link>.</p>
        </article>
      </div>
    </div>
  );
}

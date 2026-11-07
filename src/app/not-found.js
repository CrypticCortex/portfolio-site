import Link from 'next/link';
import Plate from '@/components/Plate';

export default function NotFound() {
  return (
    <div className="container page-body anaglyph">
      <Plate n="404" technique="Anaglyph 3D" note="red/cyan glasses recommended" />
      <h1 className="anaglyph__big" data-text="404">404</h1>
      <p className="lead">This page is not here. <Link href="/">Back to the home page</Link>.</p>
    </div>
  );
}

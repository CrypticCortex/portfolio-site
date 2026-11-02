// Scalloped miniature-painting cloud edge used between sections.
export default function Scallop({ from = 'rgb(var(--paper))', to = 'rgb(var(--paper-2))', flip = false }) {
  const bumps = Array.from({ length: 28 }, (_, i) => `A28 28 0 0 1 ${(i + 1) * 100} 40`).join(' ');
  return (
    <div className="w-full overflow-hidden leading-[0]" style={{ background: to, transform: flip ? 'scaleY(-1)' : undefined }} aria-hidden>
      <svg viewBox="0 0 2800 40" preserveAspectRatio="none" className="block h-6 w-full md:h-8">
        <path d={`M0 40 ${bumps} V0 H0Z`} style={{ fill: from }} />
      </svg>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { profile } from '@/data/profile';

export default function Introduction() {
  return (
    <section className="relative flex min-h-[640px] h-screen max-h-[960px] items-end overflow-hidden bg-[#c9a58f]">
      <img src="/art/hero.svg" alt="" aria-hidden className="drift absolute inset-y-0 left-0 h-full w-[150%] max-w-none object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 md:px-6">
        <div className="rise paper-card !bg-card/90 backdrop-blur-sm grid items-center gap-8 p-6 md:grid-cols-[1fr_auto] md:gap-12 md:p-10">
          <div className="space-y-5">
            <p className="eyebrow">{profile.native} · {profile.location}</p>
            <h1 className="text-5xl font-bold tracking-tight text-maroon sm:text-6xl lg:text-7xl">{profile.name}</h1>
            <h2 className="text-2xl font-semibold text-ink/80">{profile.tagline.join(' ')}</h2>
            <p className="max-w-prose text-lg leading-relaxed text-mute">{profile.bio}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#work" className="btn">Selected work ↓</a>
              <Link href="/research" className="btn-ghost">Research</Link>
              <a href={`mailto:${profile.email}`} className="btn-ghost">Say hello</a>
            </div>
          </div>
          <div className="mx-auto">
            <div className="relative h-60 w-60 overflow-hidden rounded-full border-4 border-gold shadow-[0_0_0_6px_#7a1a2a,0_10px_30px_rgba(0,0,0,.25)] md:h-72 md:w-72">
              <Image src="/Profile.png" alt={profile.name} title="Thank you, ifykuk 🌝" width={288} height={360} className="absolute left-1/2 top-[-6%] h-[125%] w-auto max-w-none -translate-x-1/2 object-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

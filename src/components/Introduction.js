import Image from 'next/image';
import Link from 'next/link';
import { profile } from '@/data/profile';

export default function Introduction() {
  return (
    <section className="relative flex min-h-[640px] items-end overflow-hidden md:h-screen md:max-h-[960px] bg-dusk">
      <img src="/art/hero.svg" alt="" aria-hidden className="drift absolute inset-y-0 left-0 h-full w-[150%] max-w-none object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-[min(18vh,160px)] md:px-6 md:pb-16 md:pt-32">
        <div className="rise paper-card !bg-card/90 backdrop-blur-sm grid items-center gap-5 p-5 sm:gap-8 sm:p-6 md:grid-cols-[1fr_auto] md:gap-12 md:p-10">
          <div className="order-2 space-y-4 sm:space-y-5 md:order-1">
            <h1 className="flex flex-wrap items-baseline gap-x-4 text-5xl font-bold tracking-tight text-maroon sm:text-6xl lg:text-7xl">
              {profile.name}
              <span lang="hi" className="text-2xl font-semibold tracking-normal text-gold-dark sm:text-3xl">{profile.native}</span>
            </h1>
            <p className="font-serif text-xl font-semibold text-ink/80 sm:text-2xl">{profile.tagline.join(' ')}</p>
            <p className="meta -mt-2">{profile.title} at Guidewire, {profile.location.replace(', IN', '')}</p>
            <p className="max-w-[60ch] text-lg leading-relaxed text-mute">{profile.bio}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#work" className="btn">Selected work</a>
              <Link href="/research" className="btn-ghost">Research</Link>
              <a href={`mailto:${profile.email}`} className="btn-ghost">Say hello</a>
            </div>
          </div>
          <div className="order-1 mx-auto md:order-2">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-gold shadow-[0_0_0_6px_rgb(var(--maroon)),0_10px_30px_rgb(0_0_0/.25)] sm:h-60 sm:w-60 md:h-72 md:w-72">
              <Image src="/Profile.png" alt={profile.name} title="Thank you, ifykuk 🌝" width={288} height={360} className="absolute left-1/2 top-[-6%] h-[125%] w-auto max-w-none -translate-x-1/2 object-cover" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

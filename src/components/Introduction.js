// src/components/Introduction.js

import Image from 'next/image';

export default function Introduction() {
  return (
    <section className="bg-darkBlue py-20 px-4 md:px-6 flex items-center min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
          <div className="space-y-6 text-center md:text-left max-w-prose mx-auto md:mx-0">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Kalyan</span>
            </h1>
            <h2 className="text-2xl font-semibold text-lightBlue">AI Researcher & Developer</h2>
            <p className="text-textSecondary text-lg">
              I’m a 4th-year undergraduate at Amrita University with a keen interest in computer vision and visual learning models.
              I enjoy turning ideas into applications using Flutter and am actively involved in research, particularly focusing on VLMS and CV.
            </p>
            <p className="text-textSecondary text-lg">
              I believe in the power of AI to transform industries and improve lives. My projects often explore the intersection of
              machine learning, computer vision, and natural language processing. Collaborating with fellow researchers and industry professionals,
              I strive to push the boundaries of whats possible in AI.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8 md:mt-0">
            <div className="profile-circle">
              <Image
                src="/Profile.png"
                alt="Portrait"
                width={256}
                height={256}
                className="profile-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

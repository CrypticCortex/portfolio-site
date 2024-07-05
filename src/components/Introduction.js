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
            <h2 className="text-2xl font-semibold text-lightBlue">I like to do research and build things.</h2>
            <p className="text-textSecondary text-lg">
            As a 4th-year undergraduate at Amrita University, I have been involved in several valuable technical activities and groundbreaking research work aligned with my interests, particularly in computer vision. My current research focuses on Vision Language Models (VLMs) and related vision tasks.
            From a birds-eye view, I am fascinated by the process of AI evolving into an increasingly sophisticated knowledge cortex. I am curious to see the aftermath of this AI plateau and where it will lead us next.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8 md:mt-0">
            <div className="profile-circle">
              <Image
                src="/Profile.png"
                alt="Profile Image"
                title="Thank you, ifykuk 🌝"
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

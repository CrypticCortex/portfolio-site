// src/components/Skills.js
import React from 'react';
import Link from 'next/link';
import AnimatedButton from './AnimatedButton';
const skillCategories = [
  {
    name: "Machine Learning",
    description: "Why? The inherent math behind ML models are just soo interesting."
  },
  {
    name: "Deep Learning",
    description: "Why? Though it's labbeled as a black box, I find it as a representation of human brain."
  },
  {
    name: "NeRF",
    description: "Why? The idea of reconstructing 3D scenes from 2D images is just mind-blowing. And I love taking pictures so one day hoping to build my own 3D model."
  },
  {
    name: "Android Development",
    description: "Why? Well, you have model which works perfectly, but inference of models are only for nerds. I feel there is an gap that needs to be bridged."
  }
];

const SkillCategory = ({ name, description }) => (
  <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
    <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default function SimpleSkills() {
  return (
    <section className="bg-darkBlueLight py-5">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4">What Im Usually upto</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {skillCategories.map((category, index) => (
            <SkillCategory key={index} {...category} />
          ))}
        </div>
        <div className="text-center">
          <Link href="/what-i-can-do">
              <AnimatedButton>View All Interests</AnimatedButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

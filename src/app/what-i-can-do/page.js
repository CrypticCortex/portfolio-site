"use client";
import React from 'react';
import { motion } from 'framer-motion';
import CodeIcon from '@/components/icons/CodeIcon';
import NetworkIcon from '@/components/icons/NetworkIcon';
import TypeIcon from '@/components/icons/TypeIcon';
import WindIcon from '@/components/icons/WindIcon';
import AiIcon from '@/components/icons/AiIcon';

const skillCategories = [
  {
    name: "Languages",
    skills: [
      { name: "Python", icon: CodeIcon, color: "#3776AB", level: 90 },
      { name: "Java", icon: CodeIcon, color: "#007396", level: 75 },
      { name: "Dart", icon: CodeIcon, color: "#276DC3", level: 75 },
    ]
  },
  {
    name: "ML/AI Frameworks",
    skills: [
      { name: "TensorFlow", icon: AiIcon, color: "#FF6F00", level: 85 },
      { name: "PyTorch", icon: AiIcon, color: "#EE4C2C", level: 80 },
      { name: "Keras", icon: AiIcon, color: "#D00000", level: 85 },
      { name: "Scikit-learn", icon: AiIcon, color: "#F7931E", level: 90 },
    ]
  },
  {
    name: "Data Processing",
    skills: [
      { name: "Pandas", icon: CodeIcon, color: "#150458", level: 90 },
      { name: "NumPy", icon: CodeIcon, color: "#013243", level: 85 },
      { name: "Dask", icon: AiIcon, color: "#FDA061", level: 30 },
    ]
  },
  {
    name: "Tools & Platforms",
    skills: [
      { name: "Flutter", icon: WindIcon, color: "#2496ED", level: 90 },
      { name: "Docker", icon: WindIcon, color: "#2496ED", level: 80 },
      { name: "Git", icon: TypeIcon, color: "#F05032", level: 85 },
      { name: "AWS", icon: NetworkIcon, color: "#FF9900", level: 80 },
      { name: "Google Cloud", icon: NetworkIcon, color: "#4285F4", level: 75 },
    ]
  },
  {
    name: "ML Tools & Libraries",
    skills: [
      { name: "MLflow", icon: AiIcon, color: "#0194E2", level: 80 },
      { name: "LiteLLm", icon: WindIcon, color: "#017CEE", level: 75 },
    ]
  },
  {
    name: "Special Interest",
    skills: [
      { name: "Computer Vision", icon: AiIcon, color: "#5C3EE8", level: 85 },
      { name: "NLP", icon: AiIcon, color: "#38B2AC", level: 80 },
      { name: "VLM", icon: AiIcon, color: "#38B2AC", level: 60 },

    ]
  },
];

const SkillCard = ({ name, icon: Icon, color, level }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${color}50` }}
    whileTap={{ scale: 0.95 }}
    className="rounded-lg p-3 text-center transition-all duration-300"
    style={{ 
      background: `linear-gradient(135deg, ${color}20, ${color}40)`,
      boxShadow: `0 4px 6px ${color}30`
    }}
  >
    <div className="flex items-center justify-center mb-2">
      <Icon className="h-8 w-8" style={{ color }} />
    </div>
    <h3 className="text-sm font-medium text-white mb-2">{name}</h3>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className="h-2.5 rounded-full" style={{ width: `${level}%`, backgroundColor: color }}></div>
    </div>
  </motion.div>
);

const SkillCategory = ({ name, skills }) => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-white">{name}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {skills.map((skill, index) => (
        <SkillCard key={index} {...skill} />
      ))}
    </div>
  </div>
);

export default function DetailedSkills() {
  return (
    <section className="bg-gradient-to-b from-darkBlue to-darkBlueLight py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Things that I would like to do & I can have a conversations with you on...            </p>
          </div>
          <motion.div 
            className="space-y-10"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <SkillCategory {...category} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import React from 'react';
import { motion } from 'framer-motion';

const educationData = [
  {
    degree: "B.Tech in Computer Science Engineering - Artificial Intelligence",
    institution: "Amrita University, Coimbatore, TN, India",
    duration: "2021 - 2025",
  },
  {
    degree: "Senior Secondary Education",
    institution: "Kamalavati Sr. Secondary CBSE School",
    duration: "2019 - 2021",
  }
];

const TimelineItem = ({ education }) => (
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="relative mb-8"
  >
    <div className="border-l-4 border-blue-500 pl-8 ml-6">
      <div className="absolute left-[-10px] top-0 w-6 h-6 rounded-full bg-blue-500"></div>
      <h3 className="text-lg font-semibold text-white">{education.degree}</h3>
      <p className="text-gray-400">{education.institution}</p>
      <p className="text-gray-400">{education.duration}</p>
      {education.cgpa && <p className="text-gray-400">CGPA: {education.cgpa}</p>}
    </div>
  </motion.div>
);

const Education = () => {
  return (
    <section className="bg-gradient-to-b from-darkBlue to-darkBlueLight py-16 min-h-screen flex flex-col justify-center items-center">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold text-white">Education</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Where I have been to
            </p>
          </div>
          <div className="relative space-y-10">
            {educationData.map((education, index) => (
              <TimelineItem key={index} education={education} />
            ))}
            <div className="absolute left-6 top-0 w-1 h-full bg-blue-500"></div> {/* Adjusted vertical line */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;

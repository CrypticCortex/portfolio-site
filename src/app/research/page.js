"use client";
import React from 'react';
import { motion } from 'framer-motion';
import ResearchIcon from '@/components/icons/ResearchIcon';

const researchCategories = [
    {
        name: "Research Experience (Works in Progress)",
        researches: [
          {
            title: "MultiView Material Classification",
            status: "~ Submitted"
          },
          {
            title: "Prompt Engineered GPT for HPI in ER Setting - A Prospective Study",
            status: "In Review"
          },
          {
            title: "Mitigating Gender Bias in VLMs and LLMs",
            status: "Underway"
          }
        ]
      }
    ];
    
    const ResearchCard = ({ title, description, tech, date, status, url }) => (
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: `0 0 15px #ffcc0040` }}
        whileTap={{ scale: 0.95 }}
        className="rounded-lg p-3 text-center transition-all duration-300"
        style={{ 
          background: `linear-gradient(135deg, #ffcc0020, #ffcc0040)`,
          boxShadow: `0 4px 6px #ffcc0030`
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <ResearchIcon className="h-8 w-8" style={{ color: "#ffcc00" }} />
        </div>
        <h3 className="text-sm font-medium text-white mb-2">{title}</h3>
        {description && <p className="text-xs text-gray-400 mb-2">{description}</p>}
        {tech && <p className="text-xs text-gray-400 mb-2">Tech Used: {tech}</p>}
        {date && <p className="text-xs text-gray-400 mb-2">{date}</p>}
        {status && <p className="text-xs text-gray-400 mb-2">Status: {status}</p>}
        {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400">View Project</a>}
      </motion.div>
    );
    
    const ResearchCategory = ({ name, researches }) => (
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white text-center">{name}</h3> {/* Center the category title */}
        <div className="flex flex-wrap justify-center gap-4"> {/* Center the cards */}
          {researches.map((research, index) => (
            <ResearchCard key={index} {...research} />
          ))}
        </div>
      </div>
    );
    
    export default function DetailedResearch() {
      return (
        <section className="bg-gradient-to-b from-darkBlue to-darkBlueLight py-16 flex flex-col justify-center items-center"> {/* Center the content */}
          <div className="container mx-auto max-w-6xl px-4 py-16"> {/* Add padding for top and bottom space */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              <div className="text-center space-y-2">
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Some of the research works I have been involved in so far.
                </p>
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
                {researchCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <ResearchCategory {...category} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      );
    }
'use client';
import ProjectCard from "./ProjectCard";
import { useScroll, useSpring } from 'framer-motion';

export default function FeaturedProjects() {
  const { scrollYProgress } = useScroll();
  const smoothScrollYProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const projects = [
    {
      title: "Image Text Line Detection and Bounding Box Creation",
      description: "This script processes an input image, applies Gabor filters to detect text lines, and creates bounding boxes around the detected text lines. The resulting modified image is saved with the bounding boxes, and bounding box coordinates are stored in a JSON file.",
      image: "/gabor.png",
      url: "https://github.com/AghoraGuru/Gabor-Bounding-Box"
    },
    {
      title: "Image Upscaling with OpenVINO",
      description: "Enhancing image quality has never been easier with this interactive web application. Low-resolution images are upscaled using a pre-trained OpenVINO model to create stunning high-resolution versions.",
      image: "https://www.researchgate.net/publication/360482913/figure/fig2/AS:1154026754322434@1652152827757/The-modified-ESRGAN-architecture-is-used-in-the-proposed-super-resolution-model-Several.png",
      url: "https://github.com/AghoraGuru/Image-Upscaling-with-OpenVINO"
    },
    {
      title: "BubbleDiary",
      description: "Diary app reImagined! Biometric Authenticated, Uniquely crafted Diary app which stores your daily dairies at cloud (again secure :)).",
      image: "https://github.com/CrypticCortex/BubbleDiary/assets/152802887/3205363b-f4a4-4cda-b57f-b45aba795964",
      url: "https://github.com/CrypticCortex/BubbleDiary"
    },
    {
      title: "MedGPT - Medical Android App",
      description: "An flutter app which was used to facilitate research @ AIMS Kochi. The app was used to facilitate continuous dialogues, diagnoses, and treatment planning.",
      url: "https://www.kommunicate.io/blog/wp-content/uploads/2022/12/10-Best-Chatbot-Apps-for-Android-and-iOS.png"
    },
  ];

  return (
    <section className="py-5 px-2 md:px-2 bg-gradient-featured">
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gradientStart to-gradientEnd">
              Some things which I have worked on and felt good
            </h2>
          </div>
          <div className="relative">
            {projects.map((project, i) => {
              const targetScale = 1 - ((projects.length - i) * 0.05);
              return (
                <ProjectCard 
                  key={i} 
                  {...project} 
                  scrollYProgress={smoothScrollYProgress} 
                  range={[i * 0.25, 1]} 
                  targetScale={targetScale} 
                  index={i}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

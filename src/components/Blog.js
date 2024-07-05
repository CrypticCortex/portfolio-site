// src/components/Blog.js

import { BlogCard } from "@/components/ui/BlogCard";

const blogPosts = [
  {
    image: "https://aghoraguru.github.io/assets/img/Pycaret/banner.png",
    title: "The Lazy Person's Guide to Machine Learning",
    description: "In this blog post, we will demonstrate the key features of PyCaret on the telecom_custom_churn dataset, a classic binary classification problem in the telecom industry.",
    date: "Published on April 11, 2023",
    url: "https://aghoraguru.github.io/2023/04/11/PyCaret-The-Lazy-Person's-Guide-to-Machine-Learning.html",
  },
  {
    image: "https://aghoraguru.github.io/assets/img/MandelBrot/MandelBrotBanner.webp",
    title: "MandleBrot Set",
    description:"Making MandelBrot-Set with Excel.    ",
    date: "Published on February 2, 2023",
    url: "https://aghoraguru.github.io/2023/02/02/MandleBrot_Set.html",
  },
  
];

export default function Blog({ scrollYProgress }) {
  return (
    <section className="py-12 md:py-10 bg-gradient-inverted">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-2">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight ">Blogs</h2>
            <p className="text-xl">Its been a while since I wrote but still these are the things</p>
          </div>
          <div className="sticky top-0 grid grid-cols-1 gap-6">
            {blogPosts.map((post, index) => {
              const targetScale = 1 - ((blogPosts.length - index) * 0.05);
              return (
                <BlogCard 
                  key={index} 
                  {...post} 
                  scrollYProgress={scrollYProgress} 
                  range={[index * .25, 1]} 
                  targetScale={targetScale} 
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

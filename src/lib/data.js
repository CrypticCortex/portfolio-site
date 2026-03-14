// Centralized portfolio data -- single source of truth for all sections + terminal

export const meta = {
  name: "M. Kalyana Sundaram",
  alias: "kalyan",
  role: "Software Engineer I",
  company: "Guidewire",
  location: "Bangalore, IN",
  email: "kalyanguru18@gmail.com",
  github: "https://github.com/CrypticCortex",
  linkedin: "https://linkedin.com/in/crypticcortex",
  bio: "Software Engineer I at Guidewire. Previously research intern at IISc Bangalore. I build agentic systems, ship automation tools, and occasionally publish papers -- 5 published, 1 underway.",
};

export const experiences = [
  {
    role: "Software Engineer I",
    company: "Guidewire",
    period: "Feb 2025 -- present",
    hash: "a3f8b2c",
    head: true,
    points: [
      "Building client-facing insurance templates with Jutro (React-based)",
      "Designed internal automation tools -- Slack bot for tech talks, drumbeat generator -- all with LLMs as the intelligence layer",
      "Led React knowledge sharing sessions and delivered a Tech Talk on AI Agents & MCPs",
    ],
  },
  {
    role: "Research Intern",
    company: "IISc Bangalore",
    period: "Sep 2024 -- Jan 2025",
    hash: "7e2d1f0",
    points: [
      "Built deep learning models for underwater object detection using VLMs on Side-Scan Sonar imagery",
      "Co-authored and published TRAM: Transformer-Based Mask R-CNN for sonar data",
    ],
  },
  {
    role: "AI/ML Intern",
    company: "Hexon Global",
    period: "May 2024 -- Aug 2024",
    hash: "b91c4a3",
    points: [
      "Built an LLM-based SaaS product on AWS, cut API costs 20% through smart decision points",
    ],
  },
  {
    role: "Student Researcher",
    company: "Amrita University",
    period: "Jul 2023 -- Jul 2024",
    hash: "d5f0e82",
    points: [
      "Built MedGPT for AIMS Kochi Hospital -- boosted diagnostic accuracy from 30% to 80%",
      "Researched RAG techniques, co-authored papers on video conferencing architecture",
    ],
  },
];

export const projects = [
  {
    title: "GraphMaker",
    desc: "LLM-powered graph maker. Scrapes top SEO links, crunches data, visualizes insights.",
    tech: ["Next.js", "OpenAI", "Azure"],
    featured: true,
  },
  {
    title: "MedGPT",
    desc: "GPT-based diagnostic app deployed at AIMS Kochi Hospital. Multi-agent AI, boosted accuracy from 30% to 80%.",
    tech: ["Flutter", "OpenAI", "AWS", "Redis"],
  },
  {
    title: "SheLaw",
    desc: "Legal assistance platform for women. RAG with multi-query retrieval over legal documents.",
    tech: ["Flutter", "LangChain", "LangGraph"],
    url: "https://github.com/CrypticCortex/shelawbackend",
  },
  {
    title: "VyaparSahayak",
    desc: "Agentic AI for FMCG distributors. Dead stock detection, cross-territory reallocation.",
    tech: ["TypeScript", "Agentic AI"],
    url: "https://github.com/CrypticCortex/VyaparSahayak",
  },
  {
    title: "VoiceAI",
    desc: "Automated customer interactions -- product explanations, event registration. Integrated with Indian IVR systems.",
    tech: ["Python", "TTS", "WebSockets"],
  },
  {
    title: "Pickup Buddy",
    desc: "Campus delivery platform. Students request deliveries, runners pick them up.",
    tech: ["FastAPI", "Supabase", "Next.js"],
  },
];

export const papers = [
  { id: 1, title: "TRAM: Transformer-Based Mask R-CNN for Underwater Object Detection in Side-Scan Sonar Data", venue: "IISc Bangalore", year: 2024, status: "Published" },
  { id: 2, title: "MedFlorence2: Fine-tuning Small VLMs for Medical Question Answering", venue: "Amrita University", year: 2024, status: "Published" },
  { id: 3, title: "MultiView Material Classification", venue: "Amrita University", year: 2024, status: "Published" },
  { id: 4, title: "Estimation of Chronic Academic Stress using Short Form Video Contents", venue: "Amrita University", year: 2024, status: "Published" },
  { id: 5, title: "Early Detection of Cerebral Palsy in Children with GAIT", venue: "Amrita University", year: 2024, status: "Published" },
  { id: 6, title: "Gender Bias Mitigation in LLMs", venue: "Amrita University", year: 2026, status: "Underway" },
];

export const skillCategories = [
  {
    key: "agentic-systems",
    desc: "Building multi-step AI agents with LangGraph and LangChain that actually do useful work -- job hunting, scheduling, document analysis.",
  },
  {
    key: "backend-apis",
    desc: "FastAPI, PostgreSQL, REST APIs. Most of what I build has a Python backend talking to a database somewhere.",
  },
  {
    key: "rag-pipelines",
    desc: "Retrieval-augmented generation for when you need an LLM that actually knows things. Multi-query retrieval, document chunking.",
  },
  {
    key: "frontend",
    desc: "Flutter for mobile, Next.js and React for web. I like shipping things people can actually use.",
  },
];

export const achievements = [
  { text: "1st place -- TFUG x Kaggle Hackathon", year: "2023", tag: "AWARD" },
  { text: "2nd place -- Gender x GenAI Hackathon", year: "2025", tag: "AWARD" },
  { text: "6th place -- Idea Ignite Hackathon (Codebyte)", year: "2024", tag: "AWARD" },
  { text: "Co-led ML Bootcamp with 500+ participants", year: "2024", tag: "EVENT" },
  { text: "Event Organizer & Panelist @ DevSummit 2025", year: "2025", tag: "EVENT" },
  { text: "Guidewire Certified Associate -- Jutro Developer", year: "2025", tag: "CERT" },
];

export const education = {
  degree: "B.Tech Computer Science & Engineering (AI)",
  school: "Amrita Vishwa Vidyapeetham",
  cgpa: "7.95",
  year: "2021 -- 2025",
};

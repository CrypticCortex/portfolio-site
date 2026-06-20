// Centralized portfolio data -- single source of truth for all sections + terminal

export const meta = {
  name: "M. Kalyana Sundaram",
  alias: "kalyan",
  role: "AI Engineer",
  company: "Guidewire",
  location: "Bangalore, IN",
  email: "kalyanguru18@gmail.com",
  github: "https://github.com/CrypticCortex",
  linkedin: "https://linkedin.com/in/crypticcortex",
  tagline: "I build AI systems that think, remember, and ship to production.",
  bio: "AI engineer at Guidewire. IISc Bangalore research alum. I build agent architectures, cognitive tools, and things that work for real users -- 5 published papers, 30+ custom AI skills, and a knowledge graph that remembers what I forget.",
};

// Hero section copy (was hardcoded in page.js)
export const hero = {
  words: ["AI Engineer.", "Researcher.", "Builder."],
  tagline: [
    "research papers before graduation, production AI after --",
    "I build systems that think, remember, and ship.",
    "everything else is configuration.",
  ],
};

// Experience section intro (was hardcoded in page.js)
export const experienceIntro =
  "5 published papers, then production AI at Guidewire -- voice agents, claim summarizers, knowledge graphs. I build things that work for real users, not things that work in demos.";

// Contact section copy (was hardcoded in page.js)
export const contact = {
  heading: "Let's build something.",
};

export const experiences = [
  {
    role: "AI Engineer",
    company: "Guidewire",
    period: "Feb 2025 -- present",
    hash: "a3f8b2c",
    head: true,
    points: [
      "Cut LLM claim-summarization latency materially by tracing every capture point end to end and slimming payloads",
      "Built a multi-judge LLM eval framework: 5 judge models across 5 families, 5 metrics per field, 95% confidence intervals, automated HTML reports",
      "Shipped a production claim-summarization agent end to end -- data model, persistence, sync REST API, event-trigger wiring",
      "Built a stateful Slack-to-ServiceNow scheduling agent, then took the LLM out of the booking path -- a deterministic FSM replaced a stall-prone LLM step so irreversible actions can't misfire",
      "Range: real-time voice claims-intake prototype, a voice MCP capability merged into the developer platform, and a team-adopted AI-engineering competency framework",
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
      "Cut LLM API cost ~20% on a production SaaS (AWS) by batching and right-sizing model calls instead of one large request per task",
    ],
  },
  {
    role: "Student Researcher",
    company: "Amrita University",
    period: "Jul 2023 -- Jul 2024",
    hash: "d5f0e82",
    points: [
      "Built MedGPT -- diagnostic AI deployed at AIMS Kochi Hospital, improved accuracy from 30% to 80%",
      "Co-authored 4 research papers across medical AI, computer vision, and NLP",
    ],
  },
];

export const projects = [
  {
    title: "agam",
    desc: "Published open-source memory system for AI coding agents. Built on a contrarian bet: proactively inject relevant context instead of retrieving it on demand. Sole author and maintainer, 300+ tests.",
    tech: ["Python", "MCP", "SQLite FTS5"],
    url: "https://github.com/CrypticCortex/agam",
    featured: true,
  },
  {
    title: "Cognitive OS",
    desc: "The private system agam is distilled from. Multi-agent setup on Claude Code: 30+ custom skills, 14 specialized agents, SQLite knowledge graph with 400+ entities, session hooks, and memory that persists across conversations.",
    tech: ["Claude Code", "Python", "SQLite FTS5", "MCP"],
    featured: false,
  },
  {
    title: "Voice FNOL",
    desc: "Voice-based insurance claim intake. Parallel LLM pipeline (conversation + extraction), local STT via mlx-whisper, on-device TTS, 3D audio-reactive visualizer.",
    tech: ["TypeScript", "Fastify", "Claude API", "Three.js"],
    featured: true,
  },
  {
    title: "MedGPT",
    desc: "Diagnostic AI deployed at AIMS Kochi Hospital. Improved accuracy from 30% to 80% across clinical workflows.",
    tech: ["Flutter", "OpenAI", "AWS", "Redis"],
  },
  {
    title: "VoiceAI",
    desc: "Automated customer interactions -- product explanations, event registration. Integrated with Indian IVR systems.",
    tech: ["Python", "TTS", "WebSockets"],
  },
  {
    title: "Kanaku",
    desc: "AI-powered dead stock management for FMCG distributors. 221 real products, 74 stores, statistical ML scoring, WhatsApp integration. Deployed on EC2.",
    tech: ["Next.js", "Prisma", "Gemini", "pgvector"],
    url: "https://github.com/CrypticCortex/VyaparSahayak",
  },
  {
    title: "JobScrapper",
    desc: "AI job matching pipeline. Two-layer scoring (heuristic + semantic), automated scraping, email alerts for subscribers.",
    tech: ["Python", "Next.js", "OpenAI", "Neon Postgres"],
  },
  {
    title: "SheLaw",
    desc: "Legal assistance platform for women. RAG with multi-query retrieval over legal documents.",
    tech: ["Flutter", "LangChain", "LangGraph"],
    url: "https://github.com/CrypticCortex/shelawbackend",
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

export const capabilities = [
  {
    title: "Agent Architectures",
    desc: "Multi-agent orchestration, tool use, memory, voice pipelines. LangGraph, agent SDK, Claude Code agents.",
  },
  {
    title: "AI Evaluation & Quality",
    desc: "Eval frameworks, prompt versioning, LLM-as-judge, CI/CD for agents. promptfoo, eval harness, 37/37 adaptive scenarios.",
  },
  {
    title: "Enterprise AI Integration",
    desc: "MCP servers, enterprise knowledge search, insurance claim processing. enterprise search, InsuranceNow, ClaimsCenter APIs.",
  },
  {
    title: "Cognitive Tooling",
    desc: "Knowledge graph (400+ entities), 30+ custom skills, session hooks, persistent memory. Systems engineering for thinking.",
  },
  {
    title: "Research to Production",
    desc: "5 published papers, then shipped to real hospitals and real users. IISc Bangalore, AIMS Kochi, Amrita University.",
  },
  {
    title: "Workshops & Enablement",
    desc: "agent-building workshop (3 agent types), AI Agents & MCPs tech talk, ML Bootcamp co-lead (500+ participants).",
  },
];

export const skillCategories = [
  {
    key: "agent-architectures",
    desc: "Multi-agent systems with tool use, memory, and orchestration. Built 14 specialized agents and a knowledge graph that tracks 400+ entities across projects.",
  },
  {
    key: "production-ai",
    desc: "LLM eval frameworks, prompt versioning, voice AI pipelines, RAG with pgvector. Systems that handle real insurance claims and real hospital diagnostics.",
  },
  {
    key: "full-stack",
    desc: "Python (FastAPI, Django) and TypeScript (Next.js, Fastify). Most things I build have a backend talking to a database and a frontend someone actually uses.",
  },
  {
    key: "tooling",
    desc: "MCP servers, CLI tools, automation bots, Claude Code skills. I build the tools I wish existed, then use them daily.",
  },
];

// Skill tag cloud (was hardcoded in page.js)
export const skills = [
  "Python", "TypeScript", "JavaScript", "SQL",
  "React", "Next.js", "Fastify", "Flutter", "Tailwind",
  "FastAPI", "Node.js", "PostgreSQL", "Redis", "Prisma",
  "Claude Code", "MCP", "LangGraph", "OpenAI", "RAG",
  "SQLite FTS5", "pgvector", "mlx-whisper",
  "PyTorch", "HuggingFace", "Transformers",
  "AWS", "Vercel", "Docker", "Kubernetes",
  "Git", "Linux", "Three.js", "Framer Motion",
];

export const achievements = [
  { text: "1st place -- TFUG x Kaggle Hackathon", year: "2023", tag: "AWARD" },
  { text: "2nd place -- Gender x GenAI Hackathon", year: "2025", tag: "AWARD" },
  { text: "6th place -- Idea Ignite Hackathon (Codebyte)", year: "2024", tag: "AWARD" },
  { text: "Co-led ML Bootcamp with 500+ participants", year: "2024", tag: "EVENT" },
  { text: "Event Organizer & Panelist @ DevSummit 2025", year: "2025", tag: "EVENT" },
  { text: "Guidewire Certified Associate -- Jutro Developer", year: "2025", tag: "CERT" },
];

export const papersSummary = "5 published papers across computer vision, NLP, and medical AI. Research at IISc Bangalore and Amrita University.";

export const education = {
  degree: "B.Tech Computer Science & Engineering (AI)",
  school: "Amrita Vishwa Vidyapeetham",
  cgpa: "7.95",
  year: "2021 -- 2025",
};

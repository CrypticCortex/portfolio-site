// Content mirrors https://crypticcortex.vercel.app (checked 2026-10-03).
export const profile = {
  name: 'Kalyan',
  native: 'कल्याण',
  title: 'AI Engineer',
  tagline: ['AI Engineer.', 'Researcher.', 'Builder.'],
  bio: 'research papers before graduation, production AI after — I build systems that think, remember, and ship. everything else is configuration.',
  location: 'Bangalore, IN',
  email: 'kalyanguru18@gmail.com',
  github: 'https://github.com/CrypticCortex',
  linkedin: 'https://linkedin.com/in/crypticcortex',
};

export const experience = [
  { role: 'AI Engineer', org: 'Guidewire', when: 'Feb 2025 – present', points: [
    'Reduced LLM claim-summarization latency through end-to-end payload optimization.',
    'Developed a multi-judge LLM evaluation framework (5 models, 5 metrics per field, 95% confidence intervals).',
    'Shipped a production claim-summarization agent with data model, persistence and REST API.',
    'Built a production event-scheduling agent (LangGraph workflow with Slack, ServiceNow, room booking).',
    'Delivered a real-time voice claims-intake prototype and a voice MCP capability.',
  ] },
  { role: 'Research Intern', org: 'IISc Bangalore', when: 'Sep 2024 – Jan 2025', points: [
    'Built deep learning models for underwater object detection using VLMs on sonar imagery.',
    'Co-authored the TRAM paper on transformer-based Mask R-CNN for sonar data.',
  ] },
  { role: 'AI/ML Intern', org: 'Hexon Global', when: 'May 2024 – Aug 2024', points: ['Reduced LLM API costs by about 20% through model-call optimization.'] },
  { role: 'Student Researcher', org: 'Amrita University', when: 'Jul 2023 – Jul 2024', points: [
    'Developed MedGPT diagnostic AI (accuracy improved from 30% to 80%).',
    'Co-authored 4 research papers across medical AI, computer vision and NLP.',
  ] },
];

export const competencies = [
  ['Agent architectures', 'Multi-agent orchestration, tool integration, memory systems and voice pipelines with LangGraph, MCP and Claude Code agents.'],
  ['AI evaluation & quality', 'Evaluation frameworks, prompt versioning, LLM-as-judge, CI/CD for agents with confidence intervals and rubrics.'],
  ['Enterprise AI integration', 'MCP servers, knowledge search, insurance claim processing, ClaimCenter and InsuranceNow integrations.'],
  ['Cognitive tooling', 'A knowledge graph of 400+ entities, 30+ custom skills and persistent memory systems.'],
  ['Research to production', 'Five published papers deployed across hospitals and enterprise users.'],
  ['Workshops & enablement', 'Agent-building workshops, talks on AI agents & MCPs, ML Bootcamp co-leadership (500+ participants).'],
];

export const projects = [
  { name: 'agam', featured: true, url: 'https://github.com/CrypticCortex/agam', blurb: 'Open-source memory system for AI coding agents — proactively injects relevant context instead of retrieving it on demand. 300+ tests, sole author and maintainer.', stack: ['Python', 'MCP', 'SQLite FTS5'] },
  { name: 'Voice FNOL', featured: true, blurb: 'Voice-based insurance claim intake: a parallel LLM pipeline (conversation + extraction), local STT, on-device TTS and a 3D audio-reactive visualizer.', stack: ['TypeScript', 'Fastify', 'Claude API', 'Three.js'] },
  { name: 'Cognitive OS', blurb: 'Multi-agent Claude Code setup with 30+ custom skills and 14 specialized agents, a SQLite knowledge graph of 400+ entities, session hooks and persistent memory.', stack: ['Claude Code', 'Python', 'SQLite FTS5', 'MCP'] },
  { name: 'MedGPT', blurb: 'Diagnostic AI deployed at AIMS Kochi Hospital; accuracy improved from 30% to 80%.', stack: ['Flutter', 'OpenAI', 'AWS', 'Redis'] },
  { name: 'Kanaku', url: 'https://github.com/CrypticCortex/VyaparSahayak', blurb: 'AI-powered dead-stock management for FMCG distributors — 221 real products, 74 stores, statistical ML scoring and WhatsApp integration.', stack: ['Next.js', 'Prisma', 'Gemini', 'pgvector'] },
  { name: 'SheLaw', url: 'https://github.com/CrypticCortex/shelawbackend', blurb: 'Legal assistance platform for women using RAG with multi-query retrieval.', stack: ['Flutter', 'LangChain', 'LangGraph'] },
  { name: 'JobScrapper', blurb: 'AI job matching with two-layer scoring (heuristic + semantic), automated scraping and email alerts.', stack: ['Python', 'Next.js', 'OpenAI', 'Neon Postgres'] },
  { name: 'VoiceAI', blurb: 'Automated customer interactions — product explanations and event registration — integrated with Indian IVR systems.', stack: ['Python', 'TTS', 'WebSockets'] },
];

export const publications = [
  ['TRAM: Transformer-Based Mask R-CNN for Underwater Object Detection in Side-Scan Sonar Data', 'IISc Bangalore', '2024'],
  ['MedFlorence2: Fine-tuning Small VLMs for Medical Question Answering', 'Amrita University', '2024'],
  ['MultiView Material Classification', 'Amrita University', '2024'],
  ['Estimation of Chronic Academic Stress using Short Form Video Contents', 'Amrita University', '2024'],
  ['Early Detection of Cerebral Palsy in Children with GAIT', 'Amrita University', '2024'],
  ['Gender Bias Mitigation in LLMs', 'Amrita University', 'Underway, 2026'],
];

export const stack = [
  ['Languages', ['Python', 'TypeScript', 'JavaScript', 'SQL']],
  ['Frameworks', ['React', 'Next.js', 'Fastify', 'FastAPI', 'Flask', 'LangGraph']],
  ['Databases', ['PostgreSQL', 'Redis', 'SQLite FTS5', 'pgvector']],
  ['AI / ML', ['PyTorch', 'Hugging Face Transformers', 'RAG', 'Claude Code', 'MCP']],
  ['Frontend', ['React', 'Next.js', 'Tailwind', 'Framer Motion', 'Three.js', 'Flutter']],
  ['Infrastructure', ['AWS', 'Vercel', 'Docker', 'Kubernetes', 'Linux']],
  ['Tools', ['Git', 'MCP servers', 'CLI automation']],
];

export const achievements = [
  ['1st place', 'TFUG x Kaggle Hackathon', '2023'],
  ['2nd place', 'Gender x GenAI Hackathon', '2025'],
  ['6th place', 'Idea Ignite Hackathon / Codebyte', '2024'],
  ['Organizer & panelist', 'DevSummit', '2025'],
  ['Co-led ML Bootcamp', '500+ participants', '2024'],
  ['Certified', 'Guidewire Certified Associate, Jutro Developer', '2025'],
];

export const education = [
  { degree: 'B.Tech Computer Science & Engineering (AI)', institution: 'Amrita Vishwa Vidyapeetham', duration: '2021 – 2025' },
];

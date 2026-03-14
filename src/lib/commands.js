// Terminal command handler -- processes user input and returns output strings

import { meta, projects, papers, skillCategories, education } from "./data";


function formatHelp() {
  const commands = [
    ["help", "list available commands"],
    ["about", "who am i"],
    ["projects", "things i've built"],
    ["research", "published papers"],
    ["skills", "what i work with"],
    ["education", "degree info"],
    ["contact", "reach me"],
    ["ls", "list directories"],
    ["cat resume.pdf", "download resume"],
    ["whoami", "who are you"],
    ["history", "command history"],
    ["clear", "clear terminal"],
    ["pwd", "current directory"],
    ["date", "current date/time"],
    ["echo [args]", "print text"],
  ];

  const lines = commands.map(([cmd, desc]) => {
    return `  ${cmd.padEnd(18)} ${desc}`;
  });

  return ["available commands:", "", ...lines];
}


function formatAbout() {
  return [
    `${meta.name} (${meta.alias})`,
    `${meta.role} @ ${meta.company}`,
    `${meta.location}`,
    "",
    meta.bio,
  ];
}


function formatProjects() {
  const lines = projects.map((p) => {
    return `  ${p.title.padEnd(20)} ${p.desc.split(".")[0]}`;
  });
  return ["projects:", "", ...lines];
}


function formatResearch() {
  const lines = papers.map((p) => {
    const tag = p.status === "Published" ? "[published]" : "[underway]";
    return `  ${tag.padEnd(14)} ${p.title}`;
  });
  return ["research papers:", "", ...lines];
}


function formatContact() {
  return [
    "contact:",
    "",
    `  email       ${meta.email}`,
    `  github      ${meta.github}`,
    `  linkedin    ${meta.linkedin}`,
  ];
}


function formatSkills() {
  const lines = skillCategories.map((s) => {
    return `  ${s.key.padEnd(20)} ${s.desc.split(".")[0]}`;
  });
  return ["skill areas:", "", ...lines];
}


function formatEducation() {
  return [
    "education:",
    "",
    `  ${education.degree}`,
    `  ${education.school}`,
    `  CGPA: ${education.cgpa} | ${education.year}`,
  ];
}


function formatLs() {
  return ["about/  work/  research/  projects/  skills/  contact/"];
}


export function processCommand(input, history) {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // empty input
  if (!trimmed) {
    return [""];
  }

  // exact matches first
  if (lower === "help") return formatHelp();
  if (lower === "about") return formatAbout();
  if (lower === "projects") return formatProjects();
  if (lower === "research") return formatResearch();
  if (lower === "contact") return formatContact();
  if (lower === "skills") return formatSkills();
  if (lower === "education") return formatEducation();
  if (lower === "clear") return ["__CLEAR__"];
  if (lower === "ls") return formatLs();
  if (lower === "cat resume.pdf") return ["Download: https://resume.kalyan.dev/resume.pdf"];
  if (lower === "whoami") return ["visitor"];
  if (lower === "history") return ["__HISTORY__"];
  if (lower === "sudo rm -rf /") return ["nice try."];
  if (lower === "vim") return ["real ones use neovim."];
  if (lower === "emacs") return ["ctrl+x ctrl+c to exit... oh wait, you can never leave."];
  if (lower === "pwd") return ["/home/kalyan/portfolio"];
  if (lower === "date") return [new Date().toString()];

  // echo with args
  if (lower.startsWith("echo ")) {
    return [trimmed.slice(5)];
  }
  if (lower === "echo") {
    return [""];
  }

  // unknown command
  const cmd = trimmed.split(" ")[0];
  return [`command not found: ${cmd}. Type 'help' for available commands.`];
}

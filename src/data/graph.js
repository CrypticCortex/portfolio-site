// The site is a map of how Kalyan's work connects. Every node and edge comes from profile.js;
// the only additions are the themes (named after his competencies) and which work belongs to which theme.
import { profile, experience, projects, publications, competencies } from './profile';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// short labels for long paper titles (the full title shows in the panel)
const paperLabel = {
  'TRAM: Transformer-Based Mask R-CNN for Underwater Object Detection in Side-Scan Sonar Data': 'TRAM',
  'MedFlorence2: Fine-tuning Small VLMs for Medical Question Answering': 'MedFlorence2',
  'MultiView Material Classification': 'MultiView',
  'Estimation of Chronic Academic Stress using Short Form Video Contents': 'Academic stress',
  'Early Detection of Cerebral Palsy in Children with GAIT': 'Cerebral palsy',
  'Gender Bias Mitigation in LLMs': 'Gender bias',
};

const themes = [
  ['agents', 'Agents', 'Agent architectures'],
  ['evals', 'Evals', 'AI evaluation & quality'],
  ['memory', 'Memory', 'Cognitive tooling'],
  ['enterprise', 'Insurance AI', 'Enterprise AI integration'],
  ['research', 'Research', 'Research to production'],
  ['teaching', 'Teaching', 'Workshops & enablement'],
  ['voice', 'Voice', null],
  ['medical', 'Medical AI', null],
  ['vision', 'Vision', null],
];

// which theme each piece of work sits under (from the work's own description)
const belongs = {
  agam: ['memory', 'agents'],
  'Voice FNOL': ['voice', 'enterprise'],
  'Cognitive OS': ['agents', 'memory'],
  MedGPT: ['medical'],
  Kanaku: ['agents'],
  SheLaw: ['agents'],
  JobScrapper: ['agents'],
  VoiceAI: ['voice'],
  Guidewire: ['agents', 'evals', 'enterprise', 'voice'],
  'IISc Bangalore': ['vision', 'research'],
  'Hexon Global': ['agents'],
  'Amrita University': ['research', 'medical'],
  TRAM: ['vision'],
  MedFlorence2: ['medical', 'vision'],
  MultiView: ['vision'],
  'Academic stress': ['research'],
  'Cerebral palsy': ['medical'],
  'Gender bias': ['research'],
};

// tools get a node when some project names them in its stack
const toolsUsed = [...new Set(projects.flatMap((p) => p.stack))];

export function buildGraph() {
  const nodes = [], edges = [], byId = {};
  const add = (n) => { byId[n.id] = n; nodes.push(n); return n; };
  const link = (a, b) => { if (byId[a] && byId[b] && a !== b) edges.push([a, b]); };

  add({ id: 'kalyan', type: 'self', label: profile.name, native: profile.native });
  for (const [id, label, comp] of themes) {
    const c = competencies.find(([name]) => name === comp);
    add({ id, type: 'theme', label, text: c ? c[1] : null });
    link('kalyan', id);
  }
  for (const e of experience) {
    add({ id: slug(e.org), type: 'role', label: e.org, role: e.role, when: e.when, points: e.points });
    link('kalyan', slug(e.org));
    (belongs[e.org] || []).forEach((t) => link(slug(e.org), t));
  }
  for (const p of projects) {
    add({ id: slug(p.name), type: 'project', label: p.name, text: p.blurb, stack: p.stack, url: p.url });
    (belongs[p.name] || []).forEach((t) => link(slug(p.name), t));
  }
  link('medgpt', 'amrita-university'); // "Developed MedGPT diagnostic AI" is listed under Amrita
  for (const [title, org, when] of publications) {
    const label = paperLabel[title] || title;
    add({ id: slug(label), type: 'paper', label, title, org, when });
    link(slug(label), slug(org));
    (belongs[label] || []).forEach((t) => link(slug(label), t));
  }
  for (const tool of toolsUsed) {
    add({ id: 't-' + slug(tool), type: 'tool', label: tool });
    for (const p of projects) if (p.stack.includes(tool)) link('t-' + slug(tool), slug(p.name));
  }
  return { nodes, edges, byId };
}

// Trains of thought the map plays by itself when left alone: a path along existing edges, and one sentence.
// {Braces} mark a word on the map; the sentence shows it in that word's colour.
export const thoughts = [
  [['kalyan', 'guidewire', 'evals'], 'At {Guidewire} I build agents, and the multi-judge {evals} that decide whether they are good enough.'],
  [['memory', 'agam', 't-mcp'], '{agam} gives coding agents a {memory}: it injects context before they think to ask.'],
  [['iisc-bangalore', 'tram', 'vision'], 'At {IISc}: transformers that find objects in side-scan sonar.'],
  [['amrita-university', 'medgpt', 'medical'], '{MedGPT} went into AIMS Kochi; diagnostic accuracy went from 30% to 80%.'],
  [['voice', 'voice-fnol', 't-three-js'], '{Voice FNOL}: file an insurance claim by just saying what happened.'],
  [['agents', 'cognitive-os', 't-claude-code'], '{Cognitive OS}: 14 agents and 30+ skills around a knowledge graph of 400+ entities.'],
  [['kalyan', 'hexon-global', 'agents'], 'At {Hexon}: about 20% off the LLM bill through model-call optimisation.'],
  [['agents', 'kanaku', 't-pgvector'], '{Kanaku} scores dead stock for FMCG distributors across 74 real stores.'],
  [['amrita-university', 'medflorence2', 'medical'], 'Five papers before graduating: {medical} VLMs, sonar, gait, stress, materials.'],
];

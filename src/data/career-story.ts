type ResearchCollection =
  | 'acceptedConferencePapers'
  | 'peerReviewedPublications'
  | 'conferenceAbstracts'

export type CareerEvidenceRef =
  | `experience:${string}`
  | `education:${string}`
  | `research:${ResearchCollection}:${string}`
  | `system:${string}`

export interface CareerStoryStage {
  id: string
  label: string
  evidence: string
  meaning: string
  references: readonly CareerEvidenceRef[]
}

export interface ArchitectureLayer {
  title: string
  description: string
  examples: string[]
}

export const northStarIdentity = 'AI Systems & Platform Engineer'

export const northStarStatement =
  'I build the production systems around AI and data, including applications, APIs, workflows, cloud infrastructure, security, evaluation, observability, and operational handoff.'

export const northStarValueProposition =
  'Turn AI and data capabilities into secure, deployable systems that hold up in production.'

export const canonicalSeoDescription =
  'David Braun is an AI Systems & Platform Engineer building secure, deployable applications, APIs, workflows, cloud infrastructure, and applied AI systems.'

export const professionalAvailability =
  'Open to select full-time AI systems and platform roles, architecture and engineering partnerships, and consulting engagements where software, cloud infrastructure, data, automation, and AI need to operate as one dependable system.'

export const synthesisBoundary =
  "AI Systems & Platform Engineer is David Braun's canonical professional positioning, not a retroactive employment title. Individual roles, projects, and research remain labeled by their recorded title and evidence maturity."

export const architectureLayers: ArchitectureLayer[] = [
  {
    title: 'AI & Data Capability',
    description:
      'Retrieval, grounded assistants, models, evaluation datasets, and data pipelines that support a defined operational need.',
    examples: ['Retrieval', 'Data pipelines', 'Evaluation'],
  },
  {
    title: 'Application & Workflow Layer',
    description:
      'Applications, APIs, queues, state, orchestration, review steps, and human handoff around the capability.',
    examples: ['Applications', 'APIs', 'Workflow orchestration'],
  },
  {
    title: 'Platform & Infrastructure',
    description:
      'Cloud services, deployment pipelines, persistence, networking, and environments that make delivery repeatable.',
    examples: ['Cloud', 'CI/CD', 'Persistence'],
  },
  {
    title: 'Security, Reliability & Evaluation',
    description:
      'Access boundaries, validation, tests, observability, refusal behavior, and failure handling that make limits visible.',
    examples: ['Security', 'Observability', 'Quality gates'],
  },
  {
    title: 'Operational Integration',
    description:
      'The handoffs, interfaces, documentation, and ownership model that connect a system to the people using it.',
    examples: ['Human handoff', 'Runbooks', 'Ongoing ownership'],
  },
]

type CareerStoryStageDefinition = readonly [
  id: string,
  label: string,
  evidence: string,
  meaning: string,
  references: readonly CareerEvidenceRef[],
]

const careerStoryStageDefinitions = [
  [
    'scientific-computational-foundation',
    'Scientific and computational foundation',
    "The Augsburg space-physics record includes magnetometer-data analysis for EMIC-wave and magnetospheric research, two 2017 AGU abstracts, and a collaborative 2018 JGR: Space Physics paper. That study incorporated radiation-belt measurements from REPT and MagEIS aboard NASA's Van Allen Probes.",
    'Evidence quality, reproducibility, and careful interpretation became part of the engineering approach from the beginning.',
    [
      'education:augsburg',
      'experience:space-physics',
      'research:conferenceAbstracts:emic-wave-events-agu-2017',
      'research:conferenceAbstracts:magnetic-impulse-events-agu-2017',
      'research:peerReviewedPublications:emic-wave-events',
    ],
  ],
  [
    'enterprise-software-systems',
    'Enterprise software systems',
    'Application and platform work expanded across e-commerce, React, Kotlin microservices, Kubernetes delivery, and modernization in large operating environments.',
    'The work grew from features into the interfaces, services, repositories, and delivery paths that make software operable at enterprise scale.',
    ['experience:graphic-systems', 'experience:target'],
  ],
  [
    'security-platform-engineering',
    'Security and platform engineering',
    'Work at GE Aerospace and Securian covered application security, API hardening, OpenShift, Ansible, AWS infrastructure, Kubernetes support, and workflow automation.',
    'Security, infrastructure, automation, and reliability became design inputs rather than post-build concerns.',
    ['experience:ge-aviation', 'experience:securian'],
  ],
  [
    'production-ownership',
    'End-to-end production ownership',
    'Founder and Principal Software Engineer work spans architecture, application development, infrastructure, deployment, security, and support. VIFG is the clearest public proof, live since 2020.',
    'Architecture decisions are tested against deployment, accessibility, maintenance, and the people responsible after launch.',
    ['experience:peoples-connection', 'system:vifg-nonprofit-platform'],
  ],
  [
    'ai-data-specialization',
    'AI and data specialization',
    'Graduate AI and Big Data study, accepted retrieval research, my lead implementation work on the collaborative WeatherForge academic project, and the bounded RAGeATM prototype extend the foundation into data engineering, grounding, evaluation, and refusal behavior.',
    'AI is treated as one capability inside a larger production system, with evidence and limits kept explicit.',
    [
      'education:ust',
      'research:acceptedConferencePapers:urarina-hybrid-retrieval',
      'system:weatherforge',
      'system:rageatm',
    ],
  ],
] as const satisfies readonly CareerStoryStageDefinition[]

export const careerStoryStages: CareerStoryStage[] =
  careerStoryStageDefinitions.map(([id, label, evidence, meaning, references]) => ({
    id,
    label,
    evidence,
    meaning,
    references,
  }))

export const fullTimeRoleFamilies = [
  'AI Systems & Platform Engineer',
  'AI Platform Engineer',
  'AI Systems Engineer',
  'Applied AI Engineer',
  'Platform / Solutions Architect',
  'Full-Stack & Platform Engineer',
  'Research Engineer - AI Systems',
  'Developer Productivity / Internal Platform Engineer',
]

export const consultingEngagements = [
  'AI and data workflow architecture',
  'Platform modernization',
  'System integration',
  'Retrieval and RAG architecture',
  'Cloud-backed automation',
  'Evaluation and reliability design',
  'Technical system review',
]

export const architectureSkillLayers = [
  {
    title: 'AI / Retrieval / Evaluation',
    description: 'Grounded AI workflows, retrieval, refusal behavior, and quality evaluation.',
  },
  {
    title: 'Applications / APIs / Workflows',
    description: 'User-facing applications, service boundaries, queues, routing, and human review.',
  },
  {
    title: 'Cloud / Platform / Infrastructure',
    description: 'Cloud services, containers, delivery pipelines, networking, and runtime environments.',
  },
  {
    title: 'Data / Persistence / Orchestration',
    description: 'Schemas, databases, pipelines, state, jobs, and event-driven coordination.',
  },
  {
    title: 'Security / Reliability / Quality',
    description: 'Identity, access, validation, testing, observability, and failure handling.',
  },
  {
    title: 'Delivery / Operations',
    description: 'Deployment, accessibility, documentation, handoff, maintenance, and stewardship.',
  },
]

export const researchToSystemsPractices = [
  {
    title: 'Evidence quality',
    description: 'Separate measured results, accepted work, prototypes, and production proof.',
  },
  {
    title: 'Retrieval evaluation',
    description: 'Test whether the system finds and grounds the material a workflow depends on.',
  },
  {
    title: 'Limits and uncertainty',
    description: 'Document coverage gaps, failure modes, uncertainty, and refusal boundaries.',
  },
  {
    title: 'Reproducibility',
    description: 'Keep data preparation, evaluation conditions, and technical decisions reviewable.',
  },
  {
    title: 'Scientific datasets',
    description: 'Bring careful processing habits to noisy, incomplete, and domain-specific data.',
  },
]

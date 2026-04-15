export interface BuildPattern {
  title: string
  description: string
}

export interface SystemCaseStudy {
  id: string
  name: string
  summary: string
  caseStudyStage: 'Production' | 'Pilot' | 'R&D'
  problem: string
  system: string
  systemHighlights: string[]
  stack: string[]
  currentState: string
  evidenceSummary: string
  evidence: string[]
  image: string
  imageAlt: string
  visualSurface: 'dark' | 'light'
  visualAspect: 'landscape' | 'portrait'
  externalUrl?: string
  /** What I personally owned on this project */
  myRole: string
  /** The hardest engineering constraint the system had to solve */
  coreConstraint: string
  /** Current milestone or truthful operational outcome */
  outcome: string
}

export interface SystemTheme {
  id: string
  title: string
  intro: string
  systems: SystemCaseStudy[]
}

export interface FeaturedSystemCaseStudy extends SystemCaseStudy {
  themeTitle: string
}

export interface BuildStep {
  title: string
  description: string
}

export interface EngineeringPrinciple {
  title: string
  description: string
}

export interface InterestArea {
  title: string
  description: string
}

export const buildPatterns: BuildPattern[] = [
  {
    title: 'Applied AI',
    description:
      'Use models for retrieval, classification, generation, or guidance only when they fit inside a controlled system boundary.',
  },
  {
    title: 'Workflow Automation',
    description:
      'Reduce manual routing, triage, follow-up, and review work by giving the system an explicit operational path.',
  },
  {
    title: 'Infrastructure',
    description:
      'Treat queues, persistence, deployment, observability, and failure handling as part of the product surface.',
  },
  {
    title: 'Operational Software',
    description:
      'Build software that people can operate, inspect, and trust in real environments rather than demo-only interfaces.',
  },
]

export const systemThemes: SystemTheme[] = [
  {
    id: 'applied-ai-automation',
    title: 'Applied AI & Automation Systems',
    intro:
      'Systems where AI is one layer inside a workflow architecture that still needs routing, validation, state, and human handoff.',
    systems: [
      {
        id: 'stormiq',
        name: 'StormIQ',
        summary:
          'Lead automation platform designed to handle calls, qualification, and CRM handoff without manual follow-up bottlenecks.',
        caseStudyStage: 'R&D',
        problem:
          'Lead generation teams lose momentum when telephony, qualification, and follow-up depend on scripts, disconnected tools, and inconsistent operator decisions.',
        system:
          'Built as a layered voice workflow platform. Telephony and transcript intake feed queue-backed orchestration services, decision layers evaluate conversations, CRM-facing APIs move structured lead outcomes forward, and dashboards keep the system reviewable instead of opaque.',
        systemHighlights: [
          'Voice gateway handles inbound and outbound call flow events.',
          'Queue-based orchestration separates telephony from decision logic.',
          'Agent and CRM layers turn transcripts into actionable lead records.',
        ],
        stack: ['Twilio', 'RabbitMQ', 'FastAPI', 'Python', 'Redis', 'Dashboard Web'],
        currentState: 'Active Build',
        evidenceSummary:
          'The architecture is documented as a real voice workflow system with clear boundaries between intake, orchestration, decisioning, and delivery.',
        evidence: ['Architecture diagram', 'Workflow diagram', 'Lead routing artifacts'],
        image: '/images/projects/stormiq-architecture.png',
        imageAlt:
          'StormIQ architecture diagram showing voice, orchestration, backend, and data layers.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        myRole: 'Sole architect and full-stack engineer',
        coreConstraint: 'Async job orchestration: separating telephony events from decision logic via queue-backed services',
        outcome: 'Architecture validated with working voice gateway, queue orchestration, and CRM integration layer; advancing toward pilot deployment',
      },
      {
        id: 'roboreceptionist',
        name: 'RoboReceptionist',
        summary:
          'Legal intake workflow that screens urgency, gathers structured information, and routes cases without inconsistent or unsafe responses.',
        caseStudyStage: 'R&D',
        problem:
          'Legal intake is high-friction for callers and high-risk for firms when urgency, jurisdiction, conflict checks, and advice boundaries are handled inconsistently.',
        system:
          'Built as a guarded intake architecture. A deterministic policy engine enforces jurisdiction, emergency, conflict, and legal-advice constraints before an AI layer can respond. Validated outputs are persisted with transcripts and routed to intake specialists through notification workflows.',
        systemHighlights: [
          'Policy engine gates every interaction before LLM output can be returned.',
          'State-driven intake flow keeps conflict checks and urgency triage early.',
          'Transcript persistence and notifications keep the system auditable.',
        ],
        stack: [
          'FastAPI',
          'Policy Engine',
          'LLM Validation',
          'SQLite / Postgres',
          'Email Notifications',
        ],
        currentState: 'Prototype',
        evidenceSummary:
          'The system work is visible in the intake flow design, safety boundaries, and validation-first response architecture.',
        evidence: ['Architecture diagram', 'Intake state flow', 'Validation boundary'],
        image: '/images/projects/roboreceptionist-architecture.svg',
        imageAlt:
          'RoboReceptionist architecture diagram showing policy engine, validated AI layer, storage, and notifications.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        myRole: 'Sole architect and backend engineer',
        coreConstraint: 'Validation and safety boundary: every LLM response must pass through a deterministic policy engine before reaching callers',
        outcome: 'Working prototype with policy-gated intake flow, jurisdiction detection, and conflict-check pipeline',
      },
      {
        id: 'lecture-stream-platform',
        name: 'Lecture Stream Platform',
        summary:
          'Audio-processing pipeline that turns raw recordings into transcripts, summaries, and reusable knowledge outputs.',
        caseStudyStage: 'R&D',
        problem:
          'Lecture capture often stops at raw recordings, leaving transcription, summarization, storage, and retrieval fragmented across separate tools.',
        system:
          'Built as an event-driven processing pipeline. Producer nodes upload audio into ingest services, Kafka fans work across transcription and summarization workers, archive services persist artifacts, and API/export layers expose transcripts and summaries as reusable outputs.',
        systemHighlights: [
          'Producer and consumer modes separate capture from heavy compute.',
          'Kafka events keep transcription, summarization, and archive stages decoupled.',
          'API and export services turn pipeline output into reusable artifacts.',
        ],
        stack: [
          'Kafka',
          'faster-whisper',
          'Ollama',
          'Python Services',
          'Consumer API',
          'File Exporter',
        ],
        currentState: 'Research System',
        evidenceSummary:
          'The system evidence is in the pipeline boundary diagram and the multi-stage processing model rather than a one-screen app demo.',
        evidence: ['Pipeline architecture', 'Workflow boundary diagram', 'Terminal processing trace'],
        image: '/images/projects/lecture-stream-boundary.png',
        imageAlt:
          'Lecture Stream Platform boundary diagram showing producer, processing cluster, API, and dashboard.',
        visualSurface: 'dark',
        visualAspect: 'portrait',
        myRole: 'Sole architect and pipeline engineer',
        coreConstraint: 'Event-driven decoupling: Kafka ensures transcription, summarization, and archival stages fail independently without data loss',
        outcome: 'End-to-end pipeline processing audio through transcription and summarization to structured artifacts',
      },
    ],
  },
  {
    id: 'operational-workflow-software',
    title: 'Operational Workflow Software',
    intro:
      'Products that turn messy, real-world work into explicit systems with rules, explainability, and repeatable outputs.',
    systems: [
      {
        id: 'naics-startup-planning-system',
        name: 'NAICS Startup Planning System',
        summary:
          'Planning system that turns broad startup ideas into structured, traceable business planning steps.',
        caseStudyStage: 'R&D',
        problem:
          'Founders often start with broad ideas but no repeatable way to turn an industry choice into a realistic plan, staffing model, income assumptions, or startup sequence.',
        system:
          'Built as an offline-first planning engine backed by the full NAICS hierarchy. The system combines rules-based role generation, income modeling, dependency-ordered startup procedures, and explainability views so users can inspect why each recommendation was produced.',
        systemHighlights: [
          'Rules engine converts industry data into launch-plan structure.',
          'Explainability layers make the output inspectable rather than magical.',
          'Offline-first runtime keeps the system usable without external APIs.',
        ],
        stack: ['Next.js', 'Prisma', 'SQLite', 'Zod', 'Rules Engine', 'Snapshot Tests'],
        currentState: 'Prototype',
        evidenceSummary:
          'The planning engine is supported by a documented rules architecture and outputs that show the provenance of each recommendation.',
        evidence: ['Planning engine diagram', 'Rules trace', 'Generated plan artifacts'],
        image: '/images/projects/naics-planning-engine.svg',
        imageAlt:
          'NAICS planning engine diagram showing dataset, rules engine, plan generation, and exports.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        myRole: 'Sole architect and full-stack engineer',
        coreConstraint: 'Explainability: every generated recommendation must trace back to a rule, data source, or constraint, not a black-box model',
        outcome: 'Working planning engine with rules-based role generation, income modeling, and explainability views across NAICS hierarchy',
      },
      {
        id: 'dealerflow',
        name: 'DealerFlow',
        summary:
          'Pilot platform that automates inventory alerts, buyer matching, and seller workflows for wholesale vehicle activity.',
        caseStudyStage: 'Pilot',
        problem:
          'Wholesale vehicle buyers and sellers lose time when fresh inventory, offer status, and lifecycle changes are spread across slow manual workflows.',
        system:
          'Built as a production-lean mobile system with a NestJS API, BullMQ-backed worker processing, persisted notifications, and lifecycle-safe inventory transitions. Buyers get scored matches and alerts, while sellers manage inventory, offers, and inbound inquiries from a mobile workflow.',
        systemHighlights: [
          'Worker pipeline computes match scores and notification fan-out.',
          'Vehicle lifecycle rules keep buyer and seller state transitions safe.',
          'Mobile-first flows make the software operational instead of dashboard-only.',
        ],
        stack: ['NestJS', 'BullMQ', 'PostgreSQL', 'Prisma', 'Expo React Native', 'Redis'],
        currentState: 'Beta Pilot',
        evidenceSummary:
          'The strongest proof is the mobile workflow itself paired with the notification and inventory lifecycle model behind it.',
        evidence: ['Mobile screenshot', 'Notification pipeline', 'Inventory lifecycle model'],
        image: '/images/projects/dealerflow-feed.png',
        imageAlt:
          'DealerFlow mobile feed showing newly published wholesale inventory.',
        visualSurface: 'light',
        visualAspect: 'portrait',
        myRole: 'Sole backend engineer and mobile developer',
        coreConstraint: 'State consistency: vehicle lifecycle transitions must keep buyer/seller state safe across concurrent offer and inventory workflows',
        outcome: 'Beta pilot with working mobile workflows for buyer matching, seller inventory management, and real-time notification delivery',
      },
    ],
  },
  {
    id: 'production-systems-infrastructure',
    title: 'Production Systems & Infrastructure',
    intro:
      'Systems where deployment, maintenance, accessibility, and release discipline are part of the engineering story.',
    systems: [
      {
        id: 'vifg-nonprofit-platform',
        name: 'VIFG Nonprofit Platform',
        summary:
          'Production platform and delivery stack supporting a nonprofit serving the visually impaired community.',
        caseStudyStage: 'Production',
        problem:
          'Mission-driven organizations need dependable public systems, but production reliability and accessibility often get treated as separate concerns instead of one delivery problem.',
        system:
          'Built as an accessibility-first web platform deployed on AWS Lightsail with host-level Nginx, Dockerized frontend delivery, SSL automation, scheduled maintenance, and CI-driven image publishing. The system supports real nonprofit operations instead of acting like a brochure site.',
        systemHighlights: [
          'Production deployment runs behind Nginx with TLS termination.',
          'Dockerized delivery and GitHub Actions keep releases repeatable.',
          'Accessibility is treated as a system constraint, not a post-launch fix.',
        ],
        stack: ['React', 'TypeScript', 'Vite', 'Docker', 'AWS Lightsail', 'Nginx'],
        currentState: 'Production',
        evidenceSummary:
          'This project shows production ownership through deployment topology, release flow, and the public-facing system that is actually running.',
        evidence: ['Deployment diagram', 'Production site view', 'Release artifact'],
        image: '/images/projects/vifg-deployment.svg',
        imageAlt:
          'VIFG deployment diagram showing client traffic, Lightsail host, Nginx, Docker, and CI delivery.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        externalUrl: 'https://www.vifg.org/home',
        myRole: 'Sole engineer for architecture, frontend, infrastructure, and deployment',
        coreConstraint: 'Accessibility as a system constraint: screen reader compatibility, keyboard navigation, and contrast requirements treated as first-class delivery requirements',
        outcome: 'Production site serving VIFG nonprofit since 2020, deployed on AWS Lightsail with automated CI/CD and TLS termination',
      },
    ],
  },
]

const orderedSystemIds = [
  'vifg-nonprofit-platform',
  'dealerflow',
  'stormiq',
  'roboreceptionist',
  'lecture-stream-platform',
  'naics-startup-planning-system',
]

const systemById = new Map<string, FeaturedSystemCaseStudy>(
  systemThemes.flatMap((theme) =>
    theme.systems.map((system) => [system.id, { ...system, themeTitle: theme.title }])
  )
)

export const featuredSystems: FeaturedSystemCaseStudy[] = orderedSystemIds.map((id) => {
  const system = systemById.get(id)

  if (!system) {
    throw new Error(`Missing featured system for id: ${id}`)
  }

  return system
})

export const allSystems: FeaturedSystemCaseStudy[] = [
  ...featuredSystems,
  ...systemThemes
    .flatMap((theme) => theme.systems.map((system) => ({ ...system, themeTitle: theme.title })))
    .filter((system) => !orderedSystemIds.includes(system.id)),
]

export const productionSystems = featuredSystems.filter(
  (system) => system.caseStudyStage === 'Production'
)

export const pilotSystems = featuredSystems.filter((system) => system.caseStudyStage === 'Pilot')

export const researchSystems = featuredSystems.filter((system) => system.caseStudyStage === 'R&D')

export const supportingSystems = allSystems.filter(
  (system) => !orderedSystemIds.includes(system.id)
)

export function getSystemById(id: string) {
  return systemById.get(id) ?? null
}

export const buildSteps: BuildStep[] = [
  {
    title: 'Architecture-first design',
    description:
      'Start with the workflow, failure points, and system boundaries before optimizing implementation details.',
  },
  {
    title: 'AI-assisted scaffolding',
    description:
      'Use AI to accelerate exploration, interface drafts, and early system structure without confusing speed for finished engineering.',
  },
  {
    title: 'Engineering refinement',
    description:
      'Refine architecture, algorithms, validation, and reliability by hand until the system behaves like software people can trust.',
  },
  {
    title: 'Automation focus',
    description:
      'Prioritize systems that remove manual routing, triage, and repetitive coordination from real operational workflows.',
  },
]

export const engineeringPrinciples: EngineeringPrinciple[] = [
  {
    title: 'Solve real problems',
    description:
      'The goal is not novelty. I optimize for systems that improve how work actually gets done.',
  },
  {
    title: 'Build systems, not features',
    description:
      'Features matter less than the architecture that makes them dependable, inspectable, and extensible.',
  },
  {
    title: 'Use AI as leverage',
    description:
      'AI is most useful when it speeds up architecture, implementation, and workflows inside a well-structured system.',
  },
  {
    title: 'Simplify complex systems',
    description:
      'Prefer explicit boundaries, readable flows, and controlled operational surfaces over unnecessary complexity.',
  },
]

export const currentInterests: InterestArea[] = [
  {
    title: 'Applied AI systems',
    description:
      'Designing systems where models are only one layer inside a larger operational architecture.',
  },
  {
    title: 'Workflow automation',
    description:
      'Reducing manual decision paths with queues, policy engines, retrieval, and human-review seams.',
  },
  {
    title: 'Operational software',
    description:
      'Building software that coordinates real-world work rather than isolated toy interactions.',
  },
  {
    title: 'Infrastructure-backed platforms',
    description:
      'Treating deployment, observability, and data movement as part of the product surface from day one.',
  },
]

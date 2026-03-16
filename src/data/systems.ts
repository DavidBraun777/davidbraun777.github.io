export interface BuildPattern {
  title: string
  description: string
}

export interface SystemCaseStudy {
  id: string
  name: string
  summary: string
  problem: string
  system: string
  systemHighlights: string[]
  stack: string[]
  currentState: string
  image: string
  imageAlt: string
  visualSurface: 'dark' | 'light'
  visualAspect: 'landscape' | 'portrait'
  artifacts: string[]
}

export interface SystemTheme {
  id: string
  title: string
  intro: string
  systems: SystemCaseStudy[]
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
      'LLMs, retrieval, classification, or summarization are used inside a system with clear boundaries and operational rules.',
  },
  {
    title: 'Workflow Automation',
    description:
      'The core value is reducing manual routing, triage, follow-up, and decision friction across real work.',
  },
  {
    title: 'Infrastructure',
    description:
      'Queues, state stores, deployment surfaces, and reliability constraints are part of the product, not afterthoughts.',
  },
  {
    title: 'Operational Software',
    description:
      'The end result is software people can actually run, review, and extend in a working environment.',
  },
]

export const systemThemes: SystemTheme[] = [
  {
    id: 'applied-ai-automation',
    title: 'Applied AI & Automation Systems',
    intro:
      'These systems use AI inside workflow-heavy architectures where routing, validation, and human handoff matter as much as the model itself.',
    systems: [
      {
        id: 'stormiq',
        name: 'StormIQ',
        summary:
          'AI-powered lead generation platform for automating prospect engagement, qualification, and downstream sales workflows.',
        problem:
          'Lead generation teams lose momentum when call handling, qualification, and follow-up depend on manual scripts, disconnected tools, and inconsistent operator decisions.',
        system:
          'Built as a layered voice workflow platform: telephony and transcript intake feed queue-backed services, policy and decision layers evaluate the conversation, CRM-facing APIs move structured lead outcomes forward, and operator dashboards keep the system reviewable instead of opaque.',
        systemHighlights: [
          'Voice gateway handles inbound and outbound call flow events.',
          'Queue-based orchestration separates telephony from decision logic.',
          'Agent and CRM layers translate transcripts into actionable lead records.',
        ],
        stack: ['Twilio', 'RabbitMQ', 'FastAPI', 'Python', 'Redis', 'Dashboard Web'],
        currentState: 'Active Build',
        image: '/images/projects/stormiq-architecture.png',
        imageAlt: 'StormIQ architecture diagram showing voice, orchestration, backend, and data layers.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        artifacts: ['Architecture diagram', 'Call lifecycle', 'Lead export path'],
      },
      {
        id: 'roboreceptionist',
        name: 'RoboReceptionist',
        summary:
          'AI-assisted legal intake system that guides non-experts through complex situations with structured workflows and safety controls.',
        problem:
          'Legal intake is high-friction for callers and high-risk for firms when urgency, jurisdiction, conflict checks, and advice boundaries are handled inconsistently.',
        system:
          'Built as a two-layer intake architecture. A deterministic policy engine enforces jurisdiction, emergency, conflict, and legal-advice constraints before an AI layer can respond. Validated outputs are persisted with transcripts and routed to intake specialists through notification workflows.',
        systemHighlights: [
          'Policy engine gates every interaction before LLM output can be returned.',
          'State-driven intake flow keeps conflict checks and urgency triage early.',
          'Transcript persistence and notifications keep the system auditable.',
        ],
        stack: ['FastAPI', 'Policy Engine', 'LLM Validation', 'SQLite / Postgres', 'Email Notifications'],
        currentState: 'Prototype',
        image: '/images/projects/roboreceptionist-architecture.svg',
        imageAlt: 'RoboReceptionist architecture diagram showing policy engine, validated AI layer, storage, and notifications.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        artifacts: ['Safety diagram', 'Intake state flow', 'Validation boundary'],
      },
      {
        id: 'lecture-stream-platform',
        name: 'Lecture Stream Platform',
        summary:
          'AI transcription and summarization pipeline that turns recorded lectures into structured knowledge artifacts.',
        problem:
          'Lecture capture usually stops at raw recordings, leaving the real work of transcription, summarization, storage, and retrieval fragmented across separate tools.',
        system:
          'Built as an event-driven processing pipeline. Producer nodes upload audio into ingest services, Kafka fans work across transcription and summarization workers, archive services persist artifacts, and API/export layers make transcripts and summaries available as reusable outputs.',
        systemHighlights: [
          'Producer and consumer modes separate capture from heavy compute.',
          'Kafka events keep transcription, summarization, and archive stages decoupled.',
          'API and export services turn pipeline output into usable artifacts.',
        ],
        stack: ['Kafka', 'faster-whisper', 'Ollama', 'Python Services', 'Consumer API', 'File Exporter'],
        currentState: 'Research System',
        image: '/images/projects/lecture-stream-boundary.png',
        imageAlt: 'Lecture Stream Platform boundary diagram showing producer, processing cluster, API, and dashboard.',
        visualSurface: 'dark',
        visualAspect: 'portrait',
        artifacts: ['System boundary diagram', 'Kafka pipeline', 'Archive and export flow'],
      },
    ],
  },
  {
    id: 'operational-workflow-software',
    title: 'Operational Workflow Software',
    intro:
      'These products structure messy, real-world workflows into repeatable systems with clear rules, generated artifacts, and operator visibility.',
    systems: [
      {
        id: 'naics-startup-planning-system',
        name: 'NAICS Startup Planning System',
        summary:
          'Planning software that guides founders through structured startup workflows instead of vague brainstorming.',
        problem:
          'Founders often start with broad ideas but no repeatable way to turn an industry choice into a realistic plan, team model, income assumptions, or startup sequence.',
        system:
          'Built as an offline-first planning engine backed by the full NAICS hierarchy. The system combines rules-based role generation, income modeling, dependency-ordered startup procedures, and explainability views so users can see why the software produced each recommendation.',
        systemHighlights: [
          'Rules engine converts industry data into launch-plan structure.',
          'Explainability layers make the output inspectable rather than magical.',
          'Offline-first runtime keeps the system usable without external APIs.',
        ],
        stack: ['Next.js', 'Prisma', 'SQLite', 'Zod', 'Rules Engine', 'Snapshot Tests'],
        currentState: 'Prototype',
        image: '/images/projects/naics-planning-engine.svg',
        imageAlt: 'NAICS planning engine diagram showing dataset, rules engine, plan generation, and exports.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        artifacts: ['Planning engine diagram', 'Rule explainability', 'Dataset provenance'],
      },
      {
        id: 'dealerflow',
        name: 'DealerFlow',
        summary:
          'Vehicle monitoring and notification platform that aggregates inventory updates and alerts users to relevant deals.',
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
        image: '/images/projects/dealerflow-feed.png',
        imageAlt: 'DealerFlow mobile feed showing newly published wholesale inventory.',
        visualSurface: 'light',
        visualAspect: 'portrait',
        artifacts: ['Mobile screenshot', 'Notification pipeline', 'Inventory lifecycle model'],
      },
    ],
  },
  {
    id: 'production-systems-infrastructure',
    title: 'Production Systems & Infrastructure',
    intro:
      'This work reflects the deployment side of engineering: production surfaces, maintenance paths, secure defaults, and long-term operational ownership.',
    systems: [
      {
        id: 'vifg-nonprofit-platform',
        name: 'VIFG Nonprofit Platform',
        summary:
          'Production website and infrastructure system supporting a nonprofit organization serving the visually impaired community.',
        problem:
          'Mission-driven organizations need dependable public systems, but production reliability and accessibility often get treated as separate concerns instead of one delivery problem.',
        system:
          'Built as an accessibility-first web platform deployed on AWS Lightsail with host-level Nginx, Dockerized frontend delivery, SSL automation, scheduled maintenance, and CI-driven image publishing. The system architecture supports real nonprofit operations instead of a static brochure site.',
        systemHighlights: [
          'Production deployment runs behind Nginx with TLS termination.',
          'Dockerized delivery and GitHub Actions keep releases repeatable.',
          'Accessibility work is treated as a core system constraint.',
        ],
        stack: ['React', 'TypeScript', 'Vite', 'Docker', 'AWS Lightsail', 'Nginx'],
        currentState: 'Production',
        image: '/images/projects/vifg-deployment.svg',
        imageAlt: 'VIFG deployment diagram showing client traffic, Lightsail host, Nginx, Docker, and CI delivery.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        artifacts: ['Deployment diagram', 'Infrastructure topology', 'Accessibility-first delivery'],
      },
    ],
  },
]

export const buildSteps: BuildStep[] = [
  {
    title: 'Architecture-first design',
    description:
      'Start with the workflow, the failure points, and the system boundaries before choosing implementation details.',
  },
  {
    title: 'AI-assisted scaffolding',
    description:
      'Use AI to accelerate initial system structure, interface definitions, and implementation drafts without confusing speed for finished engineering.',
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
      'The goal is not novelty for its own sake. I optimize for systems that improve how work actually gets done.',
  },
  {
    title: 'Build systems, not features',
    description:
      'Individual features matter less than the architecture that makes them dependable, inspectable, and extensible.',
  },
  {
    title: 'Use AI as leverage',
    description:
      'AI is most valuable when it speeds up architecture, implementation, and workflows inside a well-structured system.',
  },
  {
    title: 'Simplify complex systems',
    description:
      'I prefer explicit boundaries, readable flows, and controlled operational surfaces over unnecessary complexity.',
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

export interface ProofSection {
  id: 'walkthrough' | 'architecture' | 'operations' | 'artifacts'
  title: string
  status: 'available' | 'planned'
  summary: string
  items: string[]
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
  image?: string
  imageAlt?: string
  visualSurface?: 'dark' | 'light'
  visualAspect?: 'landscape' | 'portrait'
  externalUrl?: string
  /** What I personally owned on this project */
  myRole: string
  /** The hardest engineering constraint the system had to solve */
  coreConstraint: string
  /** Current milestone or truthful operational outcome */
  outcome: string
  proofSections: ProofSection[]
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

export const systemThemes: SystemTheme[] = [
  {
    id: 'applied-ai-automation',
    title: 'Applied AI & Automation Systems',
    intro:
      'Systems where AI is one layer inside a workflow architecture that still needs routing, validation, state, and human handoff.',
    systems: [
      {
        id: 'weatherforge',
        name: 'WeatherForge',
        summary:
          'Weather-triggered signal and routing system in active development to turn storm activity into usable operational input for StormIQ.',
        caseStudyStage: 'R&D',
        problem:
          'Storm-driven businesses lose time when weather events, territory relevance, and follow-up timing are all checked manually across maps, forecasts, and internal notes.',
        system:
          'WeatherForge is being built as the event-signal layer that will feed StormIQ. The current direction centers on ingesting weather and geography signals, normalizing them into reviewable events, and handing those events to downstream qualification and routing workflows instead of asking operators to monitor conditions by hand.',
        systemHighlights: [
          'Signal ingestion boundary for weather, geography, and event windows.',
          'Normalization layer designed to turn raw event data into reviewable operational triggers.',
          'Routing seam intended to pass vetted event signals into later qualification workflows.',
        ],
        stack: ['Python', 'FastAPI', 'Geospatial Processing', 'Event Routing', 'Workflow APIs'],
        currentState: 'Active Build',
        myRole: 'Sole architect and engineer building the system foundation',
        coreConstraint:
          'Signal quality: raw weather activity is noisy, so the system has to separate interesting operational events from background data before anything gets routed forward',
        outcome:
          'System boundaries are defined for signal ingestion, normalization, territory relevance, and downstream routing; implementation is in progress',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'planned',
            summary:
              'A walkthrough is being prepared once the first usable end-to-end signal path is stable enough to show without hand-waving.',
            items: [
              'Walkthrough video to be added after the first end-to-end signal capture and routing pass is stable.',
              'Current state: architecture and workflow boundaries are defined, but the public walkthrough would still be premature.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'available',
            summary:
              'The current architecture direction is already clear even though the full artifact set is not published yet.',
            items: [
              'Event ingestion boundary for weather and geography inputs.',
              'Normalization layer that converts raw signals into reviewable event objects.',
              'Routing handoff planned to feed StormIQ qualification and downstream workflow logic.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'The work is being shaped around reviewable operational surfaces rather than a hidden model-only flow.',
            items: [
              'Signal review surface for checking whether an event should advance.',
              'Territory relevance and timing rules to prevent noisy triggers.',
              'Downstream delivery seam designed for later lead or workflow handoff.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'planned',
            summary:
              'The page is ready for real artifacts, but they are not being claimed before they exist.',
            items: [
              'Lifecycle diagram in progress.',
              'Signal review screenshots to be added once the interface is stable.',
              'Operational trigger artifacts to be added after the first durable workflow run.',
            ],
          },
        ],
      },
      {
        id: 'dgm',
        name: 'DGM',
        summary:
          'Workflow orchestration layer in active development for managing state, decision flow, and human review inside StormIQ.',
        caseStudyStage: 'R&D',
        problem:
          'Automation systems become brittle when routing, validation, retries, and human override are scattered across prompts, background jobs, and ad hoc glue code.',
        system:
          'DGM is being built as the orchestration backbone that will coordinate StormIQ workflows. The current direction is a graph-driven execution model that can move work through deterministic steps, agent-assisted branches, validation checks, and human review without losing system state or hiding decisions inside one opaque process.',
        systemHighlights: [
          'Graph-based execution model for multi-step workflow state.',
          'Validation seams between agent output, business rules, and human review.',
          'Retry-safe orchestration intended to keep workflow state inspectable.',
        ],
        stack: ['Python', 'FastAPI', 'Workflow Graphs', 'Queue-backed Jobs', 'Validation Layers'],
        currentState: 'Active Build',
        myRole: 'Sole architect and engineer building the orchestration layer',
        coreConstraint:
          'State integrity: orchestration has to keep workflow state, validation, and human intervention inspectable instead of letting decisions disappear inside one agent loop',
        outcome:
          'Execution model is defined for graph-driven workflow state, validation boundaries, and human review seams; implementation is in progress',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'planned',
            summary:
              'A walkthrough will be added when the orchestration loop is stable enough to demonstrate real state transitions instead of mocked steps.',
            items: [
              'Walkthrough to be added once graph execution can be shown with durable state transitions.',
              'Current state: the execution model is defined, but the public walkthrough would still be too early.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'available',
            summary:
              'The architecture direction is already concrete: stateful orchestration, controlled branches, and explicit review seams.',
            items: [
              'Graph-driven workflow state as the core execution model.',
              'Agent-assisted branches bounded by validation and deterministic rules.',
              'Human review seam built into the orchestration path rather than bolted on later.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'The system is being designed for real operator visibility instead of hidden background automation.',
            items: [
              'Workflow state inspection for checking where a task is and why.',
              'Validation checkpoints for high-risk or ambiguous transitions.',
              'Retry and recovery boundaries so failed steps do not corrupt the whole workflow.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'planned',
            summary:
              'Proof is being staged honestly: no fake screenshots, no fake outcomes, and no premature claims.',
            items: [
              'Execution graph artifact in progress.',
              'State transition examples to be added when durable runs are available.',
              'Operator review surface screenshots to be added once the UI stabilizes.',
            ],
          },
        ],
      },
      {
        id: 'stormiq',
        name: 'StormIQ',
        summary:
          'Broader lead-automation direction being built on top of WeatherForge and DGM rather than treated as a finished standalone system.',
        caseStudyStage: 'R&D',
        problem:
          'Lead generation teams lose momentum when signal detection, qualification, call handling, and CRM handoff are split across disconnected tools and manual follow-up.',
        system:
          'StormIQ is the larger workflow direction these systems support. WeatherForge is being built as the event-signal layer, DGM is being built as the orchestration layer, and StormIQ brings those layers together with qualification, decisioning, and CRM handoff so the final workflow is reviewable instead of brittle.',
        systemHighlights: [
          'WeatherForge is the upstream signal engine for storm and territory relevance.',
          'DGM is the orchestration layer for state, branching, and human-review seams.',
          'StormIQ is the umbrella workflow tying signal, qualification, and downstream handoff together.',
        ],
        stack: ['Python', 'FastAPI', 'Workflow Orchestration', 'Queue-backed Jobs', 'CRM Integrations'],
        currentState: 'Architecture in Progress',
        image: '/images/projects/stormiq-architecture.png',
        imageAlt:
          'StormIQ architecture diagram showing voice, orchestration, backend, and data layers.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        myRole: 'Sole architect defining the system direction and building the foundation layers',
        coreConstraint:
          'System coherence: the umbrella workflow has to stay honest about what is real today while still defining how signal, orchestration, and downstream actions will fit together',
        outcome:
          'StormIQ is now framed as a serious in-progress program direction, with WeatherForge and DGM acting as the concrete systems under active development',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'planned',
            summary:
              'A full StormIQ walkthrough is intentionally deferred until the WeatherForge and DGM layers are mature enough to show as one believable system.',
            items: [
              'Umbrella walkthrough to be added after the core WeatherForge and DGM flows are operating together.',
              'Current proof is the system direction and architecture boundary, not a finished product claim.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'available',
            summary:
              'The architecture direction is real now: a system composed of upstream signal handling, orchestration, validation, and downstream delivery.',
            items: [
              'WeatherForge feeds structured event signals into the broader workflow.',
              'DGM handles state, branching, and reviewable orchestration.',
              'StormIQ binds signal, qualification, and CRM handoff into one operator-facing system.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'The intended system surfaces are explicit even though the full proof set is still being assembled.',
            items: [
              'Signal review and qualification checks before downstream action.',
              'Orchestration state visibility instead of hidden agent-only logic.',
              'CRM and follow-up handoff as a first-class workflow output.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'planned',
            summary:
              'Artifacts will be added as the underlying systems stabilize. This page is ready for them without pretending they already exist.',
            items: [
              'Updated umbrella architecture diagram to be added after WeatherForge and DGM artifacts are finalized.',
              'End-to-end workflow evidence to be added once the integrated path is running reliably.',
            ],
          },
        ],
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
        image: '/images/projects/roboreceptionist-architecture.svg',
        imageAlt:
          'RoboReceptionist architecture diagram showing policy engine, validated AI layer, storage, and notifications.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        myRole: 'Sole architect and backend engineer',
        coreConstraint:
          'Validation and safety boundary: every LLM response must pass through a deterministic policy engine before reaching callers',
        outcome:
          'Working prototype with policy-gated intake flow, jurisdiction detection, and conflict-check pipeline',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'available',
            summary:
              'The system walkthrough is currently grounded in the intake flow and the architecture shown on this page.',
            items: [
              'Policy-gated intake flow shows where emergency, conflict, and jurisdiction checks happen.',
              'Validated-response boundary keeps unsafe or non-compliant output from reaching callers.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'available',
            summary:
              'The architecture diagram on this page is the strongest current proof artifact for how the system is structured.',
            items: [
              'Policy engine sits in front of the AI layer.',
              'Stateful intake flow keeps high-risk questions early.',
              'Persistence and notifications make the system auditable after each interaction.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'This system has real operator-facing surfaces even at the prototype stage.',
            items: [
              'Conflict and urgency checks drive routing outcomes.',
              'Transcript persistence supports later review.',
              'Notification workflows keep intake specialists in the loop.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'available',
            summary:
              'Current evidence is architectural and workflow-based rather than public-production proof.',
            items: [
              'Architecture diagram on this page.',
              'Intake state flow supporting the policy boundary.',
              'Validation boundary definition showing how unsafe output is blocked.',
            ],
          },
        ],
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
        image: '/images/projects/lecture-stream-boundary.png',
        imageAlt:
          'Lecture Stream Platform boundary diagram showing producer, processing cluster, API, and dashboard.',
        visualSurface: 'dark',
        visualAspect: 'portrait',
        myRole: 'Sole architect and pipeline engineer',
        coreConstraint:
          'Event-driven decoupling: Kafka ensures transcription, summarization, and archival stages fail independently without data loss',
        outcome:
          'End-to-end pipeline processing audio through transcription and summarization to structured artifacts',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'available',
            summary:
              'The current walkthrough is the pipeline boundary and processing flow rather than a public interface demo.',
            items: [
              'Producer-to-consumer processing path shows how audio becomes reusable artifacts.',
              'The system can be explained as staged pipeline logic instead of a single black-box service.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'available',
            summary:
              'The boundary diagram on this page is the clearest proof artifact for how the pipeline is structured.',
            items: [
              'Kafka separates ingestion from transcription and summarization workers.',
              'Archive and export layers preserve artifacts for later reuse.',
              'API surfaces expose transcripts and summaries without coupling them to processing workers.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'Even as a research system, the pipeline has explicit surfaces for capture, processing, and output handling.',
            items: [
              'Producer node for raw audio intake.',
              'Worker stages for transcription and summarization.',
              'API/export surface for structured outputs.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'available',
            summary:
              'The current evidence is process-oriented and technical rather than public-facing.',
            items: [
              'Pipeline boundary diagram on this page.',
              'Workflow model for capture, processing, and export.',
              'Terminal processing traces available for later inclusion.',
            ],
          },
        ],
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
        image: '/images/projects/naics-planning-engine.svg',
        imageAlt:
          'NAICS planning engine diagram showing dataset, rules engine, plan generation, and exports.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        myRole: 'Sole architect and full-stack engineer',
        coreConstraint:
          'Explainability: every generated recommendation must trace back to a rule, data source, or constraint, not a black-box model',
        outcome:
          'Working planning engine with rules-based role generation, income modeling, and explainability views across NAICS hierarchy',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'available',
            summary:
              'The current walkthrough is grounded in how the rules engine turns category data into traceable planning output.',
            items: [
              'The planning flow shows how an industry choice becomes a generated operating plan.',
              'Explainability views make each recommendation inspectable rather than magical.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'available',
            summary:
              'The planning engine diagram on this page shows how data, rules, and output generation are connected.',
            items: [
              'NAICS hierarchy feeds the planning engine.',
              'Rules engine drives role generation, income modeling, and procedural ordering.',
              'Explainability layer exposes why the system made each recommendation.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'The system has clear operator surfaces even though it is still at the prototype stage.',
            items: [
              'Planning outputs can be inspected and exported.',
              'Rules trace gives users a way to verify recommendations.',
              'Offline-first runtime removes dependence on external APIs for core behavior.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'available',
            summary:
              'Current evidence is centered on rules, diagrams, and generated outputs.',
            items: [
              'Planning engine diagram on this page.',
              'Rules trace supporting explainability claims.',
              'Generated plan artifacts available for later inclusion.',
            ],
          },
        ],
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
        image: '/images/projects/dealerflow-feed.png',
        imageAlt: 'DealerFlow mobile feed showing newly published wholesale inventory.',
        visualSurface: 'light',
        visualAspect: 'portrait',
        myRole: 'Sole backend engineer and mobile developer',
        coreConstraint:
          'State consistency: vehicle lifecycle transitions must keep buyer and seller state safe across concurrent offer and inventory workflows',
        outcome:
          'Beta pilot with working mobile workflows for buyer matching, seller inventory management, and real-time notification delivery',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'available',
            summary:
              'The mobile workflow shown on this page is still the clearest existing proof surface for DealerFlow.',
            items: [
              'Buyer-facing inventory feed and match workflow are visible through the mobile screenshot.',
              'Pilot status is real, but the fuller walkthrough needs stronger artifact coverage than it has today.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'planned',
            summary:
              'The system architecture is real, but the dedicated diagram and lifecycle artifact still need to be added.',
            items: [
              'Notification pipeline diagram is still to be added.',
              'Lifecycle-safe inventory model artifact is in progress.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'This system already has real operational surfaces even though the proof set is still thinner than it should be.',
            items: [
              'Mobile buyer workflow for incoming inventory.',
              'Seller inventory and offer management flow.',
              'BullMQ-backed notification handling for match and lifecycle changes.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'planned',
            summary:
              'DealerFlow still needs stronger embedded artifacts to become a more believable flagship.',
            items: [
              'Dedicated lifecycle diagram to be added.',
              'Notification and queue artifact to be added.',
              'More complete mobile workflow proof to be added.',
            ],
          },
        ],
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
        image: '/images/projects/vifg-deployment.svg',
        imageAlt:
          'VIFG deployment diagram showing client traffic, Lightsail host, Nginx, Docker, and CI delivery.',
        visualSurface: 'dark',
        visualAspect: 'landscape',
        externalUrl: 'https://www.vifg.org/home',
        myRole: 'Sole engineer for architecture, frontend, infrastructure, and deployment',
        coreConstraint:
          'Accessibility as a system constraint: screen reader compatibility, keyboard navigation, and contrast requirements treated as first-class delivery requirements',
        outcome:
          'Production site serving VIFG nonprofit since 2020, deployed on AWS Lightsail with automated CI/CD and TLS termination',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'available',
            summary:
              'This is the clearest public proof on the site because both the public surface and the delivery stack are visible.',
            items: [
              'Live public site at vifg.org/home.',
              'Production platform has stayed in service since 2020.',
              'Accessibility and operations are part of the same delivery story, not separate claims.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Flow',
            status: 'available',
            summary:
              'The deployment diagram on this page shows the infrastructure and release path that make the system believable.',
            items: [
              'AWS Lightsail host running behind Nginx with TLS termination.',
              'Dockerized delivery surface for repeatable deployments.',
              'GitHub Actions publishing and release flow supporting production updates.',
            ],
          },
          {
            id: 'operations',
            title: 'Operational Surfaces',
            status: 'available',
            summary:
              'The project includes real production surfaces beyond the public pages themselves.',
            items: [
              'Host-level web serving and TLS maintenance.',
              'Scheduled maintenance and release discipline.',
              'Accessibility review and fixes as part of ongoing operational ownership.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'available',
            summary:
              'This project already has the strongest current evidence set in the portfolio.',
            items: [
              'Live nonprofit site.',
              'Deployment diagram on this page.',
              'Repeatable release path and infrastructure ownership described concretely.',
            ],
          },
        ],
      },
    ],
  },
]

const orderedSystemIds = [
  'vifg-nonprofit-platform',
  'weatherforge',
  'dgm',
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

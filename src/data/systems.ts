import type { CaseStudyStory } from './case-study-story'
import clientWebsiteContent from './live-client-websites.json'
import { time2Move } from './past-client-work'

export interface ProofSection {
  id: 'walkthrough' | 'architecture' | 'operations' | 'artifacts'
  title: string
  status: 'available' | 'planned'
  summary: string
  items: string[]
  links?: { label: string; href: string }[]
}

export interface CaseStudyMetric {
  label: string
  value: string
  detail?: string
}

export interface ArchitectureStep {
  label: string
  detail: string
}

export interface RetrievalComparisonMethod {
  /** Stable semantic key only needed when system-type labels would collide. */
  id?: string
  systemType: string
  compares: string
  bestUseCase: string
  fatalWeakness: string
}

export interface RetrievalComparison {
  title: string
  summary: string
  intro: string
  methods: RetrievalComparisonMethod[]
  futureWork: string
}

export interface SystemCaseStudy {
  id: string
  name: string
  displayTitle?: string
  shortTitle?: string
  summary: string
  oneSentenceOutcome?: string
  contextLabel?: string
  positioning?: string
  caseStudyStage: 'Production' | 'Pilot' | 'R&D' | 'Historical'
  problem: string
  system: string
  solutionTitle?: string
  systemHighlights: string[]
  stack: string[]
  metrics?: CaseStudyMetric[]
  architecture?: ArchitectureStep[]
  dataSources?: string[]
  dashboardViews?: string[]
  realWorldRelevance?: string[]
  limitations?: string[]
  nextImprovements?: string[]
  retrievalComparison?: RetrievalComparison
  currentState: string
  image?: string
  imageAlt?: string
  visualSurface?: 'dark' | 'light'
  visualAspect?: 'landscape' | 'portrait'
  externalUrl?: string
  story?: CaseStudyStory
  githubUrl?: string
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

const stackList = new Intl.ListFormat('en-US')

export const liveClientWebsites = clientWebsiteContent.map(
  ({ client, openingSection, sections, ...project }): SystemCaseStudy => ({
    ...project,
    caseStudyStage: 'Production',
    currentState: 'Live client website',
    image: openingSection.figure.src,
    imageAlt: openingSection.figure.alt,
    proofSections: [],
    story: {
      atAGlance: [
        { label: 'Client', value: client },
        { label: 'My role', value: 'Website development' },
        { label: 'Built with', value: stackList.format(project.stack) },
      ],
      sections: [openingSection, ...sections],
    },
  })
)

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
        displayTitle: 'WeatherForge: Minnesota Severe Weather Risk Analytics Dashboard',
        shortTitle: 'Minnesota Severe Weather Risk Analytics Dashboard',
        summary:
          'A collaborative University of St. Thomas SEIS 745 project in which David Braun served as lead developer and primary implementer, turning large NOAA weather datasets into county-level risk views and decision-support reporting.',
        oneSentenceOutcome:
          'David Braun led implementation and wrote more than 90% of the application code across the Minnesota-focused NOAA data pipeline, analytics layers, and Python Shiny + Plotly dashboard.',
        contextLabel: 'Prototype / Academic Project',
        positioning:
          'WeatherForge originated as a collaborative University of St. Thomas SEIS 745 project with Odin Lee and Jannah ElNemr. David Braun served as the lead developer and primary implementer, writing more than 90% of the application code, while the project as a whole was completed collaboratively by the three-person team.',
        caseStudyStage: 'R&D',
        problem:
          'Public weather data is large, messy, and hard to use directly for decision support. NOAA archives contain valuable severe-weather and daily-observation records, but the raw files need filtering, cleaning, unit conversion, county joins, and clear dashboard views before they become useful for Minnesota risk analysis.',
        system:
          'As lead developer and primary implementer, I wrote more than 90% of the WeatherForge application code across its data pipeline, analytics, and dashboard layers. My implementation work included filtering, cleaning, transforming, and packaging NOAA Storm Events and GHCN-Daily data into Minnesota-focused analytics layers and developing dashboard views for statewide trends, county-level impacts, historical time progression, weather context, methods, and live-alert exploration.',
        solutionTitle: 'Solution / Implementation',
        systemHighlights: [
          'Raw NOAA files filtered down to Minnesota severe-weather and station-observation records.',
          'Cleaning and unit conversion steps produced reusable Parquet analytics layers.',
          'County boundary and population joins support county-level risk comparison and normalized reporting.',
          'Python Shiny and Plotly dashboard turns the curated data into exploratory decision-support views.',
        ],
        stack: ['Python', 'Shiny', 'Plotly', 'Parquet', 'NOAA Storm Events', 'NOAA GHCN-Daily', 'GeoJSON'],
        metrics: [
          {
            value: '~35 GB',
            label: 'raw NOAA source archive',
            detail: 'used in the working project',
          },
          {
            value: '55,384',
            label: 'cleaned Minnesota storm-event records',
          },
          {
            value: '9,008,748',
            label: 'Minnesota station-day weather observations',
          },
          {
            value: '87',
            label: 'Minnesota counties mapped',
          },
          {
            value: '1950-06-15 through 2025-12-28',
            label: 'storm-event range',
          },
          {
            value: '1877-08-05 through 2026-03-22',
            label: 'weather-observation range',
          },
        ],
        architecture: [
          {
            label: 'Raw NOAA files',
            detail: 'Storm Events and GHCN-Daily source files collected as the raw archive.',
          },
          {
            label: 'Minnesota filtering',
            detail: 'Records scoped to Minnesota events, counties, and station observations.',
          },
          {
            label: 'Cleaning and unit conversion',
            detail: 'Fields normalized, weather units converted, and records prepared for analysis.',
          },
          {
            label: 'Parquet outputs',
            detail: 'Curated analytics layers stored for faster dashboard and analysis use.',
          },
          {
            label: 'County joins and population normalization',
            detail: 'County boundaries and population anchors support mapped and normalized comparisons.',
          },
          {
            label: 'Shiny and Plotly dashboard',
            detail: 'Interactive views expose overview, county, temporal, methods, and alert surfaces.',
          },
        ],
        dataSources: [
          'NOAA Storm Events',
          'NOAA GHCN-Daily',
          'Minnesota county boundary GeoJSON',
          'County population anchors',
        ],
        dashboardViews: [
          'Overview',
          'County Impacts',
          'Weather Context',
          'Time Progression',
          'Statewide Trends',
          'Methods/Pipeline',
          'Live Alerts',
        ],
        realWorldRelevance: [
          'Severe-weather awareness',
          'County-level risk comparison',
          'Public-data productization',
          'Dashboard reporting',
          'Executive summaries',
        ],
        limitations: [
          'Pre-1996 NOAA Storm Events data is less complete.',
          'Older records are biased toward better-monitored and more populated areas.',
          'Same-day statewide weather averages are context, not exact event-local station readings.',
          'The current version is Minnesota-focused.',
          'This is a decision-support prototype, not a forecasting or actuarial model.',
          'Rebuilding the packaged data requires the raw NOAA inputs and adjustments to paths preserved from the original working environment.',
        ],
        nextImprovements: [
          'Parameterize raw-data paths so a rebuild can use an explicit input and output layout.',
          'Extend validation of county and zone joins, population anchors, and historical coverage.',
          'Compare statewide weather context with event-local station matching before drawing more local conclusions.',
        ],
        currentState: 'Applied dashboard prototype',
        githubUrl: 'https://github.com/DavidBraun777/WeatherForge',
        myRole: 'Lead developer and primary implementer',
        coreConstraint:
          'Data trust: the dashboard has to make large public datasets usable while clearly labeling historical completeness issues and contextual weather averages.',
        outcome:
          'I led implementation of the code that curated 55,384 cleaned Minnesota storm-event records and 9,008,748 station-day observations into reusable Parquet layers and a Python Shiny + Plotly dashboard spanning all 87 Minnesota counties.',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'Dashboard Views',
            status: 'available',
            summary:
              'The dashboard source and guide describe how the curated Minnesota data is explored.',
            items: [
              'Overview, County Impacts, Weather Context, Time Progression, Statewide Trends, Methods/Pipeline, and Live Alerts views.',
              'Historical views read local Parquet files; Live Alerts uses the National Weather Service API.',
            ],
            links: [
              { label: 'Read the dashboard guide', href: 'https://github.com/DavidBraun777/WeatherForge/blob/master/docs/dashboard-guide.md' },
              { label: 'Inspect the Shiny application', href: 'https://github.com/DavidBraun777/WeatherForge/blob/master/app.py' },
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Pipeline',
            status: 'available',
            summary:
              'The pipeline runs from raw public archives through filtering, cleaning, Parquet outputs, county joins, and an interactive Shiny/Plotly surface.',
            items: [
              'Raw NOAA files -> Minnesota filtering -> cleaning/unit conversion -> Parquet outputs.',
              'County joins and population normalization make county-level comparisons possible.',
              'Shiny and Plotly expose the curated analytics layers through dashboard views.',
            ],
            links: [
              { label: 'Read the pipeline documentation', href: 'https://github.com/DavidBraun777/WeatherForge/blob/master/docs/data-pipeline.md' },
              { label: 'Inspect the data-preparation scripts', href: 'https://github.com/DavidBraun777/WeatherForge/tree/master/pipeline' },
            ],
          },
          {
            id: 'operations',
            title: 'Applied Decision-Support Surfaces',
            status: 'available',
            summary:
              'The project demonstrates how public data can be productized into reporting surfaces without claiming forecasting or actuarial precision.',
            items: [
              'County-level severe-weather comparisons.',
              'Historical trend and time-progression views.',
              'Methods view that explains the data pipeline and caveats.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'available',
            summary:
              'The public repository includes the curated data, data dictionary, and instructions for running the academic dashboard.',
            items: [
              '~35 GB raw NOAA source archive used in the working project.',
              '55,384 cleaned Minnesota storm-event records and 9,008,748 station-day observations.',
              'Public GitHub repository linked for code review.',
            ],
            links: [
              { label: 'Review setup and reproducibility notes', href: 'https://github.com/DavidBraun777/WeatherForge/blob/master/README.md' },
              { label: 'Inspect the packaged data', href: 'https://github.com/DavidBraun777/WeatherForge/tree/master/data' },
            ],
          },
        ],
      },
      {
        id: 'rageatm',
        name: 'RAGeATM',
        displayTitle: 'RAGeATM: Evidence-Bound Local RAG Assistant Prototype',
        shortTitle: 'Evidence-Bound Retrieval-Augmented Generation Prototype',
        summary:
          'A small explainable Retrieval-Augmented Generation prototype that retrieves local evidence first, applies a relevance threshold, and refuses unsupported questions when the corpus does not justify an answer.',
        oneSentenceOutcome:
          'Built a local evidence-bound RAG prototype with 15 searchable chunks, a 15 × 772 TF-IDF matrix, thresholded retrieval, and a 7-question sanity benchmark covering useful answer/refusal behavior.',
        contextLabel: 'Prototype / Academic Project',
        positioning:
          'A small explainable Retrieval-Augmented Generation prototype that demonstrates grounded answer behavior, retrieval thresholds, and refusal when local evidence is insufficient.',
        caseStudyStage: 'R&D',
        problem:
          'AI assistants can hallucinate or answer unsupported questions when they respond without checking whether the available evidence actually supports the answer.',
        system:
          'I built a local RAG prototype that ingests text files, chunks them, indexes the chunks with TF-IDF, retrieves evidence with cosine similarity, checks a minimum relevance threshold, and only answers when the retrieved context clears that threshold. When the local evidence is insufficient, the assistant refuses instead of guessing.',
        systemHighlights: [
          'Local source documents are ingested and chunked into a searchable evidence set.',
          'TF-IDF and cosine similarity retrieve the highest-scoring chunks for each query.',
          'A minimum relevance threshold controls whether the assistant answers or refuses.',
          'Offline retrieval-conditioned generation is the default, with optional OpenAI mode only when configured.',
        ],
        stack: ['Python', 'TF-IDF', 'Cosine Similarity', 'Local Retrieval', 'Threshold Refusal', 'Optional OpenAI Mode'],
        metrics: [
          {
            value: '7',
            label: 'local source documents',
          },
          {
            value: '15',
            label: 'searchable chunks',
          },
          {
            value: '15 × 772',
            label: 'TF-IDF matrix shape',
          },
          {
            value: 'TF-IDF + cosine similarity',
            label: 'retrieval method',
          },
          {
            value: '0.12',
            label: 'default minimum relevance threshold',
          },
          {
            value: '7/7',
            label: 'useful retrieval/refusal decisions on the small benchmark',
          },
        ],
        architecture: [
          {
            label: 'data/raw text files',
            detail: 'Seven local source documents provide the bounded knowledge corpus.',
          },
          {
            label: 'ingestion',
            detail: 'Text files are loaded into the prototype for local processing.',
          },
          {
            label: 'chunking',
            detail: 'Documents are split into 15 searchable chunks.',
          },
          {
            label: 'TF-IDF index',
            detail: 'The chunk corpus becomes a 15 × 772 TF-IDF matrix.',
          },
          {
            label: 'cosine similarity retrieval',
            detail: 'Queries retrieve top-k chunks by lexical similarity.',
          },
          {
            label: 'threshold check',
            detail: 'The assistant answers only when retrieved context clears the minimum relevance threshold.',
          },
          {
            label: 'answer or refuse',
            detail: 'In-domain questions are answered from local evidence; unsupported questions are refused.',
          },
        ],
        realWorldRelevance: [
          'Internal documentation assistants',
          'Course assistants',
          'Policy Q&A',
          'Small-business knowledge assistants',
          'Grounded AI patterns',
        ],
        limitations: [
          'Small educational corpus.',
          'Lexical TF-IDF retrieval, not neural embeddings.',
          'No Chroma/vector database.',
          'No persistent memory.',
          'No agents/tools.',
          'No voice/UI/deployment.',
          'The 7/7 result is a sanity benchmark, not broad accuracy.',
        ],
        nextImprovements: [
          'Add a lightweight UI for demonstrating answer/refusal behavior.',
          'Compare TF-IDF retrieval against an embedding-based retriever on the same corpus.',
          'Expand the benchmark beyond seven sanity-check questions.',
          'Add richer citation display and evaluation logging before claiming broader quality.',
        ],
        retrievalComparison: {
          title: 'Retrieval methods and tradeoffs',
          summary: 'How the implemented TF-IDF baseline differs from other retrieval options.',
          intro:
            'RAGeATM implements TF-IDF with cosine similarity and a refusal threshold. The other methods below are comparison options, not implemented features or a universal ranking. Their usefulness depends on the corpus, query types, evaluation set, and operating constraints.',
          methods: [
            {
              systemType: 'Exact keyword search',
              compares: 'Literal words or phrases in a query and document.',
              bestUseCase: 'Finding an exact identifier, name, or known phrase.',
              fatalWeakness: 'Misses relevant passages that use different wording.',
            },
            {
              systemType: 'TF-IDF',
              compares: 'Weighted term overlap using cosine similarity; implemented in this prototype.',
              bestUseCase: 'A small, inspectable lexical baseline when queries and documents share vocabulary.',
              fatalWeakness: 'Word overlap can miss paraphrases or retrieve passages with the right terms but the wrong meaning.',
            },
            {
              systemType: 'BM25',
              compares: 'Improved keyword relevance with term-frequency saturation and document-length normalization.',
              bestUseCase: 'A lexical baseline to compare against TF-IDF on the same documents and queries.',
              fatalWeakness: 'Lexical matching remains weak for synonyms and paraphrases without matching terms.',
            },
            {
              systemType: 'Static embeddings',
              compares: 'Fixed word vectors combined into a representation of a query or passage.',
              bestUseCase: 'Exploring similarity beyond literal word overlap with a simple vector representation.',
              fatalWeakness: 'A fixed vector for a word does not adapt to its meaning in each sentence.',
            },
            {
              systemType: 'Modern embedding models',
              compares: 'Learned query and passage vectors compared by similarity.',
              bestUseCase: 'Testing semantic retrieval for varied wording and paraphrases.',
              fatalWeakness: 'Similar passages can still be irrelevant; model choice, language coverage, and corpus fit matter.',
            },
            {
              systemType: 'Hybrid search',
              compares: 'Lexical and embedding retrieval combined into one candidate set or ranking.',
              bestUseCase: 'Corpora where both exact terminology and varied wording matter.',
              fatalWeakness: 'Fusion choices need evaluation and add indexing and operational complexity.',
            },
            {
              systemType: 'Reranked retrieval',
              compares: 'A second model scores query–passage relevance within an initial candidate set.',
              bestUseCase: 'Testing whether a smaller set of more relevant passages improves downstream answers.',
              fatalWeakness: 'Adds latency and cost, and cannot recover relevant passages missing from the candidate set.',
            },
          ],
          futureWork:
            'A useful next evaluation would compare TF-IDF, BM25, and an embedding retriever on the same documented queries, including paraphrases, ambiguous requests, and unsupported questions. Report retrieval relevance, refusal errors, latency, and run conditions before drawing broader conclusions.',
        },
        currentState: 'Local RAG prototype',
        githubUrl: 'https://github.com/DavidBraun777/RAGeATM',
        myRole: 'Sole builder for ingestion, retrieval, thresholding, generation modes, and benchmark notes',
        coreConstraint:
          'Evidence boundary: the system has to refuse unsupported questions when local retrieval does not clear the relevance threshold.',
        outcome:
          'Indexed 7 local source documents into 15 searchable chunks and produced 7/7 useful retrieval/refusal decisions on a small sanity benchmark using TF-IDF + cosine similarity with a default 0.12 threshold.',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'Demo Behavior',
            status: 'available',
            summary:
              'The prototype demonstrates both grounded answers and explicit refusal when the local corpus does not support a question.',
            items: [
              'In-domain questions retrieve local context and answer from that evidence.',
              'An out-of-domain question such as "What is the capital of France?" refuses because the local corpus does not support the answer.',
            ],
          },
          {
            id: 'architecture',
            title: 'Architecture / Pipeline',
            status: 'available',
            summary:
              'The flow is intentionally small and inspectable: local files become chunks, chunks become TF-IDF features, retrieval is thresholded, and generation depends on retrieved evidence.',
            items: [
              'data/raw text files -> ingestion -> chunking -> TF-IDF index.',
              'Cosine similarity returns top-k local evidence.',
              'Minimum relevance threshold decides whether to answer or refuse.',
            ],
          },
          {
            id: 'operations',
            title: 'Grounding Controls',
            status: 'available',
            summary:
              'The main applied lesson is the refusal boundary, not broad RAG accuracy.',
            items: [
              'Top-k retrieval with minimum relevance threshold.',
              'Offline retrieval-conditioned generation by default.',
              'Optional OpenAI mode only when configured.',
            ],
          },
          {
            id: 'artifacts',
            title: 'Artifacts & Evidence',
            status: 'available',
            summary:
              'The evidence is intentionally modest and quantified as a sanity benchmark.',
            items: [
              '7 local source documents, 15 searchable chunks, and 15 × 772 TF-IDF feature matrix.',
              '7-question sanity benchmark with 7/7 useful retrieval/refusal decisions.',
              'Public GitHub repository linked for code review.',
            ],
            links: [
              { label: 'Read the recorded evaluation', href: 'https://github.com/DavidBraun777/RAGeATM/blob/master/docs/evaluation_results.md' },
              { label: 'Inspect the evaluation runner', href: 'https://github.com/DavidBraun777/RAGeATM/blob/master/scripts/run_evaluation.py' },
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
          'Broader lead-automation direction informed by the collaborative WeatherForge academic project and the DGM architecture rather than presented as a finished standalone system.',
        caseStudyStage: 'R&D',
        problem:
          'Lead generation teams lose momentum when signal detection, qualification, call handling, and CRM handoff are split across disconnected tools and manual follow-up.',
        system:
          'StormIQ is a proposed larger workflow direction. It uses the collaborative WeatherForge academic project as a reference for an event-signal layer and DGM as a reference for orchestration, then defines how qualification, decisioning, and CRM handoff could fit together. No integrated WeatherForge-DGM product is claimed here.',
        systemHighlights: [
          'The collaborative WeatherForge academic project provides a reference pattern for storm and territory signals.',
          'DGM provides an orchestration reference for state, branching, and human-review seams.',
          'StormIQ is the proposed umbrella workflow tying signal, qualification, and downstream handoff together.',
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
          'StormIQ is framed as an in-progress program direction; WeatherForge and DGM are reference projects, not evidence of a current integrated product.',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'System Walkthrough',
            status: 'planned',
            summary:
              'A full StormIQ walkthrough is intentionally deferred until the intended signal and orchestration layers operate together as one believable system.',
            items: [
              'Umbrella walkthrough to be added after the intended signal and orchestration flows are operating together.',
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
              'WeatherForge\'s collaborative academic artifacts inform the proposed structured event-signal layer.',
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
              'Updated umbrella architecture diagram to be added after the intended signal and orchestration boundaries are finalized.',
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
          'I built a mobile system with a NestJS API, BullMQ-backed worker processing, persisted notifications, and inventory lifecycle rules. Buyers get scored matches and alerts, while sellers manage inventory, offers, and inbound inquiries from a mobile workflow.',
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
        realWorldRelevance: [
          'Wholesale inventory discovery and buyer matching.',
          'Mobile inventory, offer, and inquiry workflows.',
          'Background notification processing tied to inventory changes.',
        ],
        limitations: [
          'The system remains a beta pilot; broad adoption, production scale, and long-term reliability are not established by this case study.',
          'The public screenshot shows the inventory feed. It does not independently demonstrate every lifecycle transition or queue failure mode.',
        ],
        proofSections: [
          {
            id: 'walkthrough',
            title: 'Mobile inventory feed',
            status: 'available',
            summary:
              'The captured mobile feed shows how newly published wholesale inventory appears to a buyer.',
            items: [
              'The screenshot is an existing application capture.',
              'Buyer matching, seller inventory, and offers are the pilot workflows described in this case study.',
            ],
            links: [
              { label: 'Open the mobile feed screenshot', href: '/images/projects/dealerflow-feed.png' },
            ],
          },
          {
            id: 'operations',
            title: 'Implementation scope',
            status: 'available',
            summary:
              'I built the NestJS backend and Expo mobile client around inventory changes and the notifications they produce.',
            items: [
              'PostgreSQL and Prisma store application state.',
              'BullMQ and Redis handle background notification work.',
              'Inventory and offer transitions are the central state-consistency constraint.',
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
        shortTitle: 'Public production platform',
        summary:
          'Production platform and delivery stack supporting a nonprofit serving the visually impaired community.',
        contextLabel: 'Public Production Proof',
        caseStudyStage: 'Production',
        problem:
          'Mission-driven organizations need dependable public systems, but production reliability and accessibility often get treated as separate concerns instead of one delivery problem.',
        system:
          'I build and maintain the React application and its delivery path on AWS Lightsail. Nginx handles incoming traffic and TLS, Docker packages the frontend, and GitHub Actions supports repeatable releases. Accessibility review and infrastructure maintenance remain part of the same engineering responsibility.',
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
        realWorldRelevance: [
          'Accessible public services for a nonprofit community.',
          'Repeatable application releases on a maintained cloud host.',
          'Ongoing ownership of application, deployment, and infrastructure changes.',
        ],
        limitations: [
          'The live website and deployment diagram show the public surface and architecture. This page does not publish an uptime measurement or an independent accessibility audit.',
          'Serving the nonprofit since 2020 describes the engagement history, not a measured availability percentage.',
        ],
        proofSections: [
          {
            id: 'walkthrough',
            title: 'Live nonprofit website',
            status: 'available',
            summary:
              'The public website is the visitor-facing part of the platform I build and maintain for VIFG.',
            items: [
              'The engagement spans application development, infrastructure, and releases.',
              'Screen-reader compatibility, keyboard navigation, and contrast are delivery requirements for the community it serves.',
            ],
            links: [
              { label: 'Visit the VIFG website', href: 'https://www.vifg.org/home' },
            ],
          },
          {
            id: 'architecture',
            title: 'Deployment architecture',
            status: 'available',
            summary:
              'The diagram shows the request path and how application changes reach the AWS host.',
            items: [
              'Nginx terminates TLS and forwards traffic to the Dockerized frontend on Lightsail.',
              'GitHub Actions supports the image-publishing and deployment path.',
              'The diagram describes the architecture; it is not a monitoring report.',
            ],
            links: [
              { label: 'Open the deployment diagram', href: '/images/projects/vifg-deployment.svg' },
            ],
          },
          {
            id: 'operations',
            title: 'Ongoing delivery responsibilities',
            status: 'available',
            summary:
              'My role continues beyond the application code into the infrastructure and release process.',
            items: [
              'Maintain host-level web serving and TLS configuration.',
              'Keep Docker packaging and the release workflow aligned with application changes.',
              'Review accessibility issues alongside feature work and maintenance.',
            ],
          },
        ],
      },
      ...liveClientWebsites,
    ],
  },
  {
    id: 'past-client-work',
    title: 'Past client work',
    intro: 'Historical client implementation work, with current status and contribution boundaries kept explicit.',
    systems: [time2Move],
  },
]

const orderedSystemIds = [
  'vifg-nonprofit-platform',
  'weatherforge',
  'rageatm',
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

/** Validate selected public proof against its registry before publishing it. */
export function selectFeaturedSystems(registry: ReadonlyMap<string, FeaturedSystemCaseStudy>, ids: readonly string[]): FeaturedSystemCaseStudy[] {
  return ids.map((id) => {
    const system = registry.get(id)

    if (!system) {
      throw new Error(`Missing featured system for id: ${id}`)
    }

    return system
  })
}

export const featuredSystems = selectFeaturedSystems(systemById, orderedSystemIds)

export const allSystems: FeaturedSystemCaseStudy[] = [
  ...featuredSystems,
  ...systemThemes
    .flatMap((theme) => theme.systems.map((system) => ({ ...system, themeTitle: theme.title })))
    .filter((system) => !orderedSystemIds.includes(system.id)),
]

export const productionSystems = allSystems.filter(
  (system) => system.caseStudyStage === 'Production'
)

export const pilotSystems = featuredSystems.filter((system) => system.caseStudyStage === 'Pilot')

export const researchSystems = featuredSystems.filter((system) => system.caseStudyStage === 'R&D')

export const historicalSystems = allSystems.filter((system) => system.caseStudyStage === 'Historical')

export const supportingSystems = allSystems.filter(
  (system) => !orderedSystemIds.includes(system.id)
)

export function getSystemById(id: string) {
  return systemById.get(id) ?? null
}

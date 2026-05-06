export interface ProofSection {
  id: 'walkthrough' | 'architecture' | 'operations' | 'artifacts'
  title: string
  status: 'available' | 'planned'
  summary: string
  items: string[]
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

export interface RetrievalCapabilityLadderLevel {
  level: number
  systemType: string
  compares: string
  meaningCaptured: string
  questionUnderQuestionAbility: string
  personalContextAbility: string
  realWorldGrounding: string
  bestUseCase: string
  fatalWeakness: string
}

export interface RetrievalCapabilityInterpretation {
  method: string
  meaning: string
}

export interface RetrievalCapabilityLadder {
  title: string
  summary: string
  intro: string
  safeClaim: string
  guardrail: string
  levels: RetrievalCapabilityLadderLevel[]
  heuristicNote: string
  interpretations: RetrievalCapabilityInterpretation[]
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
  caseStudyStage: 'Production' | 'Pilot' | 'R&D'
  problem: string
  system: string
  systemHighlights: string[]
  stack: string[]
  metrics?: CaseStudyMetric[]
  architecture?: ArchitectureStep[]
  dataSources?: string[]
  dashboardViews?: string[]
  realWorldRelevance?: string[]
  limitations?: string[]
  nextImprovements?: string[]
  retrievalCapabilityLadder?: RetrievalCapabilityLadder
  currentState: string
  image?: string
  imageAlt?: string
  visualSurface?: 'dark' | 'light'
  visualAspect?: 'landscape' | 'portrait'
  externalUrl?: string
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
          'A Minnesota severe-weather analytics dashboard that turns large NOAA weather datasets into county-level risk views, cleaned analytics layers, and decision-support reporting surfaces.',
        oneSentenceOutcome:
          'Transformed large NOAA source data into Minnesota-focused storm-event records, station-day observations, county joins, and a Python Shiny + Plotly dashboard for severe-weather risk exploration.',
        contextLabel: 'Prototype / Academic Project',
        positioning:
          'A data engineering and analytics dashboard project that transforms large NOAA weather datasets into county-level severe-weather risk insights for Minnesota.',
        caseStudyStage: 'R&D',
        problem:
          'Public weather data is large, messy, and hard to use directly for decision support. NOAA archives contain valuable severe-weather and daily-observation records, but the raw files need filtering, cleaning, unit conversion, county joins, and clear dashboard views before they become useful for Minnesota risk analysis.',
        system:
          'I filtered, cleaned, transformed, and packaged NOAA Storm Events and GHCN-Daily data into Minnesota-focused analytics layers, then built dashboard views for statewide trends, county-level impacts, historical time progression, weather context, methods, and live-alert exploration.',
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
        ],
        nextImprovements: [
          'Add polished screenshot evidence from the dashboard views.',
          'Document reproducible data refresh steps for the Parquet analytics layers.',
          'Expand validation notes around county joins, population anchors, and historical-data caveats.',
          'Explore additional states only after the Minnesota workflow is fully documented.',
        ],
        currentState: 'Applied dashboard prototype',
        githubUrl: 'https://github.com/DavidBraun777/WeatherForge',
        myRole: 'Sole builder for data pipeline, analytics layers, dashboard, and case-study documentation',
        coreConstraint:
          'Data trust: the dashboard has to make large public datasets usable while clearly labeling historical completeness issues and contextual weather averages.',
        outcome:
          'Curated 55,384 cleaned Minnesota storm-event records and 9,008,748 station-day observations into reusable Parquet layers and a Python Shiny + Plotly dashboard spanning all 87 Minnesota counties.',
        proofSections: [
          {
            id: 'walkthrough',
            title: 'Dashboard Views',
            status: 'available',
            summary:
              'The project contains a dashboard structure with multiple decision-support views rather than a single static chart.',
            items: [
              'Overview, County Impacts, Weather Context, Time Progression, Statewide Trends, Methods/Pipeline, and Live Alerts views.',
              'Screenshot placeholders remain on the portfolio page until final dashboard captures are added.',
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
              'The case study uses verified project artifact counts and keeps limitations explicit.',
            items: [
              '~35 GB raw NOAA source archive used in the working project.',
              '55,384 cleaned Minnesota storm-event records and 9,008,748 station-day observations.',
              'Public GitHub repository linked for code review.',
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
        retrievalCapabilityLadder: {
          title: 'Future Work: Retrieval Capability Ladder',
          summary:
            'A staged view of how RAGeATM could grow from simple lexical retrieval into a more measurable, semantic, context-aware, and eventually multimodal research-assistant harness.',
          intro:
            'RAGeATM is currently best understood as a small but useful RAG prototype: enough to demonstrate retrieval, grounding, and evaluation discipline, but not yet a production research platform. The next work is not simply to make it bigger. The stronger path is to make retrieval more measurable, reproducible, semantic, and context-aware while avoiding overclaims about what current AI systems truly understand.',
          safeClaim:
            'TF-IDF and BM25 retrieve based primarily on lexical overlap, while embedding-based and LLM-assisted retrieval can better capture semantic similarity, paraphrase, and conceptual relevance. This makes them more capable of retrieving documents related to the user’s underlying intent, although they should not be described as fully understanding the ‘question beneath the question’ in a human sense.',
          guardrail:
            'LLMs can approximate deeper intent by modeling semantic context, conversational history, and inferred goals, but this remains probabilistic pattern-based reasoning rather than true human understanding.',
          levels: [
            {
              level: 1,
              systemType: 'Exact keyword search',
              compares: 'Literal word/string overlap',
              meaningCaptured: '5%',
              questionUnderQuestionAbility: '0%',
              personalContextAbility: '0%',
              realWorldGrounding: '0%',
              bestUseCase: 'Finding exact names, IDs, phrases, codes',
              fatalWeakness: 'Misses anything phrased differently',
            },
            {
              level: 2,
              systemType: 'TF-IDF',
              compares: 'Weighted term overlap',
              meaningCaptured: '10-20%',
              questionUnderQuestionAbility: '0-5%',
              personalContextAbility: '0%',
              realWorldGrounding: '0%',
              bestUseCase: 'Simple document retrieval where vocabulary matches',
              fatalWeakness: 'No real semantics; treats text as bag-of-words',
            },
            {
              level: 3,
              systemType: 'BM25',
              compares: 'Improved keyword relevance with saturation/length normalization',
              meaningCaptured: '20-35%',
              questionUnderQuestionAbility: '5%',
              personalContextAbility: '0%',
              realWorldGrounding: '0%',
              bestUseCase: 'Strong classic search baseline',
              fatalWeakness: 'Still mostly lexical; synonyms and paraphrases are weak',
            },
            {
              level: 4,
              systemType: 'Static embeddings',
              compares: 'Word/document vectors learned from language patterns',
              meaningCaptured: '35-50%',
              questionUnderQuestionAbility: '10-20%',
              personalContextAbility: '0-5%',
              realWorldGrounding: '0%',
              bestUseCase: 'Finding semantically related text',
              fatalWeakness: 'Limited context sensitivity',
            },
            {
              level: 5,
              systemType: 'Modern embedding models',
              compares: 'Query/document meaning vectors',
              meaningCaptured: '55-75%',
              questionUnderQuestionAbility: '25-45%',
              personalContextAbility: '5-15%',
              realWorldGrounding: '0-5%',
              bestUseCase: 'RAG retrieval, semantic search, paraphrase matching',
              fatalWeakness: 'Can retrieve conceptually similar but wrong context',
            },
            {
              level: 6,
              systemType: 'Hybrid search',
              compares: 'BM25 + embeddings',
              meaningCaptured: '65-85%',
              questionUnderQuestionAbility: '30-50%',
              personalContextAbility: '5-15%',
              realWorldGrounding: '0-5%',
              bestUseCase: 'Serious RAG systems',
              fatalWeakness: 'More complex; requires tuning and evaluation',
            },
            {
              level: 7,
              systemType: 'Reranked retrieval',
              compares: 'Initial retrieval + LLM/cross-encoder relevance judgment',
              meaningCaptured: '75-90%',
              questionUnderQuestionAbility: '40-60%',
              personalContextAbility: '10-20%',
              realWorldGrounding: '0-5%',
              bestUseCase: 'High-quality RAG retrieval',
              fatalWeakness: 'Slower/costlier; still depends on retrieved candidates',
            },
            {
              level: 8,
              systemType: 'LLM reading retrieved context',
              compares: 'Retrieved docs + generated reasoning',
              meaningCaptured: '80-95% for answer synthesis',
              questionUnderQuestionAbility: '50-70%',
              personalContextAbility: '15-35%',
              realWorldGrounding: '0-10%',
              bestUseCase: 'Answering from documents with explanation',
              fatalWeakness: 'Can hallucinate, overgeneralize, or sound more certain than it is',
            },
            {
              level: 9,
              systemType: 'LLM with memory/user profile',
              compares: 'Query + history + user goals + documents',
              meaningCaptured: '80-95%',
              questionUnderQuestionAbility: '65-80%',
              personalContextAbility: '50-75%',
              realWorldGrounding: '5-15%',
              bestUseCase: 'Personalized assistants, tutoring, coaching, project guidance',
              fatalWeakness: 'Risk of assuming too much about the user',
            },
            {
              level: 10,
              systemType: 'Agentic AI with tools',
              compares: 'Text + memory + documents + actions + external systems',
              meaningCaptured: '85-95%',
              questionUnderQuestionAbility: '70-85%',
              personalContextAbility: '60-80%',
              realWorldGrounding: '20-45%',
              bestUseCase: 'Research assistants, workflow automation, coding agents',
              fatalWeakness: 'Tool errors, bad planning, weak verification',
            },
            {
              level: 11,
              systemType: 'Multimodal grounded AI',
              compares: 'Text + vision + audio + environment + actions',
              meaningCaptured: '85-98%',
              questionUnderQuestionAbility: '75-90%',
              personalContextAbility: '70-85%',
              realWorldGrounding: '50-75%',
              bestUseCase: 'Real-world assistance, robotics, field analysis',
              fatalWeakness: 'Still not human lived experience',
            },
            {
              level: 12,
              systemType: 'Human-level social/contextual understanding',
              compares: 'Language + memory + embodiment + relationships + lived experience',
              meaningCaptured: '95-100%',
              questionUnderQuestionAbility: '90-100%',
              personalContextAbility: '90-100%',
              realWorldGrounding: '90-100%',
              bestUseCase: 'Real relational discernment',
              fatalWeakness: 'Current AI does not truly have this',
            },
          ],
          heuristicNote:
            'These percentages are heuristic gauges, not universal benchmark results. They are meant to communicate increasing capability scope, not claim exact measured performance.',
          interpretations: [
            {
              method: 'TF-IDF',
              meaning: 'These documents share important words with the query.',
            },
            {
              method: 'BM25',
              meaning: 'These documents share important words in a more search-optimized way.',
            },
            {
              method: 'Embeddings',
              meaning: 'These documents are conceptually close to the query.',
            },
            {
              method: 'Hybrid retrieval',
              meaning: 'These documents match both the words and the meaning.',
            },
            {
              method: 'Reranking',
              meaning:
                'Of the retrieved documents, these are probably most relevant to the user’s actual question.',
            },
            {
              method: 'LLM + memory',
              meaning:
                'Given this user’s history, goals, and wording, this may be what they are really asking.',
            },
            {
              method: 'Grounded AI',
              meaning:
                'Given the person’s behavior, environment, constraints, and history, this is probably the deeper issue.',
            },
          ],
          futureWork:
            'The practical future work for RAGeATM is to climb this ladder carefully: first by improving reproducibility and evaluation, then by comparing lexical, embedding, hybrid, and reranked retrieval, then by testing whether memory, user goals, and multimodal inputs actually improve retrieval quality without creating unjustified confidence.',
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
        shortTitle: 'Public production platform',
        summary:
          'Production platform and delivery stack supporting a nonprofit serving the visually impaired community.',
        contextLabel: 'Public Production Proof',
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

import type { SystemCaseStudy } from './systems'

// Public editorial copy only. The private audit and evidence record are not build inputs.
export const time2Move = {
  id: 'time2move',
  name: 'Time2Move',
  displayTitle: 'Time2Move: Real Estate Website & Inquiry Workflows',
  summary:
    "I built the original Time2Move website for Dustin Marmon, combining regional real estate pages, interactive calculators and six inquiry forms with a shared lead-processing backend. The project includes CRM integration, backup-delivery handling and operational documentation. This case study separates implemented capabilities, local verification and the client's later independent website direction.",
  positioning:
    'I designed and developed a regional real estate website for Dustin Marmon, connecting visitor tools and six inquiry journeys to a shared backend with CRM integration and backup-delivery handling.',
  contextLabel: 'Past client project',
  caseStudyStage: 'Historical',
  currentState: 'Past client project · Continued independently',
  problem:
    'Real estate visitors needed clear service information and ways to ask for help. Staff needed inquiries with enough context to understand what the visitor wanted and where the request began.',
  system:
    'A shared regional website and inquiry-processing backend with contact validation, attribution, intent classification, CRM delivery attempts, backup notifications and documented manual recovery.',
  systemHighlights: [
    'Shared Minnesota, Wisconsin and Florida routing and regional content.',
    'Six native inquiry forms connected to one lead-processing contract.',
    'Mortgage and fee estimates, review storage and Minnesota IDX wrappers.',
  ],
  stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python', 'FastAPI', 'Pydantic', 'Redis', 'Upstash', 'Follow Up Boss', 'Resend', 'FRED', 'Google reviews', 'IDX Broker'],
  myRole: 'Website design, frontend/backend development, integration and operational documentation',
  coreConstraint:
    'Carry visitor intent and context into an operational follow-up process while making provider responsibilities and failure behavior explicit.',
  outcome:
    'Implemented website and integration capabilities with a bounded local audit; exact client handoff and live provider receipt remain unconfirmed.',
  proofSections: [],
  successorLink: {
    href: 'https://hombuzz.com/',
    label: 'Current business website — Hombuzz',
    context:
      'The original time2move.io deployment is inactive. The client continued the business online as Hombuzz, with a new direction and independent development. The current website does not represent my audited Time2Move implementation.',
  },
  story: {
    scopeNote:
      'This account describes my latest local implementation, audited on October 27, 2026. The exact client-handoff snapshot and the date my involvement ended remain unconfirmed. Implemented features and local checks are distinguished from proven deployment or delivery; no live CRM or email receipt was established.',
    overview: [
      'Time2Move was a real estate website I built for Dustin Marmon under the Prime Location identity. It brought buyer and seller information, regional service pages, property-search entry points and inquiry forms into one experience. My work extended beyond the visible pages to the systems that prepare an inquiry for follow-up.',
      'The website had two audiences: visitors exploring a service or estimating a payment, and staff receiving their inquiries. I connected six native forms to a shared backend that validates contact information, classifies intent and carries attribution and consent metadata into delivery attempts. Supporting work included calculators, rate-data adapters, a structured review integration and Minnesota IDX embeds.',
    ],
    atAGlance: [
      { label: 'Client', value: 'Dustin Marmon / original Time2Move–Prime Location website' },
      { label: 'My role', value: 'Website design and frontend/backend implementation; integrations, tests and operational documentation' },
      { label: 'Scope', value: 'Regional website, inquiry workflows, visitor tools and supporting data integrations' },
      { label: 'Evidence basis', value: 'Local implementation audit, October 27, 2026' },
    ],
    capabilities: [
      {
        title: 'A shared regional website',
        paragraphs: [
          'I built shared layouts, responsive navigation and state-aware links for Minnesota, Wisconsin and Florida. Buyer and seller information, consultation pages, educational resources, team and lender information, and functioning article routes gave visitors several paths into the business. Central regional content allowed service information to vary without maintaining a separate application for each state.',
        ],
      },
      {
        title: 'Lead processing with context',
        paragraphs: [
          'I connected six inquiry journeys to one submission contract: homepage consultation, contact, cash offer, home valuation, foreclosure assistance and giveaway entry. The backend validates and normalizes contact details, classifies requests, includes attribution and consent metadata, and assigns request IDs for diagnostics. I implemented Follow Up Boss event delivery with retries, a Resend backup-notification path and optional failure alerts.',
        ],
      },
      {
        title: 'Visitor tools and supporting integrations',
        paragraphs: [
          'Fee comparisons and mortgage calculators made estimate assumptions interactive. FRED adapters supplied rate-retrieval and trend-display paths. Google review adapters fed normalized Redis records, deduplication, serving caches, migration and rebuilding. Minnesota property pages wrapped IDX Broker-hosted search, featured listings and open houses; IDX supplied the listings, search engine and registration experience.',
        ],
      },
    ],
    architecture: {
      intro:
        'The application connects website interactions to distinct processing and provider boundaries. These flows describe the audited implementation, including conditional delivery paths.',
      flows: [
        {
          title: 'Native inquiry flow',
          steps: [
            'Next.js / React: six native forms collect visitor intent, contact details, attribution and consent fields.',
            'A same-origin submission is forwarded to Python / FastAPI for schema validation, normalization, classification and request diagnostics.',
            'The Follow Up Boss adapter attempts event delivery and retries selected transient failures.',
            'If primary delivery fails, the backend attempts a Resend backup notification and optional alert; if both paths fail, it returns an error.',
          ],
          boundary:
            'Follow Up Boss owns CRM records and contact matching. CRM administrators own assignment, automation and follow-up. Backup acceptance is not CRM receipt; recovery is manual, with no durable outbox or replay.',
        },
        {
          title: 'Estimate tools and rate data',
          steps: [
            'Visitor inputs drive local fee and mortgage calculations.',
            'Rate adapters request FRED data for current-rate and trend displays, with fallback behavior when data is unavailable.',
          ],
          boundary: 'FRED supplies external rate data. These are estimate tools, with input-consistency and fallback-freshness gaps identified by the audit.',
        },
        {
          title: 'Review ingestion and serving',
          steps: [
            'Google Business Profile / Places adapters provide review-ingestion paths.',
            'Normalized, deduplicated records and indexes in Redis / Upstash support versioned serving caches, migration and rebuilding.',
          ],
          boundary: 'Google supplies review content. Fake-store tests establish selected local behavior, not live ingestion, concurrency guarantees or testimonial authenticity.',
        },
        {
          title: 'Minnesota property search',
          steps: [
            'Regional website pages provide navigation, embeds and outbound vendor links.',
            'IDX Broker hosts listing search, featured properties, open houses and registration.',
          ],
          boundary: 'IDX registrations remain vendor traffic and do not enter the six-form native inquiry pipeline. Wisconsin and Florida search scaffolds are not additional implemented IDX integrations.',
        },
      ],
    },
    workflows: [
      {
        title: 'An inquiry from visitor intent to recovery',
        paragraphs: [
          'A consultation visitor chooses an interest, enters contact details and accepts the displayed consent text. The form adds its identifier, page context and attribution. The backend normalizes the details, classifies the inquiry and attempts CRM delivery. If that path fails, it attempts backup email notification. Request IDs connect the response to operational diagnostics.',
          'The runbook explains how staff can inspect backup email, search the CRM by email or phone, create a missing record and retain the request ID. That is a documented human recovery procedure, not automatic replay. The local form capture below shows a simulated failure with entered values retained.',
        ],
      },
      {
        title: 'A mortgage estimate with visible assumptions',
        paragraphs: [
          'A visitor adjusts price, down payment, rate and term, then sees principal and interest alongside taxes, insurance and other costs. The local audit demonstrated the calculation path with example inputs and external rate data disabled. It also exposed inconsistent inputs when a reduced home price falls below the stored down payment, and fallback rates that look freshly updated. The tool demonstrates interaction and arithmetic, not a lender decision or a verified market-rate result.',
        ],
      },
      {
        title: 'Reviews as a data workflow',
        paragraphs: [
          'I implemented provider adapters and a storage layer that normalizes review identifiers, deduplicates records and builds public caches from structured data. Migration handles legacy snapshots; rebuilding recreates serving caches from canonical records. Nine local review tests exercised selected normalization, fake Redis writes, rebuilding and migration paths. The static fallback testimonials did not establish authentic customer outcomes, and live ingestion and concurrent synchronization were not verified.',
        ],
      },
    ],
    tradeoffs: [
      {
        title: 'One form contract, distinct visitor intent',
        paragraphs: ['A shared contract gives six forms a common validation and delivery path while retaining form identifiers, source classification and request context. It concentrates integration work, but also makes shared acknowledgement validation a critical boundary: a mistaken success response can affect every form using that client.'],
      },
      {
        title: 'Hosted services with explicit ownership',
        paragraphs: ['Hosted IDX pages keep listing search within the provider’s system instead of introducing a separate inventory-sync implementation. The tradeoff is dependence on vendor behavior and a separate registration path. The website adapter and the CRM administrator likewise have different responsibilities; configuring a connection does not establish that follow-up automation is operating.'],
      },
      {
        title: 'Backup notification versus durable recovery',
        paragraphs: ['Retries address selected transient errors, and backup notification offers a recovery option when the CRM path fails. Without a durable lead queue or replay mechanism, recovery depends on provider acceptance and human action. Email acceptance cannot be treated as proof that a CRM record exists or follow-up occurred.'],
      },
    ],
    technicalDetails: [
      {
        title: 'Validation, attribution and diagnostics',
        paragraphs: ['FastAPI and Pydantic enforce the shared payload shape. Contact normalization, intent classification, honeypot and rate-limiting checks prepare requests for delivery. Attribution, explicit consent fields and version/timestamp metadata provide context, but they do not form a complete immutable retained consent record. Request IDs and structured diagnostics support investigation without claiming guaranteed delivery.'],
      },
      {
        title: 'Configuration and operational documentation',
        paragraphs: ['The project documents Vercel frontend and Railway backend hosting, deployment configuration and CI definitions. Architecture notes, integration-ownership guidance, operations runbooks and an owner-facing explanation describe how the pieces fit together. These are implemented configuration and documentation artifacts; the audit did not establish execution of this exact revision in production.'],
      },
    ],
    audit: {
      date: 'October 27, 2026 (America/Chicago)',
      snapshot: 'Source revision 515deb2 with the then-current dependency-lock changes, checked in an isolated local copy using Node 22.',
      checks: [
        { label: 'Existing tests', result: 'Passed', detail: '34 tests: 6 lead-web, 9 reviews and 19 backend. Provider retries, backup responses and Redis behavior used mocks or fake stores.' },
        { label: 'Type checking', result: 'Passed', detail: 'The audited local source passed TypeScript checking.' },
        { label: 'Production build', result: 'Passed', detail: 'The application compiled and built locally; this does not establish complete production readiness.' },
        { label: 'Lint', result: 'Failed', detail: '29 errors and 12 warnings remained in the audited application.' },
        { label: 'Local browser checks', result: 'Observed', detail: 'Form error feedback and retained fields, simulated backup-success feedback, calculator interaction, article navigation and sampled mobile rendering. External requests were blocked and submissions were synthetic.' },
      ],
      limitations: [
        'Delivery acknowledgement validation was too permissive; retries and backup notifications do not guarantee receipt or durable replay.',
        'Light browser preference exposed contrast problems. Keyboard, labeling and other accessibility work remained incomplete.',
        'Static testimonials, sample business content and fallback-rate freshness needed clearer provenance. They support no revenue, conversion, lead-volume, uptime or savings claims.',
        'Mortgage-input edge cases, unfinished downloads and disconnected search filters remained. Working article routes did not make every resource complete.',
      ],
      lesson:
        'The clearest lesson is to make status and provenance explicit: sample versus observed data, accepted versus delivered requests, and local implementation versus a confirmed release. A successful build is useful evidence, but it cannot substitute for these distinctions.',
    },
    illustration: {
      src: '/images/projects/time2move-contact-simulated-error.png',
      alt: 'Time2Move contact form retaining synthetic example values beneath a simulated delivery-unavailable error.',
      width: 769,
      height: 1051,
      caption: 'Synthetic contact-form failure in the local audited build, October 27, 2026. Dark browser preference; response simulated in the browser, with no lead delivered.',
    },
  },
} satisfies SystemCaseStudy

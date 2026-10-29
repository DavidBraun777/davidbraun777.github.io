import type { SystemCaseStudy } from './systems'

// Public editorial copy only. The private audit and evidence record are not build inputs.
export const time2Move = {
  id: 'time2move',
  name: 'Time2Move',
  displayTitle: 'Time2Move: Real Estate Lead & CRM Workflows',
  summary:
    'I built the original Time2Move real estate website and connected inquiry workflows for Dustin Marmon, including customer tools and Follow Up Boss integration. Substantial implementation work was completed before the project paused; the client later pursued an independent direction.',
  positioning:
    'I worked with Dustin Marmon to build a real estate website and connected lead-management workflow. I owned the frontend, backend and integrations, writing the original application code from scratch with established frameworks and third-party services. Substantial implementation work was completed before the project paused.',
  contextLabel: 'Past client project',
  caseStudyStage: 'Historical',
  currentState: 'Past client project · Implementation paused',
  problem:
    'Connect useful real estate information and customer tools with inquiries that carry enough context for business follow-up.',
  system:
    'A regional website with shared inquiry processing, CRM delivery integration and supporting data services. AI remained part of the intended direction.',
  systemHighlights: [
    'Regional real estate pages and customer-facing tools.',
    'Six inquiry journeys connected to shared validation and CRM delivery logic.',
    'Provider integrations, API configuration and operational documentation.',
  ],
  stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python', 'FastAPI', 'Pydantic', 'Redis', 'Upstash', 'Follow Up Boss', 'Resend', 'FRED', 'Google reviews', 'IDX Broker'],
  myRole: 'Frontend and backend implementation, service integrations and operational documentation',
  coreConstraint:
    'Connect visitor intent to business follow-up while accounting for provider failures and the operational work beyond application code.',
  outcome:
    'Substantial website and integration implementation; work paused before the full intended system was completed.',
  proofSections: [],
  successorLink: {
    href: 'https://hombuzz.com/',
    label: 'Current business website — Hombuzz',
    context:
      'The original time2move.io deployment is inactive. Hombuzz is the business’s subsequent website, developed independently after my Time2Move involvement. It shows the client’s later direction; this case study documents my original contribution.',
  },
  story: {
    scopeNote:
      'The implementation was checked locally with mocked providers and synthetic submissions. Those checks do not establish live CRM or email receipt, actual customer use, or the final client-handoff state.',
    overview: [
      'The goal was a connected customer journey: visitors could explore regional services, use helpful tools, explain their needs and submit an inquiry prepared for business follow-up. We wanted the website, CRM and supporting services to work together, with a broader ambition to incorporate AI. The implemented work centered on the website, CRM connections and workflow automation; AI remained part of the intended direction.',
    ],
    atAGlance: [
      { label: 'Client', value: 'Dustin Marmon' },
      { label: 'My role', value: 'Frontend, backend and integrations' },
      { label: 'Scope', value: 'Real estate website, customer tools and CRM workflows' },
    ],
    capabilities: [
      {
        title: 'Regional website and customer tools',
        paragraphs: [
          'I built shared layouts and regional content for Minnesota, Wisconsin and Florida, with buyer and seller information, articles, mortgage estimates and fee comparisons. I integrated rate-data and review services, plus Minnesota property-search embeds. My work connected these tools to the website; IDX Broker supplied the hosted listings and search experience, and Google supplied review content.',
        ],
      },
      {
        title: 'Shared inquiry processing and CRM integration',
        paragraphs: [
          'I connected six inquiry journeys: consultation, contact, cash offer, home valuation, foreclosure assistance and giveaway entry. A shared backend validates contact details, identifies the request type and carries attribution and consent fields into Follow Up Boss delivery attempts. This kept each visitor’s purpose visible while avoiding six separate integration paths.',
        ],
      },
      {
        title: 'Supporting services and operational preparation',
        paragraphs: [
          'I implemented API configuration, provider adapters and operational documentation alongside the application. I reviewed security practices and added server-side validation, submission rate limits and honeypot checks. Runbooks described provider responsibilities and recovery steps, making the work beyond the visible interface explicit.',
        ],
      },
    ],
    decision: [
      'I chose one inquiry-to-CRM path with a fallback when the primary provider could not accept a request. The backend retries selected Follow Up Boss failures, then attempts a Resend backup notification if CRM delivery fails. If both paths fail, it returns an error.',
      'The important boundary was recovery: an accepted backup email did not mean a CRM record existed. The documented procedure required someone to check the notification, look up the contact and create a missing record. I had not implemented a durable queue or automatic replay, so human follow-through remained necessary.',
    ],
    stoppingPoint: [
      'Work paused while Dustin considered how he wanted to continue. He subsequently pursued an independent direction, and the broader system we had planned was not completed.',
      'The local review still identified integration and usability gaps, including delivery acknowledgement checks, calculator edge cases and unfinished resources. Resolving those issues and validating the complete customer workflow required further work beyond configuring API connections. The Hombuzz link below identifies the business’s subsequent website.',
    ],
    reflection: [
      'This project gave me experience owning frontend and backend work together, connecting providers and designing for failures between services. It sharpened how I distinguish implemented features from a customer workflow that has been configured, validated and handed over.',
      'Later in development, I used ChatGPT and Codex to clarify unfamiliar next steps and refine the implementation. I remained responsible for the application and integrations. For future projects, I would plan clearer milestones for implementation, provider validation, rollout and client decisions, with time allocated to each rather than treating integration as a final configuration step.',
    ],
    technicalDetails: [
      {
        title: 'Implementation boundaries',
        paragraphs: [
          'Next.js and React provide the frontend; Python, FastAPI and Pydantic handle native inquiry processing. FRED adapters support rate retrieval and trends. Google review adapters normalize and deduplicate records in Redis / Upstash, with serving caches, migration and rebuilding. Minnesota IDX Broker embeds use the provider’s hosted search and registration; those registrations do not enter the native inquiry pipeline.',
        ],
      },
      {
        title: 'Configuration and operational documentation',
        paragraphs: [
          'The project documents Vercel frontend and Railway backend hosting, deployment configuration and CI definitions. Architecture notes, integration-ownership guidance and operations runbooks explain the service boundaries. Follow Up Boss administrators control CRM assignment, action plans and follow-up. These configuration and documentation artifacts do not establish operation of the audited revision in production.',
        ],
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

import type { SystemCaseStudy } from './systems'

const time2MoveRole = 'Sole developer across the frontend, backend, and service integrations.'
const time2MoveCoreStack = ['Next.js', 'React', 'TypeScript', 'Python', 'FastAPI', 'Redis']

// Public editorial copy only. Internal audit records are not build inputs.
export const time2Move = {
  id: 'time2move',
  name: 'Time2Move',
  displayTitle: 'Time2Move: Real Estate Workflows & Integrations',
  summary:
    'Through People’s Connection LLC, I designed and built the original Time2Move application and integrations for Dustin Marmon. The implementation connected customer tools, a shared inquiry backend, and external services.',
  positioning:
    'Through People’s Connection LLC, I designed and built the original Time2Move application and integrations for Dustin Marmon. The goal was to connect a real estate customer experience with business workflows: helping visitors explore properties, understand their options, and submit inquiries with useful context for follow-up. The broader plan included AI-assisted customer support, content, and website improvement.',
  contextLabel: 'Past client project',
  caseStudyStage: 'Historical',
  currentState: 'Past client project · Engagement concluded',
  problem:
    'Connect the customer journey from exploring properties and expressing needs to business follow-up.',
  system:
    'A regional website, customer tools and shared inquiry backend, with additional AI capabilities left unfinished when the engagement ended.',
  systemHighlights: [
    'Regional content and customer-facing tools.',
    'Shared backend for six inquiry types.',
    'API connections, submission safeguards and operational documentation.',
  ],
  stack: time2MoveCoreStack,
  myRole: time2MoveRole,
  coreConstraint:
    'Centralize validation and integration under a shared inquiry contract while preserving each request’s purpose and context.',
  outcome:
    'The engagement ended before the broader system and planned validation were completed.',
  proofSections: [],
  successorLink: {
    href: 'https://hombuzz.com/',
    label: 'Current business website — Hombuzz',
    context:
      'The original deployment is inactive. The business later continued independently as Hombuzz, outside my Time2Move work.',
  },
  story: {
    atAGlance: [
      { label: 'Client', value: 'Dustin Marmon' },
      { label: 'Role', value: time2MoveRole },
      { label: 'Scope', value: 'Real estate website, inquiry workflows and service integrations' },
    ],
    sections: [
      {
        id: 'capabilities',
        title: 'Engineering ownership',
        paragraphs: [
          'I wrote the original frontend and backend application code. The implementation covered regional content, property-search embeds, mortgage and fee calculators, rate and review integrations, and a shared inquiry-processing backend.',
          'One central decision was to bring six inquiry types under a common backend contract. That centralized validation and integration logic while preserving each request’s purpose and context. Each form used the same submission path, carrying its request type, contact details, and source information into backend processing. Contact normalization and deterministic intent rules prepared those submissions for the CRM adapter.',
          'I also implemented API configuration and submission safeguards. I kept provider responsibilities explicit: IDX Broker supplied hosted property search and registration, while native inquiry processing remained separate. Operational documentation covered service responsibilities and recovery procedures.',
        ],
        closing: `Core stack: ${time2MoveCoreStack.join(', ')}.`,
      },
      {
        id: 'ai-development',
        title: 'AI development and tool use',
        paragraphs: [
          'Later in development, I used ChatGPT and Codex to clarify integration questions and refine the implementation.',
          'The broader AI plans included:',
        ],
        items: [
          'Visitor-interaction analysis to prioritize website improvements.',
          'Voice-enabled customer assistance.',
          'Regional housing-market content support.',
        ],
        closing: 'These capabilities remained unfinished when the engagement ended.',
      },
      {
        id: 'results',
        title: 'Outcome and lessons',
        paragraphs: [
          'The engagement concluded before the broader system and planned validation were completed. The original Time2Move deployment is inactive. Dustin subsequently pursued an independent direction, and the business continued as Hombuzz, outside my Time2Move contribution.',
          'The practical delivery lesson was to define a useful first release, identify integration dependencies early, and give validation and later AI enhancements explicit milestones.',
        ],
      },
    ],
  },
} satisfies SystemCaseStudy

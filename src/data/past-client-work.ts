import type { SystemCaseStudy } from './systems'

const time2MoveRole = 'Sole developer across the frontend, backend, and service integrations.'
const time2MoveCoreStack = ['Next.js', 'React', 'TypeScript', 'Python', 'FastAPI', 'Redis']

// Public editorial copy only. Internal audit records are not build inputs.
export const time2Move = {
  id: 'time2move',
  name: 'Time2Move',
  displayTitle: 'Time2Move: Real Estate Automation & AI Development',
  summary:
    'Through People’s Connection LLC, I designed and built the original Time2Move application and integrations for Dustin Marmon. Product AI capabilities remained unfinished when the engagement ended.',
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
      { label: 'Scope', value: 'Real estate website, CRM workflows and AI development' },
    ],
    sections: [
      {
        id: 'capabilities',
        title: 'Engineering ownership',
        paragraphs: [
          'I wrote the original application code using established frameworks and third-party services. The implementation covered regional content, property-search embeds, mortgage and fee calculators, rate and review integrations, and a shared inquiry-processing backend.',
          'One central decision was to bring six inquiry types under a common backend contract. That centralized validation and integration logic while preserving each request’s purpose and context. I also implemented API configuration, submission safeguards, and operational documentation covering service responsibilities and recovery procedures.',
          'The work required coordinating the customer-facing application, backend processing, external providers, and the configuration needed to connect them.',
        ],
        closing: `Core stack: ${time2MoveCoreStack.join(', ')}.`,
      },
      {
        id: 'ai-development',
        title: 'AI development and tool use',
        paragraphs: [
          'Later in development, I used ChatGPT and Codex to work through integration questions and refine the implementation. I retained responsibility for the application and its technical decisions.',
          'I also worked toward three AI capabilities:',
        ],
        items: [
          {
            label: 'Website improvement informed by visitor behavior',
            description: 'A workflow intended to use recorded visitor interactions as input to LLM reviews, then rank proposed website changes for trial. The goal was to help prioritize improvements to the customer journey.',
          },
          {
            label: 'Voice-enabled customer assistance',
            description: 'A chatbot intended to use Dustin’s voice, giving prospective clients a more familiar conversational experience while exploring the business’s services.',
          },
          {
            label: 'Regional housing-news updates',
            description: 'A semi-automated LLM workflow intended to support current housing-market content relevant to the regions the business served.',
          },
        ],
        closing: 'These capabilities remained unfinished when the engagement ended.',
      },
      {
        id: 'results',
        title: 'Outcome and lessons',
        paragraphs: [
          'The engagement ended before the broader system and planned validation were completed. The original Time2Move deployment is inactive. Dustin subsequently pursued an independent direction, and the business continued as Hombuzz, outside the work described here.',
          'The project strengthened my experience connecting application code, external services, and AI development goals. It also reinforced a delivery principle I would apply to future projects: define a useful first release, make integration dependencies explicit, and give validation and later AI enhancements clear milestones of their own.',
        ],
      },
    ],
  },
} satisfies SystemCaseStudy

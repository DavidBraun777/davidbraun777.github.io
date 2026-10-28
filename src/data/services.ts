export const engagementOffers = [
  {
    id: 'architecture-workflow-review',
    title: 'Architecture & Workflow Review',
    planningRange: '$1,500–$3,000',
    duration: '1–2 weeks',
    description:
      'A focused review for a workflow or system that needs a clearer technical direction before implementation.',
    itemsLabel: 'Potential deliverables',
    items: [
      'Discovery',
      'Workflow or system map',
      'Architecture review',
      'Bottlenecks and failure points',
      'Security and reliability considerations',
      'Prioritized implementation plan',
      'Recommended next steps',
    ],
  },
  {
    id: 'scoped-system-build',
    title: 'Scoped System / Automation Build',
    planningRange: '$5,000–$25,000+',
    duration: 'Defined during scoping',
    description:
      'A bounded implementation engagement for a clearly defined application, integration, data, or workflow problem.',
    itemsLabel: 'Potential work',
    items: [
      'Applications and APIs',
      'Integrations and AI-enabled workflows',
      'Internal tools and automation',
      'Cloud deployment',
      'Data pipelines',
      'Testing and documentation',
      'Operational handoff',
    ],
    note: 'Substantial custom platforms or MVPs often begin around $12,000+, depending on scope. Not every project will fit this planning range.',
  },
  {
    id: 'platform-stewardship',
    title: 'Ongoing Platform Stewardship',
    planningRange: '$750–$3,000+/month',
    duration: 'Ongoing monthly engagement',
    description:
      'Continuing technical ownership for systems that need dependable maintenance, support, and incremental improvement after launch.',
    itemsLabel: 'Potential scope',
    items: [
      'Hosting and platform support',
      'Deployment and monitoring',
      'Dependency and security maintenance',
      'Troubleshooting',
      'Incremental feature work',
      'Reliability improvements',
      'Technical stewardship',
    ],
  },
] as const

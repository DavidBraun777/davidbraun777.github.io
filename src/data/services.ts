export const engagementOffers = [
  {
    id: 'architecture-workflow-review',
    title: 'Architecture & Workflow Review',
    planningRange: '$1,500–$3,000',
    duration: '1–2 weeks',
    description:
      'Start here when you need to decide what to build, repair, or integrate before committing to implementation.',
    itemsLabel: 'Potential deliverables',
    items: [
      'Discovery and a map of the current workflow or system',
      'Architecture review with bottlenecks and failure points',
      'Security and reliability considerations',
      'Prioritized implementation plan and recommended next steps',
    ],
  },
  {
    id: 'scoped-system-build',
    title: 'Scoped System / Automation Build',
    planningRange: '$5,000–$25,000+',
    duration: 'Defined during scoping',
    description:
      'Start here when the problem is defined and you need a working application, integration, or automated workflow.',
    itemsLabel: 'Potential work',
    items: [
      'Applications, APIs, and internal tools',
      'Integrations, data pipelines, and AI-enabled workflows',
      'Automation and cloud deployment',
      'Testing, documentation, and operational handoff',
    ],
    note: 'Substantial custom platforms or MVPs often begin around $12,000+, depending on scope. Not every project will fit this planning range.',
  },
  {
    id: 'platform-stewardship',
    title: 'Ongoing Platform Stewardship',
    planningRange: '$750–$3,000+/month',
    duration: 'Ongoing monthly engagement',
    description:
      'Start here when an existing system needs maintenance, troubleshooting, and a clear owner for incremental improvements.',
    itemsLabel: 'Potential scope',
    items: [
      'Hosting, platform support, deployment, and monitoring',
      'Dependency and security maintenance',
      'Troubleshooting and reliability improvements',
      'Incremental feature work and technical stewardship',
    ],
  },
] as const

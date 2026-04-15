import {
  ArrowRight,
  Blocks,
  Building2,
  FileText,
  type LucideIcon,
  Mail,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from 'lucide-react'

export interface NavigationItem {
  label: string
  href: string
}

export interface Signal {
  title: string
  value: string
  detail: string
  icon: LucideIcon
}

export interface ServiceOffering {
  title: string
  problem: string
  outcome: string
  example: string
  icon: LucideIcon
}

export interface ProcessStep {
  title: string
  description: string
}

export interface CredibilityPoint {
  title: string
  description: string
}

export interface ConversionPoint {
  title: string
  description: string
  icon: LucideIcon
}

export interface ContactPath {
  title: string
  description: string
  href: string
  label: string
  icon: LucideIcon
}

export const profile = {
  name: 'David Braun',
  location: 'Maple Grove, Minnesota',
  title: 'Workflow automation and systems consulting for small and midsized businesses.',
  summary:
    'I help small and midsized businesses remove manual work, connect disconnected tools, and build systems that stay dependable after launch.',
  heroHeadline: 'Remove manual work from the workflows that keep slowing your business down.',
  heroDescription:
    'I design and build AI systems, workflow automation, and integration-heavy software for businesses that are tired of re-entry, missed follow-up, disconnected tools, and fragile handoffs.',
  audience:
    'Best fit for owners and operators who need lead handling, internal workflows, or data movement to run with less manual effort and more consistency.',
  availability: 'Open for consulting projects, automation builds, and operational software work.',
  responseTime: 'I usually reply within one business day.',
  graduateStatus: "Master's student in Artificial Intelligence at the University of St. Thomas.",
  graduateProgram: 'Completing a Big Data certificate alongside the program.',
  graduation: 'Expected graduation: December 2026.',
  faithStatement:
    'My faith shapes how I work: honest communication, clear commitments, stewardship, and respect for the people who have to live with the system after launch.',
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Services', href: '/#services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Why Work With Me', href: '/why-work-with-me' },
  { label: 'Contact', href: '/contact' },
]

export const companySignals = ['Target', 'GE Aerospace', 'Securian', 'U.S. Bank']

export const homeSignals: Signal[] = [
  {
    title: 'Production proof',
    value: 'Public system live since 2020',
    detail:
      'The VIFG platform has been running in production with ongoing hosting, deployment, and accessibility ownership.',
    icon: ShieldCheck,
  },
  {
    title: 'Enterprise background',
    value: 'Built inside large operating environments',
    detail:
      'Experience across Target, GE Aerospace, Securian, and U.S. Bank translates into stronger discipline around delivery, security, and reliability.',
    icon: Building2,
  },
  {
    title: 'Automation focus',
    value: 'Manual work reduced through software',
    detail:
      'The work consistently centers on removing repetitive routing, processing, and follow-up from business operations.',
    icon: Workflow,
  },
  {
    title: 'System ownership',
    value: 'From architecture to deployment',
    detail:
      'I work across software, data flow, infrastructure, automation, and handoff so the system holds up after launch.',
    icon: Blocks,
  },
]

export const resumeHighlights: Signal[] = [
  {
    title: 'Production ownership',
    value: 'Architecture, deployment, and operations',
    detail:
      'Comfortable taking responsibility for the real delivery surface, not just the prototype layer.',
    icon: ShieldCheck,
  },
  {
    title: 'Automation impact',
    value: 'Operational work made lighter',
    detail:
      'Past automation work includes recurring processing and workflow improvements that cut manual team effort.',
    icon: Workflow,
  },
  {
    title: 'Enterprise credibility',
    value: 'Cross-functional software and infrastructure work',
    detail:
      'Background includes frontend, APIs, security hardening, infrastructure automation, and production support.',
    icon: Building2,
  },
  {
    title: 'Ongoing technical growth',
    value: 'Applied AI plus production engineering',
    detail:
      'Graduate study in AI supports the consulting work, but it is not the reason to trust the delivery.',
    icon: Sparkles,
  },
]

export const servicesOffered: ServiceOffering[] = [
  {
    title: 'Lead automation',
    problem:
      'Leads get lost when calls, qualification, follow-up, and CRM updates depend on manual steps.',
    outcome:
      'Lead handling becomes faster, more consistent, and easier to track from first contact to next action.',
    example: 'StormIQ voice workflow and CRM handoff architecture.',
    icon: Sparkles,
  },
  {
    title: 'System integration',
    problem:
      'Important information is trapped across forms, inboxes, spreadsheets, CRMs, and internal tools.',
    outcome:
      'The right data moves to the right place without staff copying it between systems.',
    example: 'Lecture Stream processing pipeline and enterprise API integration work.',
    icon: ArrowRight,
  },
  {
    title: 'Workflow automation',
    problem:
      'Teams waste time on repetitive review, routing, status updates, and handoffs that should already be handled.',
    outcome:
      'Routine steps are automated so people spend less time coordinating and more time acting.',
    example: 'DealerFlow notifications and operational workflow design.',
    icon: Workflow,
  },
  {
    title: 'Long-term system reliability',
    problem:
      'A tool that works in a demo but breaks in production creates more work than it saves.',
    outcome:
      'Delivery includes deployment, monitoring, accessibility, and operational boundaries so the system stays useful.',
    example: 'VIFG production platform on AWS with repeatable deployment.',
    icon: Wrench,
  },
]

export const processPreview: ProcessStep[] = [
  {
    title: 'Discovery',
    description:
      'Start with the workflow, the bottlenecks, and the manual work that is actually costing time or revenue.',
  },
  {
    title: 'Design',
    description:
      'Map the system, data movement, rules, edge cases, and handoffs before choosing what gets automated.',
  },
  {
    title: 'Build',
    description:
      'Implement the workflow, integration, UI, and backend pieces needed to make the system usable in real work.',
  },
  {
    title: 'Deploy',
    description:
      'Ship the operational version with hosting, security, observability, and release discipline in place.',
  },
  {
    title: 'Iterate',
    description:
      'Tighten the system using real usage, new edge cases, and the next operational constraint that appears.',
  },
]

export const credibilityPoints: CredibilityPoint[] = [
  {
    title: 'System-level thinking',
    description:
      'I do not treat automation as a prompt plus a UI. I design the routing, state, validation, handoffs, and failure handling around it.',
  },
  {
    title: 'Enterprise discipline',
    description:
      'Large-company engineering experience shows up in documentation, reliability, security thinking, and clear delivery boundaries.',
  },
  {
    title: 'Hands-on delivery',
    description:
      'The work does not stop at recommendations. I can design, build, deploy, and support the actual system.',
  },
  {
    title: 'Values that travel into the work',
    description:
      'My Christian faith informs how I communicate, scope work, and handle trust, while the services themselves are for anyone who is a good fit.',
  },
]

export const conversionPoints: ConversionPoint[] = [
  {
    title: 'Best fit',
    description:
      'You have a repeated workflow, disconnected tools, or lead handling problems that are already costing time.',
    icon: Sparkles,
  },
  {
    title: 'What happens next',
    description:
      'The first call is used to understand the workflow, the current friction, and whether a scoped build makes sense.',
    icon: ArrowRight,
  },
  {
    title: 'Response time',
    description: profile.responseTime,
    icon: Mail,
  },
  {
    title: 'Privacy',
    description:
      'Project details shared through the form stay private and are only used to evaluate the fit for the conversation.',
    icon: FileText,
  },
]

export const contactPaths: ContactPath[] = [
  {
    title: 'Book a call',
    description:
      'Use this if you want to talk through a workflow problem, an integration need, or a system you want built.',
    href: '/contact',
    label: 'Book a Call',
    icon: Mail,
  },
]

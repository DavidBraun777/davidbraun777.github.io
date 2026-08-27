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
import {
  northStarIdentity,
  northStarStatement,
  northStarValueProposition,
  professionalAvailability,
} from '@/data/career-story'

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

export interface CurrentWorkReference {
  label: string
  href: string
  description: string
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
  location: 'White Bear Lake, MN',
  title: northStarIdentity,
  professionalIdentity: northStarIdentity,
  summary: northStarStatement,
  heroHeadline: northStarValueProposition,
  heroDescription:
    'I connect AI and data capabilities to the applications, APIs, workflows, cloud platforms, security controls, evaluation, observability, and human handoffs required for real use.',
  audience:
    'Best fit when software, cloud infrastructure, data, automation, and AI need to operate as one dependable system.',
  availability: professionalAvailability,
  responseTime: 'I usually reply within one business day.',
  graduateStatus:
    'Master of Science in Artificial Intelligence student at the University of St. Thomas.',
  graduateProgram:
    'Completing a Graduate Certificate in Big Data alongside the degree program.',
  graduation: 'Expected graduation: December 2026.',
  faithStatement:
    'My faith shapes how I work: honest communication, clear commitments, stewardship, and respect for the people who have to live with the system after launch.',
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Research', href: '/research' },
  { label: 'Why Work With Me', href: '/why-work-with-me' },
  { label: 'Contact', href: '/contact' },
]

export const companySignals = ['Target', 'GE Aerospace', 'Securian', 'U.S. Bank']

export const homeSignals: Signal[] = [
  {
    title: 'Production proof',
    value: 'Public system live since 2020',
    detail:
      'The VIFG platform has been live for years with ongoing hosting, deployment, and accessibility support.',
    icon: ShieldCheck,
  },
  {
    title: 'Enterprise background',
    value: 'Software work in large operating environments',
    detail:
      'Experience across Target, GE Aerospace, Securian, and U.S. Bank shows up in stronger delivery, reliability, and communication.',
    icon: Building2,
  },
  {
    title: 'Automation focus',
    value: 'Manual work reduced through software',
    detail:
      'The work consistently centers on removing repetitive routing, processing, follow-up, and data movement from business operations.',
    icon: Workflow,
  },
  {
    title: 'System ownership',
    value: 'From architecture to deployment',
    detail:
      'I work across software, data flow, infrastructure, automation, dashboards, and handoff so the system holds up after launch.',
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
    title: 'AI Systems Architecture & Integration',
    problem:
      'An AI or data capability has value, but it is isolated from the applications, workflow, controls, and people needed for dependable use.',
    outcome:
      'A bounded architecture that connects capability, workflow, evaluation, and human handoff.',
    example: 'Retrieval, grounded assistants, APIs, and operational integrations with explicit system boundaries.',
    icon: Sparkles,
  },
  {
    title: 'Platform & Cloud Architecture',
    problem:
      'A useful application needs a secure, repeatable path from development through deployment and ongoing operation.',
    outcome:
      'Cloud infrastructure, delivery paths, and ownership boundaries that hold up after launch.',
    example: 'VIFG production delivery on AWS plus enterprise platform and infrastructure experience.',
    icon: Wrench,
  },
  {
    title: 'Workflow & Data Orchestration',
    problem:
      'Work and data get stuck across forms, files, inboxes, services, queues, and manual handoffs.',
    outcome:
      'Reviewable flows that move state and information while keeping decisions and exceptions visible.',
    example: 'DGM-style multi-step orchestration, API integration, queues, persistence, and data pipelines.',
    icon: Workflow,
  },
  {
    title: 'Reliability, Security & Evaluation',
    problem:
      'A system works in a demo but its security, failure behavior, evidence quality, or operating limits are unclear.',
    outcome:
      'Explicit access boundaries, validation, tests, observability, and evaluation criteria.',
    example: 'Enterprise security work, production quality gates, and RAGeATM refusal and grounding evaluation.',
    icon: ShieldCheck,
  },
  {
    title: 'Operational Software',
    problem:
      'An operational need crosses product, data, infrastructure, and support boundaries that a single feature cannot solve.',
    outcome:
      'A deployable system with clear interfaces, delivery ownership, documentation, and a practical path to maintenance.',
    example: 'Applications, dashboards, integrations, and automation designed around the real operating workflow.',
    icon: Blocks,
  },
]

export const currentWorkReferences: CurrentWorkReference[] = [
  {
    label: 'VIFG nonprofit platform',
    href: 'https://www.vifg.org/home',
    description: 'Production platform with ongoing hosting, deployment, and accessibility support.',
  },
  {
    label: 'arklandscaping.net',
    href: 'https://arklandscaping.net',
    description: 'Current public client-site delivery work.',
  },
]

export const processPreview: ProcessStep[] = [
  {
    title: 'Discovery',
    description:
      'Start with the workflow, the bottlenecks, the users, and the manual work that is actually costing time or revenue.',
  },
  {
    title: 'Design',
    description:
      'Map the system, data movement, rules, edge cases, AI/data boundaries if relevant, and handoffs before choosing what gets automated.',
  },
  {
    title: 'Build',
    description:
      'Implement the workflow, integration, UI, backend, dashboard, assistant, or internal tool needed to make the system usable in real work.',
  },
  {
    title: 'Deploy',
    description:
      'Ship the operational version with hosting, security, observability, release discipline, and clear limitations in place.',
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
      'I do not stop at the interface. I plan the handoffs, rules, and failure points that make the system usable in real work.',
  },
  {
    title: 'Enterprise discipline',
    description:
      'Large-company experience shows up in clearer delivery, better documentation, and fewer sloppy surprises.',
  },
  {
    title: 'Hands-on delivery',
    description:
      'I can scope the work, build it, ship it, document the limits, and support it instead of handing off a slide deck.',
  },
  {
    title: 'Values that travel into the work',
    description:
      'My Christian faith shapes how I communicate and handle trust, while the work itself is for anyone who is a good fit.',
  },
]

export const conversionPoints: ConversionPoint[] = [
  {
    title: 'Best fit',
    description:
      'You already know a workflow, handoff, lead process, data process, or internal system is wasting time.',
    icon: Sparkles,
  },
  {
    title: 'What happens next',
    description:
      'The first call is used to understand the problem and decide whether a scoped build or review makes sense.',
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
      'Use this if you want to talk through a workflow problem, an integration need, a data movement issue, or a system you want built.',
    href: '/contact',
    label: 'Book a Call',
    icon: Mail,
  },
]

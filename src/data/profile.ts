import {
  Blocks,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  type LucideIcon,
  Mail,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Workflow,
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

export interface FocusArea {
  title: string
  description: string
  icon: LucideIcon
}

export interface ProcessStep {
  title: string
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
  location: 'Maple Grove, Minnesota',
  title: 'AI systems engineer building software, infrastructure, and applied product systems.',
  summary:
    'I build systems across software, AI, infrastructure, and applied product development.',
  heroDescription:
    'I design and ship operational software where AI, backend systems, cloud infrastructure, and product thinking have to work together instead of living in separate demos.',
  graduateStatus: "Master's student in Artificial Intelligence at the University of St. Thomas.",
  graduateProgram: 'Completing a Big Data certificate alongside the program.',
  graduation: 'Expected graduation: December 2026.',
  availability:
    'Open to full-time roles, research-minded engineering work, and selective consulting engagements.',
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Systems', href: '/systems' },
  { label: 'Writing', href: '/writing' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
]

export const homeSignals: Signal[] = [
  {
    title: 'Graduate Study',
    value: "Master's in AI at St. Thomas",
    detail: 'Big Data certificate in progress. Graduation target: December 2026.',
    icon: GraduationCap,
  },
  {
    title: 'Production Ownership',
    value: 'Accessibility-first nonprofit platform live since 2020',
    detail: 'Owned architecture, frontend, AWS hosting, Docker delivery, CI/CD, and operations.',
    icon: ShieldCheck,
  },
  {
    title: 'Enterprise Background',
    value: 'Target, GE Aerospace, Securian, and U.S. Bank',
    detail: 'Work spans software delivery, security hardening, infrastructure automation, and API support.',
    icon: Building2,
  },
  {
    title: 'Technical Breadth',
    value: 'AI, backend, cloud, infrastructure, and product systems',
    detail: 'Best fit when architecture, implementation, and operational judgment all matter.',
    icon: Blocks,
  },
]

export const resumeHighlights: Signal[] = [
  {
    title: 'Repository Scale',
    value: '30+ repos supported and 50+ modernized at Target',
    detail: 'Handled platform support, upgrades, and cross-repo modernization work.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Operational Improvement',
    value: '40% reduction in manual work at Securian',
    detail: 'Automated recurring data-processing workflows with Python.',
    icon: Workflow,
  },
  {
    title: 'Cloud Credential',
    value: 'AWS Certified Cloud Practitioner',
    detail: 'Issued March 2024 through Pearson VUE.',
    icon: Sparkles,
  },
  {
    title: 'Delivery Scope',
    value: 'Production, enterprise, and founder-led builds',
    detail: 'Comfortable moving from architecture and APIs to deployment and operations.',
    icon: FileText,
  },
]

export const whatIDoAreas: FocusArea[] = [
  {
    title: 'AI / ML systems',
    description:
      'Retrieval, guided workflows, policy-aware assistants, summarization pipelines, and other systems where models sit inside a dependable operational boundary.',
    icon: Sparkles,
  },
  {
    title: 'Software engineering',
    description:
      'Backend services, APIs, data flow, state management, and application logic that turn ideas into software people can actually use.',
    icon: Blocks,
  },
  {
    title: 'Cloud / infrastructure / DevOps',
    description:
      'AWS delivery, Docker, CI/CD, deployment topology, automation, and reliability work that keeps systems operating after launch.',
    icon: ShieldCheck,
  },
  {
    title: 'Product and system design',
    description:
      'Workflow framing, architecture boundaries, decision paths, and interface choices that make complex systems easier to understand and operate.',
    icon: Workflow,
  },
  {
    title: 'Consulting and applied problem-solving',
    description:
      'Best on messy, real-world technical problems where business context and engineering execution need to meet in the same plan.',
    icon: BriefcaseBusiness,
  },
]

export const processPreview: ProcessStep[] = [
  {
    title: 'Frame the workflow first',
    description:
      'Start with users, inputs, routing, constraints, and failure points before choosing tools or interfaces.',
  },
  {
    title: 'Use AI where it earns its place',
    description:
      'Models are useful inside retrieval, decision support, summarization, or guided workflows when the surrounding system stays inspectable.',
  },
  {
    title: 'Ship the operational layer',
    description:
      'Queues, persistence, monitoring, delivery paths, and human handoffs are part of the product, not afterthoughts.',
  },
]

export const contactPaths: ContactPath[] = [
  {
    title: 'Career opportunities',
    description: 'Full-time roles in AI systems, backend engineering, platform work, or applied product development.',
    href: '/resume',
    label: 'Review Resume',
    icon: FileText,
  },
  {
    title: 'Project or consulting work',
    description: 'Architecture help, workflow automation, system reviews, or scoped technical builds.',
    href: '/contact',
    label: 'Start a Conversation',
    icon: Mail,
  },
  {
    title: 'Technical writing and ideas',
    description: 'Notes on AI systems, automation, software delivery, and the tradeoffs behind real systems.',
    href: '/writing',
    label: 'Read Writing',
    icon: NotebookPen,
  },
]

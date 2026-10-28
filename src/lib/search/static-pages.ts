import { profile } from '@/data/profile'
import { consultingEngagements, fullTimeRoleFamilies } from '@/data/career-story'
import type { SearchRecord } from './types'

// Only public routes belong here. Collection-backed detail records are generated
// separately; this small registry covers page introductions and static headings.
export const staticSearchPages: SearchRecord[] = [
  {
    id: 'page-home', title: 'David Braun: AI Systems & Platform Engineer', href: '/', type: 'Page',
    description: profile.summary, tags: ['AI', 'Platform Engineering'],
    headings: ['Selected work'], body: [profile.heroDescription, profile.audience, profile.availability].join(' '),
  },
  {
    id: 'page-case-studies', title: 'Case Studies', href: '/case-studies', type: 'Page',
    description: 'Production, pilot, prototype, and R&D case studies showing workflow automation, system integration, data systems, and delivery work.',
    tags: ['Projects'], headings: ['Featured public production proof', 'Technical proof with honest limits', 'Past client work'], body: '',
  },
  {
    id: 'page-research', title: 'Research', href: '/research', type: 'Page',
    description: 'Artificial intelligence and systems research by David Braun, including information retrieval for low-resource-language archives and peer-reviewed space-physics work.',
    tags: [], headings: ['Research Profiles', 'Research context', 'Research Areas', 'Accepted Conference Paper', 'Peer-Reviewed Journal Article', 'Conference Abstracts', 'Professional Affiliations'], body: '',
  },
  {
    id: 'page-experience', title: 'Experience', href: '/experience', type: 'Page',
    description: "David Braun's software, platform, security, infrastructure, and applied AI engineering experience across enterprise and mission-driven systems.",
    tags: ['Career'], headings: ['Career highlights', 'Professional experience', 'Education and certification'], body: '',
  },
  {
    id: 'page-career-story', title: 'Career Story', href: '/experience/career-story', type: 'Page',
    description: "The five-part career through-line behind David Braun's AI systems and platform engineering work.",
    tags: [], headings: ['Career through-line', 'The system scope that emerged', 'Where the through-line fits', 'Engineering roles', 'Consulting engagements'], body: [...fullTimeRoleFamilies, ...consultingEngagements].join(' '),
  },
  {
    id: 'page-writing', title: 'Writing', href: '/writing', type: 'Page',
    description: 'Essays and technical notes from David Braun on AI systems, workflow automation, product engineering, and software architecture.',
    tags: ['Blog', 'Articles'], headings: [], body: '',
  },
  {
    id: 'page-resumes', title: 'Résumés & CV', href: '/resumes', type: 'Page',
    description: 'Choose the document that fits your opportunity: software and platform engineering experience, or research in AI and autonomous systems.',
    tags: ['Résumé', 'CV'], headings: ['Professional documents'], body: '',
  },
  {
    id: 'page-services', title: 'Services', href: '/services', type: 'Page',
    description: 'AI systems and platform engineering consulting through architecture reviews, scoped builds, workflow automation, and ongoing platform stewardship.',
    tags: ['Consulting'], headings: ['Ways to work together', 'Planning ranges', 'Engineering leverage', 'Good fit projects', 'How work usually starts', 'Technical capabilities inside an engagement'], body: '',
  },
  {
    id: 'page-evidence', title: 'Engineering & Evidence Standards', href: '/approach/evidence', type: 'Page',
    description: 'How David Braun labels production, pilot, prototype, and research work; reviews AI-assisted engineering; and evaluates technical evidence and limitations.',
    tags: [], headings: ['Maturity labels', 'What counts as evidence', 'Limitations and claim boundaries', 'Research status and reproducibility', 'AI-assisted engineering and human review', 'Security', 'Accessibility', 'Testing', 'Reliability'], body: '',
  },
  {
    id: 'page-contact', title: 'Contact', href: '/contact', type: 'Page',
    description: 'Start a conversation about a role, project, or research collaboration.',
    tags: ['Employment', 'Consulting', 'Research'], headings: [], body: '',
  },
]

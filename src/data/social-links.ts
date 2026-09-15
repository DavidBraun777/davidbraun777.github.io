import {
  BadgeCheck,
  Database,
  Earth,
  Github,
  GraduationCap,
  Linkedin,
  Microscope,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ProfileLink {
  name: string
  shortName?: string
  url: string
  icon: LucideIcon
}

export interface ResearchProfileLink extends ProfileLink {
  group: 'research'
  description: string
}

export type SocialLink =
  | (ProfileLink & { group: 'professional' })
  | ResearchProfileLink

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    group: 'professional',
    url: 'https://github.com/DavidBraun777',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    group: 'professional',
    url: 'https://www.linkedin.com/in/david-braun777/',
    icon: Linkedin,
  },
  {
    name: 'ORCID',
    group: 'research',
    url: 'https://orcid.org/0009-0003-9821-8349',
    icon: BadgeCheck,
    description: 'Researcher identifier',
  },
  {
    name: 'Google Scholar',
    group: 'research',
    url: 'https://scholar.google.com/citations?user=9CqMwqMAAAAJ&hl=en',
    icon: GraduationCap,
    description: 'Publications and citations',
  },
  {
    name: 'Scopus',
    group: 'research',
    url: 'https://www.scopus.com/authid/detail.uri?authorId=57197365260',
    icon: Database,
    description: 'Author profile and citation index',
  },
  {
    name: 'Web of Science',
    group: 'research',
    url: 'https://www.webofscience.com/wos/author/record/QXI-2995-2026',
    icon: Search,
    description: 'Researcher profile and citation index',
  },
  {
    name: 'ResearchGate',
    group: 'research',
    url: 'https://www.researchgate.net/profile/David-Braun-5',
    icon: Microscope,
    description: 'Academic profile',
  },
  {
    name: 'AGU Profile',
    shortName: 'AGU',
    group: 'research',
    url: 'https://www.agu.org/user-profile?cstkey=BF392314-D7E6-40A7-ACDF-DC1318123068',
    icon: Earth,
    description: 'Space-physics and AGU profile',
  },
]

export const resumeUrl = '/David-J-Braun-Resume-2026.pdf'

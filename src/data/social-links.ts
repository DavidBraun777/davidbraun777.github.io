import { BadgeCheck, Database, Earth, Github, GraduationCap, Linkedin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SocialLink {
  name: string
  url: string
  icon: LucideIcon
  researchActionLabel?: string
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/DavidBraun777',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/david-braun777/',
    icon: Linkedin,
  },
  {
    name: 'ORCID',
    url: 'https://orcid.org/0009-0003-9821-8349',
    icon: BadgeCheck,
    researchActionLabel: 'View ORCID Record',
  },
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?user=9CqMwqMAAAAJ&hl=en',
    icon: GraduationCap,
    researchActionLabel: 'View Google Scholar Profile',
  },
  {
    name: 'Scopus',
    url: 'https://www.scopus.com/inward/authorDetails.url?authorID=57197365260&partnerID=MN8TOARS',
    icon: Database,
    researchActionLabel: 'View Scopus Profile',
  },
  {
    name: 'AGU Profile',
    url: 'https://www.agu.org/user-profile?cstkey=BF392314-D7E6-40A7-ACDF-DC1318123068',
    icon: Earth,
    researchActionLabel: 'View AGU Profile',
  },
]

export const resumeUrl = '/resume.pdf'

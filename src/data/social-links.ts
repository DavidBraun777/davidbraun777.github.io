import { BadgeCheck, Earth, Github, Linkedin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SocialLink {
  name: string
  url: string
  icon: LucideIcon
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/DavidBraun777',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/david-braun777',
    icon: Linkedin,
  },
  {
    name: 'ORCID',
    url: 'https://orcid.org/0009-0003-9821-8349',
    icon: BadgeCheck,
  },
  {
    name: 'AGU Profile',
    url: 'https://www.agu.org/user-profile?cstkey=BF392314-D7E6-40A7-ACDF-DC1318123068',
    icon: Earth,
  },
]

export const resumeUrl = '/resume.pdf'

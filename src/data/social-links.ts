import { Github, Linkedin, Mail, Instagram } from 'lucide-react'
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
    name: 'Email',
    url: 'mailto:davidjbraun777@gmail.com',
    icon: Mail,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/coachdavidbraun',
    icon: Instagram,
  },
]

export const resumeUrl = '/Resume.pdf'

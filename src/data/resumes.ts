export interface ResumeDocument {
  id: string
  kind: 'Résumé' | 'Research CV'
  title: string
  description: string
  audience: string
  href: string | null
  requestHref: string
  viewLabel: string
  downloadLabel: string
}

// Keep candidates private until source and disclosure review clears public release.
export const industryResume = {
  id: 'software-platform',
  kind: 'Résumé',
  title: 'Software & Platform Engineering Résumé',
  description:
    'Professional experience in software engineering, cloud infrastructure, cybersecurity, enterprise systems, and AI systems integration.',
  audience: 'Primary résumé for industry recruiting',
  href: '/resumes/David-J-Braun-Resume-Software-Platform-2026.pdf',
  requestHref: '/contact?type=employment',
  viewLabel: 'View PDF',
  downloadLabel: 'Download PDF',
} satisfies ResumeDocument

// A public PDF URL belongs here only after the document passes disclosure review.
export const researchCv: ResumeDocument = {
  id: 'ai-research',
  kind: 'Research CV',
  title: 'AI & Autonomous Systems Research CV',
  description:
    'Research experience in autonomous systems, information retrieval, scientific computing, and applied artificial intelligence.',
  audience: 'For research positions, professors, and Ph.D. admissions',
  href: '/resumes/David-J-Braun-CV-AI-Research-2026.pdf',
  requestHref: '/contact?type=research',
  viewLabel: 'View Research CV',
  downloadLabel: 'Download Research CV',
}

export const resumeDocuments: ResumeDocument[] = [industryResume, researchCv]
export const legacyResumeUrls = ['/resume.pdf', '/David-J-Braun-Resume-2026.pdf']
export const resumeUrl = industryResume.href

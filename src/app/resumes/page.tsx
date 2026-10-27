import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { ResumeCard } from '@/components/site/resume-card'
import { resumeDocuments } from '@/data/resumes'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Résumés & CV',
  description:
    'David Braun’s Software & Platform Engineering Résumé and AI & Autonomous Systems Research CV, with documents for industry recruiting and academic opportunities.',
  path: '/resumes',
})

export default function ResumesPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Professional documents"
          title="Résumés & CV"
          description="Choose the document that fits your opportunity: software and platform engineering experience, or research in AI and autonomous systems."
        />
        <section aria-label="Professional documents" className="grid gap-5 lg:grid-cols-2">
          {resumeDocuments.map((document) => <ResumeCard key={document.id} document={document} />)}
        </section>
      </div>
    </div>
  )
}

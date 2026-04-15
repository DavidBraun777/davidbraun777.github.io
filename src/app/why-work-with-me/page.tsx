import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { PageIntro } from '@/components/site/page-intro'
import { SignalGrid } from '@/components/site/signal-grid'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { certifications, education } from '@/data/education'
import { experiences } from '@/data/experience'
import { companySignals, credibilityPoints, profile, resumeHighlights } from '@/data/profile'
import { resumeUrl } from '@/data/social-links'

export const metadata: Metadata = {
  title: 'Why Work With Me',
  description:
    'Background, delivery experience, and credibility for businesses that need workflow automation and dependable systems.',
}

export default function WhyWorkWithMePage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Why Work With Me"
          title="Credibility you can skim quickly."
          description="This page is here to answer the practical buyer questions: have you done real work, can you handle the delivery, and what kind of person will I be working with?"
          actions={[{ label: 'Book a Call', href: '/contact' }]}
        />

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 text-base leading-8 text-text-secondary">
            <p>
              I work best when the real problem is not just “build this feature,” but
              “make this part of the business run better.” That usually means cleaning up
              handoffs, reducing manual work, and building something that still works
              after launch.
            </p>
            <p>
              My background includes enterprise software, security, infrastructure,
              automation, and hands-on delivery for a live production platform. That mix
              matters because the work usually crosses more than one layer of the system.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              What that looks like in practice
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {companySignals.map((company) => (
                <span
                  key={company}
                  className="rounded-full border border-border-subtle bg-background-subtle px-3 py-1.5 text-sm text-text-secondary"
                >
                  {company}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              {profile.faithStatement}
            </p>
          </div>
        </section>

        <SignalGrid items={resumeHighlights} columns="two" headingLevel="h3" />

        <section>
          <SectionHeader
            align="left"
            title="Experience and background"
            subtitle="Open the roles you care about and skim the rest."
          />
          <div className="grid gap-5">
            {experiences.slice(0, 5).map((experience, index) => (
              <DisclosurePanel
                key={experience.id}
                title={`${experience.role} · ${experience.company}`}
                summary={`${experience.startDate} to ${experience.endDate ?? 'Present'} · ${experience.description}`}
                defaultOpen={index === 0}
              >
                <ul className="space-y-3">
                  {experience.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-3 text-sm leading-7 text-text-secondary"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                {experience.technologies ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.technologies.map((technology) => (
                      <Badge key={technology} variant="outline">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </DisclosurePanel>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary">How I work</h2>
            <div className="mt-5 space-y-4">
              {credibilityPoints.map((point) => (
                <div key={point.title}>
                  <p className="text-sm font-semibold text-text-primary">{point.title}</p>
                  <p className="mt-1 text-sm leading-7 text-text-secondary">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary">Education and credentials</h2>
            <div className="mt-5 space-y-5">
              {education.map((item) => (
                <article key={item.id}>
                  <h3 className="text-base font-semibold text-text-primary">
                    {item.degree} in {item.field}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-link-primary">{item.institution}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {item.startDate} to {item.endDate ?? 'Present'}
                  </p>
                  {item.secondaryCredential ? (
                    <p className="mt-2 text-sm leading-7 text-text-secondary">
                      Additional credential: {item.secondaryCredential}.
                    </p>
                  ) : null}
                </article>
              ))}

              {certifications.map((item) => (
                <div key={item.id}>
                  <h3 className="text-base font-semibold text-text-primary">{item.name}</h3>
                  <p className="mt-1 text-sm leading-7 text-text-secondary">
                    {item.issuer} · {item.issueDate}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-primary">Resume PDF</h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              The full PDF is still available if you want the complete timeline and
              traditional resume format. It stays secondary to the on-page summary.
            </p>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
            >
              <FileText className="h-4 w-4" />
              Open Resume PDF
            </a>
          </article>
        </section>
      </div>
    </div>
  )
}

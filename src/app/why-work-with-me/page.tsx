import type { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { SignalGrid } from '@/components/site/signal-grid'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { certifications, education } from '@/data/education'
import { experiences } from '@/data/experience'
import { credibilityPoints, profile, resumeHighlights } from '@/data/profile'
import { resumeUrl } from '@/data/social-links'

export const metadata: Metadata = {
  title: 'Why Work With Me',
  description:
    'System-level thinking, enterprise delivery experience, and clear values for businesses that need workflow automation and dependable software.',
}

export default function WhyWorkWithMePage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Why Work With Me"
          title="Credibility built on delivery, not on vague positioning."
          description="If you need someone who can understand the workflow, build the system, and think past the demo stage, this is the reason to keep reading. The work is shaped by enterprise delivery standards, hands-on software experience, and clear values."
          actions={[
            { label: 'Book a Call', href: '/contact' },
            { label: 'Open Resume PDF', href: resumeUrl, icon: FileText, external: true, variant: 'secondary' },
          ]}
        />

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 text-base leading-8 text-text-secondary">
            <p>
              I work best when the real problem is not just “build this feature,” but
              “make this workflow stop wasting time.” That usually means dealing with
              messy inputs, disconnected systems, unclear handoffs, and delivery risk at
              the same time.
            </p>
            <p>
              The advantage I bring is system-level thinking plus hands-on execution. I
              can move from workflow framing into software, integrations, deployment, and
              production support without losing the business problem in the middle.
            </p>
            <p>
              My background across Target, GE Aerospace, Securian, U.S. Bank, and
              founder-led delivery work means I bring more discipline than a prototype
              shop, but without the overhead of a large consulting firm.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {credibilityPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-text-primary">{point.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <SignalGrid items={resumeHighlights} headingLevel="h3" />

        <section>
          <SectionHeader
            align="left"
            title="Experience that supports the consulting work"
            subtitle="These roles matter because they show operating range: software delivery, security, infrastructure, automation, and production responsibility."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {experiences.slice(0, 5).map((experience) => (
              <article
                key={experience.id}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                  <span>{experience.startDate}</span>
                  <span>to</span>
                  <span>{experience.endDate ?? 'Present'}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-text-primary">
                  {experience.role}
                </h3>
                <p className="mt-1 text-sm font-medium text-link-primary">{experience.company}</p>
                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  {experience.description}
                </p>
                {experience.technologies ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.technologies.slice(0, 6).map((technology) => (
                      <Badge key={technology} variant="outline">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Education and credentials"
            subtitle="Useful supporting context, but not the main reason to trust the work."
          />
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-text-primary">
                    {item.degree} in {item.field}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-link-primary">{item.institution}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {item.startDate} to {item.endDate ?? 'Present'}
                  </p>
                  {item.secondaryCredential ? (
                    <p className="mt-4 text-sm leading-7 text-text-secondary">
                      Additional credential: {item.secondaryCredential}.
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-3 text-sm leading-7 text-text-secondary">
                      {item.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="space-y-5">
              {certifications.map((item) => (
                <a
                  key={item.id}
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    Certification
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-text-primary">{item.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">
                    {item.issuer} · {item.issueDate}
                  </p>
                </a>
              ))}

              <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-text-primary">Values in practice</h3>
                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  {profile.faithStatement}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Resume"
            subtitle="The PDF is here as supporting detail for buyers who want the complete timeline."
          />
          <div className="overflow-hidden rounded-[1.75rem] border border-border-subtle bg-background-elevated shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Supporting asset</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Review the full PDF without leaving the page.
                </p>
              </div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-subtle px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-elevated hover:text-text-primary"
              >
                <FileText className="h-4 w-4" />
                Open Resume PDF
              </a>
            </div>
            <iframe
              title="David Braun resume PDF"
              src={resumeUrl}
              className="h-[900px] w-full bg-white"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

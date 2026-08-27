import type { Metadata } from 'next'
import type { Experience } from '@/data/experience'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { PageIntro } from '@/components/site/page-intro'
import { SignalGrid } from '@/components/site/signal-grid'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { SectionHeader } from '@/components/ui/section-header'
import { certifications, education } from '@/data/education'
import { experiences } from '@/data/experience'
import {
  careerStoryStages,
  consultingEngagements,
  fullTimeRoleFamilies,
  northStarIdentity,
  synthesisBoundary,
} from '@/data/career-story'
import { companySignals, credibilityPoints, currentWorkReferences, profile, resumeHighlights } from '@/data/profile'
import { resumeUrl } from '@/data/social-links'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Why Work With Me',
  description:
    'The career through-line, delivery evidence, and best-fit roles behind David Braun\'s AI systems and platform architecture work.',
  path: '/why-work-with-me',
})

export default function WhyWorkWithMePage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Why Work With Me"
          title="A systems career that now converges around AI and platform architecture."
          description="The north-star identity is a synthesis of scientific computing, enterprise software, security and platform engineering, production ownership, and current AI and data specialization. The evidence below keeps each chapter and maturity level explicit."
          actions={[
            { label: 'Book a Call', href: '/contact' },
            { label: 'View Case Studies', href: '/case-studies', variant: 'secondary' },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Career through-line"
            subtitle="Five cumulative chapters that overlap and build on one another. They are not replacements for the historical role titles shown below."
          />
          <div className="grid gap-4 lg:grid-cols-5">
            {careerStoryStages.map((stage, index) => (
              <article
                key={stage.id}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <p className="font-mono text-xs font-semibold text-link-primary">
                  Chapter {index + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-7 text-text-primary">
                  {stage.label}
                </h3>
                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  <span className="font-semibold text-text-primary">Evidence:</span>{' '}
                  {stage.evidence}
                </p>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  <span className="font-semibold text-text-primary">What it adds:</span>{' '}
                  {stage.meaning}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-primary-300/70 bg-primary-50/60 p-5 dark:border-primary-900 dark:bg-primary-950/30">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-link-primary">
              Current synthesis
            </p>
            <p className="mt-2 text-xl font-semibold text-text-primary">
              {northStarIdentity}
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-text-secondary">
              {synthesisBoundary}
            </p>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Best-fit roles and engagements"
            subtitle="Two practical ways to work together: embedded roles and scoped architecture or engineering partnerships."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary">
                Full-Time / Embedded
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Roles where this background maps well:
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {fullTimeRoleFamilies.map((role) => (
                  <li
                    key={role}
                    className="rounded-xl border border-border-subtle bg-background-subtle px-4 py-3 text-sm font-medium text-text-primary"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary">Consulting</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Focused architecture and engineering engagements:
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {consultingEngagements.map((engagement) => (
                  <li
                    key={engagement}
                    className="rounded-xl border border-border-subtle bg-background-subtle px-4 py-3 text-sm font-medium text-text-primary"
                  >
                    {engagement}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 text-base leading-8 text-text-secondary">
            <p>
              I work best when the problem crosses system boundaries: an AI or data
              capability must connect to applications, infrastructure, security,
              evaluation, observability, and the people responsible after launch.
            </p>
            <p>
              My background includes enterprise software, security, infrastructure,
              automation, and hands-on delivery for a live production platform. That mix
              matters because the work usually crosses more than one layer of the system.
            </p>
            <p>
              Current public delivery work includes arklandscaping.net. Past client
              delivery has also included time2move.io, which is currently paused. VIFG
              remains the strongest flagship proof because the operational ownership is
              deeper and more visible.
            </p>
            <p>
              I also serve as Treasurer for the VIFG nonprofit, contributing to quarterly
              financial review, stewardship planning, and oversight alongside the technical
              delivery work. That role reinforces the same expectation I bring to client
              work: responsible operations, clear accountability, and follow-through after launch.
            </p>
            <div>
              <p>
                Graduate AI research in information retrieval, retrieval-augmented
                generation, and multimodal methods for low-resource-language archives
                strengthens the technical foundation behind the applied systems work. That
                record includes accepted IEEE LA-CCI 2026 work and earlier peer-reviewed
                space-physics research. It supports how I evaluate evidence, retrieval
                quality, and system limits, but it does not replace production proof.
              </p>
              <Link
                href="/research"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
              >
                Review research and publications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
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
            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold text-text-primary">Current public work</p>
              {currentWorkReferences.map((reference) => (
                <div key={reference.href} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{reference.label}</p>
                    <p className="mt-1 text-sm leading-7 text-text-secondary">
                      {reference.description}
                    </p>
                  </div>
                  <ExternalLinkAction href={reference.href} iconOnly ariaLabel={`Visit ${reference.label}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Credibility highlights"
            subtitle="Quick signals that summarize the delivery background behind the systems work."
          />
          <SignalGrid items={resumeHighlights} columns="two" headingLevel="h3" />
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Experience and background"
            subtitle="Open the roles you care about and skim the rest."
          />
          <div className="grid gap-5">
            {experiences.slice(0, 7).map((experience, index) => (
              <DisclosurePanel
                key={experience.id}
                title={`${experience.role} · ${experience.company}`}
                summary={`${formatExperiencePeriod(experience)} · ${experience.description}`}
                defaultOpen={index === 0}
              >
                <p className="mb-4 text-sm text-text-muted">
                  {experience.department ? `${experience.department} · ` : ''}
                  {experience.location}
                </p>
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
                    {item.inProgress ? 'In progress · ' : ''}
                    {item.startDate} to {item.inProgress ? 'expected ' : ''}
                    {item.endDate ?? 'Present'}
                  </p>
                  {item.programUrl ? (
                    <div className="mt-2">
                      <ExternalLinkAction href={item.programUrl}>
                        View degree program
                      </ExternalLinkAction>
                    </div>
                  ) : null}
                  {item.secondaryCredential ? (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-text-primary">
                        {item.secondaryCredential}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-text-secondary">
                        {item.secondaryCredentialInProgress ? 'In progress · ' : ''}
                        {item.secondaryCredentialStartDate ?? item.startDate} to{' '}
                        {item.secondaryCredentialInProgress ? 'expected ' : ''}
                        {item.secondaryCredentialEndDate ?? item.endDate ?? 'Present'}
                      </p>
                      {item.secondaryCredentialUrl ? (
                        <div className="mt-2">
                          <ExternalLinkAction href={item.secondaryCredentialUrl}>
                            View certificate program
                          </ExternalLinkAction>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}

              {certifications.map((item) => (
                <div key={item.id}>
                  <h3 className="text-base font-semibold text-text-primary">{item.name}</h3>
                  <p className="mt-1 text-sm leading-7 text-text-secondary">
                    {item.issuer} · Issued {item.issueDate}
                    {item.expirationDate ? ` · Expires ${item.expirationDate}` : ''}
                  </p>
                  {item.credentialUrl ? (
                    <div className="mt-2">
                      <ExternalLinkAction href={item.credentialUrl}>
                        Verify on Credly
                      </ExternalLinkAction>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-text-primary">Resume PDF</h2>
              <ExternalLinkAction
                href={resumeUrl}
                iconOnly
                ariaLabel="Open resume PDF in a new tab"
              />
            </div>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              The full PDF is still available if you want the complete timeline and
              traditional resume format. It stays secondary to the on-page summary.
            </p>
          </article>
        </section>
      </div>
    </div>
  )
}

function formatExperiencePeriod(experience: Experience) {
  if (experience.startDate === 'Ongoing' && experience.endDate === null) {
    return 'Current role'
  }

  return `${experience.startDate} to ${experience.endDate ?? 'Present'}`
}

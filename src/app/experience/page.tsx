import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, GitBranch, ShieldCheck, Workflow } from 'lucide-react'
import type { Experience } from '@/data/experience'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { PageIntro } from '@/components/site/page-intro'
import { SignalGrid } from '@/components/site/signal-grid'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { SectionHeader } from '@/components/ui/section-header'
import { certifications, education } from '@/data/education'
import { experiences } from '@/data/experience'
import { companySignals } from '@/data/profile'
import { resumeUrl } from '@/data/social-links'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Experience',
  description:
    "David Braun's software, platform, security, infrastructure, and applied AI engineering experience across enterprise and mission-driven systems.",
  path: '/experience',
})

const experienceSignals = [
  {
    title: 'Engineering experience',
    value: '6+ years',
    detail:
      'Software, platform, security, infrastructure, automation, and production-support work.',
    icon: Building2,
  },
  {
    title: 'Platform modernization',
    value: '50+ repositories',
    detail:
      'Led dependency, build-tool, and configuration modernization across repositories at Target.',
    icon: GitBranch,
  },
  {
    title: 'Automation impact',
    value: 'Approximately 40%',
    detail:
      'Reduced manual operational effort for a recurring Python data-processing workflow at Securian.',
    icon: Workflow,
  },
  {
    title: 'Production ownership',
    value: 'Live since 2020',
    detail:
      'Own the VIFG platform across application delivery, infrastructure, deployment, accessibility, and support.',
    icon: ShieldCheck,
  },
]

const universityRole = experiences.find((experience) => experience.id === 'ust-support')
const chronologicalExperience = experiences.filter(
  (experience) => experience.id !== 'ust-support'
)

export default function ExperiencePage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Experience"
          title="Engineering across software, platforms, security, and applied AI."
          description="I build and support the systems around AI and data: applications, APIs, workflows, cloud infrastructure, security controls, evaluation, and operational handoff. My background spans enterprise engineering, production ownership, scientific computing, and current graduate AI work."
          actions={[
            { label: 'Discuss a Role', href: '/contact?type=employment' },
            { label: 'View Resume PDF', href: resumeUrl, external: true, variant: 'secondary' },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Career highlights"
            subtitle="A few bounded facts from the work history, followed by the complete role chronology."
          />
          <SignalGrid items={experienceSignals} columns="four" headingLevel="h3" />
          <div className="mt-5 flex flex-wrap gap-3" aria-label="Enterprise experience">
            {companySignals.map((company) => (
              <span
                key={company}
                className="rounded-full border border-border-subtle bg-background-elevated px-4 py-2 text-sm font-medium text-text-secondary shadow-sm"
              >
                {company}
              </span>
            ))}
          </div>
        </section>

        {universityRole ? (
          <section>
            <SectionHeader
              align="left"
              title="Current University of St. Thomas role"
              subtitle="Graduate work paired with direct support inside the Department of Software Engineering and Data Science."
            />
            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Current</Badge>
                <Badge variant="outline">{formatExperiencePeriod(universityRole)}</Badge>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                {universityRole.role}
              </h3>
              <p className="mt-2 font-medium text-link-primary">{universityRole.company}</p>
              <p className="mt-1 text-sm text-text-muted">
                {[universityRole.department, universityRole.location].filter(Boolean).join(' · ')}
              </p>
              <p className="mt-4 max-w-4xl text-sm leading-7 text-text-secondary">
                {universityRole.description}
              </p>
            </article>
          </section>
        ) : null}

        <section>
          <SectionHeader
            align="left"
            title="Professional experience"
            subtitle="Historical titles are preserved as recorded. Open any role for responsibilities, outcomes, and technologies."
          />
          <div className="grid gap-5">
            {chronologicalExperience.map((experience, index) => (
              <ExperiencePanel
                key={experience.id}
                experience={experience}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Education and certification"
            subtitle="Current graduate study builds on a mathematics, physics, and computer science foundation."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {education.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <Badge variant={item.inProgress ? 'secondary' : 'outline'}>
                  {item.inProgress ? 'In progress' : 'Completed'}
                </Badge>
                <h3 className="mt-4 text-xl font-semibold text-text-primary">
                  {item.degree} in {item.field}
                </h3>
                <p className="mt-2 font-medium text-link-primary">{item.institution}</p>
                {item.department || item.location ? (
                  <p className="mt-1 text-sm text-text-secondary">
                    {[item.department, item.location].filter(Boolean).join(' · ')}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-text-muted">
                  {item.startDate} to {item.inProgress ? 'expected ' : ''}
                  {item.endDate ?? 'Present'}
                </p>
                {item.description ? (
                  <p className="mt-4 text-sm leading-7 text-text-secondary">
                    {item.description}
                  </p>
                ) : null}
                {item.secondaryCredential ? (
                  <div className="mt-5 rounded-2xl border border-border-subtle bg-background-subtle p-4">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.secondaryCredential}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-text-secondary">
                      {item.secondaryCredentialInProgress ? 'In progress · ' : ''}
                      {item.secondaryCredentialStartDate ?? item.startDate} to{' '}
                      {item.secondaryCredentialInProgress ? 'expected ' : ''}
                      {item.secondaryCredentialEndDate ?? item.endDate ?? 'Present'}
                    </p>
                    {item.secondaryCredentialNote ? (
                      <p className="mt-2 text-sm leading-7 text-text-secondary">
                        {item.secondaryCredentialNote}
                      </p>
                    ) : null}
                    {item.secondaryCredentialUrl ? (
                      <div className="mt-3">
                        <ExternalLinkAction href={item.secondaryCredentialUrl}>
                          View current certificate program
                        </ExternalLinkAction>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {item.programUrl ? (
                  <div className="mt-5">
                    <ExternalLinkAction href={item.programUrl}>
                      View degree program
                    </ExternalLinkAction>
                  </div>
                ) : null}
              </article>
            ))}

            {certifications.map((certification) => (
              <article
                key={certification.id}
                className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <Badge variant="outline">Certification</Badge>
                <h3 className="mt-4 text-xl font-semibold text-text-primary">
                  {certification.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-text-secondary">
                  {certification.issuer} · Issued {certification.issueDate}
                  {certification.expirationDate
                    ? ` · Expires ${certification.expirationDate}`
                    : ''}
                </p>
                {certification.credentialUrl ? (
                  <div className="mt-5">
                    <ExternalLinkAction href={certification.credentialUrl}>
                      Verify on Credly
                    </ExternalLinkAction>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              Research signal
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Peer-reviewed and accepted research
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The research record spans a published 2018 space-physics collaboration and
              accepted 2026 information-retrieval work, with each status kept explicit.
            </p>
            <Link href="/research" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary hover:text-link-primary-hover">
              View Research
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>

          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              Deeper context
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              The full career through-line
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Five cumulative chapters connect scientific computing, enterprise software,
              security and platform engineering, production ownership, and applied AI.
            </p>
            <Link href="/experience/career-story" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary hover:text-link-primary-hover">
              Read the full career through-line
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </section>

        <section className="rounded-[1.75rem] border border-primary-300/70 bg-primary-50/60 p-6 dark:border-primary-900 dark:bg-primary-950/30">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Start a role conversation
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">
            I am open to select engineering roles where software, cloud infrastructure,
            data, automation, and AI need to operate as one dependable system.
          </p>
          <div className="mt-5 flex flex-wrap gap-5">
            <Link href="/contact?type=employment" className="inline-flex items-center gap-2 text-sm font-medium text-link-primary hover:text-link-primary-hover">
              Discuss a Role
              <ArrowRight className="h-4 w-4" />
            </Link>
            <ExternalLinkAction href={resumeUrl}>Open Resume PDF</ExternalLinkAction>
          </div>
        </section>
      </div>
    </div>
  )
}

function ExperiencePanel({
  experience,
  defaultOpen,
}: Readonly<{ experience: Experience; defaultOpen: boolean }>) {
  return (
    <DisclosurePanel
      title={`${experience.role} · ${experience.company}`}
      summary={`${formatExperiencePeriod(experience)} · ${experience.description}`}
      defaultOpen={defaultOpen}
    >
      <p className="mb-4 text-sm text-text-muted">
        {experience.department ? `${experience.department} · ` : ''}
        {experience.location}
      </p>
      {experience.highlights.length > 0 ? (
        <ul className="space-y-3">
          {experience.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-sm leading-7 text-text-secondary">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}
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
  )
}

function formatExperiencePeriod(experience: Experience) {
  if (experience.startDate === 'Ongoing' && experience.endDate === null) {
    return 'Current role'
  }

  return `${experience.startDate} to ${experience.endDate ?? 'Present'}`
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { SignalGrid } from '@/components/site/signal-grid'
import { SectionHeader } from '@/components/ui/section-header'
import { engineeringPrinciples } from '@/data/systems'
import { education, certifications } from '@/data/education'
import { experiences } from '@/data/experience'
import { homeSignals, profile } from '@/data/profile'
import { positioningTracks } from '@/data/skills'
import { resumeUrl } from '@/data/social-links'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Background, positioning, and direction for David Braun across AI systems, software engineering, infrastructure, and applied product work.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="About"
          title="Background, direction, and the kind of work I am moving toward."
          description="I come from software engineering, infrastructure, security, and production delivery. Graduate study in artificial intelligence is sharpening that background toward AI systems, workflow software, and technical work that has to hold up operationally."
          actions={[
            { label: 'View Resume', href: resumeUrl, icon: FileText, external: true },
            { label: 'Explore Projects', href: '/projects', variant: 'secondary' },
          ]}
          aside={
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Current positioning
              </p>
              <div className="mt-4 space-y-3">
                <p className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-sm leading-7 text-text-secondary">
                  {profile.graduateStatus}
                </p>
                <p className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-sm leading-7 text-text-secondary">
                  {profile.graduateProgram}
                </p>
                <p className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-sm leading-7 text-text-secondary">
                  {profile.availability}
                </p>
              </div>
            </div>
          }
        />

        <SignalGrid items={homeSignals} />

        <section>
          <SectionHeader
            align="left"
            title="How I frame the work"
            subtitle="The throughline is not one narrow stack. It is systems work where software, architecture, and operations have to reinforce each other."
          />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5 text-base leading-8 text-text-secondary">
              <p>
                I am most interested in systems that do real work: routing, validation,
                persistence, delivery, observability, and human handoff. That is why the
                portfolio mixes AI workflow systems, backend-heavy products, production
                infrastructure, and applied software builds.
              </p>
              <p>
                The goal is not to look broad for its own sake. The goal is to build a
                stronger operating range across the layers that usually decide whether a
                system becomes dependable software or stays a prototype.
              </p>
              <p>
                In practice, that means I am strongest where product direction,
                implementation, and engineering judgment need to happen in the same loop.
              </p>
            </div>

            <div className="grid gap-4">
              {positioningTracks.map((track) => (
                <article
                  key={track.title}
                  className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    Best-fit role
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-text-primary">
                    {track.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {track.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Experience snapshot"
            subtitle="A few roles that shape how I think about systems, delivery, and credibility."
          />
          <div className="grid gap-5 lg:grid-cols-2">
              {experiences.slice(0, 4).map((experience) => (
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
                <p className="mt-1 text-sm font-medium text-link-primary">
                  {experience.company}
                </p>
                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  {experience.description}
                </p>
              </article>
            ))}
          </div>
          <Link
            href="/resume"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Review the full resume page
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Education and credentials"
            subtitle="Formal study and certification that support the current direction."
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
                  <p className="mt-2 text-sm font-medium text-link-primary">
                    {item.institution}
                  </p>
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
                  <h3 className="mt-3 text-xl font-semibold text-text-primary">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">
                    {item.issuer} · {item.issueDate}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Engineering principles"
            subtitle="The constraints I try to preserve while moving quickly."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {engineeringPrinciples.map((principle) => (
                <article
                  key={principle.title}
                  className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
                >
                <h3 className="text-lg font-semibold text-text-primary">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

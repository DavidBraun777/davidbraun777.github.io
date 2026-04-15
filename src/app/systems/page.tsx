import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { PageIntro } from '@/components/site/page-intro'
import { SectionHeader } from '@/components/ui/section-header'
import { currentInterests, engineeringPrinciples, systemThemes } from '@/data/systems'

const artifactTypes = [
  'Architecture diagrams',
  'Workflow boundaries',
  'Deployment topology',
  'Validation and policy constraints',
  'Operational outcomes',
  'Stack and integration surfaces',
]

export const metadata: Metadata = {
  title: 'Systems',
  description:
    'System architecture, engineering artifacts, and technical framing for David Braun across AI systems, workflow automation, and production software.',
}

export default function SystemsPage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Systems"
          title="The technical layer: architecture, engineering artifacts, and system framing."
          description="This page is for the deeper technical read. Instead of treating every project like a marketing card, it groups the work by system shape and highlights the artifacts that help prove how the systems are designed."
          actions={[
            { label: 'View Projects', href: '/projects' },
            { label: 'Contact', href: '/contact', variant: 'secondary' },
          ]}
          aside={
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Artifact types
              </p>
              <div className="mt-4 space-y-3">
                {artifactTypes.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-sm text-text-secondary"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <section>
          <SectionHeader
            align="left"
            title="System families"
            subtitle="Grouped by the shape of the problem, not by whatever happened to fit on the homepage."
          />
          <div className="grid gap-5">
            {systemThemes.map((theme, index) => (
              <DisclosurePanel
                key={theme.id}
                title={theme.title}
                summary={theme.intro}
                defaultOpen={index === 0}
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {theme.systems.map((system) => (
                    <article
                      key={system.id}
                      className="rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded-full bg-background-elevated px-3 py-1 text-text-secondary">
                          {system.currentState}
                        </span>
                        <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                          {theme.title}
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-text-primary">
                        {system.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-text-secondary">
                        {system.problem}
                      </p>
                      <div className="mt-4 rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                          Core constraint
                        </p>
                        <p className="mt-2 text-sm leading-7 text-text-secondary">
                          {system.coreConstraint}
                        </p>
                      </div>
                      <Link
                        href={`/projects/${system.id}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
                      >
                        Open case study
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </article>
                  ))}
                </div>
              </DisclosurePanel>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Engineering principles"
            subtitle="Cross-cutting constraints that show up across the systems."
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

        <section>
          <SectionHeader
            align="left"
            title="Current interests"
            subtitle="Problem areas I expect to keep going deeper on."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {currentInterests.map((interest) => (
              <article
                key={interest.title}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  {interest.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {interest.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

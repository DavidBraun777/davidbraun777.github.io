import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { urarinaResearch as research } from '@/data/urarina-research'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: research.title,
    description: research.description,
    path: research.path,
  }),
  keywords: ['Information Retrieval', 'Low-Resource Language Archives', 'Urarina', 'Spanish'],
}

const contextLinkClassName =
  'rounded-sm text-link-primary underline decoration-link-primary/40 underline-offset-4 hover:text-link-primary-hover'

function ContextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={contextLinkClassName}>
      {children}
    </a>
  )
}

const statusFields = [
  ['Institution', (
    <ContextLink key="institution" href={research.links.institution}>
      {research.institution}
    </ContextLink>
  )],
  ['Researchers', (
    <span key="researchers">
      <Link href="/research" className={contextLinkClassName}>
        David Braun
      </Link>
      {' and '}
      <ContextLink href={research.links.collaborator}>Prof. Michael Dorin</ContextLink>
    </span>
  )],
  ['Area', research.area],
  ['Conference', (
    <ContextLink key="conference" href={research.conference.url}>
      {research.conference.name}
    </ContextLink>
  )],
  ['Status', research.status],
  ['Submission platform', research.conference.submissionPlatform],
] as const

export default function UrarinaResearchPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-sm font-medium text-link-primary hover:text-link-primary-hover"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All research
        </Link>

        <PageIntro
          eyebrow="Graduate research"
          title={research.title}
          description={research.subtitle}
          aside={
            <section
              aria-labelledby="research-status"
              className="rounded-2xl border border-border-subtle bg-background-subtle p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 id="research-status" className="text-lg font-semibold text-text-primary">
                  Research status
                </h2>
                <Badge variant="primary">Accepted conference paper</Badge>
              </div>
              <dl className="mt-5 space-y-4">
                {statusFields.map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-xs uppercase tracking-[0.12em] text-text-secondary">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          }
        />

        <section
          aria-labelledby="publication-note"
          className="rounded-2xl border border-border-subtle bg-background-subtle p-6 sm:px-8"
        >
          <h2 id="publication-note" className="text-lg font-semibold text-text-primary">
            Publication note
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-text-secondary">
            {research.publicationNote}
          </p>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="space-y-8 rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8">
            <section aria-labelledby="overview">
              <h2 id="overview" className="text-2xl font-semibold tracking-tight text-text-primary">
                Overview
              </h2>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{research.overview}</p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{research.acceptance}</p>
            </section>

            <section aria-labelledby="research-context">
              <h2 id="research-context" className="text-2xl font-semibold tracking-tight text-text-primary">
                Research context
              </h2>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{research.context}</p>
            </section>
          </div>

          <section
            aria-labelledby="conference-context"
            className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8"
          >
            <h2 id="conference-context" className="text-2xl font-semibold tracking-tight text-text-primary">
              Conference context
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-text-primary">
              {research.conference.name}
            </p>
            <dl className="mt-5 space-y-4 text-sm leading-6">
              <div>
                <dt className="font-medium text-text-primary">Location</dt>
                <dd className="mt-1 text-text-secondary">{research.conference.location}</dd>
              </div>
              <div>
                <dt className="font-medium text-text-primary">Conference dates</dt>
                <dd className="mt-1 text-text-secondary">{research.conference.dates}</dd>
              </div>
              <div>
                <dt className="font-medium text-text-primary">Submission platform</dt>
                <dd className="mt-1 text-text-secondary">{research.conference.platformDescription}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-col items-start gap-4">
              <ExternalLinkAction href={research.conference.url}>
                Official LA-CCI 2026 website
              </ExternalLinkAction>
              <ExternalLinkAction href={research.conference.cfpUrl}>
                Public call for papers on EasyChair
              </ExternalLinkAction>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="research-lineage"
          className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8"
        >
          <h2 id="research-lineage" className="text-2xl font-semibold tracking-tight text-text-primary">
            Research lineage
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-text-secondary">
            {research.lineage.introduction}
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {research.lineage.references.map((reference) => (
              <article
                key={reference.url}
                className="rounded-2xl border border-border-subtle bg-background-subtle p-5"
              >
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-secondary">
                  Prior public work · {reference.year}
                </p>
                <h3 className="mt-3">
                  <ExternalLinkAction
                    href={reference.url}
                    className="items-start text-base font-semibold leading-6 [&>span:last-child]:shrink-0"
                  >
                    {reference.title}
                  </ExternalLinkAction>
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-text-primary">
                  {reference.authors}
                </p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{reference.source}</p>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{reference.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="research-journey"
          className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8"
        >
          <h2 id="research-journey" className="text-2xl font-semibold tracking-tight text-text-primary">
            Research journey
          </h2>
          <ol className="ml-2 mt-6 border-l border-border-subtle">
            {research.journey.map((step, index) => (
              <li
                key={step}
                className="relative pb-6 pl-7 text-sm leading-6 text-text-secondary last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-2 top-1 h-4 w-4 rounded-full border border-border-strong bg-background-elevated"
                />
                <span aria-hidden="true" className="mr-3 font-mono text-xs text-text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}

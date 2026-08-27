import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Github } from 'lucide-react'
import { notFound } from 'next/navigation'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { MetricCard } from '@/components/site/metric-card'
import { PageIntro } from '@/components/site/page-intro'
import { TechTag } from '@/components/site/tech-tag'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { SectionHeader } from '@/components/ui/section-header'
import {
  allSystems,
  getSystemById,
  type ArchitectureStep,
  type FeaturedSystemCaseStudy,
  type ProofSection,
  type RetrievalCapabilityLadder,
} from '@/data/systems'
import { absoluteUrl, createPageMetadata } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

const caseStudyDescriptions: Record<string, string> = {
  weatherforge:
    'WeatherForge is a Minnesota severe-weather analytics dashboard built from NOAA Storm Events and GHCN-Daily data, with 55K+ storm records and 9M+ weather observations.',
  rageatm:
    'RAGeATM is an evidence-bound Retrieval-Augmented Generation prototype using TF-IDF, cosine retrieval, and threshold refusal to demonstrate grounded AI behavior.',
}

export function generateStaticParams() {
  return allSystems.map((system) => ({ slug: system.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const system = getSystemById(slug)

  if (!system) {
    return { title: 'Case Study Not Found' }
  }

  return createPageMetadata({
    title: system.displayTitle ?? system.name,
    description: caseStudyDescriptions[system.id] ?? system.summary,
    path: `/case-studies/${slug}`,
    image: system.image,
    imageAlt: system.imageAlt,
    type: 'article',
  })
}

export default async function CaseStudyDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params
  const system = getSystemById(slug)

  if (!system) {
    notFound()
  }

  const relatedProjects = getRelatedProjects(system)
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Case Studies',
        item: absoluteUrl('/case-studies'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: system.displayTitle ?? system.name,
        item: absoluteUrl(`/case-studies/${slug}`),
      },
    ],
  }

  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        <PageIntro
          eyebrow={system.contextLabel ?? `${system.caseStudyStage} case study`}
          title={system.displayTitle ?? system.name}
          description={system.positioning ?? system.summary}
          actions={[
            { label: 'Book a Call', href: '/contact' },
            ...(system.githubUrl
              ? [
                  {
                    label: 'View GitHub',
                    href: system.githubUrl,
                    icon: Github,
                    external: true,
                    variant: 'secondary' as const,
                  },
                ]
              : []),
          ]}
          aside={<CaseStudyAtAGlance system={system} />}
        />

        <section className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <ProjectVisual system={system} />

          <div className="grid gap-5">
            <NarrativeCard title="Problem" body={system.problem} />
            <NarrativeCard title="Solution / What I Built" body={system.system} />
            <NarrativeCard title="Results" body={system.outcome} />
          </div>
        </section>

        {system.metrics?.length ? (
          <section>
            <SectionHeader
              align="left"
              title="Quantified Outcomes"
              subtitle="These numbers describe project artifacts and sanity checks. They are not client ROI, deployment adoption, actuarial accuracy, or broad model-accuracy claims."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {system.metrics.map((metric) => (
                <MetricCard key={`${metric.value}-${metric.label}`} metric={metric} />
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <SectionHeader
            align="left"
            title="Architecture"
            subtitle="The pipeline is shown as explicit stages so the system boundary is inspectable."
          />
          {system.architecture?.length ? (
            <ArchitectureFlow steps={system.architecture} />
          ) : (
            <FallbackArchitecture system={system} />
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Technical Stack
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {system.stack.map((item) => (
                <TechTag key={item}>{item}</TechTag>
              ))}
            </div>
            {system.dataSources?.length ? (
              <DetailList
                className="mt-7"
                title="Data sources"
                items={system.dataSources}
              />
            ) : null}
          </article>

          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Applied Relevance
            </h2>
            <DetailList
              className="mt-5"
              title="Where the pattern matters"
              items={
                system.realWorldRelevance ?? [
                  'Workflow analysis',
                  'Operational software design',
                  'Prototype planning',
                  'System architecture review',
                ]
              }
            />
          </article>
        </section>

        {system.dashboardViews?.length ? (
          <section>
            <SectionHeader
              align="left"
              title="Dashboard Views"
              subtitle="WeatherForge is organized as a decision-support dashboard rather than a single chart export."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {system.dashboardViews.map((view) => (
                <div
                  key={view}
                  className="rounded-[1.25rem] border border-border-subtle bg-background-elevated px-4 py-4 text-sm font-medium text-text-primary shadow-sm"
                >
                  {view}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <SectionHeader
            align="left"
            title="Proof Surfaces"
            subtitle="Available artifacts are labeled directly. Missing visuals stay as placeholders until real screenshots are added."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {system.proofSections.map((section) => (
              <ProofSectionCard key={section.id} section={section} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Limitations
            </h2>
            <DetailList
              className="mt-5"
              title="What this does not claim"
              items={
                system.limitations ?? [
                  'This page describes the current proof available for the project.',
                  'Additional screenshots, logs, or usage artifacts should be added before making stronger claims.',
                ]
              }
            />
          </article>

          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Next Improvements
            </h2>
            <DetailList
              className="mt-5"
              title="Reasonable next steps"
              items={
                system.nextImprovements ?? [
                  'Add stronger screenshots or walkthrough artifacts.',
                  'Document validation checks and edge cases more completely.',
                  'Tighten public write-up as the system matures.',
                ]
              }
            />
          </article>
        </section>

        {system.retrievalCapabilityLadder ? (
          <RetrievalCapabilityLadderSection ladder={system.retrievalCapabilityLadder} />
        ) : null}

        {system.githubUrl || system.externalUrl ? <ProofLinkSection system={system} /> : null}

        {relatedProjects.length > 0 ? (
          <section>
            <SectionHeader
              align="left"
              title="Related Case Studies"
              subtitle="More portfolio context."
            />
            <div className="grid gap-6">
              {relatedProjects.map((project) => (
                <RelatedCaseStudyCard key={project.id} system={project} />
              ))}
            </div>
          </section>
        ) : null}

        <div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Back to all case studies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function RetrievalCapabilityLadderSection({
  ladder,
}: Readonly<{
  ladder: RetrievalCapabilityLadder
}>) {
  return (
    <section>
      <DisclosurePanel title={ladder.title} summary={ladder.summary}>
        <div className="space-y-6">
          <p className="max-w-4xl text-sm leading-7 text-text-secondary">
            {ladder.intro}
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <p className="rounded-[1.25rem] border border-border-subtle bg-background-subtle p-4 text-sm leading-7 text-text-secondary">
              {ladder.safeClaim}
            </p>
            <p className="rounded-[1.25rem] border border-border-subtle bg-background-subtle p-4 text-sm leading-7 text-text-secondary">
              {ladder.guardrail}
            </p>
          </div>

          <CapabilityLadderTable ladder={ladder} />

          <p className="rounded-[1.25rem] border border-border-subtle bg-background-subtle p-4 text-sm leading-7 text-text-secondary">
            {ladder.heuristicNote}
          </p>

          <div>
            <h4 className="text-lg font-semibold text-text-primary">Clean interpretation</h4>
            <InterpretationTable ladder={ladder} />
          </div>

          <p className="max-w-4xl text-sm leading-7 text-text-secondary">
            {ladder.futureWork}
          </p>
        </div>
      </DisclosurePanel>
    </section>
  )
}

function CapabilityLadderTable({
  ladder,
}: Readonly<{ ladder: RetrievalCapabilityLadder }>) {
  return (
    <div className="overflow-x-auto rounded-[1.25rem] border border-border-subtle">
      <table className="min-w-[1180px] divide-y divide-border-subtle text-left text-sm">
        <caption className="sr-only">{ladder.title}</caption>
        <thead className="bg-background-subtle text-xs uppercase tracking-[0.16em] text-text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-right">
              Level
            </th>
            <th scope="col" className="px-4 py-3">
              System type
            </th>
            <th scope="col" className="px-4 py-3">
              What it compares
            </th>
            <th scope="col" className="px-4 py-3">
              Meaning captured
            </th>
            <th scope="col" className="px-4 py-3">
              Question under the question ability
            </th>
            <th scope="col" className="px-4 py-3">
              Personal context ability
            </th>
            <th scope="col" className="px-4 py-3">
              Real-world grounding
            </th>
            <th scope="col" className="px-4 py-3">
              Best use case
            </th>
            <th scope="col" className="px-4 py-3">
              Fatal weakness
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-background-elevated text-text-secondary">
          {ladder.levels.map((level) => (
            <tr key={level.level}>
              <td className="px-4 py-3 text-right font-mono text-xs text-text-primary">
                {level.level}
              </td>
              <td className="px-4 py-3 font-medium text-text-primary">
                {level.systemType}
              </td>
              <td className="px-4 py-3">{level.compares}</td>
              <td className="px-4 py-3">{level.meaningCaptured}</td>
              <td className="px-4 py-3">{level.questionUnderQuestionAbility}</td>
              <td className="px-4 py-3">{level.personalContextAbility}</td>
              <td className="px-4 py-3">{level.realWorldGrounding}</td>
              <td className="px-4 py-3">{level.bestUseCase}</td>
              <td className="px-4 py-3">{level.fatalWeakness}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InterpretationTable({
  ladder,
}: Readonly<{ ladder: RetrievalCapabilityLadder }>) {
  return (
    <div className="mt-4 overflow-x-auto rounded-[1.25rem] border border-border-subtle">
      <table className="min-w-[620px] divide-y divide-border-subtle text-left text-sm">
        <caption className="sr-only">Clean interpretation of retrieval methods</caption>
        <thead className="bg-background-subtle text-xs uppercase tracking-[0.16em] text-text-muted">
          <tr>
            <th scope="col" className="px-4 py-3">
              Method
            </th>
            <th scope="col" className="px-4 py-3">
              What it really knows
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-background-elevated text-text-secondary">
          {ladder.interpretations.map((item) => (
            <tr key={item.method}>
              <td className="px-4 py-3 font-medium text-text-primary">{item.method}</td>
              <td className="px-4 py-3">&quot;{item.meaning}&quot;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const curatedRelatedIds: Record<string, string[]> = {
  'vifg-nonprofit-platform': ['dealerflow', 'dgm'],
  dealerflow: ['vifg-nonprofit-platform', 'dgm'],
  weatherforge: ['rageatm', 'dgm'],
  rageatm: ['weatherforge', 'dgm'],
  dgm: ['stormiq', 'weatherforge'],
  stormiq: ['dgm', 'dealerflow'],
}

function getRelatedProjects(system: FeaturedSystemCaseStudy) {
  const curated = (curatedRelatedIds[system.id] ?? [])
    .map((id) => allSystems.find((item) => item.id === id))
    .filter((item): item is FeaturedSystemCaseStudy => Boolean(item))

  const sameStage = allSystems.filter(
    (item) => item.id !== system.id && item.caseStudyStage === system.caseStudyStage
  )
  const fallback = allSystems.filter((item) => item.id !== system.id)

  const seen = new Set<string>()
  return [...curated, ...sameStage, ...fallback]
    .filter((item) => {
      if (seen.has(item.id)) {
        return false
      }

      seen.add(item.id)
      return true
    })
    .slice(0, 2)
}

function RelatedCaseStudyCard({
  system,
}: Readonly<{ system: FeaturedSystemCaseStudy }>) {
  return (
    <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{system.contextLabel ?? system.caseStudyStage}</Badge>
        <Badge variant="outline">{system.currentState}</Badge>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-text-primary">{system.name}</h3>
      <p className="mt-2 text-sm leading-7 text-text-secondary">{system.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {system.stack.slice(0, 4).map((item) => (
          <TechTag key={item}>{item}</TechTag>
        ))}
      </div>
      <Link
        href={`/case-studies/${system.id}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
      >
        Read case study
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  )
}

function ProofLinkSection({
  system,
}: Readonly<{ system: FeaturedSystemCaseStudy }>) {
  let title = 'Live Proof'
  let description =
    'This system has a live public surface, which matters because delivery only counts when the software is actually in use.'

  if (system.githubUrl && system.externalUrl) {
    title = 'Public Repository and Live Proof'
    description =
      'This case study has both a public code surface and a live external proof surface.'
  } else if (system.githubUrl) {
    title = 'Public Repository'
    description =
      'The public code link is provided for review of the prototype and technical approach. This does not represent paid deployment, production adoption, or client ROI unless stated elsewhere on the page.'
  }

  return (
    <section className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6 sm:p-7">
      <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        {system.githubUrl ? (
          <ExternalLinkAction href={system.githubUrl}>
            <span className="inline-flex items-center gap-2">
              <Github className="h-4 w-4" aria-hidden="true" />
              View GitHub Repository
            </span>
          </ExternalLinkAction>
        ) : null}
        {system.externalUrl ? (
          <ExternalLinkAction href={system.externalUrl}>Visit Live Site</ExternalLinkAction>
        ) : null}
      </div>
    </section>
  )
}

function CaseStudyAtAGlance({
  system,
}: Readonly<{ system: FeaturedSystemCaseStudy }>) {
  return (
    <div className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
        At a glance
      </p>
      <div className="mt-4 space-y-3">
        <AtAGlanceItem label="Context" value={system.contextLabel ?? system.caseStudyStage} />
        <AtAGlanceItem label="Current state" value={system.currentState} />
        <AtAGlanceItem label="Role" value={system.myRole} />
      </div>
    </div>
  )
}

function AtAGlanceItem({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium leading-6 text-text-primary">{value}</p>
    </div>
  )
}

function ProjectVisual({ system }: Readonly<{ system: FeaturedSystemCaseStudy }>) {
  if (system.image) {
    return (
      <div
        className={
          system.visualSurface === 'dark'
            ? 'relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 dark:border-slate-800'
            : 'relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
        }
      >
        <Image
          src={system.image}
          alt={system.imageAlt ?? `${system.name} visual`}
          fill
          className="object-contain p-8"
          sizes="(min-width: 1280px) 52vw, 100vw"
        />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`${system.name} screenshot placeholder`}
      className="flex min-h-[420px] flex-col justify-between rounded-[2rem] border border-border-subtle bg-background-subtle p-8"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
          Screenshot placeholder
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">
          {system.shortTitle ?? system.name}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
          Actual screenshots are not included in this repository yet. This placeholder
          avoids inventing visuals while reserving space for dashboard, terminal, or demo
          evidence.
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(system.metrics ?? []).slice(0, 4).map((metric) => (
          <MetricCard
            key={`${metric.value}-${metric.label}`}
            metric={metric}
            compact
            className="bg-background-elevated"
          />
        ))}
      </div>
    </div>
  )
}

function NarrativeCard({
  title,
  body,
}: Readonly<{ title: string; body: string }>) {
  return (
    <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{body}</p>
    </article>
  )
}

function ArchitectureFlow({ steps }: Readonly<{ steps: ArchitectureStep[] }>) {
  return (
    <ol className="grid gap-4 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={`${step.label}-${index}`}
          className="relative rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 font-mono text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
              {index + 1}
            </span>
            <h3 className="text-base font-semibold text-text-primary">{step.label}</h3>
          </div>
          <p className="mt-4 text-sm leading-7 text-text-secondary">{step.detail}</p>
        </li>
      ))}
    </ol>
  )
}

function FallbackArchitecture({
  system,
}: Readonly<{ system: FeaturedSystemCaseStudy }>) {
  return (
    <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-text-primary">Key system pieces</h3>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {system.systemHighlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-2xl border border-border-subtle bg-background-subtle px-4 py-3 text-sm leading-7 text-text-secondary"
          >
            {highlight}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          Core constraint
        </p>
        <p className="mt-3 text-sm leading-7 text-text-secondary">
          {system.coreConstraint}
        </p>
      </div>
    </article>
  )
}

function ProofSectionCard({ section }: Readonly<{ section: ProofSection }>) {
  const title =
    section.status === 'planned' ? `${section.title} (to be added)` : section.title

  return (
    <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
        <Badge variant={section.status === 'available' ? 'secondary' : 'outline'}>
          {section.status === 'available' ? 'Available now' : 'In progress'}
        </Badge>
      </div>
      <p className="mt-4 text-sm leading-8 text-text-secondary">{section.summary}</p>
      <ul className="mt-5 space-y-3">
        {section.items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-text-secondary">
            <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function DetailList({
  title,
  items,
  className,
}: Readonly<{
  title: string
  items: string[]
  className?: string
}>) {
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {title}
      </p>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-7 text-text-secondary">
            <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import { notFound } from 'next/navigation'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { CaseStudyStoryContent } from '@/components/site/case-study-story'
import { Time2MoveSystemOverview, Time2MoveWorkflowLesson } from '@/components/site/time2move-project-extras'
import { ContentDestinationManifest } from '@/components/site/content-destination-manifest'
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
  type RetrievalComparison,
} from '@/data/systems'
import { absoluteUrl, createPageMetadata } from '@/lib/seo'
import { createProjectContent, projectBlockKey, projectDefaults, projectProofLinkCopy, publishedProofSections, retrievalColumns, retrievalMethodKey, type ProjectContent } from '@/lib/search/project-destinations'
import { destinationAttributes, type ContentDestination } from '@/lib/search/destinations'

interface Props {
  params: Promise<{ slug: string }>
}

const caseStudyDescriptions: Record<string, string> = {
  weatherforge:
    'WeatherForge is a collaborative University of St. Thomas SEIS 745 project completed by David Braun, Odin Lee, and Jannah ElNemr. David served as lead developer and primary implementer, writing more than 90% of the application code.',
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
  const content = createProjectContent(system)
  const storyAdditions = new Map([
    ['time2move', {
      capabilities: <Time2MoveSystemOverview content={content} />,
      'ai-development': <Time2MoveWorkflowLesson content={content} />,
    }],
  ])
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Work',
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
        <ContentDestinationManifest page={content.page} destinations={content.destinations} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        <PageIntro
          eyebrow={system.contextLabel ?? `${system.caseStudyStage} case study`}
          title={system.displayTitle ?? system.name}
          description={system.positioning ?? system.summary}
          actions={[
            ...(system.externalUrl
              ? [{ label: 'View live website', href: system.externalUrl, external: true, icon: ArrowUpRight }]
              : []),
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
          aside={<CaseStudyAtAGlance system={system} content={content} />}
        />

        {system.story ? (
          <CaseStudyStoryContent story={system.story} content={content} afterSections={storyAdditions.get(system.id)} />
        ) : (
          <StandardCaseStudyContent system={system} content={content} />
        )}

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
            Back to all work
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function StandardCaseStudyContent({ system, content }: Readonly<{
  system: FeaturedSystemCaseStudy
  content: ProjectContent
}>) {
  const proofSections = publishedProofSections(system)

  return (
    <>
      <section className={system.image ? 'grid gap-8 xl:grid-cols-[1.02fr_0.98fr]' : ''}>
        <ProjectVisual system={system} />

        <div className={system.image ? 'grid gap-5' : 'grid gap-5 md:grid-cols-2'}>
          <NarrativeCard title="Problem" body={system.problem} destination={content.get('problem')} />
          <NarrativeCard title="Core Constraint" body={system.coreConstraint} destination={content.get('constraint')} />
          <NarrativeCard
            title={system.solutionTitle ?? 'Solution / What I Built'}
            body={system.system}
            destination={content.get('solution')}
          />
          <NarrativeCard title="Results" body={system.outcome} destination={content.get('results')} />
        </div>
      </section>

      {system.metrics?.length ? (
        <section {...content.attrs('metrics')}>
          <SectionHeader
            align="left"
            title="Project data and checks"
            subtitle="Dataset sizes and recorded checks within this project’s stated scope."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {system.metrics.map((metric) => (
              <div key={`${metric.value}-${metric.label}`} {...content.attrs('metric', projectBlockKey(metric.label, [metric.value, metric.detail].filter(Boolean).join(' ')))}>
                <MetricCard metric={metric} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section {...content.attrs('architecture')}>
        <SectionHeader
          align="left"
          title="Architecture"
          subtitle="The pipeline is shown as explicit stages so the system boundary is inspectable."
        />
        {system.architecture?.length ? (
          <ArchitectureFlow steps={system.architecture} content={content} />
        ) : (
          <FallbackArchitecture system={system} content={content} />
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article {...content.attrs('technical-stack')} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
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
              destination={content.get('data-sources')}
            />
          ) : null}
        </article>

        <article {...content.attrs('relevance')} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Applied Relevance
          </h2>
          <DetailList
            className="mt-5"
            title="Where the pattern matters"
            items={
              system.realWorldRelevance ?? projectDefaults.relevance
            }
          />
        </article>
      </section>

      {system.dashboardViews?.length ? (
        <section {...content.attrs('dashboard-views')}>
          <SectionHeader
            align="left"
            title="Dashboard Views"
            subtitle="WeatherForge is organized as a decision-support dashboard rather than a single chart export."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {system.dashboardViews.map((view) => (
              <div
                key={view}
                {...content.attrs('dashboard', view)}
                className="rounded-[1.25rem] border border-border-subtle bg-background-elevated px-4 py-4 text-sm font-medium text-text-primary shadow-sm"
              >
                {view}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {proofSections.length ? (
        <section {...content.attrs('proof')}>
          <SectionHeader
            align="left"
            title="Implementation and evidence"
            subtitle="Implementation details and the artifacts available for review."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {proofSections.map((section) => (
              <ProofSectionCard key={section.id} section={section} content={content} />
            ))}
          </div>
        </section>
      ) : null}

      <ScopeAndFurtherWork system={system} content={content} />

      {system.retrievalComparison ? (
        <RetrievalComparisonSection comparison={system.retrievalComparison} content={content} />
      ) : null}

      {system.githubUrl || system.externalUrl ? <ProofLinkSection system={system} content={content} /> : null}
    </>
  )
}

function ScopeAndFurtherWork({ system, content }: Readonly<{
  system: FeaturedSystemCaseStudy
  content: ProjectContent
}>) {
  return system.limitations?.length || system.nextImprovements?.length ? (
    <section className={`grid gap-6 ${system.limitations?.length && system.nextImprovements?.length ? 'lg:grid-cols-2' : ''}`}>
      {system.limitations?.length ? (
        <article {...content.attrs('limitations')} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">Scope and limitations</h2>
          <DetailList className="mt-5" title="Interpreting this work" items={system.limitations} />
        </article>
      ) : null}
      {system.nextImprovements?.length ? (
        <article {...content.attrs('improvements')} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">Further technical work</h2>
          <DetailList className="mt-5" title="Possible next steps" items={system.nextImprovements} />
        </article>
      ) : null}
    </section>
  ) : null
}

function RetrievalComparisonSection({ comparison, content }: Readonly<{
  comparison: RetrievalComparison
  content: ProjectContent
}>) {
  return (
    <section>
      <DisclosurePanel {...content.attrs('retrieval-ladder')} title={comparison.title} summary={comparison.summary}>
        <div {...content.attrs('retrieval')} className="space-y-6">
          <p {...content.attrs('retrieval', 'overview')} className="max-w-4xl text-sm leading-7 text-text-secondary">
            {comparison.intro}
          </p>
          <RetrievalComparisonTable comparison={comparison} content={content} />
          <p {...content.attrs('retrieval', 'future-work')} className="max-w-4xl text-sm leading-7 text-text-secondary">
            {comparison.futureWork}
          </p>
        </div>
      </DisclosurePanel>
    </section>
  )
}

function RetrievalComparisonTable({ comparison, content }: Readonly<{
  comparison: RetrievalComparison
  content: ProjectContent
}>) {
  return (
    <div {...content.attrs('retrieval-level')} data-content-table className="overflow-x-auto rounded-[1.25rem] border border-border-subtle">
      <table {...content.attrs('retrieval-interpretation')} className="min-w-[800px] divide-y divide-border-subtle text-left text-sm">
        <caption {...content.attrs('retrieval-interpretations')} className="bg-background-subtle px-4 py-3 text-left font-medium text-text-primary">
          {comparison.title}
        </caption>
        <thead className="bg-background-subtle text-xs uppercase tracking-[0.16em] text-text-muted">
          <tr>
            {retrievalColumns.map(column => (
              <th key={column.key} scope="col" className="px-4 py-3">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle bg-background-elevated text-text-secondary">
          {comparison.methods.map(method => (
            <tr key={retrievalMethodKey(method)}>
              {retrievalColumns.map(column => column.key === 'systemType' ? (
                <th key={column.key} scope="row" {...content.attrs('retrieval-level', retrievalMethodKey(method))} className="px-4 py-3 font-medium text-text-primary">
                  {method.systemType}
                </th>
              ) : (
                <td key={column.key} {...content.attrs('retrieval-level', retrievalMethodKey(method), column.key)} className="px-4 py-3">
                  {method[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const curatedRelatedIds: Record<string, string[]> = {
  'ark-landscaping': ['matt-laur', 'vifg-nonprofit-platform'],
  'matt-laur': ['ark-landscaping', 'time2move'],
  time2move: ['vifg-nonprofit-platform', 'dealerflow'],
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
  content,
}: Readonly<{ system: FeaturedSystemCaseStudy; content: ProjectContent }>) {
  const { title, description } = projectProofLinkCopy(system)

  return (
    <section {...content.attrs('proof-links')} className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6 sm:p-7">
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
  content,
}: Readonly<{ system: FeaturedSystemCaseStudy; content: ProjectContent }>) {
  return (
    <div {...content.attrs('at-a-glance')} className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
        At a glance
      </p>
      <div className="mt-4 space-y-3">
        {system.story ? (
          <>
            <AtAGlanceItem label="Status" value={system.currentState} />
            {system.story.atAGlance.map((item) => (
              <AtAGlanceItem key={item.label} label={item.label} value={item.value} />
            ))}
          </>
        ) : (
          <>
        <AtAGlanceItem label="Context" value={system.contextLabel ?? system.caseStudyStage} />
        <AtAGlanceItem label="Current state" value={system.currentState} />
        <AtAGlanceItem label="Role" value={system.myRole} />
          </>
        )}
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

  return null
}

function NarrativeCard({
  title,
  body,
  destination,
}: Readonly<{ title: string; body: string; destination: ContentDestination }>) {
  return (
    <article {...destinationAttributes(destination)} className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{body}</p>
    </article>
  )
}

function ArchitectureFlow({ steps, content }: Readonly<{ steps: ArchitectureStep[]; content: ProjectContent }>) {
  return (
    <ol className="grid gap-4 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={`${step.label}-${index}`}
          {...content.attrs('architecture-step', projectBlockKey(step.label, step.detail))}
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
  content,
}: Readonly<{ system: FeaturedSystemCaseStudy; content: ProjectContent }>) {
  return (
    <article {...content.attrs('architecture-pieces')} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
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
    </article>
  )
}

function ProofSectionCard({ section, content }: Readonly<{ section: ProofSection; content: ProjectContent }>) {
  return (
    <article {...content.attrs('proof', section.id)} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-semibold text-text-primary">{section.title}</h3>
        <Badge variant={section.links?.length ? 'secondary' : 'outline'}>
          {section.links?.length ? 'Linked artifacts' : 'Implementation notes'}
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
      {section.links?.length ? (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
          {section.links.map(link => (
            <ExternalLinkAction key={link.href} href={link.href}>{link.label}</ExternalLinkAction>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function DetailList({
  title,
  items,
  className,
  destination,
}: Readonly<{
  title: string
  items: string[]
  className?: string
  destination?: ContentDestination
}>) {
  return (
    <div {...(destination ? destinationAttributes(destination) : {})} className={className}>
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

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { PageIntro } from '@/components/site/page-intro'
import { ProjectCard } from '@/components/site/project-card'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { SectionHeader } from '@/components/ui/section-header'
import { allSystems, getSystemById } from '@/data/systems'
import { createPageMetadata, absoluteUrl } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
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
    title: system.name,
    description: system.summary,
    path: `/case-studies/${slug}`,
    image: system.image,
    imageAlt: system.imageAlt,
  })
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params
  const system = getSystemById(slug)

  if (!system) {
    notFound()
  }

  const relatedProjects = allSystems
    .filter((item) => item.id !== system.id && item.caseStudyStage === system.caseStudyStage)
    .slice(0, 2)
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
        name: system.name,
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
          eyebrow={`${system.caseStudyStage} case study`}
          title={system.name}
          description={system.summary}
          actions={[{ label: 'Book a Call', href: '/contact' }]}
          aside={
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                At a glance
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    Delivery stage
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {system.caseStudyStage}
                  </p>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    Current state
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {system.currentState}
                  </p>
                </div>
                <div className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    My role
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {system.myRole}
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div
            className={
              system.visualSurface === 'dark'
                ? 'relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 dark:border-slate-800'
                : 'relative min-h-[420px] overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
            }
          >
            <Image
              src={system.image}
              alt={system.imageAlt}
              fill
              className="object-contain p-8"
              sizes="(min-width: 1280px) 52vw, 100vw"
            />
          </div>

          <div className="space-y-5">
            <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary">Problem</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{system.problem}</p>
            </article>
            <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary">What was built</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{system.system}</p>
            </article>
            <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-text-primary">Result</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{system.outcome}</p>
            </article>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="How the system was structured"
            subtitle="This section shows the operational logic behind the build, not just the user-facing surface."
          />
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
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

            <div className="space-y-6">
              <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-text-primary">Stack</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {system.stack.map((item) => (
                    <Badge key={item} variant="outline" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-text-primary">Supporting proof</h3>
                <p className="mt-4 text-sm leading-8 text-text-secondary">
                  {system.evidenceSummary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {system.evidence.map((artifact) => (
                    <Badge key={artifact} variant="primary">
                      {artifact}
                    </Badge>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        {system.externalUrl ? (
          <section className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Public-facing proof
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
              This system also has a live public surface, which matters because delivery
              only counts when the software is actually in use.
            </p>
            <div className="mt-6">
              <ExternalLinkAction href={system.externalUrl}>Visit live site</ExternalLinkAction>
            </div>
          </section>
        ) : null}

        {relatedProjects.length > 0 ? (
          <section>
            <SectionHeader
              align="left"
              title="Related case studies"
              subtitle="More work at a similar delivery stage."
            />
            <div className="grid gap-6">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} system={project} compact />
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

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { PageIntro } from '@/components/site/page-intro'
import { ProjectCard } from '@/components/site/project-card'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { allSystems, getSystemById } from '@/data/systems'

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
    return { title: 'Project Not Found' }
  }

  return {
    title: system.name,
    description: system.summary,
    openGraph: {
      title: `${system.name} | David Braun`,
      description: system.summary,
      images: [
        {
          url: system.image,
          alt: system.imageAlt,
        },
      ],
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const system = getSystemById(slug)

  if (!system) {
    notFound()
  }

  const relatedProjects = allSystems
    .filter((item) => item.id !== system.id && item.themeTitle === system.themeTitle)
    .slice(0, 2)

  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Project case study"
          title={system.name}
          description={system.summary}
          actions={[
            { label: 'Back to Projects', href: '/projects', variant: 'secondary' },
            ...(system.externalUrl
              ? [{ label: 'Visit Live Site', href: system.externalUrl, external: true as const }]
              : []),
          ]}
          aside={
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-700 dark:text-primary-300">
                Project facts
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Theme
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                    {system.themeTitle}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Current state
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                    {system.currentState}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    My role
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
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
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Problem</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {system.problem}
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Core constraint
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {system.coreConstraint}
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Outcome</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {system.outcome}
              </p>
            </article>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Approach"
            subtitle="A concise problem → system → evidence structure so the engineering story is easier to inspect."
          />
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                System design
              </h3>
              <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                {system.system}
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {system.systemHighlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </article>

            <div className="space-y-6">
              <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Stack</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {system.stack.map((item) => (
                    <Badge key={item} variant="outline" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Evidence</h3>
                <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
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
          <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Live project
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              This project also has a public live surface that helps reinforce the
              delivery story beyond screenshots and diagrams.
            </p>
            <a
              href={system.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
            >
              Visit live site
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </section>
        ) : null}

        {relatedProjects.length > 0 ? (
          <section>
            <SectionHeader
              align="left"
              title="Related work"
              subtitle="Projects in a similar problem family."
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
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
          >
            Back to all projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { FeaturedSystemCaseStudy } from '@/data/systems'

interface ProjectCardProps {
  system: FeaturedSystemCaseStudy
  href?: string
  compact?: boolean
}

export function ProjectCard({
  system,
  href = `/case-studies/${system.id}`,
  compact = false,
}: ProjectCardProps) {
  const visualPreview =
    system.proofSections.find((section) => section.id === 'architecture') ??
    system.proofSections[0]

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-border-subtle bg-background-elevated shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div
        className={compact ? 'grid gap-0 lg:grid-cols-[0.95fr_1.05fr]' : 'grid gap-0 xl:grid-cols-[1fr_1.05fr]'}
      >
        {system.image ? (
          <div
            className={
              system.visualSurface === 'dark'
                ? 'relative min-h-[220px] bg-slate-950'
                : 'relative min-h-[220px] bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
            }
          >
            <Image
              src={system.image}
              alt={system.imageAlt ?? `${system.name} visual`}
              fill
              className="object-contain p-6"
              sizes="(min-width: 1280px) 32vw, (min-width: 768px) 50vw, 100vw"
            />
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col justify-between bg-background-subtle p-6">
            <Badge
              variant="secondary"
              className="w-fit bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200"
            >
              {system.currentState}
            </Badge>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                Proof surface in progress
              </p>
              <p className="mt-3 text-base font-semibold tracking-tight text-text-primary">
                {visualPreview?.title ?? 'Architecture direction'}
              </p>
              <p className="mt-2 text-sm leading-7 text-text-secondary">
                {visualPreview?.summary ?? system.summary}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200"
            >
              {system.caseStudyStage}
            </Badge>
            <Badge variant="outline">{system.currentState}</Badge>
            <Badge variant="outline">{system.themeTitle}</Badge>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
            {system.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
            {system.summary}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-background-subtle p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                My Role
              </p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {system.myRole}
              </p>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-background-subtle p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                Outcome
              </p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {system.outcome}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {system.stack.slice(0, compact ? 4 : 5).map((item) => (
              <Badge key={item} variant="default">
                {item}
              </Badge>
            ))}
          </div>

          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Read case study
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

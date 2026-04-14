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
  href = `/projects/${system.id}`,
  compact = false,
}: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950">
      <div
        className={compact ? 'grid gap-0 lg:grid-cols-[0.95fr_1.05fr]' : 'grid gap-0 xl:grid-cols-[1fr_1.05fr]'}
      >
        <div
          className={
            system.visualSurface === 'dark'
              ? 'relative min-h-[220px] bg-slate-950'
              : 'relative min-h-[220px] bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
          }
        >
          <Image
            src={system.image}
            alt={system.imageAlt}
            fill
            className="object-contain p-6"
            sizes="(min-width: 1280px) 32vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
              {system.themeTitle}
            </Badge>
            <Badge variant="outline">{system.currentState}</Badge>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {system.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            {system.summary}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                My Role
              </p>
              <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                {system.myRole}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Outcome
              </p>
              <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-200">
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
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
          >
            Read case study
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

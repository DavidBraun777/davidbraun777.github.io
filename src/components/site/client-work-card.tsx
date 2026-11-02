import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import type { SystemCaseStudy } from '@/data/systems'

export function ClientWorkCard({ system, label = system.currentState }: Readonly<{
  system: SystemCaseStudy
  label?: string
}>) {
  return (
    <article className="flex flex-col gap-4 rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-link-primary">{label}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-text-primary">{system.name}</h3>
        <p className="mt-2 text-sm leading-7 text-text-secondary">{system.summary}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3">
        {system.externalUrl ? (
          <ExternalLinkAction href={system.externalUrl}>View live website</ExternalLinkAction>
        ) : null}
        <Link
          href={`/case-studies/${system.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
        >
          Read case study
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

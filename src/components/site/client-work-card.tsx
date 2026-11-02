import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import type { SystemCaseStudy } from '@/data/systems'

export function ClientWorkCard({ system, showScreenshot = false }: Readonly<{
  system: SystemCaseStudy
  showScreenshot?: boolean
}>) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[1.5rem] border border-border-subtle bg-background-elevated shadow-sm">
      {showScreenshot && system.image && system.imageAlt && (
        <div className="relative aspect-[16/10] border-b border-border-subtle bg-background-subtle">
          <Image
            src={system.image}
            alt={system.imageAlt}
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-link-primary">{system.currentState}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-text-primary">{system.name}</h3>
        <p className="mt-2 text-sm leading-7 text-text-secondary">{system.summary}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-4">
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
      </div>
    </article>
  )
}

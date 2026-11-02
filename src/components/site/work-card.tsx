import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import type { SystemCaseStudy } from '@/data/systems'
import { cn } from '@/lib/utils'

export function WorkCard({ system, layout = 'compact' }: Readonly<{
  system: SystemCaseStudy
  layout?: 'lead' | 'screenshot' | 'compact'
}>) {
  const lead = layout === 'lead'
  return (
    <article className={cn(
      'flex flex-col overflow-hidden rounded-[1.5rem] border border-border-subtle bg-background-elevated shadow-sm',
      lead && 'md:flex-row-reverse'
    )}>
      {layout !== 'compact' && system.image && system.imageAlt && (
        <div className={cn('relative aspect-[16/10] bg-background-subtle', lead && 'md:w-2/5')}>
          <Image
            src={system.image}
            alt={system.imageAlt}
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
            className={lead ? 'object-contain' : 'object-cover object-top'}
          />
        </div>
      )}
      <div className={cn('flex flex-1 flex-col items-start p-5 sm:p-6', lead && 'justify-center sm:p-8')}>
        <Badge variant="secondary">{system.currentState}</Badge>
        <h3 className={cn('mt-3 text-xl font-semibold tracking-tight text-text-primary', lead && 'text-2xl sm:text-3xl')}>
          {system.name}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-text-secondary">{system.summary}</p>
        {lead && <p className="mt-2 text-sm font-medium leading-7 text-text-primary">{system.myRole}</p>}
        <div className={cn('flex flex-wrap items-center gap-x-5 gap-y-3 pt-4', !lead && 'mt-auto')}>
          {system.externalUrl && (
            <ExternalLinkAction href={system.externalUrl}>View live website</ExternalLinkAction>
          )}
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

import { cn } from '@/lib/utils'
import type { CaseStudyMetric } from '@/data/systems'

interface MetricCardProps {
  readonly metric: CaseStudyMetric
  readonly compact?: boolean
  readonly className?: string
}

export function MetricCard({ metric, compact = false, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-[1.25rem] border border-border-subtle bg-background-elevated p-4 shadow-sm',
        compact && 'p-3',
        className
      )}
    >
      <p
        className={cn(
          'font-semibold tracking-tight text-text-primary',
          compact ? 'text-xl' : 'text-2xl'
        )}
      >
        {metric.value}
      </p>
      <p className="mt-1 text-sm leading-6 text-text-secondary">{metric.label}</p>
      {metric.detail ? (
        <p className="mt-2 text-xs leading-5 text-text-secondary">{metric.detail}</p>
      ) : null}
    </div>
  )
}

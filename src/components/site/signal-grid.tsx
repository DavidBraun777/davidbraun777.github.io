import type { Signal } from '@/data/profile'

interface SignalGridProps {
  items: Signal[]
  columns?: 'two' | 'four'
}

export function SignalGrid({ items, columns = 'four' }: SignalGridProps) {
  return (
    <div
      className={
        columns === 'two'
          ? 'grid gap-4 md:grid-cols-2'
          : 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'
      }
    >
      {items.map((item) => {
        const Icon = item.icon

        return (
          <article
            key={item.title}
            className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
          >
            <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
              {item.title}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-text-primary">
              {item.value}
            </h3>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {item.detail}
            </p>
          </article>
        )
      })}
    </div>
  )
}

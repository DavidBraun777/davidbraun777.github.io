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
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {item.title}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
              {item.value}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {item.detail}
            </p>
          </article>
        )
      })}
    </div>
  )
}

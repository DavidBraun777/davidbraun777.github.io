import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface DisclosurePanelProps {
  title: string
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}

export function DisclosurePanel({
  title,
  summary,
  children,
  defaultOpen = false,
}: DisclosurePanelProps) {
  return (
    <details
      className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{summary}</p>
        </div>
        <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-transform group-open:rotate-180 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <ChevronDown className="h-4 w-4" />
        </span>
      </summary>
      <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">{children}</div>
    </details>
  )
}

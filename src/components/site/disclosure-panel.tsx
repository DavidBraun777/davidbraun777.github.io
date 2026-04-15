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
      className="group rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-text-secondary">{summary}</p>
        </div>
        <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-subtle text-text-secondary transition-transform group-open:rotate-180">
          <ChevronDown className="h-4 w-4" />
        </span>
      </summary>
      <div className="mt-5 border-t border-border-subtle pt-5">{children}</div>
    </details>
  )
}

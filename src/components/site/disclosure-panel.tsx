'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface DisclosurePanelProps {
  id?: string
  title: string
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}

export function DisclosurePanel({
  id,
  title,
  summary,
  children,
  defaultOpen = false,
}: Readonly<DisclosurePanelProps>) {
  const panelRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (!id) return
    let frame = 0
    const revealHashTarget = () => {
      if (window.location.hash !== `#${id}`) return
      const panel = panelRef.current
      if (!panel) return
      panel.open = true
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        panel.scrollIntoView({ block: 'start' })
        panel.focus({ preventScroll: true })
      })
    }
    revealHashTarget()
    window.addEventListener('hashchange', revealHashTarget)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', revealHashTarget)
    }
  }, [id])

  return (
    <details
      ref={panelRef}
      id={id}
      tabIndex={id ? -1 : undefined}
      className="group scroll-mt-28 rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
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

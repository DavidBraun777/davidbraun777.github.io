'use client'

import { useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { notifyContentLayout, registerContentDisclosure } from '@/lib/content-navigation'

/** One state owner for manual toggles and fragment-driven disclosure opening. */
export function ContentDetails({ open: initiallyOpen = false, onToggle, children, ...props }: ComponentProps<'details'>) {
  const [open, setOpen] = useState(initiallyOpen)
  const panelRef = useRef<HTMLDetailsElement>(null)
  useLayoutEffect(() => {
    // The unconditional native details element receives its ref before layout effects.
    return registerContentDisclosure(panelRef.current!, () => setOpen(true))
  }, [])
  useLayoutEffect(notifyContentLayout, [open])
  return (
    <details {...props} ref={panelRef} open={open} onToggle={event => {
      setOpen(event.currentTarget.open)
      onToggle?.(event)
    }}>
      {children}
    </details>
  )
}

interface DisclosurePanelProps extends Omit<ComponentProps<'details'>, 'title' | 'children' | 'open'> {
  id?: string
  title: string
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}

export function DisclosurePanel({ id, title, summary, children, defaultOpen = false, ...props }: Readonly<DisclosurePanelProps>) {
  return (
    <ContentDetails
      id={id}
      tabIndex={id ? -1 : undefined}
      data-content-target={id ? '' : undefined}
      className="group scroll-mt-28 rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
      {...props}
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
    </ContentDetails>
  )
}

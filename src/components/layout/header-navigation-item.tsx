'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { NavigationItem } from '@/data/profile'
import { cn } from '@/lib/utils'

interface HeaderNavigationItemProps {
  item: NavigationItem
  active: boolean
  mobile?: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: () => void
}

export function HeaderNavigationItem({
  item,
  active,
  mobile = false,
  open,
  onOpenChange,
  onNavigate,
}: Readonly<HeaderNavigationItemProps>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pinnedOpen = useRef(false)
  const panelId = `${mobile ? 'mobile' : 'desktop'}-${item.href.slice(1)}-navigation`

  useEffect(() => {
    if (!open) {
      pinnedOpen.current = false
      return
    }

    const close = () => {
      pinnedOpen.current = false
      onOpenChange(false)
    }
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close()
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const focusInside = containerRef.current?.contains(document.activeElement)
      if (focusInside) event.stopPropagation()
      close()
      if (focusInside) triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', handleOutsidePointer)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  const tone = active
    ? 'bg-[var(--theme-frame-overlay-strong)] text-[var(--theme-frame-text)]'
    : 'text-[var(--theme-frame-text-muted)] hover:bg-[var(--theme-frame-overlay)] hover:text-[var(--theme-frame-text)]'
  const linkClass = cn(
    'text-sm font-medium transition-colors',
    mobile ? 'rounded-2xl px-4 py-3' : 'whitespace-nowrap rounded-full px-4 py-2'
  )

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(linkClass, mobile && 'bg-[var(--theme-frame-overlay)]', tone)}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerEnter={(event) => {
        if (!mobile && event.pointerType === 'mouse') onOpenChange(true)
      }}
      onPointerLeave={() => {
        if (!mobile && !pinnedOpen.current && !containerRef.current?.contains(document.activeElement)) {
          onOpenChange(false)
        }
      }}
      onFocus={(event) => {
        if (!mobile && !event.currentTarget.contains(event.relatedTarget)) onOpenChange(true)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          pinnedOpen.current = false
          onOpenChange(false)
        }
      }}
    >
      <div className={cn('flex items-center', mobile ? 'rounded-2xl bg-[var(--theme-frame-overlay)]' : 'rounded-full', tone)}>
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? 'page' : undefined}
          className={cn(linkClass, mobile ? 'flex-1' : 'pr-1')}
        >
          {item.label}
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-label={`${item.label} navigation`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            // The first click keeps a hover/focus-opened menu open; a second closes it.
            const nextOpen = mobile ? !open : !(open && pinnedOpen.current)
            pinnedOpen.current = nextOpen
            onOpenChange(nextOpen)
          }}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-full hover:bg-[var(--theme-frame-overlay-strong)]',
            mobile ? 'h-12 w-12' : 'h-9 w-8'
          )}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn('h-4 w-4 transition-transform duration-150 motion-reduce:transition-none', open && 'rotate-180')}
          />
        </button>
      </div>

      {open ? (
        <div className={mobile ? 'ml-4 mt-2 border-l border-[var(--theme-frame-border)] pl-3' : 'absolute left-0 top-full z-50 w-56 pt-2'}>
          <ul
            id={panelId}
            aria-label={`${item.label} links`}
            className={cn(
              'space-y-1',
              !mobile && 'rounded-2xl border border-[var(--theme-frame-border)] bg-[var(--theme-frame-bg-solid)] p-2 shadow-lg'
            )}
          >
            {item.children.map((child) => (
              <li
                key={child.href}
                className={child.separatorBefore ? 'mt-2 border-t border-[var(--theme-frame-border)] pt-2' : undefined}
              >
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  target={child.external ? '_blank' : undefined}
                  rel={child.external ? 'noopener noreferrer' : undefined}
                  className="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-medium text-[var(--theme-frame-text-muted)] transition-colors hover:bg-[var(--theme-frame-overlay)] hover:text-[var(--theme-frame-text)]"
                >
                  {child.label}
                  {child.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

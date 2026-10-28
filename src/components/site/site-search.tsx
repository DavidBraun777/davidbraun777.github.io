'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { loadSearchIndex } from '@/lib/search/client'
import { SEARCH_QUERY_LIMIT, searchContent } from '@/lib/search/search'
import type { SearchRecord } from '@/lib/search/types'

const suggestions = [
  { title: 'Case Studies', href: '/case-studies' },
  { title: 'Research', href: '/research' },
  { title: 'Experience', href: '/experience' },
  { title: 'Writing', href: '/writing' },
  { title: 'Résumés & CV', href: '/resumes' },
]

const PAGE_SIZE = 10

interface SiteSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  returnFocusRef: RefObject<HTMLElement | null>
}

function focusDestination(href: string) {
  const destination = new URL(href, window.location.origin)
  if (destination.pathname !== window.location.pathname || !destination.hash) return
  let id: string
  try {
    id = decodeURIComponent(destination.hash.slice(1))
  } catch {
    return
  }
  const target = document.getElementById(id)
  if (!target) return

  for (let node: HTMLElement | null = target; node; node = node.parentElement) {
    if (node instanceof HTMLDetailsElement) node.open = true
  }
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1
  target.focus({ preventScroll: true })
  target.scrollIntoView({ block: 'start', behavior: 'instant' })
}

export function SiteSearch({ open, onOpenChange, returnFocusRef }: Readonly<SiteSearchProps>) {
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState<SearchRecord[]>([])
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [announcement, setAnnouncement] = useState('')
  const [availableHeight, setAvailableHeight] = useState<number>()
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedHref = useRef<string | null>(null)
  const nextResultToFocus = useRef<number | null>(null)
  const resultListRef = useRef<HTMLUListElement>(null)
  const hasQuery = query.trim().length > 0
  const results = useMemo(() => searchContent(records, query), [records, query])

  useEffect(() => {
    if (!open) return
    let active = true
    setLoadState('loading')
    loadSearchIndex().then(
      (index) => {
        if (!active) return
        setRecords(index)
        setLoadState('ready')
      },
      () => {
        if (active) setLoadState('error')
      }
    )
    return () => { active = false }
  }, [open, retryAttempt])

  useEffect(() => {
    if (!open) return
    const viewport = window.visualViewport
    if (!viewport) return
    const resize = () => setAvailableHeight(Math.max(160, viewport.height - 32))
    resize()
    viewport.addEventListener('resize', resize)
    return () => viewport.removeEventListener('resize', resize)
  }, [open])

  let status = 'Suggestions. Choose a destination or enter a search.'
  if (loadState === 'error') {
    status = 'Search could not load. Please retry.'
  } else if (hasQuery) {
    if (loadState !== 'ready') {
      status = 'Loading search…'
    } else if (results.length === 0) {
      status = 'No results found. Try a project name, technology, or a shorter phrase.'
    } else {
      status = `${results.length} ${results.length === 1 ? 'result' : 'results'}. Showing ${Math.min(visibleCount, results.length)}.`
    }
  }

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => setAnnouncement(status), 180)
    return () => window.clearTimeout(timer)
  }, [open, query, status])

  useEffect(() => {
    if (nextResultToFocus.current === null) return
    resultListRef.current?.querySelectorAll<HTMLAnchorElement>('a')[nextResultToFocus.current]?.focus()
    nextResultToFocus.current = null
  }, [visibleCount])

  const closeForNavigation = (href: string) => {
    selectedHref.current = href
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-slate-950/65 backdrop-blur-sm" />
        <Dialog.Content
          id="site-search-dialog"
          className="fixed left-1/2 top-4 z-[101] flex max-h-[calc(100dvh-2rem)] w-[calc(100%_-_1.5rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-border-subtle bg-background-elevated text-text-primary shadow-2xl sm:rounded-[1.5rem]"
          style={availableHeight ? { maxHeight: `min(84dvh, ${availableHeight}px)` } : undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            selectedHref.current = null
            inputRef.current?.focus()
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            const href = selectedHref.current
            selectedHref.current = null
            if (href) {
              window.requestAnimationFrame(() => focusDestination(href))
            } else if (returnFocusRef.current?.isConnected) {
              returnFocusRef.current.focus({ preventScroll: true })
            }
          }}
        >
          <div className="shrink-0 border-b border-border-subtle p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <Dialog.Title className="text-xl font-semibold tracking-tight">
                Search the site
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close search"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle text-text-secondary hover:bg-background-subtle motion-reduce:transition-none"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-1 text-sm text-text-secondary">
              Try VIFG, AWS, or résumé
            </Dialog.Description>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border-strong bg-background px-3">
              <Search className="h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                id="site-search-input"
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.currentTarget.value.slice(0, SEARCH_QUERY_LIMIT))
                  setVisibleCount(PAGE_SIZE)
                }}
                maxLength={SEARCH_QUERY_LIMIT}
                aria-label="Search site content"
                placeholder="Search projects, research, writing…"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 rounded py-3 text-base text-text-primary placeholder:text-text-muted [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('')
                    setVisibleCount(PAGE_SIZE)
                    inputRef.current?.focus()
                  }}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-background-subtle motion-reduce:transition-none"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
            <p role="status" aria-live="polite" aria-atomic="true" className="mb-3 text-sm leading-6 text-text-secondary">
              {announcement}
            </p>

            {loadState === 'error' ? (
              <div className="mb-4 rounded-xl border border-border-subtle bg-background-subtle p-4">
                <p className="text-sm leading-6 text-text-secondary">
                  Search is temporarily unavailable. You can retry or browse the suggested pages.
                </p>
                <button
                  type="button"
                  onClick={() => setRetryAttempt((attempt) => attempt + 1)}
                  className="mt-3 min-h-11 rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-link-primary hover:bg-background-elevated motion-reduce:transition-none"
                >
                  Retry loading search
                </button>
              </div>
            ) : null}

            {!hasQuery || loadState === 'error' ? (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Suggestions</h2>
                <ul className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.href}>
                      <Link
                        href={suggestion.href}
                        onNavigate={() => closeForNavigation(suggestion.href)}
                        className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-medium text-link-primary hover:bg-background-subtle motion-reduce:transition-none"
                      >
                        {suggestion.title}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : loadState === 'ready' ? (
              <>
                <ul ref={resultListRef} className="space-y-2" aria-label="Search results">
                  {results.slice(0, visibleCount).map(({ record, snippet }) => (
                    <li key={record.id}>
                      <Link
                        href={record.href}
                        prefetch={false}
                        onNavigate={() => closeForNavigation(record.href)}
                        className="block rounded-xl border border-border-subtle px-4 py-3 hover:border-border-strong hover:bg-background-subtle motion-reduce:transition-none"
                      >
                        <span className="text-xs font-medium text-text-muted">{record.type}</span>
                        <span className="mt-1 block font-semibold leading-6 text-link-primary">{record.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-text-secondary">{snippet}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {results.length > visibleCount ? (
                  <button
                    type="button"
                    onClick={() => {
                      nextResultToFocus.current = visibleCount
                      setVisibleCount((count) => count + PAGE_SIZE)
                    }}
                    className="mt-4 min-h-11 w-full rounded-xl border border-border-strong px-4 py-3 text-sm font-medium text-link-primary hover:bg-background-subtle motion-reduce:transition-none"
                  >
                    Show more results
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

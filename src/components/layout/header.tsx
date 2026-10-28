'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { northStarIdentity } from '@/data/career-story'
import { primaryNavigation, profile } from '@/data/profile'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { HeaderNavigationItem } from '@/components/layout/header-navigation-item'
import { SiteSearch } from '@/components/site/site-search'

function isActive(pathname: string, href: string) {
  const normalizedHref = href.split('#')[0] || '/'
  if (normalizedHref === '/') return pathname === '/'
  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`)
}

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopSection, setDesktopSection] = useState<string | null>(null)
  const [mobileSection, setMobileSection] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)
  const searchTriggerRef = useRef<HTMLButtonElement>(null)
  const searchReturnFocusRef = useRef<HTMLElement | null>(null)

  const closeNavigation = useCallback(() => {
    setMenuOpen(false)
    setDesktopSection(null)
    setMobileSection(null)
  }, [])

  const openSearch = useCallback((trigger?: HTMLElement) => {
    const previousFocus = trigger ?? document.activeElement
    searchReturnFocusRef.current = previousFocus instanceof HTMLElement
      && !previousFocus.closest('#mobile-navigation, [id$="-navigation"]')
      ? previousFocus
      : searchTriggerRef.current
    closeNavigation()
    setSearchOpen(true)
  }, [closeNavigation])

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat || event.altKey) return
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return
      const target = event.target
      if (target instanceof Element && target.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]'
      )) return
      event.preventDefault()
      if (!searchOpen) openSearch()
    }
    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [openSearch, searchOpen])

  useEffect(() => {
    closeNavigation()
    setSearchOpen(false)
  }, [pathname, closeNavigation])

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 1280px)')
    desktopViewport.addEventListener('change', closeNavigation)
    return () => desktopViewport.removeEventListener('change', closeNavigation)
  }, [closeNavigation])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNavigation()
        mobileTriggerRef.current?.focus()
      }
    }
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeNavigation()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handleOutsidePointer)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handleOutsidePointer)
    }
  }, [menuOpen, closeNavigation])

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-[var(--theme-frame-border)] bg-[var(--theme-frame-bg)] text-[var(--theme-frame-text)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:gap-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Link href="/" onClick={closeNavigation} className="inline-flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-[var(--theme-frame-text)]">
              {profile.name}
            </span>
            <span className="text-xs text-[var(--theme-frame-text-muted)] sm:text-sm">
              {northStarIdentity}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <HeaderNavigationItem
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              open={desktopSection === item.href}
              onOpenChange={(open) => setDesktopSection((current) => open ? item.href : current === item.href ? null : current)}
              onNavigate={closeNavigation}
            />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            ref={searchTriggerRef}
            type="button"
            aria-label="Search site"
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            aria-expanded={searchOpen}
            aria-controls="site-search-dialog"
            title="Search site (⌘K / Ctrl+K)"
            onClick={(event) => openSearch(event.currentTarget)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--theme-frame-border)] bg-[var(--theme-frame-overlay)] text-[var(--theme-frame-text)] hover:border-[var(--theme-frame-border-strong)] hover:bg-[var(--theme-frame-overlay-strong)] motion-reduce:transition-none xl:h-10 xl:w-auto xl:gap-2 xl:px-3"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap text-sm xl:inline">Search site…</span>
          </button>
          <ThemeToggle />
          <Link
            href="/contact"
            onClick={closeNavigation}
            className="hidden whitespace-nowrap rounded-full bg-[var(--theme-frame-cta-bg)] px-4 py-2 text-sm font-medium text-[var(--theme-frame-cta-text)] transition-colors hover:bg-[var(--theme-frame-cta-bg-hover)] xl:inline-flex"
          >
            Book a Call
          </Link>
          <button
            ref={mobileTriggerRef}
            type="button"
            onClick={() => {
              setMenuOpen((current) => !current)
              setMobileSection(null)
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--theme-frame-border)] bg-[var(--theme-frame-overlay)] text-[var(--theme-frame-text)] hover:border-[var(--theme-frame-border-strong)] hover:bg-[var(--theme-frame-overlay-strong)] xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-[var(--theme-frame-border)] bg-[var(--theme-frame-bg-solid)] px-4 py-4 shadow-lg xl:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {primaryNavigation.map((item) => (
              <HeaderNavigationItem
                key={item.href}
                item={item}
                active={isActive(pathname, item.href)}
                mobile
                open={mobileSection === item.href}
                onOpenChange={(open) => setMobileSection((current) => open ? item.href : current === item.href ? null : current)}
                onNavigate={closeNavigation}
              />
            ))}
          </nav>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link
              href="/contact"
              onClick={closeNavigation}
              className="rounded-2xl bg-[var(--theme-frame-cta-bg)] px-4 py-3 text-center text-sm font-medium text-[var(--theme-frame-cta-text)] transition-colors hover:bg-[var(--theme-frame-cta-bg-hover)] sm:col-span-2"
            >
              Book a Call
            </Link>
          </div>
        </div>
      ) : null}
      <SiteSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        returnFocusRef={searchReturnFocusRef}
      />
    </header>
  )
}

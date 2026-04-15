'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { primaryNavigation, profile } from '@/data/profile'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/site/theme-toggle'

function isActive(pathname: string, href: string) {
  const normalizedHref = href.split('#')[0] || '/'
  if (normalizedHref === '/') return pathname === '/'
  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`)
}

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-primary-800/40 bg-primary-900/92 text-primary-50 backdrop-blur-xl dark:border-border-subtle/80 dark:bg-background-elevated/88 dark:text-text-primary">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Link href="/" className="inline-flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-primary-50 dark:text-text-primary">
              {profile.name}
            </span>
            <span className="text-sm text-primary-100/70 dark:text-text-muted">
              Workflow automation and systems consulting
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNavigation.map((item) => {
            const active = isActive(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/12 text-white dark:bg-white dark:text-slate-950'
                    : 'text-primary-100/82 hover:bg-white/8 hover:text-white dark:text-text-secondary dark:hover:bg-background-subtle dark:hover:text-text-primary'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/contact"
            className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-900 transition-colors hover:bg-white dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
          >
            Book a Call
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-primary-50 dark:border-border-subtle dark:bg-background-elevated dark:text-text-secondary"
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
          className="border-t border-primary-800/40 bg-primary-900 px-4 py-4 shadow-lg dark:border-border-subtle dark:bg-background-elevated lg:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {primaryNavigation.map((item) => {
              const active = isActive(pathname, item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                  'rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/12 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-white/6 text-primary-100/82 hover:bg-white/10 hover:text-white dark:bg-background-subtle dark:text-text-secondary dark:hover:bg-background-elevated dark:hover:text-text-primary'
                )}
              >
                {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link
              href="/contact"
              className="rounded-2xl bg-primary-50 px-4 py-3 text-center text-sm font-medium text-primary-900 transition-colors hover:bg-white dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400 sm:col-span-2"
            >
              Book a Call
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

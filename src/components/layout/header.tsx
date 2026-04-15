'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { primaryNavigation, profile } from '@/data/profile'
import { resumeUrl } from '@/data/social-links'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/site/theme-toggle'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
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
    <header className="sticky top-0 z-50 border-b border-border-subtle/80 bg-background-elevated/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Link href="/" className="inline-flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              {profile.name}
            </span>
            <span className="text-sm text-text-muted">
              AI systems, software, and infrastructure
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
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'text-text-secondary hover:bg-background-subtle hover:text-text-primary'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border-subtle bg-background-elevated px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary"
          >
            View Resume
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle bg-background-elevated text-text-secondary"
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
          className="border-t border-border-subtle bg-background-elevated px-4 py-4 shadow-lg lg:hidden"
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
                    ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                    : 'bg-background-subtle text-text-secondary hover:bg-background-elevated hover:text-text-primary'
                )}
              >
                {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-center text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary"
            >
              View Resume
            </a>
            <Link
              href="/contact"
              className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
            >
              Contact
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

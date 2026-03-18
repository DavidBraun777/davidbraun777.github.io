'use client'

import { useState, useEffect, useMemo, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, FileText } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CurrentStatus } from './current-status'
import { resumeUrl } from '@/data/social-links'
import { useScrollSpy } from '@/hooks/useScrollSpy'

interface PageShortcut {
  name: string
  href: string
  sectionId?: string
}

interface PageTab {
  id: string
  name: string
  href: string
  description: string
  shortcuts: PageShortcut[]
  sectionId?: string
}

const homeShortcuts: PageShortcut[] = [
  { name: 'Overview', href: '/#top', sectionId: 'top' },
  { name: 'Build', href: '/#what-i-build', sectionId: 'what-i-build' },
  { name: 'Systems', href: '/#selected-systems', sectionId: 'selected-systems' },
  { name: 'Process', href: '/#how-i-build', sectionId: 'how-i-build' },
  { name: 'Contact', href: '/#contact', sectionId: 'contact' },
]

const blogShortcuts: PageShortcut[] = [
  { name: 'Overview', href: '/blog#blog-overview', sectionId: 'blog-overview' },
  { name: 'Thesis', href: '/blog#systems-thesis', sectionId: 'systems-thesis' },
  { name: 'Posts', href: '/blog#blog-posts', sectionId: 'blog-posts' },
]

const experienceShortcuts: PageShortcut[] = [
  { name: 'Overview', href: '/background#experience-overview', sectionId: 'experience-overview' },
  { name: 'Work', href: '/background#work-experience', sectionId: 'work-experience' },
  { name: 'Skills', href: '/background#skills', sectionId: 'skills' },
  { name: 'Focus', href: '/background#focus-areas', sectionId: 'focus-areas' },
  {
    name: 'Credentials',
    href: '/background#education-credentials',
    sectionId: 'education-credentials',
  },
]

const pageTabs: PageTab[] = [
  {
    id: 'home',
    name: 'Home',
    href: '/#top',
    description: 'Systems portfolio and flagship case studies.',
    shortcuts: homeShortcuts,
    sectionId: 'top',
  },
  {
    id: 'blog',
    name: 'Blog',
    href: '/blog',
    description: 'Engineering notes on AI systems and workflow architecture.',
    shortcuts: blogShortcuts,
    sectionId: 'blog-overview',
  },
  {
    id: 'experience',
    name: 'Experience',
    href: '/background',
    description: 'Work history, stack, credentials, and current focus areas.',
    shortcuts: experienceShortcuts,
    sectionId: 'experience-overview',
  },
]

function getActivePageId(pathname: string) {
  if (pathname.startsWith('/blog')) return 'blog'
  if (pathname.startsWith('/background')) return 'experience'
  return 'home'
}

function getTrackedSectionIds(pathname: string) {
  if (pathname === '/') return homeShortcuts.flatMap((item) => (item.sectionId ? [item.sectionId] : []))
  if (pathname === '/blog') return blogShortcuts.flatMap((item) => (item.sectionId ? [item.sectionId] : []))
  if (pathname === '/background') {
    return experienceShortcuts.flatMap((item) => (item.sectionId ? [item.sectionId] : []))
  }
  return []
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const activePageId = useMemo(() => getActivePageId(pathname), [pathname])
  const trackedSectionIds = useMemo(() => getTrackedSectionIds(pathname), [pathname])
  const activeSection = useScrollSpy({
    sectionIds: trackedSectionIds,
    offset: 144,
  })

  const activePage = useMemo(
    () => pageTabs.find((page) => page.id === activePageId) ?? pageTabs[0],
    [activePageId]
  )

  const activeShortcut = useMemo(() => {
    if (trackedSectionIds.length === 0) return null
    const shortcut = activePage.shortcuts.find((item) => item.sectionId === activeSection)
    return shortcut?.name ?? null
  }, [activePage.shortcuts, activeSection, trackedSectionIds.length])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleSectionLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    sectionId?: string
  ) => {
    if (!sectionId) return

    const [targetPath] = href.split('#')
    const normalizedPath = targetPath || '/'

    if (normalizedPath !== pathname) return

    const target = document.getElementById(sectionId)
    if (!target) return

    event.preventDefault()
    setIsMobileMenuOpen(false)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const headerOffset = window.innerWidth >= 1024 ? 144 : 112
    const targetTop = Math.max(
      target.getBoundingClientRect().top + window.scrollY - headerOffset,
      0
    )

    if (window.location.hash !== `#${sectionId}`) {
      window.history.replaceState(null, '', href)
    }

    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/72 dark:bg-slate-950/72 backdrop-blur-xl shadow-lg shadow-slate-200/10 dark:shadow-slate-900/10'
            : 'bg-transparent'
        )}
      >
        <nav className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-5 py-2 md:min-h-20 lg:min-h-0 lg:items-start lg:py-4 xl:gap-6">
            <div className="flex min-w-0 items-center gap-3 lg:items-start lg:gap-3 xl:gap-4">
              <Link
                href="/#top"
                onClick={(event) => handleSectionLinkClick(event, '/#top', 'top')}
                className="group flex shrink-0 items-center gap-2 lg:-translate-x-12 xl:-translate-x-14"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.45rem] border border-white/12 bg-slate-950/75 shadow-[0_16px_35px_-18px_rgba(15,23,42,0.85)] backdrop-blur md:h-16 md:w-16 lg:h-[7rem] lg:w-[6.4rem] lg:rounded-[1.8rem] xl:h-[7rem] xl:w-[6.4rem]"
                >
                  <span className="bg-gradient-to-r from-primary-500 to-accent-violet bg-clip-text text-xl font-bold text-transparent md:text-2xl lg:text-[2.7rem]">
                    DB
                  </span>
                </motion.div>
              </Link>

              <div className="hidden min-w-0 lg:flex items-start">
                <div className="-ml-14 flex min-w-0 items-stretch gap-2 xl:gap-3">
                  {pageTabs.map((page) => {
                    const isActive = activePageId === page.id

                    return (
                      <motion.div
                        key={page.id}
                        layout
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        className={cn(
                          'overflow-hidden rounded-[1.65rem] border backdrop-blur-xl',
                          isActive
                            ? 'min-w-[22rem] flex-[1_1_26rem] border-slate-200/80 bg-white/85 shadow-lg shadow-slate-200/10 dark:border-slate-700/80 dark:bg-slate-900/78 dark:shadow-slate-950/20'
                            : 'flex w-[6.8rem] border-slate-200/60 bg-white/55 dark:border-slate-800/60 dark:bg-slate-900/45'
                        )}
                      >
                        <Link
                          href={page.href}
                          onClick={(event) =>
                            handleSectionLinkClick(event, page.href, isActive ? page.sectionId : undefined)
                          }
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'transition-colors',
                            isActive
                              ? 'block px-4 py-3'
                              : 'flex h-full w-full flex-1 flex-col justify-start px-3 py-4 text-center hover:bg-white/55 dark:hover:bg-white/5'
                          )}
                        >
                          <div
                            className={cn(
                              'flex items-center gap-3',
                              isActive ? 'justify-between' : 'justify-center'
                            )}
                          >
                            <div className={cn('min-w-0', !isActive && 'text-center')}>
                              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                                {isActive ? 'Current page' : 'Page'}
                              </p>
                              <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
                                {page.name}
                              </p>
                            </div>
                            {isActive ? (
                              <p className="hidden max-w-[16rem] text-right text-xs leading-relaxed text-slate-500 dark:text-slate-400 xl:block">
                                {page.description}
                              </p>
                            ) : null}
                          </div>
                        </Link>

                        <AnimatePresence initial={false}>
                          {isActive ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.24, ease: 'easeOut' }}
                              className="overflow-hidden border-t border-slate-200/80 px-3 pb-3 pt-2 dark:border-slate-800/80"
                            >
                              <div className="flex flex-wrap gap-1.5">
                                {page.shortcuts.map((shortcut) => {
                                  const isShortcutActive = activeShortcut === shortcut.name

                                  return (
                                    <Link
                                      key={shortcut.name}
                                      href={shortcut.href}
                                      onClick={(event) =>
                                        handleSectionLinkClick(event, shortcut.href, shortcut.sectionId)
                                      }
                                      aria-current={isShortcutActive ? 'location' : undefined}
                                      className={cn(
                                        'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                                        isShortcutActive
                                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                                      )}
                                    >
                                      {shortcut.name}
                                    </Link>
                                  )
                                })}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-1 justify-center px-2 lg:hidden">
              <CurrentStatus compact className="w-full max-w-[214px] sm:max-w-[228px]" />
            </div>

            <div className="flex shrink-0 items-center gap-3 lg:items-start lg:pt-2 xl:gap-4">
              <CurrentStatus className="hidden xl:flex" />

              <Link
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume PDF in a new tab"
                className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100/90 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800/90 shrink-0 xl:px-3 2xl:px-4"
              >
                <FileText aria-hidden="true" className="w-4 h-4" />
                <span className="hidden 2xl:inline">Resume</span>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-site-navigation"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              id="mobile-site-navigation"
              className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                      Navigation
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      Explore the site
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5">
                {pageTabs.map((page, index) => {
                  const isActive = activePageId === page.id

                  return (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className={cn(
                        'rounded-[1.5rem] border p-4',
                        isActive
                          ? 'border-slate-900 bg-slate-900 shadow-xl shadow-slate-950/15 dark:border-primary-700 dark:bg-primary-950/75'
                          : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'
                      )}
                    >
                      <Link
                        href={page.href}
                        onClick={(event) => {
                          handleSectionLinkClick(event, page.href, isActive ? page.sectionId : undefined)
                          setIsMobileMenuOpen(false)
                        }}
                        className="block"
                      >
                        <p
                          className={cn(
                            'font-mono text-[10px] uppercase tracking-[0.22em]',
                            isActive
                              ? 'text-slate-300 dark:text-primary-200'
                              : 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          {isActive ? 'Current page' : 'Page'}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <h2
                            className={cn(
                              'text-lg font-semibold',
                              isActive ? 'text-white' : 'text-slate-900 dark:text-white'
                            )}
                          >
                            {page.name}
                          </h2>
                          {!isActive ? (
                            <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                              Open
                            </span>
                          ) : null}
                        </div>
                        {isActive ? (
                          <p className="mt-2 text-sm leading-relaxed text-slate-200 dark:text-primary-100/90">
                            {page.description}
                          </p>
                        ) : null}
                      </Link>

                      {isActive ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {page.shortcuts.map((shortcut) => (
                            <Link
                              key={shortcut.name}
                              href={shortcut.href}
                              onClick={(event) => {
                                handleSectionLinkClick(event, shortcut.href, shortcut.sectionId)
                                setIsMobileMenuOpen(false)
                              }}
                              className={cn(
                                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                                activeShortcut === shortcut.name
                                  ? 'bg-white text-slate-950 dark:bg-white dark:text-slate-950'
                                  : 'bg-white/12 text-white hover:bg-white/18 dark:bg-white/10 dark:text-white dark:hover:bg-white/16'
                              )}
                            >
                              {shortcut.name}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </motion.div>
                  )
                })}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: pageTabs.length * 0.08 }}
                >
                  <Link
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-primary-300 dark:hover:bg-slate-900"
                  >
                    <FileText aria-hidden="true" className="w-4 h-4" />
                    Open resume
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

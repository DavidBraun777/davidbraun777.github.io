'use client'

import { useState, useEffect, useMemo } from 'react'
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
  },
  {
    id: 'blog',
    name: 'Blog',
    href: '/blog',
    description: 'Engineering notes on AI systems and workflow architecture.',
    shortcuts: blogShortcuts,
  },
  {
    id: 'experience',
    name: 'Experience',
    href: '/background',
    description: 'Work history, stack, credentials, and current focus areas.',
    shortcuts: experienceShortcuts,
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
            <div className="flex min-w-0 items-center gap-4 lg:items-start xl:gap-6">
              <Link href="/#top" className="flex items-center gap-2 group shrink-0">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-violet bg-clip-text text-transparent"
                >
                  DB
                </motion.span>
              </Link>

              <div className="hidden min-w-0 lg:flex items-start">
                <div className="flex min-w-0 items-stretch gap-2 xl:gap-3">
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
                            : 'w-[6.8rem] border-slate-200/60 bg-white/55 dark:border-slate-800/60 dark:bg-slate-900/45'
                        )}
                      >
                        <Link
                          href={page.href}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'block transition-colors',
                            isActive
                              ? 'px-4 py-3'
                              : 'px-3 py-4 text-center hover:bg-white/55 dark:hover:bg-white/5'
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
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="flex flex-col gap-4 p-6 pt-20">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                    Current Status
                  </p>
                  <CurrentStatus className="mt-3 w-full max-w-none" />
                </div>

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
                          ? 'border-primary-300 bg-primary-50 dark:border-primary-800 dark:bg-primary-950/40'
                          : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'
                      )}
                    >
                      <Link
                        href={page.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                          {isActive ? 'Current page' : 'Page'}
                        </p>
                        <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                          {page.name}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {page.description}
                        </p>
                      </Link>

                      {isActive ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {page.shortcuts.map((shortcut) => (
                            <Link
                              key={shortcut.name}
                              href={shortcut.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:bg-white/6 dark:text-slate-200 dark:hover:bg-white/10"
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
                    className="flex items-center gap-2 py-3 text-lg font-medium text-primary-600 dark:text-primary-400"
                  >
                    <FileText aria-hidden="true" className="w-5 h-5" />
                    Resume
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

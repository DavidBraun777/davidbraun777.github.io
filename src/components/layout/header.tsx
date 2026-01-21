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

const navItems = [
  { name: 'About', href: '/#about', sectionId: 'about' },
  { name: 'Experience', href: '/#experience', sectionId: 'experience' },
  { name: 'Education', href: '/#education', sectionId: 'education' },
  { name: 'Projects', href: '/#projects', sectionId: 'projects' },
  { name: 'Skills', href: '/#skills', sectionId: 'skills' },
  { name: 'Blog', href: '/blog', sectionId: null },
  { name: 'Contact', href: '/#contact', sectionId: 'contact' },
]

const sectionIds = navItems
  .filter((item) => item.sectionId !== null)
  .map((item) => item.sectionId as string)

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  // Only use scroll spy on home page
  const activeSection = useScrollSpy({
    sectionIds: isHomePage ? sectionIds : [],
    offset: 100,
  })

  // Determine which nav item is active
  const activeNavItem = useMemo(() => {
    if (!isHomePage) {
      // On other pages, check if we're on the blog
      if (pathname.startsWith('/blog')) return 'Blog'
      return null
    }
    // On home page, use scroll spy
    const item = navItems.find((item) => item.sectionId === activeSection)
    return item?.name || null
  }, [isHomePage, pathname, activeSection])

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
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/#top" className="flex items-center gap-2 group">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-violet bg-clip-text text-transparent"
              >
                DB
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = activeNavItem === item.name
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                        : 'text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <CurrentStatus />
              </div>
              <Link
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-400 hover:bg-primary-950 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                Resume
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
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
              className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="flex flex-col p-6 pt-20">
                {navItems.map((item, index) => {
                  const isActive = activeNavItem === item.name
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'block py-3 text-lg font-medium transition-colors',
                          isActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                >
                  <Link
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-3 text-lg font-medium text-primary-600 dark:text-primary-400"
                  >
                    <FileText className="w-5 h-5" />
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

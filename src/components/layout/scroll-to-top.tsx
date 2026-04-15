'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export function ScrollToTop() {
  const pathname = usePathname()
  const [showButton, setShowButton] = useState(false)
  const previousPathRef = useRef<string | null>(null)

  const scrollWindowToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  const scheduleScrollReset = () => {
    let frameTwo = 0
    const timeoutId = window.setTimeout(scrollWindowToTop, 160)
    const frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(scrollWindowToTop)
    })

    return () => {
      window.cancelAnimationFrame(frameOne)
      window.cancelAnimationFrame(frameTwo)
      window.clearTimeout(timeoutId)
    }
  }

  useEffect(() => {
    const canManageHistory = 'scrollRestoration' in window.history
    const previousRestoration = canManageHistory
      ? window.history.scrollRestoration
      : null

    if (canManageHistory) {
      window.history.scrollRestoration = 'manual'
    }

    if (!window.location.hash) {
      scrollWindowToTop()
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (window.location.hash) return
      if (!event.persisted) return

      scheduleScrollReset()
    }

    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)

      if (canManageHistory && previousRestoration) {
        window.history.scrollRestoration = previousRestoration
      }
    }
  }, [])

  useEffect(() => {
    const previousPath = previousPathRef.current
    previousPathRef.current = pathname

    if (previousPath === null || previousPath === pathname) return
    if (window.location.hash) return

    return scheduleScrollReset()
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 320)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {showButton ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-background-elevated/95 text-link-primary shadow-[0_16px_36px_-24px_rgba(10,41,104,0.32)] backdrop-blur transition-colors hover:bg-background-subtle dark:border-border-subtle dark:bg-background-elevated/95 dark:text-link-primary dark:shadow-[0_16px_36px_-24px_rgba(2,6,23,0.5)] dark:hover:bg-background-subtle"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}

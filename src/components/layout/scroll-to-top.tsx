'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export function ScrollToTop() {
  const pathname = usePathname()
  const [showButton, setShowButton] = useState(false)
  const previousPathRef = useRef<string | null>(null)

  useEffect(() => {
    const previousPath = previousPathRef.current
    previousPathRef.current = pathname

    if (previousPath === null || previousPath === pathname) return
    if (window.location.hash) return

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    let frameTwo = 0
    const timeoutId = window.setTimeout(scrollToTop, 120)
    const frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(scrollToTop)
    })

    return () => {
      window.cancelAnimationFrame(frameOne)
      window.cancelAnimationFrame(frameTwo)
      window.clearTimeout(timeoutId)
    }
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
          className="fixed bottom-5 right-5 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-200 bg-white/95 text-primary-700 shadow-[0_20px_45px_-22px_rgba(37,99,235,0.55)] backdrop-blur transition-colors hover:bg-primary-50 dark:border-primary-700/70 dark:bg-slate-950/95 dark:text-primary-200 dark:hover:bg-slate-900"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}

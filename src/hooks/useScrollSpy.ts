'use client'

import { useState, useEffect, useRef } from 'react'

interface UseScrollSpyOptions {
  sectionIds: string[]
  offset?: number
}

/**
 * Hook to track which section is currently in view
 * Uses scroll listener with throttling for accurate tracking
 */
export function useScrollSpy({ sectionIds, offset = 80 }: UseScrollSpyOptions): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const ticking = useRef(false)

  useEffect(() => {
    if (sectionIds.length === 0) return

    const getActiveSection = () => {
      const scrollY = window.scrollY + offset

      // Check sections from bottom to top to find the one we're in
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        const element = document.getElementById(id)
        if (element) {
          const { offsetTop } = element
          if (scrollY >= offsetTop) {
            return id
          }
        }
      }

      // If we're above all sections, return the first one
      return sectionIds[0]
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const newActive = getActiveSection()
          setActiveSection(newActive)
          ticking.current = false
        })
        ticking.current = true
      }
    }

    // Set initial active section
    setActiveSection(getActiveSection())

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset])

  return activeSection
}

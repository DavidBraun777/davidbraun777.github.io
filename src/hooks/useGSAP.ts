'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Custom hook for GSAP animations with proper cleanup
 * Handles context creation, ScrollTrigger cleanup, and reduced motion
 */
export function useGSAP<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null)
  const contextRef = useRef<gsap.Context | null>(null)

  // Cleanup function
  const cleanup = useCallback(() => {
    if (contextRef.current) {
      contextRef.current.revert()
      contextRef.current = null
    }
  }, [])

  // Create context and return it for use in effects
  const createContext = useCallback((callback: (context: gsap.Context) => void) => {
    if (!containerRef.current) return

    // Cleanup any existing context
    cleanup()

    // Create new context scoped to our container
    contextRef.current = gsap.context(() => {
      callback(contextRef.current!)
    }, containerRef)
  }, [cleanup])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    containerRef,
    createContext,
    cleanup,
  }
}

/**
 * Hook to check if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const ref = useRef(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    ref.current = mediaQuery.matches

    const handler = (e: MediaQueryListEvent) => {
      ref.current = e.matches
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return ref.current
}

/**
 * Get GSAP-compatible reduced motion settings
 * Returns animation config that respects user preferences
 */
export function getMotionConfig(reducedMotion: boolean) {
  return {
    duration: reducedMotion ? 0 : 0.6,
    y: reducedMotion ? 0 : 16,
    scale: reducedMotion ? 1 : 1,
    stagger: reducedMotion ? 0 : 0.1,
    ease: 'power2.out',
  }
}

export { gsap, ScrollTrigger }

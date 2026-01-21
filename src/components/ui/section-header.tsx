'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { gsap } from '@/hooks/useGSAP'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const header = containerRef.current
      if (!header) return

      const titleEl = header.querySelector('.section-title')
      const dividerEl = header.querySelector('.section-divider')
      const subtitleEl = header.querySelector('.section-subtitle')

      if (prefersReducedMotion) {
        // Just show elements without animation
        gsap.set([titleEl, dividerEl, subtitleEl], { opacity: 1, y: 0 })
        if (dividerEl) gsap.set(dividerEl, { scaleX: 1 })
        return
      }

      // Set initial states
      gsap.set(titleEl, { opacity: 0, y: 16 })
      gsap.set(dividerEl, { scaleX: 0, transformOrigin: align === 'center' ? 'center' : 'left' })
      if (subtitleEl) gsap.set(subtitleEl, { opacity: 0, y: 12 })

      // Create timeline animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          once: true,
        },
      })

      tl.to(titleEl, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
        .to(dividerEl, {
          scaleX: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, '-=0.2')

      if (subtitleEl) {
        tl.to(subtitleEl, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.2')
      }
    }, containerRef)

    return () => ctx.revert()
  }, [align])

  return (
    <div
      ref={containerRef}
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        {title}
      </h2>
      <div
        className={cn(
          'section-divider h-1 w-20 bg-gradient-to-r from-primary-500 to-accent-violet rounded-full',
          align === 'center' && 'mx-auto'
        )}
      />
      {subtitle && (
        <p className="section-subtitle mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}

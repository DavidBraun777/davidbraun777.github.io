'use client'

import { useEffect, useRef, useState, type TouchEvent } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Badge } from '@/components/ui/badge'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { cn } from '@/lib/utils'
import { featuredSystems } from '@/data/systems'

const stateClasses: Record<string, string> = {
  Production:
    'border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-200',
  'Beta Pilot':
    'border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-800/80 dark:bg-cyan-950/80 dark:text-cyan-200',
  Prototype:
    'border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/80 dark:text-amber-200',
  'Research System':
    'border-violet-300 bg-violet-100 text-violet-800 dark:border-violet-800/80 dark:bg-violet-950/80 dark:text-violet-200',
  'Active Build':
    'border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-800/80 dark:bg-sky-950/80 dark:text-sky-200',
}

const statePanelClasses: Record<string, string> = {
  Production:
    'border-emerald-300 bg-emerald-100/90 text-emerald-900 dark:border-emerald-800/80 dark:bg-emerald-950/75 dark:text-emerald-100',
  'Beta Pilot':
    'border-cyan-300 bg-cyan-100/90 text-cyan-900 dark:border-cyan-800/80 dark:bg-cyan-950/75 dark:text-cyan-100',
  Prototype:
    'border-amber-300 bg-amber-100/90 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/75 dark:text-amber-100',
  'Research System':
    'border-violet-300 bg-violet-100/90 text-violet-900 dark:border-violet-800/80 dark:bg-violet-950/75 dark:text-violet-100',
  'Active Build':
    'border-sky-300 bg-sky-100/90 text-sky-900 dark:border-sky-800/80 dark:bg-sky-950/75 dark:text-sky-100',
}

export function SelectedSystems() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeSystem = featuredSystems[activeIndex]

  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [activeIndex])

  const focusSystem = (nextIndex: number) => {
    if (isLightboxOpen) return
    setActiveIndex((nextIndex + featuredSystems.length) % featuredSystems.length)
    setDetailsOpen(false)
  }

  const showPrevious = () => {
    focusSystem(activeIndex - 1)
  }

  const showNext = () => {
    focusSystem(activeIndex + 1)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (isLightboxOpen) return

    if (!touchStartRef.current) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    touchStartRef.current = null

    if (Math.abs(deltaX) < 88 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return

    if (deltaX < 0) {
      showNext()
      return
    }

    showPrevious()
  }

  return (
    <section id="selected-systems" className="section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Selected Systems"
          subtitle="Five systems that best represent how I combine applied AI, workflow software, and production-minded engineering."
        />

        <div className="mt-4 overflow-x-auto pb-1">
          <div className="mx-auto flex min-w-max justify-center gap-2 px-1 sm:min-w-full">
            {featuredSystems.map((system, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => focusSystem(index)}
                  ref={(element) => {
                    tabRefs.current[index] = element
                  }}
                  disabled={isLightboxOpen}
                  className={cn(
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-default disabled:opacity-70',
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                  )}
                  aria-pressed={isActive}
                >
                  {system.name}
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="relative mt-5 md:px-10 xl:px-12"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }}
        >
                  <button
                    type="button"
                    onClick={showPrevious}
                    disabled={isLightboxOpen}
                    className="absolute left-3 top-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-primary-200 bg-white/96 text-primary-700 shadow-[0_22px_45px_-24px_rgba(37,99,235,0.55)] backdrop-blur transition-all hover:scale-[1.05] hover:bg-primary-50 disabled:cursor-default disabled:opacity-55 dark:border-primary-700/70 dark:bg-slate-950/96 dark:text-primary-200 dark:shadow-[0_22px_45px_-24px_rgba(59,130,246,0.7)] dark:hover:bg-slate-900 lg:inline-flex lg:-left-6 lg:top-1/2 lg:h-14 lg:w-14 lg:-translate-y-1/2"
            aria-label="Show previous system"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

                  <button
                    type="button"
                    onClick={showNext}
                    disabled={isLightboxOpen}
                    className="absolute right-3 top-3 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-primary-200 bg-white/96 text-primary-700 shadow-[0_22px_45px_-24px_rgba(37,99,235,0.55)] backdrop-blur transition-all hover:scale-[1.05] hover:bg-primary-50 disabled:cursor-default disabled:opacity-55 dark:border-primary-700/70 dark:bg-slate-950/96 dark:text-primary-200 dark:shadow-[0_22px_45px_-24px_rgba(59,130,246,0.7)] dark:hover:bg-slate-900 lg:inline-flex lg:-right-6 lg:top-1/2 lg:h-14 lg:w-14 lg:-translate-y-1/2"
            aria-label="Show next system"
          >
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={activeSystem.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="p-6 sm:p-7 lg:p-8">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                      Case {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-accent-violet/10 text-violet-700 dark:border dark:border-violet-500/30 dark:bg-violet-950/80 dark:text-violet-100"
                    >
                      {activeSystem.themeTitle}
                    </Badge>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
                        stateClasses[activeSystem.currentState] ?? stateClasses.Prototype
                      )}
                    >
                      {activeSystem.currentState}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {activeSystem.name}
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                    {activeSystem.summary}
                  </p>

                  {/* Proof block: always visible for fast trust formation */}
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400">
                        My Role
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                        {activeSystem.myRole}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400">
                        Core Constraint
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                        {activeSystem.coreConstraint}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-400">
                        Outcome
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                        {activeSystem.outcome}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:block dark:border-slate-800 dark:bg-slate-900/60">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                      Problem
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {activeSystem.problem}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailsOpen((current) => !current)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    aria-expanded={detailsOpen}
                    aria-controls={`system-details-${activeSystem.id}`}
                  >
                    {detailsOpen ? 'Hide project details' : 'Open project details'}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        detailsOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {activeSystem.externalUrl ? (
                    <a
                      href={activeSystem.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
                    >
                      Visit live site
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}

                  <AnimatePresence initial={false}>
                    {detailsOpen ? (
                      <motion.div
                        id={`system-details-${activeSystem.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 grid gap-4">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:hidden dark:border-slate-800 dark:bg-slate-900/60">
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                              Problem
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                              {activeSystem.problem}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/80">
                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                              System
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                              {activeSystem.system}
                            </p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                              {activeSystem.systemHighlights.map((highlight) => (
                                <div
                                  key={highlight}
                                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                  {highlight}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                            <div>
                              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                                Stack
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {activeSystem.stack.map((item) => (
                                  <Badge key={item} variant="outline" className="text-sm">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div
                              className={cn(
                                'rounded-2xl border px-4 py-3',
                                statePanelClasses[activeSystem.currentState] ??
                                  statePanelClasses.Prototype
                              )}
                            >
                              <p className="font-mono text-xs uppercase tracking-[0.18em]">
                                Current State
                              </p>
                              <p className="mt-2 text-sm font-medium">
                                {activeSystem.currentState}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div
                  className={cn(
                    'border-t border-slate-200 p-6 sm:p-7 xl:border-t-0 xl:border-l dark:border-slate-800',
                    activeSystem.visualSurface === 'dark'
                      ? 'bg-slate-950'
                      : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
                  )}
                >
                  <ImageLightbox
                    src={activeSystem.image}
                    alt={activeSystem.imageAlt}
                    title={activeSystem.name}
                    description={activeSystem.evidenceSummary}
                    visualAspect={activeSystem.visualAspect}
                    visualSurface={activeSystem.visualSurface}
                    sizes="(min-width: 1280px) 70vw, 92vw"
                    onOpenChange={setIsLightboxOpen}
                    thumb={
                      <div
                        className={cn(
                          'relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-slate-950/20',
                          activeSystem.visualAspect === 'portrait'
                            ? 'mx-auto aspect-[4/5] max-w-sm'
                            : 'aspect-[16/10]'
                        )}
                      >
                        <Image
                          src={activeSystem.image}
                          alt={activeSystem.imageAlt}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                          sizes="(min-width: 1280px) 40vw, 100vw"
                        />
                      </div>
                    }
                  />

                  <div className="mt-5 rounded-3xl border border-slate-200/60 bg-white/90 p-4 shadow-lg shadow-slate-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
                    <div className="flex items-center gap-4">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                        Evidence
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {activeSystem.evidenceSummary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {activeSystem.evidence.map((artifact) => (
                        <Badge
                          key={artifact}
                          variant="primary"
                          className="bg-primary-100/80 dark:bg-primary-900/40"
                        >
                          {artifact}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

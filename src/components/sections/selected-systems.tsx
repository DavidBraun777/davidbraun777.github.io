'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  FolderKanban,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from 'lucide-react'
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

const evidenceIcons = [FolderKanban, Workflow, TerminalSquare, ShieldCheck]

export function SelectedSystems() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSystem = featuredSystems[activeIndex]

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + featuredSystems.length) % featuredSystems.length)
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % featuredSystems.length)
  }

  return (
    <section id="selected-systems" className="section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Selected Systems"
          subtitle="Five systems that best represent how I combine applied AI, workflow software, and production-minded engineering."
        />

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/45 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">
                Focused Case Study
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Rotate through one flagship system at a time.
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                This keeps the homepage tighter while still letting each project carry a
                full systems-oriented case study.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                {activeIndex + 1} / {featuredSystems.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  aria-label="Show previous system"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  aria-label="Show next system"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {featuredSystems.map((system, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
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

        <div className="mt-8">
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
                <div className="p-7 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap items-center gap-3">
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

                  <h3 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {activeSystem.name}
                  </h3>
                  <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                    {activeSystem.summary}
                  </p>

                  <div className="mt-8 grid gap-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                        Problem
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {activeSystem.problem}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                        System
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {activeSystem.system}
                      </p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
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

                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
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
                          'rounded-2xl border px-5 py-4',
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
                </div>

                <div
                  className={cn(
                    'border-t border-slate-200 p-7 sm:p-8 xl:border-t-0 xl:border-l dark:border-slate-800',
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

                  <div className="mt-6 rounded-3xl border border-slate-200/60 bg-white/90 p-5 shadow-lg shadow-slate-950/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                        Evidence
                      </p>
                      <ArrowRight className="h-4 w-4 text-primary-500" />
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

        <div className="mt-16 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/45 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">
                Systems Evidence
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Architecture, workflow, interface, terminal, and deployment proof surfaces.
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Engineers trust artifacts. This strip keeps the proof compact and points
                toward the parts of each system that make the implementation credible.
              </p>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-400">
              architecture - workflow - deployment
            </p>
          </div>

          <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3">
            {featuredSystems.map((system, index) => {
              const isActive = index === activeIndex

              return (
                <div
                  key={`${system.id}-evidence`}
                  className={cn(
                    'min-w-[18rem] snap-start overflow-hidden rounded-[1.75rem] border bg-white shadow-sm md:min-w-0 dark:bg-slate-950',
                    isActive
                      ? 'border-primary-300 shadow-lg shadow-primary-900/10 dark:border-primary-700'
                      : 'border-slate-200 dark:border-slate-800'
                  )}
                >
                  <div
                    className={cn(
                      'relative border-b border-slate-200 p-4 dark:border-slate-800',
                      system.visualSurface === 'dark'
                        ? 'bg-slate-950'
                        : 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'
                    )}
                  >
                    <ImageLightbox
                      src={system.image}
                      alt={system.imageAlt}
                      title={system.name}
                      description={system.evidenceSummary}
                      visualAspect={system.visualAspect}
                      visualSurface={system.visualSurface}
                      sizes="(min-width: 1280px) 70vw, 92vw"
                      thumb={
                        <div
                          className={cn(
                            'relative overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-slate-950/15',
                            system.visualAspect === 'portrait'
                              ? 'mx-auto aspect-[4/5] max-w-[220px]'
                              : 'aspect-[16/10]'
                          )}
                        >
                          <Image
                            src={system.image}
                            alt={system.imageAlt}
                            fill
                            className="object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 100vw"
                          />
                        </div>
                      }
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {system.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {system.currentState}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-3">
                      {system.evidence.map((item, evidenceIndex) => {
                        const Icon = evidenceIcons[evidenceIndex] ?? FolderKanban

                        return (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
                          >
                            <div className="inline-flex rounded-xl bg-primary-100 p-2 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                              <Icon className="h-4 w-4" />
                            </div>
                            <span>{item}</span>
                          </div>
                        )
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        'mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/6 dark:text-slate-200 dark:hover:bg-white/10'
                      )}
                    >
                      {isActive ? 'Currently focused' : 'Focus this system'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

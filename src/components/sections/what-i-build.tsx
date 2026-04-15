'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Boxes, Bot, Server, Workflow } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { buildPatterns } from '@/data/systems'

const patternIcons = [Bot, Workflow, Server, Boxes]

export function WhatIBuild() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="what-i-build" className="section bg-slate-50 dark:bg-slate-900/45">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What I Build"
          subtitle="Systems that combine AI, workflow automation, infrastructure, and domain-specific software."
        />

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6 text-lg leading-relaxed text-text-secondary">
            <p>
              I build systems that use AI inside real operational workflows. The work
              usually combines applied AI, workflow automation, infrastructure, and
              domain-specific software into one system that people can actually run.
            </p>
            <p>
              The interesting part is rarely the model alone. It is the architecture
              around the model: how information enters the system, how decisions are
              validated, how state is persisted, and how useful output reaches a human or
              downstream workflow.
            </p>
            <p>
              I use AI to accelerate system exploration and scaffolding, but the real work
              happens in engineering rigor, architecture design, and refining systems until
              they operate reliably.
            </p>
            <div className="rounded-3xl border border-border-subtle bg-background-elevated p-6 shadow-sm/70">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
                Engineering Philosophy
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-muted">
                The breadth across voice workflows, legal intake, planning engines, and
                lecture pipelines is intentional. I explore adjacent domains to find
                high-leverage operational problems, then go deeper where the system design
                work is strongest.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {buildPatterns.map((pattern, index) => {
              const Icon = patternIcons[index]

              return (
                <motion.div
                  key={pattern.title}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={
                    prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="rounded-3xl border border-border-subtle bg-background-elevated p-6 shadow-lg shadow-slate-200/20 dark:shadow-slate-950/25"
                >
                  <div className="bg-theme-gradient-primary inline-flex rounded-2xl p-3 text-white shadow-lg shadow-primary-900/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-text-primary">
                    {pattern.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {pattern.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Boxes, Bot, Server, Workflow } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { buildPatterns } from '@/data/systems'

const patternIcons = [Bot, Workflow, Server, Boxes]

export function WhatIBuild() {
  return (
    <section id="what-i-build" className="section bg-slate-50 dark:bg-slate-900/45">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What I Build"
          subtitle="The focus is systems, not isolated apps."
        />

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              I build systems that use AI to automate real workflows. The work usually
              combines applied AI, workflow automation, infrastructure, and domain-specific
              software into one operational surface.
            </p>
            <p>
              That means the interesting part is rarely the model alone. It is the
              architecture around the model: how information enters the system, how
              decisions are validated, how state is persisted, and how useful output gets
              delivered to a human or downstream workflow.
            </p>
            <p>
              The project breadth is intentional. Voice workflows, legal intake,
              dealership notifications, planning engines, and lecture pipelines are all
              adjacent explorations of the same question: where does automation create the
              most leverage in real operational software?
            </p>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
                Usefulness Over Novelty
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                I care more about whether a system closes a real workflow than whether it
                uses the newest tool. If AI is present, it should make the system more
                capable, not more fragile.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {buildPatterns.map((pattern, index) => {
              const Icon = patternIcons[index]

              return (
                <motion.div
                  key={pattern.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="inline-flex rounded-2xl bg-gradient-to-br from-primary-600 to-accent-cyan p-3 text-white shadow-lg shadow-primary-900/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                    {pattern.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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

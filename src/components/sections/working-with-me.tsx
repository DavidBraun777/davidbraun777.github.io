'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Handshake, Rocket, Search, Workflow, Wrench } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Start by clarifying the problem, constraints, users, and what success should actually look like.',
  },
  {
    icon: Workflow,
    title: 'Architecture & Scoping',
    description: 'Define the solution shape, key technical risks, and the smallest useful path to delivery.',
  },
  {
    icon: Wrench,
    title: 'Build & Iterate',
    description: 'Ship in testable milestones with fast feedback loops instead of waiting for a perfect first release.',
  },
  {
    icon: Rocket,
    title: 'Deploy & Harden',
    description: 'Move from working prototype to dependable delivery with infrastructure, monitoring, and cleanup where it matters.',
  },
  {
    icon: Handshake,
    title: 'Support & Next Steps',
    description: 'Extend, optimize, or hand off the system cleanly so the work stays useful after the first launch.',
  },
]

const fitPoints = [
  'Full-time roles in AI systems, platform engineering, or infrastructure-heavy product teams',
  'Consulting and selected builds that need architecture, delivery, and technical judgment',
  'Mission-driven or accessibility-minded work where usability matters as much as implementation',
]

export function WorkingWithMe() {
  return (
    <section id="process" className="section bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="How Working With Me Works"
          subtitle="A practical process for founders, teams, and hiring managers who need real progress, not vague roadmaps."
        />

        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-500">
                        Step {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-primary-600 dark:text-primary-400">
              Best Fit
            </p>
            <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
              Strongest when the work spans product thinking, AI systems, and real delivery.
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              I am most valuable in environments that need someone to understand the system, make the tradeoffs explicit, and keep execution moving.
            </p>

            <div className="mb-8 space-y-3">
              {fitPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-500" />
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a Conversation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

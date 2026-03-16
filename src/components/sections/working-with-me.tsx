'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Handshake, Rocket, Search, Workflow, Wrench } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: Search,
    title: 'Problem Framing',
    description: 'Clarify the system goal, operating constraints, stakeholders, and what success should look like in practice.',
  },
  {
    icon: Workflow,
    title: 'System Design',
    description: 'Shape the architecture, failure points, and delivery plan so the build has a clear technical direction.',
  },
  {
    icon: Wrench,
    title: 'Build in Milestones',
    description: 'Implement the smallest useful slice first, then iterate with real feedback instead of building in the dark.',
  },
  {
    icon: Rocket,
    title: 'Deployment & Hardening',
    description: 'Move from a working build to an operable system with infrastructure, observability, and cleanup where it matters.',
  },
  {
    icon: Handshake,
    title: 'Handoff or Expansion',
    description: 'Either extend the system or hand it off cleanly with enough structure for the next phase.',
  },
]

const fitPoints = [
  'Hiring managers looking for an engineer who can build across applied AI, backend systems, and infrastructure',
  'Founders needing early architecture, rapid implementation, and honest technical tradeoffs',
  'Technical clients who need operational software, automation, or domain-specific platform work',
  'Teams that care about usability, accessibility, and maintainability alongside speed',
]

export function WorkingWithMe() {
  return (
    <section id="process" className="section bg-slate-50 dark:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="How Working With Me Works"
          subtitle="Best when the work requires architecture, implementation, and product judgment to move together."
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
              Strongest where product pressure and technical depth meet.
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              I work well with teams that need someone who can reason across architecture, infrastructure, and delivery without losing sight of the actual workflow the system is meant to improve.
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

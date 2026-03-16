'use client'

import { motion } from 'framer-motion'
import { Bot, DraftingCompass, Settings2, Workflow } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { buildSteps } from '@/data/systems'

const stepIcons = [DraftingCompass, Bot, Settings2, Workflow]

export function HowIBuild() {
  return (
    <section id="how-i-build" className="section bg-slate-50 dark:bg-slate-900/45">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="How I Build"
          subtitle="Architecture first, AI as leverage, engineering as the finishing discipline."
        />

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            {buildSteps.map((step, index) => {
              const Icon = stepIcons[index]

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-violet text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
            className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-slate-100 shadow-2xl shadow-slate-950/30 dark:border-slate-800"
          >
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary-300">
              Builder Mindset
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-white">
              Fast initial momentum is useful only when the architecture survives contact with reality.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              I use AI to compress the time between idea and working structure. Then I
              tighten the system by making the boundaries explicit, simplifying the
              workflow, and keeping the operational path understandable for humans.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Map the workflow before optimizing the implementation.',
                'Keep policy, routing, and state visible in the architecture.',
                'Prefer systems that reduce manual coordination instead of adding novelty.',
              ].map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-slate-300"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-primary-500/20 bg-primary-500/10 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-200">
                Preferred Problem Shape
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">
                Systems that need routing, validation, orchestration, and an actual
                delivery path to a user, operator, or downstream business workflow.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Binary, Cpu, Network, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { currentInterests } from '@/data/systems'

const interestIcons = [Cpu, Network, Binary, Sparkles]

export function CurrentInterests() {
  return (
    <section id="current-interests" className="section bg-slate-50 dark:bg-slate-900/45">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Current Interests"
          subtitle="The problem spaces I keep returning to."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {currentInterests.map((interest, index) => {
            const Icon = interestIcons[index]

            return (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-2xl bg-primary-100 p-3 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {interest.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {interest.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

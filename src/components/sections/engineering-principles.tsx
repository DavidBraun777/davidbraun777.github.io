'use client'

import { MobileSectionDisclosure } from '@/components/ui/mobile-section-disclosure'
import { motion } from 'framer-motion'
import { Compass, Cpu, Layers3, Wrench } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { engineeringPrinciples } from '@/data/systems'

const principleIcons = [Compass, Layers3, Cpu, Wrench]

export function EngineeringPrinciples() {
  return (
    <section id="engineering-principles" className="section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Engineering Principles"
          subtitle="The constraints I try to preserve while moving quickly."
        />

        <MobileSectionDisclosure
          preview="A small set of constraints: solve real problems, keep systems inspectable, use AI as leverage, and simplify until the architecture is dependable."
          openLabel="View principles"
          closeLabel="Hide principles"
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {engineeringPrinciples.map((principle, index) => {
              const Icon = principleIcons[index]

              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="rounded-3xl border border-border-subtle bg-background-elevated p-6 shadow-lg shadow-slate-200/20 dark:shadow-slate-950/25"
                >
                  <div className="inline-flex rounded-2xl bg-gradient-to-br from-primary-600 to-accent-cyan p-3 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-text-primary">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {principle.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </MobileSectionDisclosure>
      </div>
    </section>
  )
}

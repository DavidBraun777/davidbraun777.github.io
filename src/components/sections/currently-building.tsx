'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Mic, ShieldCheck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'

const currentProjects = [
  {
    icon: Mic,
    title: 'StormIQ',
    summary: 'Building an AI voice and workflow platform for lead qualification, conversational routing, and vertical-specific automation.',
    focus: 'Voice pipeline architecture, backend service integration, and infrastructure decisions for scalable deployment.',
    nextMilestone: 'Ship an end-to-end demo across call handling, response generation, and CRM handoff.',
    status: 'Platform Build',
    tags: ['AI Voice', 'Automation', 'Backend Services'],
  },
  {
    icon: GraduationCap,
    title: 'Edcalibur',
    summary: 'Designing a gamified classroom mastery platform focused on stronger learning loops, student motivation, and practical teacher workflows.',
    focus: 'Product architecture, progress modeling, and building a usable experience for both classroom execution and long-term iteration.',
    nextMilestone: 'Validate the first classroom-ready workflow from assignment flow to mastery tracking and feedback.',
    status: 'Product Build',
    tags: ['EdTech', 'Product Design', 'Full-Stack'],
  },
  {
    icon: ShieldCheck,
    title: 'AI & Security Lab',
    summary: 'Expanding a hands-on lab environment for isolated infrastructure testing, ML workloads, and system hardening experiments.',
    focus: 'Proxmox-based lab growth, Kubernetes experimentation, GPU-capable workloads, and cleaner operational patterns for repeatable testing.',
    nextMilestone: 'Finalize the next round of lab architecture updates and document the environment as a reusable proof asset.',
    status: 'Lab Expansion',
    tags: ['Proxmox', 'Kubernetes', 'Infrastructure'],
  },
]

const statusColors: Record<string, string> = {
  'Platform Build': 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
  'Product Build': 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  'Lab Expansion': 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
}

export function CurrentlyBuilding() {
  return (
    <section id="building" className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Currently Building"
          subtitle="The systems I am actively designing, shipping, and refining right now"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet p-2.5">
                  <project.icon className="h-5 w-5 text-white" />
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[project.status] || statusColors['In Progress']}`}>
                  {project.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {project.title}
              </h3>

              <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {project.summary}
              </p>

              <div className="mb-5 space-y-4">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-500">
                    Current focus
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {project.focus}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-500">
                    Next milestone
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {project.nextMilestone}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

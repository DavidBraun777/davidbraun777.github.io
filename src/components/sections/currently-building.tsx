'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Mic, ShieldCheck } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'

const currentProjects = [
  {
    icon: Mic,
    title: 'StormIQ',
    summary: 'Designing an AI voice and workflow platform for lead qualification, conversational routing, and vertical-specific operating workflows.',
    focus: 'Telephony orchestration, backend services, context handling, and deployment patterns for reliable end-to-end execution.',
    nextMilestone: 'Validate an end-to-end path from conversation to structured follow-up and CRM handoff.',
    status: 'Applied AI Platform',
    tags: ['AI Voice', 'Workflow Design', 'Backend Services'],
  },
  {
    icon: GraduationCap,
    title: 'Edcalibur',
    summary: 'Building an education platform around mastery tracking, stronger learning loops, and teacher-friendly classroom workflows.',
    focus: 'System architecture, progression models, and the workflow details that make the product useful for both teachers and students.',
    nextMilestone: 'Ship the first classroom-ready flow covering assignment setup, mastery tracking, and actionable feedback.',
    status: 'Domain Software',
    tags: ['EdTech', 'Operational Software', 'Full-Stack'],
  },
  {
    icon: ShieldCheck,
    title: 'AI & Security Lab',
    summary: 'Maintaining a private lab for infrastructure testing, GPU workloads, and controlled experimentation across AI and security tooling.',
    focus: 'Proxmox-based orchestration, Kubernetes experiments, repeatable environments, and hardware decisions that support deeper systems work.',
    nextMilestone: 'Document the next lab architecture iteration and turn it into a reusable proof asset for future platform work.',
    status: 'Infrastructure Lab',
    tags: ['Proxmox', 'Kubernetes', 'Systems Lab'],
  },
]

const statusColors: Record<string, string> = {
  'Applied AI Platform': 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
  'Domain Software': 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  'Infrastructure Lab': 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
}

export function CurrentlyBuilding() {
  return (
    <section id="building" className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Currently Building"
          subtitle="Three adjacent builds that help me test where applied AI, operational workflows, and infrastructure create durable leverage."
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
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[project.status]}`}>
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

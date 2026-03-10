'use client'

import { motion } from 'framer-motion'
import { Rocket, ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'

// TODO: David — replace these placeholder items with your actual current projects/experiments.
// Each item should have a title, description, status, and optional link.
const currentProjects = [
  {
    title: 'AI Master\'s Coursework',
    description: 'Pursuing a Master\'s in Artificial Intelligence at the University of St. Thomas — coursework in ML, cloud computing, and applied AI.',
    status: 'In Progress',
    tags: ['Machine Learning', 'Cloud Computing', 'AI'],
  },
  {
    title: 'Security Lab Expansion',
    description: 'Expanding the Proxmox-based security lab with additional VMs for ML training workloads and Kubernetes experimentation.',
    status: 'In Progress',
    tags: ['Proxmox', 'Kubernetes', 'GPU', 'ML'],
  },
  // TODO: David — add 1-2 more current projects here. Examples:
  // - A specific AI/ML project from your Master's program
  // - An open-source contribution you're working on
  // - A side project or experiment
]

const statusColors: Record<string, string> = {
  'In Progress': 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  'Research': 'bg-accent-violet/10 text-accent-violet border-accent-violet/20',
  'Launching Soon': 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
}

export function CurrentlyBuilding() {
  return (
    <section id="building" className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Currently Building"
          subtitle="What I'm working on right now"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColors[project.status] || statusColors['In Progress']}`}>
                  {project.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {project.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {project.description}
              </p>

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

              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-primary-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

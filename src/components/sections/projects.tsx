'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Brain,
  ExternalLink,
  Github,
  Globe,
  HardDrive,
  Server,
  Shield,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { projects, type Project } from '@/data/projects'
import { SectionHeader } from '@/components/ui/section-header'
import { Badge } from '@/components/ui/badge'
import { gsap, ScrollTrigger } from '@/hooks/useGSAP'

type ProjectTheme = Project['theme']

const projectThemeContent: Array<{
  id: ProjectTheme
  eyebrow: string
  title: string
  description: string
  icon: typeof Brain
}> = [
  {
    id: 'applied-ai-systems',
    eyebrow: 'Theme 01',
    title: 'Applied AI Systems',
    description: 'Systems that connect model capability, document processing, and experimentation to useful outputs and real workflows.',
    icon: Brain,
  },
  {
    id: 'workflow-automation',
    eyebrow: 'Theme 02',
    title: 'Workflow Automation & Operational Software',
    description: 'Software built around how people actually operate: internal workflows, accessible delivery, publishing, and day-to-day organizational use.',
    icon: Workflow,
  },
  {
    id: 'infrastructure-platform',
    eyebrow: 'Theme 03',
    title: 'Infrastructure & Platform Engineering',
    description: 'The environments, services, and systems work that make products reliable, repeatable, and easier to operate over time.',
    icon: Server,
  },
]

const projectThemeLabels: Record<ProjectTheme, string> = {
  'applied-ai-systems': 'Applied AI Systems',
  'workflow-automation': 'Operational Software',
  'infrastructure-platform': 'Infrastructure & Platform',
}

const projectPlaceholderVisuals = {
  web: {
    icon: Globe,
    eyebrow: 'Web Platform',
    gradient: 'from-primary-600 via-accent-violet to-accent-cyan',
  },
  infrastructure: {
    icon: Server,
    eyebrow: 'Infrastructure',
    gradient: 'from-accent-cyan via-primary-600 to-slate-900',
  },
  security: {
    icon: Shield,
    eyebrow: 'Security Lab',
    gradient: 'from-accent-emerald via-primary-700 to-slate-950',
  },
  hardware: {
    icon: HardDrive,
    eyebrow: 'Hardware Systems',
    gradient: 'from-accent-amber via-accent-violet to-slate-900',
  },
  other: {
    icon: Sparkles,
    eyebrow: 'Applied Build',
    gradient: 'from-primary-500 via-accent-violet to-accent-rose',
  },
} as const

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('.project-card, .project-theme', { opacity: 1, y: 0 })
        return
      }

      gsap.set('.project-card', { opacity: 0, y: 20 })
      gsap.set('.project-theme', { opacity: 0, y: 12 })

      ScrollTrigger.batch('.project-theme', {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.08,
          })
        },
        start: 'top 85%',
        once: true,
      })

      ScrollTrigger.batch('.project-card', {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
          })
        },
        start: 'top 88%',
        once: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Selected Systems"
          subtitle="Grouped by system type, not by framework."
        />

        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            I do adjacent-domain work on purpose. The goal is to find where applied AI, operational software,
            and infrastructure create durable leverage, then build deeper where the opportunity is real.
          </p>
        </div>

        <div className="space-y-14 md:space-y-16">
          {projectThemeContent.map((theme) => {
            const themeProjects = projects.filter((project) => project.theme === theme.id)
            const ThemeIcon = theme.icon

            return (
              <div key={theme.id} className="grid gap-6 xl:grid-cols-[0.9fr_1.8fr] xl:gap-8">
                <div className="project-theme rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 xl:sticky xl:top-28 xl:h-fit">
                  <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-primary-500 to-accent-violet p-3 text-white shadow-sm">
                    <ThemeIcon className="h-6 w-6" />
                  </div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600 dark:text-primary-400">
                    {theme.eyebrow}
                  </p>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                    {theme.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {theme.description}
                  </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {themeProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-56 overflow-hidden">
        {project.image === '/images/profile/Smolder.png' ? (
          <ProjectPlaceholder project={project} />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/90 p-3 text-slate-900 transition-all duration-200 hover:scale-110 hover:bg-white"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github aria-hidden="true" className="h-5 w-5" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/90 p-3 text-slate-900 transition-all duration-200 hover:scale-110 hover:bg-white"
              aria-label={`Open ${project.title} live`}
            >
              <ExternalLink aria-hidden="true" className="h-5 w-5" />
            </a>
          )}
        </div>

        {project.featured && (
          <div className="absolute right-4 top-4">
            <Badge variant="primary" className="shadow-lg">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary-600 dark:text-primary-400">
          {projectThemeLabels[project.theme]}
        </p>
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {project.title}
        </h3>
        <p className="mb-5 text-slate-600 dark:text-slate-300">
          {project.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="outline">+{project.technologies.length - 4}</Badge>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Github aria-hidden="true" className="h-4 w-4" />
              Repository
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              Live site
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectPlaceholder({ project }: { project: Project }) {
  const visual = projectPlaceholderVisuals[project.category]
  const Icon = visual.icon

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-br ${visual.gradient} p-6`}
      aria-hidden="true"
    >
      <div className="mb-5 inline-flex w-fit rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-sm">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/70">
        {visual.eyebrow}
      </p>
      <h4 className="text-xl font-semibold text-white">
        {project.title}
      </h4>
      <p className="mt-3 line-clamp-2 text-sm text-white/75">
        {project.technologies.slice(0, 3).join(' • ')}
      </p>
    </div>
  )
}

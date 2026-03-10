'use client'

import { useEffect, useRef } from 'react'
import { Brain, Users, Zap, Server } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { gsap, ScrollTrigger } from '@/hooks/useGSAP'

const competencies = [
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Pursuing a Master\'s in AI — applying ML to real-world infrastructure and systems problems',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Server,
    title: 'Infrastructure & DevOps',
    description: 'Building and automating scalable infrastructure with Docker, Kubernetes, AWS, and Terraform',
    color: 'from-accent-violet to-purple-600',
  },
  {
    icon: Zap,
    title: 'Systems Engineering',
    description: 'Designing reliable systems — from CI/CD pipelines to GPU-accelerated security labs',
    color: 'from-accent-amber to-orange-500',
  },
  {
    icon: Users,
    title: 'Security & Collaboration',
    description: 'Secure coding practices, vulnerability remediation, and cross-functional team leadership',
    color: 'from-accent-emerald to-green-600',
  },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(['.about-bio', '.competency-card'], { opacity: 1, y: 0, x: 0 })
        return
      }

      // Bio paragraphs animation
      gsap.set('.about-bio', { opacity: 0, x: -20 })
      gsap.to('.about-bio', {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-bio',
          start: 'top 80%',
          once: true,
        },
      })

      // Competency cards batch animation
      gsap.set('.competency-card', { opacity: 0, y: 20 })
      ScrollTrigger.batch('.competency-card', {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.1,
          })
        },
        start: 'top 85%',
        once: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="section bg-slate-50 dark:bg-slate-900/50" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="About Me"
          subtitle="AI engineer building intelligent, scalable, and secure systems"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div className="about-bio space-y-6">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-primary-600 dark:text-primary-400">AI and systems engineer</span> with a background spanning
              infrastructure, cybersecurity, and full-stack development. Currently pursuing a
              <span className="font-semibold"> Master&apos;s in Artificial Intelligence</span> at the University of St. Thomas while building
              applied AI systems and scalable infrastructure.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Experienced in automating infrastructure with <span className="font-semibold">Docker, Kubernetes, AWS, and Terraform</span>,
              implementing <span className="font-semibold">CI/CD pipelines with GitHub Actions</span>,
              and building GPU-accelerated environments for security research and ML workloads.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              My background combines a <span className="font-semibold">Bachelor&apos;s in Computer Science, Mathematics, and Physics</span> from
              Augsburg University with hands-on engineering at companies including
              <span className="font-semibold text-primary-600 dark:text-primary-400"> U.S. Bank</span>,
              <span className="font-semibold text-violet-700 dark:text-violet-300"> Securian Financial</span>,
              <span className="font-semibold text-cyan-700 dark:text-cyan-300"> GE Aviation</span>, and
              <span className="font-semibold text-rose-700 dark:text-rose-300"> Target Corporation</span>.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              I also founded <span className="font-semibold">People&apos;s Connection LLC</span>, building accessible web applications
              for non-profit organizations — blending engineering with impact.
            </p>
          </div>

          {/* Competencies */}
          <div className="grid sm:grid-cols-2 gap-4">
            {competencies.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="competency-card p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] transition-all duration-200"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

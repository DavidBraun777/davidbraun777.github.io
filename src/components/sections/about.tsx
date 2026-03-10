'use client'

import { useEffect, useRef } from 'react'
import { Brain, Server, ShieldCheck, Users } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { gsap, ScrollTrigger } from '@/hooks/useGSAP'

const competencies = [
  {
    icon: Brain,
    title: 'Applied AI & Automation',
    description: 'Building AI-enabled workflows, backend services, and product features that solve real operational problems.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Server,
    title: 'Platform & Cloud Infrastructure',
    description: 'Designing dependable infrastructure with containers, cloud services, CI/CD, and automation-first delivery practices.',
    color: 'from-accent-violet to-purple-600',
  },
  {
    icon: Users,
    title: 'Accessibility-Minded Delivery',
    description: 'Shipping usable systems for real people, including mission-driven and accessibility-first product work.',
    color: 'from-accent-amber to-orange-500',
  },
  {
    icon: ShieldCheck,
    title: 'Security & Systems Thinking',
    description: 'Approaching delivery with operational rigor, secure defaults, and clear tradeoffs across architecture, risk, and maintenance.',
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
          subtitle="Systems-minded engineering across AI, infrastructure, and accessibility"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div className="about-bio space-y-6">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              I&apos;m an <span className="font-semibold text-primary-600 dark:text-primary-400">Applied AI &amp; Infrastructure Engineer</span> with a background spanning
              platform engineering, cybersecurity, and full-stack delivery. I&apos;m currently pursuing a
              <span className="font-semibold"> Master&apos;s in Artificial Intelligence</span> at the University of St. Thomas while building products and internal systems that connect technical depth to real operational outcomes.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              My work sits at the intersection of <span className="font-semibold">AI systems, automation, and infrastructure</span>. I&apos;ve built CI/CD pipelines, automated cloud workflows, managed containerized environments, and designed developer tooling with <span className="font-semibold">Docker, Kubernetes, AWS, Terraform, and GitHub Actions</span>.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              I&apos;ve contributed across enterprise teams at
              <span className="font-semibold text-primary-600 dark:text-primary-400"> U.S. Bank</span>,
              <span className="font-semibold text-violet-700 dark:text-violet-300"> Securian Financial</span>,
              <span className="font-semibold text-cyan-700 dark:text-cyan-300"> GE Aviation</span>, and
              <span className="font-semibold text-rose-700 dark:text-rose-300"> Target Corporation</span>, and through <span className="font-semibold">People&apos;s Connection LLC</span> I&apos;ve built accessibility-minded software for nonprofit and mission-driven organizations.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              The common thread in my work is straightforward: translate ambiguous problems into clear architectures, ship in milestones, and leave systems more reliable, maintainable, and useful than I found them.
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

'use client'

import { useEffect, useRef } from 'react'
import { Target, Users, Zap, Server } from 'lucide-react'
import { SectionHeader } from '@/components/ui/section-header'
import { gsap, ScrollTrigger } from '@/hooks/useGSAP'

const competencies = [
  {
    icon: Server,
    title: 'DevOps & Infrastructure',
    description: 'Building and automating scalable infrastructure with Docker, Kubernetes, and Terraform',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Fosters strong teamwork and knowledge sharing across global teams',
    color: 'from-accent-violet to-purple-600',
  },
  {
    icon: Zap,
    title: 'CI/CD Automation',
    description: 'Implementing pipelines with GitHub Actions for secure, efficient deployments',
    color: 'from-accent-amber to-orange-500',
  },
  {
    icon: Target,
    title: 'Security Focus',
    description: 'Ensuring secure integration and deployment practices across all systems',
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
          subtitle="Building scalable, secure, and high-performing applications"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div className="about-bio space-y-6">
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Experienced <span className="font-semibold text-primary-600 dark:text-primary-400">Software Engineer</span> with expertise in
              full-stack development, cybersecurity, and DevOps. Proficient in building and automating scalable infrastructure using
              <span className="font-semibold"> Docker, Kubernetes, AWS, and Terraform</span>.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Extensive experience implementing <span className="font-semibold">CI/CD pipelines with GitHub Actions</span>, ensuring
              secure and efficient deployments. Passionate about applying DevOps practices to deliver high-performing, reliable applications.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Currently pursuing a <span className="font-semibold">Master&apos;s in Artificial Intelligence</span> at the University of St. Thomas,
              with coursework in Cloud Computing and Machine Learning. I hold a Bachelor&apos;s in Computer Science, Mathematics, and Physics from Augsburg University.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              I&apos;ve contributed to industry-leading companies including <span className="font-semibold text-primary-600 dark:text-primary-400">U.S. Bank</span>,
              <span className="font-semibold text-accent-violet"> Securian Financial</span>,
              <span className="font-semibold text-accent-cyan"> GE Aviation</span>, and
              <span className="font-semibold text-accent-rose"> Target Corporation</span>.
              I also founded <span className="font-semibold">People&apos;s Connection LLC</span>, building accessible web applications for non-profits.
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

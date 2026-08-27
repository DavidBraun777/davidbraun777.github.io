import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { SectionHeader } from '@/components/ui/section-header'
import { processPreview, servicesOffered } from '@/data/profile'
import { createPageMetadata } from '@/lib/seo'

const fitExamples = [
  'An AI or data capability needs a production architecture around it.',
  'A workflow crosses applications, APIs, files, queues, and human handoffs.',
  'A useful system needs secure deployment, evaluation, and clear operating ownership.',
]

const supportingCapabilities = [
  'Grounded AI and retrieval',
  'Applications and APIs',
  'Cloud and platform delivery',
  'Data and orchestration',
  'Security and evaluation',
  'Operations and handoff',
]

const proofExamples = [
  {
    name: 'VIFG Nonprofit Platform',
    href: '/case-studies/vifg-nonprofit-platform',
    label: 'production proof',
  },
  {
    name: 'WeatherForge',
    href: '/case-studies/weatherforge',
    label: 'prototype dashboard example',
  },
  {
    name: 'RAGeATM',
    href: '/case-studies/rageatm',
    label: 'academic RAG example',
  },
]

export const metadata: Metadata = createPageMetadata({
  title: 'Services',
  description:
    'AI systems architecture, platform and cloud architecture, workflow orchestration, reliability, security, evaluation, and operational software.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Services"
          title="Architecture and engineering for systems that have to work beyond the demo."
          description="I help connect AI and data capabilities to applications, workflows, cloud platforms, security controls, evaluation, and operating ownership. Engagements stay framed around the business problem and the evidence needed to call the result successful."
          actions={[
            { label: 'Book a Call', href: '/contact' },
            { label: 'View Case Studies', href: '/case-studies', variant: 'secondary' },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Core services"
            subtitle="Five connected areas, each framed around the problem, delivery boundary, and operational outcome."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {servicesOffered.map((service) => {
              const Icon = service.icon

              return (
                <article
                  key={service.title}
                  className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6"
                >
                  <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight text-text-primary">
                    {service.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">
                    <p>
                      <span className="font-semibold text-text-primary">Problem:</span>{' '}
                      {service.problem}
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">What I help with:</span>{' '}
                      {service.example}
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">Outcome:</span>{' '}
                      {service.outcome}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
            <SectionHeader
              align="left"
              title="Good fit projects"
              subtitle="This is usually a fit when one of these system boundaries is already causing friction."
              className="mb-8"
            />
            <div className="space-y-3">
              {fitExamples.map((example) => (
                <div
                  key={example}
                  className="rounded-2xl border border-border-subtle bg-background-subtle px-4 py-4 text-sm leading-7 text-text-secondary"
                >
                  {example}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
            <SectionHeader
              align="left"
              title="How work usually starts"
              subtitle="Simple, scoped, and tied to the system behavior that needs to improve."
              className="mb-8"
            />
            <div className="space-y-5">
              {processPreview.slice(0, 3).map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 font-mono text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">{step.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Supporting technical capabilities
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              These are layers inside the delivery work. The architecture connects them
              around a measurable workflow, explicit limits, and operational reliability.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {supportingCapabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-border-subtle bg-background-elevated px-3 py-1.5 text-sm font-medium text-text-secondary"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Supporting examples
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Start with VIFG for public production proof. WeatherForge and RAGeATM are
              technical examples with prototype or academic limits.
            </p>
            <div className="mt-5 grid gap-3">
              {proofExamples.map((example) => (
                <Link
                  key={example.href}
                  href={example.href}
                  className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-border-subtle bg-background-elevated p-4 text-sm font-medium text-text-primary transition-colors hover:border-border-strong"
                >
                  <span>
                    {example.name}
                    <span className="ml-2 text-text-secondary">({example.label})</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-link-primary" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            Have an AI, data, platform, or workflow system to improve?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-text-secondary">
            Send the capability, workflow, platform boundary, data movement, or
            operational constraint. I will help decide whether architecture review,
            integration work, or a scoped build is the right first step.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Book a Call
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { SectionHeader } from '@/components/ui/section-header'
import { processPreview, servicesOffered } from '@/data/profile'

const fitExamples = [
  'A lead process that still depends on manual follow-up.',
  'Internal work that gets stuck between forms, spreadsheets, inboxes, and CRMs.',
  'A useful system that needs to be built cleanly and kept reliable after launch.',
]

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Workflow automation, system integration, and operational software services for small and midsized businesses.',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Services"
          title="What you can hire me for."
          description="This page explains the kinds of problems I solve. If you want proof first, use the case studies page. If you already know the kind of help you need, start here."
          actions={[
            { label: 'Book a Call', href: '/contact' },
            { label: 'View Case Studies', href: '/case-studies', variant: 'secondary' },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Core services"
            subtitle="Framed around business problems, not technical labels."
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
              subtitle="This is usually a fit when one of these is already causing friction."
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
              subtitle="Simple, scoped, and tied to the workflow that needs to improve."
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

        <section className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6 sm:p-7">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Want proof before you reach out?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
            Start with the VIFG production platform, then review DealerFlow and the rest
            of the case studies. This page is about what you can hire me for. The proof
            lives on the case studies page.
          </p>
          <Link
            href="/case-studies"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Go to case studies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}

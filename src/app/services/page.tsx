import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { SectionHeader } from '@/components/ui/section-header'
import { processPreview, servicesOffered } from '@/data/profile'
import { createPageMetadata } from '@/lib/seo'
import { engagementOffers } from '@/data/services'

const fitExamples = [
  'A working AI or data prototype needs validation, access controls, deployment, and a review path before a team can use it.',
  'People are moving information between forms, spreadsheets, APIs, and inboxes, and handoffs are getting missed.',
  'An existing application needs maintenance, deployment improvements, or clearer ownership after launch.',
] as const

const proofExamples = [
  {
    name: 'VIFG Nonprofit Platform',
    href: '/case-studies/vifg-nonprofit-platform',
    label: 'Production',
  },
  {
    name: 'DealerFlow',
    href: '/case-studies/dealerflow',
    label: 'Beta pilot',
  },
  {
    name: 'WeatherForge',
    href: '/case-studies/weatherforge',
    label: 'Prototype / academic project',
  },
] as const

const pricingDisclaimer =
  'Planning ranges are not fixed quotes. We agree on scope and terms case by case; price depends on integrations, data quality, security requirements, urgency, and support needs. Fixed-price, milestone, hourly, and retainer arrangements may be used depending on the project.'

export const metadata: Metadata = createPageMetadata({
  title: 'Services',
  description:
    'AI systems and platform engineering consulting through architecture reviews, scoped builds, workflow automation, and ongoing platform stewardship.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Services"
          title="Architecture reviews, scoped builds, and platform support."
          description="Choose a review of an existing system, a build with defined deliverables, or ongoing support. The options below include typical deliverables and pricing ranges."
          actions={[
            { label: 'Discuss a Project', href: '/contact?type=consulting' },
            {
              label: 'View Work',
              href: '/case-studies',
              variant: 'secondary',
            },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Ways to work together"
            subtitle="Choose the closest starting point. Scope, schedule, and commercial structure are finalized case by case."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {engagementOffers.map((offer) => (
              <article
                key={offer.id}
                id={`service-${offer.id}`}
                tabIndex={-1}
                className="scroll-mt-28 flex h-full flex-col rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                  {offer.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-text-secondary">{offer.description}</p>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="rounded-xl border border-border-subtle bg-background-subtle p-4">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                      Planning range
                    </dt>
                    <dd className="mt-2 text-lg font-semibold text-text-primary">
                      {offer.planningRange}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-border-subtle bg-background-subtle p-4">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                      Typical duration
                    </dt>
                    <dd className="mt-2 text-sm font-semibold leading-7 text-text-primary">
                      {offer.duration}
                    </dd>
                  </div>
                </dl>
                <h3 className="mt-6 text-sm font-semibold text-text-primary">{offer.itemsLabel}</h3>
                <ul className="mt-3 space-y-2">
                  {offer.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {'note' in offer ? (
                  <p className="mt-5 rounded-xl border border-border-subtle bg-background-subtle p-4 text-sm leading-7 text-text-secondary">
                    {offer.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-text-primary">Planning ranges</h2>
            <p className="mt-3 text-sm leading-7 text-text-secondary">{pricingDisclaimer}</p>
          </div>
        </section>

        <section>
          <SectionHeader align="left" title="Delivery and accountability" />
          <div className="max-w-3xl space-y-4 text-sm leading-7 text-text-secondary">
            <p>
              We define the deliverables, acceptance criteria, and handoff before implementation.
              Project pricing reflects the agreed scope, complexity, risk, and delivered capability.
            </p>
            <p>
              I use AI-assisted development where useful and remain responsible for requirements,
              architecture, technical decisions, validation, security, testing, and deployment.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
            <SectionHeader
              align="left"
              title="Good fit projects"
              subtitle="Examples of situations these engagements can address."
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
              subtitle="Start with the current workflow, agree on the scope, and define how we will verify the result."
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
                    <p className="mt-1 text-sm leading-7 text-text-secondary">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="capabilities" tabIndex={-1} className="scroll-mt-28">
          <SectionHeader
            align="left"
            title="Technical capabilities inside an engagement"
            subtitle="A project may need several of these capabilities to deliver the agreed result."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servicesOffered.map((service) => {
              const Icon = service.icon

              return (
                <article
                  key={service.title}
                  className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
                >
                  <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">{service.outcome}</p>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{service.example}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Related work
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
                See the engineering in context.
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
            >
              View all work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {proofExamples.map((example) => (
              <Link
                key={example.href}
                href={example.href}
                className="rounded-[1.25rem] border border-border-subtle bg-background-elevated p-4 transition-colors hover:border-border-strong"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-link-primary">
                  {example.label}
                </span>
                <span className="mt-2 flex items-center justify-between gap-4 text-sm font-semibold text-text-primary">
                  {example.name}
                  <ArrowRight className="h-4 w-4 shrink-0 text-link-primary" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
            Have an AI, data, platform, or workflow system to improve?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-text-secondary">
            Send the current workflow, constraints, and desired outcome. We can decide whether a
            focused review, scoped build, or ongoing stewardship is the right fit.
          </p>
          <Link
            href="/contact?type=consulting"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Discuss a Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}

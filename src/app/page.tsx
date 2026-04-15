import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '@/components/site/project-card'
import { SignalGrid } from '@/components/site/signal-grid'
import { SectionHeader } from '@/components/ui/section-header'
import {
  companySignals,
  conversionPoints,
  credibilityPoints,
  homeSignals,
  processPreview,
  profile,
  servicesOffered,
} from '@/data/profile'
import { pilotSystems, productionSystems, researchSystems } from '@/data/systems'

export default function Home() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-border-subtle/70 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_48%)]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 md:pt-20 lg:px-8 lg:pb-20">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Consulting for workflow automation and connected systems
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-text-primary sm:text-6xl">
                {profile.heroHeadline}
              </h1>
              <p className="mt-6 max-w-3xl text-xl leading-8 text-text-primary sm:text-2xl">
                {profile.summary}
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                {profile.audience}
              </p>

              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
                >
                  Book a Call
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-text-secondary">
                {[
                  'Lead automation',
                  'System integration',
                  'Workflow automation',
                  'Reliable delivery',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border-subtle bg-background-elevated px-3 py-1.5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Typical reasons clients reach out
              </p>
              <div className="mt-5 space-y-3">
                {[
                  'Leads are coming in, but follow-up depends on manual coordination.',
                  'Important information is copied between inboxes, spreadsheets, and CRMs.',
                  'Staff time is being spent on repetitive routing and status updates.',
                  'You need a new system to hold up after launch, not just look convincing in a demo.',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border-subtle bg-background-subtle px-4 py-4 text-sm leading-7 text-text-secondary"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-primary-200/80 bg-primary-50/70 p-5 dark:border-primary-900/70 dark:bg-primary-950/25">
                <p className="text-sm font-semibold text-text-primary">What the work is for</p>
                <p className="mt-2 text-sm leading-7 text-text-secondary">
                  Better operations, less manual work, cleaner handoffs, and software
                  that people can actually run.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="left"
            title="Proof from real systems"
            subtitle="Production work comes first. Pilot and R&D work stay visible, but they are labeled honestly."
          />

          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Production
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
                Verified delivery that is live and operating
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-8 text-text-secondary">
                Start here if you want the strongest public proof of production delivery,
                accessibility ownership, infrastructure discipline, and long-term support.
              </p>
            </div>
            <div className="grid gap-6">
              {productionSystems.map((system) => (
                <ProjectCard key={system.id} system={system} compact />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Pilot
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
                Systems already moving through real operational workflows
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-8 text-text-secondary">
                Pilot work matters when it proves the workflow, the handoffs, and the
                operating model are strong enough to test in the real world.
              </p>
            </div>
            <div className="grid gap-6">
              {pilotSystems.map((system) => (
                <ProjectCard key={system.id} system={system} compact />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                R&amp;D
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
                Early-stage systems used to solve harder workflow problems
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-8 text-text-secondary">
                These projects are included because they show how I think through
                automation, guardrails, data movement, and system boundaries before a
                production rollout exists.
              </p>
            </div>
            <div className="grid gap-6">
              {researchSystems.map((system) => (
                <ProjectCard key={system.id} system={system} compact />
              ))}
            </div>
          </div>

          <div>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
            >
              Browse all case studies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="section bg-slate-50/80 dark:bg-slate-900/35">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Services"
            subtitle="Defined around the problems clients pay to remove, not around technical labels."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {servicesOffered.map((service) => {
              const Icon = service.icon

              return (
                <article
                  key={service.title}
                  className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
                >
                  <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-text-primary">
                    {service.title}
                  </h3>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">
                    <p>
                      <span className="font-semibold text-text-primary">Problem:</span>{' '}
                      {service.problem}
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">Outcome:</span>{' '}
                      {service.outcome}
                    </p>
                    <p>
                      <span className="font-semibold text-text-primary">Example:</span>{' '}
                      {service.example}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Process"
            subtitle="The work moves from workflow clarity to dependable delivery, not from idea straight to code."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {processPreview.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                  Step {index + 1}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-50/80 dark:bg-slate-900/35">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why businesses trust the work"
            subtitle="The credibility story is delivery, operating range, and clear ownership, not vague positioning."
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
                <h3 className="text-2xl font-semibold tracking-tight text-text-primary">
                  Enterprise standards without enterprise drag
                </h3>
                <p className="mt-4 text-base leading-8 text-text-secondary">
                  The background behind this work includes Target, GE Aerospace,
                  Securian, and U.S. Bank. That shows up in how systems are scoped,
                  documented, secured, and delivered.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {companySignals.map((company) => (
                    <span
                      key={company}
                      className="rounded-full border border-border-subtle bg-background-subtle px-3 py-1.5 text-sm text-text-secondary"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
                <h3 className="text-2xl font-semibold tracking-tight text-text-primary">
                  Clear values, practical work
                </h3>
                <p className="mt-4 text-base leading-8 text-text-secondary">
                  {profile.faithStatement}
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {credibilityPoints.map((point) => (
                <article
                  key={point.title}
                  className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-text-primary">{point.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {point.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <SignalGrid items={homeSignals} columns="four" headingLevel="h3" />
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-primary-200/80 bg-gradient-to-br from-primary-50 via-white to-primary-50/80 p-8 shadow-sm dark:border-primary-900/70 dark:from-primary-950/40 dark:via-slate-950 dark:to-primary-950/20 sm:p-10">
            <SectionHeader
              align="left"
              title="Book a call if you need the workflow fixed, not just discussed."
              subtitle="This is best for owners and operators who already know manual work, disconnected systems, or broken handoffs are costing time."
              className="mb-8"
            />

            <div className="grid gap-5 md:grid-cols-2">
              {conversionPoints.map((point) => {
                const Icon = point.icon

                return (
                  <article
                    key={point.title}
                    className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5"
                  >
                    <div className="inline-flex rounded-2xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-text-primary">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-text-secondary">
                      {point.description}
                    </p>
                  </article>
                )
              })}
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
              >
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

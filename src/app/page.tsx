import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProjectCard } from '@/components/site/project-card'
import { SignalGrid } from '@/components/site/signal-grid'
import { SectionHeader } from '@/components/ui/section-header'
import { companySignals, conversionPoints, homeSignals, profile } from '@/data/profile'
import { productionSystems, researchSystems } from '@/data/systems'

export default function Home() {
  const featuredProduction = productionSystems[0]
  const researchPreview = researchSystems.slice(0, 2).map((system) => system.name).join(' and ')
  const homepageTrustSignals = homeSignals.slice(0, 2)
  const homepageConversionPoints = conversionPoints.slice(0, 3)

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-border-subtle/70 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_46%)]">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 md:pt-20 lg:px-8 lg:pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Workflow automation for small and midsized businesses
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

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
                >
                  Book a Call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary"
                >
                  View Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Common starting points
              </p>
              <div className="mt-5 space-y-3">
                {[
                  'Leads are coming in, but follow-up still depends on manual work.',
                  'Important information is copied between systems by hand.',
                  'The team is spending too much time routing requests and chasing updates.',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border-subtle bg-background-subtle px-4 py-4 text-sm leading-7 text-text-secondary"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-border-subtle bg-background-subtle px-5 py-5">
                <p className="text-sm font-semibold text-text-primary">Outcome</p>
                <p className="mt-2 text-sm leading-7 text-text-primary">
                  Less manual work, cleaner handoffs, and systems people can rely on.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <SectionHeader
            align="left"
            title="Proof"
            subtitle="The strongest public proof comes first. Deeper detail stays on the case studies page."
          />

          {featuredProduction ? <ProjectCard system={featuredProduction} compact /> : null}

          <div className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              More proof
            </p>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Pilot and R&amp;D work is still available, including {researchPreview}. It
              is labeled clearly and kept on the case studies page so the homepage stays focused.
            </p>
            <Link
              href="/case-studies"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
            >
              See all case studies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why clients hire me"
            subtitle="The trust story is simple: real delivery experience, clear communication, and systems that hold up after launch."
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                Real delivery experience
              </h2>
              <p className="mt-4 text-base leading-8 text-text-secondary">
                The background behind this work includes Target, GE Aerospace,
                Securian, and U.S. Bank, plus years of hands-on delivery for a live
                nonprofit platform.
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
              <p className="mt-5 text-sm leading-7 text-text-secondary">
                {profile.faithStatement}
              </p>
              <Link
                href="/why-work-with-me"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
              >
                See background and resume details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <SignalGrid items={homepageTrustSignals} columns="two" headingLevel="h3" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-border-subtle bg-background-elevated p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                  Next step
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">
                  Tell me about the workflow that needs to run better.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
                  The contact page starts with a short intake form so I can understand the
                  problem before the conversation.
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
              </div>

              <div className="space-y-4">
                {homepageConversionPoints.map((point) => (
                  <article
                    key={point.title}
                    className="rounded-[1.5rem] border border-border-subtle bg-background-subtle px-5 py-5"
                  >
                    <h3 className="text-lg font-semibold text-text-primary">{point.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">
                      {point.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

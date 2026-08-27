import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { architectureLayers, canonicalSeoDescription } from '@/data/career-story'
import { profile } from '@/data/profile'
import { productionSystems, researchSystems } from '@/data/systems'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'David Braun | AI Systems / Platform Architect',
  description: canonicalSeoDescription,
  path: '/',
})

const primaryCtaClass =
  'inline-flex items-center gap-2 rounded-full border border-primary-800/10 bg-primary-700 px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-26px_rgba(10,41,104,0.5)] transition-colors hover:bg-primary-800'

const secondaryCtaClass =
  'inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary'

const systemBoundary = [
  'Models, retrieval, and data',
  'Applications and APIs',
  'Workflow and orchestration',
  'Cloud and platform delivery',
  'Security, evaluation, and observability',
  'Operational ownership and human handoff',
]

export default function Home() {
  const featuredProduction = productionSystems[0]
  const secondaryTechnicalProof = researchSystems.filter((system) =>
    ['weatherforge', 'rageatm'].includes(system.id)
  )

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-border-subtle/70 bg-[radial-gradient(circle_at_top,_rgba(58,210,255,0.1),_transparent_46%)]">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 md:pt-16 lg:px-8 lg:pb-14">
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                AI systems · platform architecture · operational software
              </p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold tracking-tight text-text-primary sm:text-6xl">
                {profile.professionalIdentity}
              </h1>
              <p className="mt-6 max-w-4xl text-2xl font-medium leading-9 text-text-primary sm:text-3xl">
                {profile.heroHeadline}
              </p>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl">
                {profile.summary}
              </p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                {profile.audience}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className={primaryCtaClass}>
                  Book a Call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/why-work-with-me" className={secondaryCtaClass}>
                  For Employers &amp; Partners
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                The system boundary
              </p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                The model is one layer. Production value depends on the full path around it.
              </p>
              <ol className="mt-5 space-y-3">
                {systemBoundary.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-background-subtle px-4 py-3 text-sm leading-7 text-text-secondary"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 font-mono text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-[1.5rem] border border-border-subtle bg-background-subtle px-5 py-5">
                <p className="text-sm font-semibold text-text-primary">Current availability</p>
                <p className="mt-2 text-sm leading-7 text-text-primary">
                  {profile.availability}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div className="lg:pt-2">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Proof
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                Strongest public proof first.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-text-secondary">
                Start with the public production system. The technical prototypes are
                still available for review, but VIFG is the clearest proof of delivery,
                accessibility ownership, and production stewardship.
              </p>
              <Link
                href="/case-studies"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
              >
                See all case studies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {featuredProduction ? (
              <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {featuredProduction.contextLabel ?? featuredProduction.caseStudyStage}
                  </Badge>
                  <Badge variant="outline">Public since 2020</Badge>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                  {featuredProduction.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-text-secondary sm:text-base">
                  {featuredProduction.summary}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border-subtle bg-background-subtle p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                      Role
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-primary">
                      {featuredProduction.myRole}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-subtle bg-background-subtle p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                      Result
                    </p>
                    <p className="mt-1 text-sm font-medium text-text-primary">
                      Public site serving VIFG since 2020 with AWS hosting,
                      repeatable releases, and accessibility-first delivery.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/case-studies/${featuredProduction.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
                >
                  Read case study
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              What I architect
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
              Five connected layers from capability to operation.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary">
              I work across the boundaries that turn an AI or data capability into
              software people can deploy, observe, evaluate, and trust within its limits.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {architectureLayers.map((area, index) => (
              <article
                key={area.title}
                className="rounded-[1.25rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <p className="font-mono text-xs font-semibold text-link-primary">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">{area.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {area.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {area.examples.map((example) => (
                    <span
                      key={example}
                      className="rounded-full border border-border-subtle bg-background-subtle px-2.5 py-1 text-xs text-text-secondary"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            See services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6 shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                  Secondary technical proof
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
                  Prototype and academic examples stay labeled.
                </h2>
                <p className="mt-4 text-base leading-8 text-text-secondary">
                  WeatherForge and RAGeATM are useful technical evidence for data
                  pipelines, dashboards, retrieval, and refusal boundaries. They are
                  intentionally secondary to production proof.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {secondaryTechnicalProof.map((project) => (
                  <Link
                    key={project.id}
                    href={`/case-studies/${project.id}`}
                    className="group rounded-[1.25rem] border border-border-subtle bg-background-elevated p-5 shadow-sm transition-colors hover:border-border-strong hover:bg-background"
                  >
                    <span className="rounded-full border border-border-subtle bg-background-subtle px-3 py-1 text-xs font-medium text-text-secondary">
                      {project.contextLabel ?? project.currentState}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-text-primary">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">
                      {project.shortTitle ?? project.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-link-primary group-hover:text-link-primary-hover">
                      Read technical case study
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 text-center shadow-sm sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              Next step
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-text-primary">
              Tell me about the workflow that needs to run better.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-text-secondary">
              Send the workflow, handoff, lead process, data movement, or internal
              system problem. I will help decide whether a scoped build or review makes
              sense.
            </p>
            <div className="mt-8">
              <Link href="/contact" className={primaryCtaClass}>
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

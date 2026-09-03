import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { canonicalSeoDescription } from '@/data/career-story'
import { profile } from '@/data/profile'
import { resumeUrl } from '@/data/social-links'
import { getSystemById, type FeaturedSystemCaseStudy } from '@/data/systems'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: `David Braun | ${profile.professionalIdentity}`,
  description: canonicalSeoDescription,
  path: '/',
})

const primaryCtaClass =
  'inline-flex items-center gap-2 rounded-full border border-primary-800/10 bg-primary-700 px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-26px_rgba(10,41,104,0.5)] transition-colors hover:bg-primary-800'

const secondaryCtaClass =
  'inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary'

const credibilitySignals = [
  {
    value: '6+ years',
    label: 'Engineering experience',
    detail: 'Across Target, GE Aerospace, Securian, U.S. Bank, and independent delivery.',
  },
  {
    value: 'Approximately 40%',
    label: 'Manual effort reduced',
    detail: 'Documented result from Python workflow automation at Securian.',
  },
  {
    value: '50+ repositories',
    label: 'Modernized at Target',
    detail: 'Dependency upgrades, build-tool migration, and configuration standardization.',
  },
  {
    value: 'Peer-reviewed + accepted',
    label: 'Research record',
    detail: 'A 2018 JGR article and an IEEE LA-CCI 2026 accepted conference paper.',
  },
] as const

const selectedSystems = ['vifg-nonprofit-platform', 'dealerflow', 'weatherforge'].map((id) => {
  const system = getSystemById(id)

  if (!system) {
    throw new Error(`Missing selected homepage system: ${id}`)
  }

  return system
})

const engagementPaths = [
  {
    audience: 'Employers',
    title: 'Engineering roles',
    description:
      'See the enterprise, platform, security, software, and research experience behind the work.',
    href: '/experience',
    label: 'View Experience',
  },
  {
    audience: 'Clients',
    title: 'Consulting engagements',
    description:
      'Review practical options for architecture, scoped systems, automation, and platform stewardship.',
    href: '/services',
    label: 'View Services',
  },
  {
    audience: 'Researchers',
    title: 'Research collaboration',
    description:
      'Explore current information-retrieval work and earlier peer-reviewed space-physics research.',
    href: '/research',
    label: 'View Research',
  },
] as const

const technicalCapabilities = [
  'Applied AI, retrieval, and data',
  'Applications and APIs',
  'Workflow and orchestration',
  'Cloud infrastructure and delivery',
  'Security, evaluation, and observability',
  'Operations and human handoff',
] as const

export default function Home() {
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-border-subtle/70 bg-[radial-gradient(circle_at_top,_rgba(58,210,255,0.1),_transparent_46%)]">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 md:pt-16 lg:px-8 lg:pb-14">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
            Platform architecture · applied AI · cloud infrastructure · workflow automation
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
            <Link href="/case-studies" className={primaryCtaClass}>
              View Work
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className={secondaryCtaClass}>
              Contact Me
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryCtaClass}
            >
              Resume PDF
              <FileText className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-7 text-text-secondary">
            {profile.availability}
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle/70 bg-background-subtle py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Career and research highlights</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {credibilitySignals.map((signal) => (
              <article
                key={signal.label}
                className="rounded-[1.25rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <p className="text-xl font-semibold tracking-tight text-text-primary">
                  {signal.value}
                </p>
                <h3 className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-link-primary">
                  {signal.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{signal.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Selected work
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                Systems with concrete delivery evidence.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary">
                Production ownership leads, followed by a bounded pilot and a quantified technical
                prototype. Each project keeps its current stage visible.
              </p>
            </div>
            <Link
              href="/case-studies"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
            >
              View all case studies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {selectedSystems.map((system) => (
              <SelectedWorkCard key={system.id} system={system} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              Three ways to engage
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
              One engineering practice, three useful entry points.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {engagementPaths.map((path) => (
              <article
                key={path.audience}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-link-primary">
                  {path.audience}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-text-primary">{path.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{path.description}</p>
                <Link
                  href={path.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
                >
                  {path.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-6 shadow-sm sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              Technical capabilities
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
              The connected layers around AI and data.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary">
              I work across the boundaries needed to turn a useful capability into a system people
              can deploy, operate, evaluate, and maintain.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {technicalCapabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-4 text-sm font-medium text-text-primary"
                >
                  {capability}
                </div>
              ))}
            </div>
            <Link
              href="/approach/evidence"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
            >
              Engineering &amp; Evidence Standards
              <ArrowRight className="h-4 w-4" />
            </Link>
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
              Have a role, project, or research question to discuss?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-text-secondary">
              Share the context and what a useful outcome would look like. I will respond with the
              most relevant next step.
            </p>
            <div className="mt-8">
              <Link href="/contact" className={primaryCtaClass}>
                Contact Me
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function SelectedWorkCard({ system }: Readonly<{ system: FeaturedSystemCaseStudy }>) {
  return (
    <article className="flex h-full flex-col rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{system.contextLabel ?? system.caseStudyStage}</Badge>
        <Badge variant="outline">{system.currentState}</Badge>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
        {system.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{system.summary}</p>
      <div className="mt-5 rounded-xl border border-border-subtle bg-background-subtle p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
          Current result
        </p>
        <p className="mt-2 text-sm leading-7 text-text-primary">{system.outcome}</p>
      </div>
      <Link
        href={`/case-studies/${system.id}`}
        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
      >
        Read case study
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  )
}

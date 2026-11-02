import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { canonicalSeoDescription } from '@/data/career-story'
import { profile } from '@/data/profile'
import { resumeUrl } from '@/data/resumes'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: `David Braun | ${profile.professionalIdentity}`,
  description: canonicalSeoDescription,
  path: '/',
})

const primaryCtaClass =
  'inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-800/10 bg-primary-700 px-3 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-26px_rgba(10,41,104,0.5)] transition-colors hover:bg-primary-800 sm:px-6'

const secondaryCtaClass =
  'inline-flex min-h-11 items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-3 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary sm:px-6'

const textLinkClass =
  'inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover'

const eyebrowClass = 'font-mono text-xs uppercase tracking-[0.18em] text-link-primary'
const headingClass = 'mt-2 text-2xl font-semibold tracking-tight text-balance text-text-primary sm:mt-3 sm:text-3xl'

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
    detail: 'A published 2018 JGR article and a paper accepted for IEEE LA-CCI 2026.',
  },
]

const engagementPaths = [
  {
    audience: 'Employers',
    title: 'Engineering roles',
    description: 'See the enterprise, platform, security, software, and research experience behind the work.',
    href: '/experience',
    label: 'View Experience',
  },
  {
    audience: 'Clients',
    title: 'Consulting engagements',
    description: 'Review practical options for architecture, scoped systems, automation, and platform stewardship.',
    href: '/services',
    label: 'View Services',
  },
  {
    audience: 'Researchers',
    title: 'Research collaboration',
    description: 'Explore current information-retrieval work and earlier peer-reviewed space-physics research.',
    href: '/research',
    label: 'View Research',
  },
]

const technicalCapabilities = [
  'Applied AI, retrieval, and data',
  'Applications and APIs',
  'Workflow and orchestration',
  'Cloud infrastructure and delivery',
  'Security, evaluation, and observability',
  'Operations and human handoff',
]

export default function Home() {
  return (
    <div className="wrap-anywhere">
      <section className="border-b border-border-subtle/70 bg-[radial-gradient(circle_at_top,_rgba(58,210,255,0.1),_transparent_46%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16">
          <p className="font-mono text-xs tracking-[0.09em] text-pretty text-link-primary uppercase sm:tracking-[0.18em]">
            Platform architecture · applied AI · cloud infrastructure · workflow automation
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-balance text-text-primary sm:text-5xl lg:text-6xl">
            {profile.professionalIdentity}
          </h1>
          <p className="mt-4 max-w-4xl text-xl font-medium leading-snug text-pretty text-text-primary sm:text-2xl md:mt-6 lg:text-3xl">
            {profile.heroHeadline}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-pretty text-text-secondary sm:text-lg lg:text-xl">
            {profile.summary}
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-pretty text-text-secondary sm:mt-4 lg:text-lg">
            {profile.audience}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 md:mt-8 md:gap-3">
            <Link href="/case-studies" className={primaryCtaClass}>
              View Work <ArrowRight className="size-4 shrink-0" />
            </Link>
            <Link href="/contact" className={secondaryCtaClass}>Contact</Link>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={secondaryCtaClass}>
              Résumé PDF <FileText className="size-4 shrink-0" />
            </a>
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-pretty text-text-secondary md:mt-6">
            {profile.availability}
          </p>
        </div>
      </section>

      <section aria-labelledby="career-highlights" className="border-b border-border-subtle/70 bg-background-subtle">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-8 lg:px-8">
          <h2 id="career-highlights" className="sr-only">Career and research highlights</h2>
          <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
            {credibilitySignals.map((signal) => (
              <li key={signal.label} className="rounded-[1.25rem] border border-border-subtle bg-background-elevated p-4 shadow-sm md:p-5">
                <h3>
                  <span className="block text-xl font-semibold tracking-tight text-text-primary">{signal.value}</span>
                  <span className={`mt-1 block ${eyebrowClass}`}>{signal.label}</span>
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{signal.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 md:space-y-16 md:py-16 lg:px-8">
        <section aria-labelledby="engagement-paths">
          <p className={eyebrowClass}>Three ways to engage</p>
          <h2 id="engagement-paths" className={headingClass}>One engineering practice, three useful entry points.</h2>
          <div className="mt-4 grid gap-4 md:mt-7 md:grid-cols-3 lg:gap-5">
            {engagementPaths.map((path) => (
              <article key={path.href} className="flex flex-col rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm lg:p-6">
                <p className={eyebrowClass}>{path.audience}</p>
                <h3 className="mt-2 text-xl font-semibold text-text-primary">{path.title}</h3>
                <p className="mt-2 mb-2 text-base leading-relaxed text-text-secondary md:mb-4">{path.description}</p>
                <Link href={path.href} className={`mt-auto ${textLinkClass}`}>
                  {path.label} <ArrowRight className="size-4 shrink-0" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="technical-capabilities" className="rounded-[1.75rem] border border-border-subtle bg-background-subtle p-5 shadow-sm sm:p-8">
          <p className={eyebrowClass}>Technical capabilities</p>
          <h2 id="technical-capabilities" className={headingClass}>The connected layers around AI and data.</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary">
            I work across the boundaries needed to turn a useful capability into a system people
            can deploy, operate, evaluate, and maintain.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {technicalCapabilities.map((capability) => (
              <li key={capability} className="rounded-2xl border border-border-subtle bg-background-elevated px-4 py-3 text-sm font-medium text-text-primary sm:py-4">
                {capability}
              </li>
            ))}
          </ul>
          <Link href="/approach/evidence" className={`mt-3 sm:mt-5 ${textLinkClass}`}>
            Engineering &amp; Evidence Standards <ArrowRight className="size-4 shrink-0" />
          </Link>
        </section>

        <section className="mx-auto max-w-5xl rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 text-center shadow-sm sm:p-8">
          <p className={eyebrowClass}>Next step</p>
          <h2 className={headingClass}>Have a role, project, or research question to discuss?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
            Share the context and what a useful outcome would look like. I will respond with the most relevant next step.
          </p>
          <Link href="/contact" className={`mt-5 md:mt-8 ${primaryCtaClass}`}>
            Contact Me <ArrowRight className="size-4 shrink-0" />
          </Link>
        </section>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { canonicalSeoDescription } from '@/data/career-story'
import clientWebsites from '@/data/live-client-websites.json'
import { profile } from '@/data/profile'
import { resumeUrl } from '@/data/resumes'
import { getSystemById } from '@/data/systems'
import { createPageMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const metadata: Metadata = createPageMetadata({
  title: `David Braun | ${profile.professionalIdentity}`,
  description: canonicalSeoDescription,
  path: '/',
})

const primaryCtaClass =
  'inline-flex items-center gap-2 rounded-full border border-primary-800/10 bg-primary-700 px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-26px_rgba(10,41,104,0.5)] transition-colors hover:bg-primary-800 sm:px-5 xl:px-6'

const secondaryCtaClass =
  'inline-flex items-center gap-2 rounded-full border border-border-subtle bg-background-elevated px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background-subtle hover:text-text-primary sm:px-5 xl:px-6'

const textLinkClass =
  'inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover'

const credibilitySignals = [
  {
    label: '50+ repositories',
    detail: 'Led dependency and build-tool upgrades at Target.',
  },
  {
    label: 'About 40% less manual effort',
    detail: 'Automated recurring data processing with Python at Securian.',
  },
  {
    label: 'Peer-reviewed research',
    detail: 'Coauthored a 2018 space physics paper on electromagnetic waves.',
  },
]

const selectedWork = [
  {
    id: 'vifg-nonprofit-platform',
    description: 'I built and operate the website for a nonprofit serving people with visual impairments.',
    evidence: 'In service since 2020, with automated releases on AWS.',
  },
  {
    id: 'dealerflow',
    description: 'I built the backend and mobile app for wholesale dealers to manage vehicle inventory and offers.',
    evidence: 'Buyers receive alerts when newly listed vehicles match their criteria.',
  },
  {
    id: 'weatherforge',
    description: 'I led development of the NOAA data pipeline and dashboard on a three-person University of St. Thomas team.',
    evidence: 'The dashboard maps 55,384 storm events across Minnesota’s 87 counties.',
  },
].map(({ id, description, evidence }) => {
  const system = getSystemById(id)
  if (!system) throw new Error(`Missing selected homepage system: ${id}`)
  return { system, description, evidence }
})

export default function Home() {
  return (
    <div className="wrap-anywhere">
      <section className="border-b border-border-subtle/70 bg-[radial-gradient(circle_at_top,_rgba(58,210,255,0.1),_transparent_46%)]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:gap-7 md:py-12 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-8 lg:px-8 lg:py-18 xl:gap-20 xl:py-22">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-text-primary sm:text-5xl lg:text-6xl xl:text-7xl">
              {profile.professionalIdentity}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-text-secondary sm:text-xl lg:mt-6">
              {profile.heroDescription}
            </p>
          </div>
          <div className="lg:border-l lg:border-border-strong lg:pl-8 xl:pl-10">
            <p className="max-w-md text-base leading-relaxed text-pretty text-text-secondary">
              I’m open to select full-time roles, engineering partnerships, and consulting projects.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 lg:mt-6">
              <Link href="/case-studies" className={primaryCtaClass}>
                View Work <ArrowRight className="size-4 shrink-0" />
              </Link>
              <Link href="/contact" className={secondaryCtaClass}>Contact</Link>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} px-2`}>
                <FileText className="size-4 shrink-0" /> Résumé
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle/70 bg-background-subtle">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:py-5 lg:px-8 lg:py-7">
          <h2 className="sr-only">Career and research highlights</h2>
          <dl className="grid divide-y divide-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {credibilitySignals.map((signal) => (
              <div key={signal.label} className="py-3 sm:px-5 sm:first:pl-0 sm:last:pr-0 lg:px-8">
                <dt className="text-lg font-semibold tracking-tight text-pretty text-text-primary lg:text-xl">{signal.label}</dt>
                <dd className="mt-1 text-sm leading-6 text-pretty text-text-secondary lg:mt-2 lg:text-base">{signal.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 lg:py-16 xl:py-20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 md:mb-7 lg:mb-9">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">Selected work</h2>
          <Link href="/case-studies" className={textLinkClass}>
            View all work <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {selectedWork.map((project) => <FeaturedProject key={project.system.id} {...project} />)}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-7 border-t border-border-subtle pt-3 md:mt-8 md:pt-4">
          <h3 className="text-base font-semibold text-text-primary">More live client work</h3>
          <ul className="flex flex-wrap gap-x-6">
            {clientWebsites.map(({ id, client }) => (
              <li key={id}>
                <Link href={`/case-studies/${id}`} className={textLinkClass}>
                  {client} <ArrowRight className="size-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-background-subtle">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-7 sm:px-6 lg:px-8 lg:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-text-primary lg:text-3xl">Let’s talk about an engineering role or project.</h2>
          <Link href="/contact" className={secondaryCtaClass}>
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeaturedProject({ system, description, evidence }: Readonly<(typeof selectedWork)[number]>) {
  const lead = system.id === 'vifg-nonprofit-platform'
  return (
    <article className={cn(
      'grid min-w-0 rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm md:row-span-2 md:grid-rows-subgrid md:gap-y-0 md:p-7 xl:p-8',
      lead && 'border-primary-600/30 bg-linear-to-br from-background-elevated to-primary-50 dark:to-primary-950/30 md:max-xl:col-span-2 md:max-xl:row-span-1 md:max-xl:grid-cols-[3fr_2fr] md:max-xl:grid-rows-none md:max-xl:items-center md:max-xl:gap-x-8'
    )}>
      <div>
        <Badge variant="secondary">{system.currentState}</Badge>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary md:mt-4 xl:text-[1.625rem]">{system.name}</h3>
        <p className="mt-2 text-base leading-relaxed text-text-secondary md:mt-3">{description}</p>
      </div>
      <div className={cn('flex flex-col gap-1 pt-4 md:gap-3 md:pt-6', lead && 'md:max-xl:border-l md:max-xl:border-border-subtle md:max-xl:pt-0 md:max-xl:pl-8')}>
        <p className={cn('border-t border-border-subtle pt-3 text-base leading-relaxed font-medium text-text-primary md:pt-5', lead && 'md:max-xl:border-t-0 md:max-xl:pt-0')}>
          {evidence}
        </p>
        <Link href={`/case-studies/${system.id}`} className={`${textLinkClass} mt-auto self-start`}>
          Read case study<span className="sr-only"> for {system.name}</span>
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      </div>
    </article>
  )
}

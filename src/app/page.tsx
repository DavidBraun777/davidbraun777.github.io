import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { canonicalSeoDescription } from '@/data/career-story'
import { profile } from '@/data/profile'
import { resumeUrl } from '@/data/resumes'
import { getSystemById } from '@/data/systems'
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

const textLinkClass =
  'inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover'

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
    <>
      <section className="border-b border-border-subtle/70 bg-[radial-gradient(circle_at_top,_rgba(58,210,255,0.1),_transparent_46%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {profile.professionalIdentity}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl">
            {profile.heroDescription}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/case-studies" className={primaryCtaClass}>
              View Work <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className={secondaryCtaClass}>Contact</Link>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} px-2 py-2`}>
              <FileText className="h-4 w-4" /> Résumé
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle/70 bg-background-subtle">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Career and research highlights</h2>
          <dl className="grid divide-y divide-border-subtle sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {credibilitySignals.map((signal) => (
              <div key={signal.label} className="py-3 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                <dt className="text-lg font-semibold tracking-tight text-text-primary">{signal.label}</dt>
                <dd className="mt-1 text-sm leading-6 text-text-secondary">{signal.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">Selected work</h2>
          <Link href="/case-studies" className={textLinkClass}>
            View all work <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {selectedWork.map(({ system, description, evidence }) => (
            <article key={system.id} className="flex flex-col items-start rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
              <Badge variant="secondary">{system.currentState}</Badge>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">{system.name}</h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
              <p className="mt-3 text-sm font-medium leading-6 text-text-primary">{evidence}</p>
              <Link href={`/case-studies/${system.id}`} className={`${textLinkClass} mt-auto pt-4`}>
                Read case study<span className="sr-only"> for {system.name}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border-subtle bg-background-subtle">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-7 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">Let’s talk about an engineering role or project.</h2>
          <Link href="/contact" className={secondaryCtaClass}>
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { TechTag } from '@/components/site/tech-tag'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import {
  pilotSystems,
  productionSystems,
  researchSystems,
  type FeaturedSystemCaseStudy,
} from '@/data/systems'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Case Studies',
  description:
    'Production, pilot, prototype, and R&D case studies showing workflow automation, system integration, data systems, and delivery work.',
  path: '/case-studies',
})

function isPrototypeOrAcademic(system: FeaturedSystemCaseStudy) {
  return (
    system.contextLabel?.includes('Prototype') ||
    system.currentState === 'Applied dashboard prototype' ||
    system.currentState === 'Local RAG prototype' ||
    system.currentState === 'Prototype'
  )
}

function StageSection({
  eyebrow,
  title,
  subtitle,
  systems,
}: Readonly<{
  eyebrow: string
  title: string
  subtitle: string
  systems: FeaturedSystemCaseStudy[]
}>) {
  if (systems.length === 0) {
    return null
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-text-secondary">{subtitle}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {systems.map((system) => (
          <CaseStudyCard key={system.id} system={system} />
        ))}
      </div>
    </section>
  )
}

export default function CaseStudiesPage() {
  const featuredProduction = productionSystems[0]
  const prototypeSystems = researchSystems.filter(isPrototypeOrAcademic)
  const activeResearchSystems = researchSystems.filter((system) => !isPrototypeOrAcademic(system))

  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Case Studies"
          title="A portfolio of production, pilot, prototype, and R&D work."
          description="VIFG is still the strongest public proof. The rest of the work stays visible so you can see what is live, what is in pilot, what is a prototype or academic build, and what is still under active development."
          actions={[{ label: 'Book a Call', href: '/contact' }]}
        />

        {featuredProduction ? (
          <section className="space-y-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                Production
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
                Featured public production proof
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-8 text-text-secondary">
                VIFG leads because it is the clearest public example of long-term delivery,
                accessibility ownership, operational responsibility, and production stewardship.
              </p>
            </div>

            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {featuredProduction.contextLabel ?? featuredProduction.caseStudyStage}
                </Badge>
                <Badge variant="outline">{featuredProduction.currentState}</Badge>
                <Badge variant="outline">Featured proof</Badge>
              </div>

              <div className="mt-4 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-text-primary">
                    {featuredProduction.name}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-text-secondary">
                    {featuredProduction.summary}
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-border-subtle bg-background-subtle p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                        Problem
                      </p>
                      <p className="mt-2 text-sm leading-7 text-text-secondary">
                        {featuredProduction.problem}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-border-subtle bg-background-subtle p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                        Result
                      </p>
                      <p className="mt-2 text-sm leading-7 text-text-secondary">
                        {featuredProduction.outcome}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                    What I owned
                  </p>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {featuredProduction.myRole}
                  </p>
                  <p className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
                    Public-facing proof
                  </p>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    Live site at vifg.org/home, backed by repeatable deployment,
                    accessibility support, and ongoing nonprofit operational stewardship.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4">
                    <Link
                      href={`/case-studies/${featuredProduction.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
                    >
                      Read full case study
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <ExternalLinkAction
                      href={featuredProduction.externalUrl ?? 'https://www.vifg.org/home'}
                    >
                      Visit live site
                    </ExternalLinkAction>
                  </div>
                </div>
              </div>
            </article>
          </section>
        ) : null}

        <StageSection
          eyebrow="Pilot / client-facing"
          title="Operational workflows being tested in the field"
          subtitle="Pilot systems show where real workflows are already moving through the software, even if the product is not yet at full production maturity."
          systems={pilotSystems}
        />

        <StageSection
          eyebrow="Prototype / academic"
          title="Technical proof with honest limits"
          subtitle="Prototype and academic work stays visible for technical review, but it does not outrank public production proof. WeatherForge and RAGeATM belong here until they have production usage evidence."
          systems={prototypeSystems}
        />

        <StageSection
          eyebrow="R&D / active build"
          title="Early-stage systems with clear architecture and workflow logic"
          subtitle="R&D work shows how automation boundaries, validation, data movement, and system design are handled before production rollout. DGM and StormIQ stay positioned as active build direction, not finished products."
          systems={activeResearchSystems}
        />

        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <Link
            href="/contact?type=consulting"
            className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Need to talk through a similar workflow?
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/approach/evidence"
            className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            How I label and verify technical work
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function CaseStudyCard({ system }: Readonly<{ system: FeaturedSystemCaseStudy }>) {
  return (
    <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{system.contextLabel ?? system.caseStudyStage}</Badge>
        <Badge variant="outline">{system.currentState}</Badge>
        <Badge variant="outline">{system.themeTitle}</Badge>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-text-primary">
        {system.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{system.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {system.stack.slice(0, 5).map((item) => (
          <TechTag key={item}>{item}</TechTag>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        <Link
          href={`/case-studies/${system.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
        >
          Read case study
          <ArrowRight className="h-4 w-4" />
        </Link>
        {system.externalUrl ? (
          <ExternalLinkAction href={system.externalUrl}>Visit live site</ExternalLinkAction>
        ) : null}
      </div>
    </article>
  )
}

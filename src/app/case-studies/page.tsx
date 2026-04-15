import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { ProjectCard } from '@/components/site/project-card'
import { pilotSystems, productionSystems, researchSystems } from '@/data/systems'

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Production, pilot, and R&D case studies showing workflow automation, system integration, and delivery work.',
}

function CaseStudySection({
  title,
  subtitle,
  systems,
}: {
  title: string
  subtitle: string
  systems: typeof productionSystems
}) {
  return (
    <section className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
          {title}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">
          {title === 'Production'
            ? 'Live systems and verified delivery'
            : title === 'Pilot'
              ? 'Operational workflows being tested in the field'
              : 'Early-stage systems with clear architecture and workflow logic'}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-8 text-text-secondary">{subtitle}</p>
      </div>
      <div className="grid gap-6">
        {systems.map((system) => (
          <ProjectCard key={system.id} system={system} compact />
        ))}
      </div>
    </section>
  )
}

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Case Studies"
          title="Proof organized by delivery stage, not mixed together."
          description="This page leads with the strongest verified production work, then separates pilot and R&D systems so you can see what is live, what is being tested, and what is still earlier-stage."
          actions={[{ label: 'Book a Call', href: '/contact' }]}
        />

        <CaseStudySection
          title="Production"
          subtitle="Start here if you want the clearest evidence of production ownership, deployment discipline, and long-term support."
          systems={productionSystems}
        />

        <CaseStudySection
          title="Pilot"
          subtitle="Pilot systems show where real workflows are already moving through the software, even if the product is not yet at full production maturity."
          systems={pilotSystems}
        />

        <CaseStudySection
          title="R&D"
          subtitle="R&D work stays visible because it shows how I handle automation boundaries, validation, data movement, and system design before production rollout."
          systems={researchSystems}
        />

        <div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Need to talk through a similar workflow?
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

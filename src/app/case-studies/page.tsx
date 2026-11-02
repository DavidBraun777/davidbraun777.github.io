import type { Metadata } from 'next'
import { WorkCard } from '@/components/site/work-card'
import { historicalSystems, pilotSystems, productionSystems, researchSystems, type FeaturedSystemCaseStudy } from '@/data/systems'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Work',
  description: 'Client websites, applications, data projects, and experiments. Explore the contribution, decisions, and delivery status behind each case study.',
  path: '/case-studies',
})

function ProjectGroup({ title, systems }: Readonly<{
  title: string
  systems: FeaturedSystemCaseStudy[]
}>) {
  if (!systems.length) return null
  return (
    <section aria-label={title}>
      <h2 className="mb-5 text-3xl font-semibold tracking-tight text-text-primary">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {systems.map((system) => <WorkCard key={system.id} system={system} />)}
      </div>
    </section>
  )
}

export default function CaseStudiesPage() {
  const [lead, ...clientWebsites] = productionSystems
  const academicProjects = researchSystems.filter(system => system.contextLabel?.includes('Academic'))
  const experiments = researchSystems.filter(system => !academicProjects.includes(system))

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 md:space-y-12 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">Work</h1>
        <p className="mt-3 text-lg leading-8 text-text-secondary">
          Explore the websites and systems I’ve built, the decisions behind them, and what each project delivered.
        </p>
      </div>

      <section aria-labelledby="client-work" className="space-y-5">
        <h2 id="client-work" className="text-3xl font-semibold tracking-tight text-text-primary">Client work</h2>
        {lead && <WorkCard system={lead} layout="lead" />}
        <div className="grid gap-5 md:grid-cols-2">
          {clientWebsites.map((system) => <WorkCard key={system.id} system={system} layout="screenshot" />)}
        </div>
        <div id="past-client-work" tabIndex={-1} className="scroll-mt-28 space-y-4">
          {historicalSystems.map((system) => <WorkCard key={system.id} system={system} />)}
        </div>
      </section>

      <ProjectGroup title="Applications and data projects" systems={[...pilotSystems, ...academicProjects]} />
      <ProjectGroup title="Experiments and work in progress" systems={experiments} />
    </div>
  )
}

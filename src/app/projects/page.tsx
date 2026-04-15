import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { PageIntro } from '@/components/site/page-intro'
import { ProjectCard } from '@/components/site/project-card'
import { SectionHeader } from '@/components/ui/section-header'
import { featuredSystems, supportingSystems } from '@/data/systems'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected portfolio work from David Braun across AI systems, workflow automation, production infrastructure, and operational software.',
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pb-16 pt-10 md:pt-12">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Projects"
          title="Selected portfolio work with clearer project boundaries and stronger case-study structure."
          description="This page is curated. It leads with the strongest and most representative systems first, then keeps additional work available without forcing everything to compete at the same level."
          actions={[
            { label: 'Explore Systems', href: '/systems' },
            { label: 'Contact', href: '/contact', variant: 'secondary' },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Featured projects"
            subtitle="Projects that best show the mix of architecture, implementation, product judgment, and operational thinking."
          />
          <div className="grid gap-6">
            {featuredSystems.map((system) => (
              <ProjectCard key={system.id} system={system} compact />
            ))}
          </div>
        </section>

        {supportingSystems.length > 0 ? (
          <section>
            <SectionHeader
              align="left"
              title="Additional work"
              subtitle="Relevant supporting work that stays available without crowding the top of the portfolio."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              {supportingSystems.map((system) => (
                <ProjectCard key={system.id} system={system} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Looking for technical depth instead of project thumbnails?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
            The systems page pulls the work apart by architecture lens, artifacts, and
            engineering process so the technical story is easier to inspect.
          </p>
          <Link
            href="/systems"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-link-primary transition-colors hover:text-link-primary-hover"
          >
            Go to systems
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}

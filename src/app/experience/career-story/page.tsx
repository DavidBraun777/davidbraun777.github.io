import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { SectionHeader } from '@/components/ui/section-header'
import {
  architectureSkillLayers,
  careerStoryStages,
  consultingEngagements,
  fullTimeRoleFamilies,
  northStarIdentity,
  synthesisBoundary,
} from '@/data/career-story'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Career Story',
  description:
    "The five-part career through-line behind David Braun's AI systems and platform engineering work.",
  path: '/experience/career-story',
})

export default function CareerStoryPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Career Story"
          title="Five chapters that converge around dependable AI and platform systems."
          description="Scientific computing, enterprise software, security and platform engineering, production ownership, and applied AI are cumulative parts of one engineering path. Historical role titles remain exactly what they were."
          actions={[
            { label: 'View Experience', href: '/experience' },
            { label: 'Discuss a Role', href: '/contact?type=employment', variant: 'secondary' },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Career through-line"
            subtitle="Each chapter adds a system boundary, operating constraint, or evidence discipline that carries into the work today."
          />
          <div className="grid gap-4 lg:grid-cols-5">
            {careerStoryStages.map((stage, index) => (
              <article
                key={stage.id}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <p className="font-mono text-xs font-semibold text-link-primary">
                  Chapter {index + 1}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-7 text-text-primary">
                  {stage.label}
                </h3>
                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  <span className="font-semibold text-text-primary">Evidence:</span>{' '}
                  {stage.evidence}
                </p>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  <span className="font-semibold text-text-primary">What it adds:</span>{' '}
                  {stage.meaning}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-primary-300/70 bg-primary-50/60 p-5 dark:border-primary-900 dark:bg-primary-950/30">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-link-primary">
              Current synthesis
            </p>
            <p className="mt-2 text-xl font-semibold text-text-primary">
              {northStarIdentity}
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-text-secondary">
              {synthesisBoundary}
            </p>
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="The system scope that emerged"
            subtitle="The career path expanded from individual features and analyses into the connected layers required to operate a dependable system."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {architectureSkillLayers.map((layer) => (
              <article
                key={layer.title}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-text-primary">{layer.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {layer.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Where the through-line fits"
            subtitle="The same cross-layer background supports embedded engineering roles and bounded consulting engagements."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary">Engineering roles</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {fullTimeRoleFamilies.map((role) => (
                  <li key={role} className="rounded-xl border border-border-subtle bg-background-subtle px-4 py-3 text-sm font-medium text-text-primary">
                    {role}
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary">Consulting engagements</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {consultingEngagements.map((engagement) => (
                  <li key={engagement} className="rounded-xl border border-border-subtle bg-background-subtle px-4 py-3 text-sm font-medium text-text-primary">
                    {engagement}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
            Evidence stays attached to the claim
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-text-secondary">
            Production systems, pilots, prototypes, research, and historical roles are
            deliberately labeled according to what their supporting evidence establishes.
          </p>
          <Link href="/approach/evidence" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-link-primary hover:text-link-primary-hover">
            How I label and verify technical work
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  )
}

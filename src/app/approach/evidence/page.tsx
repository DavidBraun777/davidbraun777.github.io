import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro } from '@/components/site/page-intro'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { researchToSystemsPractices } from '@/data/career-story'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Engineering & Evidence Standards',
  description:
    'How David Braun labels production, pilot, prototype, and research work; reviews AI-assisted engineering; and evaluates technical evidence and limitations.',
  path: '/approach/evidence',
})

const maturityLevels = [
  {
    label: 'Production',
    description:
      'A system is deployed into a real operating environment with active ownership. The label does not imply unmeasured scale, uptime, adoption, or business impact.',
  },
  {
    label: 'Pilot',
    description:
      'A bounded workflow is being tried with real users or operating context, but broader rollout, long-term reliability, and adoption are not yet established.',
  },
  {
    label: 'R&D / Prototype',
    description:
      'A technical, academic, or active-build artifact tests an approach. It can demonstrate engineering decisions without being presented as paid deployment or mature operations.',
  },
]

const evidenceOrder = [
  'Production systems with real operational ownership',
  'Measured business, user, quality, or reliability outcomes',
  'Reviewable architecture, code, deployment, and platform artifacts',
  'Enterprise engineering history with bounded responsibilities',
  'Published research, reproducibility, and accepted work with status shown',
  'Credentials, memberships, and technology lists as supporting context',
]

const engineeringChecks = [
  {
    title: 'Security',
    description:
      'Access boundaries, data handling, dependency checks, threat considerations, and remediation are cited only to the level demonstrated by the work.',
  },
  {
    title: 'Accessibility',
    description:
      'Semantic structure, keyboard use, labels, contrast, and automated or manual checks are treated as engineering evidence. Scores are not claimed without a recorded run.',
  },
  {
    title: 'Testing',
    description:
      'Unit, integration, end-to-end, and behavioral evaluation are selected for the actual failure risks. A passing test is not generalized beyond what it checks.',
  },
  {
    title: 'Reliability',
    description:
      'Failure handling, observability, recovery, deployment discipline, and operational ownership matter. Uptime or performance claims require measurements.',
  },
]

export default function EvidenceStandardsPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Approach"
          title="Engineering & Evidence Standards"
          description="Technical work is most useful when visitors can tell what exists, what was measured, what remains limited, and who owns the final judgment. These standards explain the labels used throughout this site."
          actions={[
            { label: 'View Case Studies', href: '/case-studies' },
            { label: 'View Research', href: '/research', variant: 'secondary' },
          ]}
        />

        <section>
          <SectionHeader
            align="left"
            title="Maturity labels"
            subtitle="Production, pilot, and R&D describe different kinds of evidence. None should be promoted into another category by implication."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {maturityLevels.map((level) => (
              <article key={level.label} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
                <Badge variant={level.label === 'Production' ? 'secondary' : 'outline'}>
                  {level.label}
                </Badge>
                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  {level.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              What counts as evidence
            </h2>
            <ol className="mt-5 space-y-3">
              {evidenceOrder.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-text-secondary">
                  <span className="font-mono text-xs font-semibold text-link-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              Limitations and claim boundaries
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Prototypes keep their prototype label until deployment and operating evidence
                justify a change. Missing screenshots, usage data, monitoring, or outcome
                measurements remain missing rather than being replaced with adjectives.
              </p>
              <p>
                Limitations, failure modes, data coverage, refusal behavior, and ownership
                boundaries are disclosed when they materially change how a result should be
                understood. Unsupported scale, accessibility, reliability, and business-impact
                claims are avoided.
              </p>
              <p>
                Architecture is described as a capability and responsibility. Historical job
                titles stay tied to the employers and records that established them.
              </p>
            </div>
          </article>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Research status and reproducibility"
            subtitle="Publication status is evidence too, so accepted work and formally published work are kept separate."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary">Published research</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                A work is presented as published only when a formal publication record supports
                that status. DOI, byline, affiliation, venue, and date are checked where available.
              </p>
            </article>
            <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary">Accepted research</h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Accepted work is labeled accepted until proceedings or another formal publication
                record is available. Acceptance is meaningful, but it is not described as publication.
              </p>
            </article>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {researchToSystemsPractices.map((practice) => (
              <article key={practice.title} className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-text-primary">{practice.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {practice.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="AI-assisted engineering and human review"
            subtitle="Assistance can accelerate the work, but it does not transfer engineering accountability."
          />
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <p className="max-w-4xl text-sm leading-7 text-text-secondary">
              AI tools may support research, planning, code generation, testing, documentation,
              or review. A human remains responsible for requirements, source verification,
              design decisions, code review, security and privacy judgment, test interpretation,
              deployment, and the claims made about the finished work. Generated output is treated
              as material to inspect, not evidence by itself.
            </p>
          </article>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Quality evidence"
            subtitle="Evidence is matched to the property being claimed and kept within the boundary of the recorded check."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {engineeringChecks.map((check) => (
              <article key={check.title} className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-text-primary">{check.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {check.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div>
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-link-primary hover:text-link-primary-hover">
            Ask about a specific claim or engagement
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

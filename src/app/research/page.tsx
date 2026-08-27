import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { SectionHeader } from '@/components/ui/section-header'
import {
  acceptedConferencePapers,
  conferenceAbstracts,
  peerReviewedPublications,
  professionalAffiliations,
  researchAreas,
  researchProfileLinks,
} from '@/data/research'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Research',
  description:
    'Artificial intelligence and systems research by David Braun, including information retrieval for low-resource-language archives and peer-reviewed space-physics work.',
  path: '/research',
})

export default function ResearchPage() {
  return (
    <div className="min-h-screen pb-12 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow="Research"
          title="Research across artificial intelligence, language, and physical systems."
          description="David Braun is an artificial intelligence researcher and systems engineer pursuing a Master of Science in Artificial Intelligence at the University of St. Thomas. His current work includes hybrid information retrieval for Urarina–Spanish archival material."
          actions={researchProfileLinks.map((profile, index) => ({
            label: profile.actionLabel,
            href: profile.url,
            external: true,
            variant: index === 0 ? 'primary' : 'secondary',
          }))}
        />

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <SectionHeader
              align="left"
              title="Research context"
              subtitle="Interdisciplinary work grounded in careful data processing, evaluation, and technically accurate system boundaries."
            />
          </div>
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              Current AI research
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Retrieval for low-resource-language archives
            </h3>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Current language research examines hybrid information-retrieval methods for
              Urarina–Spanish archival material, with work spanning information retrieval,
              natural language processing, multimodal AI, retrieval-augmented generation,
              and computational linguistics. The system supports retrieval and alignment
              research; it is not presented as full machine translation.
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-link-primary">
              Earlier scientific research
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              Magnetospheric physics and space weather
            </h3>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Earlier work involved processing satellite and ground-based magnetometer
              observations for studies of electromagnetic ion cyclotron wave events and
              space weather. That analysis contributed to conference research and a
              peer-reviewed paper in the Journal of Geophysical Research: Space Physics.
            </p>
          </article>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Research Areas"
            subtitle="Current and interdisciplinary areas represented across graduate AI and earlier space-physics work."
          />
          <div className="flex flex-wrap gap-2">
            {researchAreas.map((area) => (
              <Badge key={area} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Accepted Conference Paper"
            subtitle="Accepted research is listed separately from work that already has a formal publication record."
          />
          <div className="grid gap-5">
            {acceptedConferencePapers.map((paper) => (
              <article
                key={paper.id}
                className="rounded-[1.75rem] border border-primary-300/70 bg-background-elevated p-6 shadow-sm dark:border-primary-900"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary">{paper.status}</Badge>
                  <Badge variant="outline">{paper.year}</Badge>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                  {paper.title}
                </h3>
                <p className="mt-3 text-sm font-medium text-text-primary">{paper.authors}</p>
                <p className="mt-2 text-sm leading-7 text-text-secondary">
                  {paper.venue} · {paper.status}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {paper.areas.map((area) => (
                    <Badge key={area} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Peer-Reviewed Publications"
            subtitle="Published journal research with a verified DOI."
          />
          <div className="grid gap-5">
            {peerReviewedPublications.map((publication) => (
              <article
                key={publication.id}
                className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Peer-reviewed journal article</Badge>
                  <Badge variant="outline">{publication.year}</Badge>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                  {publication.title}
                </h3>
                <p className="mt-3 text-sm font-medium text-text-primary">
                  {publication.authors}
                </p>
                <p className="mt-2 text-sm leading-7 text-text-secondary">
                  <cite>{publication.journal}</cite>
                </p>
                <p className="mt-1 font-mono text-xs text-text-muted">
                  {publication.webOfScienceId}
                </p>
                <div className="mt-5">
                  <ExternalLinkAction href={publication.doiUrl}>
                    View DOI record
                  </ExternalLinkAction>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Conference Abstracts"
            subtitle="Meeting abstracts are kept distinct from peer-reviewed journal publications."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {conferenceAbstracts.map((abstract) => (
              <article
                key={abstract.id}
                className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-6 shadow-sm"
              >
                <Badge variant="outline">Conference abstract</Badge>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-text-primary">
                  {abstract.title}
                </h3>
                <p className="mt-3 text-sm font-medium text-text-primary">
                  {abstract.contributors}
                </p>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {abstract.venue} · {abstract.abstractNumber}
                </p>
                <p className="mt-1 text-sm text-text-muted">{abstract.date}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Professional Affiliations"
            subtitle="Memberships and professional activities, shown as secondary context for the research record."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {professionalAffiliations.map((affiliation) => (
              <article
                key={affiliation.id}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="min-w-0 flex-1 text-base font-semibold text-text-primary">
                    {affiliation.organization}
                  </h3>
                  <ExternalLinkAction
                    href={affiliation.url}
                    className="shrink-0"
                    iconOnly
                    ariaLabel={'Visit ' + affiliation.organization}
                  />
                </div>
                <p className="mt-2 text-sm text-text-secondary">{affiliation.role}</p>
                {affiliation.location ? (
                  <p className="mt-1 text-sm text-text-muted">{affiliation.location}</p>
                ) : null}
                {affiliation.startDate ? (
                  <p className="mt-1 text-sm text-text-muted">
                    {affiliation.startDate} to {affiliation.endDate}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

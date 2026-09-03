import type { Metadata } from 'next'
import { PageIntro } from '@/components/site/page-intro'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { SectionHeader } from '@/components/ui/section-header'
import { researchToSystemsPractices } from '@/data/career-story'
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
          description="Research informs how I evaluate evidence, retrieval quality, uncertainty, and system limits. Current work includes hybrid information retrieval for Urarina–Spanish archival material while I pursue a Master of Science in Artificial Intelligence at the University of St. Thomas."
          actions={researchProfileLinks.map((profile, index) => ({
            label: profile.actionLabel,
            href: profile.url,
            icon: profile.icon,
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
              At Augsburg University, I contributed to research on electromagnetic ion
              cyclotron (EMIC) waves and magnetospheric dynamics using observations from
              multiple spacecraft and ground-based instruments. The resulting collaborative
              2018 Journal of Geophysical Research: Space Physics study combined EMIC-wave
              observations with radiation-belt measurements from REPT and MagEIS aboard
              NASA&apos;s Van Allen Probes to examine relativistic and ultrarelativistic
              electron flux behavior. REPT and MagEIS are part of the study&apos;s scientific
              data context; this site does not claim that I developed those instruments or
              authored the earlier REPT instrument publication. Work with large-scale
              scientific data led through systems engineering to current AI and
              information-retrieval research.
            </p>
          </article>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="How research informs systems work"
            subtitle="Research is supporting evidence for disciplined system design, not a substitute for production proof."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {researchToSystemsPractices.map((practice) => (
              <article
                key={practice.title}
                className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  {practice.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {practice.description}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-text-secondary">
            The Urarina work is retrieval and alignment research over archival material.
            It is not presented as full machine translation, and accepted conference
            work remains listed separately from formally published research.
          </p>
        </section>

        <section>
          <SectionHeader
            align="left"
            title="Research Areas"
            subtitle="Areas represented across two distinct eras: current graduate AI research and earlier space-physics work."
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
            title="Peer-Reviewed Journal Article"
            subtitle="Published journal research with a DOI, byline, and affiliation verified against the publisher record."
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
                  Web of Science: {publication.webOfScienceId}
                </p>
                <div className="mt-5 rounded-2xl border border-border-subtle bg-background-subtle p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-link-primary">
                    Verified authored identity
                  </p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">
                    {publication.verifiedIdentity.bylineName}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    {publication.verifiedIdentity.affiliation}
                  </p>
                </div>
                <p className="mt-5 text-sm leading-7 text-text-secondary">
                  {publication.studyContext}
                </p>
                <div className="mt-5">
                  <ExternalLinkAction href={publication.doiUrl}>
                    View DOI record
                  </ExternalLinkAction>
                </div>
              </article>
            ))}
          </div>
          <aside
            aria-label="Author identity clarification"
            className="mt-5 rounded-[1.5rem] border border-primary-300/70 bg-primary-50/60 p-5 text-sm leading-7 text-text-secondary dark:border-primary-900 dark:bg-primary-950/30"
          >
            <span className="font-semibold text-text-primary">
              Author identity clarification:
            </span>{' '}
            David J. Braun of Augsburg University coauthored this 2018 EMIC study,
            which incorporated REPT observations. The D. Braun affiliated with the
            Laboratory for Atmospheric and Space Physics at the University of Colorado
            Boulder on the earlier REPT instrument publication is a different researcher.
            That 2013 article and its 2014 book-chapter version are not part of this
            publication record.
          </aside>
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

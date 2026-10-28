// Server/build adapter only. Client code imports types and the local ranker, never this module.
import { architectureSkillLayers, careerStoryStages } from '@/data/career-story'
import { certifications, education } from '@/data/education'
import { experiences } from '@/data/experience'
import { time2Move } from '@/data/past-client-work'
import { servicesOffered } from '@/data/profile'
import { acceptedConferencePapers, conferenceAbstracts, peerReviewedPublications, professionalAffiliations, researchAreas, researchProfileLinks } from '@/data/research'
import { resumeDocuments } from '@/data/resumes'
import { engagementOffers } from '@/data/services'
import { allSystems, type FeaturedSystemCaseStudy } from '@/data/systems'
import { urarinaResearch } from '@/data/urarina-research'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { extractReadableMdx } from './readable-mdx'
import { staticSearchPages } from './static-pages'
import type { SearchIndex, SearchRecord } from './types'

const text = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()

/** Explicit public fields only, including the limits rendered on the detail page. */
export function projectSearchRecord(system: FeaturedSystemCaseStudy): SearchRecord {
  const ladder = system.retrievalCapabilityLadder
  return {
    id: `project-${system.id}`,
    title: system.displayTitle ?? system.name,
    href: `/case-studies/${system.id}`,
    type: 'Project',
    description: system.summary,
    tags: [system.name, ...system.stack, system.contextLabel ?? system.caseStudyStage],
    headings: [system.solutionTitle ?? 'Solution / Implementation', ...system.proofSections.map(section => section.title)],
    body: text(
      system.oneSentenceOutcome, system.positioning, system.problem, system.system,
      system.myRole, system.coreConstraint, system.outcome, system.currentState,
      ...system.systemHighlights,
      ...(system.metrics ?? []).map(metric => text(metric.value, metric.label, metric.detail)),
      ...(system.architecture ?? []).map(step => text(step.label, step.detail)),
      ...(system.dataSources ?? []), ...(system.dashboardViews ?? []),
      ...(system.realWorldRelevance ?? []), ...(system.limitations ?? []), ...(system.nextImprovements ?? []),
      ...system.proofSections.map(section => text(section.summary, ...section.items)),
      ...(ladder ? [
        ladder.title, ladder.summary, ladder.intro, ladder.safeClaim, ladder.guardrail,
        ladder.heuristicNote, ladder.futureWork,
        ...ladder.interpretations.map(item => text(item.method, item.meaning)),
        ...ladder.levels.map(level => text(level.systemType, level.compares, level.meaningCaptured,
          level.questionUnderQuestionAbility, level.personalContextAbility, level.realWorldGrounding,
          level.bestUseCase, level.fatalWeakness)),
      ] : []),
    ),
  }
}

function researchRecords(): SearchRecord[] {
  const research = urarinaResearch
  const accepted = acceptedConferencePapers.find(paper => paper.href === research.path)
  return [
    {
      id: 'research-urarina', title: research.title, href: research.path, type: 'Research',
      description: research.subtitle,
      tags: [research.area, 'Urarina', ...(accepted?.areas ?? [])],
      headings: ['Research status', 'Publication note', 'Overview', 'Research context', 'Conference context', 'Research lineage', 'Research journey'],
      body: text(research.description, research.institution, research.researchers, research.status,
        research.acceptance, research.publicationNote, research.overview, research.context,
        research.conference.name, research.conference.location, research.conference.dates,
        research.conference.platformDescription, research.lineage.introduction,
        ...research.lineage.references.map(reference => text(reference.title, reference.authors, reference.year, reference.source, reference.description)),
        ...research.journey, accepted?.authors, accepted?.venue, accepted?.status),
    },
    ...acceptedConferencePapers.filter(paper => paper.href !== research.path).map((paper): SearchRecord => ({
      id: `research-${paper.id}`, title: paper.title,
      href: paper.href ?? `/research#research-${paper.id}`, type: 'Research',
      description: `${paper.venue} · ${paper.status}`, tags: paper.areas,
      headings: ['Accepted Conference Paper'], body: text(paper.authors, paper.year),
    })),
    ...peerReviewedPublications.map((publication): SearchRecord => ({
      id: `research-${publication.id}`, title: publication.title,
      href: `/research#research-${publication.id}`, type: 'Research',
      description: `${publication.journal} · ${publication.year}. ${publication.studyContext}`,
      tags: ['Peer-reviewed journal article'], headings: ['Author record'],
      body: text(publication.authors, publication.verifiedIdentity.bylineName,
        publication.verifiedIdentity.affiliation, publication.webOfScienceId),
    })),
    ...conferenceAbstracts.map((abstract): SearchRecord => ({
      id: `research-${abstract.id}`, title: abstract.title,
      href: `/research#research-${abstract.id}`, type: 'Research',
      description: `${abstract.venue} · ${abstract.abstractNumber} · ${abstract.date}`,
      tags: ['Conference abstract'], headings: [], body: abstract.contributors,
    })),
    ...professionalAffiliations.map((affiliation): SearchRecord => ({
      id: `research-${affiliation.id}`, title: affiliation.organization,
      href: `/research#research-${affiliation.id}`, type: 'Research',
      description: text(affiliation.role, affiliation.location), tags: [],
      headings: ['Professional Affiliations'], body: text(affiliation.startDate, affiliation.endDate),
    })),
    {
      id: 'research-areas', title: 'Research Areas', href: '/research#research-areas', type: 'Research',
      description: 'Areas represented across two distinct eras: current graduate AI research and earlier space-physics work.',
      tags: researchAreas, headings: [], body: researchAreas.join(' '),
    },
    {
      id: 'research-profiles', title: 'Research Profiles', href: '/research#research-profiles', type: 'Research',
      description: 'Persistent identifiers, citation indexes, and academic profiles associated with my research record.',
      tags: researchProfileLinks.map(link => link.name), headings: [],
      body: researchProfileLinks.map(link => text(link.name, link.description)).join(' '),
    },
  ]
}

export async function buildSearchIndex(): Promise<SearchIndex> {
  const articles = await Promise.all(getAllPosts().map(async (meta): Promise<SearchRecord> => {
    const post = getPostBySlug(meta.slug)
    if (!post) throw new Error(`Published article cannot be read: ${meta.slug}`)
    const readable = await extractReadableMdx(post.content)
    return {
      id: `article-${post.slug}`, title: post.title, href: `/writing/${post.slug}`, type: 'Article',
      description: post.description, tags: post.tags, headings: readable.headings, body: readable.body,
    }
  }))

  const records: SearchRecord[] = [
    ...staticSearchPages,
    ...allSystems.map(projectSearchRecord),
    ...researchRecords(),
    ...experiences.map((experience): SearchRecord => ({
      id: `experience-${experience.id}`, title: `${experience.role} · ${experience.company}`,
      href: `/experience#experience-${experience.id}`, type: 'Experience', description: experience.description,
      tags: experience.technologies ?? [], headings: [experience.company],
      body: text(experience.department, experience.location, experience.startDate, experience.endDate ?? 'Present', ...experience.highlights),
    })),
    ...education.map((item): SearchRecord => ({
      id: `education-${item.id}`, title: `${item.degree} in ${item.field}`,
      href: `/experience#education-${item.id}`, type: 'Education', description: text(item.institution, item.description),
      tags: [item.field], headings: item.secondaryCredential ? [item.secondaryCredential] : [],
      body: text(item.department, item.location, item.startDate, item.endDate ?? 'Present', item.inProgress ? 'In progress' : 'Completed',
        item.secondaryCredential, item.secondaryCredentialNote, item.secondaryCredentialStartDate, item.secondaryCredentialEndDate),
    })),
    ...certifications.map((item): SearchRecord => ({
      id: `certification-${item.id}`, title: item.name, href: `/experience#certification-${item.id}`, type: 'Education',
      description: `${item.issuer} · Issued ${item.issueDate}${item.expirationDate ? ` · Expires ${item.expirationDate}` : ''}`,
      tags: ['Certification'], headings: [], body: '',
    })),
    ...careerStoryStages.map((stage): SearchRecord => ({
      id: `career-${stage.id}`, title: stage.label, href: `/experience/career-story#career-${stage.id}`, type: 'Experience',
      description: stage.evidence, tags: [], headings: ['Career through-line'], body: stage.meaning,
    })),
    {
      id: 'system-skills', title: 'The system scope that emerged', href: '/experience/career-story#system-skills', type: 'Skills',
      description: 'The career path expanded from individual features and analyses into the connected layers required to operate a dependable system.',
      tags: architectureSkillLayers.map(layer => layer.title), headings: architectureSkillLayers.map(layer => layer.title),
      body: architectureSkillLayers.map(layer => layer.description).join(' '),
    },
    ...engagementOffers.map((offer): SearchRecord => ({
      id: `service-${offer.id}`, title: offer.title, href: `/services#service-${offer.id}`, type: 'Service',
      description: offer.description, tags: [], headings: [offer.itemsLabel],
      body: text(offer.planningRange, offer.duration, ...offer.items, 'note' in offer ? offer.note : undefined),
    })),
    {
      id: 'service-capabilities', title: 'Technical capabilities inside an engagement', href: '/services#capabilities', type: 'Service',
      description: 'The commercial engagement stays outcome-focused while the implementation can cross several technical layers.',
      tags: servicesOffered.map(service => service.title), headings: servicesOffered.map(service => service.title),
      body: servicesOffered.map(service => text(service.outcome, service.example)).join(' '),
    },
    ...resumeDocuments.map((document): SearchRecord => ({
      id: `resume-${document.id}`, title: document.title,
      href: document.href ?? document.requestHref, type: 'Résumé',
      description: document.description, tags: [document.kind], headings: [],
      body: text(document.audience, document.href ? document.viewLabel : `${document.kind} available upon request`),
    })),
    {
      id: time2Move.id, title: time2Move.title, href: '/case-studies#past-client-work', type: 'Past client work',
      description: time2Move.description, tags: ['Time2Move', 'Hombuzz'], headings: [time2Move.status],
      body: time2Move.linkLabel,
    },
    ...articles,
  ]
  const seen = new Set<string>()
  return { version: 1, records: records.filter(record => {
    if (seen.has(record.href)) return false
    seen.add(record.href)
    return true
  }) }
}

import type { FeaturedSystemCaseStudy, RetrievalCapabilityLadderLevel } from '@/data/systems'
import { assertUniqueDestinations, contentFingerprint, contentId, destinationAttributes, destinationHref, type ContentDestination } from './destinations'
import type { SearchRecord } from './types'

const text = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ')

/** A label plus its own content disambiguates repeated labels without array positions. */
export const projectBlockKey = (label: string, body: string) => `${label}-${contentFingerprint(body)}`

export const projectDefaults = {
  relevance: ['Workflow analysis', 'Operational software design', 'Prototype planning', 'System architecture review'],
  limitations: ['This page describes the current proof available for the project.', 'Additional screenshots, logs, or usage artifacts should be added before making stronger claims.'],
  improvements: ['Add stronger screenshots or walkthrough artifacts.', 'Document validation checks and edge cases more completely.', 'Tighten public write-up as the system matures.'],
}

export const retrievalLevelKey = (level: RetrievalCapabilityLadderLevel) => level.id ?? level.systemType

export const retrievalColumns: { key: Exclude<keyof RetrievalCapabilityLadderLevel, 'id'>; label: string }[] = [
  { key: 'level', label: 'Level' },
  { key: 'systemType', label: 'System type' },
  { key: 'compares', label: 'What it compares' },
  { key: 'meaningCaptured', label: 'Meaning captured' },
  { key: 'questionUnderQuestionAbility', label: 'Question under the question ability' },
  { key: 'personalContextAbility', label: 'Personal context ability' },
  { key: 'realWorldGrounding', label: 'Real-world grounding' },
  { key: 'bestUseCase', label: 'Best use case' },
  { key: 'fatalWeakness', label: 'Fatal weakness' },
]

export function projectProofLinkCopy(system: FeaturedSystemCaseStudy) {
  if (system.githubUrl && system.externalUrl) return {
    title: 'Public Repository and Live Proof',
    description: 'This case study has both a public code surface and a live external proof surface.',
  }
  if (system.githubUrl) return {
    title: 'Public Repository',
    description: 'The public code link is provided for review of the prototype and technical approach. This does not represent paid deployment, production adoption, or client ROI unless stated elsewhere on the page.',
  }
  return {
    title: 'Live Proof',
    description: 'This system has a live public surface, which matters because delivery only counts when the software is actually in use.',
  }
}

function createProjectRegistry(system: FeaturedSystemCaseStudy) {
  const page = `/case-studies/${system.id}`
  const parent = system.displayTitle ?? system.name
  const breadcrumb = (...labels: string[]) => [parent, ...labels].filter(Boolean).filter((label, index, all) => all.indexOf(label) === index).join(' → ')
  const records: SearchRecord[] = []
  const byAnchor = new Map<string, ContentDestination>()
  const register = (keys: string[], label: string, disclosureIds: string[] = [], fallbackAnchor?: string) => {
    const destination = { page, anchor: contentId(...keys), label, disclosureIds, ...(fallbackAnchor ? { fallbackAnchor } : {}) }
    if (byAnchor.has(destination.anchor)) throw new Error(`Duplicate project anchor: ${page}#${destination.anchor}`)
    byAnchor.set(destination.anchor, destination)
    return destination
  }
  const add = (keys: string[], title: string, body = '', context = '', granularity: SearchRecord['granularity'] = 'block', disclosureIds: string[] = []) => {
    const destination = register(keys, breadcrumb(context, title), disclosureIds, disclosureIds.at(-1))
    const record: SearchRecord = {
      id: `project-${system.id}-${destination.anchor}`, title, href: destinationHref(destination),
      type: 'Project', description: body, body, tags: [], headings: [],
      context: text(parent, context), granularity, destination,
    }
    records.push(record)
    return record
  }
  const section = (key: string, title: string, body = '') => add([key], title, body, '', 'section')

  return { page, records, byAnchor, register, add, section, breadcrumb }
}

type ProjectRegistry = ReturnType<typeof createProjectRegistry>

function registerStoryContent(story: NonNullable<FeaturedSystemCaseStudy['story']>, registry: ProjectRegistry) {
  story.sections.forEach(block => {
    registry.section(block.id, block.title, text(...block.paragraphs, ...(block.items ?? []).map(item => `${item.label}: ${item.description}`), block.closing))
  })
}

function registerRetrievalContent(ladder: NonNullable<FeaturedSystemCaseStudy['retrievalCapabilityLadder']>, registry: ProjectRegistry) {
  const { add, register, breadcrumb } = registry
  const disclosure = contentId('retrieval-ladder')
  add(['retrieval-ladder'], ladder.title, ladder.summary, '', 'section', [disclosure])
  const ladderBlock = (key: string, label: string, body: string) => add(['retrieval', key], label, body, ladder.title, 'block', [disclosure])
  ladderBlock('overview', 'Retrieval roadmap', ladder.intro)
  ladderBlock('safe-claim', 'Retrieval capability scope', ladder.safeClaim)
  ladderBlock('guardrail', 'Intent-modeling boundary', ladder.guardrail)
  ladderBlock('heuristic-note', 'Heuristic gauges', ladder.heuristicNote)
  ladderBlock('future-work', 'Practical future work', ladder.futureWork)
  ladder.levels.forEach(level => {
    const keys = ['retrieval-level', retrievalLevelKey(level)]
    const row = add(keys, level.systemType, retrievalColumns.filter(column => column.key !== 'systemType').map(column => `${column.label}: ${level[column.key]}`).join('. '), ladder.title, 'row', [disclosure])
    row.cells = retrievalColumns.filter(column => column.key !== 'systemType').map(column => ({
      text: `${column.label}: ${level[column.key]}`,
      destination: register([...keys, column.key], breadcrumb(ladder.title, level.systemType, column.label), [disclosure], row.destination!.anchor),
    }))
  })
  add(['retrieval-interpretations'], 'Clean interpretation', '', ladder.title, 'section', [disclosure])
  ladder.interpretations.forEach(item => {
    const keys = ['retrieval-interpretation', projectBlockKey(item.method, item.meaning)]
    const row = add(keys, item.method, item.meaning, `${ladder.title} / Clean interpretation`, 'row', [disclosure])
    row.cells = [{ text: item.meaning, destination: register([...keys, 'meaning'], breadcrumb(ladder.title, 'Clean interpretation', item.method, 'What it really knows'), [disclosure], row.destination!.anchor) }]
  })
}

function registerStandardContent(system: FeaturedSystemCaseStudy, registry: ProjectRegistry) {
  const { add, section } = registry
  add(['problem'], 'Problem', system.problem)
  add(['constraint'], 'Core Constraint', system.coreConstraint)
  add(['solution'], system.solutionTitle ?? 'Solution / What I Built', system.system)
  add(['results'], 'Results', system.outcome)
  if (system.metrics?.length) {
    section('metrics', 'Quantified Outcomes', 'These numbers describe project artifacts and sanity checks. They are not client ROI, deployment adoption, actuarial accuracy, or broad model-accuracy claims.')
    system.metrics.forEach(metric => add(['metric', projectBlockKey(metric.label, text(metric.value, metric.detail))], metric.label, text(metric.value, metric.detail), 'Quantified Outcomes'))
  }
  section('architecture', 'Architecture', 'The pipeline is shown as explicit stages so the system boundary is inspectable.')
  if (system.architecture?.length) {
    system.architecture.forEach(step => add(['architecture-step', projectBlockKey(step.label, step.detail)], step.label, step.detail, 'Architecture'))
  } else {
    add(['architecture-pieces'], 'Key system pieces', system.systemHighlights.join(' '), 'Architecture')
  }
  section('technical-stack', 'Technical Stack', system.stack.join(' '))
  if (system.dataSources?.length) add(['data-sources'], 'Data sources', system.dataSources.join(' '), 'Technical Stack')
  section('relevance', 'Applied Relevance', text('Where the pattern matters', ...(system.realWorldRelevance ?? projectDefaults.relevance)))
  if (system.dashboardViews?.length) {
    section('dashboard-views', 'Dashboard Views', 'WeatherForge is organized as a decision-support dashboard rather than a single chart export.')
    system.dashboardViews.forEach(view => add(['dashboard', view], view, '', 'Dashboard Views'))
  }
  section('proof', 'Proof Surfaces', 'Available artifacts are labeled directly. Missing visuals stay as placeholders until real screenshots are added.')
  system.proofSections.forEach(proof => add(['proof', proof.id], proof.status === 'planned' ? `${proof.title} (to be added)` : proof.title, text(proof.status === 'available' ? 'Available now' : 'In progress', proof.summary, ...proof.items), 'Proof Surfaces'))
  section('limitations', 'Limitations', text('What this does not claim', ...(system.limitations ?? projectDefaults.limitations)))
  section('improvements', 'Next Improvements', text('Reasonable next steps', ...(system.nextImprovements ?? projectDefaults.improvements)))

  if (system.retrievalCapabilityLadder) registerRetrievalContent(system.retrievalCapabilityLadder, registry)
  if (system.githubUrl || system.externalUrl) {
    const copy = projectProofLinkCopy(system)
    section('proof-links', copy.title, text(copy.description, system.githubUrl ? 'View GitHub Repository' : undefined, system.externalUrl ? 'Visit Live Site' : undefined))
  }
}

export function createProjectContent(system: FeaturedSystemCaseStudy) {
  const registry = createProjectRegistry(system)
  const { page, records, byAnchor, section } = registry
  const story = system.story
  section('at-a-glance', 'At a glance', story
    ? text('Status', system.currentState, ...story.atAGlance.map(item => text(item.label, item.value)))
    : text('Context', system.contextLabel ?? system.caseStudyStage, 'Current state', system.currentState, 'Role', system.myRole))
  if (story) registerStoryContent(story, registry)
  else registerStandardContent(system, registry)
  if (system.successorLink) section('continuation', system.successorLink.label)
  const destinations = [...byAnchor.values()]
  assertUniqueDestinations(destinations)
  const get = (...keys: string[]) => {
    const result = byAnchor.get(contentId(...keys))
    if (!result) throw new Error(`Missing project destination: ${page}#${contentId(...keys)}`)
    return result
  }
  return { page, records, destinations, get, attrs: (...keys: string[]) => destinationAttributes(get(...keys)) }
}

export type ProjectContent = ReturnType<typeof createProjectContent>

export function projectContentRecords(system: FeaturedSystemCaseStudy): SearchRecord[] {
  return createProjectContent(system).records
}

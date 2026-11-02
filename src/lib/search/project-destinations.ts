import type { FeaturedSystemCaseStudy, RetrievalComparisonMethod } from '@/data/systems'
import { assertUniqueDestinations, contentFingerprint, contentId, destinationAttributes, destinationHref, type ContentDestination } from './destinations'
import type { SearchRecord } from './types'
import { time2MoveExtras } from '@/data/time2move-extras'
import { time2moveArchitectureText, time2moveReviewPipelineText } from '@/data/time2move-architecture'
import { aiLessonCopy } from '@/lib/time2move-ai-lesson'

const text = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ')

/** A label plus its own content disambiguates repeated labels without array positions. */
export const projectBlockKey = (label: string, body: string) => `${label}-${contentFingerprint(body)}`

export const projectDefaults = {
  relevance: ['Workflow analysis', 'Operational software design', 'Prototype planning', 'System architecture review'],
}

export const publishedProofSections = (system: FeaturedSystemCaseStudy) => system.proofSections.filter(section => section.status === 'available')

export const retrievalMethodKey = (method: RetrievalComparisonMethod) => method.id ?? method.systemType

// Preserve the semantic cell keys used by published search links.
export const retrievalColumns: { key: Exclude<keyof RetrievalComparisonMethod, 'id'>; label: string }[] = [
  { key: 'systemType', label: 'Method' },
  { key: 'compares', label: 'Mechanism' },
  { key: 'bestUseCase', label: 'Useful when' },
  { key: 'fatalWeakness', label: 'Limitation' },
]

export function projectProofLinkCopy(system: FeaturedSystemCaseStudy) {
  if (system.githubUrl && system.externalUrl) return {
    title: 'Public Repository and Live Proof',
    description: 'Inspect the public implementation or visit the running website.',
  }
  if (system.githubUrl) return {
    title: 'Public Repository',
    description: 'Inspect the source, setup instructions, and project documentation.',
  }
  return {
    title: 'Live Proof',
    description: 'Visit the public website to review the delivered experience.',
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
    registry.section(block.id, block.title, text(...block.paragraphs, ...(block.items ?? []), block.closing, block.figure?.caption))
  })
}

function registerTime2MoveExtras(registry: ProjectRegistry) {
  const { overview, reviews, lesson } = time2MoveExtras
  registry.section(overview.id, overview.title, text(overview.caption, time2moveArchitectureText))
  registry.add([reviews.id], reviews.title, text(reviews.summary, time2moveReviewPipelineText), overview.title, 'section', [contentId(reviews.id)])
  registry.add([lesson.id], lesson.title, text(lesson.summary, aiLessonCopy.badge, aiLessonCopy.disclaimer,
    aiLessonCopy.boundary, ...aiLessonCopy.sequence, aiLessonCopy.evidence, aiLessonCopy.review,
    aiLessonCopy.trustedFields, aiLessonCopy.evaluation), '', 'section', [contentId(lesson.id)])
}

function registerRetrievalContent(comparison: NonNullable<FeaturedSystemCaseStudy['retrievalComparison']>, registry: ProjectRegistry) {
  const { add, register, breadcrumb } = registry
  // The historical section and row keys remain valid URLs after the editorial change.
  const disclosure = contentId('retrieval-ladder')
  add(['retrieval-ladder'], comparison.title, comparison.summary, '', 'section', [disclosure])
  add(['retrieval', 'overview'], 'Comparison scope', comparison.intro, comparison.title, 'block', [disclosure])
  add(['retrieval', 'future-work'], 'Evaluation direction', comparison.futureWork, comparison.title, 'block', [disclosure])
  // Removed scores and interpretation rows fall back to a visible comparison group.
  for (const key of ['retrieval', 'retrieval-level', 'retrieval-interpretation', 'retrieval-interpretations']) {
    register([key], breadcrumb(comparison.title), [disclosure], disclosure)
  }
  comparison.methods.forEach(method => {
    const keys = ['retrieval-level', retrievalMethodKey(method)]
    const row = add(keys, method.systemType, retrievalColumns.filter(column => column.key !== 'systemType').map(column => `${column.label}: ${method[column.key]}`).join('. '), comparison.title, 'row', [disclosure])
    row.cells = retrievalColumns.filter(column => column.key !== 'systemType').map(column => ({
      text: `${column.label}: ${method[column.key]}`,
      destination: register([...keys, column.key], breadcrumb(comparison.title, method.systemType, column.label), [disclosure], row.destination!.anchor),
    }))
  })
}

function registerStandardContent(system: FeaturedSystemCaseStudy, registry: ProjectRegistry) {
  const { add, section } = registry
  add(['problem'], 'Problem', system.problem)
  add(['constraint'], 'Core Constraint', system.coreConstraint)
  add(['solution'], system.solutionTitle ?? 'Solution / What I Built', system.system)
  add(['results'], 'Results', system.outcome)
  if (system.metrics?.length) {
    section('metrics', 'Project data and checks', 'Dataset sizes and recorded checks within this project’s stated scope.')
    system.metrics.forEach(metric => add(['metric', projectBlockKey(metric.label, text(metric.value, metric.detail))], metric.label, text(metric.value, metric.detail), 'Project data and checks'))
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
  const proof = publishedProofSections(system)
  if (proof.length) {
    section('proof', 'Implementation and evidence', 'Implementation details and the artifacts available for review.')
    proof.forEach(item => add(['proof', item.id], item.title, text(item.summary, ...item.items, ...(item.links ?? []).map(link => link.label)), 'Implementation and evidence'))
  }
  if (system.limitations?.length) section('limitations', 'Scope and limitations', text(...system.limitations))
  if (system.nextImprovements?.length) section('improvements', 'Further technical work', text(...system.nextImprovements))

  if (system.retrievalComparison) registerRetrievalContent(system.retrievalComparison, registry)
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
  if (system.id === 'time2move') registerTime2MoveExtras(registry)
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

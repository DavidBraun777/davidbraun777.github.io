import type { SearchRecord, SearchResult } from './types'
import { destinationHref } from './destinations'

export const SEARCH_QUERY_LIMIT = 160

export function normalizeSearchText(text: string): string {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Preserve technology names such as .NET, C++, C#, and Next.js as whole terms. */
export function searchWords(text: string): string[] {
  return normalizeSearchText(text).match(/\.[\p{L}\p{N}]+|[\p{L}\p{N}]+(?:[.#][\p{L}\p{N}]+)*(?:\+\+|#)?/gu) ?? []
}

interface SearchField {
  words: string[]
  exactWeight: number
  prefixWeight: number
}

interface PreparedRecord {
  record: SearchRecord
  title: string[]
  fields: SearchField[]
  context: SearchField
  cells: { cell: NonNullable<SearchRecord['cells']>[number]; field: SearchField }[]
}

const preparedIndexes = new WeakMap<readonly SearchRecord[], PreparedRecord[]>()

function prepare(records: readonly SearchRecord[]) {
  let prepared = preparedIndexes.get(records)
  if (!prepared) {
    prepared = records.map((record) => {
      const title = searchWords(record.title)
      return {
        record,
        title,
        fields: [
          { words: title, exactWeight: 30, prefixWeight: 22 },
          { words: searchWords(record.tags.join(' ')), exactWeight: 14, prefixWeight: 9 },
          { words: searchWords(record.headings.join(' ')), exactWeight: 12, prefixWeight: 8 },
          { words: searchWords(record.description), exactWeight: 8, prefixWeight: 5 },
          { words: searchWords(record.body), exactWeight: 3, prefixWeight: 2 },
        ],
        context: { words: searchWords(record.context ?? ''), exactWeight: 0.5, prefixWeight: 0.25 },
        cells: (record.cells ?? []).map(cell => ({
          cell, field: { words: searchWords(cell.text), exactWeight: 2, prefixWeight: 1 },
        })),
      }
    })
    preparedIndexes.set(records, prepared)
  }
  return prepared
}

function includesPhrase(words: string[], phrase: string[]): boolean {
  return words.some((_, start) => phrase.every((word, offset) => words[start + offset] === word))
}

function isPrefix(word: string, query: string): boolean {
  // Two-letter queries must match a whole term: AI should not match "maintain".
  return query.length >= 3 && word.startsWith(query)
}

function fieldWeight(field: SearchField, term: string): number {
  if (field.words.includes(term)) return field.exactWeight
  // ML is a conventional abbreviation for the publicly stated topic.
  if (term === 'ml' && includesPhrase(field.words, ['machine', 'learning'])) return field.exactWeight
  if (field.words.some((word) => isPrefix(word, term))) return field.prefixWeight
  return 0
}

function snippetMatchPosition(source: string, queryWords: string[]): number {
  const normalized = normalizeSearchText(source)
  const phrasePosition = normalized.indexOf(queryWords.join(' '))
  if (phrasePosition >= 0) return phrasePosition
  const termPositions = queryWords.map((term) => normalized.indexOf(term)).filter((position) => position >= 0)
  return termPositions.length ? Math.min(...termPositions) : 0
}

function contextualSnippet(record: SearchRecord, queryWords: string[]): string {
  const descriptionMatches = queryWords.every((term) => fieldWeight({
    words: searchWords(record.description), exactWeight: 1, prefixWeight: 1,
  }, term) > 0)
  const source = (descriptionMatches || !record.body ? record.description : record.body).replace(/\s+/g, ' ').trim()
  if (source.length <= 190) return source
  const matchPosition = snippetMatchPosition(source, queryWords)
  let start = Math.max(0, matchPosition - 60)
  if (start > 0) {
    const nextSpace = source.indexOf(' ', start)
    if (nextSpace >= 0 && nextSpace < matchPosition) start = nextSpace + 1
  }
  let end = Math.min(source.length, start + 190)
  if (end < source.length) end = source.lastIndexOf(' ', end)
  return `${start > 0 ? '…' : ''}${source.slice(start, end)}${end < source.length ? '…' : ''}`
}

function qualifyMatch({ fields, context }: PreparedRecord, terms: string[]) {
  const localWeights = terms.map((term) => Math.max(...fields.map((field) => fieldWeight(field, term))))
  // A parent name can qualify a local match, but cannot make every child a hit.
  if (!localWeights.some(weight => weight > 0)) return null
  const weights = terms.map((term, index) => localWeights[index] || fieldWeight(context, term))
  if (weights.includes(0)) return null
  // Context must qualify a distinct local term, not promote a paragraph merely
  // saying "For example" because "for" also occurs in its article title.
  if (localWeights.includes(0)
    && !terms.some((term, index) => localWeights[index] > 0 && fieldWeight(context, term) === 0)) return null
  return { weights, localTerms: terms.filter((_, index) => localWeights[index] > 0) }
}

function applyTitleBonus(score: number, title: string[], localPhrase: string[], localTerms: string[]): number {
  if (title.join(' ') === localPhrase.join(' ')) score += 10_000
  else if (includesPhrase(title, localPhrase)) {
    score += 5_000
    // A leading title phrase is usually the named destination the visitor wants.
    if (localPhrase.every((word, index) => title[index] === word)) score += 100
  }
  else if (localTerms.every((term) => title.includes(term))) score += 1_500
  else if (localTerms.every((term) => title.some((word) => word === term || isPrefix(word, term)))) score += 1_000
  return score
}

function selectCell(cells: PreparedRecord['cells'], terms: string[]) {
  let selected: (typeof cells)[number] | undefined
  let cellScore = 0
  for (const cell of cells) {
    const candidateScore = terms.reduce((sum, term) => sum + fieldWeight(cell.field, term), 0)
    if (candidateScore > cellScore) {
      selected = cell
      cellScore = candidateScore
    }
  }
  return selected
}

interface RankedMatch extends SearchResult {
  page: string
  bodyOnly: boolean
}

function rankMatch(prepared: PreparedRecord, queryWords: string[], terms: string[]): RankedMatch | null {
  const qualification = qualifyMatch(prepared, terms)
  if (!qualification) return null
  const { record, title, fields, cells } = prepared
  const { weights, localTerms } = qualification
  const localPhrase = queryWords.filter(term => localTerms.includes(term))
  let score = applyTitleBonus(weights.reduce((sum, weight) => sum + weight, 0) / terms.length, title, localPhrase, localTerms)
  // Prefer the comparison row over a shorter interpretation with the same label.
  if (record.granularity === 'row' && cells.length > 1) score += 0.1

  // A row-label query stays on its header. Additional cell text chooses the
  // most specific target without mutating the cached record for later queries.
  const cellTerms = localTerms.filter(term => fieldWeight(fields[0], term) === 0)
  const selected = selectCell(cells, cellTerms)
  const resultRecord = selected
    ? { ...record, href: destinationHref(selected.cell.destination), destination: selected.cell.destination }
    : record
  return {
    record: resultRecord, score,
    snippet: selected ? contextualSnippet({ ...record, description: selected.cell.text, body: selected.cell.text }, cellTerms) : contextualSnippet(record, localTerms),
    page: record.destination?.page ?? record.href.split('#')[0],
    bodyOnly: !terms.some(term => fields.slice(0, -1).some(field => fieldWeight(field, term) > 0)),
  }
}

function filterRankedMatches(matches: RankedMatch[]): SearchResult[] {
  matches.sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title, 'en') || a.record.id.localeCompare(b.record.id, 'en'))
  const precisePages = new Set(matches.filter(match => match.record.granularity).map(match => match.page))
  const destinations = new Set<string>()
  const perPage = new Map<string, number>()
  return matches.filter(({ record, page, bodyOnly }) => {
    if (destinations.has(record.href)) return false
    if (!record.granularity && bodyOnly && precisePages.has(page)) return false
    if (record.granularity) {
      const count = perPage.get(page) ?? 0
      if (count >= 3) return false
      perPage.set(page, count + 1)
    }
    destinations.add(record.href)
    return true
  }).map(({ record, score, snippet }) => ({ record, score, snippet }))
}

/**
 * Require every query term, then rank exact titles, title phrases, title words,
 * metadata, and body text. Repeated mentions do not inflate a document's score.
 * No typo guessing or broad substring matching: short technology names stay useful.
 */
export function searchContent(records: readonly SearchRecord[], query: string): SearchResult[] {
  const queryWords = searchWords(query.slice(0, SEARCH_QUERY_LIMIT))
  const terms = [...new Set(queryWords)]
  if (terms.length === 0) return []
  const matches: RankedMatch[] = []
  for (const prepared of prepare(records)) {
    const match = rankMatch(prepared, queryWords, terms)
    if (match) matches.push(match)
  }
  return filterRankedMatches(matches)
}

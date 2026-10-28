import type { SearchRecord, SearchResult } from './types'

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

function contextualSnippet(record: SearchRecord, queryWords: string[]): string {
  const descriptionMatches = queryWords.every((term) => fieldWeight({
    words: searchWords(record.description), exactWeight: 1, prefixWeight: 1,
  }, term) > 0)
  const source = (descriptionMatches || !record.body ? record.description : record.body).replace(/\s+/g, ' ').trim()
  if (source.length <= 190) return source
  const normalized = normalizeSearchText(source)
  const phrasePosition = normalized.indexOf(queryWords.join(' '))
  const termPositions = queryWords.map((term) => normalized.indexOf(term)).filter((position) => position >= 0)
  const matchPosition = phrasePosition >= 0 ? phrasePosition : termPositions.length ? Math.min(...termPositions) : 0
  let start = Math.max(0, matchPosition - 60)
  if (start > 0) {
    const nextSpace = source.indexOf(' ', start)
    if (nextSpace >= 0 && nextSpace < matchPosition) start = nextSpace + 1
  }
  let end = Math.min(source.length, start + 190)
  if (end < source.length) end = source.lastIndexOf(' ', end)
  return `${start > 0 ? '…' : ''}${source.slice(start, end)}${end < source.length ? '…' : ''}`
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

  const matches: SearchResult[] = []
  for (const { record, title, fields } of prepare(records)) {
    const weights = terms.map((term) => Math.max(...fields.map((field) => fieldWeight(field, term))))
    if (weights.some((weight) => weight === 0)) continue

    let score = weights.reduce((sum, weight) => sum + weight, 0) / terms.length
    if (title.join(' ') === queryWords.join(' ')) score += 10_000
    else if (includesPhrase(title, queryWords)) {
      score += 5_000
      // A leading title phrase is usually the named destination the visitor wants.
      if (queryWords.every((word, index) => title[index] === word)) score += 100
    }
    else if (terms.every((term) => title.includes(term))) score += 1_500
    else if (terms.every((term) => title.some((word) => word === term || isPrefix(word, term)))) score += 1_000

    matches.push({ record, score, snippet: contextualSnippet(record, terms) })
  }

  matches.sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title, 'en') || a.record.id.localeCompare(b.record.id, 'en'))
  const destinations = new Set<string>()
  return matches.filter(({ record }) => {
    if (destinations.has(record.href)) return false
    destinations.add(record.href)
    return true
  })
}

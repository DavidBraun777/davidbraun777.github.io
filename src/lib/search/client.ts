import type { SearchIndex, SearchRecord } from './types'

let pendingIndex: Promise<SearchRecord[]> | null = null

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isSearchIndex(value: unknown): value is SearchIndex {
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1) {
    return false
  }
  if (!('records' in value) || !Array.isArray(value.records)) return false

  return value.records.every((record: unknown) => {
    if (!record || typeof record !== 'object') return false
    const fields = record as Record<string, unknown>
    return ['id', 'title', 'type', 'description', 'body'].every(
      (key) => typeof fields[key] === 'string'
    ) && typeof fields.href === 'string'
      && fields.href.startsWith('/')
      && !fields.href.startsWith('//')
      && !Array.from(fields.href).some((character) => character === '\\' || character.charCodeAt(0) < 32)
      && isStringList(fields.tags)
      && isStringList(fields.headings)
  })
}

/** One local request per browser session. A failed request can always be retried. */
export function loadSearchIndex(): Promise<SearchRecord[]> {
  if (!pendingIndex) {
    pendingIndex = (async () => {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 10_000)
      try {
        const response = await fetch('/search-index.json', {
          headers: { Accept: 'application/json' },
          cache: 'no-cache',
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Search index unavailable')
        const index: unknown = await response.json()
        if (!isSearchIndex(index)) throw new Error('Invalid search index')
        return index.records
      } finally {
        window.clearTimeout(timeout)
      }
    })().catch((error: unknown) => {
      pendingIndex = null
      throw error
    })
  }

  return pendingIndex
}

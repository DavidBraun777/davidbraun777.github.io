import type { SearchIndex, SearchRecord } from './types'
import { destinationHref, type ContentDestination } from './destinations'

let pendingIndex: Promise<SearchRecord[]> | null = null

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isLocalHref(value: unknown): value is string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return false
  try {
    const decoded = decodeURIComponent(value)
    return !decoded.startsWith('//') && !Array.from(decoded).some(character => character === '\\' || character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
  } catch {
    return false
  }
}

const isAnchor = (value: unknown): value is string => typeof value === 'string' && /^[a-zA-Z][\w-]*$/.test(value)

function isCanonicalPage(value: unknown): value is string {
  if (!isLocalHref(value) || /[?#]/.test(value)) return false
  const decoded = decodeURIComponent(value)
  if (decoded.split('/').some(segment => segment === '.' || segment === '..')) return false
  // Navigation compares pathname with the declared page. Reject paths that the
  // browser would normalize elsewhere, while preserving safe percent encoding.
  return new URL(value, 'https://search.invalid').pathname === value
}

function isDestination(value: unknown): value is ContentDestination {
  if (!value || typeof value !== 'object') return false
  const destination = value as Record<string, unknown>
  return isCanonicalPage(destination.page)
    && isAnchor(destination.anchor)
    && typeof destination.label === 'string' && destination.label.trim().length > 0
    && Array.isArray(destination.disclosureIds) && destination.disclosureIds.every(isAnchor)
    && (destination.fallbackAnchor === undefined || isAnchor(destination.fallbackAnchor))
}

export function isSearchIndex(value: unknown): value is SearchIndex {
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1) {
    return false
  }
  if (!('records' in value) || !Array.isArray(value.records)) return false

  return value.records.every((record: unknown) => {
    if (!record || typeof record !== 'object') return false
    const fields = record as Record<string, unknown>
    return ['id', 'title', 'type', 'description', 'body'].every(
      (key) => typeof fields[key] === 'string'
    ) && isLocalHref(fields.href)
      && isStringList(fields.tags)
      && isStringList(fields.headings)
      && (fields.context === undefined || typeof fields.context === 'string')
      && (fields.destination === undefined || (isDestination(fields.destination) && fields.href === destinationHref(fields.destination)))
      && (fields.granularity === undefined || (typeof fields.granularity === 'string' && ['section', 'block', 'row'].includes(fields.granularity) && isDestination(fields.destination)))
      && (fields.cells === undefined || (isDestination(fields.destination) && Array.isArray(fields.cells) && fields.cells.every((cell: unknown) => {
        if (!cell || typeof cell !== 'object') return false
        const item = cell as Record<string, unknown>
        return typeof item.text === 'string' && isDestination(item.destination)
          && item.destination.page === (fields.destination as ContentDestination).page
      })))
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

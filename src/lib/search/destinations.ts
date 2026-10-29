/** Shared by public-content adapters, server rendering and fragment navigation. */
export interface ContentDestination {
  page: string
  anchor: string
  label: string
  disclosureIds: string[]
  fallbackAnchor?: string
}

/** Semantic keys are scoped by their containing section/table, never array positions. */
export function contentId(...keys: string[]): string {
  return `content-${keys.map(key => key.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).join('--')}`
}

/** Text-addressed blocks retain their identity when unrelated content is inserted. */
export function contentFingerprint(text: string): string {
  let hash = 2166136261
  for (const character of text.normalize('NFKC').replace(/\s+/g, ' ').trim()) {
    hash = Math.imul(hash ^ character.codePointAt(0)!, 16777619)
  }
  return (hash >>> 0).toString(36)
}

export function destinationHref(destination: ContentDestination): string {
  return `${destination.page}#${destination.anchor}`
}

export function assertUniqueDestinations(destinations: readonly ContentDestination[]): void {
  const seen = new Set<string>()
  for (const destination of destinations) {
    if (!/^[a-zA-Z][\w-]*$/.test(destination.anchor)) throw new Error(`Invalid content anchor: ${destination.anchor}`)
    const href = destinationHref(destination)
    if (seen.has(href)) throw new Error(`Duplicate content destination: ${href}; supply a distinct semantic key.`)
    seen.add(href)
  }
}

export function destinationAttributes(destination: ContentDestination) {
  return { id: destination.anchor, tabIndex: -1, 'data-content-target': '', 'data-content-label': destination.label }
}

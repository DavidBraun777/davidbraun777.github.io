export type SearchContentType =
  | 'Page'
  | 'Project'
  | 'Research'
  | 'Experience'
  | 'Education'
  | 'Skills'
  | 'Service'
  | 'Article'
  | 'Résumé'
  | 'Past client work'

/** Only selected, already-public text and canonical destinations cross this boundary. */
export interface SearchRecord {
  id: string
  title: string
  href: string
  type: SearchContentType
  description: string
  tags: string[]
  headings: string[]
  body: string
}

export interface SearchIndex {
  version: 1
  records: SearchRecord[]
}

export interface SearchResult {
  record: SearchRecord
  score: number
  snippet: string
}

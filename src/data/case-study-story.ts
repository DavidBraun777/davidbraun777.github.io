export interface CaseStudyStoryBlock {
  title: string
  paragraphs: string[]
}

export interface CaseStudySuccessorLink {
  href: string
  label: string
  context: string
}

/** Optional long-form delivery narrative within the shared case-study registry. */
export interface CaseStudyStory {
  scopeNote: string
  overview: string[]
  atAGlance: { label: string; value: string }[]
  capabilities: CaseStudyStoryBlock[]
  decision: string[]
  stoppingPoint: string[]
  reflection: string[]
  technicalDetails: CaseStudyStoryBlock[]
  audit: {
    date: string
    snapshot: string
    checks: { label: string; result: 'Passed' | 'Failed' | 'Observed'; detail: string }[]
    limitations: string[]
    lesson: string
  }
  illustration?: {
    src: string
    alt: string
    width: number
    height: number
    caption: string
  }
}

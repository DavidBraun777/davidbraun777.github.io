export interface CaseStudyStoryBlock {
  id: string
  title: string
  paragraphs: string[]
  items?: string[]
  closing?: string
}

export interface CaseStudySuccessorLink {
  href: string
  label: string
  context: string
}

/** Optional concise project narrative within the shared case-study registry. */
export interface CaseStudyStory {
  atAGlance: { label: string; value: string }[]
  sections: CaseStudyStoryBlock[]
}

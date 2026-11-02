export interface CaseStudyFigure {
  src: string
  alt: string
  width: number
  height: number
  caption: string
}

export interface CaseStudyStoryBlock {
  id: string
  title: string
  paragraphs: string[]
  items?: string[]
  closing?: string
  figure?: CaseStudyFigure
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

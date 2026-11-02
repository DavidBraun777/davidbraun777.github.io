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

/** Optional concise project narrative within the shared case-study registry. */
export interface CaseStudyStory {
  atAGlance: { label: string; value: string }[]
  sections: CaseStudyStoryBlock[]
}

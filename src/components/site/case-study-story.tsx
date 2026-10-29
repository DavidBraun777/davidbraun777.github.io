import { SectionHeader } from '@/components/ui/section-header'
import type { CaseStudyStory } from '@/data/case-study-story'
import type { ProjectContent } from '@/lib/search/project-destinations'
import { Fragment, type ReactNode } from 'react'

export function CaseStudyStoryContent({ story, content, afterSections = {} }: Readonly<{ story: CaseStudyStory; content: ProjectContent; afterSections?: Record<string, ReactNode> }>) {
  return (
    <div className="space-y-12">
      {story.sections.map((section) => (
        <Fragment key={section.id}>
          <section {...content.attrs(section.id)}>
            <SectionHeader align="left" title={section.title} />
            <Paragraphs paragraphs={section.paragraphs} />
            {section.items?.length ? (
              <ul className="mt-4 max-w-4xl space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-8 text-text-secondary">
                    <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.closing ? (
              <p className="mt-4 max-w-4xl text-base leading-8 text-text-secondary">{section.closing}</p>
            ) : null}
          </section>
          {afterSections[section.id]}
        </Fragment>
      ))}
    </div>
  )
}

function Paragraphs({ paragraphs }: Readonly<{ paragraphs: string[] }>) {
  return (
    <div className="max-w-4xl space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-base leading-8 text-text-secondary">{paragraph}</p>
      ))}
    </div>
  )
}

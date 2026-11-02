import Image from 'next/image'
import { SectionHeader } from '@/components/ui/section-header'
import type { CaseStudyFigure, CaseStudyStory } from '@/data/case-study-story'
import type { ProjectContent } from '@/lib/search/project-destinations'
import { Fragment, type ReactNode } from 'react'

export function CaseStudyStoryContent({ story, content, afterSections = {} }: Readonly<{ story: CaseStudyStory; content: ProjectContent; afterSections?: Record<string, ReactNode> }>) {
  return (
    <div className="space-y-12">
      {story.sections.map((section) => (
        <Fragment key={section.id}>
          <section {...content.attrs(section.id)} className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="min-w-0 flex-1">
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
            </div>
            {section.figure && <StoryFigure figure={section.figure} />}
          </section>
          {afterSections[section.id]}
        </Fragment>
      ))}
    </div>
  )
}

function StoryFigure({ figure }: Readonly<{ figure: CaseStudyFigure }>) {
  const portrait = figure.height > figure.width
  return (
    <figure className={portrait ? 'w-full max-w-xs self-center lg:self-start' : 'w-full lg:w-1/2'}>
      <Image
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        sizes={portrait ? '(max-width: 352px) 92vw, 320px' : '(min-width: 1280px) 608px, (min-width: 1024px) 50vw, 100vw'}
        className="h-auto w-full rounded-[1.25rem] border border-border-subtle"
      />
      <figcaption className="mt-3 text-sm leading-6 text-text-secondary">{figure.caption}</figcaption>
    </figure>
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

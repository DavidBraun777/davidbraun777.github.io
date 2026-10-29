import { SectionHeader } from '@/components/ui/section-header'
import type { CaseStudyStory } from '@/data/case-study-story'
import type { ProjectContent } from '@/lib/search/project-destinations'

export function CaseStudyStoryContent({ story, content }: Readonly<{ story: CaseStudyStory; content: ProjectContent }>) {
  return (
    <div className="space-y-12">
      {story.sections.map((section) => (
        <section key={section.id} {...content.attrs(section.id)}>
          <SectionHeader align="left" title={section.title} />
          <Paragraphs paragraphs={section.paragraphs} />
          {section.items?.length ? (
            <ul className="mt-4 max-w-4xl space-y-3">
              {section.items.map((item) => (
                <li key={item.label} className="flex gap-3 text-base leading-8 text-text-secondary">
                  <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  <span><strong>{item.label}:</strong> {item.description}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {section.closing ? (
            <p className="mt-4 max-w-4xl text-base leading-8 text-text-secondary">{section.closing}</p>
          ) : null}
        </section>
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

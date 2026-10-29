import Image from 'next/image'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { TechTag } from '@/components/site/tech-tag'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import type { CaseStudyStory, CaseStudyStoryBlock } from '@/data/case-study-story'
import { projectBlockKey, type ProjectContent } from '@/lib/search/project-destinations'
import { destinationAttributes, type ContentDestination } from '@/lib/search/destinations'

type StoryContentProps = Readonly<{ story: CaseStudyStory; stack: string[]; content: ProjectContent }>

export function CaseStudyStoryContent({ story, stack, content }: StoryContentProps) {
  return (
    <div className="space-y-12">
      <section {...content.attrs('overview')}>
        <SectionHeader align="left" title="The goal" />
        <Paragraphs paragraphs={story.overview} />
      </section>

      <section {...content.attrs('capabilities')}>
        <SectionHeader align="left" title="What I built" />
        <div className="grid gap-5 lg:grid-cols-3">
          {story.capabilities.map((block) => <StoryCard key={projectBlockKey(block.title, block.paragraphs.join(' '))} block={block} destination={content.get('capability', projectBlockKey(block.title, block.paragraphs.join(' ')))} />)}
        </div>
      </section>

      <section {...content.attrs('workflows')}>
        <SectionHeader align="left" title="One engineering decision" />
        <Paragraphs paragraphs={story.decision} />
      </section>

      <section {...content.attrs('stopping-point')}>
        <SectionHeader align="left" title="Where the work stopped" />
        <Paragraphs paragraphs={story.stoppingPoint} />
      </section>

      <section {...content.attrs('tradeoffs')}>
        <SectionHeader align="left" title="What I carry forward" />
        <Paragraphs paragraphs={story.reflection} />
      </section>

      <aside {...content.attrs('scope')} className="max-w-4xl rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5 sm:p-6" aria-label="Evidence and status">
        <p className="text-sm font-semibold text-text-primary">Evidence and status</p>
        <p className="mt-2 text-sm leading-7 text-text-secondary">{story.scopeNote}</p>
      </aside>

      <TechnicalEvidence story={story} stack={stack} content={content} />
    </div>
  )
}

function TechnicalEvidence({ story, stack, content }: StoryContentProps) {
  return (
    <DisclosurePanel {...content.attrs('technical-details')} title="Technical evidence (optional)" summary="Implementation notes, recorded local checks, and original project evidence.">
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2" aria-label="Technical stack">
          {stack.map((item) => <TechTag key={item}>{item}</TechTag>)}
        </div>

        <section {...content.attrs('architecture')} className="space-y-4">
          <h3 className="text-xl font-semibold text-text-primary">Implementation notes</h3>
          {story.technicalDetails.map((block) => block.paragraphs.length > 1 ? (
            <DisclosurePanel key={projectBlockKey(block.title, block.paragraphs.join(' '))} {...content.attrs('technical', projectBlockKey(block.title, block.paragraphs.join(' ')))} title={block.title} summary={block.paragraphs[0]}>
              <Paragraphs paragraphs={block.paragraphs.slice(1)} />
            </DisclosurePanel>
          ) : (
            <StoryCard key={projectBlockKey(block.title, block.paragraphs.join(' '))} block={block} destination={content.get('technical', projectBlockKey(block.title, block.paragraphs.join(' ')))} />
          ))}
        </section>

        {story.illustration ? (
          <DisclosurePanel {...content.attrs('illustration')} title="Local form feedback capture" summary="Inspect the original local audit capture and its test conditions.">
            <figure className="max-w-lg">
              <Image
                src={story.illustration.src}
                alt={story.illustration.alt}
                width={story.illustration.width}
                height={story.illustration.height}
                sizes="(min-width: 640px) 512px, calc(100vw - 80px)"
                className="h-auto w-full rounded-xl border border-border-subtle"
              />
              <figcaption className="mt-4 text-sm leading-7 text-text-secondary">
                {story.illustration.caption}
              </figcaption>
            </figure>
          </DisclosurePanel>
        ) : null}

        <RecordedAudit story={story} content={content} />
      </div>
    </DisclosurePanel>
  )
}

function RecordedAudit({ story, content }: Readonly<{ story: CaseStudyStory; content: ProjectContent }>) {
  return (
    <section {...content.attrs('verification')}>
      <h3 className="mb-5 text-xl font-semibold text-text-primary">Verification and limitations</h3>
      <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-7">
        <div {...content.attrs('audit')}>
          <h4 className="text-lg font-semibold text-text-primary">Recorded local audit</h4>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{story.audit.date}</p>
          <p className="mt-1 text-sm leading-7 text-text-secondary">{story.audit.snapshot}</p>
        </div>
        <dl className="mt-6 divide-y divide-border-subtle">
          {story.audit.checks.map((check) => (
            <div key={projectBlockKey(check.label, check.detail)} {...content.attrs('audit-check', projectBlockKey(check.label, check.detail))} className="grid gap-2 py-4 first:pt-0 md:grid-cols-[13rem_1fr] md:gap-6">
              <dt className="text-sm font-semibold leading-7 text-text-primary">{check.label}</dt>
              <dd>
                <Badge variant={check.result === 'Passed' ? 'secondary' : 'outline'}>{check.result}</Badge>
                <p className="mt-2 text-sm leading-7 text-text-secondary">{check.detail}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div {...content.attrs('limitations')} className="mt-6 max-w-4xl">
        <h4 className="text-lg font-semibold text-text-primary">Remaining gaps</h4>
        <ul className="mt-4 space-y-3">
          {story.audit.limitations.map((item) => (
            <li key={item} className="flex gap-3 text-base leading-8 text-text-secondary">
              <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base leading-8 text-text-secondary">{story.audit.lesson}</p>
      </div>
    </section>
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

function StoryCard({ block, destination }: Readonly<{ block: CaseStudyStoryBlock; destination: ContentDestination }>) {
  return (
    <article {...destinationAttributes(destination)} className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
      <h3 className="mb-3 text-xl font-semibold text-text-primary">{block.title}</h3>
      <Paragraphs paragraphs={block.paragraphs} />
    </article>
  )
}

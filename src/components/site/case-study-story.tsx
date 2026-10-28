import Image from 'next/image'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { TechTag } from '@/components/site/tech-tag'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import type { CaseStudyStory, CaseStudyStoryBlock } from '@/data/case-study-story'

export function CaseStudyStoryContent({
  story,
  stack,
}: Readonly<{ story: CaseStudyStory; stack: string[] }>) {
  return (
    <div className="space-y-12">
      <section>
        <SectionHeader align="left" title="Overview" />
        <Paragraphs paragraphs={story.overview} />
        <aside className="mt-6 max-w-4xl rounded-[1.5rem] border border-border-subtle bg-background-subtle p-5 sm:p-6" aria-label="Scope of this account">
          <p className="text-sm font-semibold text-text-primary">Scope of this account</p>
          <p className="mt-2 text-sm leading-7 text-text-secondary">{story.scopeNote}</p>
        </aside>
      </section>

      <section>
        <SectionHeader align="left" title="What I built" />
        <div className="grid gap-5 lg:grid-cols-2">
          {story.capabilities.map((block) => <StoryCard key={block.title} block={block} />)}
        </div>
      </section>

      <section>
        <SectionHeader align="left" title="Architecture" subtitle={story.architecture.intro} />
        <div className="grid gap-5 lg:grid-cols-3">
          {story.architecture.flows.map((flow, index) => (
            <article
              key={flow.title}
              className={`rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6 ${index === 0 ? 'lg:col-span-3' : ''}`}
            >
              <h3 className="text-xl font-semibold text-text-primary">{flow.title}</h3>
              <ol
                aria-label={`${flow.title} flow`}
                className={index === 0 ? 'mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4' : 'mt-5 space-y-3'}
              >
                {flow.steps.map((step, stepIndex) => (
                  <li key={step} className="flex items-start gap-3 rounded-xl border border-border-subtle bg-background-subtle p-4">
                    <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 font-mono text-xs font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-200">
                      {stepIndex + 1}
                    </span>
                    <span className="text-sm leading-7 text-text-secondary">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-border-subtle pt-4 text-sm leading-7 text-text-secondary">
                {flow.boundary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader align="left" title="Workflow stories" />
        <div className="space-y-5">
          {story.workflows.map((block) => <StoryCard key={block.title} block={block} />)}
        </div>
      </section>

      <section>
        <SectionHeader align="left" title="Engineering decisions and tradeoffs" />
        <div className="grid gap-5 lg:grid-cols-2">
          {story.tradeoffs.map((block) => <StoryCard key={block.title} block={block} />)}
        </div>
      </section>

      <section>
        <SectionHeader align="left" title="Technical details" />
        <div className="mb-6 flex flex-wrap gap-2" aria-label="Technical stack">
          {stack.map((item) => <TechTag key={item}>{item}</TechTag>)}
        </div>
        <div className="space-y-4">
          {story.technicalDetails.map((block) => block.paragraphs.length > 1 ? (
            <DisclosurePanel key={block.title} title={block.title} summary={block.paragraphs[0]}>
              <Paragraphs paragraphs={block.paragraphs.slice(1)} />
            </DisclosurePanel>
          ) : (
            <StoryCard key={block.title} block={block} />
          ))}
          {story.illustration ? (
            <DisclosurePanel title="Local form feedback capture" summary="Inspect the original local audit capture and its test conditions.">
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
        </div>
      </section>

      <section>
        <SectionHeader align="left" title="Verification and limitations" />
        <div className="rounded-[1.75rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-7">
          <h3 className="text-xl font-semibold text-text-primary">Recorded local audit</h3>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{story.audit.date}</p>
          <p className="mt-1 text-sm leading-7 text-text-secondary">{story.audit.snapshot}</p>
          <dl className="mt-6 divide-y divide-border-subtle">
            {story.audit.checks.map((check) => (
              <div key={check.label} className="grid gap-2 py-4 first:pt-0 md:grid-cols-[13rem_1fr] md:gap-6">
                <dt className="text-sm font-semibold leading-7 text-text-primary">{check.label}</dt>
                <dd>
                  <Badge variant={check.result === 'Passed' ? 'secondary' : 'outline'}>{check.result}</Badge>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{check.detail}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-6 max-w-4xl">
          <h3 className="text-xl font-semibold text-text-primary">Remaining gaps</h3>
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

function StoryCard({ block }: Readonly<{ block: CaseStudyStoryBlock }>) {
  return (
    <article className="rounded-[1.5rem] border border-border-subtle bg-background-elevated p-5 shadow-sm sm:p-6">
      <h3 className="mb-3 text-xl font-semibold text-text-primary">{block.title}</h3>
      <Paragraphs paragraphs={block.paragraphs} />
    </article>
  )
}

import { SectionHeader } from '@/components/ui/section-header'
import { DisclosurePanel } from '@/components/site/disclosure-panel'
import { Time2MoveArchitecture, Time2MoveReviewPipeline } from '@/components/site/time2move-architecture'
import { Time2MoveAiLesson } from '@/components/site/time2move-ai-lesson'
import { time2MoveExtras } from '@/data/time2move-extras'
import type { ProjectContent } from '@/lib/search/project-destinations'

export function Time2MoveSystemOverview({ content }: Readonly<{ content: ProjectContent }>) {
  return (
    <section {...content.attrs(time2MoveExtras.overview.id)} className="space-y-6 scroll-mt-28">
      <SectionHeader align="left" title={time2MoveExtras.overview.title} subtitle={time2MoveExtras.overview.caption} />
      <Time2MoveArchitecture />
      <DisclosurePanel {...content.attrs(time2MoveExtras.reviews.id)} title={time2MoveExtras.reviews.title} summary={time2MoveExtras.reviews.summary}>
        <Time2MoveReviewPipeline />
      </DisclosurePanel>
    </section>
  )
}

export function Time2MoveWorkflowLesson({ content }: Readonly<{ content: ProjectContent }>) {
  return (
    <DisclosurePanel {...content.attrs(time2MoveExtras.lesson.id)} title={time2MoveExtras.lesson.title} summary={time2MoveExtras.lesson.summary} badge="Illustrative extension">
      <Time2MoveAiLesson />
    </DisclosurePanel>
  )
}

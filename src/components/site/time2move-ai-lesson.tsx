'use client'

import { useState } from 'react'
import fixtures from '@/data/time2move-ai-fixtures.json'
import { aiLessonCopy, evaluateAiProposal, proposedAiSchema } from '@/lib/time2move-ai-lesson'
import { ContentDetails } from '@/components/site/disclosure-panel'
import { ExternalLinkAction } from '@/components/ui/external-link-action'

export function Time2MoveAiLesson() {
  const [example, setExample] = useState(fixtures.cases[0])
  const evaluation = evaluateAiProposal(example.input, example.proposal)
  const checks = [
    { label: 'Schema check', ...evaluation.schema },
    { label: 'Evidence-presence check', ...evaluation.evidence },
    { label: 'Human-review gate', ...evaluation.humanReview },
  ]

  return (
    <div className="space-y-6 text-base leading-8 text-text-secondary">
      <p className="rounded-xl border border-border-subtle bg-background-subtle p-4 font-medium text-text-primary">{aiLessonCopy.disclaimer}</p>
      <p>{aiLessonCopy.boundary}</p>
      <ol aria-label="Proposed workflow" className="grid gap-3 sm:grid-cols-5">
        {aiLessonCopy.sequence.map((step, index) => (
          <li key={step} className="rounded-xl border border-border-subtle bg-background-subtle p-3 text-sm leading-6">
            <span className="mb-1 block font-semibold text-text-primary">{index + 1}.</span>{step}
          </li>
        ))}
      </ol>
      <div role="group" aria-label="Choose a synthetic example" className="flex flex-wrap gap-2">
        {fixtures.cases.map(fixture => (
          <button
            key={fixture.id}
            type="button"
            aria-pressed={example.id === fixture.id}
            onClick={() => setExample(fixture)}
            className="rounded-full border border-border-strong bg-background-subtle px-4 py-2 text-sm font-semibold text-text-primary aria-pressed:border-primary-500 aria-pressed:bg-primary-500/15 aria-pressed:ring-2 aria-pressed:ring-primary-500"
          >
            {fixture.title}
          </button>
        ))}
      </div>
      <div aria-live="polite" aria-atomic="true" className="space-y-5">
        <div className="grid min-w-0 gap-5 md:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-border-subtle p-4">
            <h4 className="font-semibold text-text-primary">Synthetic visitor message</h4>
            <blockquote className="mt-3">{example.input}</blockquote>
          </div>
          <div className="min-w-0 rounded-xl border border-border-subtle p-4">
            <h4 className="font-semibold text-text-primary">Illustrative model proposal</h4>
            <p className="text-sm">Precomputed for teaching; not actual model output.</p>
            <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-6"><code>{JSON.stringify(example.proposal, null, 2)}</code></pre>
          </div>
        </div>
        <dl className="grid gap-3 md:grid-cols-3">
          {checks.map(check => (
            <div key={check.label} className="rounded-xl border border-border-subtle bg-background-subtle p-4">
              <dt className="text-sm font-semibold text-text-primary">{check.label}</dt>
              <dd className="mt-2">
                <span className="block font-semibold text-text-primary">{check.status}</span>
                <span className="block text-sm leading-7">{check.detail}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="border-l-2 border-primary-500 pl-4"><strong className="text-text-primary">Outcome: </strong>{evaluation.outcome}</p>
      </div>
      <p>{aiLessonCopy.evidence}</p>
      <p>{aiLessonCopy.review}</p>
      <p>{aiLessonCopy.trustedFields}</p>
      <ContentDetails className="rounded-xl border border-border-subtle p-4">
        <summary className="cursor-pointer font-semibold text-text-primary">View proposed schema</summary>
        <p className="mt-3">{aiLessonCopy.schema}</p>
        <pre className="mt-3 whitespace-pre-wrap break-words text-xs leading-6"><code>{JSON.stringify(proposedAiSchema, null, 2)}</code></pre>
      </ContentDetails>
      <p className="text-sm leading-7">{aiLessonCopy.evaluation}</p>
      <ExternalLinkAction href="https://pydantic.dev/docs/validation/latest/concepts/strict_mode/">Further reading: Pydantic strict validation</ExternalLinkAction>
    </div>
  )
}

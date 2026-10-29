// @vitest-environment happy-dom
import { act } from 'react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { Time2MoveAiLesson } from '@/components/site/time2move-ai-lesson'
import fixtures from '@/data/time2move-ai-fixtures.json'
import { cleanupMountedUi, click, element, mount } from '../helpers/mounted-ui'

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('fetch', vi.fn())
})
afterEach(() => { cleanupMountedUi(); vi.unstubAllGlobals() })

test('switches precomputed examples and shows independent schema, evidence and review results without network calls', () => {
  const { container } = mount(<Time2MoveAiLesson />)
  const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'))
  expect(buttons).toHaveLength(3)
  expect(buttons.map(button => button.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false'])
  const expectedReview = ['Required', 'Clarification needed', 'Blocked']
  for (const [index, button] of buttons.entries()) {
    click(button)
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(buttons.filter(item => item.getAttribute('aria-pressed') === 'true')).toHaveLength(1)
    expect(element('blockquote', container).textContent).toBe(fixtures.cases[index].input)
    expect(JSON.parse(element('pre code', container).textContent!)).toEqual(fixtures.cases[index].proposal)
    const checks = Array.from(container.querySelectorAll('dl dd > span:first-child')).map(span => span.textContent)
    expect(checks).toEqual(['Passed', index === 2 ? 'Failed' : 'Passed', expectedReview[index]])
  }
  click(buttons[0])
  expect(element('blockquote', container).textContent).toBe(fixtures.cases[0].input)
  expect(fetch).not.toHaveBeenCalled()
  expect(container.querySelector('form, input, textarea, iframe')).toBeNull()
})

test('keeps the schema optional and the further-reading link safe', () => {
  const { container } = mount(<Time2MoveAiLesson />)
  const details = element<HTMLDetailsElement>('details', container)
  expect(details.open).toBe(false)
  act(() => { details.open = true; details.dispatchEvent(new Event('toggle')) })
  expect(details.open).toBe(true)
  const schema = JSON.parse(element('pre code', details).textContent!)
  expect(schema.additionalProperties).toBe(false)
  expect(schema.required).toEqual(['intent', 'summary', 'evidence', 'needs_review'])
  expect(element('a', container).getAttribute('target')).toBe('_blank')
  expect(element('a', container).getAttribute('rel')).toBe('noopener noreferrer')
})

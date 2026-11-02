// @vitest-environment happy-dom
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { Contact } from '@/components/sections/contact'
import { changeValue, cleanupMountedUi, deferred, element, mount } from '../helpers/mounted-ui'

// Browser animation scheduling is outside this form's validation/delivery contract.
vi.mock('framer-motion', async () => {
  const { createElement } = await import('react')
  const tag = (name: string) => (props: Record<string, unknown>) => createElement(name, Object.fromEntries(Object.entries(props).filter(([key]) => !['initial', 'animate', 'whileInView', 'viewport', 'transition'].includes(key))))
  return { motion: { div: tag('div'), aside: tag('aside') } }
})

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
})
afterEach(() => { cleanupMountedUi(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })

function fillRequired() {
  changeValue(element<HTMLInputElement>('#contact-name'), 'Ada Lovelace')
  changeValue(element<HTMLInputElement>('#contact-email'), 'ada@example.test')
  changeValue(element<HTMLInputElement>('#contact-organization'), 'Analytical Engines')
  changeValue(element<HTMLInputElement>('#contact-subject'), 'Workflow integration')
  changeValue(element<HTMLTextAreaElement>('#contact-message'), 'We would like to discuss a durable workflow integration.')
}
function submit() { act(() => element<HTMLFormElement>('form').requestSubmit()) }

describe('Contact inquiry form', () => {
  test('validates and submits selected context, then keeps confirmation until a new draft starts', async () => {
    const response = deferred<Response>()
    const fetch = vi.fn().mockReturnValue(response.promise)
    vi.stubGlobal('fetch', fetch)
    mount(<Contact />)
    expect(element<HTMLFormElement>('form').checkValidity()).toBe(false)
    submit()
    expect(fetch).not.toHaveBeenCalled()
    changeValue(element<HTMLSelectElement>('#contact-inquiry-type'), 'consulting')
    fillRequired()
    changeValue(element<HTMLInputElement>('#contact-email'), 'invalid-email')
    submit()
    expect(fetch).not.toHaveBeenCalled()
    changeValue(element<HTMLInputElement>('#contact-email'), 'ada@example.test')
    changeValue(element<HTMLSelectElement>('#contact-service'), 'workflow-automation')
    changeValue(element<HTMLSelectElement>('#contact-urgency'), 'this-quarter')
    // Choosing consulting again retains its context; another inquiry clears it.
    changeValue(element<HTMLSelectElement>('#contact-inquiry-type'), 'consulting')
    expect(element<HTMLSelectElement>('#contact-service').value).toBe('workflow-automation')
    submit()
    expect(element<HTMLButtonElement>('button[type="submit"]').disabled).toBe(true)
    expect(element<HTMLFieldSetElement>('fieldset').disabled).toBe(true)
    submit()
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, request] = fetch.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(request.method).toBe('POST')
    expect(request.headers['x-contact-submission-id']).toMatch(/^[a-f\d-]{36}$/)
    expect(JSON.parse(request.body)).toEqual({ name: 'Ada Lovelace', email: 'ada@example.test', inquiryType: 'consulting', organization: 'Analytical Engines', subject: 'Workflow integration', message: 'We would like to discuss a durable workflow integration.', serviceNeeded: 'workflow-automation', urgency: 'this-quarter' })
    await act(async () => response.resolve(new Response(null, { status: 200 })))
    expect(element('[role="status"]').textContent).toContain('Message sent')
    expect(element<HTMLInputElement>('#contact-name').value).toBe('')
    expect(element<HTMLSelectElement>('#contact-inquiry-type').value).toBe('')
    expect(element<HTMLButtonElement>('button[type="submit"]').disabled).toBe(false)
    await act(async () => vi.advanceTimersByTimeAsync(60_000))
    expect(element('[role="status"]').textContent).toContain('Message sent')
    changeValue(element<HTMLInputElement>('#contact-name'), 'Another inquiry')
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  test('retains failed drafts and reuses submission IDs only for retries of unchanged content', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response(null, { status: 500 })).mockRejectedValueOnce(new Error('offline')).mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetch)
    const rendered = mount(<Contact initialInquiryType="employment" showSectionHeader={false} calLink=" https://example.test/call " sectionId="inquiries" />)
    expect(document.querySelector('#contact')).toBeNull()
    expect(element('a[href="https://example.test/call"]').getAttribute('rel')).toBe('noopener noreferrer')
    expect(document.body.textContent).not.toContain('Start with the inquiry form')
    fillRequired()
    submit()
    await act(async () => {})
    expect(element('[role="alert"]').textContent).toContain('temporarily unavailable')
    expect(element<HTMLInputElement>('#contact-name').value).toBe('Ada Lovelace')
    await act(async () => vi.advanceTimersByTimeAsync(60_000))
    expect(element('[role="alert"]').textContent).toContain('Your draft is still here')
    submit()
    await act(async () => {})
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(element('[role="alert"]').textContent).toContain('confirm delivery')
    const submissionId = (index: number) => fetch.mock.calls[index][1].headers['x-contact-submission-id']
    expect(submissionId(1)).toBe(submissionId(0))
    changeValue(element<HTMLInputElement>('#contact-subject'), 'Updated workflow integration')
    submit()
    await act(async () => {})
    expect(submissionId(2)).not.toBe(submissionId(1))
    expect(element('[role="status"]').textContent).toContain('Message sent')
    expect(element<HTMLSelectElement>('#contact-inquiry-type').value).toBe('employment')
    rendered.unmount()
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  test('honors the server retry delay without discarding the draft or automatically resubmitting', async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 429, headers: { 'Retry-After': '2' } }))
      .mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetch)
    mount(<Contact initialInquiryType="employment" />)
    fillRequired()
    submit()
    await act(async () => {})
    expect(element('[role="alert"]').textContent).toContain('Wait 2 seconds')
    expect(element<HTMLButtonElement>('button[type="submit"]').disabled).toBe(true)
    expect(element<HTMLTextAreaElement>('#contact-message').value).toContain('durable workflow')
    submit()
    expect(fetch).toHaveBeenCalledTimes(1)
    await act(async () => vi.advanceTimersByTimeAsync(1000))
    expect(element<HTMLButtonElement>('button[type="submit"]').disabled).toBe(true)
    await act(async () => vi.advanceTimersByTimeAsync(1000))
    expect(element<HTMLButtonElement>('button[type="submit"]').disabled).toBe(false)
    expect(element('[role="alert"]').textContent).toContain('again now')
    expect(fetch).toHaveBeenCalledTimes(1)
    submit()
    await act(async () => {})
    expect(fetch.mock.calls[1][1].headers['x-contact-submission-id']).toBe(fetch.mock.calls[0][1].headers['x-contact-submission-id'])
    expect(element('[role="status"]').textContent).toContain('Message sent')
  })

  test('cleans up a pending retry cooldown on unmount', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 429, headers: { 'Retry-After': '30' } })))
    const rendered = mount(<Contact initialInquiryType="employment" />)
    fillRequired()
    submit()
    await act(async () => {})
    const clear = vi.spyOn(globalThis, 'clearTimeout')
    rendered.unmount()
    expect(clear).toHaveBeenCalled()
    await act(async () => vi.advanceTimersByTimeAsync(30_000))
    expect(document.querySelector('[role="alert"]')).toBeNull()
  })

  test('updates inquiry guidance, clears consulting-only context and rejects invalid inquiry values', () => {
    mount(<Contact calLink="javascript:alert(1)" title="Discuss a project" subtitle="Context first" />)
    expect(document.querySelector('a[href="#contact-fields"]')).toBeNull()
    expect(document.body.textContent).not.toContain('Book a short call')
    expect(document.body.textContent).toContain('Discuss a project')
    const select = element<HTMLSelectElement>('#contact-inquiry-type')
    for (const [value, heading] of [['research', 'research collaboration'], ['speaking', 'speaking opportunity'], ['other', 'what you have in mind'], ['consulting', 'system or workflow']]) {
      changeValue(select, value)
      expect(document.body.textContent).toContain(heading)
    }
    changeValue(element<HTMLSelectElement>('#contact-service'), 'applied-ai')
    changeValue(select, 'research')
    expect(document.querySelector('#contact-service')).toBeNull()
    changeValue(select, 'consulting')
    expect(element<HTMLSelectElement>('#contact-service').value).toBe('')
    const invalid = document.createElement('option')
    invalid.value = 'invalid'
    select.append(invalid)
    changeValue(select, 'invalid')
    expect(select.value).toBe('')
    expect(document.body.textContent).toContain('What would you like to discuss?')
  })
})

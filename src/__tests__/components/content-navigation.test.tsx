// @vitest-environment happy-dom
import { act, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ContentDestinationManifest } from '@/components/site/content-destination-manifest'
import { cancelContentNavigation, contentRouteCommitted, hasContentNavigation, mountContentNavigation, notifyContentLayout, prepareContentNavigation, registerContentDisclosure, releaseContentNavigation } from '@/lib/content-navigation'
import type { ContentDestination } from '@/lib/search/destinations'

const target: ContentDestination = { page: '/nested', anchor: 'content-leaf', label: 'Nested content', disclosureIds: ['outer', 'inner'], fallbackAnchor: 'outer' }
let root: Root
let dispose: () => void
let scroll: ReturnType<typeof vi.spyOn>

function UnmountingDisclosure({ id, children }: { id: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDetailsElement>(null)
  useLayoutEffect(() => registerContentDisclosure(ref.current!, () => setOpen(true)), [])
  useLayoutEffect(notifyContentLayout, [open])
  return <details id={id} open={open} ref={ref} tabIndex={-1}><summary onClick={event => { event.preventDefault(); setOpen(value => !value) }}>{id}</summary>{open ? children : null}</details>
}
async function settle() {
  for (let i = 0; i < 8; i++) await act(async () => { await vi.advanceTimersByTimeAsync(17) })
}
async function render(children: ReactNode) {
  await act(async () => root.render(children))
  dispose = mountContentNavigation()
  contentRouteCommitted('/nested')
  await settle()
}

beforeEach(() => {
  vi.useFakeTimers()
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  window.history.replaceState(null, '', '/nested')
  document.body.innerHTML = '<header></header><main id="main-content"><div id="root"></div></main>'
  Object.defineProperty(document, 'fonts', { configurable: true, value: { status: 'loaded', ready: Promise.resolve() } })
  const rect = { top: 200, bottom: 240, left: 0, right: 100, width: 100, height: 40, x: 0, y: 200, toJSON() {} }
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([rect] as unknown as DOMRectList)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect)
  scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  root = createRoot(document.getElementById('root')!)
  dispose = () => {}
})
afterEach(async () => {
  dispose()
  cancelContentNavigation()
  await act(async () => root.unmount())
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('content navigation lifecycle', () => {
  test('opens nested state-owned disclosures before waiting for their unmounted children', async () => {
    window.history.replaceState(null, '', '/nested#content-leaf')
    await render(<><ContentDestinationManifest page="/nested" destinations={[target]} /><UnmountingDisclosure id="outer"><UnmountingDisclosure id="inner"><p id="content-leaf" tabIndex={-1}>Specific text</p></UnmountingDisclosure></UnmountingDisclosure></>)
    expect(document.getElementById('outer')).toHaveProperty('open', true)
    expect(document.getElementById('inner')).toHaveProperty('open', true)
    expect(document.activeElement?.id).toBe('content-leaf')
    expect(scroll).toHaveBeenCalledTimes(1)
    expect(hasContentNavigation()).toBe(false)
  })

  test('waits for dialog close before moving focus, and repeats an unchanged URL after collapse', async () => {
    await render(<><ContentDestinationManifest page="/nested" destinations={[target]} /><UnmountingDisclosure id="outer"><UnmountingDisclosure id="inner"><p id="content-leaf" tabIndex={-1}>Specific text</p></UnmountingDisclosure></UnmountingDisclosure></>)
    prepareContentNavigation('/nested#content-leaf', target)
    window.history.pushState(null, '', '/nested#content-leaf')
    await settle()
    expect(document.getElementById('inner')).toBeNull()
    releaseContentNavigation()
    await settle()
    expect(document.activeElement?.id).toBe('content-leaf')
    await act(async () => (document.querySelector('#outer > summary') as HTMLElement).click())
    expect(document.getElementById('content-leaf')).toBeNull()
    prepareContentNavigation('/nested#content-leaf', target)
    releaseContentNavigation()
    await settle()
    expect(document.activeElement?.id).toBe('content-leaf')
    expect(scroll).toHaveBeenCalledTimes(2)
  })

  test('replaces stale intent and cancels pending navigation on an unrelated route commit', async () => {
    await render(<><ContentDestinationManifest page="/nested" destinations={[target]} /><p id="other" tabIndex={-1}>Other</p></>)
    prepareContentNavigation('/nested#content-leaf', target)
    window.history.pushState(null, '', '/nested#content-leaf')
    releaseContentNavigation()
    await settle()
    expect(hasContentNavigation()).toBe(true)
    prepareContentNavigation('/nested#other')
    window.history.pushState(null, '', '/nested#other')
    releaseContentNavigation()
    await settle()
    expect(document.activeElement?.id).toBe('other')
    expect(scroll).toHaveBeenCalledTimes(1)
    prepareContentNavigation('/pending#missing')
    window.history.pushState(null, '', '/elsewhere')
    contentRouteCommitted('/elsewhere')
    expect(hasContentNavigation()).toBe(false)
    await act(async () => { await vi.advanceTimersByTimeAsync(6000) })
    expect(scroll).toHaveBeenCalledTimes(1)
  })

  test('falls back once for an unavailable target and stops watching after its deadline', async () => {
    const missing = { ...target, anchor: 'missing', disclosureIds: [], fallbackAnchor: 'parent' }
    await render(<><ContentDestinationManifest page="/nested" destinations={[missing]} /><section id="parent" tabIndex={-1}>Parent section</section></>)
    prepareContentNavigation('/nested#missing', missing)
    window.history.pushState(null, '', '/nested#missing')
    releaseContentNavigation()
    await act(async () => { await vi.advanceTimersByTimeAsync(5001) })
    await settle()
    expect(document.activeElement?.id).toBe('parent')
    expect(hasContentNavigation()).toBe(false)
    expect(scroll).toHaveBeenCalledTimes(1)
    document.getElementById('parent')!.appendChild(document.createElement('div'))
    await settle()
    expect(scroll).toHaveBeenCalledTimes(1)
  })

  test('a fallback can finish a React disclosure commit even when fonts remain unavailable', async () => {
    Object.defineProperty(document, 'fonts', { configurable: true, value: { status: 'loading', ready: new Promise(() => {}) } })
    const missing = { ...target, anchor: 'missing', disclosureIds: [], fallbackAnchor: 'outer' }
    window.history.replaceState(null, '', '/nested#missing')
    await render(<><ContentDestinationManifest page="/nested" destinations={[missing]} /><UnmountingDisclosure id="outer"><p>Parent content</p></UnmountingDisclosure></>)
    await act(async () => { await vi.advanceTimersByTimeAsync(5001) })
    await settle()
    expect(document.getElementById('outer')).toHaveProperty('open', true)
    expect(document.activeElement?.id).toBe('outer')
    expect(hasContentNavigation()).toBe(false)
    expect(scroll).toHaveBeenCalledTimes(1)
  })
})

// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { useScrollSpy } from '@/hooks/useScrollSpy'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let root: Root | undefined
afterEach(() => {
  act(() => root?.unmount())
  root = undefined
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function mount(sectionIds: string[], offset?: number) {
  const container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  function Consumer() { return <output>{useScrollSpy({ sectionIds, offset }) ?? 'none'}</output> }
  act(() => root!.render(<Consumer />))
  return container
}

it('tracks the deepest reached section, skips missing elements, and throttles scroll events', () => {
  for (const [id, top] of [['first', 100], ['second', 300]] as const) {
    const section = document.createElement('section')
    section.id = id
    Object.defineProperty(section, 'offsetTop', { value: top })
    document.body.append(section)
  }
  vi.stubGlobal('scrollY', 0)
  let frame: FrameRequestCallback | undefined
  const raf = vi.fn((callback: FrameRequestCallback) => { frame = callback; return 1 })
  vi.stubGlobal('requestAnimationFrame', raf)
  const remove = vi.spyOn(window, 'removeEventListener')
  const container = mount(['first', 'second', 'missing'])
  expect(container.textContent).toBe('first')
  vi.stubGlobal('scrollY', 250)
  act(() => { window.dispatchEvent(new Event('scroll')); window.dispatchEvent(new Event('scroll')) })
  expect(raf).toHaveBeenCalledTimes(1)
  act(() => frame!(0))
  expect(container.textContent).toBe('second')
  vi.stubGlobal('scrollY', 80)
  act(() => window.dispatchEvent(new Event('scroll')))
  act(() => frame!(1))
  expect(container.textContent).toBe('first')
  act(() => root!.unmount())
  root = undefined
  expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
})

it('does not subscribe without sections and accepts an explicit offset', () => {
  const add = vi.spyOn(window, 'addEventListener')
  expect(mount([], 0).textContent).toBe('none')
  expect(add.mock.calls.some(([type]) => type === 'scroll')).toBe(false)
})

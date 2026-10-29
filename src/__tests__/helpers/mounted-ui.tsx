import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { vi } from 'vitest'

const roots = new Set<Root>()

export function mount(children: ReactNode) {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.add(root)
  const render = (next: ReactNode) => act(() => root.render(next))
  render(children)
  return { container, render, unmount() { act(() => root.unmount()); roots.delete(root); container.remove() } }
}

export function cleanupMountedUi() {
  for (const root of roots) act(() => root.unmount())
  roots.clear()
  document.body.replaceChildren()
}

export function element<T extends HTMLElement = HTMLElement>(selector: string, parent: ParentNode = document): T {
  const result = parent.querySelector<T>(selector)
  if (!result) throw new Error(`Missing element: ${selector}`)
  return result
}

export function click(target: HTMLElement) { act(() => target.click()) }

export function changeValue(target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: string) {
  const prototype = target instanceof HTMLSelectElement ? HTMLSelectElement.prototype : target instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  act(() => {
    Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(target, value)
    target.dispatchEvent(new Event('input', { bubbles: true }))
    target.dispatchEvent(new Event('change', { bubbles: true }))
  })
}

export function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((done, fail) => { resolve = done; reject = fail })
  return { promise, resolve, reject }
}

/** Native History APIs change the URL without emitting hashchange. */
export function stubBrowserHistory() {
  // Happy DOM currently queues hashchange from pushState/replaceState using a
  // native timer, which can cancel a later intent outside Vitest's fake clock.
  let location = new URL('/', window.location.origin)
  vi.spyOn(window, 'location', 'get').mockImplementation(() => location as unknown as Location)
  const updateHistory = (_state: unknown, _title: string, href?: string | URL | null) => {
    if (href !== undefined && href !== null) location = new URL(href, location)
  }
  vi.spyOn(window.history, 'pushState').mockImplementation(updateHistory)
  vi.spyOn(window.history, 'replaceState').mockImplementation(updateHistory)
}

// @vitest-environment happy-dom
import { act, useRef, useState, type AnchorHTMLAttributes } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { changeValue, cleanupMountedUi, click, deferred, element, mount } from '../helpers/mounted-ui'
import type { SearchRecord } from '@/lib/search/types'

const theme = vi.hoisted(() => ({ resolvedTheme: 'light', setTheme: vi.fn() }))
const route = vi.hoisted(() => ({ pathname: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }))
vi.mock('next-themes', () => ({ useTheme: () => theme }))
vi.mock('next/link', () => ({
  default: ({ onNavigate, onClick, prefetch, scroll, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { onNavigate?: () => void; prefetch?: boolean; scroll?: boolean }) => {
    void prefetch; void scroll
    return <a {...props} onClick={event => { event.preventDefault(); onClick?.(event); onNavigate?.(); if (props.href) window.history.pushState(null, '', props.href) }} />
  },
}))

const records: SearchRecord[] = Array.from({ length: 12 }, (_, index) => ({
  id: `atlas-${index}`, title: index === 0 ? 'Atlas unique' : `Atlas project ${index}`,
  href: index === 0 ? '/case-studies/atlas#content-results' : `/case-studies/atlas-${index}`,
  type: 'Project', description: 'Atlas operational software.', body: 'Durable workflows.', tags: [], headings: [],
  ...(index === 0 ? { destination: { page: '/case-studies/atlas', anchor: 'content-results', label: 'Atlas › Results', disclosureIds: [] }, granularity: 'block' as const } : {}),
}))
const response = () => new Response(JSON.stringify({ version: 1, records }), { status: 200 })
const settle = async (milliseconds = 200) => { await act(async () => vi.advanceTimersByTimeAsync(milliseconds)) }
let cancelNavigation: (() => void) | undefined

beforeEach(() => {
  vi.resetModules()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response()))
  vi.stubGlobal('visualViewport', undefined)
  route.pathname = '/'
  window.history.replaceState(null, '', '/')
  theme.resolvedTheme = 'light'
  theme.setTheme.mockReset()
})
afterEach(async () => {
  cleanupMountedUi()
  await settle(1)
  cancelNavigation?.()
  vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers()
})

async function mountSearch(returnTarget: 'connected' | 'detached' | 'missing' = 'connected') {
  const { SiteSearch } = await import('@/components/site/site-search')
  const navigation = await import('@/lib/content-navigation')
  cancelNavigation = navigation.cancelContentNavigation
  function Harness() {
    const [open, setOpen] = useState(false)
    const trigger = useRef<HTMLButtonElement>(null)
    const empty = useRef<HTMLElement | null>(returnTarget === 'detached' ? document.createElement('button') : null)
    return <><button ref={trigger} onClick={() => setOpen(true)}>Open search</button><SiteSearch open={open} onOpenChange={setOpen} returnFocusRef={returnTarget === 'connected' ? trigger : empty} /></>
  }
  const rendered = mount(<Harness />)
  click(element('button', rendered.container))
  await settle(1)
  return { ...rendered, navigation }
}

describe('mounted search dialog', () => {
  test('shows loading, paginated results, exact locations, empty results and clear-query suggestions with focus', async () => {
    const pending = deferred<Response>()
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending.promise))
    const app = await mountSearch()
    const input = element<HTMLInputElement>('#site-search-input')
    expect(document.activeElement).toBe(input)
    changeValue(input, 'Atlas')
    await settle()
    expect(element('[role="status"]').textContent).toBe('Loading search…')
    await act(async () => pending.resolve(response()))
    await settle()
    expect(element('[role="status"]').textContent).toBe('12 results. Showing 10.')
    expect(document.querySelectorAll('[aria-label="Search results"] a')).toHaveLength(10)
    const more = Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Show more results')!
    click(more)
    await settle()
    const links = document.querySelectorAll('[aria-label="Search results"] a')
    expect(links).toHaveLength(12)
    expect(document.body.textContent).toContain('Atlas › Results')
    expect(document.activeElement).toBe(links[10])
    changeValue(input, 'unique')
    await settle()
    expect(element('[role="status"]').textContent).toBe('1 result. Showing 1.')
    changeValue(input, 'zzzz-no-match')
    await settle()
    expect(element('[role="status"]').textContent).toContain('No results found')
    changeValue(input, 'x'.repeat(300))
    expect(input.value).toHaveLength(160)
    click(element('[aria-label="Clear search"]'))
    await settle()
    expect(input.value).toBe('')
    expect(document.activeElement).toBe(input)
    expect(element('[role="status"]').textContent).toContain('Suggestions')
    expect(document.querySelector('[aria-label="Clear search"]')).toBeNull()
    click(element('[aria-label="Close search"]'))
    await settle()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(element('button', app.container))
  })

  test('offers retry and suggestions after failure, then selects a result through the real navigation lifecycle', async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(response())
    vi.stubGlobal('fetch', fetch)
    const app = await mountSearch()
    await settle()
    expect(element('[role="status"]').textContent).toContain('could not load')
    changeValue(element<HTMLInputElement>('#site-search-input'), 'unique')
    expect(element('a[href="/research"]')).toBeTruthy()
    click(Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Retry loading search')!)
    await settle()
    expect(fetch).toHaveBeenCalledTimes(2)
    const result = element<HTMLAnchorElement>('[aria-label="Search results"] a')
    act(() => result.focus())
    expect(document.activeElement).toBe(result)
    click(result)
    await settle()
    expect(window.location.pathname + window.location.hash).toBe(records[0].href)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(app.navigation.hasContentNavigation()).toBe(true)
  })

  test('selects suggestions without a granular destination and closes without a connected return target', async () => {
    await mountSearch('detached')
    click(element('a[href="/writing"]'))
    await settle()
    expect(window.location.pathname).toBe('/writing')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  test.each(['detached', 'missing'] as const)('Escape closes gracefully with a %s return target', async kind => {
    await mountSearch(kind)
    act(() => element('#site-search-input').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
    await settle()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  test.each(['resolve', 'reject'] as const)('ignores a late %s after unmount and removes viewport resize listeners', async outcome => {
    const viewport = Object.assign(new EventTarget(), { height: 700 })
    const add = vi.spyOn(viewport, 'addEventListener')
    const remove = vi.spyOn(viewport, 'removeEventListener')
    vi.stubGlobal('visualViewport', viewport)
    const pending = deferred<Response>()
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending.promise))
    const app = await mountSearch()
    expect(element('[role="dialog"]').style.maxHeight).toBe('min(84dvh, 668px)')
    act(() => { viewport.height = 100; viewport.dispatchEvent(new Event('resize')) })
    expect(element('[role="dialog"]').style.maxHeight).toBe('min(84dvh, 160px)')
    app.unmount()
    await act(async () => { if (outcome === 'resolve') pending.resolve(response()); else pending.reject(new Error('late failure')) })
    await settle()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(add).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledWith('resize', add.mock.calls[0][1])
  })
})

describe('header search shortcuts', () => {
  test('opens with the visible control, closes on route changes, and restores focus after shortcut Escape', async () => {
    const { Header } = await import('@/components/layout/header')
    cancelNavigation = (await import('@/lib/content-navigation')).cancelContentNavigation
    const rendered = mount(<Header />)
    click(element('[aria-label="Search site"]'))
    await settle()
    expect(element('[aria-label="Search site"]').getAttribute('aria-expanded')).toBe('true')
    route.pathname = '/research'
    rendered.render(<Header />)
    await settle()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    const previous = element('a[href="/contact"]')
    act(() => previous.focus())
    act(() => previous.dispatchEvent(new KeyboardEvent('keydown', { key: 'K', metaKey: true, bubbles: true, cancelable: true })))
    await settle()
    expect(document.activeElement?.id).toBe('site-search-input')
    // A repeated shortcut from the window does not toggle an existing dialog closed.
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true })))
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    click(element('[aria-label="Close search"]'))
    await settle()
    expect(document.activeElement).toBe(previous)
  })

  test('uses the persistent search control when a shortcut closes mobile navigation', async () => {
    const { Header } = await import('@/components/layout/header')
    mount(<Header />)
    click(element('[aria-controls="mobile-navigation"]'))
    const mobileLink = element('#mobile-navigation a')
    act(() => mobileLink.focus())
    act(() => mobileLink.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true })))
    await settle()
    expect(document.querySelector('#mobile-navigation')).toBeNull()
    click(element('[aria-label="Close search"]'))
    await settle()
    expect(document.activeElement).toBe(element('[aria-label="Search site"]'))
  })

  test('ignores composition, repeat, modifiers, cancelled shortcuts and editable fields without leaking listeners', async () => {
    const { Header } = await import('@/components/layout/header')
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const app = mount(<Header />)
    for (const options of [{ isComposing: true }, { repeat: true }, { altKey: true }, { ctrlKey: false }, { key: 'j' }]) {
      act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, ...options, cancelable: true })))
      expect(document.querySelector('[role="dialog"]')).toBeNull()
    }
    const cancelled = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true })
    cancelled.preventDefault()
    act(() => window.dispatchEvent(cancelled))
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    for (const html of ['<input />', '<textarea></textarea>', '<select></select>', '<div contenteditable="true"></div>', '<div role="textbox"></div>']) {
      const wrapper = document.createElement('div'); wrapper.innerHTML = html; document.body.append(wrapper)
      act(() => wrapper.firstElementChild!.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true })))
      expect(document.querySelector('[role="dialog"]')).toBeNull()
      wrapper.remove()
    }
    app.unmount()
    for (const [, listener] of add.mock.calls.filter(([type]) => type === 'keydown')) expect(remove).toHaveBeenCalledWith('keydown', listener)
    act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })))
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
})

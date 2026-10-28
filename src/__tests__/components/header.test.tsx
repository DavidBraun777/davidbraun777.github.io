// @vitest-environment happy-dom

import { act, type AnchorHTMLAttributes } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { router, setTheme } = vi.hoisted(() => ({
  router: { pathname: '/', includeAnchorLinks: false },
  setTheme: vi.fn(),
}))

vi.mock('next/navigation', () => ({ usePathname: () => router.pathname }))
vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light', setTheme }),
}))
vi.mock('next/link', () => ({
  default: ({ onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} onClick={(event) => {
      event.preventDefault()
      onClick?.(event)
    }} />
  ),
}))
vi.mock('@/data/profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/data/profile')>()
  return {
    ...actual,
    // Exercise the existing anchor-aware active-route contract without changing
    // production navigation or replacing either navigation component.
    get primaryNavigation() {
      return router.includeAnchorLinks
        ? [...actual.primaryNavigation,
          { label: 'Research section', href: '/research#publications' },
          { label: 'Home section', href: '#intro' }]
        : actual.primaryNavigation
    },
  }
})

import { Header } from '@/components/layout/header'

const roots = new Set<Root>()

function createViewport(matches = false) {
  const query = Object.assign(new EventTarget(), {
    matches,
    media: '(min-width: 1280px)',
  }) as MediaQueryList
  const add = vi.spyOn(query, 'addEventListener')
  const remove = vi.spyOn(query, 'removeEventListener')
  const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue(query)

  return {
    query, add, remove, matchMedia,
    change(nextMatches: boolean) {
      act(() => {
        Object.assign(query, { matches: nextMatches })
        query.dispatchEvent(new MediaQueryListEvent('change', {
          matches: nextMatches, media: query.media,
        }))
      })
    },
  }
}

function renderHeader() {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.add(root)
  const rerender = () => act(() => root.render(<Header />))
  rerender()

  function element<T extends HTMLElement = HTMLElement>(selector: string): T {
    const result = container.querySelector<T>(selector)
    if (!result) throw new Error(`Expected header element: ${selector}`)
    return result
  }

  return {
    container, element, rerender,
    menuButton: () => element<HTMLButtonElement>('button[aria-controls="mobile-navigation"]'),
    disclosure: (scope: 'Primary' | 'Mobile', section: 'Research' | 'Experience') =>
      element<HTMLButtonElement>(`nav[aria-label="${scope}"] button[aria-label="${section} navigation"]`),
    unmount() {
      act(() => root.unmount())
      roots.delete(root)
    },
  }
}

function click(element: HTMLElement) {
  act(() => element.click())
}

function focus(element: HTMLElement) {
  act(() => element.focus())
}

function key(key: string) {
  act(() => {
    (document.activeElement ?? document.body).dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true })
    )
  })
}

function pointer(element: Element, type = 'pointerdown', relatedTarget?: EventTarget) {
  act(() => element.dispatchEvent(new PointerEvent(type, {
    bubbles: true, pointerType: 'mouse', relatedTarget: relatedTarget ?? null,
  })))
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  router.pathname = '/'
  router.includeAnchorLinks = false
  setTheme.mockClear()
})

afterEach(() => {
  for (const root of roots) act(() => root.unmount())
  roots.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})

describe('mounted Header navigation', () => {
  it('toggles the mobile menu labels and expanded state, resetting its disclosures when reopened', () => {
    createViewport()
    const header = renderHeader()
    const trigger = header.menuButton()

    expect(trigger.getAttribute('aria-label')).toBe('Open navigation menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()

    click(trigger)
    expect(trigger.getAttribute('aria-label')).toBe('Close navigation menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(header.element('nav[aria-label="Mobile"]')).toBeTruthy()
    click(header.disclosure('Mobile', 'Research'))
    expect(header.disclosure('Mobile', 'Research').getAttribute('aria-expanded')).toBe('true')

    click(trigger)
    expect(trigger.getAttribute('aria-label')).toBe('Open navigation menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()
    click(trigger)
    expect(header.disclosure('Mobile', 'Research').getAttribute('aria-expanded')).toBe('false')
    expect(header.disclosure('Mobile', 'Experience').getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps inside interactions and ordinary keys working but dismisses outside pointers', () => {
    createViewport()
    const header = renderHeader()
    click(header.menuButton())
    pointer(header.element('header'))
    key('Enter')
    const theme = header.menuButton().parentElement?.querySelector<HTMLButtonElement>(
      'button[aria-label="Switch to dark theme"]'
    )
    if (!theme) throw new Error('Expected the mobile theme control')
    pointer(theme)
    click(theme)
    expect(setTheme).toHaveBeenCalledWith('dark')
    expect(header.menuButton().getAttribute('aria-expanded')).toBe('true')

    pointer(document.body)
    expect(header.menuButton().getAttribute('aria-expanded')).toBe('false')
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()
  })

  it('closes the mobile menu on Escape and returns focus to the hamburger', () => {
    createViewport()
    const header = renderHeader()
    click(header.menuButton())
    focus(header.element('nav[aria-label="Mobile"] a[href="/services"]'))
    key('Escape')
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()
    expect(document.activeElement).toBe(header.menuButton())
    expect(header.menuButton().getAttribute('aria-label')).toBe('Open navigation menu')
  })

  it('collapses an active mobile disclosure before Escape closes the entire menu', () => {
    createViewport()
    const header = renderHeader()
    click(header.menuButton())
    const research = header.disclosure('Mobile', 'Research')
    click(research)
    focus(header.element('#mobile-research-navigation a[href="/research#publications"]'))
    key('Escape')

    expect(research.getAttribute('aria-expanded')).toBe('false')
    expect(header.container.querySelector('#mobile-research-navigation')).toBeNull()
    expect(header.menuButton().getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(research)
    key('Escape')
    expect(header.menuButton().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(header.menuButton())
  })

  it.each([
    ['direct destination', 'nav[aria-label="Mobile"] a[href="/contact"]', undefined],
    ['section overview', 'nav[aria-label="Mobile"] a[href="/research"]', 'Research'],
    ['same-page anchor', '#mobile-research-navigation a[href="/research#publications"]', 'Research'],
    ['external resume', '#mobile-experience-navigation a[target="_blank"]', 'Experience'],
    ['brand', 'header > div a[href="/"]', undefined],
    ['Book a Call', '#mobile-navigation > div a[href="/contact"]', undefined],
  ] as const)('closes mobile navigation after selecting %s', (_label, selector, section) => {
    router.pathname = '/research'
    createViewport()
    const header = renderHeader()
    click(header.menuButton())
    if (section) click(header.disclosure('Mobile', section))
    click(header.element(selector))
    expect(header.menuButton().getAttribute('aria-expanded')).toBe('false')
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()
    click(header.menuButton())
    expect(header.disclosure('Mobile', 'Research').getAttribute('aria-expanded')).toBe('false')
    expect(header.disclosure('Mobile', 'Experience').getAttribute('aria-expanded')).toBe('false')
  })

  it('switches desktop dropdowns without letting a previous section blur dismiss the new selection', () => {
    createViewport(true)
    const header = renderHeader()
    const research = header.disclosure('Primary', 'Research')
    const experience = header.disclosure('Primary', 'Experience')
    focus(research)
    expect(research.getAttribute('aria-expanded')).toBe('true')
    pointer(research, 'pointerout', experience)
    expect(experience.getAttribute('aria-expanded')).toBe('true')
    expect(research.getAttribute('aria-expanded')).toBe('false')
    focus(experience)
    expect(experience.getAttribute('aria-expanded')).toBe('true')
    click(experience)
    click(experience)
    expect(experience.getAttribute('aria-expanded')).toBe('false')
    expect(header.container.querySelector('#desktop-experience-navigation')).toBeNull()
  })

  it('switches mobile disclosures without losing the newly selected section on blur', () => {
    createViewport()
    const header = renderHeader()
    click(header.menuButton())
    const research = header.disclosure('Mobile', 'Research')
    const experience = header.disclosure('Mobile', 'Experience')
    click(research)
    expect(research.getAttribute('aria-expanded')).toBe('true')
    click(experience)
    expect(research.getAttribute('aria-expanded')).toBe('false')
    expect(experience.getAttribute('aria-expanded')).toBe('true')
    click(experience)
    expect(experience.getAttribute('aria-expanded')).toBe('false')

    focus(research)
    click(experience)
    focus(experience)
    expect(experience.getAttribute('aria-expanded')).toBe('true')
    expect(research.getAttribute('aria-expanded')).toBe('false')
  })

  it.each(['Primary', 'Mobile'] as const)('clears %s navigation and updates active links after a route change', (scope) => {
    createViewport(scope === 'Primary')
    const header = renderHeader()
    if (scope === 'Mobile') click(header.menuButton())
    click(header.disclosure(scope, 'Research'))
    expect(header.disclosure(scope, 'Research').getAttribute('aria-expanded')).toBe('true')

    router.pathname = '/experience/career-story'
    header.rerender()
    expect(header.container.querySelector('#desktop-research-navigation')).toBeNull()
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()
    expect(header.element('nav[aria-label="Primary"] a[aria-current="page"]').textContent).toBe('Experience')
    click(header.menuButton())
    expect(header.disclosure('Mobile', 'Research').getAttribute('aria-expanded')).toBe('false')
    expect(header.disclosure('Mobile', 'Experience').getAttribute('aria-expanded')).toBe('false')
  })

  it('closes navigation in both breakpoint directions and removes the viewport listener on unmount', () => {
    const viewport = createViewport()
    const header = renderHeader()
    click(header.menuButton())
    click(header.disclosure('Mobile', 'Research'))
    viewport.change(true)
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()
    expect(header.disclosure('Primary', 'Research').getAttribute('aria-expanded')).toBe('false')

    click(header.disclosure('Primary', 'Experience'))
    expect(header.disclosure('Primary', 'Experience').getAttribute('aria-expanded')).toBe('true')
    viewport.change(false)
    expect(header.disclosure('Primary', 'Experience').getAttribute('aria-expanded')).toBe('false')
    expect(header.container.querySelector('#mobile-navigation')).toBeNull()
    header.rerender()
    expect(viewport.matchMedia).toHaveBeenCalledWith('(min-width: 1280px)')
    expect(viewport.add).toHaveBeenCalledOnce()
    const listener = viewport.add.mock.calls[0][1]
    header.unmount()
    expect(viewport.remove).toHaveBeenCalledExactlyOnceWith('change', listener)
  })

  it.each([
    ['/', ['Home', 'Home section']],
    ['/services', ['Services']],
    ['/research', ['Research', 'Research section']],
    ['/research/urarina-hybrid-retrieval', ['Research', 'Research section']],
    ['/experience/career-story', ['Experience']],
    ['/researchers', []],
  ])('marks only exact and nested route matches active at %s, including anchor links', (pathname, labels) => {
    router.pathname = pathname as string
    router.includeAnchorLinks = true
    createViewport()
    const header = renderHeader()
    const activeLabels = () => Array.from(header.container.querySelectorAll(
      'nav[aria-label="Primary"] a[aria-current="page"]'
    )).map((link) => link.textContent)
    expect(activeLabels()).toEqual(labels)
    click(header.menuButton())
    expect(Array.from(header.container.querySelectorAll(
      'nav[aria-label="Mobile"] a[aria-current="page"]'
    )).map((link) => link.textContent)).toEqual(labels)
  })

  it('balances global listeners across rerenders, closing and unmounting an open menu', () => {
    createViewport()
    const windowAdd = vi.spyOn(window, 'addEventListener')
    const windowRemove = vi.spyOn(window, 'removeEventListener')
    const documentAdd = vi.spyOn(document, 'addEventListener')
    const documentRemove = vi.spyOn(document, 'removeEventListener')
    const header = renderHeader()
    const subscriptions = [
      { add: windowAdd, remove: windowRemove, type: 'keydown' },
      { add: documentAdd, remove: documentRemove, type: 'pointerdown' },
      { add: documentAdd, remove: documentRemove, type: 'keydown' },
    ]
    const balances = () => subscriptions.map(({ add, remove, type }) =>
      add.mock.calls.filter(([event]) => event === type).length
      - remove.mock.calls.filter(([event]) => event === type).length
    )

    // The search shortcut remains registered while the header is mounted.
    expect(balances()).toEqual([1, 0, 0])
    click(header.menuButton())
    expect(balances()).toEqual([2, 1, 0])
    header.rerender()
    expect(balances()).toEqual([2, 1, 0])
    click(header.disclosure('Mobile', 'Research'))
    expect(balances()).toEqual([2, 2, 1])
    header.rerender()
    expect(balances()).toEqual([2, 2, 1])
    click(header.disclosure('Mobile', 'Research'))
    expect(balances()).toEqual([2, 1, 0])
    click(header.menuButton())
    expect(balances()).toEqual([1, 0, 0])

    click(header.menuButton())
    click(header.disclosure('Mobile', 'Experience'))
    expect(balances()).toEqual([2, 2, 1])
    header.unmount()
    expect(balances()).toEqual([0, 0, 0])
    for (const { add, remove, type } of subscriptions) {
      for (const [, listener] of add.mock.calls.filter(([event]) => event === type)) {
        expect(remove).toHaveBeenCalledWith(type, listener)
      }
    }
  })
})

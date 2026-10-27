// @vitest-environment happy-dom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HeaderNavigationItem } from '@/components/layout/header-navigation-item'
import type { NavigationItem } from '@/data/profile'

const research: NavigationItem = {
  label: 'Research',
  href: '/research',
  children: [
    { label: 'Research Overview', href: '/research' },
    { label: 'Writing', href: '/writing', separatorBefore: true },
    { label: 'External archive', href: 'https://example.org/archive', external: true },
  ],
}

interface Options {
  item?: NavigationItem
  active?: boolean
  mobile?: boolean
}

const roots = new Set<Root>()

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
})

afterEach(() => {
  for (const root of roots) act(() => root.unmount())
  roots.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})

function mount(options: Options = {}) {
  const container = document.createElement('div')
  const outside = document.createElement('button')
  outside.textContent = 'Unrelated control'
  document.body.append(container, outside)
  // Keep the real Next Link component and its handlers, without navigating the
  // test document or opening external tabs after an asserted link selection.
  container.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) event.preventDefault()
  }, true)
  const onChange = vi.fn()
  const onNavigate = vi.fn()
  const root = createRoot(container)
  roots.add(root)

  function ControlledItem({ item = research, active = false, mobile }: Options) {
    const [open, setOpen] = useState(false)
    return (
      <HeaderNavigationItem
        item={item}
        active={active}
        mobile={mobile}
        open={open}
        onOpenChange={(nextOpen) => {
          onChange(nextOpen)
          setOpen(nextOpen)
        }}
        onNavigate={() => {
          onNavigate()
          setOpen(false)
        }}
      />
    )
  }

  function rerender(nextOptions: Options) {
    act(() => root.render(<ControlledItem {...nextOptions} />))
  }
  rerender(options)

  function trigger() {
    const element = container.querySelector<HTMLButtonElement>('button')
    if (!element) throw new Error('Expected a disclosure trigger')
    return element
  }
  function topLink() {
    const element = container.querySelector<HTMLAnchorElement>('a')
    if (!element) throw new Error('Expected a top-level link')
    return element
  }
  function panel() { return container.querySelector<HTMLUListElement>('ul') }
  function child(index = 0) {
    const element = panel()?.querySelectorAll<HTMLAnchorElement>('a')[index]
    if (!element) throw new Error(`Expected dropdown link ${index}`)
    return element
  }
  function unmount() {
    act(() => root.unmount())
    roots.delete(root)
  }

  return { container, outside, trigger, topLink, panel, child, onChange, onNavigate, rerender, unmount }
}

function click(element: HTMLElement) { act(() => element.click()) }
function focus(element: HTMLElement) { act(() => element.focus()) }
function pointer(element: Element, type: 'pointerover' | 'pointerout' | 'pointerdown', pointerType = 'mouse', relatedTarget: EventTarget | null = null) {
  act(() => element.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType, relatedTarget })))
}
function key(element: HTMLElement, value: string) {
  act(() => element.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true })))
}

function observeGlobalListeners() {
  const add = vi.spyOn(document, 'addEventListener')
  const remove = vi.spyOn(document, 'removeEventListener')
  return (type: 'keydown' | 'pointerdown') => {
    const active = new Set(
      add.mock.calls.filter(([name]) => name === type).map(([, listener]) => listener)
    )
    for (const [name, listener] of remove.mock.calls) {
      if (name === type) active.delete(listener)
    }
    return active.size
  }
}

describe('HeaderNavigationItem direct destinations', () => {
  it.each([
    { mobile: false, active: false }, { mobile: false, active: true },
    { mobile: true, active: false }, { mobile: true, active: true },
  ])('renders a direct link for mobile=$mobile, active=$active', ({ mobile, active }) => {
    const view = mount({ item: { label: 'Home', href: '/' }, mobile, active })
    const link = view.topLink()
    expect(link.textContent).toBe('Home')
    expect(link.getAttribute('href')).toBe('/')
    expect(link.getAttribute('aria-current')).toBe(active ? 'page' : null)
    expect(link.className).toContain(mobile ? 'rounded-2xl' : 'rounded-full')
    expect(link.className).toContain(active ? 'bg-[var(--theme-frame-overlay-strong)]' : 'text-[var(--theme-frame-text-muted)]')
    expect(view.container.querySelector('button')).toBeNull()
    expect(view.panel()).toBeNull()
    click(link)
    expect(view.onNavigate).toHaveBeenCalledOnce()
    expect(view.onChange).not.toHaveBeenCalled()
  })

  it('treats an empty children collection as a normal link', () => {
    const view = mount({ item: { label: 'Services', href: '/services', children: [] } })
    expect(view.topLink().getAttribute('href')).toBe('/services')
    expect(view.container.querySelector('button')).toBeNull()
  })
})

describe('HeaderNavigationItem desktop disclosure', () => {
  it('opens on mouse hover and closes on pointer leave when neither pinned nor focused', () => {
    const view = mount()
    expect(view.trigger().getAttribute('aria-expanded')).toBe('false')
    pointer(view.topLink(), 'pointerover', 'mouse', view.outside)
    expect(view.trigger().getAttribute('aria-expanded')).toBe('true')
    expect(view.panel()?.id).toBe('desktop-research-navigation')
    expect(view.trigger().getAttribute('aria-controls')).toBe(view.panel()?.id)
    expect(view.panel()?.parentElement?.className).toContain('pt-2')
    pointer(view.child(), 'pointerout', 'mouse', view.outside)
    expect(view.panel()).toBeNull()
    expect(view.trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it.each(['touch', 'pen'])('does not open from a %s pointer entering', (pointerType) => {
    const view = mount()
    pointer(view.topLink(), 'pointerover', pointerType, view.outside)
    expect(view.panel()).toBeNull()
    expect(view.onChange).not.toHaveBeenCalled()
  })

  it('pins the first hover-open activation and closes on the second activation', () => {
    const view = mount()
    pointer(view.trigger(), 'pointerover', 'mouse', view.outside)
    click(view.trigger())
    pointer(view.trigger(), 'pointerout', 'mouse', view.outside)
    expect(view.panel()).not.toBeNull()
    click(view.trigger())
    expect(view.panel()).toBeNull()
    // Reopening is unpinned; an old pin cannot survive a controlled close.
    pointer(view.trigger(), 'pointerover', 'mouse', view.outside)
    pointer(view.trigger(), 'pointerout', 'mouse', view.outside)
    expect(view.panel()).toBeNull()
  })

  it('can open directly by activation and retains the top-level destination', () => {
    const view = mount({ active: true })
    expect(view.topLink().getAttribute('href')).toBe('/research')
    expect(view.topLink().getAttribute('aria-current')).toBe('page')
    click(view.trigger())
    expect(view.panel()).not.toBeNull()
    click(view.topLink())
    expect(view.onNavigate).toHaveBeenCalledOnce()
    expect(view.panel()).toBeNull()
  })

  it('opens on focus, keeps internal focus moves open, and closes when focus leaves', () => {
    const view = mount()
    focus(view.outside)
    focus(view.topLink())
    expect(view.panel()).not.toBeNull()
    expect(view.onChange).toHaveBeenCalledExactlyOnceWith(true)
    focus(view.trigger())
    focus(view.child())
    focus(view.child(1))
    expect(document.activeElement).toBe(view.child(1))
    expect(view.panel()).not.toBeNull()
    expect(view.onChange).toHaveBeenCalledOnce()
    pointer(view.child(1), 'pointerout', 'mouse', view.outside)
    expect(view.panel()).not.toBeNull()
    focus(view.outside)
    expect(document.activeElement).toBe(view.outside)
    expect(view.panel()).toBeNull()
  })

  it('clears a clicked pin when focus leaves, then permits a fresh hover dismissal', () => {
    const view = mount()
    focus(view.trigger())
    click(view.trigger())
    focus(view.child())
    focus(view.outside)
    expect(view.panel()).toBeNull()
    pointer(view.trigger(), 'pointerover', 'mouse', view.outside)
    pointer(view.trigger(), 'pointerout', 'mouse', view.outside)
    expect(view.panel()).toBeNull()
  })
})

describe('HeaderNavigationItem mobile disclosure', () => {
  it('uses tap activation instead of hover or focus and keeps a separately navigable overview', () => {
    const view = mount({ mobile: true })
    pointer(view.trigger(), 'pointerover', 'mouse', view.outside)
    focus(view.trigger())
    expect(view.panel()).toBeNull()
    expect(view.trigger().getAttribute('aria-expanded')).toBe('false')
    expect(view.trigger().getAttribute('aria-controls')).toBe('mobile-research-navigation')
    expect(view.trigger().className).toContain('h-12 w-12')
    click(view.trigger())
    expect(view.trigger().getAttribute('aria-expanded')).toBe('true')
    expect(view.panel()?.id).toBe('mobile-research-navigation')
    expect(view.panel()?.parentElement?.className).toContain('ml-4')
    pointer(view.trigger(), 'pointerout', 'mouse', view.outside)
    expect(view.panel()).not.toBeNull()
    focus(view.child())
    expect(document.activeElement).toBe(view.child())
    click(view.trigger())
    expect(view.panel()).toBeNull()
    click(view.topLink())
    expect(view.onNavigate).toHaveBeenCalledOnce()
  })
})

describe('HeaderNavigationItem keyboard and outside dismissal', () => {
  it('ignores unrelated keys and returns focus to its trigger after Escape inside', () => {
    const view = mount()
    focus(view.trigger())
    focus(view.child())
    key(view.child(), 'ArrowDown')
    expect(view.panel()).not.toBeNull()
    expect(document.activeElement).toBe(view.child())
    key(view.child(), 'Escape')
    expect(view.panel()).toBeNull()
    expect(view.trigger().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(view.trigger())
    expect(view.onChange.mock.calls.filter(([open]) => !open)).toHaveLength(1)
  })

  it('does not steal outside focus or consume another component\'s Escape key', () => {
    const view = mount()
    focus(view.outside)
    pointer(view.trigger(), 'pointerover', 'mouse', view.outside)
    const outsideEscape = vi.fn()
    window.addEventListener('keydown', outsideEscape)
    try {
      key(view.outside, 'Escape')
      expect(document.activeElement).toBe(view.outside)
      expect(view.panel()).toBeNull()
      expect(outsideEscape).toHaveBeenCalledOnce()
    } finally {
      window.removeEventListener('keydown', outsideEscape)
    }
  })

  it('keeps inside pointer interactions open and dismisses an outside pointer', () => {
    const view = mount()
    click(view.trigger())
    pointer(view.panel()!, 'pointerdown')
    pointer(view.child(), 'pointerdown')
    expect(view.panel()).not.toBeNull()
    view.onChange.mockClear()
    pointer(view.outside, 'pointerdown', 'touch')
    expect(view.panel()).toBeNull()
    expect(view.onChange).toHaveBeenCalledExactlyOnceWith(false)
    pointer(view.outside, 'pointerdown')
    expect(view.onChange).toHaveBeenCalledOnce()
  })

  it('registers listeners only while open and removes them across rerenders, closes and unmount', () => {
    const activeListeners = observeGlobalListeners()
    const view = mount()
    expect(activeListeners('keydown')).toBe(0)
    expect(activeListeners('pointerdown')).toBe(0)
    for (let iteration = 0; iteration < 3; iteration++) {
      click(view.trigger())
      expect(view.panel()).not.toBeNull()
      expect(activeListeners('keydown')).toBe(1)
      expect(activeListeners('pointerdown')).toBe(1)
      view.rerender({ active: iteration % 2 === 0 })
      expect(view.panel()).not.toBeNull()
      expect(activeListeners('keydown')).toBe(1)
      expect(activeListeners('pointerdown')).toBe(1)
      pointer(view.outside, 'pointerdown')
      expect(view.panel()).toBeNull()
      expect(activeListeners('keydown')).toBe(0)
      expect(activeListeners('pointerdown')).toBe(0)
    }
    click(view.trigger())
    expect(view.panel()).not.toBeNull()
    view.unmount()
    expect(activeListeners('keydown')).toBe(0)
    expect(activeListeners('pointerdown')).toBe(0)
    view.onChange.mockClear()
    pointer(view.outside, 'pointerdown')
    key(view.outside, 'Escape')
    expect(view.onChange).not.toHaveBeenCalled()
  })
})

describe('HeaderNavigationItem child destinations', () => {
  it('renders internal/external semantics and only the configured separator', () => {
    const view = mount()
    click(view.trigger())
    expect(view.panel()?.getAttribute('aria-label')).toBe('Research links')
    expect(view.topLink().getAttribute('aria-current')).toBeNull()
    expect(view.child().getAttribute('href')).toBe('/research')
    expect(view.child().getAttribute('target')).toBeNull()
    expect(view.child().getAttribute('rel')).toBeNull()
    expect(view.child().querySelector('.sr-only')).toBeNull()
    expect(view.child().parentElement?.className).not.toContain('border-t')
    expect(view.child(1).getAttribute('href')).toBe('/writing')
    expect(view.child(1).parentElement?.className).toContain('border-t')
    expect(view.child(2).parentElement?.className).not.toContain('border-t')
    expect(view.child(2).getAttribute('href')).toBe('https://example.org/archive')
    expect(view.child(2).getAttribute('target')).toBe('_blank')
    expect(view.child(2).getAttribute('rel')).toBe('noopener noreferrer')
    expect(view.child(2).querySelector('.sr-only')?.textContent).toContain('opens in a new tab')
    expect(view.container.querySelector('[role="menu"], [role="menuitem"]')).toBeNull()
  })

  it.each([0, 1, 2])('selecting child %i notifies navigation and closes the controlled disclosure', (index) => {
    const view = mount({ mobile: true })
    click(view.trigger())
    click(view.child(index))
    expect(view.onNavigate).toHaveBeenCalledOnce()
    expect(view.panel()).toBeNull()
    expect(view.trigger().getAttribute('aria-expanded')).toBe('false')
  })
})

// @vitest-environment happy-dom
import { act, createElement, type ComponentProps, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

const route = vi.hoisted(() => ({ pathname: '/', search: new URLSearchParams() }))
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname, useSearchParams: () => route.search }))
vi.mock('next/script', () => ({ default: ({ children, src, id }: { children?: ReactNode; src?: string; id?: string }) => <div data-script-source={src} id={id}>{children}</div> }))
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: { div: ({ children, className }: ComponentProps<'div'>) => <div className={className}>{children}</div> },
}))

let root: Root
let container: HTMLDivElement
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  route.pathname = '/'
  route.search = new URLSearchParams()
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  delete window.gtag
  vi.unstubAllEnvs()
  vi.useRealTimers()
  vi.resetModules()
})

describe('optional analytics and rotating status', () => {
  test('analytics is absent when no public measurement ID is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_ID', '')
    const { GoogleAnalytics } = await import('@/components/analytics/google-analytics')
    await act(async () => root.render(<GoogleAnalytics />))
    expect(container.childElementCount).toBe(0)
    expect(window.gtag).toBeUndefined()
  })

  test('analytics delegates initial load to the script and tracks later routes only after gtag is available', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_ID', 'G-TEST-ID')
    const { GoogleAnalytics } = await import('@/components/analytics/google-analytics')
    const track = vi.fn()
    window.gtag = track
    await act(async () => root.render(<GoogleAnalytics />))
    expect(track).not.toHaveBeenCalled()
    expect(container.querySelector('[data-script-source]')?.getAttribute('data-script-source')).toContain('id=G-TEST-ID')
    expect(container.querySelector('#google-analytics')?.textContent).toContain("gtag('config', 'G-TEST-ID')")
    delete window.gtag
    route.pathname = '/experience'
    await act(async () => root.render(<GoogleAnalytics />))
    expect(track).not.toHaveBeenCalled()
    window.gtag = track
    document.title = 'Portfolio research'
    route.pathname = '/research'
    route.search = new URLSearchParams('topic=retrieval')
    await act(async () => root.render(<GoogleAnalytics />))
    expect(track).toHaveBeenLastCalledWith('event', 'page_view', { page_path: '/research?topic=retrieval', page_location: window.location.href, page_title: 'Portfolio research' })
    route.pathname = '/writing'
    route.search = new URLSearchParams()
    await act(async () => root.render(<GoogleAnalytics />))
    expect(track).toHaveBeenLastCalledWith('event', 'page_view', expect.objectContaining({ page_path: '/writing' }))
    expect(track).toHaveBeenCalledTimes(2)
  })

  test('the current-status cycle wraps and disposes its timer in both layout variants', async () => {
    vi.useFakeTimers()
    const { CurrentStatus } = await import('@/components/layout/current-status')
    await act(async () => root.render(<CurrentStatus />))
    expect(container.textContent).toContain('Studying:')
    for (const expected of ['Automation Platforms', 'Operational Software', 'Applied AI Workflows', "AI Master's @ St. Thomas"]) {
      await act(async () => { vi.advanceTimersByTime(4000) })
      expect(container.textContent).toContain(expected)
    }
    await act(async () => root.render(<CurrentStatus compact className="custom-status" />))
    expect(container.textContent).not.toContain('Studying:')
    expect(container.querySelector('.custom-status')).not.toBeNull()
    await act(async () => root.render(null))
    expect(vi.getTimerCount()).toBe(0)
  })

  test('the theme provider keeps its children available during server rendering', async () => {
    const { ThemeProvider } = await import('@/providers/theme-provider')
    const markup = renderToStaticMarkup(createElement(ThemeProvider, null, <p>Theme-aware content</p>))
    expect(markup).toContain('Theme-aware content')
    expect(markup).toContain('class')
    expect(markup).toContain('system')
  })
})

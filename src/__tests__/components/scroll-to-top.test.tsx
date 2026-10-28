// @vitest-environment happy-dom
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { cleanupMountedUi, click, element, mount, stubBrowserHistory } from '../helpers/mounted-ui'

const route = vi.hoisted(() => ({ pathname: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => route.pathname }))
vi.mock('framer-motion', async () => {
  const { createElement, Fragment } = await import('react')
  return { motion: { button: (props: Record<string, unknown>) => createElement('button', Object.fromEntries(Object.entries(props).filter(([key]) => !['initial', 'animate', 'exit', 'transition'].includes(key)))) }, AnimatePresence: ({ children }: { children: React.ReactNode }) => createElement(Fragment, null, children) }
})

let scroll: ReturnType<typeof vi.spyOn>
let navigation: typeof import('@/lib/content-navigation')
const tick = async (time = 40) => { await act(async () => vi.advanceTimersByTimeAsync(time)) }
function pageShow(persisted: boolean) {
  const event = new Event('pageshow')
  Object.defineProperty(event, 'persisted', { value: persisted })
  act(() => window.dispatchEvent(event))
}

beforeEach(async () => {
  vi.resetModules(); vi.useFakeTimers(); vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  stubBrowserHistory()
  route.pathname = '/'
  window.history.replaceState(null, '', '/')
  Object.defineProperty(window.history, 'scrollRestoration', { configurable: true, writable: true, value: 'auto' })
  Object.defineProperty(document, 'fonts', { configurable: true, value: undefined })
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
  scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  navigation = await import('@/lib/content-navigation')
})
afterEach(async () => { cleanupMountedUi(); navigation.cancelContentNavigation(); await tick(1); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })

describe('ScrollToTop lifecycle', () => {
  test('resets initial and changed routes, restores history policy and cancels scheduled frames on unmount', async () => {
    const { ScrollToTop } = await import('@/components/layout/scroll-to-top')
    document.documentElement.scrollTop = 50; document.body.scrollTop = 70
    const app = mount(<ScrollToTop />)
    expect(window.history.scrollRestoration).toBe('manual')
    expect(scroll).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'auto' })
    expect(document.documentElement.scrollTop).toBe(0)
    expect(document.body.scrollTop).toBe(0)
    app.render(<ScrollToTop />)
    expect(scroll).toHaveBeenCalledOnce()
    route.pathname = '/writing'; window.history.pushState(null, '', '/writing')
    app.render(<ScrollToTop />)
    await tick()
    expect(scroll).toHaveBeenCalledTimes(2)
    route.pathname = '/research'; window.history.pushState(null, '', '/research')
    app.render(<ScrollToTop />)
    const cancel = vi.spyOn(window, 'cancelAnimationFrame')
    app.unmount()
    await tick()
    expect(scroll).toHaveBeenCalledTimes(2)
    expect(cancel).toHaveBeenCalled()
    expect(window.history.scrollRestoration).toBe('auto')
  })

  test('shows the scroll control only past its threshold and respects reduced motion on activation', async () => {
    const { ScrollToTop } = await import('@/components/layout/scroll-to-top')
    const app = mount(<ScrollToTop />)
    expect(document.querySelector('[aria-label="Back to top"]')).toBeNull()
    vi.mocked(window.scrollTo).mockClear()
    for (const [offset, shown] of [[320, false], [321, true], [0, false]] as const) {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(offset)
      act(() => window.dispatchEvent(new Event('scroll')))
      expect(document.querySelector('[aria-label="Back to top"]') !== null).toBe(shown)
    }
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500)
    act(() => window.dispatchEvent(new Event('scroll')))
    const media = vi.spyOn(window, 'matchMedia')
    media.mockReturnValue({ matches: false } as MediaQueryList)
    click(element('[aria-label="Back to top"]'))
    expect(scroll).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'smooth' })
    media.mockReturnValue({ matches: true } as MediaQueryList)
    click(element('[aria-label="Back to top"]'))
    expect(scroll).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'instant' })
    const remove = vi.spyOn(window, 'removeEventListener')
    app.unmount()
    expect(remove.mock.calls.some(([type]) => type === 'scroll')).toBe(true)
  })

  test('preserves initial and route-change fragments and ignores nonpersisted page shows', async () => {
    const { ScrollToTop } = await import('@/components/layout/scroll-to-top')
    window.history.replaceState(null, '', '/#missing')
    const app = mount(<ScrollToTop />)
    expect(scroll).not.toHaveBeenCalled()
    pageShow(true)
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    route.pathname = '/research'; window.history.pushState(null, '', '/research#missing')
    app.render(<ScrollToTop />)
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    window.history.replaceState(null, '', '/research')
    navigation.cancelContentNavigation()
    pageShow(false)
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    pageShow(true)
    await tick()
    expect(scroll).toHaveBeenCalledOnce()
  })

  test('a fragment or pending content navigation supersedes an already scheduled route reset', async () => {
    const { ScrollToTop } = await import('@/components/layout/scroll-to-top')
    const app = mount(<ScrollToTop />)
    scroll.mockClear()
    route.pathname = '/research'; window.history.pushState(null, '', '/research')
    app.render(<ScrollToTop />)
    window.history.replaceState(null, '', '/research#content-later')
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    route.pathname = '/writing'; window.history.pushState(null, '', '/writing')
    app.render(<ScrollToTop />)
    navigation.prepareContentNavigation('/writing#content-later')
    expect(navigation.hasContentNavigation()).toBe(true)
    await tick()
    expect(scroll).not.toHaveBeenCalled()
  })

  test.each(['unsupported', 'empty'] as const)('supports browsers with %s history restoration state', async state => {
    const { ScrollToTop } = await import('@/components/layout/scroll-to-top')
    if (state === 'unsupported') vi.spyOn(window, 'history', 'get').mockReturnValue({} as History)
    else Object.defineProperty(window.history, 'scrollRestoration', { configurable: true, writable: true, value: '' })
    const app = mount(<ScrollToTop />)
    expect(scroll).toHaveBeenCalledOnce()
    app.unmount()
    expect(window.history.scrollRestoration).toBe(state === 'unsupported' ? undefined : 'manual')
  })
})

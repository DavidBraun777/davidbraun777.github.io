// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { ContentDestination } from '@/lib/search/destinations'
import { deferred, stubBrowserHistory } from '../helpers/mounted-ui'

let navigation: typeof import('@/lib/content-navigation')
let dispose: (() => void) | undefined
let scroll: ReturnType<typeof vi.spyOn>
const destination: ContentDestination = { page: '/details', anchor: 'content-leaf', label: 'Specific result', disclosureIds: [], fallbackAnchor: 'parent' }
const rect = (left = 20, right = 100, top = 200, height = 40) => ({ left, right, top, bottom: top + height, width: right - left, height, x: left, y: top, toJSON() {} })
const tick = async (time = 34) => { await vi.advanceTimersByTimeAsync(time) }

beforeEach(async () => {
  vi.resetModules(); vi.useFakeTimers()
  stubBrowserHistory()
  navigation = await import('@/lib/content-navigation')
  window.history.replaceState(null, '', '/details')
  document.body.innerHTML = '<header></header><main id="main-content"><h1 id="page-title">Page title</h1><section id="parent">Parent</section></main>'
  Object.defineProperty(document, 'fonts', { configurable: true, value: { status: 'loaded', ready: Promise.resolve() } })
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([rect()] as unknown as DOMRectList)
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect())
  scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  dispose = undefined
})
afterEach(() => {
  dispose?.(); navigation.cancelContentNavigation(); vi.restoreAllMocks(); vi.useRealTimers(); document.body.replaceChildren()
})

function mount() { dispose = navigation.mountContentNavigation(); navigation.contentRouteCommitted('/details') }
function request(href = '/details#content-leaf', target?: ContentDestination) {
  navigation.prepareContentNavigation(href, target)
  window.history.pushState(null, '', href)
  navigation.releaseContentNavigation()
}
function leaf() {
  const node = document.createElement('p'); node.id = 'content-leaf'; node.textContent = 'Specific text'
  document.querySelector('main')!.append(node)
  return node
}

describe('content-navigation boundaries and recovery', () => {
  test('rejects external, malformed and fragmentless URLs and safely releases an absent request', async () => {
    mount()
    for (const href of ['https://external.test/#target', 'http://[invalid', '/details']) {
      navigation.prepareContentNavigation(href)
      expect(navigation.hasContentNavigation()).toBe(false)
      navigation.releaseContentNavigation()
    }
    await tick()
    expect(scroll).not.toHaveBeenCalled()
  })

  test('waits for the exact committed route/hash, fonts and a visible target', async () => {
    const fonts = deferred<void>()
    Object.defineProperty(document, 'fonts', { configurable: true, value: { status: 'loading', ready: fonts.promise } })
    const target = leaf()
    mount()
    navigation.prepareContentNavigation('/details#content-leaf', destination)
    navigation.releaseContentNavigation()
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    window.history.pushState(null, '', '/details#content-leaf')
    navigation.contentRouteCommitted('/other')
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    navigation.contentRouteCommitted('/details')
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    vi.spyOn(target, 'getClientRects').mockReturnValue([] as unknown as DOMRectList)
    fonts.resolve()
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    vi.mocked(target.getClientRects).mockReturnValue([rect()] as unknown as DOMRectList)
    target.style.visibility = 'hidden'; navigation.notifyContentLayout()
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    target.style.visibility = 'visible'; navigation.notifyContentLayout()
    await tick()
    expect(document.activeElement).toBe(target)
    expect(target.tabIndex).toBe(-1)
    expect(target.style.scrollMarginTop).toBe('56px')
    expect(target.hasAttribute('data-content-active')).toBe(true)
    expect(navigation.hasContentNavigation()).toBe(false)
    await tick(3500)
    expect(target.hasAttribute('data-content-active')).toBe(false)
  })

  test('an unmounted font readiness callback never resumes navigation', async () => {
    const fonts = deferred<void>()
    Object.defineProperty(document, 'fonts', { configurable: true, value: { status: 'loading', ready: fonts.promise } })
    leaf(); mount(); request()
    dispose!(); dispose = undefined
    fonts.resolve()
    await tick()
    expect(navigation.hasContentNavigation()).toBe(false)
    expect(scroll).not.toHaveBeenCalled()
  })

  test('replacement manifests and disclosure registrations survive stale cleanup and wait for their state owner', async () => {
    const details = document.createElement('details'); details.id = 'panel'
    const target = leaf(); target.tabIndex = 0; details.append(target); document.querySelector('main')!.append(details)
    const panelDestination = { ...destination, disclosureIds: ['panel'] }
    const oldManifest = navigation.registerContentDestinations('/details', [{ ...destination, anchor: 'old' }])
    const currentManifest = navigation.registerContentDestinations('/details', [panelDestination])
    oldManifest()
    mount(); request()
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    const outdated = vi.fn(), current = vi.fn(() => { details.open = true; navigation.notifyContentLayout() })
    const oldPanel = navigation.registerContentDisclosure(details, outdated)
    const newPanel = navigation.registerContentDisclosure(details, current)
    oldPanel()
    await tick(68)
    expect(outdated).not.toHaveBeenCalled()
    expect(current).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(target)
    expect(target.tabIndex).toBe(0)
    newPanel(); currentManifest()
    details.open = false
    request()
    await tick()
    expect(current).toHaveBeenCalledOnce()
    expect(navigation.hasContentNavigation()).toBe(true)
  })

  test('missing declared panels pause normal navigation and stale requests use the declared parent', async () => {
    leaf(); navigation.registerContentDestinations('/details', [{ ...destination, disclosureIds: ['not-yet-mounted'] }])
    mount(); request()
    await tick()
    expect(scroll).not.toHaveBeenCalled()
    document.getElementById('content-leaf')!.remove()
    await tick(5000)
    expect(document.activeElement?.id).toBe('parent')
    expect(navigation.hasContentNavigation()).toBe(false)
  })

  test.each([
    ['semantic ancestor', '/details#content-parent--row--cell', '<section id="content-parent">Ancestor</section>', 'content-parent'],
    ['page heading', '/details#content-missing--row', '', 'page-title'],
    ['malformed fragment', '/details#%E0%A4%A', '', 'page-title'],
  ])('a ready manifest resolves an obsolete URL to its %s', async (_label, href, markup, id) => {
    document.querySelector('main')!.insertAdjacentHTML('beforeend', markup)
    navigation.registerContentDestinations('/details', [])
    mount(); request(href)
    await tick()
    expect(document.activeElement?.id).toBe(id)
    expect(scroll).toHaveBeenCalledOnce()
  })

  test('falls back to main when a parent and page heading are missing and tolerates absent main entirely', async () => {
    document.querySelector('header')!.remove(); document.querySelector('h1')!.remove()
    Object.defineProperty(document, 'fonts', { configurable: true, value: undefined })
    mount(); request('/details#missing', { ...destination, anchor: 'missing', fallbackAnchor: 'not-present' })
    await tick(5034)
    expect(document.activeElement?.id).toBe('main-content')
    expect(document.getElementById('main-content')!.style.scrollMarginTop).toBe('112px')
    document.querySelector('main')!.remove()
    request('/details#missing')
    await tick(6050)
    expect(navigation.hasContentNavigation()).toBe(false)
    expect(scroll).toHaveBeenCalledOnce()
  })

  test('cancels a paused or departed request at its deadline without moving focus', async () => {
    mount()
    navigation.prepareContentNavigation('/details#content-leaf')
    await tick(4999)
    expect(navigation.hasContentNavigation()).toBe(true)
    await tick(2)
    expect(navigation.hasContentNavigation()).toBe(false)
    request()
    window.history.pushState(null, '', '/elsewhere')
    await tick(4999)
    expect(navigation.hasContentNavigation()).toBe(true)
    await tick(2)
    expect(navigation.hasContentNavigation()).toBe(false)
    expect(scroll).not.toHaveBeenCalled()
  })

  test('replacing a pending request clears both its original and fallback deadlines', async () => {
    document.querySelector('main')!.remove()
    mount(); request('/details#first')
    await tick(2500)
    request('/details#second')
    await tick(2501)
    expect(navigation.hasContentNavigation()).toBe(true)
    expect(scroll).not.toHaveBeenCalled()
    // The second request enters fallback, then a third request replaces it.
    await tick(2500)
    request('/details#third')
    await tick(1001)
    expect(navigation.hasContentNavigation()).toBe(true)
    expect(scroll).not.toHaveBeenCalled()
    navigation.cancelContentNavigation()
    await tick(5000)
    expect(navigation.hasContentNavigation()).toBe(false)
  })

  test.each([[0, 40, true], [130, 170, true], [20, 100, false]])('keeps horizontal scrolling inside the table for cell bounds %s..%s', async (left, right, moves) => {
    document.querySelector('main')!.insertAdjacentHTML('beforeend', '<div data-content-table><table><tbody><tr id="row"><td id="content-leaf">Cell</td></tr></tbody></table></div>')
    const cell = document.getElementById('content-leaf')!, table = document.querySelector<HTMLElement>('[data-content-table]')!, row = document.getElementById('row')!
    cell.getBoundingClientRect = vi.fn(() => rect(left, right))
    table.getBoundingClientRect = vi.fn(() => rect(0, 120))
    const horizontal = vi.spyOn(table, 'scrollTo').mockImplementation(() => {})
    mount(); request()
    await tick()
    expect(horizontal).toHaveBeenCalledTimes(moves ? 1 : 0)
    expect(cell.hasAttribute('data-content-active')).toBe(true)
    expect(row.hasAttribute('data-content-active')).toBe(true)
    request('/details#row')
    expect(cell.hasAttribute('data-content-active')).toBe(false)
    await tick()
    expect(document.activeElement).toBe(row)
  })

  test('deduplicates companion fragment events but treats popstate as a deliberate return', async () => {
    leaf(); mount(); request()
    window.dispatchEvent(new Event('hashchange'))
    await tick()
    expect(scroll).toHaveBeenCalledOnce()
    window.dispatchEvent(new Event('hashchange')); window.dispatchEvent(new Event('pageshow'))
    navigation.contentRouteCommitted('/details')
    await tick()
    expect(scroll).toHaveBeenCalledOnce()
    window.dispatchEvent(new Event('popstate'))
    await tick()
    expect(scroll).toHaveBeenCalledTimes(2)
  })

  test('follows ordinary same-origin links but ignores modified, cancelled, dialog, download and external navigation', async () => {
    leaf(); mount()
    const click = (html: string, options: MouseEventInit = {}, cancelled = false) => {
      const wrapper = document.createElement('div'); wrapper.innerHTML = html; document.body.append(wrapper)
      const target = wrapper.querySelector('span') ?? wrapper.firstElementChild!
      // The capture-phase controller runs first; stop the browser boundary from fetching pages.
      target.addEventListener('click', event => event.preventDefault(), { once: true })
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...options })
      if (cancelled) event.preventDefault()
      target.dispatchEvent(event); wrapper.remove()
    }
    const link = '<a href="/details#content-leaf"><span>Target</span></a>'
    for (const options of [{ button: 1 }, { metaKey: true }, { ctrlKey: true }, { altKey: true }, { shiftKey: true }]) {
      click(link, options); expect(navigation.hasContentNavigation()).toBe(false)
    }
    click(link, {}, true)
    for (const html of ['<button>Other</button>', '<div role="dialog"><a href="/details#content-leaf">Modal</a></div>', '<a href="/details#content-leaf" download>Download</a>', '<a href="/details#content-leaf" target="_blank">New tab</a>', '<a href="https://external.test/#target">External</a>']) {
      click(html); expect(navigation.hasContentNavigation()).toBe(false)
    }
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(navigation.hasContentNavigation()).toBe(false)
    click(link)
    expect(navigation.hasContentNavigation()).toBe(true)
    window.history.replaceState(null, '', '/details#content-leaf')
    await tick()
    expect(document.activeElement?.id).toBe('content-leaf')
  })
})

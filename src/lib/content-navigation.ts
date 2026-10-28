'use client'

import type { ContentDestination } from '@/lib/search/destinations'

interface DisclosureRegistration {
  element: HTMLDetailsElement
  open: () => void
}
interface NavigationRequest {
  url: URL
  destination?: ContentDestination
  paused: boolean
  fallbackOnly: boolean
}

const manifests = new Map<string, Map<string, ContentDestination>>()
const disclosures = new Map<HTMLDetailsElement, DisclosureRegistration>()
let request: NavigationRequest | null = null
let renderedPage = ''
let frame = 0
let deadline = 0
let observer: MutationObserver | undefined
let highlighted: HTMLElement[] = []
let highlightTimer = 0
let fontsReady = false
let settledHref = ''

function clearHighlight() {
  window.clearTimeout(highlightTimer)
  highlighted.forEach(element => element.removeAttribute('data-content-active'))
  highlighted = []
}

export function cancelContentNavigation() {
  request = null
  cancelAnimationFrame(frame)
  window.clearTimeout(deadline)
  observer?.disconnect()
  observer = undefined
}

export function hasContentNavigation() {
  return !!request
}

function urlFor(href: string) {
  try {
    const url = new URL(href, window.location.origin)
    return url.origin === window.location.origin ? url : null
  } catch { return null }
}

function fragment(url: URL) {
  try { return decodeURIComponent(url.hash.slice(1)) } catch { return '' }
}

/** Records intent before the dialog unmounts; the close lifecycle releases it. */
export function prepareContentNavigation(href: string, destination?: ContentDestination) {
  startRequest(href, destination, true)
}

export function releaseContentNavigation() {
  if (!request) return
  request.paused = false
  notifyContentLayout()
}

function startRequest(href: string, destination?: ContentDestination, paused = false) {
  cancelContentNavigation()
  clearHighlight()
  settledHref = ''
  const url = urlFor(href)
  if (!url?.hash) return
  const active: NavigationRequest = { url, destination, paused, fallbackOnly: false }
  request = active
  // Only a failed/stale destination uses this deadline. Successful navigation is
  // driven by registrations, route commits, fonts and layout, never a fixed delay.
  deadline = window.setTimeout(() => {
    // Cancellation clears the sole stored deadline before a request is replaced;
    // timer callbacks run to completion, so this callback still owns active.
    if (active.paused || window.location.pathname !== active.url.pathname) {
      cancelContentNavigation()
      return
    }
    active.fallbackOnly = true
    // A fallback may itself need a React disclosure commit. Give that lifecycle
    // a bounded opportunity to finish; this timer never schedules the scroll.
    deadline = window.setTimeout(cancelContentNavigation, 1000)
    notifyContentLayout()
  }, 5000)
  const main = document.getElementById('main-content')
  if (main) {
    observer = new MutationObserver(notifyContentLayout)
    observer.observe(main, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'hidden'] })
  }
  notifyContentLayout()
}

export function registerContentDestinations(page: string, destinations: ContentDestination[]) {
  const manifest = new Map(destinations.map(destination => [destination.anchor, destination]))
  manifests.set(page, manifest)
  notifyContentLayout()
  return () => { if (manifests.get(page) === manifest) manifests.delete(page) }
}

export function registerContentDisclosure(element: HTMLDetailsElement, open: () => void) {
  const registration = { element, open }
  disclosures.set(element, registration)
  notifyContentLayout()
  return () => { if (disclosures.get(element) === registration) disclosures.delete(element) }
}

export function notifyContentLayout() {
  if (!request) return
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(attemptNavigation)
}

function reveal(element: HTMLDetailsElement) {
  if (element.open) return true
  const registration = disclosures.get(element)
  if (registration) registration.open()
  // Unregistered details may still be hydrating. Wait for their state owner.
  return false
}

function fallbackTarget(active: NavigationRequest, destination?: ContentDestination) {
  if (destination?.fallbackAnchor) {
    const parent = document.getElementById(destination.fallbackAnchor)
    if (parent) return parent
  }
  let id = fragment(active.url)
  while (id.includes('--')) {
    id = id.slice(0, id.lastIndexOf('--'))
    const parent = document.getElementById(id)
    if (parent) return parent
  }
  return document.querySelector<HTMLElement>('#main-content h1') ?? document.getElementById('main-content')
}

function attemptNavigation() {
  const active = request
  if (!active || active.paused) return
  if (window.location.pathname !== active.url.pathname || window.location.hash !== active.url.hash || renderedPage !== active.url.pathname) {
    // Next may commit a same-page hash without a hashchange event or DOM mutation.
    // Poll just this pending URL, bounded by the stale-request deadline.
    notifyContentLayout()
    return
  }
  if (!fontsReady && !active.fallbackOnly) return
  const id = fragment(active.url)
  const manifest = manifests.get(active.url.pathname)
  const destination = manifest?.get(id) ?? active.destination
  for (const disclosureId of active.fallbackOnly ? [] : destination?.disclosureIds ?? []) {
    const panel = document.getElementById(disclosureId)
    if (!(panel instanceof HTMLDetailsElement)) {
      // Fallback requests skip this loop; ordinary requests wait for their panel.
      return
    }
    if (!reveal(panel)) return
  }
  let target = document.getElementById(id)
  // A ready local manifest can identify an obsolete URL immediately.
  if (!target && (active.fallbackOnly || (manifest && !destination))) target = fallbackTarget(active, destination)
  if (!target) return
  const ancestors: HTMLDetailsElement[] = []
  for (let element: HTMLElement | null = target; element; element = element.parentElement) {
    if (element instanceof HTMLDetailsElement) ancestors.unshift(element)
  }
  for (const panel of ancestors) if (!reveal(panel)) return
  if (!target.getClientRects().length || getComputedStyle(target).visibility === 'hidden') return

  const header = document.querySelector<HTMLElement>('body header')
  const clearance = (header?.getBoundingClientRect().height ?? 96) + 16
  target.style.scrollMarginTop = `${clearance}px`
  // Move only a table's scroll container horizontally; never the page itself.
  const table = target.closest<HTMLElement>('[data-content-table]')
  if (table) {
    const cell = target.getBoundingClientRect()
    const box = table.getBoundingClientRect()
    if (cell.left < box.left + 8 || cell.right > box.right - 8) {
      table.scrollTo({ left: table.scrollLeft + cell.left - box.left - 8, behavior: 'instant' })
    }
  }
  window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - clearance, behavior: 'instant' })
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1
  target.focus({ preventScroll: true })
  clearHighlight()
  highlighted = [target]
  const row = target.closest('tr')
  if (row && row !== target) highlighted.push(row)
  highlighted.forEach(element => element.setAttribute('data-content-active', ''))
  highlightTimer = window.setTimeout(clearHighlight, 3500)
  settledHref = active.url.href
  cancelContentNavigation()
}

/** Called by the existing scroll controller after React commits the route. */
export function contentRouteCommitted(pathname: string) {
  renderedPage = pathname
  if (request?.url.pathname === pathname) {
    notifyContentLayout()
  } else {
    syncFragmentNavigation()
  }
}

function syncFragmentNavigation(event?: Event) {
  if (request?.url.href === window.location.href) {
    notifyContentLayout()
    return
  }
  // popstate and hashchange can describe one traversal. A late companion event
  // must not steal focus or scroll again after the destination has settled.
  if (!request && settledHref === window.location.href && event?.type !== 'popstate') return
  startRequest(window.location.href)
}

export function mountContentNavigation() {
  settledHref = ''
  fontsReady = !document.fonts || document.fonts.status === 'loaded'
  let mounted = true
  document.fonts?.ready.then(() => {
    if (!mounted) return
    fontsReady = true
    notifyContentLayout()
  })
  const followLink = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
    if (!(anchor instanceof HTMLAnchorElement) || anchor.closest('[role="dialog"]') || anchor.target === '_blank' || anchor.hasAttribute('download')) return
    const url = urlFor(anchor.href)
    if (url) startRequest(url.href)
  }
  window.addEventListener('hashchange', syncFragmentNavigation)
  window.addEventListener('popstate', syncFragmentNavigation)
  window.addEventListener('pageshow', syncFragmentNavigation)
  document.addEventListener('click', followLink, true)
  syncFragmentNavigation()
  return () => {
    mounted = false
    cancelContentNavigation()
    clearHighlight()
    window.removeEventListener('hashchange', syncFragmentNavigation)
    window.removeEventListener('popstate', syncFragmentNavigation)
    window.removeEventListener('pageshow', syncFragmentNavigation)
    document.removeEventListener('click', followLink, true)
  }
}

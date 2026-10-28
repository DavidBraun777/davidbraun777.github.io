// @vitest-environment happy-dom
import { act, createRef } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkAction } from '@/components/ui/external-link-action'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input, Select, Textarea } from '@/components/ui/input'
import { SectionHeader } from '@/components/ui/section-header'
import { MobileSectionDisclosure } from '@/components/ui/mobile-section-disclosure'
import { ImageLightbox } from '@/components/ui/image-lightbox'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { ContentDetails, DisclosurePanel } from '@/components/site/disclosure-panel'
import { ContentDestinationManifest } from '@/components/site/content-destination-manifest'
import { cancelContentNavigation, contentRouteCommitted, mountContentNavigation, prepareContentNavigation, releaseContentNavigation } from '@/lib/content-navigation'
import { changeValue, cleanupMountedUi, click, element, mount } from '../helpers/mounted-ui'

const theme = vi.hoisted(() => ({ resolvedTheme: 'dark', setTheme: vi.fn() }))
vi.mock('next-themes', () => ({ useTheme: () => theme }))
vi.mock('framer-motion', async () => {
  const { createElement, Fragment } = await import('react')
  return { motion: { div: (props: Record<string, unknown>) => createElement('div', Object.fromEntries(Object.entries(props).filter(([key]) => !['initial', 'animate', 'exit', 'transition'].includes(key)))) }, AnimatePresence: ({ children }: { children: React.ReactNode }) => createElement(Fragment, null, children) }
})

beforeEach(() => { vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true); vi.useFakeTimers(); theme.setTheme.mockClear() })
afterEach(async () => { cancelContentNavigation(); cleanupMountedUi(); await act(async () => vi.advanceTimersByTimeAsync(1)); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers() })
const settle = async (time = 200) => { await act(async () => vi.advanceTimersByTimeAsync(time)) }

describe('reusable UI controls', () => {
  test('badges forward their ref and external actions identify destinations safely in both presentations', () => {
    const ref = createRef<HTMLSpanElement>()
    const app = mount(<><Badge ref={ref} className="custom-badge">Status</Badge><ExternalLinkAction href="https://example.test/">Visit project</ExternalLinkAction></>)
    expect(ref.current?.textContent).toBe('Status')
    expect(ref.current?.className).toContain('custom-badge')
    expect(element('a').textContent).toBe('Visit project')
    expect(element('a').getAttribute('rel')).toBe('noopener noreferrer')
    expect(element('a').getAttribute('target')).toBe('_blank')
    app.render(<ExternalLinkAction href="https://example.test/" iconOnly ariaLabel="Visit project" className="custom-action" />)
    expect(element('[aria-label="Visit project"]').getAttribute('href')).toBe('https://example.test/')
    expect(element('a').className).toContain('custom-action')
    expect(element('a').getAttribute('rel')).toBe('noopener noreferrer')
  })
  test('forwards field labels, refs, values, callbacks and error styles for inputs, textareas and selects', () => {
    const input = createRef<HTMLInputElement>(), textarea = createRef<HTMLTextAreaElement>(), select = createRef<HTMLSelectElement>()
    const changed = vi.fn()
    const options = [{ value: 'one', label: 'Option one' }]
    const app = mount(<><Input ref={input} id="input" label="Name" error="Name required" className="custom-input" onChange={changed} /><Textarea ref={textarea} id="textarea" label="Message" error="Message required" onChange={changed} /><Select ref={select} id="select" label="Choice" error="Choice required" placeholder="Choose" options={options} value="" onChange={changed} /></>)
    for (const ref of [input, textarea, select]) {
      expect(ref.current?.className).toContain('border-red-500')
      expect(element(`label[for="${ref.current!.id}"]`).textContent).toBeTruthy()
      changeValue(ref.current!, ref === select ? 'one' : 'Updated')
    }
    expect(changed).toHaveBeenCalledTimes(3)
    expect(input.current?.className).toContain('custom-input')
    expect(select.current?.className).toContain('text-text-muted')
    app.render(<><Input id="input" aria-label="Name" /><Textarea id="textarea" aria-label="Message" /><Select id="select" aria-label="Choice" options={options} value="one" onChange={changed} /></>)
    expect(document.querySelector('label')).toBeNull()
    expect(document.querySelector('p')).toBeNull()
    expect(element('#input').className).toContain('border-border-subtle')
    expect(element('#textarea').className).toContain('border-border-subtle')
    expect(element('#select').className).not.toContain('text-text-muted')
    expect(document.querySelectorAll('option')).toHaveLength(1)
  })

  test('button pending and disabled states prevent activation and preserve configurable styles', () => {
    const clicked = vi.fn()
    const app = mount(<Button onClick={clicked}>Save</Button>)
    click(element('button'))
    expect(clicked).toHaveBeenCalledTimes(1)
    expect(element('button').getAttribute('type')).toBe('button')
    app.render(<Button variant="secondary" size="sm" isLoading onClick={clicked}>Saving</Button>)
    expect(element<HTMLButtonElement>('button').disabled).toBe(true)
    expect(element('button svg').classList.contains('animate-spin')).toBe(true)
    click(element('button'))
    expect(clicked).toHaveBeenCalledTimes(1)
    app.render(<Button variant="outline" size="lg" disabled type="submit" onClick={clicked}>Disabled</Button>)
    expect(element<HTMLButtonElement>('button').disabled).toBe(true)
    expect(document.querySelector('button svg')).toBeNull()
    app.render(<Button variant="ghost" size="md" disabled={false} isLoading={false} className="extra" type="reset">Reset</Button>)
    expect(element<HTMLButtonElement>('button').disabled).toBe(false)
    expect(element('button').className).toContain('extra')
    expect(element('button').getAttribute('type')).toBe('reset')
  })

  test('card sections forward refs and attributes while hover and heading options stay explicit', () => {
    const refs = [createRef<HTMLDivElement>(), createRef<HTMLDivElement>(), createRef<HTMLDivElement>(), createRef<HTMLDivElement>()]
    const app = mount(<Card ref={refs[0]} data-testid="card"><CardHeader ref={refs[1]} className="header">Title</CardHeader><CardContent ref={refs[2]} data-body="yes">Body</CardContent><CardFooter ref={refs[3]}>Footer</CardFooter></Card>)
    expect(refs.every(ref => ref.current)).toBe(true)
    expect(refs[0].current?.className).toContain('hover:-translate-y-1')
    expect(refs[2].current?.getAttribute('data-body')).toBe('yes')
    expect(refs[1].current?.textContent).toBe('Title')
    app.render(<Card hover={false}><SectionHeader title="Left heading" subtitle="Context" align="left" as="h1" className="custom-header" /></Card>)
    expect(element('h1').textContent).toBe('Left heading')
    expect(element('h1').parentElement?.className).not.toContain('text-center')
    expect(element('p').className).not.toContain('mx-auto')
    expect(app.container.firstElementChild?.className).not.toContain('hover:-translate-y-1')
    app.render(<SectionHeader title="Centered" />)
    expect(element('h2').parentElement?.className).toContain('text-center')
    expect(document.querySelector('p')).toBeNull()
    app.render(<SectionHeader title="Centered with description" subtitle="Details" />)
    expect(element('p').className).toContain('mx-auto')
  })

  test('mobile disclosure toggles accessible expanded state and leaves the desktop content present', () => {
    const app = mount(<MobileSectionDisclosure preview="Preview" openLabel="Read more" className="custom-details"><p>Details</p></MobileSectionDisclosure>)
    expect(document.querySelectorAll('p')).toHaveLength(2)
    expect(element('button').getAttribute('aria-expanded')).toBe('false')
    click(element('button'))
    expect(element('button').getAttribute('aria-expanded')).toBe('true')
    expect(element('button').textContent).toBe('Hide details')
    expect(document.querySelectorAll('p')).toHaveLength(3)
    click(element('button'))
    expect(document.querySelectorAll('p')).toHaveLength(2)
    app.render(<MobileSectionDisclosure preview="Preview" openLabel="Open" closeLabel="Collapse"><p>Details</p></MobileSectionDisclosure>)
    click(element('button'))
    expect(element('button').textContent).toBe('Collapse')
  })

  test('theme control follows the resolved theme and requests both supported transitions', () => {
    theme.resolvedTheme = 'dark'
    const app = mount(<ThemeToggle />)
    click(element('[aria-label="Switch to light theme"]'))
    expect(theme.setTheme).toHaveBeenLastCalledWith('light')
    theme.resolvedTheme = 'light'
    app.render(<ThemeToggle />)
    click(element('[aria-label="Switch to dark theme"]'))
    expect(theme.setTheme).toHaveBeenLastCalledWith('dark')
  })
})

describe('registered content disclosures', () => {
  test('manual toggles notify consumers, and nested fragment navigation opens the actual registered panels', async () => {
    window.history.replaceState(null, '', '/disclosures')
    const onToggle = vi.fn()
    const destination = { page: '/disclosures', anchor: 'content-specific', label: 'Specific text', disclosureIds: ['outer', 'inner'] }
    const app = mount(<main><ContentDestinationManifest page="/disclosures" destinations={[destination]} /><ContentDetails id="outer" onToggle={onToggle}><summary>Outer</summary><DisclosurePanel id="inner" title="Inner" summary="Technical context"><p id="content-specific" tabIndex={-1}>Specific text</p></DisclosurePanel></ContentDetails><DisclosurePanel title="Standalone" summary="Default panel">Public context</DisclosurePanel></main>)
    const outer = element<HTMLDetailsElement>('#outer')
    act(() => { outer.open = true; outer.dispatchEvent(new Event('toggle')) })
    expect(onToggle).toHaveBeenCalled()
    expect(outer.open).toBe(true)
    act(() => { outer.open = false; outer.dispatchEvent(new Event('toggle')) })
    expect(outer.open).toBe(false)
    const rect = { top: 200, bottom: 240, left: 0, right: 100, width: 100, height: 40, x: 0, y: 200, toJSON() {} }
    vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([rect] as unknown as DOMRectList)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect)
    const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const dispose = mountContentNavigation()
    contentRouteCommitted('/disclosures')
    prepareContentNavigation('/disclosures#content-specific', destination)
    window.history.pushState(null, '', '/disclosures#content-specific')
    releaseContentNavigation()
    for (let i = 0; i < 8; i++) await settle(17)
    expect(outer.open).toBe(true)
    expect(element<HTMLDetailsElement>('#inner').open).toBe(true)
    expect(document.activeElement?.id).toBe('content-specific')
    expect(scroll).toHaveBeenCalled()
    dispose()
    app.render(<ContentDetails open><summary>Initially expanded</summary><p>Visible</p></ContentDetails>)
    expect(element<HTMLDetailsElement>('details').open).toBe(true)
  })
})

describe('image lightbox interaction', () => {
  test('opens and closes the real dialog, cycles all zoom levels, responds to viewport changes and resets on close', async () => {
    const viewport = Object.assign(new EventTarget(), { matches: false, media: '(max-width: 640px)' }) as MediaQueryList
    vi.spyOn(window, 'matchMedia').mockReturnValue(viewport)
    const remove = vi.spyOn(viewport, 'removeEventListener')
    const add = vi.spyOn(viewport, 'addEventListener')
    const changed = vi.fn()
    const app = mount(<ImageLightbox src="/images/example.png" alt="System diagram" title="System" description="Architecture context" visualAspect="portrait" visualSurface="light" sizes="100vw" thumb={<span>Thumbnail</span>} onOpenChange={changed} />)
    click(element('[aria-label="Expand image for System"]'))
    await settle()
    expect(changed).toHaveBeenLastCalledWith(true)
    const zoom = () => element<HTMLButtonElement>('[aria-label^="Cycle zoom"]')
    expect(zoom().getAttribute('aria-label')).toContain('Expanded view')
    click(zoom()); expect(zoom().getAttribute('aria-label')).toContain('Detail zoom')
    expect(element('div[style*="1184px"]')).toBeTruthy()
    act(() => { Object.assign(viewport, { matches: true }); viewport.dispatchEvent(new Event('change')) })
    expect(element('div[style*="2340px"]')).toBeTruthy()
    click(zoom()); expect(zoom().getAttribute('aria-label')).toContain('Balanced zoom')
    click(zoom()); expect(zoom().getAttribute('aria-label')).toContain('Expanded view')
    click(zoom())
    click(Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Close expanded image')!)
    await settle()
    expect(changed).toHaveBeenLastCalledWith(false)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    click(element('[aria-label="Expand image for System"]'))
    await settle()
    expect(zoom().getAttribute('aria-label')).toContain('Expanded view')
    app.unmount()
    expect(remove).toHaveBeenCalledWith('change', add.mock.calls[0][1])
  })

  test('supports an optional description and callback with the landscape surface', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(<ImageLightbox src="/images/example.png" alt="Wide diagram" title="Wide" visualAspect="landscape" visualSurface="dark" sizes="100vw" thumb={<span>Wide</span>} />)
    click(element('[aria-label="Expand image for Wide"]'))
    await settle()
    expect(element('[role="dialog"]').textContent).toContain('Wide')
    click(element('[aria-label^="Cycle zoom"]'))
    expect(element('div[style*="185%"]')).toBeTruthy()
    click(Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Close expanded image')!)
    await settle()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(warning.mock.calls.every(([message]) => String(message).includes('Description'))).toBe(true)
  })
})

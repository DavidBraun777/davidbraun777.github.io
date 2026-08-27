// @vitest-environment happy-dom

import { act, createElement, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

interface MockComponentProps {
  children?: ReactNode
  className?: string
}

vi.mock('@radix-ui/react-dialog', async () => {
  const { Fragment, createElement: createMockElement } = await import('react')
  const passthrough = ({ children }: MockComponentProps) =>
    createMockElement(Fragment, null, children)

  return {
    Root: passthrough,
    Trigger: passthrough,
    Portal: passthrough,
    Overlay: ({ className }: MockComponentProps) =>
      createMockElement('div', { className }),
    Content: ({ children, className }: MockComponentProps) =>
      createMockElement('div', { className }, children),
    Title: ({ children, className }: MockComponentProps) =>
      createMockElement('h2', { className }, children),
    Description: ({ children, className }: MockComponentProps) =>
      createMockElement('p', { className }, children),
    Close: ({ children, className }: MockComponentProps) =>
      createMockElement('button', { className }, children),
  }
})

vi.mock('next/image', async () => {
  const { createElement: createMockElement } = await import('react')

  return {
    default: ({ alt }: { alt: string }) =>
      createMockElement('span', { 'aria-label': alt }),
  }
})

import { ImageLightbox } from '@/components/ui/image-lightbox'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const roots: Root[] = []

function stubMobileViewport(matches: boolean) {
  const listeners = new Set<() => void>()
  const mediaQuery = {
    matches,
    addEventListener: vi.fn((_type: 'change', listener: () => void) => {
      listeners.add(listener)
    }),
    removeEventListener: vi.fn((_type: 'change', listener: () => void) => {
      listeners.delete(listener)
    }),
  } as unknown as MediaQueryList

  vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery)
}

function renderLightbox(
  visualAspect: 'landscape' | 'portrait',
  isMobile: boolean
) {
  stubMobileViewport(isMobile)
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.push(root)

  act(() => {
    root.render(
      createElement(ImageLightbox, {
        src: '/images/example.png',
        alt: 'Example diagram',
        title: 'Example',
        visualAspect,
        visualSurface: 'dark',
        sizes: '100vw',
        thumb: createElement('span', null, 'Thumbnail'),
      })
    )
  })

  const getZoomButton = () => {
    const button = Array.from(container.querySelectorAll('button')).find(
      (candidate) =>
        candidate.getAttribute('aria-label')?.startsWith('Cycle zoom for')
    )
    if (!button) throw new Error('Zoom button was not rendered')
    return button
  }

  const getFrameWidth = () => {
    const frame = getZoomButton().querySelector<HTMLElement>('div')
    if (!frame) throw new Error('Image frame was not rendered')
    return frame.style.width
  }

  const cycleZoom = () => {
    act(() => getZoomButton().click())
  }

  return { cycleZoom, getFrameWidth }
}

afterEach(() => {
  while (roots.length > 0) {
    const root = roots.pop()
    if (root) act(() => root.unmount())
  }
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

describe('ImageLightbox image frame width', () => {
  it('preserves the initial portrait width', () => {
    const html = renderToString(
      createElement(ImageLightbox, {
        src: '/images/example.png',
        alt: 'Example diagram',
        title: 'Example',
        visualAspect: 'portrait',
        visualSurface: 'dark',
        sizes: '100vw',
        thumb: createElement('span', null, 'Thumbnail'),
      })
    )

    expect(html).toContain('width:min(100%, 640px)')
  })

  it('preserves the desktop portrait width when zoomed', () => {
    const lightbox = renderLightbox('portrait', false)

    lightbox.cycleZoom()
    expect(lightbox.getFrameWidth()).toBe('1184px')
  })

  it('uses the mobile portrait base width when zoomed', () => {
    const lightbox = renderLightbox('portrait', true)

    lightbox.cycleZoom()
    expect(lightbox.getFrameWidth()).toBe('2340px')
  })

  it('preserves percentage-based landscape widths', () => {
    const lightbox = renderLightbox('landscape', false)

    expect(lightbox.getFrameWidth()).toBe('100%')
    lightbox.cycleZoom()
    expect(lightbox.getFrameWidth()).toBe('185%')
  })
})

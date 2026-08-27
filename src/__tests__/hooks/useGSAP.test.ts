// @vitest-environment happy-dom

import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { gsapMocks, scrollTriggerMock } = vi.hoisted(() => ({
  gsapMocks: {
    context: vi.fn(),
    registerPlugin: vi.fn(),
  },
  scrollTriggerMock: {},
}))

vi.mock('gsap', () => ({ default: gsapMocks }))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: scrollTriggerMock }))

import { getMotionConfig, useGSAP, useReducedMotion } from '@/hooks/useGSAP'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

interface RenderedHook<T> {
  getResult: () => T
  root: Root
}

function renderHook<T>(hook: () => T): RenderedHook<T> {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  let result: T

  function HookConsumer() {
    result = hook()
    return null
  }

  act(() => root.render(createElement(HookConsumer)))

  return {
    getResult: () => result,
    root,
  }
}

function renderGSAPHook(): RenderedHook<ReturnType<typeof useGSAP>> {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  let result: ReturnType<typeof useGSAP>

  function HookConsumer() {
    result = useGSAP<HTMLDivElement>()
    return createElement('div', { ref: result.containerRef })
  }

  act(() => root.render(createElement(HookConsumer)))

  return {
    getResult: () => result,
    root,
  }
}

function createMediaQuery(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const addEventListener = vi.fn(
    (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    }
  )
  const removeEventListener = vi.fn(
    (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    }
  )

  const mediaQuery = {
    get matches() {
      return matches
    },
    addEventListener,
    removeEventListener,
  } as unknown as MediaQueryList

  return {
    addEventListener,
    mediaQuery,
    removeEventListener,
    emit(nextMatches: boolean) {
      matches = nextMatches
      const event = { matches: nextMatches } as MediaQueryListEvent
      listeners.forEach((listener) => listener(event))
    },
  }
}

describe('getMotionConfig', () => {
  it('returns the standard animation settings', () => {
    expect(getMotionConfig(false)).toEqual({
      duration: 0.6,
      y: 16,
      scale: 1,
      stagger: 0.1,
      ease: 'power2.out',
    })
  })

  it('removes motion while preserving the final scale', () => {
    expect(getMotionConfig(true)).toEqual({
      duration: 0,
      y: 0,
      scale: 1,
      stagger: 0,
      ease: 'power2.out',
    })
  })
})

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.replaceChildren()
  })

  it('is safe during server rendering', () => {
    function ReducedMotionConsumer() {
      return createElement('span', null, String(useReducedMotion()))
    }

    expect(renderToString(createElement(ReducedMotionConsumer))).toContain(
      'false'
    )
  })

  it('reflects the mounted preference, reacts to changes, and unsubscribes', () => {
    const query = createMediaQuery(true)
    const matchMedia = vi
      .spyOn(window, 'matchMedia')
      .mockReturnValue(query.mediaQuery)

    const rendered = renderHook(useReducedMotion)

    expect(matchMedia).toHaveBeenCalledWith(
      '(prefers-reduced-motion: reduce)'
    )
    expect(rendered.getResult()).toBe(true)
    expect(query.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    )

    act(() => query.emit(false))
    expect(rendered.getResult()).toBe(false)

    const subscribedListener = query.addEventListener.mock.calls[0][1]
    act(() => rendered.root.unmount())

    expect(query.removeEventListener).toHaveBeenCalledWith(
      'change',
      subscribedListener
    )
  })
})

describe('useGSAP', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.replaceChildren()
  })

  it('passes the actual scoped GSAP context to the initializer', () => {
    const context = { revert: vi.fn() }
    gsapMocks.context.mockImplementation((initializer) => {
      initializer(context)
      return context
    })

    const rendered = renderGSAPHook()
    const initializer = vi.fn()
    act(() => rendered.getResult().createContext(initializer))

    expect(gsapMocks.context).toHaveBeenCalledWith(
      expect.any(Function),
      rendered.getResult().containerRef
    )
    expect(initializer).toHaveBeenCalledWith(context)

    act(() => rendered.root.unmount())
    expect(context.revert).toHaveBeenCalledOnce()
  })

  it('reverts replaced and unmounted contexts exactly once', () => {
    const firstContext = { revert: vi.fn() }
    const secondContext = { revert: vi.fn() }
    const contexts = [firstContext, secondContext]
    gsapMocks.context.mockImplementation((initializer) => {
      const context = contexts.shift()
      if (!context) throw new Error('Unexpected context creation')
      initializer(context)
      return context
    })

    const rendered = renderGSAPHook()
    act(() => rendered.getResult().createContext(vi.fn()))
    act(() => rendered.getResult().createContext(vi.fn()))

    expect(firstContext.revert).toHaveBeenCalledOnce()
    expect(secondContext.revert).not.toHaveBeenCalled()

    act(() => rendered.root.unmount())
    expect(secondContext.revert).toHaveBeenCalledOnce()

    rendered.getResult().cleanup()
    expect(secondContext.revert).toHaveBeenCalledOnce()
  })
})

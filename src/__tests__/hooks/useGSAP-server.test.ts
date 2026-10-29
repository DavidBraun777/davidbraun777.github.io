import { expect, it, vi } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

const registerPlugin = vi.hoisted(() => vi.fn())
vi.mock('gsap', () => ({ default: { registerPlugin } }))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))
import { useReducedMotion } from '@/hooks'

it('does not register a browser animation plugin during server import', () => {
  function ServerConsumer() { return createElement('span', null, String(useReducedMotion())) }
  expect(renderToString(createElement(ServerConsumer))).toContain('false')
  expect(registerPlugin).not.toHaveBeenCalled()
})

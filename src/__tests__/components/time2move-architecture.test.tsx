// @vitest-environment happy-dom

import { afterEach, describe, expect, test } from 'vitest'
import { act } from 'react'
import { Time2MoveArchitecture, Time2MoveReviewPipeline } from '@/components/site/time2move-architecture'
import {
  time2moveArchitecturePaths, time2moveArchitectureText,
  time2moveDiagramLayout, time2moveReviewPipeline, time2moveReviewPipelineText,
  type Time2MoveDiagramNode,
} from '@/data/time2move-architecture'
import { cleanupMountedUi, click, element, mount } from '../helpers/mounted-ui'

afterEach(cleanupMountedUi)

const diagrams = [...time2moveArchitecturePaths, time2moveReviewPipeline]

/** Trace the orthogonal SVG connector so metadata cannot silently draw a different relationship. */
function pathEnds(path: string) {
  const segments = path.match(/[MHV][\d .-]+/g)!
  const points: number[][] = []
  let x = 0, y = 0
  for (const segment of segments) {
    const values = segment.slice(1).trim().split(/\s+/).map(Number)
    if (segment[0] === 'M') [x, y] = values
    if (segment[0] === 'H') x = values[0]
    if (segment[0] === 'V') y = values[0]
    points.push([x, y])
  }
  return [points[0], points.at(-1)!]
}

function touchesNode(point: number[], node: Time2MoveDiagramNode) {
  const right = node.x + time2moveDiagramLayout.nodeWidth
  const bottom = node.y + time2moveDiagramLayout.nodeHeight
  return point[0] >= node.x && point[0] <= right && point[1] >= node.y && point[1] <= bottom
    && (point[0] === node.x || point[0] === right || point[1] === node.y || point[1] === bottom)
}

describe('Time2Move architecture diagrams', () => {
  test('every drawn connector touches its declared endpoints and keeps provider boundaries distinct', () => {
    for (const graph of diagrams) {
      const nodes = new Map(graph.nodes.map(node => [node.id, node]))
      expect(nodes.size).toBe(graph.nodes.length)
      expect(new Set(graph.edges.map(edge => edge.id)).size).toBe(graph.edges.length)
      expect(graph.mainNodeIds.length).toBeLessThanOrEqual(5)
      expect(graph.mainNodeIds.every(id => nodes.has(id))).toBe(true)
      for (const node of graph.nodes) {
        expect(node.x).toBeGreaterThanOrEqual(0)
        expect(node.x + time2moveDiagramLayout.nodeWidth).toBeLessThanOrEqual(time2moveDiagramLayout.width)
        expect(node.y + time2moveDiagramLayout.nodeHeight).toBeLessThanOrEqual(graph.height)
      }
      for (const edge of graph.edges) {
        const [start, end] = pathEnds(edge.path)
        expect(touchesNode(start, nodes.get(edge.from)!), `${graph.id}/${edge.id} source`).toBe(true)
        expect(touchesNode(end, nodes.get(edge.to)!), `${graph.id}/${edge.id} destination`).toBe(true)
      }
    }
    const inquiry = time2moveArchitecturePaths.find(path => path.id === 'inquiries')!
    expect(inquiry.edges.filter(edge => edge.from === 'fastapi').map(edge => edge.to)).toEqual(['fub', 'resend'])
    expect(inquiry.edges.find(edge => edge.to === 'resend')?.branch).toBe(true)
    const reviews = time2moveArchitecturePaths.find(path => path.id === 'reviews')!
    expect(reviews.edges.find(edge => edge.to === 'redis')?.bidirectional).toBe(true)
    const rates = time2moveArchitecturePaths.find(path => path.id === 'rates')!
    expect(rates.mainNodeIds).toEqual(['calculators', 'market-routes', 'fred'])
    const property = time2moveArchitecturePaths.find(path => path.id === 'property-search')!
    expect(property.nodes.some(node => ['forms', 'fastapi', 'redis'].includes(node.id))).toBe(false)
    const branchEdges = time2moveReviewPipeline.edges.filter(edge => edge.branch)
    expect(branchEdges.map(edge => [edge.from, edge.to])).toEqual([
      ['legacy', 'canonical'], ['canonical', 'public-cache'], ['canonical', 'homepage-artifact'],
    ])
    expect(time2moveReviewPipeline.edges.filter(edge => edge.to === 'consumer').map(edge => edge.from)).toEqual(['public-cache'])
    expect(time2moveReviewPipeline.edges.some(edge => edge.from === 'homepage-artifact')).toBe(false)
  })

  test('renders matching desktop and mobile graphs with unique, complete accessible descriptions', () => {
    const app = mount(<><Time2MoveArchitecture /><Time2MoveReviewPipeline /></>)
    const tabs = [...app.container.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
    for (const graph of diagrams) {
      const tab = tabs.find(button => button.textContent === time2moveArchitecturePaths.find(path => path.id === graph.id)?.selectorLabel)
      if (tab) click(tab)
      const ids = [...app.container.querySelectorAll('[id]')].map(node => node.id)
      expect(new Set(ids).size).toBe(ids.length)
      const figure = element<HTMLElement>(`[data-diagram="${graph.id}"]`, app.container)
      const svg = figure.querySelector<SVGElement>('svg[role="img"]')!
      const accessibleIds = svg.getAttribute('aria-labelledby')!.split(' ')
      expect(accessibleIds.map(id => document.getElementById(id)?.tagName.toLowerCase())).toEqual(['title', 'desc'])
      const description = document.getElementById(accessibleIds[1])!.textContent!
      expect(svg.classList.contains('xl:block')).toBe(true)
      expect(svg.classList.contains('hidden')).toBe(true)
      expect(figure.querySelector('.xl\\:hidden')).not.toBeNull()
      expect([...svg.querySelectorAll('[data-graph-node]')].map(node => node.getAttribute('data-graph-node'))).toEqual(graph.nodes.map(node => node.id))
      for (const node of graph.nodes) {
        expect(description).toContain(node.label)
        for (const detail of node.detail) expect(description).toContain(detail)
      }
      for (const edge of graph.edges) {
        const rendered = svg.querySelector<SVGGElement>(`[data-graph-edge="${edge.id}"]`)!
        expect(rendered.dataset.from).toBe(edge.from)
        expect(rendered.dataset.to).toBe(edge.to)
        const path = rendered.querySelector<SVGPathElement>('path')!
        expect(path.getAttribute('d')).toBe(edge.path)
        expect(path.hasAttribute('marker-end')).toBe(true)
        expect(path.hasAttribute('marker-start')).toBe(edge.bidirectional)
        expect(path.hasAttribute('stroke-dasharray')).toBe(edge.branch)
        if (edge.branch) {
          const mobile = element<HTMLElement>(`[data-mobile-edge="${edge.id}"]`, figure)
          expect(mobile.textContent).toContain(edge.label)
          for (const id of [edge.from, edge.to]) {
            const node = graph.nodes.find(item => item.id === id)!
            expect(mobile.textContent).toContain(node.label)
            if (!graph.mainNodeIds.includes(id)) {
              for (const detail of node.detail) expect(mobile.textContent).toContain(detail)
            }
          }
          expect(mobile.querySelectorAll('[data-mobile-node]')).toHaveLength(0)
        }
      }
      const mainPath = element('ol', figure)
      expect(mainPath.querySelectorAll(':scope > li')).toHaveLength(graph.mainNodeIds.length)
      expect([...figure.querySelectorAll('[data-mobile-node]')].map(node => node.getAttribute('data-mobile-node'))).toEqual(graph.mainNodeIds)
      expect(mainPath.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(graph.mainNodeIds.length - 1)
      for (const nodeId of graph.mainNodeIds) {
        const node = graph.nodes.find(item => item.id === nodeId)!
        const mobile = element(`[data-mobile-node="${nodeId}"]`, mainPath)
        expect(mobile.textContent).toContain(node.label)
        for (const detail of node.detail) expect(mobile.textContent).toContain(detail)
      }
    }
    for (const path of time2moveArchitecturePaths) expect(time2moveArchitectureText).toContain(path.responsibility)
    expect(time2moveReviewPipelineText).toContain(time2moveReviewPipeline.note)
    expect(`${time2moveArchitectureText} ${time2moveReviewPipelineText}`).not.toMatch(/\/Users\/|source-map|security-notes|api_key|bearer\s/i)
  })

  test('tabs expose only the selected graph and its contribution through valid accessible associations', () => {
    const app = mount(<Time2MoveArchitecture />)
    const controls = element('[role="tablist"]', app.container)
    expect(controls.getAttribute('aria-label')).toBe('Architecture paths')
    const tabs = [...controls.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
    expect(tabs.map(tab => tab.textContent)).toEqual(['Inquiries', 'Rates', 'Reviews', 'Property search'])
    expect(tabs.map(tab => tab.type)).toEqual(Array(4).fill('button'))
    expect([...controls.querySelectorAll('button')]).toEqual(tabs)

    function expectSelected(index: number) {
      const selected = tabs[index]
      const path = time2moveArchitecturePaths[index]
      expect(tabs.filter(tab => tab.getAttribute('aria-selected') === 'true')).toEqual([selected])
      expect(tabs.map(tab => tab.tabIndex)).toEqual(tabs.map((_, tabIndex) => tabIndex === index ? 0 : -1))
      for (const tab of tabs) {
        expect(tab.id).not.toBe('')
        const controlled = document.getElementById(tab.getAttribute('aria-controls')!)
        expect(controlled?.getAttribute('role')).toBe('tabpanel')
      }
      const panels = [...app.container.querySelectorAll<HTMLElement>('[role="tabpanel"]')]
      const visible = panels.filter(panel => !panel.hidden)
      expect(visible).toHaveLength(1)
      const panel = visible[0]
      expect(panel.id).toBe(selected.getAttribute('aria-controls'))
      expect(panel.getAttribute('aria-labelledby')).toBe(selected.id)
      expect([...app.container.querySelectorAll('[data-diagram]')].map(graph => graph.getAttribute('data-diagram'))).toEqual([path.id])
      expect(panel.textContent).toContain(path.responsibility)
      expect(panel.textContent!.indexOf('My contribution')).toBeGreaterThan(panel.textContent!.indexOf(path.note))
      for (const hidden of panels.filter(item => item !== panel)) {
        expect(hidden.hidden).toBe(true)
        expect(hidden.textContent).toBe('')
      }
    }

    expectSelected(0)
    for (const [index, path] of time2moveArchitecturePaths.entries()) {
      click(tabs[index])
      expectSelected(index)
      expect(app.container.querySelectorAll('[data-graph-edge]')).toHaveLength(path.edges.length)
    }

    tabs[3].focus()
    for (const [key, index] of [
      ['ArrowRight', 0], ['ArrowLeft', 3], ['Home', 0], ['ArrowRight', 1], ['ArrowLeft', 0], ['End', 3],
    ] as const) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      act(() => document.activeElement!.dispatchEvent(event))
      expect(event.defaultPrevented).toBe(true)
      expect(document.activeElement).toBe(tabs[index])
      expectSelected(index)
    }
    const tabKey = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    act(() => tabs[3].dispatchEvent(tabKey))
    expect(tabKey.defaultPrevented).toBe(false)
    expectSelected(3)
  })
})

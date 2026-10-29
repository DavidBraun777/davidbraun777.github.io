// @vitest-environment happy-dom

import { afterEach, describe, expect, test } from 'vitest'
import { Time2MoveArchitecture, Time2MoveReviewPipeline } from '@/components/site/time2move-architecture'
import {
  time2moveAllPathsResponsibility, time2moveArchitecturePaths, time2moveArchitectureText,
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
    const ids = [...app.container.querySelectorAll('[id]')].map(node => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const graph of diagrams) {
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
          for (const id of [edge.from, edge.to]) {
            const node = graph.nodes.find(item => item.id === id)!
            expect(mobile.textContent).toContain(node.label)
            for (const detail of node.detail) expect(mobile.textContent).toContain(detail)
          }
          expect(mobile.querySelector('svg[aria-hidden="true"]')).not.toBeNull()
        }
      }
      expect(figure.querySelectorAll('ol > li')).toHaveLength(graph.mainNodeIds.length)
    }
    expect(time2moveArchitectureText).toContain(time2moveAllPathsResponsibility)
    expect(time2moveReviewPipelineText).toContain(time2moveReviewPipeline.note)
    expect(`${time2moveArchitectureText} ${time2moveReviewPipelineText}`).not.toMatch(/\/Users\/|source-map|security-notes|api_key|bearer\s/i)
  })

  test('native selector buttons highlight one path without hiding the other paths or changing their graphs', () => {
    const app = mount(<Time2MoveArchitecture />)
    const controls = element('[role="group"]', app.container)
    const buttons = [...controls.querySelectorAll('button')]
    expect(buttons.map(button => button.type)).toEqual(Array(5).fill('button'))
    expect(buttons.map(button => button.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false', 'false', 'false'])
    expect(app.container.querySelectorAll('[data-highlighted="true"]')).toHaveLength(4)
    for (const [index, path] of time2moveArchitecturePaths.entries()) {
      const before = app.container.querySelectorAll('[data-graph-edge]').length
      click(buttons[index + 1])
      expect(buttons.filter(button => button.getAttribute('aria-pressed') === 'true')).toEqual([buttons[index + 1]])
      expect(element('[data-highlighted="true"]', app.container).dataset.architecturePath).toBe(path.id)
      expect(element('[aria-live="polite"]', app.container).textContent).toBe(path.responsibility)
      expect(app.container.querySelectorAll('[data-architecture-path]')).toHaveLength(4)
      expect(app.container.querySelectorAll('[data-graph-edge]')).toHaveLength(before)
    }
    click(buttons[0])
    expect(app.container.querySelectorAll('[data-highlighted="true"]')).toHaveLength(4)
    expect(element('[aria-live="polite"]', app.container).textContent).toBe(time2moveAllPathsResponsibility)
  })
})

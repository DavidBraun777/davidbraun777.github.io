'use client'

import { useId, useState } from 'react'
import {
  time2moveAllPathsResponsibility, time2moveArchitecturePaths, time2moveDiagramLayout, time2moveReviewPipeline,
  type Time2MoveDiagram, type Time2MoveDiagramEdge, type Time2MoveDiagramNode, type Time2MoveNodeKind,
} from '@/data/time2move-architecture'
import { cn } from '@/lib/utils'

const nodeStyles: Record<Time2MoveNodeKind, { label: string; svg: string; html: string }> = {
  application: { label: 'Application logic', svg: 'fill-background-elevated stroke-border-strong', html: 'border-border-strong bg-background-elevated' },
  store: { label: 'Stored data', svg: 'fill-primary-50 stroke-cyan-700 dark:fill-primary-950 dark:stroke-cyan-400', html: 'border-cyan-700 bg-primary-50 dark:border-cyan-400 dark:bg-primary-950' },
  provider: { label: 'External provider', svg: 'fill-background-subtle stroke-border-strong', html: 'border-border-strong bg-background-subtle' },
}

export function Time2MoveArchitecture() {
  const [selected, setSelected] = useState('all')
  const selectedPath = time2moveArchitecturePaths.find(path => path.id === selected)
  return (
    <div className="space-y-6">
      <p className="max-w-4xl text-sm leading-7 text-text-secondary">Historical implementation paths; this diagram does not establish live provider delivery or a completed production release.</p>
      <div role="group" aria-label="Architecture path" className="flex flex-wrap gap-2">
        {[{ id: 'all', selectorLabel: 'All' }, ...time2moveArchitecturePaths].map(path => (
          <button key={path.id} type="button" aria-pressed={selected === path.id} onClick={() => setSelected(path.id)} className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-link-primary',
            selected === path.id ? 'border-primary-700 bg-primary-700 text-white' : 'border-border-strong bg-background-elevated text-text-primary hover:bg-background-subtle',
          )}>{path.selectorLabel}</button>
        ))}
      </div>
      <p aria-live="polite" aria-atomic="true" className="min-h-14 max-w-4xl text-base leading-7 text-text-secondary">
        {selectedPath?.responsibility ?? time2moveAllPathsResponsibility}
      </p>
      <DiagramLegend />
      <div className="space-y-5">
        {time2moveArchitecturePaths.map(path => (
          <div key={path.id} data-architecture-path={path.id} data-highlighted={selected === 'all' || selected === path.id} className={cn(
            'min-w-0 rounded-[1.5rem] border p-4 sm:p-6',
            selected === 'all' || selected === path.id ? 'border-primary-600 bg-background-elevated' : 'border-border-subtle bg-background-subtle',
          )}>
            <Diagram graph={path} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Time2MoveReviewPipeline() {
  return <div className="space-y-5"><DiagramLegend /><Diagram graph={time2moveReviewPipeline} /></div>
}

function DiagramLegend() {
  return (
    <ul aria-label="Diagram legend" className="flex flex-wrap gap-3 text-xs text-text-secondary">
      {Object.entries(nodeStyles).map(([kind, style]) => (
        <li key={kind} className="flex items-center gap-2"><span aria-hidden="true" className={cn('h-3 w-3 rounded border', style.html)} />{style.label}</li>
      ))}
    </ul>
  )
}

function diagramNode(graph: Time2MoveDiagram, id: string): Time2MoveDiagramNode {
  return graph.nodes.find(node => node.id === id)!
}

function edgeText(graph: Time2MoveDiagram, edge: Time2MoveDiagramEdge): string {
  const direction = edge.bidirectional ? 'connects both ways with' : 'connects to'
  const label = edge.label ? ` (${edge.label})` : ''
  return `${diagramNode(graph, edge.from).label} ${direction} ${diagramNode(graph, edge.to).label}${label}.`
}

function Diagram({ graph }: Readonly<{ graph: Time2MoveDiagram }>) {
  const id = useId()
  const description = [graph.description, ...graph.nodes.map(node => `${node.label}: ${node.detail.join('; ')}.`), ...graph.edges.map(edge => edgeText(graph, edge))].join(' ')
  return (
    <figure className="min-w-0" data-diagram={graph.id}>
      <figcaption>
        <h3 className="text-lg font-semibold text-text-primary">{graph.title}</h3>
        <p className="mt-2 max-w-4xl text-sm leading-7 text-text-secondary">{graph.description}</p>
      </figcaption>
      <svg className="mt-4 hidden h-auto w-full xl:block" viewBox={`0 0 ${time2moveDiagramLayout.width} ${graph.height}`} role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{graph.title}</title>
        <desc id={`${id}-description`}>{description}</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8" className="fill-none stroke-link-primary" strokeWidth="1.5" />
          </marker>
        </defs>
        {graph.edges.map(edge => (
          <g key={edge.id} data-graph-edge={edge.id} data-from={edge.from} data-to={edge.to}>
            <path d={edge.path} className="fill-none stroke-link-primary" strokeWidth="2" strokeDasharray={edge.branch ? '6 5' : undefined} markerEnd={`url(#${id}-arrow)`} markerStart={edge.bidirectional ? `url(#${id}-arrow)` : undefined} />
            {edge.label ? <text x={edge.labelX} y={edge.labelY} textAnchor="middle" className="fill-text-secondary" fontSize="15">{edge.label}</text> : null}
          </g>
        ))}
        {graph.nodes.map(node => (
          <g key={node.id} data-graph-node={node.id} transform={`translate(${node.x} ${node.y})`}>
            <rect width={time2moveDiagramLayout.nodeWidth} height={time2moveDiagramLayout.nodeHeight} rx="14" strokeWidth="1.5" className={nodeStyles[node.kind].svg} />
            <text x="14" y="23" fontSize="11" className="fill-text-secondary" letterSpacing="0.4">{nodeStyles[node.kind].label.toUpperCase()}</text>
            {node.titleLines.map((line, index) => <text key={line} x="14" y={51 + index * 23} fontSize="18" fontWeight="600" className="fill-text-primary">{line}</text>)}
            {node.detail.map((line, index) => <text key={line} x="14" y={80 + (node.titleLines.length - 1) * 23 + index * 20} fontSize="14" className="fill-text-secondary">{line}</text>)}
          </g>
        ))}
      </svg>
      <MobileDiagram graph={graph} />
      <p className="mt-5 max-w-4xl text-sm leading-7 text-text-secondary">{graph.note}</p>
    </figure>
  )
}

function MobileDiagram({ graph }: Readonly<{ graph: Time2MoveDiagram }>) {
  return (
    <div className="mt-5 space-y-5 xl:hidden">
      <ol aria-label={`${graph.title}: main path`}>
        {graph.mainNodeIds.map((nodeId, index) => (
          <li key={nodeId}>
            <MobileNode node={diagramNode(graph, nodeId)} />
            {index < graph.mainNodeIds.length - 1 ? <VerticalConnector bidirectional={false} /> : null}
          </li>
        ))}
      </ol>
      <ul aria-label={`${graph.title}: branch connections`} className="space-y-4">
        {graph.edges.filter(edge => edge.branch).map(edge => (
          <li key={edge.id} data-mobile-edge={edge.id} className="rounded-xl border border-dashed border-border-strong p-4">
            <p className="mb-3 text-sm font-semibold text-link-primary">{edge.label}</p>
            <div className="min-w-0">
              <MobileNode node={diagramNode(graph, edge.from)} />
              <span className="sr-only">{edge.bidirectional ? 'Connects both ways with' : 'Connects to'}</span>
              <VerticalConnector bidirectional={edge.bidirectional} />
              <MobileNode node={diagramNode(graph, edge.to)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MobileNode({ node }: Readonly<{ node: Time2MoveDiagramNode }>) {
  return (
    <div className={cn('rounded-xl border p-4', nodeStyles[node.kind].html)}>
      <p className="text-[0.65rem] uppercase tracking-wider text-text-secondary">{nodeStyles[node.kind].label}</p>
      <p className="mt-1 font-semibold text-text-primary">{node.label}</p>
      <p className="mt-1 text-sm leading-6 text-text-secondary">{node.detail.join(' · ')}</p>
    </div>
  )
}

function VerticalConnector({ bidirectional }: Readonly<{ bidirectional: boolean }>) {
  return (
    <svg aria-hidden="true" focusable="false" className="mx-auto my-2 h-8 w-6 fill-none stroke-link-primary" viewBox="0 0 24 32" strokeWidth="1.5">
      <path d="M12 3 V28 M6 22 L12 28 L18 22" />
      {bidirectional ? <path d="M6 9 L12 3 L18 9" /> : null}
    </svg>
  )
}

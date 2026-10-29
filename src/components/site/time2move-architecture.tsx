'use client'

import { useId } from 'react'
import {
  time2moveInquiryArchitecture, time2moveDiagramLayout, time2moveReviewPipeline,
  type Time2MoveDiagram, type Time2MoveDiagramEdge, type Time2MoveDiagramNode, type Time2MoveNodeKind,
} from '@/data/time2move-architecture'
import { cn } from '@/lib/utils'

const nodeStyles: Record<Time2MoveNodeKind, { label: string; svg: string; html: string }> = {
  application: { label: 'Application logic', svg: 'fill-background-elevated stroke-border-strong', html: 'border-border-strong bg-background-elevated' },
  store: { label: 'Stored data', svg: 'fill-primary-50 stroke-cyan-700 dark:fill-primary-950 dark:stroke-cyan-400', html: 'border-cyan-700 bg-primary-50 dark:border-cyan-400 dark:bg-primary-950' },
  provider: { label: 'External provider', svg: 'fill-background-subtle stroke-border-strong', html: 'border-border-strong bg-background-subtle' },
}

export function Time2MoveArchitecture() {
  return (
    <div className="min-w-0 space-y-6 rounded-[1.5rem] border border-border-subtle bg-background-elevated p-4 sm:p-6">
      <Diagram graph={time2moveInquiryArchitecture} />
      <div className="max-w-4xl border-t border-border-subtle pt-5">
        <p className="text-sm font-semibold text-text-primary">My contribution</p>
        <p className="mt-2 text-sm leading-7 text-text-secondary">{time2moveInquiryArchitecture.responsibility}</p>
      </div>
      <p className="text-xs leading-6 text-text-muted">Architecture reconstructed from project source.</p>
    </div>
  )
}

export function Time2MoveReviewPipeline() {
  return <Diagram graph={time2moveReviewPipeline} />
}

function DiagramLegend({ graph }: Readonly<{ graph: Time2MoveDiagram }>) {
  const kinds = [...new Set(graph.nodes.map(node => node.kind))]
  return (
    <ul aria-label="Diagram legend" className="mt-4 flex flex-wrap gap-3 text-xs text-text-secondary">
      {kinds.map(kind => (
        <li key={kind} className="flex items-center gap-2"><span aria-hidden="true" className={cn('h-3 w-3 rounded border', nodeStyles[kind].html)} />{nodeStyles[kind].label}</li>
      ))}
    </ul>
  )
}

function diagramNode(graph: Time2MoveDiagram, id: string): Time2MoveDiagramNode {
  return graph.nodes.find(node => node.id === id)!
}

function edgeText(graph: Time2MoveDiagram, edge: Time2MoveDiagramEdge): string {
  const label = edge.label ? ` (${edge.label})` : ''
  return `${diagramNode(graph, edge.from).label} connects to ${diagramNode(graph, edge.to).label}${label}.`
}

function Diagram({ graph }: Readonly<{ graph: Time2MoveDiagram }>) {
  const id = useId()
  const description = [graph.description, ...graph.nodes.map(node => `${node.label}: ${node.detail.join('; ')}.`), ...graph.edges.map(edge => edgeText(graph, edge))].join(' ')
  return (
    <figure className="min-w-0" data-diagram={graph.id}>
      <figcaption>
        <h3 className="text-xl font-semibold text-text-primary">{graph.title}</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-text-secondary">{graph.description}</p>
      </figcaption>
      <DiagramLegend graph={graph} />
      <svg className="mt-4 hidden h-auto w-full xl:block" viewBox={`0 0 ${time2moveDiagramLayout.width} ${graph.height}`} role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{graph.title}</title>
        <desc id={`${id}-description`}>{description}</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8" className="fill-none stroke-link-primary" strokeWidth="1.5" />
          </marker>
        </defs>
        {graph.edges.map(edge => (
          <g key={edge.id} data-graph-edge={edge.id} data-from={edge.from} data-to={edge.to}>
            <path d={edge.path} className="fill-none stroke-link-primary" strokeWidth="2" strokeDasharray={edge.branch ? '6 5' : undefined} markerEnd={`url(#${id}-arrow)`} />
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
  const branches = graph.edges.filter(edge => edge.branch)
  return (
    <div className="mt-5 space-y-5 xl:hidden">
      <ol aria-label={`${graph.title}: main path`}>
        {graph.mainNodeIds.map((nodeId, index) => (
          <li key={nodeId} className="flex gap-3">
            <div aria-hidden="true" className="flex w-7 shrink-0 flex-col items-center pt-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background-subtle font-mono text-xs text-text-secondary">{index + 1}</span>
              {index < graph.mainNodeIds.length - 1 ? <VerticalConnector /> : null}
            </div>
            <MobileNode node={diagramNode(graph, nodeId)} />
          </li>
        ))}
      </ol>
      <ul aria-label={`${graph.title}: branch connections`} className="space-y-4 border-t border-border-subtle pt-4">
        {branches.map(edge => (
          <li key={edge.id} data-mobile-edge={edge.id} className="space-y-1 text-sm leading-6 text-text-secondary">
            <p className="font-semibold text-link-primary">{edge.label}</p>
            <p>
              {diagramNode(graph, edge.from).label}
              <span aria-hidden="true" className="px-2">→</span>
              <span className="sr-only"> connects to </span>
              {diagramNode(graph, edge.to).label}
            </p>
            {[edge.from, edge.to].filter(nodeId => !graph.mainNodeIds.includes(nodeId)).map(nodeId => (
              <p key={nodeId}>{diagramNode(graph, nodeId).detail.join(' · ')}</p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}

function MobileNode({ node }: Readonly<{ node: Time2MoveDiagramNode }>) {
  return (
    <div data-mobile-node={node.id} className={cn('mb-3 min-w-0 flex-1 rounded-lg border-l-2 px-4 py-3', nodeStyles[node.kind].html)}>
      <p className="text-[0.65rem] uppercase tracking-wider text-text-secondary">{nodeStyles[node.kind].label}</p>
      <p className="mt-1 font-semibold text-text-primary">{node.label}</p>
      <p className="mt-1 text-sm leading-6 text-text-secondary">{node.detail.join(' · ')}</p>
    </div>
  )
}

function VerticalConnector() {
  return (
    <svg aria-hidden="true" focusable="false" className="mx-auto my-2 h-8 w-6 fill-none stroke-link-primary" viewBox="0 0 24 32" strokeWidth="1.5">
      <path d="M12 3 V28 M6 22 L12 28 L18 22" />
    </svg>
  )
}

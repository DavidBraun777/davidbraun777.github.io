export type Time2MoveNodeKind = 'application' | 'store' | 'provider'

export const time2moveDiagramLayout = { width: 1200, nodeWidth: 210, nodeHeight: 136 }

export interface Time2MoveDiagramNode {
  id: string
  label: string
  titleLines: string[]
  detail: string[]
  kind: Time2MoveNodeKind
  x: number
  y: number
}

export interface Time2MoveDiagramEdge {
  id: string
  from: string
  to: string
  label: string
  path: string
  labelX: number
  labelY: number
  branch: boolean
}

export interface Time2MoveDiagram {
  id: string
  title: string
  description: string
  height: number
  nodes: Time2MoveDiagramNode[]
  edges: Time2MoveDiagramEdge[]
  mainNodeIds: string[]
  note: string
}

export const time2moveInquiryArchitecture: Time2MoveDiagram & { responsibility: string } = {
  id: 'inquiries', title: 'Native inquiries', height: 390,
  description: 'Six native forms share one contract, then a Next.js rewrite forwards POST /api/leads to FastAPI and its delivery adapters.',
  responsibility: 'I implemented the shared form contract, backend validation and contact preparation, deterministic intent rules, and provider adapters.',
  nodes: [
    { id: 'forms', label: 'Six native forms', titleLines: ['Six native forms'], detail: ['Native inquiry journeys'], kind: 'application', x: 10, y: 20 },
    { id: 'contract', label: 'One submission contract', titleLines: ['One submission', 'contract'], detail: ['Intent, consent, attribution'], kind: 'application', x: 245, y: 20 },
    { id: 'rewrite', label: 'Next.js rewrite', titleLines: ['Next.js rewrite'], detail: ['POST /api/leads', 'Forward to backend'], kind: 'application', x: 480, y: 20 },
    { id: 'fastapi', label: 'FastAPI service', titleLines: ['FastAPI service'], detail: ['Pydantic validation', 'Contact normalization', 'Deterministic intent rules'], kind: 'application', x: 715, y: 20 },
    { id: 'fub', label: 'Follow Up Boss', titleLines: ['Follow Up Boss'], detail: ['Event delivery adapter'], kind: 'provider', x: 950, y: 20 },
    { id: 'resend', label: 'Resend', titleLines: ['Resend'], detail: ['Conditional notification', 'or backup attempt'], kind: 'provider', x: 715, y: 240 },
  ],
  mainNodeIds: ['forms', 'contract', 'rewrite', 'fastapi', 'fub'],
  edges: [
    { id: 'forms-contract', from: 'forms', to: 'contract', label: '', path: 'M220 88 H245', labelX: 0, labelY: 0, branch: false },
    { id: 'contract-rewrite', from: 'contract', to: 'rewrite', label: '', path: 'M455 88 H480', labelX: 0, labelY: 0, branch: false },
    { id: 'rewrite-fastapi', from: 'rewrite', to: 'fastapi', label: '', path: 'M690 88 H715', labelX: 0, labelY: 0, branch: false },
    { id: 'fastapi-fub', from: 'fastapi', to: 'fub', label: '', path: 'M925 88 H950', labelX: 0, labelY: 0, branch: false },
    { id: 'fastapi-resend', from: 'fastapi', to: 'resend', label: 'Notifications / backup', path: 'M820 156 V240', labelX: 968, labelY: 201, branch: true },
  ],
  note: 'Resend can run as an optional background notification after primary acceptance, or as a synchronous backup attempt when primary delivery is not accepted. This is not a durable queue or guaranteed delivery.',
}

export const time2moveReviewPipeline: Time2MoveDiagram = {
  id: 'review-pipeline', title: 'From provider reviews to reusable data', height: 440,
  description: 'Separating provider ingestion, record identity, and presentation made the review data reusable and the serving cache rebuildable.',
  nodes: [
    { id: 'providers', label: 'Google provider adapters', titleLines: ['Google provider', 'adapters'], detail: ['Business Profile / Places'], kind: 'provider', x: 10, y: 20 },
    { id: 'normalize', label: 'Normalize and deduplicate', titleLines: ['Normalize and', 'deduplicate'], detail: ['Stable record identity', 'Consistent review fields'], kind: 'application', x: 245, y: 20 },
    { id: 'canonical', label: 'Canonical Redis records and indexes', titleLines: ['Canonical Redis', 'records and indexes'], detail: ['Published + featured IDs', 'Versioned sync state'], kind: 'store', x: 480, y: 20 },
    { id: 'public-cache', label: 'Versioned public serving cache', titleLines: ['Versioned public', 'serving cache'], detail: ['Public response + stats'], kind: 'store', x: 715, y: 20 },
    { id: 'consumer', label: 'Reviews API and carousel', titleLines: ['Reviews API', 'and carousel'], detail: ['Read the public cache'], kind: 'application', x: 950, y: 20 },
    { id: 'legacy', label: 'Legacy snapshots', titleLines: ['Legacy snapshots'], detail: ['Migrate into the', 'canonical model'], kind: 'store', x: 245, y: 290 },
  ],
  mainNodeIds: ['providers', 'normalize', 'canonical', 'public-cache', 'consumer'],
  edges: [
    { id: 'providers-normalize', from: 'providers', to: 'normalize', label: '', path: 'M220 88 H245', labelX: 0, labelY: 0, branch: false },
    { id: 'normalize-canonical', from: 'normalize', to: 'canonical', label: '', path: 'M455 88 H480', labelX: 0, labelY: 0, branch: false },
    { id: 'canonical-public', from: 'canonical', to: 'public-cache', label: '', path: 'M690 88 H715', labelX: 0, labelY: 0, branch: false },
    { id: 'public-consumer', from: 'public-cache', to: 'consumer', label: '', path: 'M925 88 H950', labelX: 0, labelY: 0, branch: false },
    { id: 'legacy-migration', from: 'legacy', to: 'canonical', label: 'Migrate snapshots', path: 'M350 290 V225 H550 V156', labelX: 405, labelY: 210, branch: true },
    { id: 'cache-rebuild', from: 'canonical', to: 'public-cache', label: 'Rebuild without provider fetch', path: 'M605 156 V195 H820 V156', labelX: 754, labelY: 181, branch: true },
  ],
  note: 'Refresh is request-driven, with authenticated manual sync and rebuild paths. The serving cache can be rebuilt from canonical records without fetching the provider again.',
}

export function time2moveDiagramText(diagram: Time2MoveDiagram): string {
  return [diagram.title, diagram.description, ...diagram.nodes.map(node => [node.label, ...node.detail].join(' ')), ...diagram.edges.map(edge => edge.label), diagram.note].filter(Boolean).join(' ')
}

export const time2moveArchitectureText = `${time2moveDiagramText(time2moveInquiryArchitecture)} My contribution: ${time2moveInquiryArchitecture.responsibility}`
export const time2moveReviewPipelineText = time2moveDiagramText(time2moveReviewPipeline)

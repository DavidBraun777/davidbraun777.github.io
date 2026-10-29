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
  bidirectional: boolean
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

export interface Time2MoveArchitecturePath extends Time2MoveDiagram {
  selectorLabel: string
  responsibility: string
}

export const time2moveArchitecturePaths: Time2MoveArchitecturePath[] = [
  {
    id: 'inquiries', selectorLabel: 'Inquiries', title: 'Native inquiries', height: 390,
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
      { id: 'forms-contract', from: 'forms', to: 'contract', label: '', path: 'M220 88 H245', labelX: 0, labelY: 0, branch: false, bidirectional: false },
      { id: 'contract-rewrite', from: 'contract', to: 'rewrite', label: '', path: 'M455 88 H480', labelX: 0, labelY: 0, branch: false, bidirectional: false },
      { id: 'rewrite-fastapi', from: 'rewrite', to: 'fastapi', label: '', path: 'M690 88 H715', labelX: 0, labelY: 0, branch: false, bidirectional: false },
      { id: 'fastapi-fub', from: 'fastapi', to: 'fub', label: '', path: 'M925 88 H950', labelX: 0, labelY: 0, branch: false, bidirectional: false },
      { id: 'fastapi-resend', from: 'fastapi', to: 'resend', label: 'Notifications / backup', path: 'M820 156 V240', labelX: 968, labelY: 201, branch: true, bidirectional: false },
    ],
    note: 'Resend can run as an optional background notification after primary acceptance, or as a synchronous backup attempt when primary delivery is not accepted. This is not a durable queue or guaranteed delivery.',
  },
  {
    id: 'rates', selectorLabel: 'Rates', title: 'Rates and calculators', height: 176,
    description: 'Local calculator and trend interfaces use Next.js market-data routes and FRED adapters.',
    responsibility: 'I built the local calculators and connected Next.js routes to external rate data; the local arithmetic and rate context are separate responsibilities.',
    nodes: [
      { id: 'calculators', label: 'Calculators and trends', titleLines: ['Calculators', 'and trends'], detail: ['Local arithmetic', 'External rate context'], kind: 'application', x: 10, y: 20 },
      { id: 'market-routes', label: 'Next.js market-data routes', titleLines: ['Next.js market-data', 'routes'], detail: ['Current + historical', 'rate-data adapters'], kind: 'application', x: 480, y: 20 },
      { id: 'fred', label: 'FRED', titleLines: ['FRED'], detail: ['External mortgage-rate', 'data'], kind: 'provider', x: 950, y: 20 },
    ],
    mainNodeIds: ['calculators', 'market-routes', 'fred'],
    edges: [
      { id: 'calculators-market', from: 'calculators', to: 'market-routes', label: '', path: 'M220 88 H480', labelX: 0, labelY: 0, branch: false, bidirectional: false },
      { id: 'market-fred', from: 'market-routes', to: 'fred', label: '', path: 'M690 88 H950', labelX: 0, labelY: 0, branch: false, bidirectional: false },
    ],
    note: 'These routes run in Next.js; they do not pass through FastAPI.',
  },
  {
    id: 'reviews', selectorLabel: 'Reviews', title: 'Reviews', height: 390,
    description: 'The reviews UI connects to a Next.js reviews API and provider adapters, with Google review sources and a Redis/Upstash store.',
    responsibility: 'I integrated provider review data with normalized records, stable identity, deduplication, indexes, sync state, and versioned serving caches.',
    nodes: [
      { id: 'reviews-ui', label: 'Reviews UI', titleLines: ['Reviews UI'], detail: ['Public carousel'], kind: 'application', x: 10, y: 20 },
      { id: 'reviews-api', label: 'Next.js reviews API and adapters', titleLines: ['Next.js reviews API', 'and adapters'], detail: ['Request-driven refresh'], kind: 'application', x: 480, y: 20 },
      { id: 'google', label: 'Google review sources', titleLines: ['Google review', 'sources'], detail: ['Business Profile / Places'], kind: 'provider', x: 950, y: 20 },
      { id: 'redis', label: 'Redis / Upstash', titleLines: ['Redis / Upstash'], detail: ['Canonical records', 'Indexes + caches'], kind: 'store', x: 480, y: 240 },
    ],
    mainNodeIds: ['reviews-ui', 'reviews-api', 'google'],
    edges: [
      { id: 'ui-api', from: 'reviews-ui', to: 'reviews-api', label: '', path: 'M220 88 H480', labelX: 0, labelY: 0, branch: false, bidirectional: false },
      { id: 'api-google', from: 'reviews-api', to: 'google', label: 'Provider adapters', path: 'M690 88 H950', labelX: 820, labelY: 71, branch: false, bidirectional: false },
      { id: 'api-redis', from: 'reviews-api', to: 'redis', label: 'Records / serving cache', path: 'M585 156 V240', labelX: 746, labelY: 201, branch: true, bidirectional: true },
    ],
    note: 'The store separates normalized review records, identity and deduplication, indexes, sync state, and versioned public caches.',
  },
  {
    id: 'property-search', selectorLabel: 'Property search', title: 'Property search', height: 176,
    description: 'Minnesota property pages embed IDX Broker for provider-hosted listing search and registration.',
    responsibility: 'I integrated the Minnesota property pages with the IDX Broker embed; the provider supplies the hosted listing search and registration.',
    nodes: [
      { id: 'property-pages', label: 'Minnesota property pages', titleLines: ['Minnesota property', 'pages'], detail: ['Regional website'], kind: 'application', x: 10, y: 20 },
      { id: 'idx-embed', label: 'IDX Broker embed', titleLines: ['IDX Broker embed'], detail: ['Provider-hosted search', 'and registration'], kind: 'application', x: 480, y: 20 },
      { id: 'idx-provider', label: 'IDX Broker', titleLines: ['IDX Broker'], detail: ['Hosted listing experience'], kind: 'provider', x: 950, y: 20 },
    ],
    mainNodeIds: ['property-pages', 'idx-embed', 'idx-provider'],
    edges: [
      { id: 'pages-embed', from: 'property-pages', to: 'idx-embed', label: '', path: 'M220 88 H480', labelX: 0, labelY: 0, branch: false, bidirectional: false },
      { id: 'embed-idx', from: 'idx-embed', to: 'idx-provider', label: '', path: 'M690 88 H950', labelX: 0, labelY: 0, branch: false, bidirectional: false },
    ],
    note: 'IDX registration is separate from the six native inquiry forms. No local listing synchronization or registration bridge is shown.',
  },
]

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
    { id: 'homepage-artifact', label: 'Homepage-cache artifact', titleLines: ['Homepage-cache', 'artifact'], detail: ['Generated by the store', 'No consumer shown'], kind: 'store', x: 950, y: 290 },
  ],
  mainNodeIds: ['providers', 'normalize', 'canonical', 'public-cache', 'consumer'],
  edges: [
    { id: 'providers-normalize', from: 'providers', to: 'normalize', label: '', path: 'M220 88 H245', labelX: 0, labelY: 0, branch: false, bidirectional: false },
    { id: 'normalize-canonical', from: 'normalize', to: 'canonical', label: '', path: 'M455 88 H480', labelX: 0, labelY: 0, branch: false, bidirectional: false },
    { id: 'canonical-public', from: 'canonical', to: 'public-cache', label: '', path: 'M690 88 H715', labelX: 0, labelY: 0, branch: false, bidirectional: false },
    { id: 'public-consumer', from: 'public-cache', to: 'consumer', label: '', path: 'M925 88 H950', labelX: 0, labelY: 0, branch: false, bidirectional: false },
    { id: 'legacy-migration', from: 'legacy', to: 'canonical', label: 'Migrate snapshots', path: 'M350 290 V225 H550 V156', labelX: 405, labelY: 210, branch: true, bidirectional: false },
    { id: 'cache-rebuild', from: 'canonical', to: 'public-cache', label: 'Rebuild without provider fetch', path: 'M605 156 V195 H820 V156', labelX: 754, labelY: 181, branch: true, bidirectional: false },
    { id: 'homepage-build', from: 'canonical', to: 'homepage-artifact', label: 'Generate stored artifact', path: 'M585 156 V255 H1055 V290', labelX: 852, labelY: 242, branch: true, bidirectional: false },
  ],
  note: 'Refresh is request-driven, with authenticated manual sync and rebuild paths. The inspected route reads the public cache; no homepage-cache consumer or scheduled worker is shown.',
}

export const time2moveAllPathsResponsibility = 'I connected the customer-facing interfaces, application logic, data storage, and provider adapters across these four separate paths.'

export function time2moveDiagramText(diagram: Time2MoveDiagram): string {
  return [diagram.title, diagram.description, ...diagram.nodes.map(node => [node.label, ...node.detail].join(' ')), ...diagram.edges.map(edge => edge.label), diagram.note].filter(Boolean).join(' ')
}

export const time2moveArchitectureText = [time2moveAllPathsResponsibility, ...time2moveArchitecturePaths.map(path => `${time2moveDiagramText(path)} ${path.responsibility}`)].join(' ')
export const time2moveReviewPipelineText = time2moveDiagramText(time2moveReviewPipeline)

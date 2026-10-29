export const aiLessonCopy = {
  title: 'How to add AI to an existing workflow',
  badge: 'Illustrative extension',
  disclaimer: 'A new educational example, not a feature completed in Time2Move. The examples below are precomputed; no model or CRM requests are made.',
  boundary: 'Predefined form choices can keep their explicit routing rules. A proposed LLM could help interpret free-text requests, while schema checks, review, and deterministic business logic control what gets accepted. The historical backend uses deterministic taxonomy rules, not an LLM classifier.',
  sequence: ['Synthetic message', 'Proposed structured interpretation', 'Validation', 'Human review', 'Existing deterministic routing'],
  schema: 'The proposed schema accepts only intent, summary, evidence, and needs_review. Intent is buyer, seller, consultation, or unknown. Summary is 1–240 characters; evidence contains 0–3 exact source phrases of 1–160 characters each; needs_review is boolean. Unknown fields and wrong types are rejected.',
  evidence: 'Finding a source phrase does not prove the interpretation is correct. Schema validity and factual correctness are separate questions.',
  review: 'The application requires human review even when needs_review is false. Unknown or ambiguous intent calls for clarification. Only a reviewed interpretation could be considered by the existing deterministic routing rules.',
  trustedFields: 'Consent, contact identity, source attribution, and explicit user selections remain outside model control. Suggestions are never merged into those trusted fields.',
  evaluation: 'Before using a model, compare it against labeled examples and the existing rule baseline. Inspect per-intent precision and recall, appropriate abstention, and unsupported details. These illustrative proposals provide no evidence of model accuracy.',
} as const

const intents = ['buyer', 'seller', 'consultation', 'unknown'] as const
const fields = ['intent', 'summary', 'evidence', 'needs_review'] as const
const summaryLimit = 240
const evidenceLimit = 160
const maxEvidence = 3

export interface AiProposal {
  intent: typeof intents[number]
  summary: string
  evidence: string[]
  needs_review: boolean
}

export const proposedAiSchema = {
  type: 'object',
  additionalProperties: false,
  required: fields,
  properties: {
    intent: { type: 'string', enum: intents },
    summary: { type: 'string', minLength: 1, maxLength: summaryLimit, pattern: '\\S' },
    evidence: { type: 'array', minItems: 0, maxItems: maxEvidence, items: { type: 'string', minLength: 1, maxLength: evidenceLimit, pattern: '\\S' } },
    needs_review: { type: 'boolean' },
  },
} as const

type ValidationResult = { valid: true; proposal: AiProposal } | { valid: false; reason: string }

function boundedText(value: unknown, limit: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= limit
}

/** Strict local checks for this proposed schema; no coercion or model calls. */
export function validateAiProposal(value: unknown): ValidationResult {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { valid: false, reason: 'Expected a structured object.' }
  }
  const proposal = value as Record<string, unknown>
  const keys = Object.keys(proposal)
  if (keys.length !== fields.length || keys.some(key => !fields.some(field => field === key))) {
    return { valid: false, reason: 'Only the four required fields are accepted.' }
  }
  if (!intents.some(intent => intent === proposal.intent)) {
    return { valid: false, reason: 'Intent must be buyer, seller, consultation, or unknown.' }
  }
  if (!boundedText(proposal.summary, summaryLimit)) {
    return { valid: false, reason: 'Summary must be a nonblank string of at most 240 characters.' }
  }
  if (!Array.isArray(proposal.evidence) || proposal.evidence.length > maxEvidence) {
    return { valid: false, reason: 'Evidence must contain at most three source phrases.' }
  }
  if (!Array.from(proposal.evidence).every(span => boundedText(span, evidenceLimit))) {
    return { valid: false, reason: 'Each source phrase must be a nonblank string of at most 160 characters.' }
  }
  if (typeof proposal.needs_review !== 'boolean') {
    return { valid: false, reason: 'needs_review must be a boolean.' }
  }
  return { valid: true, proposal: proposal as unknown as AiProposal }
}

interface LessonCheck {
  status: string
  detail: string
}

export interface AiLessonEvaluation {
  schema: LessonCheck
  evidence: LessonCheck
  humanReview: LessonCheck
  outcome: string
}

/** A demonstration gate: it never authorizes routing or invokes a provider. */
export function evaluateAiProposal(message: string, candidate: unknown): AiLessonEvaluation {
  const schema = validateAiProposal(candidate)
  if (!schema.valid) {
    return {
      schema: { status: 'Rejected', detail: schema.reason },
      evidence: { status: 'Not run', detail: 'Correct the proposal’s shape before checking source phrases.' },
      humanReview: { status: 'Blocked', detail: 'Invalid structure cannot proceed to review or routing.' },
      outcome: 'Reject this proposal. No routing decision is made.',
    }
  }
  const schemaCheck = { status: 'Passed', detail: 'All four fields satisfy the proposed strict schema.' }
  const absent = schema.proposal.evidence.filter(span => !message.includes(span))
  if (absent.length > 0) {
    return {
      schema: schemaCheck,
      evidence: { status: 'Failed', detail: `Not found in the visitor message: ${absent.map(span => `“${span}”`).join('; ')}.` },
      humanReview: { status: 'Blocked', detail: 'Unsupported evidence must be resolved before review or routing.' },
      outcome: 'Reject the unsupported proposal. A valid shape did not make its supporting claim true.',
    }
  }
  const evidenceCheck = {
    status: 'Passed',
    detail: schema.proposal.evidence.length === 0
      ? 'No source phrases were proposed. This check establishes no supporting evidence.'
      : 'Every proposed source phrase occurs in the synthetic message. Interpretation still requires review.',
  }
  if (schema.proposal.intent === 'unknown') {
    return {
      schema: schemaCheck,
      evidence: evidenceCheck,
      humanReview: { status: 'Clarification needed', detail: 'A person needs to clarify the visitor’s intent before considering a route.' },
      outcome: 'Ask for clarification. Do not convert uncertainty into a buyer, seller, or consultation route.',
    }
  }
  return {
    schema: schemaCheck,
    evidence: evidenceCheck,
    humanReview: { status: 'Required', detail: 'Not performed in this example. The application keeps this gate closed regardless of the model-supplied flag.' },
    outcome: 'Hold for human review. Only an approved interpretation could reach existing deterministic routing; this example makes no routing or delivery request.',
  }
}

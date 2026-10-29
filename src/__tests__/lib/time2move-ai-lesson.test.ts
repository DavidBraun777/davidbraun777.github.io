import { describe, expect, test } from 'vitest'
import fixtures from '@/data/time2move-ai-fixtures.json'
import { evaluateAiProposal, proposedAiSchema, validateAiProposal } from '@/lib/time2move-ai-lesson'

const valid = fixtures.cases[0].proposal

describe('illustrative proposal validation', () => {
  test.each([undefined, null, false, 42, 'seller', []])('rejects a non-object proposal: %j', value => {
    expect(validateAiProposal(value)).toEqual({ valid: false, reason: 'Expected a structured object.' })
  })

  test('rejects missing, extra and substituted fields without coercion', () => {
    const { needs_review: removed, ...missing } = valid
    void removed
    for (const proposal of [missing, { ...valid, consent: true }, { ...missing, consent: true }]) {
      expect(validateAiProposal(proposal)).toMatchObject({ valid: false, reason: 'Only the four required fields are accepted.' })
    }
    for (const [field, value] of [
      ['intent', 'investor'], ['intent', 1], ['summary', 12], ['summary', ''], ['summary', '   '],
      ['summary', 'x'.repeat(241)], ['evidence', 'sell my house'], ['evidence', ['a', 'b', 'c', 'd']],
      ['evidence', [12]], ['evidence', Array(1)], ['evidence', ['']], ['evidence', [' '.repeat(3)]], ['evidence', ['x'.repeat(161)]],
      ['needs_review', 'true'], ['needs_review', 0],
    ]) {
      expect(validateAiProposal({ ...valid, [field as string]: value }), `${field}: ${value}`).toMatchObject({ valid: false })
    }
  })

  test('accepts exact schema bounds and all allowed intent values', () => {
    for (const intent of ['buyer', 'seller', 'consultation', 'unknown']) {
      const proposal = { ...valid, intent, summary: 'x'.repeat(240), evidence: ['a', 'b', 'c'.repeat(160)], needs_review: false }
      expect(validateAiProposal(proposal)).toEqual({ valid: true, proposal })
    }
    expect(validateAiProposal({ ...valid, summary: 'x', evidence: [] })).toMatchObject({ valid: true })
    expect(proposedAiSchema).toMatchObject({
      additionalProperties: false,
      properties: { summary: { maxLength: 240 }, evidence: { minItems: 0, maxItems: 3, items: { maxLength: 160 } } },
    })
  })
})

describe('separate evidence and application review gates', () => {
  test('evaluates the supplied fixtures rather than trusting their expected results', () => {
    for (const example of fixtures.cases) {
      const evaluation = evaluateAiProposal(example.input, example.proposal)
      expect(evaluation.schema.status).toBe('Passed')
      expect(evaluation.evidence.status).toBe(example.expected_checks.evidence_presence === 'pass' ? 'Passed' : 'Failed')
    }
    expect(evaluateAiProposal(fixtures.cases[0].input, valid).humanReview.status).toBe('Required')
    expect(evaluateAiProposal(fixtures.cases[1].input, fixtures.cases[1].proposal).humanReview.status).toBe('Clarification needed')
    const rejected = evaluateAiProposal(fixtures.cases[2].input, fixtures.cases[2].proposal)
    expect(rejected.humanReview.status).toBe('Blocked')
    expect(rejected.evidence.detail).toContain('budget of $500,000')
    expect(rejected.evidence.detail).not.toContain('“sell my house”')
  })

  test('short-circuits invalid shape and reports all absent exact phrases', () => {
    const invalid = evaluateAiProposal('Anything', { ...valid, evidence: null })
    expect(invalid.schema.status).toBe('Rejected')
    expect(invalid.evidence.status).toBe('Not run')
    expect(invalid.humanReview.status).toBe('Blocked')
    const absent = evaluateAiProposal('Sell my house', { ...valid, evidence: ['sell my house', 'unknown'] })
    expect(absent.evidence.detail).toContain('“sell my house”; “unknown”')
    expect(absent.humanReview.status).toBe('Blocked')
  })

  test('never accepts a proposal based on a model-controlled review flag or phrase presence', () => {
    const message = fixtures.cases[0].input
    const reviewTrue = evaluateAiProposal(message, valid)
    const reviewFalse = evaluateAiProposal(message, { ...valid, needs_review: false })
    expect(reviewFalse).toEqual(reviewTrue)
    expect(reviewFalse.humanReview.status).toBe('Required')
    // A deliberately wrong summary can pass phrase presence; the application gate stays closed.
    const wrongMeaning = evaluateAiProposal(message, { ...valid, summary: 'The visitor wants to buy.', intent: 'buyer' })
    expect(wrongMeaning.schema.status).toBe('Passed')
    expect(wrongMeaning.evidence.status).toBe('Passed')
    expect(wrongMeaning.humanReview.status).toBe('Required')
    expect(evaluateAiProposal(message, { ...valid, intent: 'unknown', needs_review: false }).humanReview.status).toBe('Clarification needed')
    expect(evaluateAiProposal(message, { ...valid, evidence: [] }).humanReview.status).toBe('Required')
  })

  test('does not mutate the message, proposal or trusted input fields', () => {
    const proposal = Object.freeze({ ...valid, evidence: Object.freeze([...valid.evidence]) })
    const snapshot = JSON.stringify(proposal)
    evaluateAiProposal(fixtures.cases[0].input, proposal)
    expect(JSON.stringify(proposal)).toBe(snapshot)
    expect(validateAiProposal({ ...valid, contact: { email: 'synthetic@example.test' } })).toMatchObject({ valid: false })
  })
})

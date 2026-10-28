import { describe, expect, test } from 'vitest'
import { prepareMdxSource } from '@/lib/search/readable-mdx'

describe('repository-authored MDX comment preprocessing', () => {
  test.each([
    ['empty input', '', ''],
    ['comment-free MDX', '## Café\r\n\r\n**Exact** spacing  \r\n<Callout tone="info">Public text.</Callout>', '## Café\r\n\r\n**Exact** spacing  \r\n<Callout tone="info">Public text.</Callout>'],
    ['ordinary comment', 'Before <!-- hidden --> after.', 'Before  after.'],
    ['empty comment', 'Before<!---->after.', 'Beforeafter.'],
    ['adjacent comments', '<!-- first --><!-- second -->Public text.', 'Public text.'],
    ['multiline comment', 'Before\n<!-- hidden\non another line -->\nAfter', 'Before\n\nAfter'],
    ['reconstructed comment', '<<!-- remove -->!-- hidden -->', ''],
    ['deeper reconstruction', '<<<<!-- removed -->!-- removed -->!-- removed -->!-- hidden sentinel -->', ''],
    ['reconstruction between public text', 'Before <<!-- remove -->!-- hidden --> after.', 'Before  after.'],
    ['unterminated comment', '<!-- unfinished', '<!-- unfinished'],
    ['malformed closing delimiter', '<!-- unfinished --!>', '<!-- unfinished --!>'],
    ['incomplete opening delimiter', '<!- unfinished', '<!- unfinished'],
    ['stray closing delimiter', '-->', '-->'],
  ])('normalizes %s completely and idempotently', (_label, source, expected) => {
    const prepared = prepareMdxSource(source)
    expect(prepared).toBe(expected)
    expect(prepareMdxSource(prepared)).toBe(prepared)
  })
})

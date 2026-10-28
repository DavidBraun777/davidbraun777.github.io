import { describe, expect, test } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const sourceRoots = ['src/app', 'src/components', 'src/data', 'src/lib']
const textFileExtensions = new Set(['.ts', '.tsx', '.mdx'])
const disallowedCharacter = String.fromCharCode(0x2014)
// This successor-site label is explicitly required by the portfolio owner.
const approvedLabels = ['Current business website — Hombuzz']

function collectTextFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      return collectTextFiles(fullPath)
    }

    return textFileExtensions.has(path.extname(fullPath)) ? [fullPath] : []
  })
}

describe('visible content punctuation', () => {
  test('source copy uses em dashes only in explicitly approved labels', () => {
    const filesWithEmDash = sourceRoots
      .flatMap((root) => collectTextFiles(root))
      .filter((filePath) => approvedLabels.reduce(
        (content, label) => content.replaceAll(label, ''),
        readFileSync(filePath, 'utf8')
      ).includes(disallowedCharacter))

    expect(filesWithEmDash).toEqual([])
  })
})

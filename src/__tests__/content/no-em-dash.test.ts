import { describe, expect, test } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const sourceRoots = ['src/app', 'src/components', 'src/data', 'src/lib']
const textFileExtensions = new Set(['.ts', '.tsx', '.mdx'])
const disallowedCharacter = String.fromCharCode(0x2014)

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
  test('source copy does not contain em dash characters', () => {
    const filesWithEmDash = sourceRoots
      .flatMap((root) => collectTextFiles(root))
      .filter((filePath) => readFileSync(filePath, 'utf8').includes(disallowedCharacter))

    expect(filesWithEmDash).toEqual([])
  })
})

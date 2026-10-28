import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import * as fs from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { coverageFiles } from '../../../scripts/coverage-scope.mjs'
import { validateCoverage } from '../../../scripts/check-coverage.mjs'

vi.mock('node:child_process', () => ({ execFileSync: vi.fn() }))
vi.mock('node:fs', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs')>()
  return { ...actual, readFileSync: vi.fn(actual.readFileSync) }
})

let root: string
const source = 'src/runtime.ts'
const properties = `# Keep existing Sonar scope\nsonar.sources=.\nsonar.exclusions=src/__tests__/**,e2e/**,**/node_modules/**\nsonar.coverage.exclusions=vitest.config.ts,src/data/profile.ts\n`
// Deliberately tiny LCOV fixtures test the validator; never write them to coverage/.
function report(file = source, details = 'DA:1,1\nBRDA:1,0,0,1\nLF:1\nLH:1\nBRF:1\nBRH:1') {
  return `TN:\nSF:${file}\n${details}\nend_of_record\n`
}
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'portfolio-coverage-'))
  mkdirSync(join(root, 'src'))
  writeFileSync(join(root, source), 'export const value = 1\n')
  writeFileSync(join(root, 'sonar-project.properties'), properties)
  vi.mocked(execFileSync).mockReturnValue(`${source}\0`)
})
afterEach(async () => {
  vi.restoreAllMocks()
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs')
  vi.mocked(fs.readFileSync).mockReset().mockImplementation(actual.readFileSync)
  rmSync(root, { recursive: true, force: true })
})

describe('shared coverage scope', () => {
  it('includes unimported runtime code and scripts, preserving Sonar exclusions and unique paths', () => {
    const files = [source, source, 'next.config.ts', 'scripts/check-bundle-size.mjs', 'another/runtime.cts', 'module.mts', 'ui.jsx', 'src/lib/types.ts', 'vitest.config.ts', 'src/data/profile.ts', 'src/__tests__/new.test.ts', 'e2e/search.spec.ts', 'node_modules/library/index.js', 'README.md', '']
    vi.mocked(execFileSync).mockReturnValue(files.join('\0'))
    writeFileSync(join(root, 'sonar-project.properties'), properties.replaceAll('\n', '\r\n'))
    expect(coverageFiles(root)).toEqual(['another/runtime.cts', 'module.mts', 'next.config.ts', 'scripts/check-bundle-size.mjs', 'src/lib/types.ts', source, 'ui.jsx'])
    expect(execFileSync).toHaveBeenCalledWith('/usr/bin/git', ['ls-files', '-c', '-o', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' })
  })
  it('rejects an unexpected narrowed source scope', () => {
    writeFileSync(join(root, 'sonar-project.properties'), properties.replace('sonar.sources=.', 'sonar.sources=src'))
    expect(() => coverageFiles(root)).toThrow('repository-wide Sonar source scope')
  })
})

describe('raw LCOV validation', () => {
  it('counts actual hits and includes zero-denominator files without calling them covered code', () => {
    writeFileSync(join(root, 'src/types.ts'), 'export interface Item { value: string }')
    const zero = report('src/types.ts', 'LF:0\nLH:0\nBRF:0\nBRH:0')
    expect(validateCoverage(report() + zero, [source, 'src/types.ts'], root)).toEqual({ files: 2, lines: 1, branches: 1 })
  })
  it.each([
    ['absolute', report('/src/runtime.ts')],
    ['traversal', report('src/../runtime.ts')],
    ['Windows traversal', report('src\\..\\runtime.ts')],
    ['outside eligible scope', report('private/runtime.ts')],
    ['missing SF', 'TN:\nLF:0\nend_of_record'],
  ])('rejects %s source paths', (_label, value) => {
    expect(() => validateCoverage(value, [source], root)).toThrow('Unexpected LCOV source path')
  })
  it('rejects duplicate records rather than double-counting hits', () => {
    expect(() => validateCoverage(report() + report(), [source], root)).toThrow('Duplicate LCOV source')
  })
  it.each(['missing.ts', 'src'])('rejects a missing file or a directory: %s', file => {
    expect(() => validateCoverage(report(file), [file], root)).toThrow('LCOV source does not exist')
  })
  it.each([
    ['line miss', 'DA:1,1', 'DA:1,0'],
    ['branch miss', 'BRDA:1,0,0,1', 'BRDA:1,0,0,0'],
    ['unexecuted branch', 'BRDA:1,0,0,1', 'BRDA:1,0,0,-'],
    ['invalid line hit', 'DA:1,1', 'DA:1,NaN'],
    ['negative hit', 'DA:1,1', 'DA:1,-1'],
    ['missing total', 'LF:1', ''],
    ['missing covered', 'LH:1', ''],
    ['wrong total', 'LF:1', 'LF:2'],
    ['wrong covered', 'LH:1', 'LH:0'],
    ['wrong branch total', 'BRF:1', 'BRF:2'],
    ['wrong branch covered', 'BRH:1', 'BRH:0'],
  ])('rejects raw %s even if a percentage might round to 100', (_label, from, to) => {
    expect(() => validateCoverage(report().replace(from, to), [source], root)).toThrow('Incomplete')
  })
  it('rejects omitted eligible sources, including a wholly empty report', () => {
    expect(() => validateCoverage(report(), [source, 'src/new-runtime.ts'], root)).toThrow('Missing LCOV source files: src/new-runtime.ts')
    expect(() => validateCoverage('', [source], root)).toThrow('Missing LCOV source files')
  })
  it.each([
    'LF:0\nLH:0\nBRF:0\nBRH:0',
    'DA:1,1\nLF:1\nLH:1\nBRF:0\nBRH:0',
  ])('does not claim success for an empty denominator: %s', details => {
    expect(() => validateCoverage(report(source, details), [source], root)).toThrow('nonzero line and branch denominators')
  })
  it('runs the CLI using the real validator and shared inventory', async () => {
    const originalArgv = process.argv
    const script = resolve('scripts/check-coverage.mjs')
    const actual = await vi.importActual<typeof import('node:fs')>('node:fs')
    vi.mocked(fs.readFileSync).mockImplementation(((path: fs.PathOrFileDescriptor, options: never) => path === 'coverage/lcov.info' ? report() : actual.readFileSync(path, options)) as typeof fs.readFileSync)
    vi.spyOn(process, 'cwd').mockReturnValue(root)
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    process.argv = [process.execPath, script]
    try {
      vi.resetModules()
      await import('../../../scripts/check-coverage.mjs')
      expect(log).toHaveBeenCalledWith('Verified 1 source files: 1/1 lines, 1/1 branch outcomes; zero uncovered')
    } finally { process.argv = originalArgv }
  })
})

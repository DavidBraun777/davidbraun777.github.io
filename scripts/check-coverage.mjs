#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { coverageFiles } from './coverage-scope.mjs'

/** Validate raw LCOV, including zero-denominator files and never-imported code. */
export function validateCoverage(report, expectedFiles, root) {
  const expected = new Set(expectedFiles)
  const seen = new Set()
  let lines = 0
  let branches = 0
  for (const record of report.split('end_of_record').filter(record => record.trim())) {
    const entries = record.trim().split(/\r?\n/)
    const source = entries.find(line => line.startsWith('SF:'))?.slice(3)
    if (!source || isAbsolute(source) || source.split(/[\\/]/).includes('..') || !expected.has(source)) {
      throw new Error(`Unexpected LCOV source path: ${source}`)
    }
    if (seen.has(source)) throw new Error(`Duplicate LCOV source: ${source}`)
    if (!existsSync(resolve(root, source)) || !statSync(resolve(root, source)).isFile()) {
      throw new Error(`LCOV source does not exist: ${source}`)
    }
    seen.add(source)
    const lineHits = entries.filter(line => line.startsWith('DA:')).map(line => Number(line.split(',')[1]))
    const branchHits = entries.filter(line => line.startsWith('BRDA:')).map(line => Number(line.split(',')[3]))
    for (const [totalKey, hitKey, hits] of [['LF', 'LH', lineHits], ['BRF', 'BRH', branchHits]]) {
      const total = entries.find(line => line.startsWith(`${totalKey}:`))?.split(':')[1]
      const covered = entries.find(line => line.startsWith(`${hitKey}:`))?.split(':')[1]
      if (total === undefined || covered === undefined || Number(total) !== hits.length || Number(covered) !== hits.length || hits.some(hit => !Number.isFinite(hit) || hit <= 0)) {
        throw new Error(`Incomplete ${totalKey} coverage in ${source}`)
      }
    }
    lines += lineHits.length
    branches += branchHits.length
  }
  const missing = expectedFiles.filter(file => !seen.has(file))
  if (missing.length) throw new Error(`Missing LCOV source files: ${missing.join(', ')}`)
  if (!lines || !branches) throw new Error('Coverage must have nonzero line and branch denominators')
  return { files: seen.size, lines, branches }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = validateCoverage(readFileSync('coverage/lcov.info', 'utf8'), coverageFiles(), process.cwd())
  console.log(`Verified ${result.files} source files: ${result.lines}/${result.lines} lines, ${result.branches}/${result.branches} branch outcomes; zero uncovered`)
}

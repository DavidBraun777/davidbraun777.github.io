#!/usr/bin/env node

/**
 * Check total JS bundle size from the Next.js build output.
 * Exits with code 1 if the budget is exceeded.
 *
 * Usage: node scripts/check-bundle-size.mjs
 */

import { readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

const BUDGET_KB = 1500

function totalSize(dir, ext) {
  if (!existsSync(dir)) return 0
  let size = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      size += totalSize(full, ext)
    } else if (entry.name.endsWith(ext)) {
      size += statSync(full).size
    }
  }
  return size
}

const staticDir = join(process.cwd(), '.next', 'static')
if (!existsSync(staticDir)) {
  console.error('No .next/static directory found. Run `npm run build` first.')
  process.exit(1)
}

const jsKB = Math.round(totalSize(staticDir, '.js') / 1024)
const cssKB = Math.round(totalSize(staticDir, '.css') / 1024)

console.log(`JS:  ${jsKB} KB`)
console.log(`CSS: ${cssKB} KB`)
console.log(`Budget: ${BUDGET_KB} KB (JS only)`)

if (jsKB > BUDGET_KB) {
  console.error(
    `\nFAIL: JS bundle ${jsKB} KB exceeds ${BUDGET_KB} KB budget by ${jsKB - BUDGET_KB} KB`
  )
  process.exit(1)
}

console.log(`\nOK: ${BUDGET_KB - jsKB} KB under budget`)

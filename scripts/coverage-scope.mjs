import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, matchesGlob } from 'node:path'

/** Use Sonar's existing scope for both instrumentation and LCOV validation. */
export function coverageFiles(root = process.cwd()) {
  const properties = Object.fromEntries(
    readFileSync(join(root, 'sonar-project.properties'), 'utf8')
      .split(/\r?\n/)
      .filter(line => line.startsWith('sonar.'))
      .map(line => {
        const separator = line.indexOf('=')
        return [line.slice(0, separator), line.slice(separator + 1).trim()]
      })
  )
  if (properties['sonar.sources'] !== '.') throw new Error('Expected repository-wide Sonar source scope')
  const excluded = [properties['sonar.exclusions'], properties['sonar.coverage.exclusions']]
    .flatMap(value => value.split(','))
  // Include untracked source during local development as well as tracked files.
  // Git's ignore rules match the scanner's treatment of generated output.
  const files = execFileSync('git', ['ls-files', '-c', '-o', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0')
  return [...new Set(files)].filter(file =>
    /\.(?:[cm]?[jt]s|[jt]sx)$/.test(file) &&
    !excluded.some(pattern => matchesGlob(file, pattern))
  ).sort()
}

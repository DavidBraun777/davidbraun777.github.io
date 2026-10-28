import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { existsSync, readdirSync, statSync, type Dirent, type Stats } from 'node:fs'
import { join } from 'node:path'

vi.mock('node:fs', () => ({ existsSync: vi.fn(), readdirSync: vi.fn(), statSync: vi.fn() }))

const root = join(process.cwd(), '.next', 'static')
const directories = new Map<string, { name: string; directory: boolean }[]>()
const sizes = new Map<string, number>()
const run = () => import('../../../scripts/check-bundle-size.mjs')

function directory(path: string, entries: { name: string; directory?: boolean; size?: number }[]) {
  directories.set(path, entries.map(entry => ({ name: entry.name, directory: entry.directory ?? false })))
  entries.forEach(entry => { if (entry.size !== undefined) sizes.set(join(path, entry.name), entry.size) })
}

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  directories.clear()
  sizes.clear()
  vi.mocked(existsSync).mockImplementation(path => directories.has(String(path)))
  vi.mocked(readdirSync).mockImplementation(((path: Parameters<typeof readdirSync>[0]) => (directories.get(String(path)) ?? []).map(entry => ({ name: entry.name, isDirectory: () => entry.directory })) as Dirent[]) as unknown as typeof readdirSync)
  vi.mocked(statSync).mockImplementation(path => ({ size: sizes.get(String(path)) } as Stats))
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(process, 'exit').mockImplementation(code => { throw new Error(`process exit ${code}`) })
})

afterEach(() => vi.restoreAllMocks())

describe('production bundle budget script', () => {
  it('fails with an actionable message when no production build exists', async () => {
    await expect(run()).rejects.toThrow('process exit 1')
    expect(process.exit).toHaveBeenCalledWith(1)
    expect(console.error).toHaveBeenCalledWith('No .next/static directory found. Run `npm run build` first.')
    expect(readdirSync).not.toHaveBeenCalled()
    expect(console.log).not.toHaveBeenCalled()
  })

  it('recurses into chunks, reports CSS separately, ignores other assets and accepts the exact JS budget', async () => {
    directory(root, [
      { name: 'chunks', directory: true }, { name: 'entry.js', size: 500 * 1024 },
      { name: 'styles.css', size: 2000 * 1024 }, { name: 'entry.js.map', size: 9000 * 1024 },
    ])
    directory(join(root, 'chunks'), [{ name: 'nested', directory: true }, { name: 'vendor.js', size: 700 * 1024 }])
    directory(join(root, 'chunks', 'nested'), [{ name: 'application.js', size: 300 * 1024 }])
    await run()
    expect(vi.mocked(console.log).mock.calls.map(call => call[0])).toEqual(['JS:  1500 KB', 'CSS: 2000 KB', 'Budget: 1500 KB (JS only)', '\nOK: 0 KB under budget'])
    expect(statSync).not.toHaveBeenCalledWith(join(root, 'entry.js.map'))
    expect(process.exit).not.toHaveBeenCalled()
  })

  it('fails when rounded JS size exceeds budget, without printing a successful result', async () => {
    directory(root, [{ name: 'large.js', size: 1501 * 1024 }])
    await expect(run()).rejects.toThrow('process exit 1')
    expect(console.error).toHaveBeenCalledWith('\nFAIL: JS bundle 1501 KB exceeds 1500 KB budget by 1 KB')
    expect(process.exit).toHaveBeenCalledWith(1)
    expect(vi.mocked(console.log).mock.calls.some(call => String(call[0]).includes('OK:'))).toBe(false)
  })

  it('rounds byte totals and tolerates a listed child directory removed during inspection', async () => {
    directory(root, [{ name: 'stale-chunks', directory: true }, { name: 'tiny.js', size: 513 }, { name: 'theme.css', size: 511 }])
    await run()
    expect(existsSync).toHaveBeenCalledWith(join(root, 'stale-chunks'))
    expect(readdirSync).not.toHaveBeenCalledWith(join(root, 'stale-chunks'), expect.anything())
    expect(console.log).toHaveBeenCalledWith('JS:  1 KB')
    expect(console.log).toHaveBeenCalledWith('CSS: 0 KB')
    expect(console.log).toHaveBeenCalledWith('\nOK: 1499 KB under budget')
  })
})

import { createHash } from 'node:crypto'
import { beforeAll, describe, expect, test } from 'vitest'
import { allSystems } from '@/data/systems'
import { buildSearchIndex } from '@/lib/search/build-index'
import { createProjectContent } from '@/lib/search/project-destinations'
import { searchContent } from '@/lib/search/search'
import type { SearchIndex } from '@/lib/search/types'

// Captured BEFORE the Sonar refactor from published master ba84b4d73d6f93a8af7622737cdc6c12998d2fa7.
// These compact digests cover complete values, including ordering, labels, ancestry
// and fallbacks. Update only after reviewing intentional content/URL changes;
// insertion-stability tests alone cannot establish compatibility with published links.
// Reviewed Time2Move editorial update on 2026-10-29 against b75e8c7e488a11fabdaa94f1aacbdace06afc91a:
// only Time2Move and its People's Connection experience reference changed. All
// unrelated records, nine other project manifests, and unrelated ranking values
// and relative order matched exactly. Major section/audit IDs remain; rewritten
// content-derived blocks intentionally changed, with evidence inside a disclosure.
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([key, item]) => [key, canonical(item)])
  )
  return value
}
const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
let index: SearchIndex
beforeAll(async () => { index = await buildSearchIndex() })

const queries = [
  ["BM25",3,"ad756a399749d71db3c77a4427c617d7bc345eaa5e99e64e9717e29a37444483"],
  ["RAGeATM BM25",4,"403933753c3031515db1a47980de97dcf987641010082af31ee11ace3c1faa33"],
  ["RAGeATM",6,"6f16e08958c8bd541c69a24fa92564fc353aa8c5396e6c0a3d9df775a2c2dc63"],
  ["Static embeddings",1,"c668f80143157b39867a49d533f45cf0c69263afede4ae1b7eb91cc1e85c379b"],
  ["BM25 keyword",1,"47cced000f89944866711c99a9331ad9f0fdcfd86ae4d61707cdc2ce690f15ae"],
  ["BM25 weak",2,"72ed616f9318954b1becb558c3b9ac9085d22f707b438f11e1e7f30380799c21"],
  ["Time2Move",3,"08c1f9fd558940a5802ac83d131dc63c19a586327c3ef67960f578c958574b0c"],
  ["Hombuzz",3,"93ddecb60c68695577c88666a38311c1069e9dc3c3fc166bdc7dffcd07a10cd5"],
  ["work arrives unevenly",2,"838a2a186ddf11d069b795a3e58217b172fae0d517dffea6f1e1004ad3cbedc9"],
  ["AI",33,"e4c7f29c863b9d4311a0ba0a5dd7a19219e677cba158513f6350cbee7ab745c4"],
  ["ML",3,"11bd4b9108b2a67cbcc441f5d31373d9a8f125b6a4f70c16789b00bf7065db77"],
  ["Next.js",10,"d142e7af27c964ab64896edc202b8aa166db768b0a688bb2d3e68b73718208fd"],
  ["Urarina",1,"8bd51e9b2651570c1fe0c8926a4124211740fbe9a23d48219c952d41a854e866"],
  ["VIFG",7,"2c58bb569d9c962ac5b3b27aa7c5dc038eb0077447ec7a47d8962ffec78d5792"],
  ["research",18,"12d5426be8266829c993dc08ac9a114eb9bb16f953024eae23f2ca47350461bd"],
  ["semantic retrieval",4,"6721883c4454c9a2f0547904fd43be2f675c23b2f2bc6c1c3bce81ab03960d77"],
  ["automation workflow",19,"b5b6bcd9b8e6531cecae345cdb1f037607313626fb20d8791778b35f1195fb84"],
  ["data platform",11,"b5d25e73c3df41fad81d15fe711c1483efc085f21325e0eed14a2fb4c82e2f18"],
  ["north star",0,"4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"],
  ["zzzz-no-match",0,"4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"],
] as const

describe('published search compatibility with ba84b4d and reviewed editorial updates', () => {
  test('preserves all public records, destinations and project target metadata', () => {
    expect(index.records).toHaveLength(606)
    expect(digest(index)).toBe('162b1a94f140147de810e81bf0987487444fc0eeab0c0fe99056d2da83599ce2')
    const inventory = index.records.map(record => ({ id: record.id, href: record.href, destination: record.destination, cells: record.cells }))
    expect(index.records.reduce((count, record) => count + Number(!!record.destination) + (record.cells?.length ?? 0), 0)).toBe(652)
    expect(digest(inventory)).toBe('c31d7a160e2309c23357d70f148b9b9f20703f999571925fe369dc31ed40b9d3')
    const projects = allSystems.map(system => ({ id: system.id, destinations: createProjectContent(system).destinations }))
    expect(digest(projects)).toBe('59eb317a856d278aa5e82df92ca9158f2eba0268e934cf314c0f55cc784a073a')
  })

  test.each(queries)('preserves ordered results, scores, selected targets and snippets for %s', (query, count, expected) => {
    const results = searchContent(index.records, query).map(result => ({
      id: result.record.id, href: result.record.href, destination: result.record.destination,
      score: result.score, snippet: result.snippet,
    }))
    expect(results).toHaveLength(count)
    expect(digest(results)).toBe(expected)
  })
})

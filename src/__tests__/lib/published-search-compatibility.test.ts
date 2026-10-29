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
// and relative order matched exactly. Major section/audit IDs remained; rewritten
// content-derived blocks intentionally changed, with evidence inside a disclosure.
// Reviewed the concise Time2Move revision on 2026-10-29 against bb0b88bacb3572c5b5cd519df042773fd0971c57:
// public technical/audit/screenshot evidence and its targets were intentionally
// removed. Only Time2Move records and its project manifest changed; all 581 other
// records, nine other project manifests, and unrelated ranking values/order match.
// Reviewed the subsequent ownership refinement against that captured concise
// working tree (index 81f642c62b7ab2a33bd40938ee0b0317688a4c83b4201c07a320903606736d44):
// five Time2Move records changed, including its six-technology stack and two
// section labels. Record identities/order and navigation targets stayed exact;
// all unrelated records, manifests and ranking values/order remained unchanged.
// Reviewed the concluded-engagement copy against the captured ownership working
// tree (index 7132c87043e734f4690e68870657b6827c12ff4725e87d336fa80aef1059e680):
// four Time2Move records and its experience reference changed. All destinations,
// manifests and ranked identities/scores/order stayed exact; snippets changed for
// four queries. The other 580 records and 16 query expectations stayed unchanged.
// Reviewed the bounded enhancement against the restored concise working tree on
// d73f923832859f88fee8ab0878fec32d7f1c7ee6 (index 6471cc84afbf7f313335d3caed8a78b972e83cef724a8bdf02525aa20c3cc3b3):
// LLC attribution changed one Time2Move record; architecture, review-pipeline and
// illustrative AI-lesson targets added three records. Every existing destination,
// all 581 unrelated records and nine other project manifests stayed exact. Four
// query expectations changed; unrelated ranked values/order and 16 queries did not.
// Final accuracy refinement names Pydantic validation and contact normalization
// in the architecture record only; all destinations and 20 ranked queries stayed exact.
// Reviewed the final editing pass against 087511bb5f0aad759b4f46e1c2edd6b1cde3985a:
// Time2Move's title, concise narrative and diagram text changed across its nine
// records. All record IDs/order and navigation targets remained exact; only the
// title breadcrumbs changed destination metadata. All 581 unrelated records,
// nine other project manifests and unrelated ranked values/order stayed exact.
// Five query expectations changed; the other 15 remain from the prior baseline.
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
  ["Time2Move",4,"5d9904adc07e96c7a60f6f8fb4b488d4c2013ed0c10b92ea0bb709e980d689c3"],
  ["Hombuzz",3,"3c3de55ff9a929f6bbad4faca83cd800c32215b796b52f6577fdaca317d05cef"],
  ["work arrives unevenly",2,"838a2a186ddf11d069b795a3e58217b172fae0d517dffea6f1e1004ad3cbedc9"],
  ["AI",36,"7edeccd19174a69f132c56e66a32f819ec922f5da6c11603fe64c651508f38c6"],
  ["ML",3,"11bd4b9108b2a67cbcc441f5d31373d9a8f125b6a4f70c16789b00bf7065db77"],
  ["Next.js",10,"5ade501b8496b3a078dc601ade765abaf9ca782760616a99ee9120a76bfbf7fa"],
  ["Urarina",1,"8bd51e9b2651570c1fe0c8926a4124211740fbe9a23d48219c952d41a854e866"],
  ["VIFG",7,"2c58bb569d9c962ac5b3b27aa7c5dc038eb0077447ec7a47d8962ffec78d5792"],
  ["research",18,"12d5426be8266829c993dc08ac9a114eb9bb16f953024eae23f2ca47350461bd"],
  ["semantic retrieval",4,"6721883c4454c9a2f0547904fd43be2f675c23b2f2bc6c1c3bce81ab03960d77"],
  ["automation workflow",17,"74a3d60c3958e32d6614921a6deb52d2c93e2a0ed2e2c52e1b798dda4a379f1f"],
  ["data platform",11,"b5d25e73c3df41fad81d15fe711c1483efc085f21325e0eed14a2fb4c82e2f18"],
  ["north star",0,"4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"],
  ["zzzz-no-match",0,"4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"],
] as const

describe('published search compatibility with ba84b4d and reviewed editorial updates', () => {
  test('preserves all public records, destinations and project target metadata', () => {
    expect(index.records).toHaveLength(590)
    expect(digest(index)).toBe('ba138e6b27c0ffa99da9399b62bdc5c69737b1ef184e235addd01b29a6012a6d')
    const inventory = index.records.map(record => ({ id: record.id, href: record.href, destination: record.destination, cells: record.cells }))
    expect(index.records.reduce((count, record) => count + Number(!!record.destination) + (record.cells?.length ?? 0), 0)).toBe(636)
    expect(digest(inventory)).toBe('ff15a266cb6ce35acd87cbf13550648e31ed3e6a3fa1d70ed1406adb13b2a6bb')
    const projects = allSystems.map(system => ({ id: system.id, destinations: createProjectContent(system).destinations }))
    expect(digest(projects)).toBe('d77c5110dda5d3c52d030dc90fb73a3c453b166ac5ea78e67d532cd676165580')
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

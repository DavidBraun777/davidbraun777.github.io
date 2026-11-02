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
// PR #154's merge repair replaces the stale four-workflow overview caption with
// the single-inquiry description. Record destinations and ranked queries stay exact.
// Reviewed the Matt Laur addition against master 292d35e. All 590 existing records
// and ten project manifests match in order and content. Only "Next.js" gains
// two Matt Laur results. Existing targets, scores and snippets remain intact.
// Reviewed ARK Landscaping against master 0299abd. Five project records were
// added and the homepage gained the Live client websites heading. All 595
// previous records retain their identities, destinations and relative order.
// All 11 existing project manifests and 20 ranked queries remain identical.
// Reviewed the portfolio and client-copy changes against master a4755af.
// Nine records changed and one obsolete Time2Move section was retired. The
// remaining 590 records match exactly. Every retained URL and anchor is stable.
// One Matt Laur section has a new label. Unrelated ranked results retain their
// scores, snippets and relative order across all sampled queries.
// Reviewed the homepage restoration against master 2c9a8fd. Only the home
// record changed. All 598 other records, every destination and project manifest,
// and all non-home ranked results remain identical across the 20 queries.
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
  ["Time2Move",5,"32187ba37ad5969becb3e6c1f8a04d386ebc1dc20e1ffbc5c30b1cfba300105c"],
  ["property inquiry",1,"e7e822d9b3639aed62b3db76fa9b174e79706faa1d2863caac9f84f9331024c2"],
  ["work arrives unevenly",2,"838a2a186ddf11d069b795a3e58217b172fae0d517dffea6f1e1004ad3cbedc9"],
  ["AI",36,"cfbd356f361c096299648df973671e2a355b1adafd3f6d428a06789bbb1df688"],
  ["ML",3,"11bd4b9108b2a67cbcc441f5d31373d9a8f125b6a4f70c16789b00bf7065db77"],
  ["Next.js",12,"dda18898f4d41766580c708cd2b23f263966994a4bfc2463facd3ec35640a5f1"],
  ["Urarina",1,"8bd51e9b2651570c1fe0c8926a4124211740fbe9a23d48219c952d41a854e866"],
  ["VIFG",7,"2c58bb569d9c962ac5b3b27aa7c5dc038eb0077447ec7a47d8962ffec78d5792"],
  ["research",19,"c36af019e9dcf714cfa61f39cf584fbde4676ec24a7bb83a99dc3c0972a68b0f"],
  ["semantic retrieval",4,"6721883c4454c9a2f0547904fd43be2f675c23b2f2bc6c1c3bce81ab03960d77"],
  ["automation workflow",15,"5107000eb74c2a7ac383313eabf03596922fa8aedfc5b4747371a1744df2bd19"],
  ["data platform",11,"142b154467da73cc271e8ea53f9c4b49f7f3926abcd9408c7ad5a239b7306316"],
  ["north star",0,"4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"],
  ["zzzz-no-match",0,"4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"],
] as const

describe('published search compatibility with ba84b4d and reviewed editorial updates', () => {
  test('preserves all public records, destinations and project target metadata', () => {
    expect(index.records).toHaveLength(599)
    expect(digest(index)).toBe('e9bd73b2028eb00bd21350b71a9bec8cf7a3f8d4e626306b143470ad26bf46c3')
    const inventory = index.records.map(record => ({ id: record.id, href: record.href, destination: record.destination, cells: record.cells }))
    expect(index.records.reduce((count, record) => count + Number(!!record.destination) + (record.cells?.length ?? 0), 0)).toBe(643)
    expect(digest(inventory)).toBe('68ef650108540e7310ccfc3857c33d7d8629a77ecb3ab2d699863960d11c1664')
    const projects = allSystems.map(system => ({ id: system.id, destinations: createProjectContent(system).destinations }))
    expect(digest(projects)).toBe('5f1922c5ff2af9abe431400e491d96451df1babef7e0b26b1df5e2c3e398abc0')
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

import { describe, expect, test } from 'vitest'
import { allSystems, getSystemById, selectFeaturedSystems } from '@/data/systems'

describe('featured system registry validation', () => {
  test('preserves requested ordering and references', () => {
    const first = allSystems[0]
    const second = allSystems[1]
    const registry = new Map([[first.id, first], [second.id, second]])
    expect(selectFeaturedSystems(registry, [second.id, first.id])).toEqual([second, first])
    expect(selectFeaturedSystems(registry, [])).toEqual([])
    expect(getSystemById(first.id)).toBe(first)
    expect(getSystemById('missing-system')).toBeNull()
  })
  test('rejects a selected project absent from the registry rather than dropping it silently', () => {
    expect(() => selectFeaturedSystems(new Map(), ['unregistered-proof'])).toThrow('Missing featured system for id: unregistered-proof')
  })
})

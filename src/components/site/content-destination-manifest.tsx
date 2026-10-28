'use client'

import { useLayoutEffect } from 'react'
import { registerContentDestinations } from '@/lib/content-navigation'
import type { ContentDestination } from '@/lib/search/destinations'

/** Page-local anchors only: ordinary visits never fetch the full search index. */
export function ContentDestinationManifest({ page, destinations }: Readonly<{
  page: string
  destinations: ContentDestination[]
}>) {
  useLayoutEffect(() => registerContentDestinations(page, destinations), [page, destinations])
  return null
}

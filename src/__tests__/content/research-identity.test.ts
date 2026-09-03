import { describe, expect, test } from 'vitest'
import {
  peerReviewedPublications,
  verifiedAuthoredWorkIdentities,
} from '@/data/research'

const differentResearcherWorks = [
  {
    doiUrl: 'https://doi.org/10.1007/s11214-012-9950-9',
    bylineName: 'D. Braun',
    affiliation:
      'Laboratory for Atmospheric and Space Physics, University of Colorado Boulder',
  },
  {
    doiUrl: 'https://doi.org/10.1007/978-1-4899-7433-4_11',
    bylineName: 'D. Braun',
    affiliation:
      'Laboratory for Atmospheric and Space Physics, University of Colorado Boulder',
  },
] as const

describe('research publication identity', () => {
  test('represents the publisher-verified JGR identity as David Braun\'s work', () => {
    const doiUrl = 'https://doi.org/10.1029/2018JA025505'

    expect(verifiedAuthoredWorkIdentities[doiUrl]).toEqual({
      bylineName: 'D. J. Braun',
      affiliation:
        'Department of Physics, Augsburg University, Minneapolis, MN, USA',
    })
    expect(peerReviewedPublications).toContainEqual(
      expect.objectContaining({
        doiUrl,
        verifiedIdentity: verifiedAuthoredWorkIdentities[doiUrl],
      })
    )
  })

  test('requires every authored journal DOI and identity to be allowlisted', () => {
    expect(peerReviewedPublications.map(({ doiUrl }) => doiUrl).sort()).toEqual(
      Object.keys(verifiedAuthoredWorkIdentities).sort()
    )

    for (const publication of peerReviewedPublications) {
      expect(publication.verifiedIdentity).toEqual(
        verifiedAuthoredWorkIdentities[publication.doiUrl]
      )
    }
  })

  test('excludes the LASP namesake works from authored outputs', () => {
    const authoredDoiUrls = peerReviewedPublications.map(({ doiUrl }) => doiUrl)

    for (const namesakeWork of differentResearcherWorks) {
      expect(namesakeWork.bylineName).toBe('D. Braun')
      expect(namesakeWork.affiliation).toContain(
        'Laboratory for Atmospheric and Space Physics'
      )
      expect(namesakeWork.affiliation).toContain('University of Colorado Boulder')
      expect(namesakeWork.doiUrl in verifiedAuthoredWorkIdentities).toBe(false)
      expect(authoredDoiUrls).not.toContain(namesakeWork.doiUrl)
    }
  })
})

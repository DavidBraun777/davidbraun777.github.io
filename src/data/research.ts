import type { LucideIcon } from 'lucide-react'
import { socialLinks } from '@/data/social-links'

export interface ResearchProfileLink {
  name: string
  actionLabel: string
  url: string
  icon: LucideIcon
}

export interface AcceptedConferencePaper {
  id: string
  title: string
  authors: string
  venue: string
  status: 'Accepted Conference Paper'
  year: string
  areas: string[]
}

// Publisher-verified authored works only. Instrument or background references need
// a separate model so their DOIs cannot enter David Braun's publication inventory.
export const verifiedAuthoredWorkIdentities = {
  'https://doi.org/10.1029/2018JA025505': {
    bylineName: 'D. J. Braun',
    affiliation:
      'Department of Physics, Augsburg University, Minneapolis, MN, USA',
  },
} as const

export type VerifiedAuthoredDoiUrl = keyof typeof verifiedAuthoredWorkIdentities

export type VerifiedAuthoredWorkIdentity =
  (typeof verifiedAuthoredWorkIdentities)[VerifiedAuthoredDoiUrl]

export interface PeerReviewedPublication {
  id: string
  title: string
  authors: string
  journal: string
  year: string
  doiUrl: VerifiedAuthoredDoiUrl
  verifiedIdentity: VerifiedAuthoredWorkIdentity
  studyContext: string
  webOfScienceId: string
}

export interface ConferenceAbstract {
  id: string
  title: string
  venue: string
  abstractNumber: string
  date: string
  contributors: string
}

export interface ProfessionalAffiliation {
  id: string
  organization: string
  role: string
  url: string
  location?: string
  startDate?: string
  endDate?: string
}

export const researchAreas = [
  'Artificial Intelligence',
  'Machine Learning',
  'Information Retrieval',
  'Natural Language Processing',
  'Low-Resource Languages',
  'Multimodal AI',
  'Retrieval-Augmented Generation (RAG)',
  'Computational Linguistics',
  'Magnetospheric Physics',
  "Earth's Radiation Belts",
  'Magnetometer Data Analysis',
  'Electromagnetic Ion Cyclotron (EMIC) Waves',
  'Space Weather',
]

export const researchProfileLinks: ResearchProfileLink[] = socialLinks.flatMap((link) =>
  link.researchActionLabel
    ? [
        {
          name: link.name,
          actionLabel: link.researchActionLabel,
          url: link.url,
          icon: link.icon,
        },
      ]
    : []
)

export const acceptedConferencePapers: AcceptedConferencePaper[] = [
  {
    id: 'urarina-hybrid-retrieval',
    title:
      'Hybrid Retrieval Evaluation for Low-Resource Language Archives: A Urarina\u2014Spanish Case Study',
    authors: 'David Braun and Michael Dorin',
    venue: 'IEEE LA-CCI 2026',
    status: 'Accepted Conference Paper',
    year: '2026',
    areas: [
      'Information Retrieval',
      'Low-Resource Languages',
      'Multimodal AI',
      'RAG / Retrieval',
      'Computational Linguistics',
    ],
  },
]

export const peerReviewedPublications: PeerReviewedPublication[] = [
  {
    id: 'emic-wave-events',
    title: 'EMIC Wave Events During the Four GEM QARBM Challenge Intervals',
    authors:
      'M. J. Engebretson, J. L. Posch, D. J. Braun, W. Li, Q. Ma, A. C. Kellerman, C.-L. Huang, S. G. Kanekal, C. A. Kletzing, J. R. Wygant, et al.',
    journal: 'Journal of Geophysical Research: Space Physics',
    year: '2018',
    doiUrl: 'https://doi.org/10.1029/2018JA025505',
    verifiedIdentity:
      verifiedAuthoredWorkIdentities['https://doi.org/10.1029/2018JA025505'],
    studyContext:
      "The collaborative study incorporated radiation-belt electron observations from REPT and MagEIS aboard NASA's Van Allen Probes, together with EMIC-wave observations and other data sources. This is instrumentation and data context for the study, not a claim of instrument development.",
    webOfScienceId: 'WOS:000445731300021',
  },
]

export const conferenceAbstracts: ConferenceAbstract[] = [
  {
    id: 'emic-wave-events-agu-2017',
    title: 'EMIC wave events during the four QARBM challenge intervals',
    venue: '2017 AGU Fall Meeting',
    abstractNumber: 'SM51B-1176',
    date: 'December 15, 2017',
    contributors: 'Mark J. Engebretson, Jennifer L. Posch, David Braun, et al.',
  },
  {
    id: 'magnetic-impulse-events-agu-2017',
    title: 'Nightside High Latitude Magnetic Impulse Events',
    venue: '2017 AGU Fall Meeting',
    abstractNumber: 'SM31B-2629',
    date: 'December 13, 2017',
    contributors: 'Mark J. Engebretson, Jennifer L. Posch, David Braun, et al.',
  },
]

export const professionalAffiliations: ProfessionalAffiliation[] = [
  {
    id: 'ieee',
    organization: 'Institute of Electrical and Electronics Engineers',
    role: 'Student Member',
    url: 'https://www.ieee.org/',
  },
  {
    id: 'acm',
    organization: 'Association for Computing Machinery',
    role: 'Student Member',
    url: 'https://www.acm.org/',
  },
  {
    id: 'toastmasters',
    organization: 'Toastmasters International',
    role: 'Member',
    location: 'White Bear Lake, Minnesota',
    startDate: 'June 2026',
    endDate: 'Present',
    url: 'https://www.toastmasters.org/',
  },
]

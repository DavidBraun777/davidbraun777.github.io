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

export interface PeerReviewedPublication {
  id: string
  title: string
  authors: string
  journal: string
  year: string
  doiUrl: string
  webOfScienceId?: string
  scopusEid?: string
  issns?: string[]
}

export interface BookChapter {
  id: string
  title: string
  authors: string
  book: string
  year: string
  doiUrl: string
  scopusEid: string
  isbns: string[]
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
  'Energetic-Particle Instrumentation',
  'Magnetometer Data Analysis',
  'Electromagnetic Ion Cyclotron (EMIC) Waves',
  'Space Weather',
]

const reptAuthors =
  'D. N. Baker, S. G. Kanekal, V. C. Hoxie, S. Batiste, M. Bolton, X. Li, S. R. Elkington, S. Monk, R. Reukauf, S. Steg, J. Westfall, C. Belting, B. Bolton, D. Braun, B. Cervelli, K. Hubbell, M. Kien, S. Knappmiller, S. Wade, B. Lamprecht, K. Stevens, J. Wallace, A. Yehle, H. E. Spence, R. Friedel'

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
    webOfScienceId: 'WOS:000445731300021',
  },
  {
    id: 'rept-rbsp-instrument',
    title:
      "The Relativistic Electron-Proton Telescope (REPT) instrument on board the Radiation Belt Storm Probes (RBSP) spacecraft: Characterization of earth's radiation belt high-energy particle populations",
    authors: reptAuthors,
    journal: 'Space Science Reviews',
    year: '2013',
    doiUrl: 'https://doi.org/10.1007/s11214-012-9950-9',
    scopusEid: '2-s2.0-84888645914',
    issns: ['0038-6308', '1572-9672'],
  },
]

export const bookChapters: BookChapter[] = [
  {
    id: 'rept-van-allen-probes-mission',
    title:
      "The Relativistic Electron-Proton Telescope (REPT) Instrument on Board the Radiation Belt Storm Probes (RBSP) Spacecraft: Characterization of earth's radiation belt high-energy particle populations",
    authors: reptAuthors,
    book: 'Van Allen Probes Mission',
    year: '2014',
    doiUrl: 'https://doi.org/10.1007/978-1-4899-7433-4_11',
    scopusEid: '2-s2.0-84929746054',
    isbns: ['1489974334', '9781489974327', '9781489974334'],
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

// Public project context only. Expand after explicit publication approval;
// do not import manuscript content or unpublished research artifacts here.
export const urarinaResearch = {
  path: '/research/urarina-hybrid-retrieval',
  title: 'Hybrid Retrieval for Low-Resource Language Archives',
  subtitle:
    'Graduate research exploring information retrieval for a multimodal Urarina–Spanish archival collection at the University of St. Thomas.',
  description:
    'High-level project context for University of St. Thomas graduate research on information retrieval for a multimodal Urarina–Spanish archival collection. A resulting conference paper is accepted for IEEE LA-CCI 2026; presentation/publication forthcoming.',
  institution: 'University of St. Thomas',
  researchers: 'David Braun and Prof. Michael Dorin',
  links: {
    institution: 'https://www.stthomas.edu/',
    collaborator: 'https://researchonline.stthomas.edu/esploro/profile/michael_dorin',
  },
  area: 'Information Retrieval / Low-Resource Language Archives',
  status: 'Conference paper accepted; presentation/publication forthcoming',
  acceptance:
    'A conference paper resulting from this research has been accepted for IEEE LA-CCI 2026.',
  publicationNote:
    'Technical details and research results are intentionally being withheld until the conference presentation/publication process is complete. This page currently provides only high-level project context.',
  overview:
    'This graduate research examines information retrieval in the context of a historical multimodal Urarina–Spanish archival collection. The work considers how modern retrieval approaches may help make low-resource linguistic materials easier to search and study while accounting for the limitations of historical and heterogeneous archival data.',
  context:
    'The project builds on a broader effort to preserve and make historical Urarina linguistic materials more usable for research. My contribution focuses on information-retrieval research conducted with Prof. Michael Dorin at the University of St. Thomas.',
  lineage: {
    introduction:
      'This research builds on earlier public work involving the preservation, digitization, and restoration of Urarina archival materials. The publications below provide background on that broader effort and were authored by other researchers; they should not be interpreted as publications authored by me or as results from the current LA-CCI research.',
    // Independently verified public records, kept separate from the current work.
    references: [
      {
        title: 'Urarina Field Note Restoration Using Machine Learning and Game Play',
        authors: 'Zhengyuan Feng and Michael Dorin',
        year: '2025',
        source: 'University of St. Thomas Research Online',
        description: 'Earlier work on digitization and restoration of historical Urarina field materials.',
        url: 'https://researchonline.stthomas.edu/esploro/outputs/bookChapter/Urarina-Field-Note-Restoration-Using-Machine/991015317911303691',
      },
      {
        title: 'Recovering Speech: Language Study Restoration',
        authors: 'Michael Dorin, Mariana Moyano, and Mario Chong',
        year: '2026',
        source: 'IEEE EDUNINE 2026 · Universidad del Pacífico FacultyUP',
        description: 'Published work providing additional context on restoration of historical Urarina linguistic materials.',
        url: 'https://faculty.up.edu.pe/en/publications/recovering-speech-language-study-restoration/',
      },
    ],
  },
  journey: [
    'Historical Urarina archival materials',
    'University of St. Thomas research collaboration',
    'Information-retrieval research',
    'Conference manuscript prepared',
    'Submitted through EasyChair',
    'Accepted for IEEE LA-CCI 2026',
    'Conference presentation / publication forthcoming',
  ],
  conference: {
    name: 'IEEE Latin American Conference on Computational Intelligence (LA-CCI) 2026',
    location: 'Universidad del Pacífico, Lima, Peru',
    dates: 'November 3–6, 2026',
    submissionPlatform: 'EasyChair',
    platformDescription: 'EasyChair was used as the conference submission/review platform.',
    // Public conference information, verified against the official site and CFP.
    url: 'https://lacci2026.up.edu.pe/',
    cfpUrl: 'https://easychair.org/cfp/IEEE-LACCI-2026',
  },
} as const

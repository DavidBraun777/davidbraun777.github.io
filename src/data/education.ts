export interface Education {
  id: string
  institution: string
  institutionUrl?: string
  programUrl?: string
  degree: string
  field: string
  secondaryCredential?: string
  secondaryCredentialUrl?: string
  secondaryCredentialStartDate?: string
  secondaryCredentialEndDate?: string
  secondaryCredentialInProgress?: boolean
  startDate: string
  endDate: string | null
  description?: string
  coursework?: string[]
  inProgress?: boolean
}

export const education: Education[] = [
  {
    id: 'ust',
    institution: 'University of St. Thomas',
    institutionUrl: 'https://www.stthomas.edu/',
    programUrl: 'https://software.stthomas.edu/degree/masters/artificial-intelligence/',
    degree: 'Master of Science',
    field: 'Artificial Intelligence',
    secondaryCredential: 'Graduate Certificate in Big Data',
    secondaryCredentialUrl:
      'https://software.stthomas.edu/degree/certificates/data-engineering/index.html',
    secondaryCredentialStartDate: 'September 2024',
    secondaryCredentialEndDate: 'December 2026',
    secondaryCredentialInProgress: true,
    startDate: 'September 2024',
    endDate: 'December 2026',
    inProgress: true,
    description:
      'Degree in progress with expected completion in December 2026, focused on applied artificial intelligence, cloud computing, and machine learning.',
    coursework: [
      'Cloud Computing',
      'Machine Learning',
      'Data Analytics & Visualization',
      'Data Preparation & Analysis',
    ],
  },
  {
    id: 'augsburg',
    institution: 'Augsburg University',
    institutionUrl: 'https://www.augsburg.edu/',
    degree: 'Bachelor of Science (B.S.)',
    field: 'Mathematics, Physics, and Computer Science',
    startDate: 'June 2014',
    endDate: 'May 2019',
    description:
      'One Bachelor of Science degree with majors in Mathematics, Physics, and Computer Science.',
  },
]

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expirationDate?: string
  credentialUrl?: string
  badgeImage: string
}

export const certifications: Certification[] = [
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'April 2024',
    expirationDate: 'April 2027',
    credentialUrl:
      'https://www.credly.com/badges/9e9d0587-054e-44d4-9ab7-66bc451c85d2/public_url',
    badgeImage: '/images/certifications/aws-certified-cloud-practitioner.png',
  },
]

export interface VolunteerActivity {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string | null
  description: string
}

export const volunteerActivities: VolunteerActivity[] = [
  {
    id: 'personal-projects',
    organization: 'Personal Projects',
    role: 'Developer',
    startDate: '2019',
    endDate: null,
    description: 'Using S3 and Amazon Polly to convert PDFs to audiobooks',
  },
  {
    id: 'substance-church',
    organization: 'Substance Church – Manna Pack',
    role: 'Volunteer',
    startDate: '2020',
    endDate: null,
    description: 'Packed and organized food for those in need',
  },
  {
    id: 'union-gospel',
    organization: 'Union Gospel Mission',
    role: 'Volunteer',
    startDate: '2023',
    endDate: null,
    description: 'Packed and organized food for those in need',
  },
]

export interface Education {
  id: string
  institution: string
  institutionUrl?: string
  degree: string
  field: string
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
    degree: "Master's",
    field: 'Artificial Intelligence',
    startDate: 'September 2024',
    endDate: 'December 2026',
    inProgress: true,
    description: 'Focusing on applied AI, cloud computing, and machine learning.',
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
    degree: 'Bachelor of Science',
    field: 'Computer Science | Mathematics | Physics',
    startDate: '2016',
    endDate: 'May 2020',
    description: 'Built a strong foundation in computer science fundamentals, mathematical reasoning, and physical sciences.',
  },
]

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  credentialUrl?: string
  badgeImage: string
}

export const certifications: Certification[] = [
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Pearson VUE',
    issueDate: 'March 2024',
    credentialUrl: 'https://www.credly.com/badges/6c3c2efd-e61c-439d-b4b5-67ca98e64e4a/public_url',
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

export interface Experience {
  id: string
  company: string
  companyUrl?: string
  role: string
  location: string
  startDate: string
  endDate: string | null
  description: string
  highlights: string[]
  technologies?: string[]
}

export const experiences: Experience[] = [
  {
    id: 'peoples-connection',
    company: "People's Connection LLC",
    role: 'Founder & Principal Software Engineer',
    location: 'New Brighton, MN (Remote)',
    startDate: 'June 2020',
    endDate: null,
    description:
      'Built and operated accessible web systems for nonprofit organizations, covering application delivery, infrastructure, and deployment workflows.',
    highlights: [
      'Built and maintained the VIFG production website for a nonprofit serving visually impaired users',
      'Containerized the application and set up GitHub Actions to support repeatable deployments',
      'Managed hosting, DNS, and SSL/TLS configuration on AWS',
      'Configured Nginx as the reverse proxy and edge layer for the production environment',
    ],
    technologies: ['React', 'Vite', 'AWS Lightsail', 'Docker', 'GitHub Actions', 'Nginx', 'Route 53'],
  },
  {
    id: 'us-bank',
    company: 'U.S. Bank',
    companyUrl: 'https://www.usbank.com/',
    role: 'Systems Engineer',
    location: 'Minneapolis, MN (Remote)',
    startDate: 'November 2024',
    endDate: 'February 2025',
    description:
      'Supported enterprise integration work around internal systems and API workflows.',
    highlights: [
      'Tested, validated, and troubleshot REST APIs with Postman to support system integrations',
      'Worked with stakeholders, external vendors, and internal teams to resolve integration issues',
      'Maintained technical documentation for support and handoff workflows',
    ],
    technologies: ['Postman', 'REST APIs', 'Technical Documentation'],
  },
  {
    id: 'securian',
    company: 'Securian Financial',
    companyUrl: 'https://www.securian.com/',
    role: 'Infrastructure Engineer',
    location: 'St. Paul, MN (Remote)',
    startDate: 'November 2022',
    endDate: 'March 2024',
    description:
      'Automated infrastructure provisioning and supported cloud-hosted applications across AWS and internal delivery workflows.',
    highlights: [
      'Automated provisioning and configuration management with Ansible',
      'Deployed and managed cloud-based application infrastructure on AWS EC2, S3, and RDS',
      'Maintained Ansible playbooks for server configuration and application deployment',
      'Built Java microservices with Spring and Spring Boot for internal platform needs',
      'Automated data processing workflows with Python to reduce manual operational work',
    ],
    technologies: ['Ansible', 'AWS EC2', 'AWS S3', 'AWS RDS', 'Java', 'Spring Boot', 'Python', 'SonarQube', 'GitHub'],
  },
  {
    id: 'ge-aviation',
    company: 'General Electric Aviation',
    companyUrl: 'https://www.geaerospace.com/',
    role: 'Cybersecurity Engineer',
    location: 'Cincinnati, OH (Remote)',
    startDate: 'October 2021',
    endDate: 'October 2022',
    description:
      'Improved the security posture of internal applications through vulnerability remediation, secure coding practices, and API hardening.',
    highlights: [
      'Remediated vulnerabilities in Java and legacy applications using AVA/SAST/DAST scans',
      'Applied secure coding practices across JavaScript and React applications',
      'Implemented manual protections against Cross-Site Request Forgery (CSRF) attacks',
      'Worked with teams using AWS services such as EC2, S3, and Lambda to improve secure deployment practices',
      'Secured API endpoints with OAuth2 and JWT authentication',
      'Designed and integrated REST APIs documented through Swagger/OpenAPI',
    ],
    technologies: ['Java', 'React', 'JavaScript', 'AWS', 'OAuth2', 'JWT', 'Swagger', 'SAST/DAST'],
  },
  {
    id: 'target',
    company: 'Target Corporation',
    companyUrl: 'https://www.target.com/',
    role: 'Software Engineer',
    location: 'Minneapolis, MN',
    startDate: 'June 2019',
    endDate: 'June 2020',
    description:
      'Built frontend and service-layer software for internal systems in a large-scale retail environment.',
    highlights: [
      'Built and supported React applications used in internal workflows',
      'Developed Kotlin-based microservices for internal platform functionality',
      'Diagnosed and fixed issues across more than 30 repositories',
      'Upgraded and refactored more than 50 repositories as part of broader modernization work',
      'Worked across cross-functional and distributed teams in an agile environment',
    ],
    technologies: ['React', 'Kotlin', 'Microservices', 'Git', 'Agile'],
  },
  {
    id: 'graphic-systems',
    company: 'Graphic Systems LLC',
    role: 'Software Developer',
    location: 'Minneapolis, MN',
    startDate: 'July 2018',
    endDate: 'November 2018',
    description: 'Developed and maintained e-commerce and inventory management software.',
    highlights: [
      'Upgraded and maintained shipment and inventory software including storefront and API workflows',
      'Improved inventory management workflows inside the existing system',
      'Worked with Four51 batch upload integration',
      'Processed 10+ projects in Adobe InDesign, Illustrator, and Photoshop',
    ],
    technologies: ['APIs', 'Four51', 'Adobe Creative Suite'],
  },
  {
    id: 'space-physics',
    company: 'Augsburg University',
    companyUrl: 'https://www.augsburg.edu/',
    role: 'Data Analyst (Space Physics Internship)',
    location: 'Minneapolis, MN',
    startDate: 'May 2016',
    endDate: 'August 2017',
    description: 'Analyzed space physics data and contributed to published research on Ultra-Low-Frequency Wave Investigations.',
    highlights: [
      'Edited several IDL programs for further analysis of space events',
      'Analyzed terabytes of data for papers published with co-authorship in professional journals',
      'Published works on topics including Ultra-Low-Frequency Wave Investigations',
      'Maintained detail-oriented quality of work over long periods with large datasets',
    ],
    technologies: ['IDL', 'Data Analysis', 'Research'],
  },
]

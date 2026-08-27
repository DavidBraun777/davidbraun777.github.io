export interface Experience {
  id: string
  company: string
  companyUrl?: string
  role: string
  department?: string
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
      'Sole engineer responsible for the full delivery lifecycle of client-facing and mission-driven software systems: architecture, application development, infrastructure, deployment, security, and ongoing operational support.',
    highlights: [
      'Own the production VIFG platform across React, Docker, Nginx, AWS Lightsail, Route 53, SSL/TLS, accessibility validation, and ongoing support',
      'Built GitHub Actions workflows for testing, security and dependency checks, Docker publishing to Amazon ECR, and repeatable AWS deployments',
      'Delivered a QR-based wedding media platform, primarily provisioned with AWS CloudFormation, that enabled guests to upload photos and videos to Amazon S3 with Google Photos integration',
      'Client and partner delivery has included time2move.io, ARK Landscaping, Outerly, 3C1S, and other initiatives',
    ],
    technologies: [
      'React',
      'Next.js',
      'Astro',
      'Node.js',
      'FastAPI',
      'AWS',
      'CloudFormation',
      'Amazon ECR',
      'Amazon S3',
      'Docker',
      'GitHub Actions',
      'Nginx',
      'Route 53',
      'Redis',
    ],
  },
  {
    id: 'ust-support',
    company: 'University of St. Thomas',
    companyUrl: 'https://www.stthomas.edu/',
    role: 'Graduate Tutor / Computer Systems Support',
    department: 'Department of Software Engineering and Data Science',
    location: 'Saint Paul, Minnesota',
    startDate: 'December 2025',
    endDate: null,
    description:
      'Graduate tutoring and computer systems support within the Department of Software Engineering and Data Science.',
    highlights: [
      'Support graduate tutoring and computer systems needs within the department',
    ],
    technologies: ['Graduate Tutoring', 'Computer Systems Support'],
  },
  {
    id: 'vifg-treasurer',
    company: 'VIFG Nonprofit',
    companyUrl: 'https://www.vifg.org/home',
    role: 'Treasurer',
    location: 'White Bear Lake, MN',
    startDate: 'Ongoing',
    endDate: null,
    description:
      'Contribute to quarterly financial review, stewardship planning, and nonprofit oversight, helping support responsible operations and organizational accountability.',
    highlights: [
      'Participate in quarterly meetings focused on financial review, stewardship planning, and organizational accountability',
      'Support oversight of nonprofit operations so the public-facing work stays tied to responsible internal decision-making',
      'Bring the same expectation of follow-through, transparency, and operational care into both board service and technical delivery',
    ],
    technologies: ['Financial Review', 'Stewardship Planning', 'Nonprofit Oversight'],
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
      'Short-term contract focused on enterprise API integration support: testing, validation, troubleshooting, and cross-team coordination for internal system workflows.',
    highlights: [
      'Validated and troubleshot REST API integrations using Postman across internal enterprise systems',
      'Coordinated with external vendors and internal engineering teams to diagnose and resolve integration issues',
      'Maintained technical documentation to support handoff and escalation workflows',
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
      'Owned infrastructure automation and cloud application delivery across AWS environments, including configuration management, Kubernetes/EKS support, microservice development, and operational tooling.',
    highlights: [
      'Authored and maintained Ansible playbooks for AWS server provisioning, configuration, and application deployment',
      'Supported Java and Spring Boot services in AWS EKS and Kubernetes environments using kubectl, Helm, deployment configuration, and workload-capacity settings',
      'Deployed and operated applications across AWS EC2, S3, and RDS while supporting engineering tools including GitHub, SonarQube, and SauceLabs',
      'Automated recurring data-processing workflows with Python, reducing manual operational effort by approximately 40%',
    ],
    technologies: [
      'Ansible',
      'AWS EKS',
      'Kubernetes',
      'kubectl',
      'Helm',
      'AWS EC2',
      'AWS S3',
      'AWS RDS',
      'Java',
      'Spring Boot',
      'Python',
      'SonarQube',
      'GitHub',
    ],
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
      'Owned application-level security hardening across enterprise web applications and OpenShift delivery environments: vulnerability remediation, secure API design, authentication enforcement, and platform-aware troubleshooting.',
    highlights: [
      'Remediated vulnerabilities across Java and React applications using AVA, SAST, and DAST findings',
      'Worked within OpenShift environments by editing deployment YAML and inspecting pods while coordinating application and platform fixes',
      'Implemented CSRF protections, OAuth2/JWT authentication, and API endpoint hardening across internal systems',
      'Designed and documented REST APIs through Swagger/OpenAPI to support secure integration patterns across distributed teams',
    ],
    technologies: [
      'Java',
      'React',
      'JavaScript',
      'OpenShift',
      'Kubernetes YAML',
      'Pod Troubleshooting',
      'Ansible',
      'AWS',
      'OAuth2',
      'JWT',
      'Swagger/OpenAPI',
      'SAST/DAST',
    ],
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
      'Built and maintained frontend, service-layer, and platform-delivery software for internal retail systems at enterprise scale: cross-repository modernization, microservice development, Kubernetes delivery, and distributed-team execution.',
    highlights: [
      'Built and supported React applications and Kotlin microservices used across internal operational workflows',
      'Supported AWS EKS and Kubernetes delivery using kubectl, Helm, CircleCI pipeline configuration, and Ansible-based workflows',
      'Diagnosed and resolved issues across 30+ repositories as part of platform support rotations',
      'Led modernization across 50+ repositories through dependency upgrades, build-tool migration, and configuration standardization',
    ],
    technologies: [
      'React',
      'Kotlin',
      'Microservices',
      'AWS EKS',
      'Kubernetes',
      'kubectl',
      'Helm',
      'CircleCI',
      'Ansible',
      'Git',
      'Agile',
    ],
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
    description:
      'Analyzed satellite and ground-based magnetometer data for magnetospheric-physics research, contributing to studies of EMIC wave events and space weather.',
    highlights: [
      'Used IDL and Python to ingest, transform, and analyze scientific data from satellite and ground-based magnetometer observations',
      'Generated line plots and FFT-based spectral visualizations and spectrograms for large scientific datasets',
      'Manually reviewed large volumes of resulting visualizations to identify candidate and anomalous events for research-team analysis',
      'Contributed analysis used in conference research and the 2018 peer-reviewed JGR: Space Physics paper',
    ],
    technologies: ['IDL', 'Python', 'FFT', 'Magnetometer Data', 'Space Weather'],
  },
]

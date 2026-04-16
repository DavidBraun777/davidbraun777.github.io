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
      'Sole engineer responsible for the full delivery lifecycle of accessible web systems for nonprofit organizations: architecture, frontend, infrastructure, deployment, and ongoing operational support.',
    highlights: [
      'Owned the entire production stack for the VIFG nonprofit website: React frontend, Dockerized delivery, Nginx reverse proxy, and AWS Lightsail hosting',
      'Built and maintained CI/CD pipeline with GitHub Actions for repeatable production deployments',
      'Managed DNS (Route 53), SSL/TLS provisioning, and host-level security configuration',
      'Treated accessibility as a system constraint: screen reader compatibility, keyboard navigation, and contrast requirements enforced throughout delivery',
      'Current public delivery work also includes client-facing sites at time2move.io and arklandscaping.net',
    ],
    technologies: ['React', 'Vite', 'AWS Lightsail', 'Docker', 'GitHub Actions', 'Nginx', 'Route 53'],
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
      'Owned infrastructure automation and cloud application delivery across AWS environments: provisioning, configuration management, microservice development, and operational tooling.',
    highlights: [
      'Authored and maintained Ansible playbooks for server provisioning and application deployment across enterprise infrastructure',
      'Deployed and operated cloud-based applications on AWS EC2, S3, and RDS with responsibility for uptime and configuration',
      'Built Java microservices with Spring Boot for internal platform needs, including data pipelines and operational tooling',
      'Automated recurring data processing workflows with Python, reducing manual operational load for the team',
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
      'Owned application-level security hardening across internal web applications: vulnerability remediation, secure API design, and authentication enforcement.',
    highlights: [
      'Remediated vulnerabilities across Java and JavaScript applications using AVA/SAST/DAST scanning results',
      'Implemented CSRF protections, OAuth2/JWT authentication, and API endpoint hardening across internal systems',
      'Applied secure coding practices in React and Java codebases, working with engineering teams to prevent regression',
      'Designed and documented REST APIs through Swagger/OpenAPI to support secure integration patterns',
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
      'Built and maintained frontend and service-layer software for internal retail systems at enterprise scale: cross-repo modernization, microservice development, and cross-team delivery.',
    highlights: [
      'Built and supported React applications used across internal operational workflows',
      'Developed Kotlin-based microservices for internal platform functionality',
      'Diagnosed and resolved issues across 30+ repositories as part of platform support rotations',
      'Led modernization work across 50+ repositories: dependency upgrades, build tooling migration, and configuration standardization',
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
      'Edited IDL programs for further analysis of space events',
      'Analyzed terabytes of data for papers published with co-authorship in professional journals',
      'Published works on topics including Ultra-Low-Frequency Wave Investigations',
    ],
    technologies: ['IDL', 'Data Analysis', 'Research'],
  },
]

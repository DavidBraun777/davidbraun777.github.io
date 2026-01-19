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
    description: 'Founded a software consultancy focused on building accessible web applications for non-profit organizations.',
    highlights: [
      'Created and managed the website for VIFG, a non-profit supporting the visually impaired, built with ReactJS, ViteJS, and hosted on AWS',
      'Implemented Docker containers to streamline development and production deployments with GitHub Actions CI/CD automation',
      'Managed DNS and SSL/TLS certificates through AWS Route 53, ensuring secure and reliable access',
      'Configured Nginx as a reverse proxy to optimize traffic flow and enable load balancing for high availability',
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
    description: 'Supported enterprise systems integration and API development for one of the largest banks in the United States.',
    highlights: [
      'Used Postman to test, validate, and troubleshoot REST APIs, improving application integrations and ensuring data accuracy',
      'Collaborated with stakeholders, external vendors, and cross-functional teams to resolve technical issues and improve response times',
      'Created and maintained detailed technical documentation, enhancing clarity and efficiency of support processes',
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
    description: 'Automated infrastructure provisioning and managed cloud-based applications to improve system performance and reliability.',
    highlights: [
      'Automated infrastructure provisioning and configuration management using Ansible, improving deployment speed and reliability',
      'Utilized AWS services (EC2, S3, RDS) to deploy and manage cloud-based applications, significantly improving system performance',
      'Developed and maintained Ansible playbooks for automated server configuration and application deployment on AWS EC2',
      'Designed and implemented Java-based microservices using Spring and Spring Boot, ensuring scalability and robustness',
      'Automated data processing workflows with Python, reducing manual intervention and improving efficiency by 40%',
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
    description: 'Strengthened security posture of critical applications through vulnerability remediation and secure coding practices.',
    highlights: [
      'Remediated vulnerabilities in Java and legacy applications using AVA/SAST/DAST scans',
      'Strengthened JavaScript and React mobile/web applications by implementing secure coding practices',
      'Developed a more effective method to manually protect against Cross-Site Request Forgery (CSRF) attacks',
      'Collaborated with teams on AWS services (EC2, S3, Lambda) to ensure secure integration and deployment practices',
      'Secured API endpoints by implementing OAuth2 and JWT authentication against unauthorized access',
      'Designed and integrated RESTful APIs using Swagger/OpenAPI, enhancing cross-functional team collaboration',
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
    description: 'Architected scalable applications and led cross-functional teams in an agile development environment.',
    highlights: [
      'Architected and supported highly scalable React-driven applications, improving user experience and accessibility',
      'Built and sustained Kotlin-based microservices for vital internal systems, achieving enhanced performance and scalability',
      'Diagnosed and fixed issues across 30+ code repositories, ensuring robust and efficient codebases',
      'Optimized and upgraded over 50 repositories, boosting functionality through strategic code refactoring',
      'Led cross-functional and globally dispersed teams in an agile development environment',
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
      'Upgraded and maintained shipment/inventory center software including storefront and APIs',
      'Optimized inventory management system by 70%',
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

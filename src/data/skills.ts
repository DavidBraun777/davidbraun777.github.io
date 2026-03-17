import {
  Bot,
  Code2,
  Cloud,
  Database,
  GitBranch,
  Layers,
  Network,
  Shield,
  Server,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export interface SkillCategory {
  id: string
  name: string
  icon: LucideIcon
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    icon: Code2,
    skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'Kotlin', 'SQL', 'Shell Scripting'],
  },
  {
    id: 'ai-machine-learning',
    name: 'AI & Machine Learning',
    icon: Bot,
    skills: [
      'Applied LLM systems',
      'Conversational AI workflows',
      'Retrieval and knowledge workflows',
      'Prompt and system design',
      'Automation-oriented AI integration',
    ],
  },
  {
    id: 'backend-systems',
    name: 'Backend Systems',
    icon: Server,
    skills: [
      'Spring',
      'Spring Boot',
      'Node.js',
      'REST APIs',
      'Microservices',
      'Swagger/OpenAPI',
      'Nginx',
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    icon: Layers,
    skills: ['React', 'Angular', 'Vite', 'TypeScript web applications'],
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud & Infrastructure',
    icon: Cloud,
    skills: ['AWS (EC2, S3, Lambda, RDS, Route 53, Lightsail)', 'OpenShift', 'Firebase', 'Linux deployment environments'],
  },
  {
    id: 'devops-platform',
    name: 'DevOps & Platform Engineering',
    icon: GitBranch,
    skills: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitHub Actions', 'Git', 'CI/CD Pipelines'],
  },
  {
    id: 'databases-data-systems',
    name: 'Databases & Data Systems',
    icon: Database,
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Relational schema design', 'Database management'],
  },
  {
    id: 'security-engineering',
    name: 'Security Engineering',
    icon: Shield,
    skills: ['OAuth2', 'JWT', 'SSL/TLS', 'CSRF protection', 'SAST', 'DAST'],
  },
  {
    id: 'systems-architecture',
    name: 'Systems Architecture',
    icon: Network,
    skills: [
      'Distributed services',
      'Workflow automation systems',
      'API-first platform design',
      'Serverless patterns',
      'Infrastructure-backed web systems',
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: Wrench,
    skills: ['Linux', 'Postman', 'Proxmox', 'VS Code', 'IntelliJ IDEA', 'macOS', 'Windows', 'AVA'],
  },
]

export const otherSkills = {
  workingStyle: ['Agile', 'DevOps', 'Full-stack delivery'],
  additional: ['Sign Language (Fluent)'],
}

export interface PositioningTrack {
  title: string
  description: string
}

export const positioningTracks: PositioningTrack[] = [
  {
    title: 'AI Systems Engineer',
    description:
      'Best fit for work that combines backend services, workflow automation, infrastructure, and AI-enabled product logic into one operating system.',
  },
  {
    title: 'Applied AI Engineer',
    description:
      'Strongest when AI is part of a grounded workflow such as retrieval, guided intake, summarization, or decision support.',
  },
  {
    title: 'Platform Engineer',
    description:
      'Comfortable owning the APIs, deployment workflows, cloud infrastructure, and operational tooling that keep products reliable.',
  },
]

export interface FocusArea {
  title: string
  description: string
  signals: string[]
}

export const focusAreas: FocusArea[] = [
  {
    title: 'Retrieval & Knowledge Workflows',
    description:
      'Grounding AI-assisted products in retrieved context so the system stays useful, inspectable, and easier to trust.',
    signals: ['Knowledge retrieval', 'Structured outputs', 'Traceable responses'],
  },
  {
    title: 'Conversational Automation',
    description:
      'Designing intake, triage, and guided interaction systems where AI supports the workflow without owning every decision.',
    signals: ['Workflow constraints', 'Human handoff', 'Operational routing'],
  },
  {
    title: 'Model Serving & Evaluation Patterns',
    description:
      'Improving how AI-backed software validates outputs, compares behavior over time, and avoids demo-only quality.',
    signals: ['Guardrails', 'Regression checks', 'Quality review'],
  },
  {
    title: 'Data & Orchestration for AI Systems',
    description:
      'Building the queues, APIs, persistence, and task routing layers that make AI features behave like maintainable software.',
    signals: ['Queues', 'Persistence', 'Job orchestration'],
  },
]

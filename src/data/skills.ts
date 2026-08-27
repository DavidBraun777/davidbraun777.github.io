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
import { northStarIdentity } from '@/data/career-story'

export {
  architectureSkillLayers,
  fullTimeRoleFamilies as relatedRoleFamilies,
} from '@/data/career-story'

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
    skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'Kotlin', 'SQL', 'Swift', 'Shell Scripting'],
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
      'Model evaluation and MLOps',
      'OpenAI Codex and Claude Code workflows',
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
      'Express',
      'Fastify',
      'FastAPI',
      'REST APIs',
      'Microservices',
      'Swagger/OpenAPI',
      'BullMQ job workers',
      'Nginx',
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend & Mobile',
    icon: Layers,
    skills: ['React', 'Next.js', 'React Native', 'Expo', 'Angular', 'Astro', 'Vite', 'TypeScript web applications'],
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud & Infrastructure',
    icon: Cloud,
    skills: [
      'AWS (EKS, ECR, EC2, S3, Lambda, RDS, DynamoDB, Route 53, Lightsail, CloudFront)',
      'GCP Artifact Registry',
      'Firebase Authentication, Functions, and Hosting',
      'Azure DevOps and Azure Functions',
      'Linux deployment environments',
    ],
  },
  {
    id: 'devops-platform',
    name: 'DevOps & Platform Engineering',
    icon: GitBranch,
    skills: [
      'GitHub Actions',
      'CircleCI',
      'Jenkins',
      'Docker',
      'Kubernetes',
      'kubectl',
      'Helm',
      'OpenShift',
      'Ansible',
      'AWS CloudFormation',
      'Terraform (historical use)',
      'Git',
      'CI/CD pipeline design',
    ],
  },
  {
    id: 'databases-data-systems',
    name: 'Databases & Data Systems',
    icon: Database,
    skills: [
      'PostgreSQL',
      'Supabase',
      'MySQL',
      'MongoDB',
      'Redis',
      'DynamoDB',
      'Apache Kafka',
      'Parquet data pipelines',
      'Relational schema design',
    ],
  },
  {
    id: 'security-engineering',
    name: 'Security & Quality Engineering',
    icon: Shield,
    skills: [
      'OAuth2',
      'JWT',
      'SSL/TLS',
      'CSRF protection',
      'SAST',
      'DAST',
      'CodeQL',
      'SonarCloud',
      'Dependency auditing',
      'Playwright end-to-end testing',
      'Accessibility validation',
    ],
  },
  {
    id: 'systems-architecture',
    name: 'Systems Architecture',
    icon: Network,
    skills: [
      'Distributed services',
      'Event-driven pipelines',
      'Workflow and job orchestration',
      'API-first platform design',
      'Serverless patterns',
      'Monorepo and shared-schema design',
      'Infrastructure-backed web systems',
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: Wrench,
    skills: ['Linux', 'Postman', 'Proxmox', 'OpenAI Codex', 'Claude Code', 'VS Code', 'IntelliJ IDEA', 'macOS', 'Windows', 'AVA'],
  },
]

export const otherSkills = {
  workingStyle: ['Agile', 'DevOps', 'Full-stack delivery', 'Platform modernization', 'Distributed-team collaboration'],
  additional: ['Sign Language (Fluent)'],
}

export interface PositioningTrack {
  title: string
  description: string
}

export const positioningTracks: PositioningTrack[] = [
  {
    title: northStarIdentity,
    description:
      'Primary professional synthesis for work that connects AI and data capabilities to applications, APIs, workflows, cloud infrastructure, security, evaluation, observability, and production operations.',
  },
]

export const relatedRoleHeading = 'Roles where this background maps well'

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

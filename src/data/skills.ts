import {
  Code2,
  Layers,
  Database,
  Cloud,
  Wrench,
  GitBranch,
  Shield,
  Server,
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
    id: 'languages',
    name: 'Programming Languages',
    icon: Code2,
    skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'Kotlin', 'SQL', 'Shell Scripting'],
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Libraries',
    icon: Layers,
    skills: ['Spring', 'Spring Boot', 'React', 'Angular', 'Node.js', 'Vite'],
  },
  {
    id: 'cloud',
    name: 'Cloud Platforms',
    icon: Cloud,
    skills: ['AWS (EC2, S3, Lambda, RDS, Route 53, Lightsail)', 'Firebase', 'OpenShift'],
  },
  {
    id: 'devops',
    name: 'DevOps & CI/CD',
    icon: GitBranch,
    skills: ['Docker', 'Kubernetes', 'GitHub Actions', 'Ansible', 'Terraform', 'Git', 'CI/CD Pipelines'],
  },
  {
    id: 'databases',
    name: 'Databases',
    icon: Database,
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Database Management'],
  },
  {
    id: 'security',
    name: 'Security & Testing',
    icon: Shield,
    skills: ['AVA', 'SAST', 'DAST', 'OAuth2', 'JWT', 'SSL/TLS', 'CSRF Protection'],
  },
  {
    id: 'architecture',
    name: 'Architecture & Systems',
    icon: Server,
    skills: ['Microservices Architecture', 'Serverless Computing', 'RESTful APIs', 'Swagger/OpenAPI', 'Nginx'],
  },
  {
    id: 'tools',
    name: 'Tools & Platforms',
    icon: Wrench,
    skills: ['Linux', 'Windows', 'macOS', 'Postman', 'Proxmox', 'VS Code', 'IntelliJ IDEA'],
  },
]

export const otherSkills = {
  methodologies: ['Agile', 'Full-Stack Development', 'DevOps'],
  languages: ['Sign Language (Fluent)'],
}

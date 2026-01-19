export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: 'web' | 'infrastructure' | 'security' | 'hardware' | 'other'
}

export const projects: Project[] = [
  {
    id: 'vifg',
    title: 'Vision Inspired Fellowship Group',
    description: 'Accessible website for visually impaired users with donation support and event management.',
    longDescription: 'Built a responsive and accessible website for a non-profit organization dedicated to supporting the visually impaired community. Features include easy navigation designed for disabled users, donation integration, and event management capabilities. Deployed with Docker and GitHub Actions CI/CD.',
    image: '/images/projects/heart_hand.jpg',
    technologies: ['React', 'Vite', 'AWS Lightsail', 'Docker', 'GitHub Actions', 'Nginx'],
    githubUrl: 'https://github.com/DavidBraun777/vifg',
    featured: true,
    category: 'web',
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    description: 'Modern Next.js portfolio with dark mode, animations, and MDX blog.',
    longDescription: 'This portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Features include dark mode toggle, smooth animations, accessible design, and an MDX-powered blog.',
    image: '/images/profile/Smolder.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MDX'],
    githubUrl: 'https://github.com/DavidBraun777/davidbraun777.github.io',
    liveUrl: 'https://dbraun.io',
    featured: true,
    category: 'web',
  },
  {
    id: 'security-lab',
    title: 'High-Performance Security Lab PC',
    description: 'Custom-built workstation for GPU-accelerated malware analysis and security research.',
    longDescription: 'Selected and integrated components (Intel i9-10980XE, 256 GB RAM, dual RTX 3090 GPUs, four NVMe drives) to support GPU-accelerated malware analysis and large-scale Burp Suite scans. Configured Proxmox to host 12 isolated VMs and Kubernetes micro-clusters for safe CVE reproduction and blue-team remediation testing. Implemented disk-level encryption and Secure Boot to protect sensitive data.',
    image: '/images/profile/Smolder.png',
    technologies: ['Proxmox', 'Kubernetes', 'Burp Suite', 'VMs', 'Encryption', 'Secure Boot'],
    featured: true,
    category: 'security',
  },
  {
    id: 'pihole',
    title: 'Raspberry Pi Network Security (Pi-hole)',
    description: 'Network-wide ad blocker and DNS sinkhole improving security and performance.',
    longDescription: 'Configured and maintained a Raspberry Pi 4+ as a Pi-hole server, serving as a network-wide ad blocker. Improves overall network security by blocking malicious domains and enhances browsing performance by reducing ad traffic.',
    image: '/images/profile/Smolder.png',
    technologies: ['Raspberry Pi', 'Pi-hole', 'DNS', 'Linux', 'Networking'],
    featured: false,
    category: 'infrastructure',
  },
  {
    id: 'synology-nas',
    title: 'Synology NAS with RAID 60',
    description: 'Enterprise-grade network storage with data redundancy and high performance.',
    longDescription: 'Implemented a Synology NAS setup with RAID 60 across four bays, ensuring data redundancy and optimal performance. Currently exploring transition to RAID 10 for better write performance and resilience.',
    image: '/images/profile/Smolder.png',
    technologies: ['Synology', 'RAID 60', 'NAS', 'Data Storage', 'Networking'],
    featured: false,
    category: 'infrastructure',
  },
  {
    id: 'hackintosh',
    title: 'Hackintosh Build',
    description: 'Custom macOS High Sierra build achieving full functionality with custom hardware.',
    longDescription: 'Built and configured a Hackintosh running macOS High Sierra, achieving full functionality with custom hardware. Demonstrates deep understanding of system architecture and driver compatibility.',
    image: '/images/profile/Smolder.png',
    technologies: ['macOS', 'Hardware', 'System Configuration', 'Drivers'],
    featured: false,
    category: 'hardware',
  },
  {
    id: 'pdf-audiobook',
    title: 'PDF to Audiobook Converter',
    description: 'AWS-powered tool converting PDFs to audiobooks using Amazon Polly.',
    longDescription: 'Using S3 and Amazon Polly to convert PDFs to audiobooks. Serverless architecture for scalable text-to-speech conversion.',
    image: '/images/profile/Smolder.png',
    technologies: ['AWS S3', 'Amazon Polly', 'Serverless', 'Python'],
    featured: false,
    category: 'other',
  },
]

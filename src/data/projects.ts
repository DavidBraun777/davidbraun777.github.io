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
    description: 'Accessible web platform for a non-profit serving the visually impaired — built for real users with real accessibility needs.',
    longDescription: 'Challenge: A non-profit supporting the visually impaired community needed a web presence that was genuinely accessible, not just compliant. Approach: Built a responsive, accessibility-first website with React and Vite, prioritizing screen reader compatibility, keyboard navigation, and high-contrast design. Deployed on AWS Lightsail with Docker containers and GitHub Actions CI/CD for zero-downtime updates. Configured Nginx as a reverse proxy with SSL/TLS via Route 53. Outcome: Delivered a production platform with donation integration and event management that serves users with visual impairments.',
    // TODO: David — add real metrics here: monthly visitors, donation conversion rate, uptime %, accessibility audit score
    image: '/images/projects/heart_hand.jpg',
    technologies: ['React', 'Vite', 'AWS Lightsail', 'Docker', 'GitHub Actions', 'Nginx'],
    githubUrl: 'https://github.com/DavidBraun777/vifg',
    liveUrl: 'https://www.vifg.org/',
    featured: true,
    category: 'web',
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio — dbraun.io',
    description: 'High-performance Next.js 16 portfolio with 100 Lighthouse scores, GSAP animations, and MDX blog engine.',
    longDescription: 'Challenge: Needed a portfolio that demonstrates engineering depth, not just design. Approach: Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. Implemented GSAP scroll-triggered animations, Framer Motion micro-interactions, MDX-powered blog, server-side contact form with rate limiting, and comprehensive accessibility (semantic HTML, ARIA, reduced motion support). Includes CI/CD with GitHub Actions, Vitest unit tests, and Playwright E2E/a11y tests. Outcome: Production site at dbraun.io with fast load times and full accessibility compliance.',
    // TODO: David — add Lighthouse scores, page load time, build size
    image: '/images/profile/Smolder.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'MDX'],
    githubUrl: 'https://github.com/DavidBraun777/davidbraun777.github.io',
    liveUrl: 'https://dbraun.io',
    featured: true,
    category: 'web',
  },
  {
    id: 'security-lab',
    title: 'GPU-Accelerated Security Lab',
    description: 'Custom workstation running 12 isolated VMs on Proxmox for malware analysis, CVE reproduction, and ML workloads.',
    longDescription: 'Challenge: Needed an isolated, high-performance environment for GPU-accelerated malware analysis, vulnerability research, and ML experimentation. Approach: Selected and integrated enterprise-grade components — Intel i9-10980XE, 256 GB RAM, dual RTX 3090 GPUs, four NVMe drives. Configured Proxmox to host 12 isolated VMs and Kubernetes micro-clusters for safe CVE reproduction and blue-team remediation testing. Implemented disk-level encryption and Secure Boot. Outcome: A versatile lab environment supporting security research, ML training workloads, and infrastructure experimentation.',
    // TODO: David — add specs you want public, VM count, workload types, any benchmark numbers
    image: '/images/profile/Smolder.png',
    technologies: ['Proxmox', 'Kubernetes', 'Burp Suite', 'VMs', 'Encryption', 'Secure Boot'],
    featured: true,
    category: 'security',
  },
  {
    id: 'pihole',
    title: 'Network-Level DNS Security (Pi-hole)',
    description: 'Raspberry Pi DNS sinkhole blocking malicious domains network-wide and improving browsing performance.',
    longDescription: 'Challenge: Needed network-wide protection against malicious domains and ad-tracking without per-device configuration. Approach: Configured a Raspberry Pi 4+ as a Pi-hole DNS server acting as a network-wide sinkhole. Custom blocklists target malicious domains, telemetry endpoints, and ad networks. Outcome: All devices on the network benefit from DNS-level filtering with no client-side software required.',
    // TODO: David — add blocked domain count, % of queries filtered, uptime
    image: '/images/profile/Smolder.png',
    technologies: ['Raspberry Pi', 'Pi-hole', 'DNS', 'Linux', 'Networking'],
    liveUrl: 'https://pi-hole.net/',
    featured: false,
    category: 'infrastructure',
  },
  {
    id: 'synology-nas',
    title: 'Enterprise NAS with RAID 60',
    description: 'Redundant network storage with RAID 60 for data integrity and high-throughput access across the home lab.',
    longDescription: 'Challenge: Needed reliable, high-capacity storage with redundancy for VM images, datasets, and backups across the lab network. Approach: Implemented a Synology NAS with RAID 60 across four bays, balancing redundancy with usable capacity. Evaluating transition to RAID 10 for improved write performance. Outcome: Centralized storage serving the security lab, development environments, and backup infrastructure.',
    // TODO: David — add total capacity, read/write speeds, what it backs up
    image: '/images/profile/Smolder.png',
    technologies: ['Synology', 'RAID 60', 'NAS', 'Data Storage', 'Networking'],
    featured: false,
    category: 'infrastructure',
  },
  {
    id: 'hackintosh',
    title: 'Hackintosh Build',
    description: 'Custom macOS build demonstrating deep hardware/software integration and driver-level systems knowledge.',
    longDescription: 'Challenge: Wanted to run macOS on custom hardware to understand the full depth of OS-level driver compatibility and system architecture. Approach: Built and configured a Hackintosh running macOS High Sierra, resolving driver conflicts, kext management, and boot-loader configuration for full hardware functionality. Outcome: Fully functional macOS system on non-Apple hardware — a deep exercise in systems engineering.',
    image: '/images/profile/Smolder.png',
    technologies: ['macOS', 'Hardware', 'System Configuration', 'Drivers'],
    liveUrl: 'https://hackintosh.com/',
    featured: false,
    category: 'hardware',
  },
  {
    id: 'pdf-audiobook',
    title: 'PDF to Audiobook Converter',
    description: 'Serverless AWS pipeline converting PDFs to audiobooks using S3 and Amazon Polly.',
    longDescription: 'Challenge: Wanted to make long-form PDF content accessible as audio without manual narration. Approach: Built a serverless pipeline using AWS S3 for document storage and Amazon Polly for neural text-to-speech conversion. Python handles PDF parsing, text extraction, and chunking for Polly\'s input limits. Outcome: Automated conversion pipeline that transforms PDFs into natural-sounding audiobooks.',
    // TODO: David — add conversion time, supported formats, cost per conversion
    image: '/images/profile/Smolder.png',
    technologies: ['AWS S3', 'Amazon Polly', 'Serverless', 'Python'],
    featured: false,
    category: 'other',
  },
]

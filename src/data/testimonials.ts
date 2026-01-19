export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  image?: string
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Coming Soon',
    role: 'Colleague',
    company: 'Previous Company',
    content: 'Testimonials from colleagues and managers will be added here. David is known for his strong technical skills, collaborative approach, and dedication to delivering high-quality solutions.',
  },
  // Add more testimonials as you collect them
]

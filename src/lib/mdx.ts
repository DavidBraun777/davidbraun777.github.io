import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  image?: string
  content: string
  readingTime: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  image?: string
  readingTime: string
}

/** Only allow slugs that are alphanumeric with hyphens/underscores (no mutation) */
const VALID_SLUG_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/
function isValidSlug(slug: string): boolean {
  return VALID_SLUG_REGEX.test(slug)
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => {
      if (!fileName.endsWith('.mdx')) return false
      const slug = fileName.replace(/\.mdx$/, '')
      if (!isValidSlug(slug)) {
        console.warn(`Skipping blog file with invalid slug: ${fileName}`)
        return false
      }
      return true
    })
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'David Braun',
        tags: data.tags || [],
        image: data.image,
        readingTime: calculateReadingTime(content),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    if (!isValidSlug(slug)) return null
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author || 'David Braun',
      tags: data.tags || [],
      image: data.image,
      content,
      readingTime: calculateReadingTime(content),
    }
  } catch {
    return null
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .filter((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      if (!isValidSlug(slug)) {
        console.warn(`Skipping blog file with invalid slug: ${fileName}`)
        return false
      }
      return true
    })
    .map((fileName) => fileName.replace(/\.mdx$/, ''))
}

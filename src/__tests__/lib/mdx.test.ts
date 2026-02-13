import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'

vi.mock('fs')

const mockedFs = vi.mocked(fs)

// readdirSync is called without withFileTypes in production code, returning string[].
// vi.mocked resolves to the Dirent[] overload, so we use a typed helper.
function mockReaddirSync(files: string[]) {
  ;(mockedFs.readdirSync as ReturnType<typeof vi.fn>).mockReturnValue(files)
}

// Realistic MDX content with frontmatter used across tests
const POST_NEWEST = [
  '---',
  'title: "Building Scalable APIs with Next.js"',
  'description: "A deep dive into building production-ready APIs using Next.js route handlers."',
  'date: "2025-03-15"',
  'author: "David Braun"',
  'tags: ["nextjs", "api", "typescript"]',
  'image: "/images/blog/scalable-apis.jpg"',
  '---',
  '',
  'In this post we explore how to build scalable APIs using Next.js route handlers.',
  '',
  'We will cover authentication, rate limiting, and error handling patterns that',
  'work well in production environments.',
].join('\n')

const POST_MIDDLE = [
  '---',
  'title: "Understanding React Server Components"',
  'description: "Learn how React Server Components change the way we think about rendering."',
  'date: "2025-02-10"',
  'author: "David Braun"',
  'tags: ["react", "rsc", "performance"]',
  '---',
  '',
  'React Server Components represent a paradigm shift in how we build React applications.',
  '',
  'They allow us to render components on the server without sending their JavaScript',
  'to the client, dramatically reducing bundle sizes.',
].join('\n')

const POST_OLDEST = [
  '---',
  'title: "Getting Started with TypeScript"',
  'description: "A beginner-friendly guide to TypeScript for JavaScript developers."',
  'date: "2025-01-05"',
  'author: "Jane Smith"',
  'tags: ["typescript", "javascript", "beginner"]',
  '---',
  '',
  'TypeScript adds static type checking to JavaScript, helping you catch errors early.',
].join('\n')

const POST_MINIMAL = [
  '---',
  'title: "Minimal Post"',
  '---',
  '',
  'Just some content.',
].join('\n')

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

// We import the module under test AFTER setting up the mock so the mock is in
// place when the module is loaded.
import { getAllPosts, getPostBySlug, getAllPostSlugs } from '@/lib/mdx'

describe('getAllPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns posts sorted by date (newest first)', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockReaddirSync([
      'getting-started-with-typescript.mdx',
      'building-scalable-apis.mdx',
      'understanding-react-server-components.mdx',
    ])

    mockedFs.readFileSync.mockImplementation((filePath: fs.PathOrFileDescriptor) => {
      const p = filePath as string
      if (p.includes('building-scalable-apis')) return POST_NEWEST
      if (p.includes('understanding-react-server-components')) return POST_MIDDLE
      if (p.includes('getting-started-with-typescript')) return POST_OLDEST
      return ''
    })

    const posts = getAllPosts()

    expect(posts).toHaveLength(3)
    expect(posts[0].slug).toBe('building-scalable-apis')
    expect(posts[0].date).toBe('2025-03-15')
    expect(posts[1].slug).toBe('understanding-react-server-components')
    expect(posts[1].date).toBe('2025-02-10')
    expect(posts[2].slug).toBe('getting-started-with-typescript')
    expect(posts[2].date).toBe('2025-01-05')
  })

  it('skips files with invalid slug format and logs a warning', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mockedFs.existsSync.mockReturnValue(true)
    mockReaddirSync([
      'valid-post.mdx',
      'file with spaces.mdx',
      'file.with.dots.mdx',
      '.hidden-file.mdx',
    ])

    mockedFs.readFileSync.mockReturnValue(POST_MINIMAL)

    const posts = getAllPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0].slug).toBe('valid-post')

    // Three invalid slugs should each produce a warning
    expect(warnSpy).toHaveBeenCalledTimes(3)
    expect(warnSpy).toHaveBeenCalledWith(
      'Skipping blog file with invalid slug: file with spaces.mdx'
    )
    expect(warnSpy).toHaveBeenCalledWith(
      'Skipping blog file with invalid slug: file.with.dots.mdx'
    )
    expect(warnSpy).toHaveBeenCalledWith(
      'Skipping blog file with invalid slug: .hidden-file.mdx'
    )

    warnSpy.mockRestore()
  })

  it('returns empty array when posts directory does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false)

    const posts = getAllPosts()

    expect(posts).toEqual([])
    expect(mockedFs.readdirSync).not.toHaveBeenCalled()
  })

  it('only includes .mdx files', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockReaddirSync([
      'valid-post.mdx',
      'readme.md',
      'notes.txt',
      'draft.mdxx',
      'image.png',
    ])

    mockedFs.readFileSync.mockReturnValue(POST_MINIMAL)

    const posts = getAllPosts()

    expect(posts).toHaveLength(1)
    expect(posts[0].slug).toBe('valid-post')
    // readFileSync should only be called once for the single .mdx file
    expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1)
  })
})

describe('getPostBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns post data for a valid slug', () => {
    mockedFs.readFileSync.mockReturnValue(POST_NEWEST)

    const post = getPostBySlug('building-scalable-apis')

    expect(post).not.toBeNull()
    expect(post!.slug).toBe('building-scalable-apis')
    expect(post!.title).toBe('Building Scalable APIs with Next.js')
    expect(post!.description).toBe(
      'A deep dive into building production-ready APIs using Next.js route handlers.'
    )
    expect(post!.date).toBe('2025-03-15')
    expect(post!.author).toBe('David Braun')
    expect(post!.tags).toEqual(['nextjs', 'api', 'typescript'])
    expect(post!.image).toBe('/images/blog/scalable-apis.jpg')
    expect(post!.content).toContain('scalable APIs using Next.js route handlers')
    expect(post!.readingTime).toMatch(/^\d+ min read$/)

    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      path.join(postsDirectory, 'building-scalable-apis.mdx'),
      'utf8'
    )
  })

  it('returns null for invalid slug format (path traversal)', () => {
    const post = getPostBySlug('../etc/passwd')

    expect(post).toBeNull()
    // Should not even attempt to read the file
    expect(mockedFs.readFileSync).not.toHaveBeenCalled()
  })

  it('returns null for other invalid slug formats', () => {
    expect(getPostBySlug('slug with spaces')).toBeNull()
    expect(getPostBySlug('.hidden')).toBeNull()
    expect(getPostBySlug('slug.with.dots')).toBeNull()
    expect(getPostBySlug('')).toBeNull()

    expect(mockedFs.readFileSync).not.toHaveBeenCalled()
  })

  it('returns null for non-existent slug', () => {
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory')
    })

    const post = getPostBySlug('non-existent-post')

    expect(post).toBeNull()
  })

  it('correctly parses frontmatter fields', () => {
    mockedFs.readFileSync.mockReturnValue(POST_OLDEST)

    const post = getPostBySlug('getting-started-with-typescript')

    expect(post).not.toBeNull()
    expect(post!.title).toBe('Getting Started with TypeScript')
    expect(post!.description).toBe(
      'A beginner-friendly guide to TypeScript for JavaScript developers.'
    )
    expect(post!.date).toBe('2025-01-05')
    expect(post!.author).toBe('Jane Smith')
    expect(post!.tags).toEqual(['typescript', 'javascript', 'beginner'])
    expect(post!.image).toBeUndefined()
  })

  it('applies defaults for missing frontmatter fields', () => {
    mockedFs.readFileSync.mockReturnValue(POST_MINIMAL)

    const post = getPostBySlug('minimal-post')

    expect(post).not.toBeNull()
    expect(post!.title).toBe('Minimal Post')
    expect(post!.description).toBe('')
    expect(post!.author).toBe('David Braun')
    expect(post!.tags).toEqual([])
    expect(post!.image).toBeUndefined()
    // date should default to an ISO string (current date)
    expect(post!.date).toBeTruthy()
  })
})

describe('getAllPostSlugs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns array of valid slugs', () => {
    mockedFs.existsSync.mockReturnValue(true)
    mockReaddirSync([
      'building-scalable-apis.mdx',
      'understanding-react-server-components.mdx',
      'getting-started-with-typescript.mdx',
    ])

    const slugs = getAllPostSlugs()

    expect(slugs).toEqual([
      'building-scalable-apis',
      'understanding-react-server-components',
      'getting-started-with-typescript',
    ])
  })

  it('skips files with invalid slug format', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mockedFs.existsSync.mockReturnValue(true)
    mockReaddirSync([
      'valid-slug.mdx',
      'another_valid.mdx',
      'has spaces.mdx',
      '.starts-with-dot.mdx',
      'has.dots.mdx',
    ])

    const slugs = getAllPostSlugs()

    expect(slugs).toEqual(['valid-slug', 'another_valid'])
    expect(warnSpy).toHaveBeenCalledTimes(3)

    warnSpy.mockRestore()
  })

  it('returns empty array when directory does not exist', () => {
    mockedFs.existsSync.mockReturnValue(false)

    const slugs = getAllPostSlugs()

    expect(slugs).toEqual([])
    expect(mockedFs.readdirSync).not.toHaveBeenCalled()
  })
})

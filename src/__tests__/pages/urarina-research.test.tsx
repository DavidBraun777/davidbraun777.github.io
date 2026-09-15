// @vitest-environment happy-dom

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import ResearchPage from '@/app/research/page'
import UrarinaResearchPage, { metadata } from '@/app/research/urarina-hybrid-retrieval/page'
import sitemap from '@/app/sitemap'

const researchPath = '/research/urarina-hybrid-retrieval'
const publicTitle = 'Hybrid Retrieval for Low-Resource Language Archives'
const approvedPriorWork = [
  {
    title: 'Urarina Field Note Restoration Using Machine Learning and Game Play',
    authors: 'Zhengyuan Feng and Michael Dorin',
    url: 'https://researchonline.stthomas.edu/esploro/outputs/bookChapter/Urarina-Field-Note-Restoration-Using-Machine/991015317911303691',
  },
  {
    title: 'Recovering Speech: Language Study Restoration',
    authors: 'Michael Dorin, Mariana Moyano, and Mario Chong',
    url: 'https://faculty.up.edu.pe/en/publications/recovering-speech-language-study-restoration/',
  },
]
const approvedExternalUrls = [
  'https://www.stthomas.edu/',
  'https://researchonline.stthomas.edu/esploro/profile/michael_dorin',
  'https://lacci2026.up.edu.pe/',
  'https://easychair.org/cfp/IEEE-LACCI-2026',
  ...approvedPriorWork.map(({ url }) => url),
]
const priorManuscriptTitle =
  /Hybrid Retrieval Evaluation for Low-Resource Language Archives/i

function renderPage(page: React.ReactNode) {
  const container = document.createElement('div')
  container.innerHTML = renderToStaticMarkup(page)
  return container
}

describe('Urarina research disclosure boundary', () => {
  test('shows acceptance, collaborators, and a visible explanation for withholding details', () => {
    const page = renderPage(<UrarinaResearchPage />)
    const status = page.querySelector('[aria-labelledby="research-status"]')
    const note = page.querySelector('[aria-labelledby="publication-note"]')

    expect(page.querySelector('h1')?.textContent).toBe(publicTitle)
    expect(status?.textContent).toContain('University of St. Thomas')
    expect(status?.textContent).toContain('David Braun and Prof. Michael Dorin')
    expect(status?.textContent).toContain('LA-CCI')
    expect(status?.textContent).toContain(
      'Conference paper accepted; presentation/publication forthcoming'
    )
    expect(status?.textContent).toContain('EasyChair')
    expect(note?.textContent).toMatch(
      /technical details and research results are intentionally being withheld/i
    )
    expect(note?.textContent).toMatch(/only high-level project context/i)
    expect(note?.closest('[hidden], [aria-hidden="true"], .hidden, .sr-only')).toBeNull()
    // The publication embargo applies to the current work. Earlier publications
    // remain explicitly identified and attributed in their own section below.
    page.querySelector('[aria-labelledby="research-lineage"]')?.remove()
    expect(page.textContent).not.toMatch(/\bpublished\b|peer-reviewed publication/i)
  })

  test('clearly attributes prior public work without presenting it as David Braun\'s publications or current results', () => {
    const page = renderPage(<UrarinaResearchPage />)
    const lineage = page.querySelector('[aria-labelledby="research-lineage"]')

    expect(lineage?.textContent).toMatch(/authored by other researchers/i)
    expect(lineage?.textContent).toMatch(
      /should not be interpreted as publications authored by me/i
    )
    expect(lineage?.textContent).toMatch(/or as results from the current LA-CCI research/i)
    expect(lineage?.querySelectorAll('article')).toHaveLength(approvedPriorWork.length)

    for (const reference of approvedPriorWork) {
      const link = lineage?.querySelector(`a[href="${reference.url}"]`)
      const card = link?.closest('article')

      expect(link?.textContent).toBe(reference.title)
      expect(card?.textContent).toContain('Prior public work')
      expect(Array.from(card?.querySelectorAll('p') ?? []).map((p) => p.textContent)).toContain(
        reference.authors
      )
      expect(card?.textContent).not.toMatch(/David Braun|accepted for IEEE LA-CCI/i)
    }
  })

  test('keeps the manuscript title, technical methods, and measured results out of copy and metadata', () => {
    const page = renderPage(<UrarinaResearchPage />)
    const publicContent = `${page.textContent} ${JSON.stringify(metadata)}`

    expect(publicContent).not.toMatch(priorManuscriptTitle)
    expect(publicContent).not.toMatch(
      /\b(?:BM25|TF[- ]?IDF|FAISS|MRR|Hit@\d*|Reciprocal Rank Fusion|ablation|benchmark|phonetic alignment|train\/test)\b/i
    )
    expect(publicContent).not.toMatch(
      /sentence-transformers|all-MiniLM|multilingual-e5|bge-m3|text-embedding-|embedding model/i
    )
    expect(publicContent).not.toMatch(
      /\b\d[\d,]*(?:\.\d+)?\s*(?:queries|transcripts|audio files|cards|alignments|candidates|documents)\b/i
    )
    expect(publicContent).not.toMatch(
      /\b(?:paper|submission)\s*(?:id|number)\b|review(?:er)?\s*(?:comments|scores|feedback)/i
    )
    expect(publicContent).not.toMatch(
      /easychair\.org\/(?:conferences|account|submission)(?:\/|\?|\b)|[?&](?:submission|paper)(?:id|_id)?=/i
    )
  })

  test('links only to approved public destinations and exposes no research media or downloads', () => {
    const page = renderPage(<UrarinaResearchPage />)
    const links = Array.from(page.querySelectorAll('a[href]'))
    const externalLinks = links.filter((link) =>
      /^https?:/i.test(link.getAttribute('href') ?? '')
    )

    expect([...new Set(links.map((link) => link.getAttribute('href')))].sort()).toEqual(
      ['/research', ...approvedExternalUrls].sort()
    )
    for (const link of externalLinks) {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')?.split(/\s+/)).toEqual(
        expect.arrayContaining(['noopener', 'noreferrer'])
      )
    }
    expect(
      page.querySelector('img, picture, audio, video, iframe, object, embed, canvas, table, pre, code, a[download]')
    ).toBeNull()
    expect(page.querySelector('script[type="application/ld+json"]')).toBeNull()
  })

  test('uses conservative website metadata and the existing generic social images', () => {
    expect(metadata.title).toBe(publicTitle)
    expect(metadata.alternates?.canonical).toBe(researchPath)
    expect(metadata.description).toMatch(/accepted for IEEE LA-CCI 2026/i)
    expect(metadata.description).toMatch(/presentation\/publication forthcoming/i)
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      url: researchPath,
      images: [{ url: '/opengraph-image' }],
    })
    expect(metadata.twitter).toMatchObject({ images: ['/twitter-image'] })
    expect(JSON.stringify(metadata)).not.toMatch(
      /publishedTime|datePublished|citation_|doi\.org|ieeexplore|ScholarlyArticle|(?:"|\b)(?:doi|volume|issue|pageNumbers|citationCount)(?:"|\b)/i
    )
  })

  test('makes the safe project title discoverable through the research index and sitemap', () => {
    const page = renderPage(<ResearchPage />)
    const projectLink = page.querySelector(`a[href="${researchPath}"]`)
    const projectCard = projectLink?.closest('article')

    expect(projectLink).not.toBeNull()
    expect(projectCard?.querySelector('h3')?.textContent?.trim()).toBe(publicTitle)
    expect(page.textContent).not.toMatch(priorManuscriptTitle)
    expect(sitemap().filter(({ url }) => url === `https://dbraun.io${researchPath}`)).toHaveLength(1)
  })
})

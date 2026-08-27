import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import Home from '@/app/page'
import ResearchPage from '@/app/research/page'
import WhyWorkWithMePage from '@/app/why-work-with-me/page'

describe('north-star page content', () => {
  test('renders the homepage architecture layers and employer path', () => {
    const markup = renderToStaticMarkup(<Home />)

    expect(markup).toContain('AI Systems / Platform Architect')
    expect(markup).toContain('For Employers &amp; Partners')
    expect(markup).toContain('Operational Integration')
  })

  test('renders all career chapters and both engagement lanes', () => {
    const markup = renderToStaticMarkup(<WhyWorkWithMePage />)

    expect(markup).toContain('Scientific and computational foundation')
    expect(markup).toContain('AI and data specialization')
    expect(markup).toContain('Full-Time / Embedded')
    expect(markup).toContain('Consulting')
  })

  test('renders the research-to-systems bridge and bounded retrieval claim', () => {
    const markup = renderToStaticMarkup(<ResearchPage />)

    expect(markup).toContain('How research informs systems work')
    expect(markup).toContain('not presented as full machine translation')
    expect(markup).toContain('Limits and uncertainty')
  })
})

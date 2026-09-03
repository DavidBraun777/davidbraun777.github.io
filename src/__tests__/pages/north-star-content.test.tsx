import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import EvidenceStandardsPage from '@/app/approach/evidence/page'
import CareerStoryPage from '@/app/experience/career-story/page'
import ExperiencePage from '@/app/experience/page'
import Home from '@/app/page'
import ResearchPage from '@/app/research/page'

describe('north-star page content', () => {
  test('renders the canonical homepage identity and proof-first paths', () => {
    const markup = renderToStaticMarkup(<Home />)

    expect(markup).toContain('AI Systems &amp; Platform Engineer')
    expect(markup).toContain('Selected work')
    expect(markup).toContain('VIFG Nonprofit Platform')
    expect(markup).toContain('DealerFlow')
    expect(markup).toContain('WeatherForge')
    expect(markup).toContain('View Experience')
    expect(markup).toContain('Engineering &amp; Evidence Standards')
  })

  test('keeps Experience concise while preserving current role and credentials', () => {
    const markup = renderToStaticMarkup(<ExperiencePage />)

    expect(markup).toContain('Career highlights')
    expect(markup).toContain('Current University of St. Thomas role')
    expect(markup).toContain('Graduate Certificate in Big Data')
    expect(markup).toContain(
      'The university is transitioning this program to the Data Engineering name.'
    )
    expect(markup).toContain('Discuss a Role')
    expect(markup).toContain('Read the full career through-line')
  })

  test('preserves all five career chapters on the deeper route', () => {
    const markup = renderToStaticMarkup(<CareerStoryPage />)

    expect(markup).toContain('Scientific and computational foundation')
    expect(markup).toContain('Enterprise software systems')
    expect(markup).toContain('Security and platform engineering')
    expect(markup).toContain('End-to-end production ownership')
    expect(markup).toContain('AI and data specialization')
    expect(markup).toContain('AI Systems &amp; Platform Engineer')
    expect(markup).toContain('Engineering roles')
    expect(markup).toContain('Consulting engagements')
  })

  test('moves evidence policy to the dedicated deep-dive page', () => {
    const markup = renderToStaticMarkup(<EvidenceStandardsPage />)

    expect(markup).toContain('Engineering &amp; Evidence Standards')
    expect(markup).toContain('Production')
    expect(markup).toContain('Pilot')
    expect(markup).toContain('R&amp;D / Prototype')
    expect(markup).toContain('AI-assisted engineering and human review')
    expect(markup).toContain('Published research')
    expect(markup).toContain('Accepted research')
    expect(markup).toContain('Security')
    expect(markup).toContain('Accessibility')
    expect(markup).toContain('Testing')
    expect(markup).toContain('Reliability')
  })

  test('keeps legitimate REPT context without exposing the identity collision', () => {
    const markup = renderToStaticMarkup(<ResearchPage />)

    expect(markup).toContain('not presented as full machine translation')
    expect(markup).toContain('Accepted Conference Paper')
    expect(markup).toContain('Peer-Reviewed Journal Article')
    expect(markup).toContain('REPT and MagEIS')
    expect(markup).toContain('How I label and verify technical work')
    expect(markup).not.toContain('Author identity clarification')
    expect(markup).not.toContain('Laboratory for Atmospheric and Space Physics')
    expect(markup).not.toContain('University of Colorado Boulder')
    expect(markup).not.toContain('different researcher')
  })
})

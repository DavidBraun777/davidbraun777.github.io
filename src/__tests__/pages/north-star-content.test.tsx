import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import EvidenceStandardsPage from '@/app/approach/evidence/page'
import CareerStoryPage from '@/app/experience/career-story/page'
import ExperiencePage from '@/app/experience/page'
import Home from '@/app/page'
import ResearchPage from '@/app/research/page'
import { getSystemById } from '@/data/systems'

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
    expect(markup).toContain('October 2022 to March 2024')
    expect(markup).toContain('2014 to 2020')
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

  test("preserves WeatherForge's collaborative origin and established implementation scope", () => {
    const weatherForge = getSystemById('weatherforge')
    const stormIQ = getSystemById('stormiq')

    expect(weatherForge).toBeDefined()
    expect(weatherForge?.positioning).toContain(
      'WeatherForge originated as a collaborative University of St. Thomas SEIS 745 project with Odin Lee and Jannah ElNemr.'
    )
    expect(weatherForge?.positioning).toContain(
      'David Braun served as the lead developer and primary implementer, writing more than 90% of the application code, while the project as a whole was completed collaboratively by the three-person team.'
    )
    expect(weatherForge?.myRole).toBe('Lead developer and primary implementer')
    expect(weatherForge?.solutionTitle).toBe('Solution / Implementation')
    expect(weatherForge?.system).toContain(
      'I wrote more than 90% of the WeatherForge application code across its data pipeline, analytics, and dashboard layers.'
    )
    expect(weatherForge?.system).toContain(
      'My implementation work included filtering, cleaning, transforming, and packaging NOAA Storm Events and GHCN-Daily data'
    )
    expect(JSON.stringify(weatherForge)).not.toMatch(/sole builder/i)
    expect(JSON.stringify(weatherForge)).not.toMatch(
      /more than 90% of (?:the )?(?:project|overall project|academic project|work)/i
    )
    expect(JSON.stringify(stormIQ)).toContain('collaborative WeatherForge academic project')
    expect(JSON.stringify(stormIQ)).not.toMatch(
      /WeatherForge is being built|WeatherForge feeds|systems under active development/i
    )
  })

  test('adds ResearchGate through the shared research-profile data path', () => {
    const markup = renderToStaticMarkup(<ResearchPage />)

    expect(markup).toContain('View ResearchGate Profile')
    expect(markup).toContain('https://www.researchgate.net/profile/David-Braun-5')
  })
})

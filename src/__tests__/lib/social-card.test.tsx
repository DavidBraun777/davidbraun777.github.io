import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import { SocialCard, socialCardAlt } from '@/lib/social-card'

describe('SocialCard', () => {
  test('uses the canonical north-star identity and production outcome', () => {
    const markup = renderToStaticMarkup(<SocialCard />)

    expect(socialCardAlt).toContain('AI Systems / Platform Architect')
    expect(markup).toContain('AI Systems / Platform Architect')
    expect(markup).toContain(
      'Turn AI and data capabilities into secure, deployable systems that hold up in production.'
    )
    expect(markup).not.toContain('Workflow Automation Consulting')
  })
})

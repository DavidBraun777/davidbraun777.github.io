# Architecture and evidence assets

This is the current inventory, reviewed November 2, 2026. Browser-served files
live under `public/images/projects/`; `docs/` is repository documentation and
does not automatically become a public URL.

## Published evidence

| Project | Source | What it represents |
| --- | --- | --- |
| VIFG | `public/images/projects/vifg-deployment.svg` | Deployment architecture; not a screenshot or an uptime measurement |
| Time2Move | `src/data/time2move-architecture.ts` and `src/components/site/time2move-architecture.tsx` | Historical inquiry-processing and optional review-data diagrams rendered from shared data |
| RoboReceptionist | `public/images/projects/roboreceptionist-architecture.svg` | Architecture of the bounded project; retain its current maturity label |
| NAICS Planning Engine | `public/images/projects/naics-planning-engine.svg` | Technical workflow diagram |
| StormIQ | `public/images/projects/stormiq-architecture.png` | Architecture illustration for work in progress |
| Lecture Stream Platform | `public/images/projects/lecture-stream-boundary.png` | Boundary diagram for the research audio-processing system |
| DealerFlow | `public/images/projects/dealerflow-feed.png` | Actual portrait mobile screenshot, not a deployment diagram |
| ARK Landscaping | `public/images/projects/ark-landscaping-home.webp`, `ark-landscaping-projects.webp` | Public website captures used by the client story |
| Matt Laur | `public/images/projects/matt-laur-home.webp`, `matt-laur-film.webp` | Public website captures used by the client story |

WeatherForge and RAGeATM do not currently have approved application screenshots
in this repository. Their case studies present the available technical evidence
without empty screenshot placeholders. See [TODO](../../TODO.md) for actual
missing evidence; do not mark an artifact complete merely because a caption or
planned diagram exists.

## Adding an asset

1. Use an actual capture or a diagram grounded in verified implementation. Clear
   private data, ownership and client disclosure before publication.
2. Use descriptive, lowercase, hyphenated filenames under
   `public/images/projects/`. Prefer SVG for diagrams and compressed WebP/PNG for
   real screenshots. Keep source files that contain private data outside Git.
3. Provide a useful `imageAlt` or figure alternative text plus a caption explaining
   the artifact's scope. Identify proposed or historical architecture explicitly.
4. Set the correct aspect and surface in project data. Preserve portrait mobile
   captures and use containment where cropping would hide diagram labels.
5. Check light/dark themes, phone/desktop widths, image readability and lightbox
   behavior. A screenshot's existence does not validate the claims beside it.

For MDX, the public path omits the `public` directory:

```mdx
![VIFG deployment architecture](/images/projects/vifg-deployment.svg)
```

Render code-native diagrams through existing components when interaction or
shared search text requires it. Keep diagram data and case-study narration in
sync; do not add a second handwritten copy of the same flow.

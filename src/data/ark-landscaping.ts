import type { SystemCaseStudy } from './systems'

const homepage = {
  src: '/images/projects/ark-landscaping-home.webp',
  alt: 'ARK Landscaping’s homepage shows a paver patio beside a log home, with links to request an estimate or view the company’s work.',
  width: 1440,
  height: 900,
  caption: 'The homepage offers an estimate request and a path to the project gallery.',
}

export const arkLandscaping = {
  id: 'ark-landscaping',
  name: 'ARK Landscaping — Service Business Website',
  summary:
    'I built ARK Landscaping’s website so homeowners can explore services, browse project photos, check the service area, and request an estimate.',
  positioning:
    'ARK Landscaping serves homeowners in the lakes region around Detroit Lakes, Minnesota. I built its public website so someone planning a patio, a retaining wall, or work along a shoreline can see what ARK does and describe their own property to the crew.',
  caseStudyStage: 'Production',
  currentState: 'Live client website',
  externalUrl: 'https://www.arklandscaping.net/',
  image: homepage.src,
  imageAlt: homepage.alt,
  problem: 'Give a homeowner enough detail about services, materials, and local coverage to decide whether to ask ARK for an estimate.',
  system: 'A service catalog, photo gallery, service-area guide, and estimate-request form for a local landscaping company.',
  systemHighlights: [
    'Individual service pages generated from a shared catalog.',
    'Project photography with a larger preview and a way to reveal more photos.',
    'Service-area information, direct contact links, and an estimate-request form.',
  ],
  stack: ['Astro', 'TypeScript', 'Tailwind CSS'],
  myRole: 'Website development, including the service catalog, photo gallery, and estimate-request interface.',
  coreConstraint: 'Support visitors who know the service they need and those who want to look at examples first.',
  outcome: 'Homeowners can review ARK’s work and local coverage, then call, email, or describe a project in the estimate form.',
  proofSections: [],
  story: {
    atAGlance: [
      { label: 'Client', value: 'ARK Landscaping' },
      { label: 'My role', value: 'Website development' },
      { label: 'Built with', value: 'Astro, TypeScript, and Tailwind CSS' },
    ],
    sections: [
      {
        id: 'services',
        title: 'Starting with the property',
        paragraphs: [
          'A homeowner with an eroding lake edge has a different starting point from someone comparing patio materials. The services menu groups shoreline and drainage work together and gives hardscaping its own section. Each service has a page of its own. For retaining walls, for example, a visitor can look at material options and read answers to questions about sloped sites.',
          'I used a shared catalog to generate the individual pages as static HTML with Astro. The catalog also supplies the service names for the navigation and the estimate form. Someone who reads about drainage installation can find it under the same name when they ask about work on their property.',
        ],
        figure: homepage,
      },
      {
        id: 'project-photos',
        title: 'Browsing the work in photographs',
        paragraphs: [
          'A visitor who has an idea in mind but doesn’t know what to call it can start with the project photos. The homepage and individual service pages both link to the gallery. Seeing materials in place gives a homeowner a reference for a conversation about the scale of a wall, the edge of a patio, or how planting fits around the stonework.',
          'The gallery opens with a selection of photos. Visitors can reveal more as they browse, or open one in a larger view to inspect the details. The previous and next controls let them compare neighboring images, then close the preview and continue in the grid.',
        ],
        figure: {
          src: '/images/projects/ark-landscaping-projects.webp',
          alt: 'ARK’s mobile project gallery shows a two-column grid of paved paths, stonework, and shoreline photos beneath the gallery filters.',
          width: 860,
          height: 1864,
          caption: 'On a phone, homeowners can browse the photos in two columns and open a closer view of the work.',
        },
      },
      {
        id: 'estimate',
        title: 'Checking the area and asking for an estimate',
        paragraphs: [
          'The service-area page identifies Detroit Lakes as ARK’s base and lists nearby communities, including Park Rapids and Perham. A homeowner can look up a location before writing out a request. If their town is missing, the page offers a phone link and a way to ask about it directly.',
          'The contact page brings phone, email, and the estimate form together. The form asks for a name, email address, and a description of the work. A visitor can also specify a service, a phone number, and the city or location, details that matter when discussing a site visit. The form uses a separate server endpoint to check the required fields before preparing the request for email.',
          'The finished site gives a prospective customer a public place to look at ARK’s work and choose how to start a conversation about their own project.',
        ],
      },
    ],
  },
} satisfies SystemCaseStudy

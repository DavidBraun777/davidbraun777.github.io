import type { SystemCaseStudy } from './systems'

const homepage = {
  src: '/images/projects/matt-laur-home.webp',
  alt: 'Matt Laur’s homepage shows his playing positions over a football action photo, with links to film, his résumé, and contact.',
  width: 1440,
  height: 900,
  caption: 'The homepage gives visitors immediate access to film and the résumé.',
}

export const mattLaur = {
  id: 'matt-laur',
  name: 'Matt Laur — Athlete & Coaching Website',
  summary:
    'I built a public website for professional football player and coach Matt Laur that brings together his career history, game film, résumé, and recruiting and coaching contacts.',
  positioning:
    'I built this website for Matt Laur, a professional football player and coach. A team considering Matt as a player can look up a season and watch him on the field. A program considering him as a coach can review the positions he has held and reach out about a role.',
  caseStudyStage: 'Production',
  currentState: 'Live client website',
  externalUrl: 'https://www.mattlaur.com/',
  image: homepage.src,
  imageAlt: homepage.alt,
  problem: 'Help prospective teams and coaching contacts find the parts of Matt’s career relevant to their inquiry.',
  system: 'An athlete profile with playing and coaching timelines, a filterable Film Room, a PDF résumé, and separate contact options.',
  systemHighlights: [
    'Playing and coaching experience organized by year.',
    'Shareable film selections by year, team, and content type.',
    'Résumé access and distinct recruiting and coaching contacts.',
  ],
  stack: ['Next.js', 'React', 'TypeScript'],
  myRole: 'Website development for Matt Laur',
  coreConstraint: 'Keep playing and coaching experience distinct while giving both audiences access to film, the résumé, and contact details.',
  outcome: 'Matt’s public website connects his playing and coaching record with the material a team can review before contacting him.',
  proofSections: [],
  story: {
    atAGlance: [
      { label: 'Client', value: 'Matt Laur' },
      { label: 'My role', value: 'Website development' },
      { label: 'Built with', value: 'Next.js, React, and TypeScript' },
    ],
    sections: [
      {
        id: 'career',
        title: 'Two ways into Matt’s career',
        paragraphs: [
          'The homepage introduces Matt as a wide receiver and defensive back. A scout who came to see him play can go straight to the film. Farther down the page, a snapshot of recent teams leads to his full playing history. A separate coaching snapshot leads to the roles he has held on the sideline.',
          'Both timelines group entries by year, with recent seasons first. On the playing side, the team, league, and position give context to the season’s statistics. On the coaching side, the entries pair each program with Matt’s responsibilities, such as coaching receivers or calling plays. The overview and the detailed pages draw from the same profile data, so a season can appear in both places from a single entry.',
        ],
        figure: homepage,
      },
      {
        id: 'film',
        title: 'Finding a particular piece of film',
        paragraphs: [
          'The Film Room puts featured highlights first. Each entry identifies the team and season alongside its YouTube or Hudl footage. Someone looking for a particular skill can filter by content type, such as receiving or returns, and narrow the selection by team and year. For example, choosing the Munich Rangers and returns brings up the team’s season highlights.',
          'The filter choices are part of the page address. A recruiter can send a colleague a link that opens with the same selection, without asking them to repeat the search. If the available highlights leave a question about a play or a game, the Film Room also provides a link to request more footage.',
        ],
        figure: {
          src: '/images/projects/matt-laur-film.webp',
          alt: 'The Film Room on mobile with 2023 selected and the Tollense Sharks championship highlights as the single result.',
          width: 860,
          height: 1824,
          caption: 'Selecting 2023 narrows the Film Room to Matt’s Tollense Sharks highlights.',
        },
      },
      {
        id: 'recruiting-and-coaching',
        title: 'From review to an inquiry',
        paragraphs: [
          'The recruiting pack on the homepage places the PDF résumé beside the film and contact links. A reader can open the résumé in a new tab while reviewing a season or download the same file to share with others on staff. The PDF is also available from the film and coaching pages.',
          'When a visitor is ready to get in touch, the contact page distinguishes a tryout or roster inquiry from a coaching position or training camp. Each has its own email link and an address the visitor can copy. A staff member can move from a specific season or piece of film to the relevant contact on the same public website.',
        ],
      },
    ],
  },
} satisfies SystemCaseStudy

# Urarina research-status page: provenance update review

This report supersedes the initial page-creation review and describes the current local implementation. Nothing has been deployed or pushed.

## Route and preview

- Route: `/research/urarina-hybrid-retrieval`
- [Local production preview](http://127.0.0.1:3000/research/urarina-hybrid-retrieval)
- Intended canonical: https://dbraun.io/research/urarina-hybrid-retrieval

## Files changed in this update

- `src/app/research/urarina-hybrid-retrieval/page.tsx`: linked existing metadata text and added Research lineage using existing card/link styling.
- `src/data/urarina-research.ts`: added verified public institutional/profile links and two public background records.
- `src/__tests__/pages/urarina-research.test.tsx`: expanded public-link allowlist and added prior-author attribution/current-results separation checks.
- `docs/urarina-research-status-review.md`: this updated review report.

The previous turn's index, sitemap and browser-test changes remain in the working tree; they were not modified in this update. No dependencies, public assets, shared components, unrelated pages or site configuration changed.

## Exact Research lineage copy added

### Research lineage

This research builds on earlier public work involving the preservation, digitization, and restoration of Urarina archival materials. The publications below provide background on that broader effort and were authored by other researchers; they should not be interpreted as publications authored by me or as results from the current LA-CCI research.

### Urarina Field Note Restoration Using Machine Learning and Game Play

Prior public work · 2025

Zhengyuan Feng and Michael Dorin

University of St. Thomas Research Online

Earlier work on digitization and restoration of historical Urarina field materials.

### Recovering Speech: Language Study Restoration

Prior public work · 2026

Michael Dorin, Mariana Moyano, and Mario Chong

IEEE EDUNINE 2026 · Universidad del Pacífico FacultyUP

Published work providing additional context on restoration of historical Urarina linguistic materials.

On each card, the “Prior public work” label and year precede the linked title. The section follows the existing Overview / Research context / Conference context grid and precedes Research journey. Cards sit side by side on desktop and stack on mobile.

## Existing copy modified

No existing visible wording or SEO wording was changed. The status, publication note, conference information, overview, research context and timeline are preserved.

Existing metadata text made clickable:

- University of St. Thomas: official institution homepage.
- David Braun: existing internal `/research` page.
- Prof. Michael Dorin: official UST Research Online profile.
- Full conference name: existing official LA-CCI website destination.

The original Overview occurrence of Urarina remains plain text because the requested language-profile destination failed normal HTTPS validation. The optional Research context wording change was not applied.

## Every external link: exact visible text and destination

First seven entries are in the main page content (including the duplicated conference destination). Last six are inherited footer profile links.

- [University of St. Thomas](https://www.stthomas.edu/)
- [Prof. Michael Dorin](https://researchonline.stthomas.edu/esploro/profile/michael_dorin)
- [IEEE Latin American Conference on Computational Intelligence (LA-CCI) 2026](https://lacci2026.up.edu.pe/)
- [Official LA-CCI 2026 website](https://lacci2026.up.edu.pe/)
- [Public call for papers on EasyChair](https://easychair.org/cfp/IEEE-LACCI-2026)
- [Urarina Field Note Restoration Using Machine Learning and Game Play](https://researchonline.stthomas.edu/esploro/outputs/bookChapter/Urarina-Field-Note-Restoration-Using-Machine/991015317911303691)
- [Recovering Speech: Language Study Restoration](https://faculty.up.edu.pe/en/publications/recovering-speech-language-study-restoration/)
- [GitHub](https://github.com/DavidBraun777)
- [LinkedIn](https://www.linkedin.com/in/david-braun777/)
- [ORCID](https://orcid.org/0009-0003-9821-8349)
- [Google Scholar](https://scholar.google.com/citations?user=9CqMwqMAAAAJ&hl=en)
- [ResearchGate](https://www.researchgate.net/profile/David-Braun-5)
- [AGU Profile](https://www.agu.org/user-profile?cstkey=BF392314-D7E6-40A7-ACDF-DC1318123068)

All main-content external links use `target="_blank"` and `rel="noopener noreferrer"`. The newly linked “David Braun” text is internal and resolves to `/research`.

### New external destinations

- [University of St. Thomas](https://www.stthomas.edu/)
- [Prof. Michael Dorin](https://researchonline.stthomas.edu/esploro/profile/michael_dorin)
- [Urarina Field Note Restoration Using Machine Learning and Game Play](https://researchonline.stthomas.edu/esploro/outputs/bookChapter/Urarina-Field-Note-Restoration-Using-Machine/991015317911303691)
- [Recovering Speech: Language Study Restoration](https://faculty.up.edu.pe/en/publications/recovering-speech-language-study-restoration/)

The conference metadata hyperlink is a new link instance to the already existing official destination. Both lower conference links are retained verbatim.

## Every new factual claim

1. The current research builds on earlier public work involving preservation, digitization and restoration of Urarina archival materials. This high-level relationship was explicitly supplied in the owner's brief; the linked prior records independently establish the broader subject matter.
2. The two listed publications provide background on that broader effort, were authored by other researchers, and should not be interpreted as David Braun's authored publications or results from the current LA-CCI research. The public bylines exclude David Braun; the current-work distinction follows the owner's supplied context.
3. “Urarina Field Note Restoration Using Machine Learning and Game Play” is a 2025 public work by Zhengyuan Feng and Michael Dorin, recorded in University of St. Thomas Research Online. The record classifies it as a book chapter; no false journal/conference classification was added to the card.
4. That earlier work concerns digitization and restoration of historical Urarina field materials. No technical process, evaluation or results were copied.
5. “Recovering Speech: Language Study Restoration” is a 2026 public work by Michael Dorin, Mariana Moyano and Mario Chong, associated with IEEE EDUNINE 2026 and recorded in Universidad del Pacífico FacultyUP.
6. The FacultyUP record marks that work published, and it provides context on restoring historical Urarina linguistic materials. The published label applies only to this explicitly attributed prior work.
7. The linked stthomas.edu homepage is the official University of St. Thomas site.
8. The linked Research Online profile identifies Michael Dorin and is linked from his official prior-work record.

Publication titles on cards use the capitalization requested by the owner. The FacultyUP record uses sentence case: “Recovering speech: Language study restoration”; this is a typographic difference, not a different title. The UST title's nonbreaking space is normalized to an ordinary space.

## Independent source verification

- Official University of St. Thomas homepage: verified live with normal HTTPS, HTTP 200, declared canonical; already used elsewhere in the repository.
- Michael Dorin Research Online profile: clean official profile URL returns HTTP 200; the official publication record links to it, and indexed official profile information confirms identity. The raw portal response is a JavaScript shell without a canonical tag; official indexing and the publication-to-profile link corroborate this path.
- UST field-note-restoration record: verified live, official title, authors and 2025 date match. Links to the public record, not a PDF.
- FacultyUP restoration record: verified live; exact authors, 2026 year, EDUNINE host publication and published status match. Links to the public record, without reproducing its DOI or technical details.
- Official LA-CCI site: successfully opened in the browser and still confirms the conference identity, venue and dates. Automated web retrieval returns 403, so browser rendering supplied the live check.
- Public EasyChair CFP: accessible and verified; links remain public CFP-only, with no submission URLs or identifiers.

### Source omitted

Requested destination: `https://elcat.colo.hawaii.edu/lang/1960`.

The correct Urarina record was located, but its normal HTTPS connection could not be verified. Standard HTTPS requests reported an expired certificate; the browser reported `ERR_CERT_COMMON_NAME_INVALID`. Following the owner's instruction to omit unverifiable live links, this update includes neither the inline Urarina link nor a third language-profile card. No substitute domain or broken-link placeholder was added. The remaining two cards form a balanced desktop row.

Independent public sources do not establish the current private LA-CCI submission's acceptance or its precise relationship to prior publications. Those existing acceptance statements and the requested high-level lineage relationship rely on the owner's brief; no private systems or manuscript files were accessed to verify them.

## Publication boundary

The current LA-CCI work remains accepted with presentation/publication forthcoming. Its exact manuscript title, paper destination, DOI, publication record, methods, models, metrics, statistics, figures, source code and private communications remain absent.

The original note is unchanged:

> Technical details and research results are intentionally being withheld until the conference presentation/publication process is complete. This page currently provides only high-level project context.

SEO description is unchanged:

> High-level project context for University of St. Thomas graduate research on information retrieval for a multimodal Urarina–Spanish archival collection. A resulting conference paper is accepted for IEEE LA-CCI 2026; presentation/publication forthcoming.

The existing generic social images and website metadata remain in use. Prior records are external references and were not added to David Braun's publication inventory or scholarly-article structured data.

## Validation

- ESLint passed. This repository has no configured formatter; existing formatting was followed, and git diff whitespace checks pass.
- Production build passed; the route remains statically prerendered.
- TypeScript typecheck passed.
- Vitest: 130 tests across 11 files passed, including six disclosure/attribution tests for this route.
- Four targeted Playwright tests passed: accessibility, console errors, mobile overflow, and rendered links.
- Browser desktop review at 1440 × 1000 and mobile review at 390 × 844: readable cards, clear author/source text, correct responsive stacking, no horizontal overflow; light and dark themes inspected.
- Keyboard tab navigation reaches both reference titles; visible focus styling verified. Links are ordinary keyboard-activatable anchors.
- Built HTML audited for exact external destinations, security attributes, preserved publication note and unchanged description. No public research media/downloads or private EasyChair paths introduced.
- No changes to `public/`; no unpublished research files became newly exposed.

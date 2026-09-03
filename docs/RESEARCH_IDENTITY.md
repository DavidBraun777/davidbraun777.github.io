# Research Identity and Publication Attribution

This is internal maintenance documentation. It records the identity boundary used
for publication data on `dbraun.io`; it is not intended as normal public website
copy.

## Verified website-owner identity

- Name: David J. Braun
- Publication byline: D. J. Braun
- Affiliation: Department of Physics, Augsburg University, Minneapolis, MN, USA
- Verified authored work: DOI `10.1029/2018JA025505`

The DOI-keyed allowlist in `src/data/research.ts` is the source of truth for authored
journal publications. Every rendered peer-reviewed journal work must use an
allowlisted DOI and the identity associated with that DOI. The integrity tests in
`src/__tests__/content/research-identity.test.ts` verify this boundary.

## Namesake boundary

The D. Braun affiliated with the Laboratory for Atmospheric and Space Physics
(LASP) at the University of Colorado Boulder on the earlier REPT instrument
publications is a different researcher. These works do not belong in David J.
Braun's authored-output inventory:

- DOI `10.1007/s11214-012-9950-9`
- DOI `10.1007/978-1-4899-7433-4_11`

Do not infer authorship from name matching alone. New works require DOI-level
verification of the byline and affiliation before they are added to the allowlist.

## Legitimate REPT and MagEIS context

The collaborative 2018 JGR: Space Physics study incorporated radiation-belt
observations from REPT and MagEIS aboard NASA's Van Allen Probes. The site may
describe those instruments as scientific data context for that study. It must not
imply that David J. Braun developed either instrument, belonged to an instrument
team, authored the earlier REPT instrument article or chapter, or personally
performed every analysis in the collaboration.

## External research profiles

Keep ORCID, Google Scholar, and AGU as public research-profile links, but do not
automatically import works from ORCID, Scopus, or any other name-matched index.

The previous Scopus Author ID was `57197365260`:

`https://www.scopus.com/inward/authorDetails.url?authorID=57197365260&partnerID=MN8TOARS`

That profile appears to contain an author-disambiguation merge with the unrelated
LASP researcher. It is intentionally excluded from rendered profile links, footer
links, and Person `sameAs` structured data. Do not publish a replacement ID or
restore this one until Elsevier has corrected the profile and its works have been
checked against the DOI allowlist and affiliation boundary above.

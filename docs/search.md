# Site search and stable content destinations

The header search uses a local, typed index at `/search-index.json`, generated
statically by each normal `npm run build`. It is fetched on first opening search
and reused for the browser session. No queries are sent to a search service or
recorded by this feature. A new session revalidates the index after deployment.

`src/lib/search/build-index.ts` explicitly selects public fields from the same
collections used by the site. New case studies and published MDX articles enter
search automatically. Articles marked `draft: true` or `published: false` are
excluded from both public article routes and search. Readable MDX text and headings
are extracted at build time; imports, expressions, comments, implementation code,
hidden content, and unrelated frontmatter are omitted. Résumé records use approved
metadata and destinations, without extracting PDF contents.

Page records provide broad navigation. Granular records add a `destination` with
the canonical `page`, semantic `anchor`, readable location `label`, ordered
`disclosureIds`, and an optional `fallbackAnchor`. A table row can supply `cells`
so a match in a distant column reveals that cell within its scroll container.
Only public displayed text belongs in these fields. Parent `context` qualifies a
local match without making every child match the project or article name.

`src/lib/search/destinations.ts` owns ID construction and duplicate validation.
`createProjectContent` in `project-destinations.ts` supplies both indexed records
and rendered attributes for case-study sections, narrative blocks and table cells.
Use semantic keys, scoped by section/table. An optional comparison-row `id` handles
duplicate labels; displayed method order is not identity. Never use array
positions or a separate renderer slug function. Duplicate destinations fail the
build/tests rather than silently pointing visitors to the wrong occurrence.

Published MDX uses the same `remarkContentDestinations` transform during indexing
and rendering. It anchors headings, paragraphs, list items and table rows/cells.
Text fingerprints keep blocks stable when unrelated content is inserted. Explicit
IDs resolve otherwise ambiguous repeated content; native MDX disclosures require
stable `id` attributes and render through the registered `ContentDetails` component.
Hidden nodes, executable expressions, source code and unrelated metadata remain
excluded. Changing a block's own wording can change a generated fingerprint;
use an explicit ID when a long-lived editorial link must survive those rewrites.

For a new static page, add its public overview to `static-pages.ts`. For precise
targets, build metadata once with the shared helpers, apply `destinationAttributes`
to the meaningful rendered element, and render a `ContentDestinationManifest`
outside any disclosures that may unmount their children. Add its public records
through an explicit adapter in the builder. Table targets use semantic row headers
and `data-content-table` on the horizontal overflow wrapper. Validate every declared
anchor against rendered output. Historical entries follow the same path and carry the project’s original scope and status.

Time2Move's optional sections share semantic keys in `time2move-extras.ts` with the
case-study registry. Its graph data supplies both diagrams and public search text.
The lesson indexes its static teaching copy, not inactive example selections; its
disclosure opens through the existing navigation controller. Keep supplied fixture
expectations separate from the locally computed validation results.

The existing scroll controller owns fragment navigation through
`src/lib/content-navigation.ts`. Search records intent before closing the dialog;
its close lifecycle releases navigation without restoring header focus. Disclosures
register React state callbacks, then layout readiness reveals and focuses the exact
target with sticky-header clearance and a temporary outline. Page-local manifests
support copied URLs, refresh and history without loading the search index. Escape
still restores the search trigger. Stale targets fall back to an available parent
or page heading, and observers are bounded and canceled on superseding navigation.

Ranking requires every query term and prioritizes exact titles, title phrases,
title words/prefixes, tags/headings/descriptions, then body text. Case, accents, and
whitespace are normalized while technology punctuation is retained. Short terms
match whole words; longer terms can match prefixes. The small aliases are Blog
and Articles for Writing, Projects for the Work index, and ML for Machine Learning.
Precise matches outrank aggregate body mentions, and at most three granular hits
per page keep the list compact. Destinations, including fragments, are deduplicated.
There is no fuzzy matching or added search dependency. Run the search and destination
unit tests plus `npm run e2e -- e2e/search.spec.ts e2e/search-destinations.spec.ts`
when changing search behavior or destinations.

`published-search-compatibility.test.ts` also preserves compact digests captured
from published revision `ba84b4d` before the Sonar cleanup: the full index,
destination inventory, project manifests, and representative ranked results.
Algorithm-only refactors must pass these recorded expectations unchanged. When
deliberately editing public content, review the actual old/new destination and
ranking differences before updating the affected expectations; retain explicit
compatibility for published links that need to survive. The fixture revision is
provenance, not permission to regenerate expectations from a failing implementation.

# RAGeATM repository follow-up

The portfolio now uses a qualitative comparison of retrieval methods. The older
12-level capability ladder and percentages were unsupported and are retired.
Do not copy them into a project README or treat them as evaluation results.

If separately updating the public RAGeATM repository:

- Keep its actual TF-IDF pipeline and recorded evaluation reproducible.
- State the corpus and test-set scope beside results. Seven questions returning
  expected snippets is a sanity check, not general accuracy.
- Compare lexical, dense, hybrid, reranking and generation approaches through
  their mechanisms, use cases and limitations, without a universal ordering or
  percentages of intent/human understanding.
- Distinguish implemented behavior from future experiments. Cite primary sources
  for technical claims and record measurement conditions for new results.
- Keep the portfolio's links to the real README, runner and evaluation artifacts
  valid if the repository reorganizes them.

This is a follow-up for a separate repository, not a claim that it was changed by
this portfolio update. The current portfolio source is `src/data/systems.ts`.

# Focused Game SEO

Use this pattern when studying a focused game site that ranks well. Reuse the information architecture and decision rules, not its wording, branding or unsupported assumptions about why it ranks.

The core idea is simple: make one page the clearest useful answer for one game and one player intent, then spend the index budget only on pages that add a genuinely different answer.

## What can be learned

A focused game page usually sends unusually consistent signals:

- the domain, title, H1, opening copy and body all describe the same game entity
- the opening quickly says what the game is and what the player does
- useful text is crawlable without loading the game iframe
- page language sounds like a player guide, not an internal research system
- the site starts with one strong canonical page instead of many keyword variants
- supporting routes exist only when they solve distinct player tasks

These choices improve clarity and reduce self-competition. They do not prove causation or guarantee rankings.

## What cannot be copied

Do not attribute a competitor's position to on-page text alone. Rankings may also reflect:

- exact-match or memorable domain signals
- domain history and crawl history
- backlinks and mentions
- branded searches, clicks and returning users
- launch timing, coverage gaps and query competition
- search-engine experiments or data unavailable to us

Treat those as external advantages to investigate separately, not as promises the generated site can reproduce.

## One entity, one primary intent

Before creating routes, write a one-sentence answer for each proposed page:

```text
This page helps <player> do <specific task> for <exact game>.
```

If two pages produce substantially the same sentence, merge them. Modifier variants such as `play`, `online`, `free game` and `game online` do not become separate intents merely because keyword tools list them separately.

Start with one strong homepage. Add a route only when all of these are true:

1. it serves a distinct player task
2. it has enough verified, standalone value
3. its title, H1 and opening can be materially different
4. it can receive contextual internal links
5. it deserves a unique canonical URL

## Answer early in player language

The title, H1 and first useful paragraph should make the page understandable before the player or JavaScript loads.

The opening should naturally answer:

- What is the exact game?
- What kind of game is it?
- What does the player do?
- Can it be played here, or is this a guide?
- What will this page help with?

Prefer labels players recognize, such as `Quick answer`, `How to play`, `Controls`, `Beginner tips` and `Official links`.

Do not expose internal editorial workflow as the product voice. Phrases such as `verification ledger`, `evidence state`, `source registry`, `intelligence record` or `unknown-field protocol` may be useful inside project data, but they are poor substitutes for direct player-facing copy.

Keep verified facts and uncertainty discipline behind the scenes. Present the result clearly:

```text
Confirmed: The browser demo supports keyboard controls.
Not confirmed: Mobile play has not been verified.
```

## Spend the index budget deliberately

Every route must have an explicit `indexable` decision in `open-webgame.json`.

| Page type | Default policy | Requirement |
| --- | --- | --- |
| Primary game/play/guide page | `index,follow` | Clear entity, useful answer and self-canonical |
| Distinct controls, build or mechanics guide | `index,follow` | Unique intent and substantial standalone value |
| Fully localized equivalent | `index,follow` | Localized intent, copy, metadata and reciprocal hreflang |
| Useful calculator or tool | Case by case | Must solve a distinct task and explain its inputs/output |
| Thin tool variation or duplicate language shell | `noindex,follow` | Keep accessible, omit from sitemap and do not add to hreflang clusters |
| Search, filter, preview or transient state | `noindex,follow` | Never use as a canonical landing page |
| About, privacy or operational utility page | Case by case | Index only when it has independent search/user value |

`noindex` is not a deletion instruction. A useful support page can remain accessible and linked while staying out of search results.

## Keep index signals consistent

For each route, the following signals must agree:

- `pages[].indexable`
- HTML robots meta (and `X-Robots-Tag` when used)
- canonical URL
- sitemap membership
- hreflang membership

For an indexable page:

- do not emit `noindex`
- use one self-referencing production canonical
- include the canonical URL in the sitemap
- include it in a valid reciprocal hreflang cluster when localized

For a non-indexable HTML page:

- emit `noindex,follow`
- keep a deliberate canonical policy; do not point several unrelated tools to the homepage
- omit it from the sitemap
- omit it from hreflang clusters

Do not block a `noindex` page in `robots.txt`; crawlers must be able to fetch the page to see the directive.

## Build a compact internal-link graph

The homepage should link to the most important indexable pages with descriptive anchors. Related guides should link to each other when the next step is useful.

Targets for a small game site:

- no important orphan pages
- core indexable pages reachable within two crawlable link steps
- no navigation entries created solely for keyword repetition
- no mass footer list of near-identical anchors

## Focused-page acceptance check

Before marking SEO as passed, confirm:

- [ ] one exact game entity and one primary intent are obvious
- [ ] title, H1 and opening copy agree without keyword stuffing
- [ ] the first useful section directly answers the player's need
- [ ] core content is readable outside the iframe
- [ ] every indexable route has distinct standalone value
- [ ] support/duplicate routes use `noindex,follow`
- [ ] sitemap contains every indexable canonical and no non-indexable canonical
- [ ] robots, canonical, sitemap and hreflang signals agree
- [ ] internal labels do not leak into player-facing copy
- [ ] important indexable pages are not orphaned
- [ ] ranking expectations distinguish on-page work from external authority signals

This pattern is a clarity and quality standard. Never present it as a guaranteed ranking formula.

# Open WebGame agent guide

## Purpose

Keep this repository focused on one job: turn a real game keyword or official game URL into a playable, game-native, search-ready website.

Do not broaden the project into a generic game portal, keyword-discovery system, scraper, downloader, asset mirror, ad network, authentication system, CMS or analytics suite unless the project scope is explicitly changed.

## Source of truth

- Full workflow and hard rules: `SKILL.md`
- Browser runtime discovery and embed verification: `references/iframe-verification.md`
- Mandatory On-Page SEO rules: `references/on-page-seo.md`
- Reusable page architecture: `references/site-blueprint.md`
- Final acceptance gate: `references/qa-checklist.md`
- Design derivation rules: `DESIGN.md`
- Real implementation examples: `examples/`

## Non-negotiable gates

A generated site is not deployment-ready unless all relevant gates pass.

### Game gate

- resolve the correct game entity
- verify browser/HTML5 availability when claiming browser play
- use the actual runtime URL, not an itch.io detail page
- test the runtime in a third-party iframe before designing the full site
- never present a broken or fake player as playable

### Content gate

- ground game facts in official sources or verified gameplay
- do not invent controls, codes, upgrades, characters, modes, release dates or mobile support
- only create sections/pages that answer a real player need

### Design gate

- derive the visual system again for every game
- do not ship a recolored generic gaming template
- preserve readability, accessibility and mobile usability

### On-Page SEO gate

- define primary entity and search intent before writing copy
- use unique title/meta and one clear H1
- keep meaningful crawlable content outside the iframe
- use a correct self-referencing production canonical
- avoid keyword stuffing and doorway pages
- generate production robots and sitemap when a target domain is known
- do not mark `On-Page SEO: PASS` while placeholder/staging URLs remain

## Working order

Follow this sequence unless the task explicitly changes scope:

```text
resolve game
→ verify runtime
→ define search intent
→ research mechanics + controls + visual DNA
→ derive design direction
→ build play-first site
→ implement On-Page SEO
→ responsive/performance checks
→ final QA
```

Do not start the full visual build with an unverified player when the site is supposed to be play-first.

## Contribution discipline

When changing behavior or standards:

1. update the relevant source-of-truth document
2. update `README.md` if public-facing behavior changed
3. update examples only when they remain truthful
4. keep demo/staging status explicit
5. never weaken a hard gate merely to make an example appear complete

## Safety and rights

Technical embeddability is not permission. Keep creator attribution, link official sources, avoid mirroring game binaries without authorization, and do not imply official affiliation.

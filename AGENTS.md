# Open WebGame agent guide

## Purpose

Keep this repository focused on one job: turn a real game keyword or official game URL into a playable, game-native, search-ready website.

Do not broaden the project into a generic game portal, keyword-discovery system, scraper, downloader, asset mirror, ad network, authentication system, CMS or analytics suite unless the project scope is explicitly changed.

## Source of truth

Read these in this order when relevant:

- Full workflow and hard rules: `SKILL.md`
- Zero-Config behavior: `docs/zero-config.md`
- Per-project single-source contract: `open-webgame.json` + `schema/open-webgame.schema.json`
- Project-config reference: `docs/project-config.md`
- Browser runtime discovery and embed verification: `references/iframe-verification.md`
- Mandatory On-Page SEO rules: `references/on-page-seo.md`
- Reusable page architecture: `references/site-blueprint.md`
- Final acceptance gate: `references/qa-checklist.md`
- Design derivation rules: `DESIGN.md`
- Real implementation examples: `examples/`

For a generated site, `open-webgame.json` is the project-level source of truth for game identity, canonical URL, search intent, runtime URL, design direction and readiness state. Do not let HTML, schema, sitemap or documentation silently disagree with it.

## Zero-Config default

If the user only gives a game keyword, do not ask for optional information that can be researched.

Use these defaults unless the user overrides them:

```text
Language: English
Stack: static HTML
Research: automatic
Mode: auto → play-first only after runtime verification, otherwise guide
On-Page SEO: mandatory
Responsive QA: mandatory
Output: complete website folder
Clarifying questions: only when genuinely blocked
```

Create/update `open-webgame.json` before the final build and keep it synchronized as research is resolved.

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

### Config/readiness gate

- `status.research = "resolved"` before production readiness
- `site.mode = "play-first"` only with `embed.status = "verified"`
- `status.onPageSeo = "pass"` before production readiness
- `status.blockingIssues` must be empty before production readiness
- a real HTTPS production canonical is required for `status.deploymentReady = true`

## Commands

The repository includes machine-enforced QA. Use it instead of relying on visual inspection alone.

```bash
# Bootstrap a one-keyword project
npm run init:game -- "Game Name"

# Validate the single-source config
npm run check:config -- --config path/to/open-webgame.json

# Audit On-Page SEO
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html

# Check runtime config only (no network)
npm run verify:embed:config -- --config path/to/open-webgame.json

# Check runtime reachability + framing headers
npm run verify:embed -- --config path/to/open-webgame.json

# Run all automated gates
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html

# Repository regression case
npm run qa:example
```

Automated HTTP/header embed checks do not replace a real browser boot/input/fullscreen/mobile smoke test.

## Working order

Follow this sequence unless the task explicitly changes scope:

```text
create/update open-webgame.json
→ resolve game
→ verify runtime
→ define search intent
→ research mechanics + controls + visual DNA
→ derive design direction
→ build play-first or guide site
→ implement On-Page SEO
→ run automated QA
→ browser/mobile/performance checks
→ final readiness decision
```

Do not start the full visual build with an unverified player when the site is supposed to be play-first.

## CI expectations

`.github/workflows/ci.yml` must remain green. It syntax-checks the QA scripts and runs the real Scam Artist example through the config, SEO and offline embed gates.

`.github/workflows/embed-smoke.yml` performs a live runtime reachability/header check on a schedule and can also be run manually.

Do not weaken a hard gate just to make CI green. Fix the example or the underlying implementation.

## Contribution discipline

When changing behavior or standards:

1. update the relevant source-of-truth document
2. update `README.md` if public-facing behavior changed
3. update config/schema when the project contract changed
4. update automated QA when a rule can be enforced mechanically
5. update examples only when they remain truthful
6. keep demo/staging status explicit
7. never weaken a hard gate merely to make an example appear complete

## Safety and rights

Technical embeddability is not permission. Keep creator attribution, link official sources, avoid mirroring game binaries without authorization, and do not imply official affiliation.

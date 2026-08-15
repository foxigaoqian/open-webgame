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
- Multilingual SEO behavior: `docs/multilingual.md`
- Machine/browser quality gates: `docs/quality-gates.md`
- Browser runtime discovery and embed verification: `references/iframe-verification.md`
- Mandatory On-Page SEO rules: `references/on-page-seo.md`
- Reusable page architecture: `references/site-blueprint.md`
- Final acceptance gate: `references/qa-checklist.md`
- Design derivation rules: `DESIGN.md`
- Real implementation examples: `examples/`

For a generated site, `open-webgame.json` is the project-level source of truth for game identity, canonical URL, languages, search intent, runtime URL, design direction and readiness state. Do not let HTML, schema, sitemap or documentation silently disagree with it.

## Zero-Config default

If the user only gives a game keyword, do not ask for optional information that can be researched.

Use these defaults unless the user overrides them:

```text
Language: English
Multilingual: off unless requested
Stack: static HTML
Research: automatic
Mode: auto → play-first only after runtime verification, otherwise guide
On-Page SEO: mandatory
Content provenance: mandatory
Least-privilege iframe permissions: mandatory
Responsive QA: mandatory
Browser identity / favicon: mandatory
Accessibility QA: mandatory
Performance QA: mandatory before first production launch
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
- record material factual claims in `claims[]` and connect them to `sources[]`
- do not invent controls, codes, upgrades, characters, modes, release dates or mobile support
- only create sections/pages that answer a real player need

### Design gate

- derive the visual system again for every game
- do not ship a recolored generic gaming template
- preserve readability, accessibility and mobile usability
- use real generated-site screenshots for showcase/QA evidence; do not present fake promotional UI as product output

### On-Page SEO gate

- define primary entity and search intent before writing copy
- use unique title/meta and one clear H1
- keep meaningful crawlable content outside the iframe
- use a correct self-referencing production canonical
- avoid keyword stuffing and doorway pages
- generate production robots and sitemap when a target domain is known
- informative images need meaningful alt text
- decorative images should use `alt=""`; omitting the `alt` attribute entirely is a failure
- do not mark `On-Page SEO: PASS` while placeholder/staging URLs remain

### Multilingual SEO gate

Only enable multilingual output when requested or explicitly justified.

When `i18n.enabled = true`:

- research/localize search intent per language; do not mechanically translate English keyword copy
- create real crawlable locale routes
- every indexable locale page must declare `language` and `translationKey` in `pages[]`
- every translation cluster needs reciprocal hreflang entries including itself
- include a correct `x-default`
- every locale page self-canonicalizes; never canonicalize all locales to English
- provide a visible keyboard-accessible language switcher
- prefer switching to the corresponding page in the same `translationKey`
- generate multilingual sitemap alternates
- run `check:i18n` as a hard gate

### Browser identity gate

- generate a real `favicon.ico` and real 32x32 PNG favicon
- declare both statically in every locale page `<head>`
- never rely on JavaScript favicon injection
- nested locale paths must resolve to the correct icon assets
- Browser QA validates icon declarations, MIME and file signatures
- live HTTP QA validates production favicon URLs

### Config/readiness gate

- config must pass strict AJV schema validation; unknown/misspelled properties are errors
- `status.research = "resolved"` before production readiness
- `site.mode = "play-first"` only with `embed.status = "verified"`
- `status.onPageSeo = "pass"` before production readiness
- `status.blockingIssues` must be empty before production readiness
- a real HTTPS `site.origin` plus normalized `site.basePath` must resolve to the configured production canonical
- do not claim readiness merely to silence a failing gate; require a passing commit-bound `qa:release` artifact

### Browser/accessibility/performance gate

Before first production launch:

- Browser QA must run at approximately 1440 / 768 / 390 widths
- favicon declarations/resources must pass on required locale shells
- lazy game loading must assign the configured runtime
- a real child frame must navigate to the runtime origin
- Reload must prove a fresh child-frame navigation cycle when the site offers Reload
- serious/critical axe WCAG 2 A/AA violations in the host shell are hard failures
- screenshots and axe reports should be preserved as CI artifacts
- Lighthouse must pass configured shell thresholds, including CLS
- third-party game iframe DOM is not scored as if Open WebGame owns it; the host shell still must be accessible

## Commands

The repository includes machine-enforced QA. Use it instead of relying on visual inspection alone.

```bash
# Bootstrap a one-keyword project
npm run init:game -- "Game Name"

# Bootstrap a multilingual project
npm run init:game -- "Game Name" --languages en,ja,ko

# Install QA dependencies
npm ci

# Validate strict schema + semantic config rules
npm run check:config -- --config path/to/open-webgame.json

# Verify source-backed claims
npm run check:content -- --config path/to/open-webgame.json

# Verify page architecture
npm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site

# Verify hreflang/x-default/multilingual page relationships
npm run check:i18n -- --config path/to/open-webgame.json --site-dir path/to/site

# Audit On-Page SEO
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html

# Check iframe/link security
npm run check:security -- --config path/to/open-webgame.json --html path/to/index.html

# Check canonical/OG/sitemap URLs live
npm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site

# Check runtime config only (no network)
npm run verify:embed:config -- --config path/to/open-webgame.json

# Check runtime reachability + framing headers
npm run verify:embed -- --config path/to/open-webgame.json

# Deterministic regression tests
npm test

# Run non-browser gates offline
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html --offline

# Run live non-browser gates
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html

# Real browser + axe QA
npx playwright install chromium
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site

# Lighthouse shell QA
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site

# Final release-readiness decision (live + browser/axe + Lighthouse)
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site

# Repository regression case
npm run qa:example
```

Automated HTTP/header embed checks do not replace a real browser boot/input/fullscreen/mobile smoke test.

## v0.3 production requirements

In addition to the existing game/content/design/SEO gates:

- record official research inputs in `sources[]`
- connect material factual statements to source-backed `claims[]`
- reject deployment-ready status when a tracked claim is pending or rejected
- define intentional routes in `pages[]` before adding multi-page output
- keep indexable page intents distinct and avoid orphan pages
- enforce least-privilege iframe capabilities from `security.allowedIframePermissions`
- run `check:content`, `check:site` and `check:security` as hard gates
- run Playwright browser QA before first production launch
- preserve real desktop/tablet/mobile screenshots as QA evidence when CI is available

## v0.3.1 quality requirements

- strict AJV Schema is authoritative for config shape; do not rely on permissive unknown fields
- keep pass/fail regression fixtures for machine-enforced rules
- use `check:http` before launch so correct-looking canonical/OG/sitemap markup cannot hide dead URLs
- when multilingual, run `check:i18n` and keep translation groups complete
- run axe as part of Browser QA and fix serious/critical host-shell violations
- prove the actual runtime child frame boots, not just that an iframe `src` string exists
- generate and statically declare real PNG + ICO favicons and keep favicon QA green
- run Lighthouse before first production launch and fix hard-threshold failures rather than lowering the threshold to hide regressions
- use `qa:release` for the final deployment-ready decision; `npm run qa` alone is not sufficient

## v0.3.3 reliability requirements

- use `site.origin` (scheme + host only) plus `site.basePath`; never mix a deployment path into a domain/origin field
- derive and validate every page canonical from the shared URL model
- every tracked claim declares `volatility`; volatile claims require `maxAgeDays` and fresh supporting `sources[].retrievedAt`
- use the committed `package-lock.json`, `npm ci` and the high-severity dependency audit gate
- do not store or manually toggle `status.deploymentReady`
- final readiness comes only from `qa:release`, which writes `qa-artifacts/release-qa.json` bound to the tested commit SHA


## Working order

Follow this sequence unless the task explicitly changes scope:

```text
create/update open-webgame.json
→ strict-schema validation
→ resolve game + sources + claims
→ verify runtime
→ define search intent + page architecture
→ define locales when requested
→ research mechanics + controls + visual DNA
→ derive design direction
→ build play-first or guide site
→ generate static favicon/browser identity assets
→ implement On-Page + multilingual SEO
→ run regression + static/live gates
→ browser + axe QA
→ Lighthouse QA
→ qa:release
→ final readiness decision
```

Do not start the full visual build with an unverified player when the site is supposed to be play-first.

## CI expectations

`.github/workflows/ci.yml` must remain green. It installs QA dependencies, syntax-checks scripts, runs regression tests and sends the real Scam Artist example through deterministic hard gates.

`.github/workflows/browser-qa.yml` must remain green. It runs Playwright + axe against the real example, verifies runtime child-frame behavior, runs Lighthouse and uploads quality artifacts.

`.github/workflows/embed-smoke.yml` performs a live runtime reachability/header check on a schedule and can also be run manually.

Do not weaken a hard gate just to make CI green. Fix the example, the test, or the underlying implementation.

## Contribution discipline

When changing behavior or standards:

1. update the relevant source-of-truth document
2. update `README.md` if public-facing behavior changed
3. update config/schema when the project contract changed
4. update automated QA when a rule can be enforced mechanically
5. add or update pass/fail regression coverage
6. update examples only when they remain truthful
7. keep demo/staging status explicit
8. never weaken a hard gate merely to make an example appear complete

## Safety and rights

Technical embeddability is not permission. Keep creator attribution, link official sources, avoid mirroring game binaries without authorization, and do not imply official affiliation.

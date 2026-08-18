<h1 align="center">Open WebGame</h1>

<p align="center">
  Turn a game keyword into a <strong>playable, game-native, search-ready website</strong>.
</p>

<p align="center">
  <a href="https://foxigaoqian.github.io/open-webgame/"><strong>Live Demo</strong></a> ·
  <a href="./examples/scam-artist-site/index.html">Example Source</a> ·
  <a href="./SKILL.md">Skill Docs</a> ·
  <a href="./references/on-page-seo.md">SEO Standard</a> ·
  <a href="./docs/zero-config.md">Zero Config</a> ·
  <a href="./docs/multilingual.md">Multilingual</a> ·
  <a href="./docs/quality-gates.md">Quality Gates</a>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="./SKILL.md"><img src="https://img.shields.io/badge/agent-SKILL.md-111111.svg" alt="Agent Skill" /></a>
  <a href="./references/on-page-seo.md"><img src="https://img.shields.io/badge/SEO-On--Page%20Gate-2ea44f.svg" alt="On-Page SEO Gate" /></a>
  <a href="./references/iframe-verification.md"><img src="https://img.shields.io/badge/player-HTML5%20embed-f59e0b.svg" alt="HTML5 Embed" /></a>
</p>

[![Real Open WebGame generated first screen](./assets/scam-artist-real-first-screen.jpg)](https://foxigaoqian.github.io/open-webgame/)

<p align="center"><em>Real first-screen capture from the Scam Artist example — not a generated product mockup.</em></p>

Open WebGame is an open-source **agent skill and production workflow** for building play-first game websites from a game keyword or official game URL.

It resolves the real game first, verifies a real browser runtime when one exists, records source-backed facts, studies the game's mechanics and visual language, defines search intent, and then generates a site designed specifically for that game.

> A polished UI is not enough. Broken gameplay, unsourced facts, failed SEO, failed accessibility or failed browser QA means the project is **not deployment-ready**.

## Features

- **One-keyword start** — the agent can begin from only a game name and research the rest.
- **Real game research** — resolve the canonical game, developer, current status, mechanics, controls and official sources before writing content.
- **Source-backed claims** — material factual content is connected to `sources[]` and `claims[]` instead of living only in prompt prose.
- **Real HTML5 embed verification** — find and test the actual browser runtime instead of putting an itch.io project detail page in an iframe.
- **Game-native visual design** — derive palette, typography mood, cards, borders, shadows, texture and interaction style from the current game.
- **Play-first architecture** — put the game near the top when embedding is verified, with lazy load, reload, fullscreen and official fallback behavior.
- **Mandatory On-Page SEO** — search intent, title, H1, canonical, metadata, internal links, structured data, images, robots and sitemap are hard QA requirements.
- **Focused index strategy** — start with one strong game page; index only distinct, standalone player intents and keep support/duplicate routes out of sitemap and hreflang clusters.
- **Real multilingual SEO** — optional localized routes, reciprocal hreflang, x-default, locale canonicals and multilingual sitemap validation.
- **Strict project schema** — AJV rejects unknown or misspelled configuration fields.
- **Browser + accessibility QA** — Playwright runs desktop/tablet/mobile, verifies the real runtime child frame, runs axe and saves real screenshots/reports.
- **Performance QA** — Lighthouse evaluates the lazy-loaded site shell and enforces minimum quality thresholds.
- **Browser identity QA** — every production site ships real PNG + ICO favicons; Browser QA and live HTTP QA verify declarations, MIME types and file validity.
- **Release readiness** — `qa:release` is the only aggregate command allowed to return `Deployment-ready: YES`.
- **No fake features** — never invent controls, codes, upgrades, release dates, mobile support, leaderboards or game systems to fill SEO copy.

## v0.3.2 — Browser Identity + Release Readiness

v0.3.2 closes two production gaps found while testing the live multilingual case.

New hardening:

```text
Static favicon.ico + favicon-32x32.png
Favicon HTTP / MIME / binary-signature QA
Production favicon URL checks
Least-privilege iframe example
Non-browser QA no longer claims final readiness
qa:release = live gates + Browser/axe + Lighthouse
```

Final production decision:

```bash
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

Only the full release aggregate may report `Deployment-ready: YES`.

## v0.3.3 — Reliability Hardening

v0.3.3 closes the remaining configuration/readiness drift gaps:

```text
origin + basePath canonical model
source-backed volatile-claim freshness windows
committed package-lock + npm ci + high-severity dependency audit
commit-bound qa-artifacts/release-qa.json
```

A GitHub Pages-style deployment is represented as:

```json
{
  "origin": "https://username.github.io",
  "basePath": "/game-site",
  "canonical": "https://username.github.io/game-site/"
}
```

Final readiness is no longer stored as a manually editable project boolean. `npm run qa:release` computes the result and records the tested commit SHA and timestamp in the release artifact.

The dependency audit performed during this upgrade also exposed high-severity transitive findings in the old Lighthouse 12 toolchain; the QA stack was upgraded to Lighthouse 13.4.1 instead of weakening the audit threshold.


## v0.3.1 — Quality Gates + Multilingual SEO

v0.3.1 turns more production expectations into executable tests.

New quality enforcement:

```text
Strict AJV Schema
Regression fixtures
Live canonical / OG / sitemap HTTP checks
Decorative alt="" regression coverage
axe WCAG 2 A/AA host-shell checks
Real child-frame runtime boot verification
Reload navigation verification
Lighthouse mobile-shell QA
```

New multilingual contract:

```text
i18n.enabled
defaultLanguage
xDefaultLanguage
languages[]
pages[].language
pages[].translationKey
hreflang
x-default
multilingual sitemap alternates
```

Bootstrap a multilingual project directly:

```bash
npm run init:game -- "Game Name" --languages en,ja,ko
```

The CLI only creates the project contract. The agent must still research and generate useful localized content and every configured route before `check:i18n` can pass.

New commands:

```bash
npm test
npm run check:i18n -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site
```

See [`docs/multilingual.md`](./docs/multilingual.md), [`docs/quality-gates.md`](./docs/quality-gates.md) and [`CHANGELOG.md`](./CHANGELOG.md).

## v0.3 — Production Engine

Open WebGame v0.3 moved production rules out of prompt prose and into machine-checkable project state.

Production contracts:

- `sources[]` + `claims[]` — connect important factual content to recorded sources
- `pages[]` — define distinct routes, intents, files, canonicals and indexability
- `security` — declare the iframe capabilities the site is allowed to request
- Playwright Browser QA — boot the real generated page at desktop/tablet/mobile widths and save real screenshots

Core gates:

```bash
npm run check:content -- --config path/to/open-webgame.json
npm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:security -- --config path/to/open-webgame.json --html path/to/index.html
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
```

## v0.2 — Zero-Config + Machine-Enforced QA

Open WebGame added an engineering layer in addition to the agent instructions. A generated project keeps one `open-webgame.json` as its single source of truth, and the repository can fail builds when core config, On-Page SEO or embed rules are broken.

If you only have a game name, that is enough to start:

```text
Scam Artist
```

Optional local bootstrap:

```bash
npm run init:game -- "Scam Artist"
```

## Live Case

### Scam Artist

The repository includes a real site produced while validating the workflow.

**Live demo:** https://foxigaoqian.github.io/open-webgame/

**Source:** [`examples/scam-artist-site/index.html`](./examples/scam-artist-site/index.html)

**Case study:** [`examples/scam-artist.md`](./examples/scam-artist.md)

The case demonstrates:

- real itch.io-hosted HTML5 runtime
- lazy-loaded game player
- reload + fullscreen controls
- custom visual treatment based on the game
- crawlable How to Play / Tips / FAQ content outside the iframe
- source-backed project facts
- least-privilege iframe permissions
- responsive layout
- structured data and SEO foundations
- real Browser QA evidence

The live Scam Artist case is deployed in **English, Japanese and Korean**, with separate indexable locale routes and a visible dropdown language switcher.

## Quick Start

Clone the repository and use [`SKILL.md`](./SKILL.md) as the agent instruction file:

```bash
git clone https://github.com/foxigaoqian/open-webgame.git
cd open-webgame
npm ci
```

Minimum user input:

```text
Goblincremental
```

Or bootstrap a local project contract:

```bash
npm run init:game -- "Goblincremental"
```

Multilingual bootstrap:

```bash
npm run init:game -- "Goblincremental" --languages en,ja,ko
```

Recommended richer input when known:

```text
Game keyword: Goblincremental
Official URL: https://dogwater-games.itch.io/goblincremental
Target domain: example.com
Preferred stack: static HTML | Next.js | Astro
Languages: en, ja, ko
Deployment target: Cloudflare | Vercel | GitHub Pages
```

## How It Works

```text
Game keyword / official URL
        ↓
Create strict project config
        ↓
Resolve the real game entity + official sources
        ↓
Record source-backed factual claims
        ↓
Confirm HTML5 / browser availability
        ↓
Find and test the actual runtime iframe
        ↓
Define search intent + page architecture
        ↓
Define locale architecture when requested
        ↓
Research mechanics, controls, screenshots and terminology
        ↓
Extract visual DNA
        ↓
Design a game-native play-first or guide site
        ↓
Generate real static favicon/browser identity assets
        ↓
Implement On-Page + multilingual SEO
        ↓
Static + live HTTP gates
        ↓
Playwright + axe + real runtime-frame QA
        ↓
Lighthouse QA
        ↓
Deployment-ready decision
```

### Critical iframe rule

An itch.io project page is **not** the game runtime.

Wrong:

```html
<iframe src="https://developer.itch.io/game-name"></iframe>
```

A real itch-hosted HTML5 runtime may look like:

```text
https://html-classic.itch.zone/html/<build-id>/index.html?v=...
https://html-classic.itch.zone/html/<build-id>/web/index.html?v=...
```

If an official page shows `Run game` + `HTML5` but a text parser does not expose the iframe URL, keep investigating the rendered player, page source or browser network requests.

See [`references/iframe-verification.md`](./references/iframe-verification.md).

## On-Page SEO Gate

On-Page SEO is a **hard deployment requirement**, not optional polish.

Every production build should define:

```text
Primary entity: <exact game name>
Primary query intent: play | guide | controls | wiki | mixed
Primary keyword: <natural main query>
Secondary intents: <real supporting queries>
Canonical page purpose: <one sentence>
```

A production page must then pass checks for:

- unique descriptive title + meta description
- one clear H1 that identifies the game/topic
- useful opening content outside the iframe
- logical heading hierarchy
- self-referencing production canonical
- natural topic/entity coverage without keyword stuffing
- meaningful alt text for informative images
- `alt=""` for decorative images; never omit the alt attribute entirely
- crawlable internal links with no orphan pages
- accurate Open Graph metadata
- accurate structured data only where justified
- no accidental `noindex`
- production `robots.txt`
- production `sitemap.xml`
- exact agreement between declared indexability, page robots directives and sitemap membership
- mobile usability + performance readiness

See [`references/on-page-seo.md`](./references/on-page-seo.md), [`references/focused-game-seo.md`](./references/focused-game-seo.md) and [`references/qa-checklist.md`](./references/qa-checklist.md).

## Multilingual SEO

When multiple languages are requested, Open WebGame creates separate crawlable routes instead of adding a client-side translation button.

Each translation group should have:

- localized search intent and copy
- localized title/meta/H1
- self canonical for every locale
- reciprocal hreflang including itself
- `x-default`
- equivalent-page language switching
- multilingual sitemap alternates

See [`docs/multilingual.md`](./docs/multilingual.md).

## Quality Gates

Deterministic checks:

```bash
npm test
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html --offline
```

Live production URL/embed checks:

```bash
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html
```

First-launch browser/accessibility/performance checks:

```bash
npx playwright install chromium
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site
```

Final release-readiness decision:

```bash
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

`npm run qa` covers non-browser gates only. It must not be treated as the final deployment-ready decision.

See [`docs/quality-gates.md`](./docs/quality-gates.md).

## Output Contract

A completed run should report:

```text
Game: Example Game
Embed: VERIFIED
Languages: en, ja, ko
Primary intent: play + beginner guide
Primary keyword/entity: Example Game
On-Page SEO: PASS
Multilingual SEO: PASS
Browser QA: PASS
Accessibility: PASS
Lighthouse: PASS
Favicon: PASS
Release QA: PASS
Canonical: https://examplegame.com/
Design direction: pixel-art management / dark resource UI
Pages: /, /ja/, /ko/
Deployment-ready: YES
Blocking issues: none
```

If any relevant hard gate fails, `Deployment-ready` must be `NO`.

## Repository Structure

```text
open-webgame/
├── README.md
├── SKILL.md
├── AGENTS.md
├── DESIGN.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── package.json
├── package-lock.json
├── LICENSE
├── schema/
│   └── open-webgame.schema.json
├── starter/
│   └── open-webgame.example.json
├── scripts/
│   ├── init.mjs
│   ├── schema-validator.mjs
│   ├── check-config.mjs
│   ├── content-audit.mjs
│   ├── site-audit.mjs
│   ├── i18n-audit.mjs
│   ├── seo-audit.mjs
│   ├── security-audit.mjs
│   ├── http-audit.mjs
│   ├── verify-embed.mjs
│   ├── browser-qa.mjs
│   ├── lighthouse-qa.mjs
│   ├── qa.mjs
│   ├── release-qa.mjs
│   └── release-qa.mjs
├── tests/
│   ├── fixtures/
│   └── quality-gates.test.mjs
├── docs/
│   ├── zero-config.md
│   ├── project-config.md
│   ├── multilingual.md
│   └── quality-gates.md
├── references/
│   ├── iframe-verification.md
│   ├── on-page-seo.md
│   ├── site-blueprint.md
│   └── qa-checklist.md
└── examples/
    ├── goblincremental.md
    ├── scam-artist.md
    └── scam-artist-site/
        ├── open-webgame.json
        ├── robots.txt
        ├── sitemap.xml
        ├── README.md
        └── index.html
```

## Design Principle

> **Repeat the information architecture. Do not repeat the visual design.**

A cute pet game, a perspective challenge, a goblin incremental game and a dark pixel-art idle game should not look like recolored copies of the same template.

See [`DESIGN.md`](./DESIGN.md).

## Responsible Use

Technical embeddability is not the same as permission.

Before production use:

- check creator/host terms and asset usage expectations
- credit the creator and link the official game page
- make unofficial status clear when appropriate
- do not mirror or redistribute game binaries without authorization
- do not imply endorsement, ownership or official affiliation

## Contributing

Contributions are welcome. Keep changes focused and preserve the hard gates: real game facts, real embed verification, game-native design, On-Page SEO, accessibility, performance and final QA.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

Licensed under the [MIT License](./LICENSE).

<h1 align="center">Open WebGame</h1>

<p align="center">
  Turn a game keyword into a <strong>playable, game-native, search-ready website</strong>.
</p>

<p align="center">
  <a href="https://foxigaoqian.github.io/open-webgame/"><strong>Live Demo</strong></a> ·
  <a href="./examples/scam-artist-site/index.html">Example Source</a> ·
  <a href="./SKILL.md">Skill Docs</a> ·
  <a href="./references/on-page-seo.md">SEO Standard</a> ·
  <a href="./docs/zero-config.md">Zero Config</a>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="./SKILL.md"><img src="https://img.shields.io/badge/agent-SKILL.md-111111.svg" alt="Agent Skill" /></a>
  <a href="./references/on-page-seo.md"><img src="https://img.shields.io/badge/SEO-On--Page%20Gate-2ea44f.svg" alt="On-Page SEO Gate" /></a>
  <a href="./references/iframe-verification.md"><img src="https://img.shields.io/badge/player-HTML5%20embed-f59e0b.svg" alt="HTML5 Embed" /></a>
</p>

[![Real Open WebGame generated first screen](./assets/scam-artist-real-first-screen.jpg)](https://foxigaoqian.github.io/open-webgame/)

<p align="center"><em>Real 2048px first-screen capture from the Scam Artist example — not a generated product mockup.</em></p>

Open WebGame is an open-source **agent skill and production workflow** for building play-first game websites from a game keyword or official game URL.

It resolves the real game first, verifies a real browser runtime when one exists, studies the game's mechanics and visual language, defines search intent, and then generates a site designed specifically for that game.

> A polished UI is not enough. A broken player or a failed On-Page SEO Gate means the project is **not deployment-ready**.

## Features

- **Real game research** — resolve the canonical game, developer, current status, mechanics, controls and official sources before writing content.
- **Real HTML5 embed verification** — find and test the actual browser runtime instead of putting an itch.io project detail page in an iframe.
- **Game-native visual design** — derive palette, typography mood, cards, borders, shadows, texture and interaction style from the current game.
- **Play-first architecture** — put the game near the top when embedding is verified, with reload, fullscreen and official fallback behavior.
- **Mandatory On-Page SEO** — search intent, title, H1, opening copy, canonical, metadata, internal links, structured data, images, robots and sitemap are part of the hard QA gate.
- **Useful supporting content** — How to Play, controls, tips, progression, FAQ and additional pages only when they match real player intent.
- **Responsive + performance QA** — desktop, tablet, mobile, iframe usability and page performance must be checked.
- **No fake features** — never invent controls, codes, upgrades, release dates, mobile support, leaderboards or game systems to fill SEO copy.

## v0.3 — Production Engine

Open WebGame v0.3 moves another set of production rules out of prompt prose and into machine-checkable project state.

New production contracts:

- `sources[]` + `claims[]` — connect important factual content to recorded sources
- `pages[]` — define distinct routes, intents, files, canonicals and indexability
- `security` — declare the iframe capabilities the site is allowed to request
- Playwright Browser QA — boot the real generated page at desktop/tablet/mobile widths and save real screenshots

New gates:

```bash
npm run check:content -- --config path/to/open-webgame.json
npm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:security -- --config path/to/open-webgame.json --html path/to/index.html
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
```

The aggregate non-browser QA now checks config, provenance, page architecture, On-Page SEO, security and embed state. First production launch additionally requires the Playwright browser run.

See [`docs/project-config.md`](./docs/project-config.md) and [`CHANGELOG.md`](./CHANGELOG.md).

## v0.2 — Zero-Config + Machine-Enforced QA

Open WebGame now has an engineering layer in addition to the agent instructions. A generated project should keep one `open-webgame.json` as its single source of truth, and the repository can fail builds when core config, On-Page SEO or embed rules are broken.

If you only have a game name, that is enough to start:

```text
Scam Artist
```

Agent default: research the real game automatically, verify the real browser runtime, choose play-first or guide mode, derive the visual system, generate the site, then run hard QA.

Optional local bootstrap:

```bash
npm run init:game -- "Scam Artist"
```

Automated gates:

```bash
npm run check:config -- --config path/to/open-webgame.json
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
npm run verify:embed -- --config path/to/open-webgame.json
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html
```

See [`docs/zero-config.md`](./docs/zero-config.md), [`docs/project-config.md`](./docs/project-config.md) and [`CHANGELOG.md`](./CHANGELOG.md).

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
- responsive layout
- structured data and SEO foundations

The repository demo is a showcase deployment. A production project should still replace demo/staging configuration with the real target domain and pass the full production SEO gate.

> GitHub Pages deployment is included in `.github/workflows/pages.yml`. If the Live Demo URL is still 404, enable **Settings → Pages → Source: GitHub Actions** once; subsequent pushes deploy automatically.

## Quick Start

Clone the repository and use [`SKILL.md`](./SKILL.md) as the agent instruction file:

```bash
git clone https://github.com/foxigaoqian/open-webgame.git
cd open-webgame
```

Minimum input:

```text
Game keyword: Goblincremental
```

Recommended input:

```text
Game keyword: Goblincremental
Official URL: https://dogwater-games.itch.io/goblincremental
Target domain: example.com
Preferred stack: static HTML | Next.js | Astro
Language: English
Deployment target: Cloudflare | Vercel | GitHub Pages
```

## How It Works

```text
Game keyword / official URL
        ↓
Resolve the real game entity
        ↓
Confirm HTML5 / browser availability
        ↓
Find the actual runtime iframe
        ↓
Test third-party embedding
        ↓
Define primary + secondary search intent
        ↓
Research mechanics, controls, screenshots and terminology
        ↓
Extract visual DNA
        ↓
Design a game-native play-first website
        ↓
Add useful crawlable content outside the iframe
        ↓
Implement On-Page SEO + robots + sitemap
        ↓
Game + Design + Content + SEO + Mobile + Performance QA
        ↓
Deploy
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
- logical H2/H3 hierarchy
- self-referencing production canonical
- natural topic/entity coverage without keyword stuffing
- meaningful image alt text + stable dimensions
- crawlable internal links with no orphan pages
- accurate Open Graph metadata
- accurate structured data only where justified
- no accidental `noindex`
- production `robots.txt`
- production `sitemap.xml`
- mobile usability + performance readiness

See [`references/on-page-seo.md`](./references/on-page-seo.md) and [`references/qa-checklist.md`](./references/qa-checklist.md).

## Output Contract

A completed run should report:

```text
Game: Example Game
Embed: VERIFIED
Primary intent: play + beginner guide
Primary keyword/entity: Example Game
On-Page SEO: PASS
Canonical: https://examplegame.com/
Design direction: pixel-art management / dark resource UI
Pages: /, /how-to-play/, /tips/
Deployment-ready: YES
Blocking issues: none
```

If the embed fails or On-Page SEO fails, `Deployment-ready` must be `NO`.

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
├── LICENSE
├── schema/
│   └── open-webgame.schema.json
├── starter/
│   └── open-webgame.example.json
├── scripts/
│   ├── init.mjs
│   ├── check-config.mjs
│   ├── seo-audit.mjs
│   ├── verify-embed.mjs
│   └── qa.mjs
├── docs/
│   ├── zero-config.md
│   └── project-config.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
│       ├── ci.yml
│       ├── embed-smoke.yml
│       ├── pages.yml
│       └── convert-readme-preview.yml
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

Contributions are welcome. Keep changes focused and preserve the hard gates: real game facts, real embed verification, game-native design, On-Page SEO and final QA.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

Licensed under the [MIT License](./LICENSE).

# Open WebGame

Open-source agent skill for turning a **game keyword** into a researched, game-native, play-first website that can actually be deployed.

The core workflow is:

```text
Game keyword
  → resolve the real game
  → verify browser playability
  → find the real HTML5 runtime iframe
  → test third-party embedding
  → define search intent
  → study mechanics + visual DNA
  → generate a game-native website
  → implement On-Page SEO
  → responsive + player + SEO QA
  → deploy
```

This project was created from a practical workflow tested on browser games such as **Goblincremental** and **Scam Artist**.

A beautiful landing page is not enough. A build fails if the player is broken **or** if the production page fails the On-Page SEO Gate.

## What makes this different

Open WebGame is **not** a fixed visual template and it is **not** a keyword research tool.

It provides a reusable production workflow while requiring the design system, content and search intent to be derived again for every game.

> Repeat the information architecture. Do not repeat the visual design.

A cute pet game, a perspective drawing challenge, a goblin incremental game and a dark pixel-art idle game should not look like recolored copies of one another.

## Minimum input

```text
Game keyword: Goblincremental
```

Preferred inputs:

```text
Official URL: https://...
Target domain: example.com
Preferred stack: static HTML | Next.js | Astro
Language: English
Deployment target: Cloudflare | Vercel | GitHub Pages
```

A final production domain is important because a build cannot pass the production SEO gate while its canonical URL is still unresolved.

## What the skill should produce

1. Resolved game identity and official sources
2. Browser/HTML5 availability check
3. Real runtime iframe URL when available
4. Third-party embed verification result
5. Search-intent brief
6. Game mechanics / controls / visual research brief
7. Game-specific visual direction
8. Play-first page architecture
9. Deployable responsive site code
10. Complete On-Page SEO implementation
11. `robots.txt` + `sitemap.xml` for production
12. Attribution/disclosure
13. Final QA result

Example completion summary:

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

# Mandatory On-Page SEO

On-Page SEO is a **hard deployment gate**.

See the full standard:

- [`references/on-page-seo.md`](./references/on-page-seo.md)
- [`references/qa-checklist.md`](./references/qa-checklist.md)

At minimum, a production page must have:

- a unique descriptive title
- a useful meta description
- a homepage H1 that clearly identifies the game/topic
- logical H2/H3 structure
- a correct self-referencing production canonical
- meaningful crawlable content outside the iframe
- accurate Open Graph metadata
- accurate structured data only when justified
- meaningful image alt text and stable image dimensions
- crawlable internal links
- no keyword stuffing or doorway pages
- no accidental `noindex`
- production `robots.txt`
- production `sitemap.xml`
- mobile and performance readiness

A pure slogan is not enough as the homepage H1. For example:

```html
<h1>Play Scam Artist Online <span>Build a Shady Empire</span></h1>
```

is stronger than:

```html
<h1>BUILD A SHADY EMPIRE</h1>
```

because it clearly identifies the page entity and intent while preserving the game's voice.

The game name should be used naturally in important page signals. Open WebGame does **not** use fixed keyword-density targets.

## Full generated example

A complete generated site is included here:

- [`examples/scam-artist-site/index.html`](./examples/scam-artist-site/index.html)
- [`examples/scam-artist-site/README.md`](./examples/scam-artist-site/README.md)

This is the actual Scam Artist build produced while validating the workflow. It demonstrates the real itch.io-hosted HTML5 runtime, lazy loading, fullscreen/reload controls, game-specific design and supporting content.

**Important:** this example is a repository demo rather than a production deployment. Its example canonical/domain must not be treated as production configuration. A final generated website must replace all demo/staging URLs with the real target domain before `On-Page SEO: PASS` can be reported.

Goblincremental remains a process case study rather than a successful full-site example because the first generated version used the itch.io project detail page instead of the real runtime iframe. The repository intentionally does not publish that broken build as a successful example.

## Critical iframe rule

An itch.io project page is **not** the game runtime.

Wrong:

```html
<iframe src="https://developer.itch.io/game-name"></iframe>
```

A real itch-hosted HTML5 runtime often looks more like:

```text
https://html-classic.itch.zone/html/<build-id>/index.html?v=...
https://html-classic.itch.zone/html/<build-id>/web/index.html?v=...
```

If an itch.io page clearly shows `Run game` + `HTML5` but a text parser does not expose the iframe `src`, keep investigating rendered DOM/source/network instead of assuming the game cannot be embedded.

The skill requires a minimal third-party iframe test **before** the full website design begins.

## Repository structure

```text
open-webgame/
├── README.md
├── SKILL.md
├── LICENSE
├── references/
│   ├── iframe-verification.md
│   ├── on-page-seo.md
│   ├── site-blueprint.md
│   └── qa-checklist.md
└── examples/
    ├── goblincremental.md
    ├── scam-artist.md
    └── scam-artist-site/
        ├── README.md
        └── index.html
```

## Files

- [`SKILL.md`](./SKILL.md) — full agent instructions
- [`references/iframe-verification.md`](./references/iframe-verification.md) — runtime discovery and embed validation
- [`references/on-page-seo.md`](./references/on-page-seo.md) — mandatory On-Page SEO standard
- [`references/site-blueprint.md`](./references/site-blueprint.md) — reusable information architecture
- [`references/qa-checklist.md`](./references/qa-checklist.md) — final acceptance criteria
- [`examples/goblincremental.md`](./examples/goblincremental.md) — iframe failure-mode lesson
- [`examples/scam-artist.md`](./examples/scam-artist.md) — corrected end-to-end pattern
- [`examples/scam-artist-site/index.html`](./examples/scam-artist-site/index.html) — complete generated site source

## Design principle

Before coding, derive a visual system from current official artwork/screenshots:

```text
Dominant palette:
Accent palette:
Art style:
UI density:
Corners:
Borders:
Shadows:
Texture:
Typography mood:
Icon style:
Motion style:
```

Then translate those findings into the site design. Do not start from a generic gaming template and simply swap the game name.

## Responsible use

Technical embeddability is not the same as permission.

Before production use:

- check creator/host terms and asset usage expectations
- credit the creator
- link to the official game page
- make unofficial status clear when applicable
- do not mirror or redistribute game binaries without authorization
- do not imply endorsement or official affiliation

## License

MIT. See [`LICENSE`](./LICENSE).
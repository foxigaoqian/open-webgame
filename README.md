# Open WebGame

Open-source agent skill for turning a **game keyword** into a researched, game-native, play-first website that can actually be deployed.

The core idea is simple:

```text
Game keyword
  → resolve the real game
  → verify browser playability
  → find the real HTML5 runtime iframe
  → test third-party embedding
  → study the game's mechanics + visual DNA
  → generate a site that looks like it belongs to that game
  → add useful guide/FAQ/SEO content
  → responsive + player QA
  → deploy
```

This project was created from a practical workflow tested on browser games such as **Goblincremental** and **Scam Artist**. The biggest lesson is that a beautiful landing page is not enough: if the embedded game does not actually run, the build fails.

## What makes this different

Open WebGame is **not** a fixed visual template and it is **not** a keyword research tool.

It provides a repeatable production workflow while requiring the design system to be derived again for every game.

> Repeat the information architecture. Do not repeat the visual design.

A cute pet game, a perspective drawing challenge, a goblin incremental game and a dark pixel-art idle game should not look like recolored copies of one another.

## Minimum input

```text
Game keyword: Goblincremental
```

Optional inputs:

```text
Official URL: https://...
Target domain: example.com
Preferred stack: static HTML | Next.js | Astro
Language: English
Deployment target: Cloudflare | Vercel | GitHub Pages
```

## What the skill should produce

1. Resolved game identity and official sources
2. Browser/HTML5 availability check
3. Real runtime iframe URL when available
4. Third-party embed verification result
5. Game mechanics / controls / visual research brief
6. Game-specific visual direction
7. Play-first page architecture
8. Deployable responsive site code
9. SEO metadata and accurate JSON-LD
10. Attribution/disclosure
11. Final QA result

Example completion summary:

```text
Game: Example Game
Embed: VERIFIED
Design direction: pixel-art management / dark resource UI
Pages: /, /how-to-play, /tips, /faq
Deployment-ready: YES
Blocking issues: none
```

## Full generated example

A complete generated site is included here:

- [`examples/scam-artist-site/index.html`](./examples/scam-artist-site/index.html) — full single-file website
- [`examples/scam-artist-site/README.md`](./examples/scam-artist-site/README.md) — how the example works

This is the actual Scam Artist build produced while testing the workflow. It includes the real itch.io-hosted HTML5 runtime, lazy loading, fullscreen/reload controls, game-specific visual design, guide content, FAQ and structured data.

Goblincremental remains a process case study rather than a full-site example because the first generated version used the itch.io project detail page instead of the real runtime iframe. The repository intentionally does not publish that broken build as a successful example.

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

If an itch.io page clearly shows `Run game` + `HTML5` but a text parser does not expose the iframe `src`, keep investigating the rendered DOM/source/network instead of assuming the game cannot be embedded.

The skill requires a minimal third-party iframe test **before** the full website design begins.

## Repository structure

```text
open-webgame/
├── README.md
├── SKILL.md
├── LICENSE
├── references/
│   ├── iframe-verification.md
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
- [`references/site-blueprint.md`](./references/site-blueprint.md) — reusable information architecture
- [`references/qa-checklist.md`](./references/qa-checklist.md) — acceptance criteria
- [`examples/goblincremental.md`](./examples/goblincremental.md) — failure-mode lesson
- [`examples/scam-artist.md`](./examples/scam-artist.md) — corrected end-to-end pattern
- [`examples/scam-artist-site/index.html`](./examples/scam-artist-site/index.html) — complete generated site source

## Design principle

Before coding, derive a small visual system from the current game's official artwork/screenshots:

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

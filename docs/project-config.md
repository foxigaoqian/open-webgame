# Project Config

Every generated Open WebGame project should have one `open-webgame.json` file.

This file is the single source of truth for game identity, deployment URL, search intent, embed state, visual direction and QA status.

Schema:

```text
schema/open-webgame.schema.json
```

Starter:

```text
starter/open-webgame.example.json
```

Real example:

```text
examples/scam-artist-site/open-webgame.json
```

## Why this exists

Without a single source of truth, generated sites easily drift:

- HTML says one developer while schema says another
- iframe uses an old runtime while documentation points to a new one
- canonical points to staging while sitemap points to production
- README claims `deployment-ready` while SEO still fails

Open WebGame v0.2 treats config drift as a QA problem.

## Sections

### `game`

Verified identity and source facts.

```json
{
  "name": "Scam Artist",
  "developer": "greenpixels",
  "genre": "Idle / Incremental / Building",
  "officialUrl": "https://greenpixels.itch.io/scam-artist-prototype",
  "platforms": ["Web browser", "Windows", "Linux"]
}
```

Do not fill these fields from guesses.

### `site`

Deployment and rendering decisions.

```json
{
  "language": "en",
  "mode": "play-first",
  "domain": "example.com",
  "canonical": "https://example.com/",
  "stack": "static-html",
  "deploymentTarget": "cloudflare"
}
```

`mode` values:

- `auto` — research not finished
- `play-first` — real third-party runtime verified
- `guide` — no reliable embedded runtime; use official Play links instead

### `seo`

Search-intent brief used before page architecture is generated.

```json
{
  "primaryIntent": "play + beginner guide",
  "primaryKeyword": "Scam Artist",
  "secondaryIntents": ["Scam Artist controls"],
  "canonicalPagePurpose": "Let users play the verified prototype and understand the core loop."
}
```

### `embed`

Runtime truth.

```json
{
  "status": "verified",
  "runtimeUrl": "https://html-classic.itch.zone/html/.../index.html",
  "officialPage": "https://developer.itch.io/game",
  "host": "itch.io"
}
```

Never put an itch.io project detail page in `runtimeUrl`.

### `design`

A compact description of the visual system derived for this game. It is not a fixed theme preset.

```json
{
  "direction": "Dark pixel-art idle-management UI",
  "palette": ["#17110f", "#f3bf46", "#91d447"],
  "density": "medium",
  "notes": "Hard edges, pixel-game energy, money/scam motifs."
}
```

### `status`

The final project state.

```json
{
  "research": "resolved",
  "onPageSeo": "pass",
  "deploymentReady": true,
  "blockingIssues": []
}
```

`deploymentReady: true` is only valid when automated and manual hard gates pass.

## Commands

Validate config:

```bash
npm run check:config -- --config path/to/open-webgame.json
```

Audit On-Page SEO:

```bash
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
```

Check embed config only:

```bash
npm run verify:embed:config -- --config path/to/open-webgame.json
```

Run a live HTTP/header runtime check:

```bash
npm run verify:embed -- --config path/to/open-webgame.json
```

Run all gates:

```bash
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html
```

The automated embed check cannot prove that gameplay input works. Browser boot/input/fullscreen/mobile behavior remains a real QA step.

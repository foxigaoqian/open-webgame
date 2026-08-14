# Project Config

Every generated Open WebGame project should have one `open-webgame.json` file.

This file is the single source of truth for game identity, deployment URL, search intent, embed state, visual direction, source provenance, page architecture, iframe permissions and QA status.

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

Without a single source of truth, generated sites drift easily:

- HTML says one developer while structured data says another
- copy contains a gameplay claim with no traceable source
- iframe uses an old runtime while documentation points to a new one
- canonical points to staging while sitemap points to production
- a deeper page exists without being linked or included in the sitemap
- iframe permissions stay much broader than the game actually needs
- README claims `deployment-ready` while a hard gate still fails

Open WebGame v0.3 treats these forms of drift as QA failures where they can be checked mechanically.

## Core sections

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

## v0.3 production sections

### `sources`

Record the research inputs used for factual content.

```json
[
  {
    "id": "itch-official",
    "type": "itch",
    "url": "https://developer.itch.io/game",
    "label": "Official browser prototype page",
    "retrievedAt": "2026-08-14"
  }
]
```

Prefer official or first-party sources whenever possible.

### `claims`

Track important factual claims and connect them to sources.

```json
[
  {
    "id": "browser-build",
    "text": "The game has an HTML5 browser build.",
    "sourceIds": ["itch-official"],
    "status": "verified",
    "usedIn": ["hero", "player", "faq"]
  }
]
```

A deployment-ready build cannot rely on pending or rejected tracked claims.

This does not require every sentence to become a database row. Track claims that materially affect gameplay instructions, platform support, release status, developer identity, controls, compatibility, progression systems and other facts users may act on.

### `pages`

Describe the intended indexable site architecture.

```json
[
  {
    "path": "/",
    "file": "index.html",
    "intent": "play the game and learn the beginner loop",
    "canonical": "https://example.com/",
    "title": "Play Example Game Online",
    "indexable": true
  },
  {
    "path": "/how-to-play/",
    "file": "how-to-play/index.html",
    "intent": "learn controls and first-session mechanics",
    "canonical": "https://example.com/how-to-play/",
    "title": "How to Play Example Game",
    "indexable": true
  }
]
```

Create a new page only when it serves a distinct real intent with enough useful content. The site gate checks duplicate routes/canonicals, missing files, sitemap coverage and basic orphan risk.

### `security`

Declare the iframe capabilities the generated site is allowed to request.

```json
{
  "allowedIframePermissions": ["autoplay", "fullscreen", "gamepad"],
  "requireNoopenerForBlankTargets": true,
  "allowInlineScripts": true
}
```

Use least privilege. Do not grant camera, microphone, geolocation, MIDI, XR or similar capabilities merely because a host's default embed snippet contains them.

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

Check source-backed claims:

```bash
npm run check:content -- --config path/to/open-webgame.json
```

Check page architecture and sitemap coverage:

```bash
npm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site
```

Audit On-Page SEO:

```bash
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
```

Check iframe/link security:

```bash
npm run check:security -- --config path/to/open-webgame.json --html path/to/index.html
```

Check embed config only:

```bash
npm run verify:embed:config -- --config path/to/open-webgame.json
```

Run a live HTTP/header runtime check:

```bash
npm run verify:embed -- --config path/to/open-webgame.json
```

Run all non-browser gates:

```bash
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html
```

Run real browser QA after installing Playwright Chromium:

```bash
npm install
npx playwright install chromium
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
```

Browser QA starts the generated site locally, checks desktop/tablet/mobile layouts, detects horizontal overflow, exercises lazy player loading, verifies that the configured runtime is assigned to the iframe, checks Reload/Fullscreen presence and saves real screenshots.

HTTP/header checks and Playwright checks complement each other. Neither should be replaced by a fake `deployment-ready` flag.

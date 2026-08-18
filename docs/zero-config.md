# Zero-Config Mode

Open WebGame is designed so an agent can start from a single game keyword.

Minimum input:

```text
Goblincremental
```

The user should not have to supply the official URL, runtime iframe, visual palette, page structure, controls, SEO keyword map or content outline when those can be researched safely.

## Defaults

```text
Language: English
Multilingual: off unless requested
Stack: static HTML
Research: automatic
Content model: auto → online-game only with a verified browser runtime; otherwise wiki for native/downloadable games
Site mode: auto → play-first only after embed verification; native/downloadable games use guide/wiki behavior
URL model: origin + basePath
On-Page SEO: mandatory
Content provenance: mandatory
Content freshness: mandatory for volatile facts
Iframe permissions: least privilege
Browser identity / favicon: mandatory
Responsive + accessibility QA: mandatory
Lighthouse: mandatory before release
Dependency lock + high-severity audit: mandatory for this repository workflow
Output: complete website folder
Clarifying questions: avoid unless genuinely blocked
```

## Mandatory game-type classification

Before generating the final page structure, classify the project as one of two content models:

```text
online-game
wiki
```

### `online-game`

Use this only when a real browser runtime has been verified and the visitor can actually play the game in the website.

Typical examples:

- official HTML5 game
- verified itch.io browser build
- verified WebGL/WASM browser build

The resulting site is **play-first**.

### `wiki`

Use this for native/downloadable games with no verified browser runtime.

Default examples:

- Steam games
- Epic/GOG games
- Windows/macOS/Linux downloadable games
- Steam demos that must be installed
- PlayStation/Xbox/Nintendo games
- announced games with a store page but no browser build

A Steam game is a Wiki build by default. Do not put a fake player above the fold and do not treat a downloadable demo as an online game.

Wiki builds must follow the content-depth model documented in [`../references/site-blueprint.md`](../references/site-blueprint.md), using `dear-passengers.com` as the structural benchmark for Steam/native games: latest official news where relevant, broad entity coverage, gameplay systems, practical guidance, confirmed-vs-unknown facts, requirements/platforms, developer/publisher, official channels, FAQ, related content and trust/attribution pages.

The visual theme must still come from the current game. Copy the **information architecture standard**, not another game's visual skin or themed labels.

### Mixed Steam + browser games

If a title has both Steam distribution and a verified official browser build, choose based on the supplied keyword's dominant intent:

- `play online`, `browser`, `unblocked`, `play now` → `online-game`
- `release date`, `Steam`, `demo`, `wiki`, `guide`, `requirements`, `news`, general title query → `wiki`

Never use an unofficial clone or guessed runtime to force a native game into the Online Game model.

## Agent flow

1. Create/update `open-webgame.json` using schema `0.3.3`.
2. Resolve the exact game entity and official sources.
3. Record sources with `retrievedAt`.
4. Record material claims, mark each `stable` or `volatile`, and give volatile claims an appropriate `maxAgeDays`.
5. Resolve distribution/platforms and browser runtime status.
6. Classify the build as `online-game` or `wiki` before page architecture is generated.
7. For `online-game`, verify the real runtime and use the play-first blueprint. Never fake a player.
8. For `wiki`, use the Steam/native Wiki blueprint and do not create a fake runtime/player section.
9. Define `site.origin` and `site.basePath` separately when a deployment target is known.
10. Derive all canonical URLs from `origin + basePath + route`.
11. Define search intent, pages and multilingual translation groups where requested.
12. Derive game-native visual DNA and minimum iframe permissions.
13. Generate the site, favicon assets, robots and sitemap.
14. Run config, freshness, site, i18n, SEO, security, HTTP and embed gates.
15. Run Playwright + axe at desktop/tablet/mobile widths.
16. Run Lighthouse.
17. Run `qa:release`; only this final aggregate may report `Deployment-ready: YES`.
18. Preserve `qa-artifacts/release-qa.json` as evidence tied to the tested commit.

There is no editable `status.deploymentReady` field in v0.3.3.

## CLI bootstrap

Basic:

```bash
npm run init:game -- "Goblincremental"
```

Root-domain deployment:

```bash
npm run init:game -- "Goblincremental" --origin https://goblincremental.com
```

Subpath deployment such as GitHub Pages:

```bash
npm run init:game -- "Goblincremental" \
  --origin https://username.github.io \
  --base-path /goblincremental
```

Multilingual:

```bash
npm run init:game -- "Goblincremental" --languages en,ja,ko
```

Legacy `--domain` remains accepted only for a hostname. If deployment uses a subpath, use `--origin` + `--base-path`; do not put a path inside a domain field.

Default output:

```text
output/goblincremental/
├── open-webgame.json
└── BUILD-BRIEF.md
```

The CLI creates the contract and brief. The Agent still performs the research, game-type classification, content generation, design and QA.

## Freshness examples

Stable:

```json
{
  "id": "developer",
  "text": "The game is developed by Example Studio.",
  "sourceIds": ["official"],
  "status": "verified",
  "volatility": "stable"
}
```

Volatile:

```json
{
  "id": "browser-build",
  "text": "The game currently has a playable HTML5 browser build.",
  "sourceIds": ["official"],
  "status": "verified",
  "volatility": "volatile",
  "maxAgeDays": 14
}
```

Release state, current browser availability, price, availability and hosted runtime/build status should normally be treated as volatile.

## QA commands

Use the committed lockfile:

```bash
npm ci
npm run check:deps
```

Offline deterministic checks:

```bash
npm run qa -- --config output/goblincremental/open-webgame.json --html output/goblincremental/index.html --offline
```

Final production decision after live URLs are deployed:

```bash
npx playwright install chromium
npm run qa:release -- \
  --config output/goblincremental/open-webgame.json \
  --html output/goblincremental/index.html \
  --site-dir output/goblincremental
```

A successful final run writes `qa-artifacts/release-qa.json` and binds the result to the tested commit SHA.

## Architecture mismatch examples

Hard-fail examples:

```text
Steam game + no verified browser runtime + fake Play Now iframe → FAIL
Downloadable Steam demo presented as an embedded online game → FAIL
Verified HTML5 game buried below a long Wiki article with no obvious play path → FAIL
```

Correct examples:

```text
Steam/native game + Wiki content architecture + official store/demo CTA → PASS
Verified browser game + play-first architecture + real runtime → PASS
```

## When a clarifying question is justified

Ask only when the missing answer cannot be safely inferred or researched, for example:

- two different games share the same name and official evidence cannot resolve the entity
- deployment is requested but the destination/domain cannot be determined
- legal/permission boundaries require user confirmation
- the requested deployment stack conflicts with available tooling

Do not ask for information this workflow is expected to research itself.

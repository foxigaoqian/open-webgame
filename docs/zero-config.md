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
Site mode: auto → play-first only after embed verification, otherwise guide
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

## Agent flow

1. Create/update `open-webgame.json` using schema `0.3.3`.
2. Resolve the exact game entity and official sources.
3. Record sources with `retrievedAt`.
4. Record material claims, mark each `stable` or `volatile`, and give volatile claims an appropriate `maxAgeDays`.
5. Resolve browser runtime status; never fake a player.
6. Define `site.origin` and `site.basePath` separately when a deployment target is known.
7. Derive all canonical URLs from `origin + basePath + route`.
8. Define search intent, pages and multilingual translation groups where requested.
9. Derive game-native visual DNA and minimum iframe permissions.
10. Generate the site, favicon assets, robots and sitemap.
11. Run config, freshness, site, i18n, SEO, security, HTTP and embed gates.
12. Run Playwright + axe at desktop/tablet/mobile widths.
13. Run Lighthouse.
14. Run `qa:release`; only this final aggregate may report `Deployment-ready: YES`.
15. Preserve `qa-artifacts/release-qa.json` as evidence tied to the tested commit.

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

The CLI creates the contract and brief. The Agent still performs the research, content generation, design and QA.

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

## When a clarifying question is justified

Ask only when the missing answer cannot be safely inferred or researched, for example:

- two different games share the same name and official evidence cannot resolve the entity
- deployment is requested but the destination/domain cannot be determined
- legal/permission boundaries require user confirmation
- the requested deployment stack conflicts with available tooling

Do not ask for information this workflow is expected to research itself.

# Project Config

Every generated Open WebGame project should have one `open-webgame.json` file.

It is the single source of truth for game identity, deployment URL model, search intent, embed state, visual direction, source provenance, factual freshness, page architecture, multilingual relationships and iframe permissions.

Schema:

```text
schema/open-webgame.schema.json
```

The current project contract is `schemaVersion: "0.3.3"`.

## URL model

Do not mix a hostname and deployment path into one `domain` string. Use a real origin and a separate base path:

```json
{
  "site": {
    "language": "en",
    "mode": "play-first",
    "origin": "https://foxigaoqian.github.io",
    "basePath": "/open-webgame",
    "canonical": "https://foxigaoqian.github.io/open-webgame/",
    "stack": "static-html",
    "deploymentTarget": "github-pages"
  }
}
```

Rules:

- `site.origin` contains scheme + host only. No path, query, fragment or trailing slash.
- `site.basePath` is empty for a root deployment, otherwise a normalized leading-slash path with no trailing slash.
- homepage canonical = `origin + basePath + /`.
- each page canonical is derived from `origin + basePath + pages[].path`.
- favicon, hreflang, sitemap and other production URLs must respect the same deployment base.

The config gate rejects drift between these values.

## Core sections

### `game`

Verified identity and source facts. Do not fill these fields from guesses.

### `i18n`

Optional multilingual project contract:

```json
{
  "enabled": true,
  "defaultLanguage": "en",
  "xDefaultLanguage": "en",
  "languages": [
    { "code": "en", "label": "English", "prefix": "" },
    { "code": "ja", "label": "日本語", "prefix": "/ja" }
  ]
}
```

When enabled, `site.language` matches the default language and every translated indexable page records `language` + `translationKey`.

### `seo`

Search-intent brief used before page architecture is generated.

### `embed`

Runtime truth. Never put an itch.io project detail page in `runtimeUrl`.

### `design`

A compact game-specific visual direction. It is not a fixed theme preset.

## Source provenance and freshness

### `sources[]`

Record official/first-party research inputs and when they were retrieved:

```json
{
  "id": "itch-official",
  "type": "itch",
  "url": "https://developer.itch.io/game",
  "label": "Official browser prototype page",
  "retrievedAt": "2026-08-15"
}
```

### `claims[]`

Every tracked factual claim declares whether it is stable or volatile:

```json
{
  "id": "browser-build",
  "text": "The game currently has an HTML5 browser build.",
  "sourceIds": ["itch-official"],
  "status": "verified",
  "volatility": "volatile",
  "maxAgeDays": 14,
  "usedIn": ["hero", "player", "faq"]
}
```

Use `stable` for facts that normally do not need periodic re-checking, such as developer identity or a documented control scheme that belongs to a fixed build.

Use `volatile` for facts that can change, such as:

- current browser/runtime availability
- release state / coming-soon status
- supported platforms when actively changing
- price or availability
- current hosted build/version

A volatile claim requires `maxAgeDays`. `check:content` compares it with the newest `retrievedAt` among the referenced sources. A stale volatile claim is a hard failure.

## `pages[]`

Describe intentional routes, files, search intent, canonical, indexability, language and translation grouping. A page canonical must agree with the site URL model.

## `security`

Declare only the iframe capabilities the generated site is allowed to request. Use least privilege.

## `status`

`status` tracks editable project work state, not final release truth:

```json
{
  "research": "resolved",
  "onPageSeo": "pass",
  "blockingIssues": []
}
```

There is intentionally **no stored `status.deploymentReady` boolean** in v0.3.3.

Final readiness is computed by the release QA against the actual code and live URLs:

```bash
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

It writes:

```text
qa-artifacts/release-qa.json
```

The evidence contains the pass/fail result, timestamp, tested commit SHA, release preconditions and individual check results. This prevents a manually edited config flag from claiming that untested code is production-ready.

## Reproducible dependencies

The repository commits `package-lock.json`. Use:

```bash
npm ci
npm run check:deps
```

CI rejects high-severity dependency audit findings. Do not delete the lockfile or switch CI back to floating installs without an explicit reason.

## QA commands

```bash
npm run check:config -- --config path/to/open-webgame.json
npm run check:content -- --config path/to/open-webgame.json
npm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:i18n -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
npm run check:security -- --config path/to/open-webgame.json --html path/to/index.html
npm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
npm run verify:embed -- --config path/to/open-webgame.json
npm test
npm run check:deps
npx playwright install chromium
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

See [`zero-config.md`](./zero-config.md), [`multilingual.md`](./multilingual.md) and [`quality-gates.md`](./quality-gates.md).

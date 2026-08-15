# Scam Artist — Full Site Example

This directory contains the real site used as Open WebGame's regression and live-demo case.

**Live demo:** https://foxigaoqian.github.io/open-webgame/

**Visible languages:**

- English: https://foxigaoqian.github.io/open-webgame/
- 日本語: https://foxigaoqian.github.io/open-webgame/ja/
- 한국어: https://foxigaoqian.github.io/open-webgame/ko/

The header uses a compact dropdown language switcher. Each locale is a separate static, indexable page rather than client-side text replacement.

## What this example demonstrates

- game-specific visual direction rather than a generic reskin
- play-first page architecture
- a verified itch.io-hosted HTML5 runtime URL
- lazy loading, reload and fullscreen controls
- localized English, Japanese and Korean static content
- reciprocal hreflang + x-default and multilingual sitemap alternates
- real ICO + PNG browser favicons
- game-specific How to Play / Tips / FAQ content
- creator attribution and unofficial-site disclosure
- strict schema `0.3.3` project contract
- canonical URL model using `site.origin` + `site.basePath`
- source-backed stable/volatile claims with freshness checks
- automated config, multilingual SEO, SEO, HTTP, embed, browser, axe and Lighthouse QA
- final commit-bound release evidence

## Single source of truth

[`open-webgame.json`](./open-webgame.json) records verified game identity, deployment URL model, locale routes, runtime URL, search intent, visual direction, source provenance and editable project QA state.

GitHub Pages is represented as:

```json
{
  "origin": "https://foxigaoqian.github.io",
  "basePath": "/open-webgame",
  "canonical": "https://foxigaoqian.github.io/open-webgame/"
}
```

Do not put `/open-webgame` inside an origin/domain field.

## SEO / release status

Project config can state:

```text
Research: RESOLVED
Embed config: VERIFIED
Multilingual SEO: PASS
On-Page SEO: PASS
Blocking issues: none
```

It intentionally does **not** store an editable deployment-ready boolean.

The final production decision comes from:

```bash
npm run qa:release:example
```

A passing run writes:

```text
qa-artifacts/release-qa.json
```

That artifact records `Deployment-ready: YES` as a computed result together with the check time and tested commit SHA. A fork or new deployment must update its origin/basePath/canonicals, refresh volatile claims when required, and produce its own passing release evidence.

## Run QA

From the repository root:

```bash
npm ci
npm run check:deps
npm run qa:example
npx playwright install chromium
npm run qa:release:example
```

The final release aggregate covers live HTTP/embed, Browser/axe and Lighthouse in addition to the deterministic gates.

## Run locally

```bash
cd examples/scam-artist-site
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
http://localhost:8080/ja/
http://localhost:8080/ko/
```

## Runtime / freshness note

The example references the itch.io-hosted browser build rather than mirroring game files. Runtime availability can change when the creator updates or removes a web build, so the browser-build claim is marked `volatile` with a freshness window and must be re-verified when it expires.

## Rights / attribution

Scam Artist and its artwork belong to greenpixels / the respective rights holder. This repository includes the surrounding website implementation as a workflow example; it does not redistribute the game binaries.

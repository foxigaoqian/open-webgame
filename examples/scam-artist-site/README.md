# Scam Artist — Full Site Example

This directory contains the real site used as Open WebGame's regression and live-demo case.

**Live demo:** https://foxigaoqian.github.io/open-webgame/

**Visible languages:**

- English: https://foxigaoqian.github.io/open-webgame/
- 日本語: https://foxigaoqian.github.io/open-webgame/ja/
- 한국어: https://foxigaoqian.github.io/open-webgame/ko/

The header includes a visible `EN / 日本語 / 한국어` language switcher. Each locale is a separate static, indexable page rather than client-side text replacement.

## What this example demonstrates

- game-specific visual direction rather than a generic reskin
- play-first page architecture
- a verified itch.io-hosted HTML5 runtime URL
- lazy loading behind a `Load Game` action
- reload and fullscreen controls
- official artwork/screenshots loaded from itch.io
- localized English, Japanese and Korean visible page content
- per-language `<html lang>`, canonical, Open Graph URL and structured data language
- reciprocal `hreflang` for `en`, `ja`, `ko` and `x-default`
- multilingual sitemap alternate entries
- visible language navigation between all locale pages
- game-specific How to Play / Tips / FAQ content
- `VideoGame` and `FAQPage` structured data
- responsive desktop/mobile layout
- creator attribution and unofficial-site disclosure
- production canonical / Open Graph URL
- `robots.txt` and `sitemap.xml`
- strict `open-webgame.json` project contract
- automated config, multilingual SEO, SEO, HTTP, embed, browser, axe and Lighthouse QA

## Single source of truth

Project state lives in:

[`open-webgame.json`](./open-webgame.json)

It records the verified game identity, live canonicals, locale routes, runtime URL, search intent, visual direction and readiness state.

Do not update the iframe, locale routes, canonical, sitemap or readiness claims without keeping this config synchronized.

## SEO / deployment status

The GitHub Pages case has real production URLs for all three locale pages:

```text
https://foxigaoqian.github.io/open-webgame/
https://foxigaoqian.github.io/open-webgame/ja/
https://foxigaoqian.github.io/open-webgame/ko/
```

The locale pages identify `Scam Artist`, use self-referencing canonicals, expose reciprocal hreflang alternates, and are represented in the multilingual sitemap.

Current automated contract:

```text
Research: RESOLVED
Embed config: VERIFIED
Multilingual SEO: PASS
On-Page SEO: PASS
Default canonical: https://foxigaoqian.github.io/open-webgame/
Deployment-ready: YES
Blocking issues: none
```

This status refers to the repository's own GitHub Pages example. A fork or newly generated production site must replace the canonical/domain with its own deployment and pass QA again.

## Run QA

From the repository root:

```bash
npm run qa:example
```

Run the live runtime HTTP/header check separately:

```bash
npm run verify:embed -- --config examples/scam-artist-site/open-webgame.json
```

First-production verification also uses the Browser QA workflow for real iframe boot/reload, accessibility and Lighthouse checks.

## Run locally

Serve the directory with any static server, for example:

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

## Runtime note

The example references the itch.io-hosted browser build rather than mirroring game files. Runtime URLs can change when a developer uploads a new web build, so production projects should keep the runtime configurable and re-verify it.

## Rights / attribution

Scam Artist and its artwork belong to greenpixels / the respective rights holder. This repository includes the surrounding website implementation as a workflow example; it does not redistribute the game binaries.

# Scam Artist — Full Site Example

This directory contains the real site used as Open WebGame's regression and live-demo case.

**Live demo:** https://foxigaoqian.github.io/open-webgame/

## What this example demonstrates

- game-specific visual direction rather than a generic reskin
- play-first page architecture
- a verified itch.io-hosted HTML5 runtime URL
- lazy loading behind a `Load Game` action
- reload and fullscreen controls
- official artwork/screenshots loaded from itch.io
- game-specific How to Play / Tips / FAQ content
- `VideoGame` and `FAQPage` structured data
- responsive desktop/mobile layout
- creator attribution and unofficial-site disclosure
- production canonical / Open Graph URL
- `robots.txt` and `sitemap.xml`
- v0.2 single-source `open-webgame.json`
- automated config, SEO and embed-config QA

## Single source of truth

Project state lives in:

[`open-webgame.json`](./open-webgame.json)

It records the verified game identity, live canonical, runtime URL, search intent, visual direction and readiness state.

Do not update the iframe, canonical, sitemap or readiness claims without keeping this config synchronized.

## SEO / deployment status

The GitHub Pages case now has a real deployment URL:

```text
https://foxigaoqian.github.io/open-webgame/
```

The homepage H1 identifies `Scam Artist`, canonical and `og:url` point to the live URL, and the directory includes production robots/sitemap files.

Current automated contract:

```text
Research: RESOLVED
Embed config: VERIFIED
On-Page SEO: PASS
Canonical: https://foxigaoqian.github.io/open-webgame/
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

The automated runtime check does not replace a real browser boot/input/fullscreen/mobile smoke test.

## Run locally

Serve the directory with any static server, for example:

```bash
cd examples/scam-artist-site
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Runtime note

The example references the itch.io-hosted browser build rather than mirroring game files. Runtime URLs can change when a developer uploads a new web build, so production projects should keep the runtime configurable and re-verify it.

## Rights / attribution

Scam Artist and its artwork belong to greenpixels / the respective rights holder. This repository includes the surrounding website implementation as a workflow example; it does not redistribute the game binaries.

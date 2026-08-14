# Scam Artist — Full Site Example

This directory contains the actual single-file website generated while validating the Open WebGame workflow.

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

## SEO status

This file is a **repository demo**, not a production-domain deployment.

The original demo was useful for validating the player and design workflow, but it must not be labeled `deployment-ready` until it passes the current Open WebGame On-Page SEO Gate.

In particular, a production version must ensure:

- the real target-domain canonical replaces any demo/example canonical
- the homepage H1 clearly identifies `Scam Artist` and the primary intent rather than using only a slogan
- Open Graph URLs use the real production URL
- production `robots.txt` exists
- production `sitemap.xml` exists
- image dimensions/lazy-loading strategy is finalized
- the final domain has no staging/example SEO metadata

See:

- [`../../references/on-page-seo.md`](../../references/on-page-seo.md)
- [`../../references/qa-checklist.md`](../../references/qa-checklist.md)

A future production build should report:

```text
Game Embed: PASS
On-Page SEO: PASS
Canonical: https://REAL-DOMAIN/
Deployment-ready: YES
```

Until a real production domain is supplied and validated, the canonical status is intentionally considered pending.

## Run locally

Open `index.html` directly in a browser, or serve the directory with any static server.

For example:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/examples/scam-artist-site/
```

## Runtime note

The example references the itch.io-hosted browser build rather than mirroring game files. Runtime URLs can change when a developer uploads a new web build, so production projects should treat the runtime URL as configuration and re-verify it before deployment.

## Rights / attribution

Scam Artist and its artwork belong to greenpixels / the respective rights holder. This repository includes the surrounding website implementation as a workflow example; it does not redistribute the game binaries.
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

# Super Big Slime: Black Hole 3D site

Generated with the Open WebGame v0.3.3 workflow for the keyword **Super Slime: Black Hole**.

## Build summary

- Mode: play-first
- Default language: English
- Locales: English, Japanese, Korean
- Browser runtime: `https://kiz10.com/embed/super-slime---black-hole-game/`
- Mobile game publisher: Supercent, Inc.
- Browser host: Kiz10
- Production path: `https://foxigaoqian.github.io/open-webgame/super-slime-black-hole/`

## Attribution and boundaries

This is an unofficial discovery and guide site. The Supercent mobile game and the Kiz10 browser-hosted HTML5 build are deliberately described as separate sources. The site does not mirror game binaries.

Gameplay screenshots are used editorially to identify and explain the game. The city screenshot originates from the Apple-distributed app artwork CDN; the fruit gameplay screenshot is a game screenshot surfaced by a third-party app listing. The generated favicon and UI chrome are original site assets.

## QA

Run from the Open WebGame repository root:

```bash
npm run check:config -- --config examples/super-slime-black-hole-site/open-webgame.json
npm run check:content -- --config examples/super-slime-black-hole-site/open-webgame.json
npm run check:site -- --config examples/super-slime-black-hole-site/open-webgame.json --site-dir examples/super-slime-black-hole-site
npm run check:i18n -- --config examples/super-slime-black-hole-site/open-webgame.json --site-dir examples/super-slime-black-hole-site
npm run check:seo -- --config examples/super-slime-black-hole-site/open-webgame.json --html examples/super-slime-black-hole-site/index.html --site-dir examples/super-slime-black-hole-site
npm run qa:browser -- --config examples/super-slime-black-hole-site/open-webgame.json --site-dir examples/super-slime-black-hole-site
npm run qa:lighthouse -- --config examples/super-slime-black-hole-site/open-webgame.json --site-dir examples/super-slime-black-hole-site
npm run qa:release -- --config examples/super-slime-black-hole-site/open-webgame.json --html examples/super-slime-black-hole-site/index.html --site-dir examples/super-slime-black-hole-site
```

Only the release aggregate may be used to claim final deployment readiness.

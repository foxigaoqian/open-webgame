# Hearth and Hamlet site

Generated with the Open WebGame v0.3.3 workflow for **Hearth and Hamlet**.

## Build summary

- Mode: guide + discovery
- Language: English
- Browser runtime: not verified / unsupported
- Official full game: `https://store.steampowered.com/app/4315040/Hearth_and_Hamlet/`
- Official Steam demo: `https://store.steampowered.com/app/4564480/Hearth_and_Hamlet_Demo/`
- Developer: Phorust Studios
- Production URL: `https://hearth-and-hamlet.dearpassengerscrew-new.workers.dev/`
- Deployment target: Cloudflare Workers

## Why guide mode

The production workflow requires a real browser runtime before a play-first site can be shipped. The official distribution is through Steam, and the developer's itch.io presence does not expose a verified browser-play runtime. This site therefore links to the official Steam demo instead of embedding a Steam project page or fabricating a player.

## Content and attribution

Game facts are based on the current official Steam store page, the official Steam demo listing and official developer announcements. Artwork and screenshots belong to their respective rights holders and are used editorially to identify and explain the game. No game binaries are mirrored.

## QA

Run from the Open WebGame repository root:

```bash
npm run check:config -- --config examples/hearth-and-hamlet-site/open-webgame.json
npm run check:content -- --config examples/hearth-and-hamlet-site/open-webgame.json
npm run check:site -- --config examples/hearth-and-hamlet-site/open-webgame.json --site-dir examples/hearth-and-hamlet-site
npm run check:i18n -- --config examples/hearth-and-hamlet-site/open-webgame.json --site-dir examples/hearth-and-hamlet-site
npm run check:seo -- --config examples/hearth-and-hamlet-site/open-webgame.json --html examples/hearth-and-hamlet-site/index.html --site-dir examples/hearth-and-hamlet-site
npm run check:security -- --config examples/hearth-and-hamlet-site/open-webgame.json --html examples/hearth-and-hamlet-site/index.html
npm run verify:embed:config -- --config examples/hearth-and-hamlet-site/open-webgame.json
npm test
npm run qa:browser -- --config examples/hearth-and-hamlet-site/open-webgame.json --site-dir examples/hearth-and-hamlet-site
npm run qa:lighthouse -- --config examples/hearth-and-hamlet-site/open-webgame.json --site-dir examples/hearth-and-hamlet-site
npm run qa:release -- --config examples/hearth-and-hamlet-site/open-webgame.json --html examples/hearth-and-hamlet-site/index.html --site-dir examples/hearth-and-hamlet-site
```

Only a passing release aggregate should be used to claim final deployment readiness.

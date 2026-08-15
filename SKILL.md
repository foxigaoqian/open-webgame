---
name: open-webgame
description: Build a deployable, game-native, play-first website from a game keyword or official game URL. Resolve the real game, verify browser embedding, derive the visual system from the game, generate useful game content, and require a strict On-Page SEO gate before the site can be marked deployment-ready.
---

# Open WebGame

Turn a game keyword into a real, deployable, game-native website.

This is not a generic landing-page skin and it is not a keyword-discovery skill.

The reusable part is the production workflow and information architecture. The visual design, content, terminology and page depth must be derived again for every game.

## Non-negotiable rules

1. **Resolve the real game before generating content.**
2. **Verify the real browser runtime before claiming the game is playable.**
3. **Do not use an itch.io project detail page as the game iframe.**
4. **Do not fabricate mechanics, controls, release information, features or strategies.**
5. **The website must visually match the specific game, not a recolored previous site.**
6. **Important indexable content must exist outside the iframe.**
7. **Every production build must pass the On-Page SEO Gate.**
8. **A broken player or failed On-Page SEO Gate means `deployment-ready: NO`.**
9. **Production output must include real statically declared favicon assets and pass the full release-readiness gate before `deployment-ready: YES`.**

Read and follow:

- [`references/iframe-verification.md`](./references/iframe-verification.md)
- [`references/on-page-seo.md`](./references/on-page-seo.md)
- [`references/site-blueprint.md`](./references/site-blueprint.md)
- [`references/qa-checklist.md`](./references/qa-checklist.md)

# Zero-Config Mode

Zero-Config Mode is the default when the user provides only a game keyword. Do not ask for optional details that can be researched safely.

Defaults:

```text
Language: English
Stack: static HTML
Research: automatic
Site mode: auto → play-first only after runtime verification, otherwise guide
On-Page SEO: mandatory
Responsive QA: mandatory
Browser identity / favicon: mandatory
Output: complete website folder
Clarifying questions: avoid unless genuinely blocked
```

Create or update `open-webgame.json` before the final build. It is the per-project single source of truth for game identity, canonical URL, search intent, runtime URL, visual direction and readiness state. Use `schema/open-webgame.schema.json` as the contract.

When research resolves a field, update the config immediately. Do not let HTML, JSON-LD, sitemap, README or runtime configuration silently disagree with it.

See [`docs/zero-config.md`](./docs/zero-config.md) and [`docs/project-config.md`](./docs/project-config.md).

# v0.3 Production Engine

For production work, research and QA must be auditable rather than existing only in prose.

## Source provenance

Populate `sources[]` with the official/first-party research inputs used for the build. Track material factual statements in `claims[]` and connect each claim to one or more `sourceIds`. A deployment-ready build must not rely on tracked claims whose status is `pending` or `rejected`.

Use claims for facts that materially affect the user: controls, platforms, browser/mobile support, release state, developer identity, gameplay systems, progression, compatibility and similar statements. Do not create a claim row for every stylistic sentence.

## Page architecture

Populate `pages[]` before generating deeper routes. Every page needs a distinct path, output file, intent, canonical and indexability decision. Create a route only when a distinct real user intent has enough useful content. Avoid duplicate intent pages and orphan routes.

## Least-privilege embeds

Populate `security.allowedIframePermissions`. Start with the minimum required set, normally `autoplay`, `fullscreen`, `gamepad` and only other capabilities the verified runtime actually needs. Do not copy camera, microphone, geolocation, MIDI, XR or sensor permissions merely because a host's default embed snippet includes them.

## Real browser QA

Before first production launch, run Playwright browser QA after the non-browser gates pass:

```bash
npm install
npx playwright install chromium
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
```

Browser QA must check the generated shell at approximately 1440px, 768px and 390px, detect horizontal overflow, exercise lazy game loading, confirm the configured runtime is assigned to the iframe, preserve Reload behavior, require a Fullscreen control when offered, and capture real screenshots.

A successful HTTP request is not a substitute for browser QA. A visually correct screenshot is not a substitute for embed verification. Both are required for a first production launch of a play-first build.

## v0.3 machine gates

```bash
npm run check:config -- --config path/to/open-webgame.json
npm run check:content -- --config path/to/open-webgame.json
npm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
npm run check:security -- --config path/to/open-webgame.json --html path/to/index.html
npm run verify:embed -- --config path/to/open-webgame.json
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html
```

See [`docs/project-config.md`](./docs/project-config.md).

# v0.3.1 Quality and Multilingual Upgrade

The project contract and QA pipeline are strict. Do not treat these rules as optional documentation.

## Strict project schema

`open-webgame.json` must validate with AJV against `schema/open-webgame.schema.json`. Unknown or misspelled keys are failures. Do not invent new config fields ad hoc; update the schema and tests when the contract genuinely changes.

Run:

```bash
npm install
npm run check:config -- --config path/to/open-webgame.json
npm test
```

Regression fixtures must include both expected-pass and expected-fail cases for machine-enforced rules.

## Real multilingual SEO

Multilingual output is optional and is enabled only when requested or otherwise explicitly justified. It is not a client-side translation widget.

When multiple languages are requested:

1. Set `i18n.enabled = true`.
2. Set `i18n.defaultLanguage`, `i18n.xDefaultLanguage` and `i18n.languages[]`.
3. Create separate crawlable locale routes.
4. Add `language` and a shared `translationKey` to every indexable translated page in `pages[]`.
5. Localize search intent, title, meta description, H1, opening copy, headings, FAQ, alt text and navigation for the target language. Do not mechanically translate an English keyword page and call it finished.
6. Every locale page must self-canonicalize.
7. Every translation group must expose reciprocal `hreflang` links for all members, including itself, plus `x-default`.
8. Provide a visible keyboard-accessible language switcher. Prefer the equivalent page with the same `translationKey`; do not force users back to the homepage when an equivalent locale page exists.
9. Deployment-ready multilingual sites require sitemap alternate links with the XHTML namespace.
10. Run `check:i18n`; any failure means `deployment-ready: NO`.

Bootstrap example:

```bash
npm run init:game -- "Game Name" --languages en,ja,ko
```

The bootstrap only creates the contract. The agent must still research and generate every useful localized route.

See [`docs/multilingual.md`](./docs/multilingual.md).

## Image alt semantics

For SEO and accessibility:

- informative image → meaningful `alt="..."`
- decorative image → `alt=""`
- missing `alt` attribute → hard failure

Do not convert intentional decorative empty alt text into keyword-filled alt text.

## Browser identity / favicon

Every generated production site must include real browser identity assets. Do not assume a visible site logo automatically becomes the browser-tab icon.

Required baseline for static HTML:

```html
<link rel="shortcut icon" href="./favicon.ico">
<link rel="icon" type="image/x-icon" href="./favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
```

Rules:

- generate a real binary `favicon.ico`
- generate a real binary 32x32 PNG favicon
- declare favicon links statically in `<head>`; do not depend on JavaScript injection
- use correct relative/absolute paths on nested locale routes
- keep the icon legible at browser-tab size and derive it from the current game's visual identity when appropriate
- Browser QA must verify the favicon declarations, HTTP response, MIME type and PNG/ICO file signatures
- Live HTTP QA must verify production favicon URLs, not only the local build
- a missing/broken favicon is a production hard-gate failure

## Live production resource QA

Correct-looking HTML is not enough if production URLs are dead.

Before first launch, run:

```bash
npm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

The live gate checks production-facing canonical URLs, `og:image`, the sitemap declared by robots and sitemap `<loc>` URLs. A broken production URL blocks readiness.

## Browser, accessibility and runtime QA

Browser QA now verifies more than the iframe attribute:

- desktop/tablet/mobile shell
- horizontal overflow
- static PNG + ICO favicon declarations and valid icon resources
- lazy-load CTA
- configured iframe URL assignment
- a real child frame navigating to the runtime origin
- Reload producing a real navigation cycle when Reload is offered
- Fullscreen control presence when offered
- console/page errors
- axe WCAG 2 A/AA results for the host shell
- real screenshots and machine-readable axe reports

Run:

```bash
npx playwright install chromium
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
```

Serious or critical host-shell accessibility violations block deployment. Do not score a third-party game's internal iframe DOM as if Open WebGame controls it, but do make the surrounding player UI accessible.

## Lighthouse gate

Before first production launch, run:

```bash
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site
```

The shell is tested before the lazy game runtime starts. Hard failures include category scores below the configured thresholds and excessive CLS. Fix the underlying page rather than lowering thresholds to hide a regression.

See [`docs/quality-gates.md`](./docs/quality-gates.md).

## v0.3.1 machine gates

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
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site
```

A relevant hard-gate failure always means `deployment-ready: NO`. Passing this individual command list is not, by itself, the final release decision. Use `npm run qa:release` after deployment URLs are live; only the release aggregate may return `Deployment-ready: YES`.

# v0.3.3 Reliability Hardening

Production configuration and release evidence must remain trustworthy over time.

## Canonical URL model

Use `site.origin` for scheme + host only and `site.basePath` for an optional deployment subpath. Do not put a path inside a domain/origin value.

Example GitHub Pages deployment:

```json
{
  "site": {
    "origin": "https://username.github.io",
    "basePath": "/game-site",
    "canonical": "https://username.github.io/game-site/"
  }
}
```

Derive page canonicals, hreflang URLs, sitemap URLs and production asset URLs from the same origin/base-path model. A mismatch is a hard config failure.

## Factual freshness

Every tracked claim must declare `volatility: "stable" | "volatile"`.

For volatile facts, also set `maxAgeDays`. The referenced source must have a current `retrievedAt`; `check:content` fails when the newest supporting source is older than the allowed window.

Treat current browser/runtime availability, release state, price/availability, active hosted build/version and similarly changeable facts as volatile. Do not let a source-backed claim become permanently trusted merely because it was once correct.

## Reproducible dependencies

This repository uses a committed `package-lock.json`. Prefer `npm ci` for QA/CI and run `npm run check:deps`. High-severity dependency audit findings are hard failures; fix or upgrade the affected dependency rather than suppressing the gate.

## Release evidence, not a readiness flag

`open-webgame.json` no longer stores an editable `status.deploymentReady` boolean. Project status stores research/SEO progress and blocking issues only.

The final readiness decision is computed by:

```bash
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

Every run writes `qa-artifacts/release-qa.json` containing pass/fail, timestamp, tested commit SHA, blocking issues and aggregate check results. Only a passing release artifact bound to the tested code may support `Deployment-ready: YES` in the completion report.


# Inputs

Minimum input:

```text
Game keyword: <name>
```

Preferred input:

```text
Game keyword: <name>
Official URL: <optional>
Target domain: <optional>
Preferred stack: static HTML | Next.js | Astro | other
Language: English by default
Deployment target: Cloudflare | Vercel | GitHub Pages | other
```

If the user only provides the game name, research the current official game first.

# Mandatory Workflow

Do not start the final UI before Phases 1–4 are complete.

## Phase 1 — Resolve the game entity

Find the correct current game.

Preferred source order:

1. official website
2. itch.io project/developer page
3. Steam store page
4. developer/publisher page
5. official social account or devlog

Confirm:

- exact game name
- developer/publisher
- release/prototype/demo status
- supported platforms
- browser availability
- official description
- real mechanics
- real controls when documented
- official screenshots/artwork

If multiple games share the same name, resolve the entity before continuing.

Never infer the game from the title alone.

## Phase 2 — Verify browser playability

This is a hard gate for a play-first build.

Look for official signals such as:

- `Run game`
- `Play in browser`
- `HTML5`
- visible embedded browser player

### Find the actual runtime

Wrong:

```html
<iframe src="https://developer.itch.io/game-name"></iframe>
```

That is a project page, not the runtime.

A real itch-hosted runtime often resembles:

```text
https://html-classic.itch.zone/html/<build-id>/index.html?...
https://html-classic.itch.zone/html/<build-id>/web/index.html?...
```

Possible discovery methods:

- rendered DOM inspection
- page source inspection
- browser network inspection
- iframe element inspection
- official developer comments/devlogs when they expose the runtime URL

Important: a text parser may omit iframe `src` attributes. If the official page clearly shows `Run game + HTML5`, continue investigating instead of concluding that no runtime exists.

### Minimal third-party test

Before building the full website, test the runtime in the smallest possible page:

```html
<!doctype html>
<meta charset="utf-8">
<style>html,body,iframe{margin:0;width:100%;height:100%;border:0}</style>
<iframe
  src="REAL_RUNTIME_URL"
  allow="autoplay; fullscreen *; gamepad"
  allowfullscreen>
</iframe>
```

Verify:

- game boots
- mouse works
- keyboard works when relevant
- touch works if mobile play is claimed
- fullscreen works when offered
- reload works
- no CSP / `frame-ancestors` / `X-Frame-Options` blocker
- the game does not immediately navigate away

If the runtime fails, do not fake a player. Either build a guide/discovery site with a real official Play link or reject it for the play-first template.

## Phase 3 — Check attribution and usage boundaries

Technical embeddability is not the same as permission.

Before production deployment:

- check available developer/host terms
- credit the developer
- link to the official game page
- do not claim official status unless true
- do not mirror game binaries without authorization
- prefer the current host-provided runtime
- disclose unofficial discovery/guide status when appropriate
- do not fabricate endorsement or affiliation

## Phase 4 — Build the search-intent brief

Before UI generation, define:

```text
Primary entity: <exact game name>
Primary query intent: play | guide | controls | wiki | mixed
Primary keyword: <natural main query>
Secondary intents: <real supporting queries>
Canonical page purpose: <one sentence>
```

Do not force modifiers such as `free`, `online`, `unblocked`, `codes`, `download` or `wiki` unless they are accurate and useful.

The page structure must be driven by actual player intent, not by a generic SEO checklist.

## Phase 5 — Build the game research brief

### Identity

Collect:

- game name
- developer
- official description/tagline
- genre
- platform
- release status

### Mechanics

Collect only real systems:

- primary gameplay loop
- score/win/progression condition
- resources
- upgrades
- characters
- enemies
- rooms/levels/areas
- prestige/reset systems
- daily challenges
- leaderboard
- collections
- codes/secrets only if real

### Controls

Only document controls supported by official sources or verified gameplay.

### Visual DNA

Derive from official screenshots/artwork:

- dominant colors
- accent colors
- pixel/vector/hand-drawn/3D/minimalist style
- UI density
- shape language
- border style
- corner radius
- shadows
- textures
- typography mood
- icon style
- motion style

### Player intent

Identify what users genuinely need:

- play now
- how to play
- controls
- beginner tips
- scoring/progression explanation
- upgrades/builds
- wiki/reference
- codes/secrets only when real
- mobile/browser support
- save behavior
- release information

Do not create sections for systems that do not exist.

# Visual Direction

**Repeat the information architecture. Do not repeat the visual design.**

Examples:

### Cute / cozy / pet / casual

Prefer soft palettes, illustrated controls, larger radius, sticker/card motifs and friendly spacing.

### Drawing / precision / challenge

Prefer clean geometry, challenge/score emphasis, sharper states, paper/grid motifs where appropriate.

### Incremental / management / strategy

Prefer resource counters, compact information hierarchy, progression panels and management-oriented UI only when consistent with the game.

### Pixel / dark / roguelike / idle

Prefer harder edges, pixel-compatible typography treatment, status bars, stronger shadows and limited highlight accents.

These are heuristics, not fixed templates.

# Default Site Architecture

Start with one strong page unless real search intent justifies more routes.

Recommended order:

```text
Navigation
Hero
Playable Game
How to Play / Core Loop
Verified Features / Systems
Screenshots / Game Feel
Beginner Tips
Controls / Progression
FAQ
Official Links / Attribution
Footer
```

## Hero requirements

The hero must immediately answer:

- what game this is
- what the player does
- why the game is interesting
- whether the player can play now

Required:

- exactly one normal H1
- H1 clearly identifies the game/topic
- concise game-specific introduction
- primary Play action when verified
- meaningful official artwork/screenshot where permitted

A pure slogan such as `BUILD A SHADY EMPIRE` is not sufficient as the homepage H1 by itself. Prefer a search-clear H1 such as:

```html
<h1>Play Scam Artist Online <span>Build a Shady Empire</span></h1>
```

## Player requirements

When embedding is verified:

- place the player high on the page
- lazy-load the heavy runtime after user interaction when practical
- keep the runtime URL configurable
- provide Reload
- provide Fullscreen when supported
- provide an official fallback link
- do not force autoplay audio before user interaction

Important SEO copy must remain outside the iframe.

## How to Play / Tips / FAQ

Use the game's terminology and verified mechanics.

Do not write generic filler such as:

```text
Practice makes perfect.
Have fun.
Try different strategies.
```

FAQ should answer real first-session questions. FAQ structured data is optional and must be accurate; the visible FAQ itself is the main value.

# Mandatory On-Page SEO Gate

Every generated production site must follow [`references/on-page-seo.md`](./references/on-page-seo.md).

This is a **hard acceptance gate**, not an optional optimization pass.

## Required page-level SEO

Every important indexable page must have:

- unique descriptive `<title>`
- useful meta description
- exact game entity/topic made clear in the H1
- one normal H1
- logical H2/H3 hierarchy
- search intent matched by visible content
- self-referencing production canonical
- no staging/example canonical left in production
- accurate Open Graph metadata
- accurate structured data only when justified
- meaningful indexable text outside the iframe
- crawlable internal links
- no accidental `noindex`

## Required content signals

Use the game name naturally where it helps identify the entity:

- title
- H1
- opening copy
- relevant H2s
- meaningful image alt text
- internal anchors where natural
- structured data

Never use a keyword-density target.

Do not use:

- keyword stuffing
- hidden text
- giant keyword footers
- autogenerated synonym blocks
- irrelevant modifiers
- doorway pages
- multiple near-identical pages targeting the same intent

## Images

For production output:

- use meaningful alt text
- use empty alt for decorative images
- reserve image dimensions / aspect ratio
- avoid lazy-loading the likely LCP hero image
- lazy-load below-the-fold screenshots when appropriate
- compress site-owned assets
- do not stretch artwork

## Site-level technical SEO

Production deliverables must include:

```text
robots.txt
sitemap.xml
```

The sitemap must contain canonical indexable production URLs only.

Multi-page sites must not contain orphan pages.

## Performance

The website shell should load before the game runtime.

Optimize for usable Core Web Vitals:

- avoid unnecessary render-blocking assets
- keep non-game JavaScript small
- avoid layout shift from images/media
- lazy-load the heavy runtime when practical

## Search Console readiness

A production result should be ready for:

- Google Search Console verification
- sitemap submission
- canonical URL inspection
- indexing request where appropriate
- query/impression/CTR monitoring

Do not pretend Search Console is connected unless it actually is.

# Optional Multi-page Expansion

Create a separate route only for a distinct real user intent with enough meaningful content.

Possible routes:

```text
/
/how-to-play/
/tips/
/guide/
/wiki/
/upgrades/
/builds/
/codes/
/leaderboard/
/daily/
/secrets/
/calculator/
/release-date/
```

Do not create thin pages simply to capture keyword variants.

# Implementation Requirements

Default output should be deployable, not a screenshot/mockup.

For static HTML:

- semantic HTML5
- `<html lang="...">`
- CSS variables for design tokens
- minimal JavaScript
- responsive desktop/tablet/mobile layout
- no broken placeholder links in production
- real `favicon.ico` + `favicon-32x32.png` with static `<head>` declarations
- no fake game player
- important content present in HTML source

For frameworks:

- isolate the game player as a component
- keep runtime URL configurable
- avoid duplicating runtime URLs across files
- render SEO metadata and core content server-side/static where practical

Recommended configuration:

```js
const GAME = {
  name: "Example Game",
  officialUrl: "https://...",
  runtimeUrl: "https://html-classic.itch.zone/...",
  developer: "Example Developer"
};
```

Runtime URLs may change after a developer uploads a new browser build. Keep them easy to update.

# Content Quality Rules

Every factual game claim must be supported by:

- official game page
- official developer page
- official Steam page
- official devlog
- direct verified gameplay

Do not invent:

- controls
- release dates
- mobile support
- saves
- leaderboards
- upgrades
- characters
- hidden content
- codes
- ratings/review counts

If a fact cannot be verified, omit it or label it unknown.

# Responsive Requirements

Verify approximately:

- 1440px desktop
- 768px tablet
- 390px mobile

Check:

- game title/H1 remains readable
- navigation does not overflow
- iframe/player remains usable
- touch targets are usable
- screenshots do not break layout
- no horizontal scrolling
- body copy remains readable

If the browser game itself is poor on small screens, state `Desktop recommended` rather than claiming good mobile play.

# Machine-Enforced Gates

When the repository scripts are available, run them. Documentation-only self-review is not enough when a rule can be checked mechanically.

```bash
npm run check:config -- --config path/to/open-webgame.json
npm run check:content -- --config path/to/open-webgame.json
npm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:i18n -- --config path/to/open-webgame.json --site-dir path/to/site
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
npm run check:security -- --config path/to/open-webgame.json --html path/to/index.html
npm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
npm run verify:embed:config -- --config path/to/open-webgame.json
npm run verify:embed -- --config path/to/open-webgame.json
npm test
npx playwright install chromium
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site
```

`npm run qa` aggregates the non-browser gates and intentionally does **not** grant final release readiness. For the final production decision run:

```bash
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

Only `qa:release` may print `Deployment-ready: YES`, because it requires live HTTP/embed, Browser/axe and Lighthouse to pass in the same release decision.

A command failure means the corresponding hard gate has not passed. Do not bypass a failing gate or claim readiness without a passing `qa:release` artifact for the tested code.

# Final QA Gate

A project is complete only when all applicable gates pass.

## Game

- [ ] Correct runtime URL is used
- [ ] Project detail page is not used as the runtime
- [ ] Game loads inside the page
- [ ] Relevant controls work
- [ ] Fullscreen works when offered
- [ ] Reload works
- [ ] Official fallback works

## Design

- [ ] Visual system belongs to this game
- [ ] It is not a recolored generic template
- [ ] Artwork is displayed correctly
- [ ] Mobile design is intentional

## Content

- [ ] Mechanics are verified
- [ ] Controls are verified
- [ ] No fabricated systems
- [ ] Copy helps a real player

## On-Page SEO

- [ ] Primary entity and intent are defined
- [ ] Unique title and meta description
- [ ] Homepage H1 clearly identifies the game/topic
- [ ] Exactly one normal H1 per page
- [ ] Search-clear opening copy exists outside iframe
- [ ] Logical H2/H3 structure
- [ ] Correct production canonical
- [ ] No placeholder/staging canonical in production
- [ ] Accurate OG metadata
- [ ] Accurate structured data when used
- [ ] Meaningful alt text and image dimensions
- [ ] Important internal links are crawlable
- [ ] No orphan/duplicate-intent pages
- [ ] robots.txt exists
- [ ] sitemap.xml exists
- [ ] No accidental noindex
- [ ] No keyword stuffing, hidden text or doorway patterns

## Browser identity / release quality

- [ ] `favicon.ico` exists and is a valid icon file
- [ ] `favicon-32x32.png` exists and is a valid PNG
- [ ] Every locale declares favicon links statically in `<head>`
- [ ] Production favicon URLs return successfully with compatible MIME types
- [ ] Browser/axe QA passes required locales and viewports
- [ ] Lighthouse hard thresholds pass
- [ ] `npm run qa:release` passes before reporting deployment-ready

## Attribution

- [ ] Developer is credited
- [ ] Official page is linked
- [ ] Unofficial status is clear when applicable
- [ ] No false ownership/affiliation claim

Any broken iframe is a `FAIL` for a play-first build.

Any failed On-Page SEO Gate is a `FAIL` for a production/deployment-ready build.

# Output Contract

When invoked for a game keyword, deliver:

```text
0. Project config (`open-webgame.json`)
1. Resolved game identity
2. Official sources
3. Embed status
4. Runtime URL when verified
5. Search-intent brief
6. Game research brief
7. Visual direction
8. Site architecture
9. Deployable site code
10. On-page SEO implementation
11. robots.txt + sitemap.xml for production
12. Browser identity assets (`favicon.ico` + `favicon-32x32.png`)
13. Attribution/disclosure
14. QA result including Browser/axe, Lighthouse and release readiness
```

Completion summary:

```text
Game: <name>
Embed: VERIFIED | UNSUPPORTED | MANUAL CHECK REQUIRED
Primary intent: <intent>
Primary keyword/entity: <query/game>
On-Page SEO: PASS | FAIL
Canonical: <production URL or pending>
Design direction: <short description>
Pages: <list>
Deployment-ready: YES | NO
Blocking issues: <none or list>
```

# Failure Conditions

Stop and report a blocker instead of pretending the project is complete when:

- game identity cannot be resolved
- browser runtime cannot be verified for a claimed playable build
- third-party embedding is blocked
- required artwork cannot be used responsibly
- key game facts would have to be fabricated
- production canonical is unresolved
- primary content would live only inside the iframe
- On-Page SEO Gate fails
- production favicon assets/declarations are missing or broken
- Browser/axe, Lighthouse or final `qa:release` hard gate fails

A polished fake player is worse than an honest official Play link.

A beautiful page with weak On-Page SEO is not deployment-ready.
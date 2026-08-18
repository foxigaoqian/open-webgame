# Changelog

All notable project changes are documented here.

## Unreleased

### Added

- Focused game SEO guidance distilled into reusable one-entity/one-intent, player-language, index-budget and internal-link rules.
- Regression coverage for duplicate indexable intents, non-indexable page directives and exact sitemap/indexability agreement.

### Changed

- Site architecture QA now fails duplicate indexable intents, indexable pages carrying `noindex`, non-indexable HTML pages missing `noindex`, and non-indexable canonicals leaked into the sitemap.

## 0.3.3 — 2026-08-15

### Added

- `site.origin` + `site.basePath` as the canonical deployment URL model, with page-canonical consistency checks.
- `claims[].volatility` and `maxAgeDays` freshness enforcement backed by `sources[].retrievedAt`.
- Regression coverage for URL-model misuse and stale/fresh volatile claims.
- Committed `package-lock.json`, `npm ci` CI installs and `npm run check:deps` high-severity dependency auditing.
- Commit-bound `qa-artifacts/release-qa.json` evidence from the final release gate.

### Changed

- Project schema version is now `0.3.3`.
- Removed the manually editable `status.deploymentReady` project field; release readiness is computed by `qa:release`.
- Scam Artist config now models GitHub Pages as origin `https://foxigaoqian.github.io` + base path `/open-webgame`.
- Current browser-build status is classified as volatile with a freshness window.
- Browser QA workflow now executes the final `qa:release:example` aggregate itself.
- Lighthouse upgraded from 12.x to 13.4.1 after the dependency audit exposed high-severity transitive findings in the older chain.


## 0.3.2 — 2026-08-15

### Added

- Production favicon baseline: real `favicon.ico` plus a real 32×32 PNG, statically declared in every locale page.
- Browser QA enforcement for favicon declarations, HTTP responses, MIME types and PNG/ICO file signatures.
- Live HTTP QA discovery of favicon URLs from every indexable locale page, including production MIME validation.
- `npm run qa:release` as the single aggregate release-readiness command covering live gates, Browser/axe and Lighthouse.

### Changed

- `SKILL.md`, `AGENTS.md`, Zero-Config build briefs, site blueprint and final QA now treat browser-tab identity as a production hard gate.
- `npm run qa` no longer prints a premature `Deployment-ready: YES`; it reports non-browser gate status and leaves final readiness to `qa:release`.
- The minimal iframe example now follows the least-privilege rule instead of requesting gyroscope, accelerometer and web-share by default.
- The previously stale Machine-Enforced Gates section in `SKILL.md` now lists the current content/site/i18n/security/HTTP/browser/Lighthouse pipeline.
- Package version bumped to `0.3.2`.

## 0.3.1 — 2026-08-14

### Added

- Strict AJV validation for `open-webgame.json`; unknown and misspelled project fields now fail config QA.
- Pass/fail regression fixtures and Node test coverage for schema, SEO image-alt behavior and multilingual hreflang relationships.
- Optional multilingual `i18n` project contract with default language, x-default language and locale prefixes.
- `pages[].language` and `pages[].translationKey` for alternate-language page relationships.
- `npm run check:i18n` for html language, self-canonical, reciprocal hreflang, x-default and multilingual sitemap checks.
- `--languages en,ja,ko` support in Zero-Config bootstrap.
- `npm run check:http` for live canonical, Open Graph image, robots sitemap and sitemap URL validation.
- axe WCAG 2 A/AA checks in Playwright Browser QA.
- Real runtime child-frame boot checks and explicit Reload navigation-cycle verification.
- Lighthouse mobile-shell QA with category thresholds and a CLS hard limit.
- `docs/multilingual.md` and `docs/quality-gates.md`.

### Changed

- On-Page SEO audit now correctly accepts `alt=""` for decorative images and fails only when the `alt` attribute is omitted entirely.
- SEO audit now enforces singular canonical/meta description/Open Graph fields and reports heading-hierarchy jumps.
- CI installs QA dependencies and runs regression tests before the real example gates.
- Browser QA artifacts now include axe reports, real screenshots and Lighthouse output when the run completes.
- Scam Artist project config explicitly records its current single-language English state; the live example itself is not presented as multilingual.

## 0.3.0 — 2026-08-14

### Added

- Content provenance model with `sources[]` and source-backed `claims[]`.
- Multi-page project contract with `pages[]` and automated site-architecture checks.
- Security configuration for iframe capabilities and blank-target link hardening.
- `npm run check:content` provenance gate.
- `npm run check:site` route/canonical/sitemap/orphan-risk gate.
- `npm run check:security` iframe/link security gate.
- Playwright browser QA that runs the real site at 1440px, 768px and 390px widths.
- Browser QA screenshots as GitHub Actions artifacts.
- Aggregate QA now includes config, provenance, site architecture, On-Page SEO, security and embed checks.

### Changed

- Project schema version is now `0.3`.
- Zero-Config bootstrap now creates provenance, page and security sections by default.
- Scam Artist example now records official sources and verified factual claims.
- Scam Artist iframe permissions were reduced from the host's broad default set to the capabilities currently required by the demo workflow.
- Deployment readiness now expects real browser QA before first production launch.

## 0.2.0 — 2026-08-14

### Added

- Zero-Config Mode for single-keyword agent workflows.
- `open-webgame.json` as the single-source project contract.
- JSON Schema for project configuration.
- `npm run init:game` project bootstrap CLI.
- Automated config hard gate.
- Automated On-Page SEO audit.
- Embed configuration/live HTTP verification command.
- Unified QA runner with deployment-ready failure semantics.
- CI enforcement against the real Scam Artist example.
- Production `robots.txt` and `sitemap.xml` in the live example.
- Dedicated Zero-Config and project-config documentation.
- Issue templates for bugs, feature requests, embed failures and game-case requests.

### Changed

- Scam Artist example now uses the live GitHub Pages canonical.
- Scam Artist H1 now explicitly identifies the game entity.
- Open Graph and Twitter metadata are aligned with the live case URL.
- Production readiness is now expected to be machine-checkable where possible, not only documented.

## 0.1.0 — 2026-08-14

### Added

- Initial Open WebGame agent skill.
- Real game/entity research workflow.
- HTML5 runtime discovery and iframe verification rules.
- Game-native visual design principles.
- Mandatory On-Page SEO standard and QA checklist.
- Scam Artist full generated example and live GitHub Pages demo.
- Goblincremental failure-mode case study.

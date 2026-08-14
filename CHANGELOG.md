# Changelog

All notable project changes are documented here.

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

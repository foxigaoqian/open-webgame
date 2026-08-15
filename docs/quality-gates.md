# Quality Gates

Open WebGame treats release readiness as computed evidence, not a manually stored claim.

## Strict project schema + URL consistency

```bash
npm run check:config -- --config path/to/open-webgame.json
```

Schema `0.3.3` rejects unknown keys and enforces the `site.origin` + `site.basePath` deployment model. Semantic config QA additionally verifies that:

- origin is HTTPS scheme + host only
- deployment subpaths live only in `basePath`
- homepage canonical equals origin + basePath
- page canonicals match origin + basePath + route
- resolved research is not left in `site.mode = auto`
- On-Page SEO pass uses a real production URL

## Source provenance + freshness

```bash
npm run check:content -- --config path/to/open-webgame.json
```

Every tracked claim declares `volatility: stable | volatile`.

Volatile facts require `maxAgeDays` and at least one referenced source with `retrievedAt`. A claim older than its freshness window is a hard failure. Examples include current browser availability, current release state, hosted build/version and price/availability.

## Regression tests

```bash
npm test
```

Coverage includes strict schema, typo rejection, origin/basePath misuse, fresh/stale volatile claims, image-alt semantics and multilingual hreflang/x-default relationships.

## Dependency reproducibility + security

The repository commits `package-lock.json`.

```bash
npm ci
npm run check:deps
```

`check:deps` runs `npm audit --audit-level=high`. A high/critical dependency advisory is a hard CI failure. Do not switch CI back to an unlocked `npm install` workflow merely to make an audit problem disappear.

## On-Page SEO

```bash
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
```

Important image rule:

- informative image: meaningful `alt="..."`
- decorative image: `alt=""`
- missing `alt` attribute: fail

When `status.onPageSeo = "pass"`, production robots and sitemap requirements are enforced directly; they no longer depend on a stored readiness boolean.

## Browser identity / favicon

Every production site requires real binary `favicon.ico` and `favicon-32x32.png` assets, declared statically in every locale page `<head>`.

Browser and live HTTP QA validate declarations, URL resolution, HTTP response, MIME type and file signatures.

## Live HTTP resources

```bash
npm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

The live gate checks page canonicals, `og:image`, favicon URLs, robots sitemap and sitemap URLs. Dead/invalid production resources block release.

## Browser + accessibility QA

```bash
npx playwright install chromium
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
```

Browser QA covers desktop/tablet/mobile shells, overflow, multilingual switcher behavior, favicon resources, lazy player wiring, real child-frame boot/reload, Fullscreen controls, browser errors, screenshots and axe WCAG 2 A/AA host-shell checks.

## Lighthouse

```bash
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site
```

Current hard thresholds:

```text
Performance      >= 60
Accessibility    >= 85
Best Practices   >= 80
SEO              >= 90
CLS              <= 0.15
LCP              <= 4.0s
```

The game runtime remains lazy, so Lighthouse measures the owned website shell rather than charging the host shell for a third-party game's intentional payload.

## Aggregate non-browser QA

```bash
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html --offline
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

`npm run qa` never grants final release readiness. It reports non-browser status only.

## Final release readiness

```bash
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

Release preconditions require:

- `status.research = "resolved"`
- `status.onPageSeo = "pass"`
- `status.blockingIssues = []`

Then the command runs live non-browser gates, Browser/axe and Lighthouse.

Every run writes:

```text
qa-artifacts/release-qa.json
```

The artifact records:

- pass/fail
- computed `deploymentReady`
- `checkedAt`
- tested commit SHA
- config/site directory
- release precondition errors
- blocking issues
- each aggregate check result

There is intentionally no editable `status.deploymentReady` field in the project config. Only a passing release artifact bound to the tested commit is valid release evidence.

A failed hard gate means:

```text
Deployment-ready: NO
```

# Quality Gates

Open WebGame treats `deployment-ready` as a testable state, not a writing claim.

## Strict project schema

Project config is validated with AJV against `schema/open-webgame.schema.json`.

Unknown keys fail validation. This intentionally catches silent mistakes such as:

```json
{
  "seo": {
    "primayKeyword": "Game Name"
  }
}
```

Use:

```bash
npm run check:config -- --config path/to/open-webgame.json
```

Schema validation checks structure. Semantic gates still verify relationships such as play-first mode requiring a verified runtime and deployment-ready projects requiring a real production canonical.

## Regression tests

Run:

```bash
npm test
```

The repository includes pass/fail fixtures so future changes cannot silently weaken important rules.

Current regression coverage includes:

- a valid strict-schema project
- rejection of unknown/misspelled config properties
- decorative images with `alt=""`
- rejection of images that omit the `alt` attribute entirely
- valid multilingual hreflang clusters
- rejection of multilingual pages missing `x-default`

## On-Page SEO

```bash
npm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html
```

Important image rule:

- informative image: meaningful `alt="..."`
- decorative image: `alt=""`
- no `alt` attribute at all: fail

The audit also checks one canonical, one meta description, required Open Graph metadata, game/entity identification, heading structure warnings, crawlable content, JSON-LD expectations, player/runtime consistency, robots and sitemap requirements.

## Live HTTP resources

Offline HTML can look correct while the production URLs are broken.

Run:

```bash
npm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

The live gate resolves and checks production-facing resources including:

- configured canonical URLs
- indexable page canonicals
- `og:image`
- sitemap URL declared in `robots.txt`
- URLs listed in `sitemap.xml`

A 404/5xx or network failure is a hard failure in live QA.

## Browser + accessibility QA

Install Chromium once:

```bash
npx playwright install chromium
```

Then run:

```bash
npm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site
```

Browser QA checks approximately 1440px, 768px and 390px widths and stores evidence in `qa-artifacts/`.

It checks:

- page boot
- visible H1
- horizontal overflow
- lazy player CTA behavior
- iframe `src` assignment
- a real child frame navigation to the configured runtime origin
- Reload behavior and runtime re-boot
- Fullscreen control presence when available
- page/console errors
- real desktop/tablet/mobile screenshots
- axe WCAG 2 A/AA results for the host page shell

Serious and critical axe violations fail the browser gate. Third-party game iframe contents are excluded from host-page axe scoring because Open WebGame does not control the embedded game's DOM.

## Lighthouse

Run:

```bash
npm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site
```

The mobile-shell Lighthouse gate stores `qa-artifacts/lighthouse.json` and currently requires at least:

```text
Performance      60
Accessibility    85
Best Practices   80
SEO              90
CLS              <= 0.15
LCP              <= 4.0s hard limit
```

LCP between 2.5s and 4.0s is surfaced as a warning and should still be optimized toward <= 2.5s. LCP above 4.0s is a hard failure. High Total Blocking Time is also surfaced for optimization work.

The browser game is normally lazy-loaded, so Lighthouse evaluates the website shell before the heavy game runtime is intentionally started.

The Scam Artist regression case demonstrates why this gate exists: replacing an oversized first-screen image and lazy-loading below-fold screenshots reduced measured mobile-shell LCP from about 7.0s to about 1.9s in CI while keeping the source artwork on the creator's existing itch-hosted image infrastructure.

## Aggregate QA

Offline, deterministic checks:

```bash
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html --offline
```

Full live checks:

```bash
npm run qa -- --config path/to/open-webgame.json --html path/to/index.html
```

First production launch additionally requires Browser QA and Lighthouse.

A failed hard gate means:

```text
Deployment-ready: NO
```

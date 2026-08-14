# Multilingual SEO

Open WebGame supports real multilingual site generation. This is not a translation-widget feature.

A multilingual build must create separate crawlable routes, localized metadata/content, reciprocal `hreflang`, `x-default`, self-canonicals and multilingual sitemap alternates.

## Bootstrap

Single language remains the Zero-Config default:

```bash
npm run init:game -- "Game Name"
```

Request multiple languages when bootstrapping:

```bash
npm run init:game -- "Game Name" --languages en,ja,ko
```

The first language is the default language. Open WebGame normally keeps the default language at the root and prefixes other languages:

```text
/
/ja/
/ko/
```

Do not generate locale routes until useful localized content can be produced.

## Project config

```json
{
  "site": {
    "language": "en"
  },
  "i18n": {
    "enabled": true,
    "defaultLanguage": "en",
    "xDefaultLanguage": "en",
    "languages": [
      { "code": "en", "label": "English", "prefix": "" },
      { "code": "ja", "label": "日本語", "prefix": "/ja" },
      { "code": "ko", "label": "한국어", "prefix": "/ko" }
    ]
  }
}
```

Every indexable multilingual page also records a language and a translation relationship:

```json
{
  "path": "/ja/how-to-play/",
  "file": "ja/how-to-play/index.html",
  "intent": "localized Japanese how-to-play intent",
  "canonical": "https://example.com/ja/how-to-play/",
  "indexable": true,
  "language": "ja",
  "translationKey": "how-to-play"
}
```

Pages with the same `translationKey` are alternate-language versions of the same page purpose.

## Localization rules

Do not mechanically translate one English SEO page and call the work finished.

For each language:

- research how users in that language refer to the game and the target intent
- localize title, meta description, H1, opening copy, headings, FAQ, image alt text and visible navigation
- keep factual game claims aligned with the same verified source base
- localize structured-data text fields when appropriate
- preserve the same product/game identity while adapting search phrasing naturally
- avoid keyword stuffing and translated doorway pages

The design system may remain shared across languages, but text length and typography must be tested in every locale.

## Canonical and hreflang

Each locale page must self-canonicalize.

Example on every member of one translation group:

```html
<link rel="canonical" href="https://example.com/ja/how-to-play/">
<link rel="alternate" hreflang="en" href="https://example.com/how-to-play/">
<link rel="alternate" hreflang="ja" href="https://example.com/ja/how-to-play/">
<link rel="alternate" hreflang="ko" href="https://example.com/ko/how-to-play/">
<link rel="alternate" hreflang="x-default" href="https://example.com/how-to-play/">
```

Rules:

- include the current page itself in the hreflang cluster
- alternates must be reciprocal
- `x-default` must point to the configured fallback language
- never canonicalize all language pages back to English
- do not mix language and country codes unless the actual locale distinction is required

## Language switcher

Provide a visible, keyboard-accessible language switcher when `i18n.enabled = true`.

Prefer switching to the corresponding page in the same `translationKey`. For example:

```text
/how-to-play/ -> /ja/how-to-play/
```

Do not always send users back to the homepage when an equivalent localized page exists.

## Sitemap

Deployment-ready multilingual sites need the XHTML namespace and alternate links for each translated URL.

```xml
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/how-to-play/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/how-to-play/" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://example.com/ja/how-to-play/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/how-to-play/" />
  </url>
</urlset>
```

## QA

Run:

```bash
npm run check:i18n -- --config path/to/open-webgame.json --site-dir path/to/site
```

The gate checks:

- configured language uniqueness
- default language consistency
- `pages[].language`
- `pages[].translationKey`
- missing language versions in a translation group
- `<html lang>`
- self canonical
- reciprocal language alternates
- `x-default`
- multilingual sitemap namespace and alternates for deployment-ready builds

A failed multilingual SEO gate means `deployment-ready: NO`.

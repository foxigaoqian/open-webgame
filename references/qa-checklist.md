# QA Checklist

A website is not complete because the hero looks good. It is complete only when the game, design, content, On-Page SEO, responsive behavior, performance and attribution all pass.

## Game Runtime

- [ ] Correct game entity was resolved
- [ ] Browser availability was confirmed
- [ ] Actual runtime URL is used
- [ ] Project detail page is not used as the runtime iframe
- [ ] Game loads inside the third-party page
- [ ] Mouse interaction works
- [ ] Keyboard interaction works when relevant
- [ ] Touch was tested if mobile play is claimed
- [ ] Fullscreen was tested when offered
- [ ] Reload works
- [ ] Official fallback link works
- [ ] Broken embed is never presented as playable

## Visual Design

- [ ] Palette was derived from the game
- [ ] Typography treatment matches the game mood
- [ ] Card/border treatment matches the game style
- [ ] Artwork is not stretched
- [ ] Site is not simply a recolored previous project
- [ ] Hero clearly identifies the game
- [ ] Player is visually prominent
- [ ] CTA labels match the game's tone without becoming misleading

## Content

- [ ] Game description is factually grounded
- [ ] Core loop is accurate
- [ ] Controls are verified
- [ ] Features are real
- [ ] Tips are actionable
- [ ] No fictional codes, characters, upgrades or modes
- [ ] FAQ answers match current official information
- [ ] Release/demo/prototype status is current
- [ ] Important indexable content exists outside the iframe
- [ ] Page is not thin filler wrapped around a game player

# Mandatory On-Page SEO Gate

A production site cannot pass QA unless every applicable item below passes.

## Search intent and topical clarity

- [ ] Primary game entity is explicitly defined
- [ ] Primary search intent is explicitly defined
- [ ] Primary keyword/query is natural and accurate
- [ ] Homepage opening section makes the game/topic obvious without relying on the iframe
- [ ] Game name appears naturally in the important page signals

## Title and meta

- [ ] Every important indexable page has a unique descriptive title
- [ ] Title clearly identifies the game/page intent
- [ ] No keyword stuffing in title
- [ ] Every important page has a useful unique meta description
- [ ] Meta description matches visible page content

## H1 and headings

- [ ] Exactly one normal H1 per page
- [ ] Homepage H1 clearly identifies the game/topic
- [ ] H1 is not only a slogan
- [ ] H2/H3 hierarchy is logical
- [ ] Headings describe real sections rather than keyword variants

## URL and canonical

- [ ] Production URLs are clean and stable
- [ ] Every important indexable page has a self-referencing canonical
- [ ] Canonical uses the intended production URL
- [ ] No `example.com`, localhost, preview or staging canonical remains in production
- [ ] Duplicate URL variants are not intentionally indexable

## Content and keyword use

- [ ] Content satisfies the real player intent
- [ ] Exact game name is used naturally, not mechanically repeated
- [ ] No fixed keyword-density target is used
- [ ] No hidden SEO text
- [ ] No giant keyword footer
- [ ] No synonym/keyword stuffing blocks
- [ ] No doorway pages
- [ ] No near-identical routes targeting the same intent
- [ ] Multi-page expansion only exists for distinct useful topics

## Internal links

- [ ] Important pages are reachable with normal crawlable `<a href>` links
- [ ] Anchor text is descriptive where useful
- [ ] No important orphan pages
- [ ] Related guides link to one another where it helps users

## Images

- [ ] Informative images have meaningful alt text
- [ ] Decorative images use empty alt where appropriate
- [ ] Alt text is not keyword stuffed
- [ ] Image dimensions/aspect ratio are reserved to reduce layout shift
- [ ] Likely LCP hero image is not unnecessarily lazy-loaded
- [ ] Below-the-fold screenshots are lazy-loaded when practical
- [ ] Site-owned images are compressed
- [ ] Artwork is not stretched

## Crawlability and semantics

- [ ] `<html lang>` is set correctly
- [ ] Important content exists in HTML outside the game iframe
- [ ] Important navigation uses crawlable links
- [ ] No accidental `noindex`
- [ ] Production pages/assets are not accidentally blocked by robots rules
- [ ] Core content does not require a user click to become indexable

## Open Graph and structured data

- [ ] `og:title` is accurate
- [ ] `og:description` is accurate
- [ ] `og:url` is set on production pages where used
- [ ] `og:image` is valid
- [ ] Twitter/X metadata is added when useful
- [ ] JSON-LD is accurate
- [ ] No invented ratings, review counts, prices or release dates in structured data
- [ ] FAQ schema is not treated as guaranteed rich-result traffic

## Sitemap and robots

- [ ] Production `robots.txt` exists
- [ ] Production `sitemap.xml` exists
- [ ] Sitemap contains canonical indexable production URLs only
- [ ] Staging/preview URLs are not in the production sitemap

## Performance / Core Web Vitals readiness

- [ ] Website UI loads before the heavy game payload
- [ ] Runtime is lazy-loaded after interaction when practical
- [ ] No unnecessary render-blocking libraries
- [ ] Non-game JavaScript is kept small
- [ ] Major media does not cause avoidable layout shift
- [ ] Production build is ready for LCP/INP/CLS measurement

## Search Console readiness

- [ ] Final canonical domain/URLs are known before deployment-ready status
- [ ] Sitemap is ready to submit
- [ ] Site can be verified in Google Search Console
- [ ] Canonical URLs are ready for URL Inspection / indexing checks

## Responsive

Test approximately:

- [ ] 1440px desktop
- [ ] 768px tablet
- [ ] 390px mobile

Verify:

- [ ] navigation does not overflow
- [ ] H1/game title remains readable
- [ ] hero remains readable
- [ ] buttons are usable
- [ ] player height is sufficient
- [ ] screenshots do not break layout
- [ ] long game names wrap correctly
- [ ] touch targets are usable
- [ ] no horizontal scrolling
- [ ] useful SEO body copy remains readable on mobile

## Performance

- [ ] Website UI loads before the game payload
- [ ] Runtime is lazy-loaded when practical
- [ ] Site-owned images are compressed
- [ ] Screenshots below the fold are lazy-loaded when practical
- [ ] No unnecessary framework/library weight
- [ ] Layout does not shift badly when media loads

## Attribution / Disclosure

- [ ] Developer/creator is credited
- [ ] Official game page is linked
- [ ] Site does not falsely claim official status
- [ ] Third-party hosted game is described accurately
- [ ] Game binaries are not mirrored without authorization
- [ ] Production use considers creator/host terms

## Acceptance Result

Use one of:

```text
PASS — deployment-ready
PASS WITH NOTES — deployable, non-blocking caveats documented
FAIL — blocking issue remains
```

Also report:

```text
Game Embed: PASS | FAIL
On-Page SEO: PASS | FAIL
Canonical: <production URL or pending>
Indexable pages: <list/count>
Blocking issues: <none or list>
```

Any broken iframe is a `FAIL` for a play-first build.

Any failed On-Page SEO Gate is a `FAIL` for a production/deployment-ready build.
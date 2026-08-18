# Site Blueprint

Use this as a structural blueprint, not a fixed visual template.

The first architectural decision is **not** visual style. It is the game site's content model.

# Mandatory game-type routing

Every project must be classified before the final page architecture is generated.

There are two production models:

```text
online-game
wiki
```

Do not reuse one model's page structure for the other.

## 1. Online Game model

Use `online-game` only when there is a **real, verified in-browser game runtime** that the visitor can play on the website.

Typical signals:

- official `Play in browser` / `Run game` / HTML5 build
- verified itch.io HTML5 runtime
- verified WebGL/WebAssembly/browser runtime
- the primary user intent is `play <game> online`, `play now`, `unblocked`, or similar

A project detail page, Steam store page, downloadable demo, Windows executable, mobile app, or console release is **not** an online-game runtime.

If the supposed browser runtime cannot be verified, do not fake the player and do not use the online-game architecture merely because the keyword contains a game name.

## 2. Wiki model

Use `wiki` when the game is primarily distributed as a native/downloadable game and is not verified as directly playable in the browser.

Default to Wiki for:

- Steam games
- Epic Games Store games
- GOG games
- PC/Mac/Linux downloadable games
- PlayStation/Xbox/Nintendo games
- downloadable Steam demos
- mobile-native games when no verified browser build exists
- announced/upcoming games with store pages but no browser runtime

A Steam game is therefore a Wiki site by default, even if it has a downloadable demo.

The Wiki information architecture should follow the content depth and search-intent coverage of `https://dear-passengers.com/`: useful factual coverage, current official updates, clear confirmed-vs-unknown information, developer/entity context, FAQs, related searches, and strong trust/attribution signals.

## Ambiguous or mixed distribution

If a game exists both on Steam and as a real official browser build:

1. verify the browser runtime first;
2. determine the dominant search intent for the supplied keyword;
3. choose `online-game` when the user primarily wants to play in browser;
4. choose `wiki` when the dominant intent is information, release, guide, systems, news, demo, requirements, or Steam discovery.

Do not let the existence of a Steam page automatically erase a verified browser-play intent, and do not let an unrelated unofficial browser clone convert a native game into an Online Game project.

# Online Game blueprint

For a verified browser-play project, the page should be **play-first**.

Recommended order:

```text
Navigation
Hero / game identity
Playable Game
How to Play / Controls
Core Game Loop
Features / Systems
Screenshots / Game Feel
Beginner Tips
Progression / Upgrades when verified
FAQ
Official Links / Attribution
Footer
```

## Playable Game

Place the verified runtime high on the page.

Recommended player UX:

```text
Poster/Cover
  ↓ click
Load real runtime iframe
  ↓
Reload / Fullscreen / Official fallback
```

Lazy-loading the game keeps the website fast and prevents a heavy game payload from blocking first paint.

Never iframe a Steam page, itch.io project detail page, marketing page, or guessed URL as a substitute for the actual runtime.

## Online-game Hero

Immediately communicate:

- exact game name
- what the player does
- why the game is interesting
- that the verified game can be played now
- a strong `Play` action pointing to the real runtime/player section

Prefer one strong official screenshot or artwork over decorative stock imagery.

# Wiki blueprint

For Steam/native/downloadable games, the website is an **independent game wiki / briefing / discovery site**, not a fake play page.

The homepage should provide broad topical authority around the game name and its most important search intents.

Recommended order:

```text
Navigation
Hero / exact game identity / official store CTA
Quick facts strip
Latest official news / announcements
What is <Game>?
Gameplay loop / core systems
Useful strategy / beginner guidance
Official trailer / screenshots / media
Confirmed vs Unknown / Fact Check
System Requirements / Platforms when published
Developer / Publisher entity section
Official Channels
FAQ
Related Games / Related Guides
Final official-store CTA
Attribution / independent-site disclaimer
Footer
```

This is the baseline pattern modeled after the successful `dear-passengers.com` structure. Adapt section names and visual language to the specific game rather than copying airline-themed labels or styling.

## Wiki Hero

The Wiki hero should communicate:

- exact game name
- genre / core premise
- release or availability state
- supported platform when verified
- developer/publisher when useful
- primary official action such as `View on Steam`, `Wishlist on Steam`, `Download Demo`, or `Buy` only when accurate

Do **not** show `Play Now` unless a verified browser runtime actually exists.

## Quick facts

Use a compact factual strip/card set for high-value entity information such as:

```text
Release date / window
Platform
Developer
Publisher
Genre
Single-player / multiplayer
Demo status
```

Only include verified facts.

## Latest news

For active or upcoming games, include a visible latest-news section sourced primarily from official announcements.

Rules:

- newest first
- show real dates
- distinguish official announcements from independent press coverage
- include a visible `last checked` / fact-check date
- do not manufacture updates to make the site look fresh
- treat release status, demo availability, player counts, price, supported platforms and similar facts as volatile

If there are no meaningful current updates, omit thin filler instead of fabricating a news feed.

## What is the game?

Answer the broad entity query clearly and early. Explain the actual premise and what players do using verified sources.

Avoid generic marketing filler.

## Gameplay loop / systems

Explain how confirmed systems fit together in a practical sequence.

Examples of useful patterns:

```text
Gather → Build → Automate → Expand
Explore → Fight → Loot → Upgrade
Accept mission → Prepare → Execute → Extract
Plan → Produce → Trade → Grow
```

The labels must reflect the current game's real systems.

## Strategy / beginner guidance

Write genuinely useful advice based on confirmed systems or clearly label informed recommendations as strategy suggestions rather than official mechanics.

Avoid filler such as:

```text
Practice makes perfect.
Have fun.
Try different strategies.
```

## Trailer and screenshots

Use official trailers and official screenshots where possible. Media should support search intent and understanding, not act as decorative padding.

## Confirmed vs Unknown

For unreleased, early-access, demo-stage, or frequently changing games, explicitly separate:

```text
Confirmed
Not announced / Unknown
```

This is a core Wiki trust pattern. Do not turn rumor into fact merely to create more SEO text.

## System requirements / platforms

When officially published, summarize real requirements and supported platforms in a scan-friendly block.

If recommended requirements, Steam Deck support, console releases, crossplay, controller support, etc. are not announced, say so only when that missing information is a likely user question.

## Developer / publisher entity section

Give search engines and readers strong entity context:

- who develops the game
- who publishes it
- official studio link
- relevant verified studio facts when useful

Do not pad this section with unrelated company biography.

## Official channels

Link verified first-party destinations such as:

- Steam
- official website
- official Discord
- YouTube
- X / Twitter
- Reddit only when official or clearly labeled community-run
- developer blog / Steam announcements

## Wiki FAQ

Questions should cover real search friction, for example:

- What is <Game>?
- When is the release date?
- Is there a demo?
- What platforms is it on?
- Is it multiplayer/co-op?
- Can I play it alone?
- What are the PC requirements?
- Who made it?
- Is it available on Steam Deck / console / Mac?
- Where are the official updates?

Only answer what is verified. Use `not announced` where that is the accurate answer.

## Related games / related guides

Use this section to strengthen topical context and internal linking when there are genuinely relevant titles or site pages.

Do not generate unrelated game cards just to increase word count.

## Trust pages for Wiki sites

A production Wiki site should normally include crawlable trust pages when the site is meant to grow beyond a throwaway experiment:

```text
/about
/contact
/privacy
/terms-or-disclaimer
```

The footer should clearly state that the site is independent/unofficial unless it is actually an official site.

# Multi-page expansion by model

Create a route only when a distinct search intent has enough real content. Do not generate thin doorway pages.

## Online Game expansion

Typical routes:

```text
/how-to-play
/controls
/tips
/upgrades
/builds
/codes
/leaderboard
/daily
/secrets
```

## Wiki expansion

Typical routes:

```text
/news
/release-date
/demo
/gameplay
/beginner-guide
/wiki/<system-or-mechanic>
/system-requirements
/platforms
/developer
/faq
```

Do not create every route automatically. Research demand and content depth first.

# Architecture hard gate

Before final UI generation, record which model is being used in the project notes/config-compatible documentation:

```text
Content model: online-game | wiki
Reason: <verified browser runtime / Steam-native distribution / dominant search intent>
```

A structural mismatch is a release blocker.

Examples:

```text
Steam game with no verified browser runtime + large fake player above the fold → FAIL
Verified HTML5 game hidden below a long wiki article with no obvious play action → FAIL
Steam game using Wiki structure with store/demo CTA and factual content → PASS
Verified browser game using play-first structure and real runtime → PASS
```

# Browser identity

Every production site needs real browser identity assets in addition to the visible page design.

Baseline deliverables:

```text
favicon.ico
favicon-32x32.png
```

Declare both statically in every page `<head>`. Nested locale routes must resolve the icon paths correctly. Do not rely on JavaScript favicon injection, and do not substitute a text/base64 placeholder with an image extension.

The favicon should be legible at tab size and should derive from the current game's visual identity when a responsible asset can be produced. It does not need to duplicate the full site logo.

# Design derivation

Create a design brief from official visual assets before coding.

Record:

```text
Dominant palette:
Accent palette:
Art style:
UI density:
Corners:
Borders:
Shadows:
Texture:
Typography mood:
Icon style:
Motion style:
```

Then translate those properties into CSS/design tokens.

The information architecture may repeat across projects; the design tokens should not.

For Wiki sites, copy the **content-depth standard** of `dear-passengers.com`, not its airline visual theme. For Online Game sites, retain the existing play-first approach and derive the UI from the game's own art direction.

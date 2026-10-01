# Entity Authority & Ranking Playbook

> Purpose: turn a technically correct game site into a source-led, entity-first site that can compete for difficult game SERPs.
> Reference pattern: Dear Passengers.
> This playbook improves ranking probability; it does not promise a Top 3 position.

# 1. The gap this closes

A site can pass every technical SEO and Lighthouse check and still rank poorly.

Technical correctness answers:

- can Google crawl it?
- is the canonical correct?
- is the page fast?
- is the HTML valid?
- is the metadata complete?

Authority architecture answers a different set of questions:

- why should this site be understood as a strong source for this game?
- does it cover the entity and the player's real questions?
- does it update when the game changes?
- can a reader trace important claims?
- does the site grow by evidence or by mass-producing pages?
- does the homepage consolidate authority instead of behaving like a generic article feed?

For guide/wiki projects, both layers are required.

# 2. Two production goals

Open WebGame has two different outcomes.

## Play-first

For a verified browser game:

> Give the user the real playable experience fast, then support it with useful crawlable content.

## Entity-authority

For a Steam/native/upcoming game:

> Become a maintained independent source for the game entity and its highest-value questions.

Do not force the play-first mental model onto a Steam game.

# 3. Mandatory SERP baseline before architecture

Before choosing routes, record a current search baseline.

Check:

1. exact game-name SERP;
2. "<game> game";
3. official store/entity result;
4. top competing independent sites;
5. high-frequency autocomplete / related questions when available;
6. community questions from Steam/Reddit/official Discord when accessible;
7. language-specific SERPs for any locale being considered.

Record at minimum:

- query;
- search intent;
- current result archetypes;
- obvious content gaps;
- stale/incorrect competitor coverage;
- whether the game name is ambiguous with a common word/entity;
- whether the SERP is pre-release, launch, post-release, or mature.

Do not copy competitors. Use them to understand what Google is already rewarding and what users still cannot answer well.

# 4. Entity homepage

A strong wiki homepage is not a blog index.

It is the canonical entity document.

Typical modules:

- exact game identity and one-sentence definition;
- official store CTA;
- current status / quick facts;
- latest meaningful official update;
- what the player actually does;
- gameplay loop / core systems;
- important current questions;
- confirmed vs unknown, or confirmed vs player-reported, where relevant;
- system/platform/device information;
- developer / publisher context;
- official channels;
- FAQ preview;
- links into maintained guides;
- final official CTA;
- independent-site disclosure.

The homepage should remain useful even after deep pages exist.

# 5. Dated reports + maintained guides

Do not choose between "news" and "evergreen."

Use both when the game is active.

## Dated reports

Preserve:

- what changed;
- when it changed;
- source;
- what remained unknown at that time.

Good for:

- major announcement;
- important patch;
- release milestone;
- demo;
- platform announcement;
- major roadmap/update.

## Maintained guides

Keep one stable URL for questions whose answers evolve:

- release/demo tracker;
- bugs;
- platforms;
- controller;
- requirements;
- multiplayer;
- languages;
- mechanics.

Update the existing URL instead of creating a new SEO page every time one field changes.

# 6. Central editorial hub

A growing wiki should normally have one crawlable hub such as:

- /guides/
- /news/
- /briefings/

It should separate:

1. latest verified updates;
2. maintained guides;
3. how the editorial/source process works.

This is not a chronological blog archive only.

# 7. Dedicated FAQ

A dedicated FAQ page can consolidate broad user friction that is too small for its own page.

Use it to answer and route:

- release / availability;
- platforms;
- multiplayer / solo;
- controller / Steam Deck;
- requirements;
- demo;
- languages;
- common gameplay blockers.

Questions that grow into independent search intents can later become dedicated pages.

# 8. Public source / claim ledger

For authority-mode projects, consider a public evidence page.

Recommended fields:

- claim;
- status;
- primary source;
- last checked;
- pages using the claim;
- what event could change it.

Recommended visible states:

- Official
- Developer Confirmed
- Verified in Current Build
- Player Report
- Under Verification
- Unknown

Do not label a community workaround "confirmed" unless the developer or direct reproducible verification supports it.

# 9. Query-to-page decision

Never use:

> query exists = create page

Use:

    new question
        ↓
    does a parent page already satisfy it?
      ├─ yes → improve parent page
      └─ no
          ↓
    is the intent repeated / independently useful?
      ├─ no → FAQ or ignore
      └─ yes
          ↓
    can the page provide substantial original value?
      ├─ no → keep consolidated
      └─ yes → create stable URL

For live sites, GSC impressions are especially useful evidence for splitting a parent topic into a child page.

# 10. Lifecycle

## V0 — Research baseline

- entity resolution
- official-source baseline
- SERP baseline
- competitor archetypes
- player-question baseline

## V1 — Entity establishment

- entity homepage
- central hub
- FAQ
- source system
- core high-intent guides

## V1.5 — Freshness / evidence

- dated reports
- trackers
- claim ledger
- revision discipline
- last-checked state

## V2 — Topic depth

- mechanics
- troubleshooting
- characters/customers/quests only when demanded
- achievements/reference
- version-confusion pages

## V3 — Locale depth

- localized entity pages first when appropriate
- deep localized guides only when real demand exists

## V4 — Adjacent audience

- related games or topics only after the core entity is stable
- choose audience overlap, not random high-volume games

## V5 — Utility / engagement

- calculators
- checklists
- trackers
- printable references
- verified browser-play pages when relevant

## V6 — Authority moat

- build/version database
- revision log
- query inbox
- original issue taxonomy
- correction log
- reusable original data

Do not advance by calendar alone. Advance when search and product evidence justify it.

# 11. Multilingual rule

Website editorial language and in-game language support are separate facts.

A website may publish an explanation in a language the game does not support, but it must never imply that the game software supports that language.

Do not automatically mirror the full site into every locale.

Prefer:

1. localize the entity homepage;
2. monitor locale search demand;
3. create deep localized pages when justified;
4. output hreflang only for real equivalents.

# 12. New-trend / launch-window mode

For a newly announced or newly launched game, speed matters, but accuracy matters more.

Prioritize:

- exact entity;
- stable URLs;
- official-source coverage;
- questions people are already asking;
- fast corrections;
- current build/status;
- strong internal linking.

Avoid:

- 100 AI pages on day one;
- thin NPC/fabric/item pages;
- made-up future features;
- daily fake "updated" dates;
- irrelevant related games before the main topic is understood.

# 13. Ranking objective

A Top 3 goal is an outcome target, not a guarantee.

Track:

- indexation;
- impressions by query;
- first long-tail visibility;
- CTR;
- average position by topic cluster;
- homepage impressions for the exact entity;
- branded/direct traffic;
- natural backlinks/citations;
- content decay;
- update speed.

The skill should optimize the controllable system, not claim a ranking it cannot guarantee.

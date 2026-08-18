# Site Blueprint

Use this as a structural blueprint, not a fixed visual template.

## Recommended single-page order

```text
Navigation
Hero
Playable Game
Core Game Loop
Features / Systems
Screenshots / Game Feel
Beginner Tips
Controls / Progression
FAQ
Official Links / Attribution
Footer
```

## Browser identity

Every production site needs real browser identity assets in addition to the visible page design.

Baseline deliverables:

```text
favicon.ico
favicon-32x32.png
```

Declare both statically in every page `<head>`. Nested locale routes must resolve the icon paths correctly. Do not rely on JavaScript favicon injection, and do not substitute a text/base64 placeholder with an image extension.

The favicon should be legible at tab size and should derive from the current game's visual identity when a responsible asset can be produced. It does not need to duplicate the full site logo.

## Hero

The hero should immediately communicate:

- exact game name
- what the player does
- why the game is interesting
- whether the player can start now

Prefer one strong official screenshot or artwork over decorative stock imagery.

## Playable Game

When embed verification succeeds, place the game high on the page.

Recommended player UX:

```text
Poster/Cover
  ↓ click
Load real runtime iframe
  ↓
Reload / Fullscreen / Official fallback
```

Lazy-loading the game keeps the website fast and prevents a heavy game payload from blocking first paint.

## Game Loop

Explain the real loop in 3–6 steps.

Examples of useful patterns:

```text
Draw → Submit → Score → Retry
Gather → Build → Automate → Prestige
Wash → Dry → Collect → Complete
Place → Earn → Upgrade → Expand
```

The labels must reflect the current game's actual systems.

## Feature Blocks

Potential verified systems:

- score
- resources
- upgrades
- daily challenge
- rooms
- collection
- prestige
- spells
- automation
- leaderboard

Do not add a system merely because another game site had it.

## Tips

Write tips that help a real beginner.

Avoid generic filler such as:

```text
Practice makes perfect.
Have fun.
Try different strategies.
```

Prefer concrete advice tied to real mechanics.

## FAQ

Good questions usually come from first-session friction:

- What is this game?
- Is it free?
- Can I play in browser?
- Does it work on mobile?
- What are the controls?
- Does progress save?
- How does scoring/progression work?
- Who made it?
- Where is the official page?

Only answer what is verified.

## Optional multi-page expansion

Add only when there is real content depth:

```text
/how-to-play
/tips
/guide
/wiki
/upgrades
/builds
/codes
/leaderboard
/daily
/secrets
/calculator
/release-date
```

Each page must satisfy a distinct user intent. Do not generate thin doorway pages.

Classify every proposed route before building it. Index only pages with distinct standalone value. Keep useful duplicate, tool-state or operational routes accessible with `noindex,follow`, omit them from sitemap/hreflang output, and follow [`focused-game-seo.md`](./focused-game-seo.md).

## Design derivation

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

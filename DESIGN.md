# Design Direction

## Principle

Open WebGame does not define one visual theme for every generated site.

The reusable part is the **production system and information architecture**. The visual system must be derived again from the current game's official artwork, screenshots, UI, genre and interaction model.

> Repeat the structure. Re-derive the design.

## Visual brief

Before coding, record:

```text
Game:
Genre:
Art style:
Dominant palette:
Accent palette:
UI density:
Corners:
Borders:
Shadows:
Texture:
Typography mood:
Icon style:
Motion style:
Primary interaction:
Player mood:
```

These observations should come from official or clearly attributable game material, not from the game title alone.

## Translation into UI

Use the brief to make concrete design decisions.

### Cute / cozy / pet / casual

Often benefits from:

- softer palettes
- larger radii
- more generous spacing
- illustrated/sticker-like components
- friendly microcopy
- lower information density

### Drawing / precision / challenge

Often benefits from:

- cleaner geometry
- visible score/challenge hierarchy
- restrained decoration
- grid/paper/measurement motifs when appropriate
- fast retry-oriented interactions

### Incremental / management / strategy

Often benefits from:

- resource counters
- denser hierarchy
- upgrade/progression panels
- strong state feedback
- compact game-like controls

### Pixel / dark / idle / roguelike

Often benefits from:

- harder edges
- lower radii
- high-contrast surfaces
- pixel-compatible type treatment
- stronger shadow/texture separation
- status-bar and resource-panel language

These are heuristics, not templates.

## Player prominence

When the runtime is verified, the game player should be visually important and appear high on the page.

Recommended pattern:

```text
Hero / identity
↓
Playable game
↓
How to play / systems / tips / screenshots / FAQ
```

The surrounding UI should support the game rather than visually overpower it.

## Repository and showcase imagery

When documenting Open WebGame or presenting generated examples, prefer **real screenshots of actual generated pages** over illustrated mockups of imaginary interfaces.

Rules:

- README hero/preview images should come from a real generated site whenever a usable example exists
- show the actual first screen or another real viewport capture so viewers can judge the output honestly
- do not redraw the website inside a promotional illustration and present that as if it were a product screenshot
- lightweight branding, borders or labels may be added around a real screenshot, but the site UI itself should remain authentic
- if an image is conceptual rather than a real capture, label it clearly as concept artwork

The project should prove what it generates by showing the generated result.

## Responsive behavior

Desktop, tablet and mobile should be designed intentionally.

At minimum verify:

- ~1440px desktop
- ~768px tablet
- ~390px mobile

Mobile requirements:

- navigation must not overflow
- the H1 must wrap cleanly
- play controls must remain reachable
- touch targets should be usable
- game player height must remain practical
- horizontal scrolling is not acceptable
- do not claim strong mobile play if the embedded game is desktop-oriented

## Accessibility

Prefer:

- semantic landmarks and headings
- visible keyboard focus
- adequate contrast
- descriptive button labels
- useful image alt text
- reduced-motion-friendly behavior
- no color-only communication

## Anti-patterns

Avoid:

- generic purple/blue gaming gradients for every game
- copying the previous example and swapping colors
- decorative UI that hides the playable area
- stock imagery unrelated to the actual game
- stretched screenshots
- fake game statistics
- fake promotional mockups presented as real generated output
- text rendered only inside images when it matters for comprehension or SEO
- excessive animation that delays interaction

## Design acceptance

A design passes when a player familiar with the game could reasonably recognize the site's visual relationship to that specific game without relying only on the game title.

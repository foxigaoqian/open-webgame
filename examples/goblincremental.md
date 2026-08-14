# Case Study: Goblincremental

Goblincremental exposed the most important failure mode in this workflow.

## What went wrong

The first prototype used the itch.io project detail page as the iframe source. The site looked finished, but the game itself was not playable inside the page.

The project was clearly marked as an HTML5 browser game, yet ordinary page-text extraction did not expose the real runtime iframe URL.

## Correct lesson

When an official itch.io page shows both `Run game` and `HTML5`, do not stop just because a text parser does not show the iframe `src`.

Continue with rendered DOM, page source or network inspection until the actual runtime is found. A real itch-hosted runtime commonly follows a pattern such as:

```text
https://html-classic.itch.zone/html/<build-id>/index.html?v=<version>
```

## Workflow change

```text
resolve game
  → confirm HTML5
  → locate real runtime
  → test minimal third-party iframe
  → only then design the full site
```

The player must be verified before the full UI is treated as complete.

## Visual lesson

Goblincremental should be designed around its goblin, incremental and resource-management identity rather than receiving a generic gaming landing-page skin. The workflow is reusable; the visual system is not.

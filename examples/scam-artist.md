# Case Study: Scam Artist

This example validates the corrected play-first workflow.

## What worked

The process began by resolving the official game and confirming that a browser HTML5 build existed. The real itch-hosted runtime was located and tested before the full website was designed.

The final prototype therefore had:

- a working embedded game
- lazy loading behind a user action
- reload and fullscreen controls
- official fallback links
- game-specific guide content
- creator attribution

## Design lesson

The site used a visual system derived from the game's own pixel-art presentation instead of a generic gaming template.

## Technical lesson

Keep the verified runtime URL in one configuration object so it can be updated when the developer publishes a new browser build.

```js
const GAME = {
  name: "Scam Artist",
  officialUrl: "OFFICIAL_PROJECT_URL",
  runtimeUrl: "VERIFIED_RUNTIME_URL"
};
```

## Acceptance lesson

A project is only deployment-ready after the player itself passes QA. A polished screenshot is not proof that the embedded game works.

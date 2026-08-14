# Zero-Config Mode

Open WebGame is designed so that an agent can start from a single game keyword.

Minimum input:

```text
Goblincremental
```

or:

```text
Build a site for Goblincremental
```

The user should not have to provide the official URL, runtime iframe, visual palette, page structure, controls, SEO keyword map or content outline when those can be researched safely and accurately.

## Defaults

When only a game keyword is provided, use these defaults unless the user says otherwise:

```text
Language: English
Stack: static HTML
Research: automatic
Site mode: auto → play-first only after embed verification, otherwise guide
On-Page SEO: mandatory
Responsive design: mandatory
Performance review: mandatory
Output: complete website folder
Clarifying questions: avoid unless genuinely blocked
```

## Agent flow

1. Create or update `open-webgame.json`.
2. Resolve the exact game entity and official sources.
3. Fill `game` and set `status.research = "resolved"` only after verification.
4. Determine whether a real browser runtime exists.
5. If embedding is verified, set `site.mode = "play-first"`, `embed.status = "verified"`, and write the actual runtime URL.
6. If embedding is unsupported, set `site.mode = "guide"` and never fake a player.
7. Define search intent in `seo`.
8. Derive visual DNA in `design`.
9. Generate the site.
10. Run automated config, SEO and embed gates.
11. Run real browser/mobile QA.
12. Set `status.deploymentReady = true` only after every hard gate passes.

## CLI bootstrap

The included CLI creates the project folder and single-source config. It does **not** pretend to replace an AI agent or perform unsupported research by itself.

```bash
npm run init:game -- "Goblincremental"
```

Optional domain:

```bash
npm run init:game -- "Goblincremental" --domain goblincremental.com
```

Default output:

```text
output/goblincremental/
├── open-webgame.json
└── BUILD-BRIEF.md
```

The agent then researches the real game and progressively turns the pending config into a verified project config.

## When a clarifying question is justified

Ask only when the missing answer cannot be safely inferred or researched, for example:

- two different games have the same name and official evidence cannot resolve the intended entity
- the user asks for deployment but no target account/domain can be determined
- legal/permission boundaries require user confirmation
- the requested deployment stack conflicts with available tooling

Do not ask for information the workflow is expected to research itself.

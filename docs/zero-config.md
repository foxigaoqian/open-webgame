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
Multilingual: off unless requested
Stack: static HTML
Research: automatic
Site mode: auto → play-first only after embed verification, otherwise guide
On-Page SEO: mandatory
Content provenance: mandatory for material factual claims
Iframe permissions: least privilege
Responsive design: mandatory
Accessibility: mandatory
Performance review: mandatory
Browser QA: mandatory before first production launch
Output: complete website folder
Clarifying questions: avoid unless genuinely blocked
```

## Agent flow

1. Create or update `open-webgame.json`.
2. Resolve the exact game entity and official sources.
3. Add official/first-party research inputs to `sources[]`.
4. Add material factual statements to `claims[]` and connect them to `sourceIds`.
5. Set `status.research = "resolved"` only after the important facts are verified.
6. Determine whether a real browser runtime exists.
7. If embedding is verified, set `site.mode = "play-first"`, `embed.status = "verified"`, and write the actual runtime URL.
8. If embedding is unsupported, set `site.mode = "guide"` and never fake a player.
9. Define search intent in `seo` and intentional routes in `pages[]`.
10. If multiple languages are requested, enable `i18n`, create localized page entries with shared `translationKey` values, and localize search intent/content per language.
11. Derive visual DNA in `design`.
12. Define the minimum iframe capabilities in `security.allowedIframePermissions`.
13. Generate the site.
14. Run config, content, site, i18n, SEO, security and embed gates.
15. Run live HTTP resource QA before launch.
16. Run Playwright + axe browser QA at desktop/tablet/mobile widths and inspect the real screenshots/reports.
17. Run Lighthouse shell QA.
18. Set `status.deploymentReady = true` only after every hard gate passes.

## CLI bootstrap

The included CLI creates the project folder and single-source config. It does **not** pretend to replace an AI agent or perform unsupported research by itself.

```bash
npm run init:game -- "Goblincremental"
```

Optional domain:

```bash
npm run init:game -- "Goblincremental" --domain goblincremental.com
```

Optional languages:

```bash
npm run init:game -- "Goblincremental" --languages en,ja,ko
```

The first language becomes the default language. For multilingual builds, the bootstrap enables `i18n` and the agent must create every configured language route before the project can pass multilingual QA.

Default output:

```text
output/goblincremental/
├── open-webgame.json
└── BUILD-BRIEF.md
```

The agent then researches the real game and progressively turns the pending config into a verified project config.

## QA commands

Install dependencies:

```bash
npm install
```

Deterministic non-browser gates:

```bash
npm run qa -- --config output/goblincremental/open-webgame.json --html output/goblincremental/index.html --offline
```

Live production URL/embed gates:

```bash
npm run qa -- --config output/goblincremental/open-webgame.json --html output/goblincremental/index.html
```

First-launch browser/accessibility QA:

```bash
npx playwright install chromium
npm run qa:browser -- --config output/goblincremental/open-webgame.json --site-dir output/goblincremental
```

Lighthouse shell QA:

```bash
npm run qa:lighthouse -- --config output/goblincremental/open-webgame.json --site-dir output/goblincremental
```

The browser run is not optional evidence for a first play-first production launch. HTTP 200 and a valid iframe URL do not prove that the generated page works at real viewport sizes, that the runtime child frame actually boots, that the host shell is accessible, or that the lazy player wiring is correct.

See [`multilingual.md`](./multilingual.md) and [`quality-gates.md`](./quality-gates.md).

## When a clarifying question is justified

Ask only when the missing answer cannot be safely inferred or researched, for example:

- two different games have the same name and official evidence cannot resolve the intended entity
- the user asks for deployment but no target account/domain can be determined
- legal/permission boundaries require user confirmation
- the requested deployment stack conflicts with available tooling

Do not ask for information the workflow is expected to research itself.

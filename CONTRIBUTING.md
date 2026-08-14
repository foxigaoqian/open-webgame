# Contributing to Open WebGame

Thanks for helping improve Open WebGame.

The project is intentionally narrow: it defines a reliable workflow for turning a real game keyword into a playable, game-native, On-Page-SEO-ready website. Contributions should make that workflow more accurate, reusable, testable or easier to understand.

## Good contributions

Examples include:

- better runtime/iframe discovery techniques
- additional host-specific embed notes
- stronger On-Page SEO checks
- accessibility and mobile QA improvements
- performance guidance for heavy browser games
- clearer design-derivation rules
- accurate case studies from real generated sites
- bug fixes in example implementations
- documentation improvements

## Please avoid

- invented game facts or fake example features
- bypassing creator/host restrictions
- mirroring game binaries without authorization
- turning the repository into a game downloader or asset scraper
- generic keyword-stuffing SEO rules
- thin doorway-page strategies
- adding a fixed visual theme that every generated site must use
- weakening the iframe or SEO hard gates to make an example pass

## Before opening a pull request

Review the relevant standards:

- [`SKILL.md`](./SKILL.md)
- [`AGENTS.md`](./AGENTS.md)
- [`DESIGN.md`](./DESIGN.md)
- [`references/iframe-verification.md`](./references/iframe-verification.md)
- [`references/on-page-seo.md`](./references/on-page-seo.md)
- [`references/qa-checklist.md`](./references/qa-checklist.md)

Then check:

```text
[ ] facts are grounded in official sources or verified gameplay
[ ] the change does not confuse project pages with real runtimes
[ ] examples are labeled demo vs production accurately
[ ] On-Page SEO requirements remain intact
[ ] design guidance remains game-specific, not template-specific
[ ] rights/attribution boundaries remain clear
[ ] related docs are updated when behavior changes
```

## Pull request scope

Prefer focused pull requests. Explain:

1. what problem you are solving
2. what changed
3. how you verified it
4. whether it changes a hard gate
5. whether examples or public documentation need updates

If the change introduces a new game example, include the resolved game source, embed status, design direction, SEO status and any known limitations.

## Case study format

A useful new case study should make the result auditable:

```text
Game: <name>
Official source: <URL>
Browser build: yes / no
Embed: VERIFIED | UNSUPPORTED | MANUAL CHECK REQUIRED
Primary intent: <intent>
On-Page SEO: PASS | FAIL | NOT PRODUCTION TESTED
Design direction: <short description>
Blocking issues: <none or list>
```

Do not publish a broken build as a successful example.

## License

By contributing, you agree that your contribution will be licensed under the repository's MIT License.

from pathlib import Path


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8')


def insert_before(text, marker, addition):
    if addition.strip() in text:
        return text
    if marker not in text:
        raise SystemExit(f'marker not found: {marker}')
    return text.replace(marker, addition + '\n\n' + marker, 1)

# SKILL.md
p = 'SKILL.md'
t = read(p)
section = '''# v0.3.3 Reliability Hardening

Production configuration and release evidence must remain trustworthy over time.

## Canonical URL model

Use `site.origin` for scheme + host only and `site.basePath` for an optional deployment subpath. Do not put a path inside a domain/origin value.

Example GitHub Pages deployment:

```json
{
  "site": {
    "origin": "https://username.github.io",
    "basePath": "/game-site",
    "canonical": "https://username.github.io/game-site/"
  }
}
```

Derive page canonicals, hreflang URLs, sitemap URLs and production asset URLs from the same origin/base-path model. A mismatch is a hard config failure.

## Factual freshness

Every tracked claim must declare `volatility: "stable" | "volatile"`.

For volatile facts, also set `maxAgeDays`. The referenced source must have a current `retrievedAt`; `check:content` fails when the newest supporting source is older than the allowed window.

Treat current browser/runtime availability, release state, price/availability, active hosted build/version and similarly changeable facts as volatile. Do not let a source-backed claim become permanently trusted merely because it was once correct.

## Reproducible dependencies

This repository uses a committed `package-lock.json`. Prefer `npm ci` for QA/CI and run `npm run check:deps`. High-severity dependency audit findings are hard failures; fix or upgrade the affected dependency rather than suppressing the gate.

## Release evidence, not a readiness flag

`open-webgame.json` no longer stores an editable `status.deploymentReady` boolean. Project status stores research/SEO progress and blocking issues only.

The final readiness decision is computed by:

```bash
npm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site
```

Every run writes `qa-artifacts/release-qa.json` containing pass/fail, timestamp, tested commit SHA, blocking issues and aggregate check results. Only a passing release artifact bound to the tested code may support `Deployment-ready: YES` in the completion report.
'''
t = insert_before(t, '# Inputs', section)
t = t.replace('Do not set `status.deploymentReady = true` to bypass it.', 'Do not bypass a failing gate or claim readiness without a passing `qa:release` artifact for the tested code.')
t = t.replace('Set `status.deploymentReady` to true only after every hard gate passes.', 'Do not store a readiness boolean; run `qa:release` and preserve its commit-bound release artifact.')
t = t.replace('Set `status.deploymentReady = true` only after every hard gate passes.', 'Do not store a readiness boolean; run `qa:release` and preserve its commit-bound release artifact.')
write(p, t)

# AGENTS.md
p = 'AGENTS.md'
t = read(p)
section = '''## v0.3.3 reliability requirements

- use `site.origin` (scheme + host only) plus `site.basePath`; never mix a deployment path into a domain/origin field
- derive and validate every page canonical from the shared URL model
- every tracked claim declares `volatility`; volatile claims require `maxAgeDays` and fresh supporting `sources[].retrievedAt`
- use the committed `package-lock.json`, `npm ci` and the high-severity dependency audit gate
- do not store or manually toggle `status.deploymentReady`
- final readiness comes only from `qa:release`, which writes `qa-artifacts/release-qa.json` bound to the tested commit SHA
'''
t = insert_before(t, '## Working order', section)
t = t.replace('- a real HTTPS production canonical is required for `status.deploymentReady = true`\n- do not change readiness flags merely to silence a failing gate', '- a real HTTPS `site.origin` plus normalized `site.basePath` must resolve to the configured production canonical\n- do not claim readiness merely to silence a failing gate; require a passing commit-bound `qa:release` artifact')
t = t.replace('npm install\n', 'npm ci\n')
write(p, t)

# README.md
p = 'README.md'
t = read(p)
section = '''## v0.3.3 — Reliability Hardening

v0.3.3 closes the remaining configuration/readiness drift gaps:

```text
origin + basePath canonical model
source-backed volatile-claim freshness windows
committed package-lock + npm ci + high-severity dependency audit
commit-bound qa-artifacts/release-qa.json
```

A GitHub Pages-style deployment is represented as:

```json
{
  "origin": "https://username.github.io",
  "basePath": "/game-site",
  "canonical": "https://username.github.io/game-site/"
}
```

Final readiness is no longer stored as a manually editable project boolean. `npm run qa:release` computes the result and records the tested commit SHA and timestamp in the release artifact.

The dependency audit performed during this upgrade also exposed high-severity transitive findings in the old Lighthouse 12 toolchain; the QA stack was upgraded to Lighthouse 13.4.1 instead of weakening the audit threshold.
'''
t = insert_before(t, '## v0.3.1 — Quality Gates + Multilingual SEO', section)
t = t.replace('cd open-webgame\nnpm install', 'cd open-webgame\nnpm ci')
t = t.replace('├── package.json\n', '├── package.json\n├── package-lock.json\n')
t = t.replace('│   ├── qa.mjs\n', '│   ├── qa.mjs\n│   ├── release-qa.mjs\n')
# Add release evidence to output block if not already present.
t = t.replace('Lighthouse: PASS\nCanonical:', 'Lighthouse: PASS\nRelease evidence: qa-artifacts/release-qa.json @ <commit>\nCanonical:')
write(p, t)

# CHANGELOG.md
p = 'CHANGELOG.md'
t = read(p)
entry = '''## 0.3.3 — 2026-08-15

### Added

- `site.origin` + `site.basePath` as the canonical deployment URL model, with page-canonical consistency checks.
- `claims[].volatility` and `maxAgeDays` freshness enforcement backed by `sources[].retrievedAt`.
- Regression coverage for URL-model misuse and stale/fresh volatile claims.
- Committed `package-lock.json`, `npm ci` CI installs and `npm run check:deps` high-severity dependency auditing.
- Commit-bound `qa-artifacts/release-qa.json` evidence from the final release gate.

### Changed

- Project schema version is now `0.3.3`.
- Removed the manually editable `status.deploymentReady` project field; release readiness is computed by `qa:release`.
- Scam Artist config now models GitHub Pages as origin `https://foxigaoqian.github.io` + base path `/open-webgame`.
- Current browser-build status is classified as volatile with a freshness window.
- Browser QA workflow now executes the final `qa:release:example` aggregate itself.
- Lighthouse upgraded from 12.x to 13.4.1 after the dependency audit exposed high-severity transitive findings in the older chain.
'''
t = insert_before(t, '## 0.3.2 — 2026-08-15', entry)
write(p, t)

# Final QA checklist
p = 'references/qa-checklist.md'
t = read(p)
section = '''## Reliability / Release Evidence

- [ ] `site.origin` contains scheme + host only
- [ ] `site.basePath` contains any deployment subpath
- [ ] All page canonicals derive correctly from origin + basePath + route
- [ ] Every tracked claim declares stable/volatile freshness behavior
- [ ] Volatile claims are inside their `maxAgeDays` window
- [ ] `package-lock.json` exists and `npm ci` succeeds
- [ ] High-severity dependency audit passes
- [ ] Final `qa:release` passes
- [ ] `qa-artifacts/release-qa.json` exists and records the tested commit SHA/time
- [ ] No editable `status.deploymentReady` field is used as release evidence
'''
t = insert_before(t, '## Acceptance Result', section)
write(p, t)

# Multilingual docs: make base path explicit and remove dependency on the retired field.
p = 'docs/multilingual.md'
t = read(p)
t = t.replace('A multilingual build must create separate crawlable routes, localized metadata/content, reciprocal `hreflang`, `x-default`, self-canonicals and multilingual sitemap alternates.', 'A multilingual build must create separate crawlable routes, localized metadata/content, reciprocal `hreflang`, `x-default`, self-canonicals and multilingual sitemap alternates. All locale URLs must also respect the shared `site.origin` + `site.basePath` deployment model.')
t = t.replace('Deployment-ready multilingual sites need the XHTML namespace', 'Production multilingual sites with On-Page SEO marked pass need the XHTML namespace')
t = t.replace('multilingual sitemap namespace and alternates for deployment-ready builds', 'multilingual sitemap namespace and alternates for production On-Page SEO builds')
write(p, t)

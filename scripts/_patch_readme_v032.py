from pathlib import Path

p = Path('README.md')
text = p.read_text()

def once(old, new, label):
    global text
    if old not in text:
        raise SystemExit(f'Missing README anchor: {label}')
    text = text.replace(old, new, 1)

once(
    '- **Performance QA** — Lighthouse evaluates the lazy-loaded site shell and enforces minimum quality thresholds.\n- **No fake features**',
    '- **Performance QA** — Lighthouse evaluates the lazy-loaded site shell and enforces minimum quality thresholds.\n- **Browser identity QA** — every production site ships real PNG + ICO favicons; Browser QA and live HTTP QA verify declarations, MIME types and file validity.\n- **Release readiness** — `qa:release` is the only aggregate command allowed to return `Deployment-ready: YES`.\n- **No fake features**',
    'feature bullets',
)

once(
    '## v0.3.1 — Quality Gates + Multilingual SEO',
    '''## v0.3.2 — Browser Identity + Release Readiness\n\nv0.3.2 closes two production gaps found while testing the live multilingual case.\n\nNew hardening:\n\n```text\nStatic favicon.ico + favicon-32x32.png\nFavicon HTTP / MIME / binary-signature QA\nProduction favicon URL checks\nLeast-privilege iframe example\nNon-browser QA no longer claims final readiness\nqa:release = live gates + Browser/axe + Lighthouse\n```\n\nFinal production decision:\n\n```bash\nnpm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site\n```\n\nOnly the full release aggregate may report `Deployment-ready: YES`.\n\n## v0.3.1 — Quality Gates + Multilingual SEO''',
    'v032 section',
)

once(
    'Design a game-native play-first or guide site\n        ↓\nImplement On-Page + multilingual SEO',
    'Design a game-native play-first or guide site\n        ↓\nGenerate real static favicon/browser identity assets\n        ↓\nImplement On-Page + multilingual SEO',
    'flow favicon',
)

once(
    'First-launch browser/accessibility/performance checks:\n\n```bash\nnpx playwright install chromium\nnpm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site\nnpm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site\n```',
    '''First-launch browser/accessibility/performance checks:\n\n```bash\nnpx playwright install chromium\nnpm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site\nnpm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site\n```\n\nFinal release-readiness decision:\n\n```bash\nnpm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site\n```\n\n`npm run qa` covers non-browser gates only. It must not be treated as the final deployment-ready decision.''',
    'quality release command',
)

once(
    'Accessibility: PASS\nLighthouse: PASS\nCanonical:',
    'Accessibility: PASS\nLighthouse: PASS\nFavicon: PASS\nRelease QA: PASS\nCanonical:',
    'output contract',
)

once(
    '│   ├── lighthouse-qa.mjs\n│   └── qa.mjs',
    '│   ├── lighthouse-qa.mjs\n│   ├── qa.mjs\n│   └── release-qa.mjs',
    'repo structure',
)

p.write_text(text)

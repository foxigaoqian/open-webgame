from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f"Missing patch anchor: {label}")
    return text.replace(old, new, 1)


skill_path = Path('SKILL.md')
skill = skill_path.read_text()

skill = replace_once(
    skill,
    '8. **A broken player or failed On-Page SEO Gate means `deployment-ready: NO`.**',
    '8. **A broken player or failed On-Page SEO Gate means `deployment-ready: NO`.**\n9. **Production output must include real statically declared favicon assets and pass the full release-readiness gate before `deployment-ready: YES`.**',
    'non-negotiable favicon rule',
)

skill = replace_once(
    skill,
    'Responsive QA: mandatory\nOutput: complete website folder',
    'Responsive QA: mandatory\nBrowser identity / favicon: mandatory\nOutput: complete website folder',
    'zero-config favicon default',
)

skill = replace_once(
    skill,
    'Do not convert intentional decorative empty alt text into keyword-filled alt text.\n\n## Live production resource QA',
    '''Do not convert intentional decorative empty alt text into keyword-filled alt text.\n\n## Browser identity / favicon\n\nEvery generated production site must include real browser identity assets. Do not assume a visible site logo automatically becomes the browser-tab icon.\n\nRequired baseline for static HTML:\n\n```html\n<link rel="shortcut icon" href="./favicon.ico">\n<link rel="icon" type="image/x-icon" href="./favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">\n```\n\nRules:\n\n- generate a real binary `favicon.ico`\n- generate a real binary 32x32 PNG favicon\n- declare favicon links statically in `<head>`; do not depend on JavaScript injection\n- use correct relative/absolute paths on nested locale routes\n- keep the icon legible at browser-tab size and derive it from the current game's visual identity when appropriate\n- Browser QA must verify the favicon declarations, HTTP response, MIME type and PNG/ICO file signatures\n- Live HTTP QA must verify production favicon URLs, not only the local build\n- a missing/broken favicon is a production hard-gate failure\n\n## Live production resource QA''',
    'favicon section',
)

skill = replace_once(
    skill,
    '- horizontal overflow\n- lazy-load CTA',
    '- horizontal overflow\n- static PNG + ICO favicon declarations and valid icon resources\n- lazy-load CTA',
    'browser qa favicon bullet',
)

skill = replace_once(
    skill,
    'A relevant hard-gate failure always means `deployment-ready: NO`.',
    'A relevant hard-gate failure always means `deployment-ready: NO`. Passing this individual command list is not, by itself, the final release decision. Use `npm run qa:release` after deployment URLs are live; only the release aggregate may return `Deployment-ready: YES`.',
    'release readiness note',
)

skill = replace_once(
    skill,
    '  allow="autoplay; fullscreen *; gamepad; gyroscope; accelerometer; web-share"',
    '  allow="autoplay; fullscreen *; gamepad"',
    'least privilege iframe example',
)

skill = replace_once(
    skill,
    '- no broken placeholder links in production\n- no fake game player',
    '- no broken placeholder links in production\n- real `favicon.ico` + `favicon-32x32.png` with static `<head>` declarations\n- no fake game player',
    'implementation favicon requirement',
)

old_machine = '''# Machine-Enforced Gates\n\nWhen the repository scripts are available, run them. Documentation-only self-review is not enough when a rule can be checked mechanically.\n\n```bash\nnpm run check:config -- --config path/to/open-webgame.json\nnpm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html\nnpm run verify:embed:config -- --config path/to/open-webgame.json\nnpm run verify:embed -- --config path/to/open-webgame.json\nnpm run qa -- --config path/to/open-webgame.json --html path/to/index.html\n```\n\nThe offline embed gate validates configuration and rejects obvious project-page/runtime mistakes. The live embed command checks reachability and framing headers. Neither replaces a real browser boot/input/fullscreen/mobile smoke test.\n\nA command failure means the corresponding hard gate has not passed. Do not set `status.deploymentReady = true` to bypass it.'''
new_machine = '''# Machine-Enforced Gates\n\nWhen the repository scripts are available, run them. Documentation-only self-review is not enough when a rule can be checked mechanically.\n\n```bash\nnpm run check:config -- --config path/to/open-webgame.json\nnpm run check:content -- --config path/to/open-webgame.json\nnpm run check:site -- --config path/to/open-webgame.json --site-dir path/to/site\nnpm run check:i18n -- --config path/to/open-webgame.json --site-dir path/to/site\nnpm run check:seo -- --config path/to/open-webgame.json --html path/to/index.html\nnpm run check:security -- --config path/to/open-webgame.json --html path/to/index.html\nnpm run check:http -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site\nnpm run verify:embed:config -- --config path/to/open-webgame.json\nnpm run verify:embed -- --config path/to/open-webgame.json\nnpm test\nnpx playwright install chromium\nnpm run qa:browser -- --config path/to/open-webgame.json --site-dir path/to/site\nnpm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site\n```\n\n`npm run qa` aggregates the non-browser gates and intentionally does **not** grant final release readiness. For the final production decision run:\n\n```bash\nnpm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site\n```\n\nOnly `qa:release` may print `Deployment-ready: YES`, because it requires live HTTP/embed, Browser/axe and Lighthouse to pass in the same release decision.\n\nA command failure means the corresponding hard gate has not passed. Do not set `status.deploymentReady = true` to bypass it.'''
skill = replace_once(skill, old_machine, new_machine, 'machine gates refresh')

skill = replace_once(
    skill,
    '## Attribution\n\n- [ ] Developer is credited',
    '''## Browser identity / release quality\n\n- [ ] `favicon.ico` exists and is a valid icon file\n- [ ] `favicon-32x32.png` exists and is a valid PNG\n- [ ] Every locale declares favicon links statically in `<head>`\n- [ ] Production favicon URLs return successfully with compatible MIME types\n- [ ] Browser/axe QA passes required locales and viewports\n- [ ] Lighthouse hard thresholds pass\n- [ ] `npm run qa:release` passes before reporting deployment-ready\n\n## Attribution\n\n- [ ] Developer is credited''',
    'final qa identity section',
)

skill = replace_once(
    skill,
    '11. robots.txt + sitemap.xml for production\n12. Attribution/disclosure\n13. QA result',
    '11. robots.txt + sitemap.xml for production\n12. Browser identity assets (`favicon.ico` + `favicon-32x32.png`)\n13. Attribution/disclosure\n14. QA result including Browser/axe, Lighthouse and release readiness',
    'output contract favicon',
)

skill = replace_once(
    skill,
    '- On-Page SEO Gate fails\n\nA polished fake player',
    '- On-Page SEO Gate fails\n- production favicon assets/declarations are missing or broken\n- Browser/axe, Lighthouse or final `qa:release` hard gate fails\n\nA polished fake player',
    'failure conditions',
)

skill_path.write_text(skill)

agents_path = Path('AGENTS.md')
agents = agents_path.read_text()
agents = replace_once(
    agents,
    'Responsive QA: mandatory\nAccessibility QA: mandatory',
    'Responsive QA: mandatory\nBrowser identity / favicon: mandatory\nAccessibility QA: mandatory',
    'agents zero-config favicon',
)
agents = replace_once(
    agents,
    '### Config/readiness gate',
    '''### Browser identity gate\n\n- generate a real `favicon.ico` and real 32x32 PNG favicon\n- declare both statically in every locale page `<head>`\n- never rely on JavaScript favicon injection\n- nested locale paths must resolve to the correct icon assets\n- Browser QA validates icon declarations, MIME and file signatures\n- live HTTP QA validates production favicon URLs\n\n### Config/readiness gate''',
    'agents favicon gate',
)
agents = replace_once(
    agents,
    '- Browser QA must run at approximately 1440 / 768 / 390 widths\n- lazy game loading',
    '- Browser QA must run at approximately 1440 / 768 / 390 widths\n- favicon declarations/resources must pass on required locale shells\n- lazy game loading',
    'agents browser favicon',
)
agents = replace_once(
    agents,
    '# Lighthouse shell QA\nnpm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site\n\n# Repository regression case',
    '# Lighthouse shell QA\nnpm run qa:lighthouse -- --config path/to/open-webgame.json --site-dir path/to/site\n\n# Final release-readiness decision (live + browser/axe + Lighthouse)\nnpm run qa:release -- --config path/to/open-webgame.json --html path/to/index.html --site-dir path/to/site\n\n# Repository regression case',
    'agents release command',
)
agents = replace_once(
    agents,
    '- run Lighthouse before first production launch and fix hard-threshold failures rather than lowering the threshold to hide regressions',
    '- generate and statically declare real PNG + ICO favicons and keep favicon QA green\n- run Lighthouse before first production launch and fix hard-threshold failures rather than lowering the threshold to hide regressions\n- use `qa:release` for the final deployment-ready decision; `npm run qa` alone is not sufficient',
    'agents v031 requirements',
)
agents = replace_once(
    agents,
    '→ build play-first or guide site\n→ implement On-Page + multilingual SEO\n→ run regression + static/live gates\n→ browser + axe QA\n→ Lighthouse QA\n→ final readiness decision',
    '→ build play-first or guide site\n→ generate static favicon/browser identity assets\n→ implement On-Page + multilingual SEO\n→ run regression + static/live gates\n→ browser + axe QA\n→ Lighthouse QA\n→ qa:release\n→ final readiness decision',
    'agents working order',
)
agents_path.write_text(agents)

from pathlib import Path
from textwrap import dedent

pages = [
    (Path('examples/scam-artist-site/index.html'), './'),
    (Path('examples/scam-artist-site/ja/index.html'), '../'),
    (Path('examples/scam-artist-site/ko/index.html'), '../'),
]

for file, prefix in pages:
    text = file.read_text()
    old = (
        f'<link rel="icon" href="{prefix}favicon.ico" sizes="any">\n'
        f'<link rel="shortcut icon" href="{prefix}favicon.ico">'
    )
    new = (
        f'<link rel="shortcut icon" href="{prefix}favicon.ico">\n'
        f'<link rel="icon" type="image/x-icon" href="{prefix}favicon.ico" sizes="any">\n'
        f'<link rel="icon" type="image/png" sizes="32x32" href="{prefix}favicon-32x32.png">'
    )
    if old not in text:
        raise SystemExit(f'favicon block not found in {file}')
    file.write_text(text.replace(old, new, 1))

qa = Path('scripts/browser-qa.mjs')
text = qa.read_text()

mime_old = "  if (ext === '.png') return 'image/png';"
mime_new = "  if (ext === '.ico') return 'image/x-icon';\n  if (ext === '.png') return 'image/png';"
if mime_old not in text:
    raise SystemExit('browser QA MIME anchor not found')
text = text.replace(mime_old, mime_new, 1)

anchor = "      if (overflow) errors.push(`${label}: horizontal overflow detected.`);\n"
favicon_qa = dedent(r'''

      const faviconLinks = await page.evaluate(() => [...document.querySelectorAll('link[rel~="icon"]')].map((link) => ({
        href: link.href,
        type: link.type || '',
        sizes: link.sizes?.value || '',
      })));
      const pngIcon = faviconLinks.find((icon) => icon.type.toLowerCase() === 'image/png' && icon.sizes.split(/\s+/).includes('32x32'));
      const icoIcon = faviconLinks.find((icon) => icon.href.endsWith('/favicon.ico'));
      if (!pngIcon) errors.push(`${label}: static 32x32 PNG favicon declaration is missing.`);
      if (!icoIcon) errors.push(`${label}: ICO favicon fallback declaration is missing.`);

      for (const [kind, icon, expectedType] of [
        ['PNG', pngIcon, 'image/png'],
        ['ICO', icoIcon, 'image/x-icon'],
      ]) {
        if (!icon) continue;
        try {
          const iconResponse = await context.request.get(icon.href, { failOnStatusCode: false });
          if (!iconResponse.ok()) {
            errors.push(`${label}: ${kind} favicon returned HTTP ${iconResponse.status()}.`);
            continue;
          }
          const contentType = String(iconResponse.headers()['content-type'] || '').toLowerCase();
          if (!contentType.includes(expectedType)) {
            errors.push(`${label}: ${kind} favicon content-type is ${contentType || 'missing'}; expected ${expectedType}.`);
          }
          const body = await iconResponse.body();
          if (kind === 'PNG') {
            const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
            if (body.length < signature.length || !signature.every((byte, index) => body[index] === byte)) {
              errors.push(`${label}: PNG favicon does not contain a valid PNG signature.`);
            }
          } else if (body.length < 4 || body[0] !== 0x00 || body[1] !== 0x00 || body[2] !== 0x01 || body[3] !== 0x00) {
            errors.push(`${label}: ICO favicon does not contain a valid ICO signature.`);
          }
        } catch (error) {
          errors.push(`${label}: ${kind} favicon request failed: ${error.message}`);
        }
      }
''')
if anchor not in text:
    raise SystemExit('browser QA insertion anchor not found')
text = text.replace(anchor, anchor + favicon_qa, 1)
qa.write_text(text)

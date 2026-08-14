import { isHttpUrl, loadConfig, parseArgs, printResult } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const errors = [];
const warnings = [];
const runtimeUrl = String(config.embed?.runtimeUrl || '').trim();

if (config.site?.mode === 'play-first') {
  if (config.embed?.status !== 'verified') errors.push('play-first mode requires embed.status = "verified".');
  if (!isHttpUrl(runtimeUrl)) errors.push('play-first mode requires a valid embed.runtimeUrl.');
}

if (runtimeUrl) {
  const lower = runtimeUrl.toLowerCase();
  if (/https?:\/\/[^/]+\.itch\.io\//.test(lower) && !lower.includes('html-classic.itch.zone/')) {
    errors.push('runtimeUrl appears to be an itch.io project detail page, not the actual HTML runtime.');
  }
}

if (args.offline) {
  const ok = printResult(`Embed config audit: ${configPath}`, errors, warnings);
  process.exit(ok ? 0 : 1);
}

if (errors.length === 0 && runtimeUrl) {
  try {
    const response = await fetch(runtimeUrl, {
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
      headers: {
        'user-agent': 'Open-WebGame-Embed-Check/0.2 (+https://github.com/foxigaoqian/open-webgame)'
      }
    });

    if (!response.ok) errors.push(`Runtime returned HTTP ${response.status}.`);

    const xFrame = response.headers.get('x-frame-options');
    if (xFrame && /deny|sameorigin/i.test(xFrame)) {
      errors.push(`Runtime sends X-Frame-Options: ${xFrame}.`);
    }

    const csp = response.headers.get('content-security-policy') || '';
    const frameAncestors = csp.match(/frame-ancestors\s+([^;]+)/i)?.[1] || '';
    if (frameAncestors) {
      const normalized = frameAncestors.toLowerCase();
      if (/('none'|'self')/.test(normalized) && !/\*/.test(normalized)) {
        errors.push(`Runtime CSP may block third-party framing: frame-ancestors ${frameAncestors}.`);
      }
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      warnings.push(`Runtime returned content-type ${contentType}; verify the browser build manually.`);
    }

    const body = await response.text();
    if (body.trim().length < 50) warnings.push('Runtime response body is unexpectedly small; verify boot behavior manually.');
  } catch (error) {
    errors.push(`Live runtime request failed: ${error.message}`);
  }
}

warnings.push('HTTP/header verification cannot prove that the game fully boots or accepts input. A real browser smoke test is still required before first production deployment.');
const ok = printResult(`Embed verification: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

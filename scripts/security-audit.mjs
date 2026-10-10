import { parse } from 'node-html-parser';
import { loadConfig, parseArgs, printResult, readText } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const htmlPath = args.html || 'index.html';
const config = loadConfig(configPath);
const html = readText(htmlPath);
const errors = [];
const warnings = [];

// Case-insensitive attribute lookup. Mirrors the old attr() helper from
// lib.mjs (case-insensitive name match, '' when absent); unlike the old
// regex it also handles unquoted values and ignores tags inside comments.
function getAttr(element, name) {
  const attrs = element.attributes || {};
  const wanted = name.toLowerCase();
  for (const key of Object.keys(attrs)) {
    if (key.toLowerCase() === wanted) return attrs[key] ?? '';
  }
  return '';
}

const root = parse(html);

const security = config.security || {};
const allowed = new Set(Array.isArray(security.allowedIframePermissions) ? security.allowedIframePermissions : []);
const iframes = root.querySelectorAll('iframe');

for (let i = 0; i < iframes.length; i += 1) {
  const allow = getAttr(iframes[i], 'allow');
  if (!allow) {
    warnings.push(`Iframe ${i + 1} has no allow attribute; verify required capabilities explicitly.`);
    continue;
  }
  const permissions = allow
    .split(';')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
  for (const permission of permissions) {
    if (!allowed.has(permission)) {
      errors.push(`Iframe ${i + 1} requests undeclared permission "${permission}".`);
    }
  }
}

const sensitive = new Set(['geolocation', 'microphone', 'camera', 'midi', 'xr-spatial-tracking']);
for (const permission of allowed) {
  if (sensitive.has(permission)) warnings.push(`Sensitive iframe permission "${permission}" is explicitly allowed; confirm the game actually needs it.`);
}

if (security.requireNoopenerForBlankTargets !== false) {
  const anchors = root.querySelectorAll('a');
  for (let i = 0; i < anchors.length; i += 1) {
    if (getAttr(anchors[i], 'target').toLowerCase() !== '_blank') continue;
    const rel = new Set(getAttr(anchors[i], 'rel').toLowerCase().split(/\s+/).filter(Boolean));
    if (!rel.has('noopener')) errors.push(`target="_blank" link ${i + 1} is missing rel="noopener".`);
  }
}

if (security.allowInlineScripts === false) {
  const scripts = root.querySelectorAll('script');
  const inlineScripts = scripts.filter((el) => getAttr(el, 'src') === '');
  const executable = inlineScripts.filter((el) => getAttr(el, 'type').toLowerCase() !== 'application/ld+json');
  if (executable.length > 0) errors.push(`Inline executable scripts are disallowed by config, but found ${executable.length}.`);
}

const ok = printResult(`Security audit: ${htmlPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

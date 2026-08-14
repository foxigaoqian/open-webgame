import { attr, loadConfig, parseArgs, printResult, readText } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const htmlPath = args.html || 'index.html';
const config = loadConfig(configPath);
const html = readText(htmlPath);
const errors = [];
const warnings = [];

const security = config.security || {};
const allowed = new Set(Array.isArray(security.allowedIframePermissions) ? security.allowedIframePermissions : []);
const iframeTags = [...html.matchAll(/<iframe\b[^>]*>/gi)].map((m) => m[0]);

for (let i = 0; i < iframeTags.length; i += 1) {
  const allow = attr(iframeTags[i], 'allow');
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
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => m[0]);
  for (let i = 0; i < anchors.length; i += 1) {
    if (attr(anchors[i], 'target').toLowerCase() !== '_blank') continue;
    const rel = new Set(attr(anchors[i], 'rel').toLowerCase().split(/\s+/).filter(Boolean));
    if (!rel.has('noopener')) errors.push(`target="_blank" link ${i + 1} is missing rel="noopener".`);
  }
}

if (security.allowInlineScripts === false) {
  const inlineScripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi)];
  const executable = inlineScripts.filter((match) => !/type=["']application\/ld\+json["']/i.test(match[0]));
  if (executable.length > 0) errors.push(`Inline executable scripts are disallowed by config, but found ${executable.length}.`);
}

const ok = printResult(`Security audit: ${htmlPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

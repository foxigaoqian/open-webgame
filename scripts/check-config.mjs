import { getSiteBaseUrl, isHttpUrl, isProductionHttpsUrl, loadConfig, normalizeBasePath, normalizeUrl, parseArgs, printResult, resolveSiteUrl } from './lib.mjs';
import { validateConfigSchema } from './schema-validator.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const errors = [...validateConfigSchema(config)];
const warnings = [];

if (config.game?.officialUrl && !isHttpUrl(config.game.officialUrl)) {
  errors.push('game.officialUrl must be an http(s) URL when provided.');
}

const origin = String(config.site?.origin || '').trim();
const basePath = String(config.site?.basePath || '');
const canonical = String(config.site?.canonical || '').trim();

if (origin) {
  if (!isProductionHttpsUrl(origin)) {
    errors.push('site.origin must be a real production HTTPS origin when provided.');
  } else {
    const url = new URL(origin);
    if (url.pathname !== '/' || url.search || url.hash) errors.push('site.origin must contain only scheme + host; put deployment subpaths in site.basePath.');
    if (origin.endsWith('/')) errors.push('site.origin must not end with a trailing slash.');
  }
}

if (basePath !== normalizeBasePath(basePath)) {
  errors.push('site.basePath must be empty or a normalized leading-slash path without a trailing slash (example: /open-webgame).');
}

if (canonical && !isHttpUrl(canonical)) {
  errors.push('site.canonical must be an http(s) URL when provided.');
}

if (origin && canonical) {
  const expectedHome = getSiteBaseUrl(config);
  if (normalizeUrl(canonical) !== normalizeUrl(expectedHome)) {
    errors.push(`site.canonical must equal origin + basePath (${expectedHome}).`);
  }
}

if (config.embed?.officialPage && !isHttpUrl(config.embed.officialPage)) {
  errors.push('embed.officialPage must be an http(s) URL when provided.');
}

if (config.site?.mode === 'play-first') {
  if (config.embed?.status !== 'verified') errors.push('play-first mode requires embed.status = "verified".');
  if (!isHttpUrl(config.embed?.runtimeUrl || '')) errors.push('play-first mode requires embed.runtimeUrl.');
}

const runtime = String(config.embed?.runtimeUrl || '');
if (runtime) {
  const lower = runtime.toLowerCase();
  if (!isHttpUrl(runtime)) errors.push('embed.runtimeUrl must be an http(s) URL when provided.');
  if (/https?:\/\/[^/]+\.itch\.io\//.test(lower) && !lower.includes('html-classic.itch.zone/')) {
    errors.push('embed.runtimeUrl appears to be an itch.io project page, not the actual HTML runtime.');
  }
}

for (const page of Array.isArray(config.pages) ? config.pages : []) {
  if (origin && page?.path && page?.canonical) {
    const expected = resolveSiteUrl(config, page.path);
    if (normalizeUrl(page.canonical) !== normalizeUrl(expected)) {
      errors.push(`Page ${page.path} canonical must resolve from site.origin + site.basePath (${expected}).`);
    }
  }
}

if (config.status?.research === 'resolved') {
  if (config.site?.mode === 'auto') errors.push('Resolved research requires site.mode to be play-first or guide.');
  if (!Array.isArray(config.sources) || config.sources.length === 0) errors.push('Resolved research requires recorded research sources.');
  if (!Array.isArray(config.pages) || config.pages.length === 0) errors.push('Resolved research requires pages[].');
}

if (config.status?.onPageSeo === 'pass') {
  if (config.status?.research !== 'resolved') errors.push('On-Page SEO pass requires status.research = "resolved".');
  if (!isProductionHttpsUrl(origin)) errors.push('On-Page SEO pass requires a real production site.origin.');
  if (!isProductionHttpsUrl(canonical)) errors.push('On-Page SEO pass requires a real production site.canonical.');
}

if (Array.isArray(config.status?.blockingIssues) && config.status.blockingIssues.length > 0 && config.status?.onPageSeo === 'pass') {
  warnings.push('On-Page SEO is marked pass while blockingIssues remain; final release QA will still report Deployment-ready: NO if a hard gate fails.');
}

const ok = printResult(`Open WebGame config audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

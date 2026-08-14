import { isHttpUrl, isProductionHttpsUrl, loadConfig, parseArgs, printResult } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const errors = [];
const warnings = [];

const requiredString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) errors.push(`${label} is required.`);
};

if (config.schemaVersion !== '0.2') errors.push('schemaVersion must be "0.2".');
requiredString(config.game?.name, 'game.name');
requiredString(config.site?.language, 'site.language');
requiredString(config.site?.mode, 'site.mode');
requiredString(config.seo?.primaryIntent, 'seo.primaryIntent');
requiredString(config.seo?.primaryKeyword, 'seo.primaryKeyword');
requiredString(config.seo?.canonicalPagePurpose, 'seo.canonicalPagePurpose');
requiredString(config.embed?.status, 'embed.status');

const modes = new Set(['auto', 'play-first', 'guide']);
if (config.site?.mode && !modes.has(config.site.mode)) {
  errors.push(`site.mode must be one of: ${[...modes].join(', ')}.`);
}

const embedStatuses = new Set(['pending', 'verified', 'unsupported', 'manual-check-required']);
if (config.embed?.status && !embedStatuses.has(config.embed.status)) {
  errors.push(`embed.status must be one of: ${[...embedStatuses].join(', ')}.`);
}

if (config.game?.officialUrl && !isHttpUrl(config.game.officialUrl)) {
  errors.push('game.officialUrl must be an http(s) URL when provided.');
}

if (config.site?.mode === 'play-first') {
  if (config.embed?.status !== 'verified') {
    errors.push('play-first mode requires embed.status = "verified".');
  }
  if (!isHttpUrl(config.embed?.runtimeUrl || '')) {
    errors.push('play-first mode requires embed.runtimeUrl.');
  }
}

const runtime = String(config.embed?.runtimeUrl || '');
if (runtime) {
  const lower = runtime.toLowerCase();
  if (/https?:\/\/[^/]+\.itch\.io\//.test(lower) && !lower.includes('html-classic.itch.zone/')) {
    errors.push('embed.runtimeUrl appears to be an itch.io project page, not the actual HTML runtime.');
  }
}

if (config.status?.deploymentReady === true) {
  if (config.status?.research !== 'resolved') errors.push('deploymentReady requires status.research = "resolved".');
  if (config.status?.onPageSeo !== 'pass') errors.push('deploymentReady requires status.onPageSeo = "pass".');
  if (!isProductionHttpsUrl(config.site?.canonical || '')) {
    errors.push('deploymentReady requires a real HTTPS production canonical; placeholders/localhost are not allowed.');
  }
  if (Array.isArray(config.status?.blockingIssues) && config.status.blockingIssues.length > 0) {
    errors.push('deploymentReady cannot be true while status.blockingIssues is non-empty.');
  }
  if (config.site?.mode === 'play-first' && config.embed?.status !== 'verified') {
    errors.push('deploymentReady play-first sites require a verified embed.');
  }
}

if (!Array.isArray(config.status?.blockingIssues)) {
  errors.push('status.blockingIssues must be an array.');
}

if (config.site?.mode === 'auto' && config.status?.research === 'resolved') {
  warnings.push('Research is resolved but site.mode is still "auto"; choose play-first or guide before production QA.');
}

const ok = printResult(`Open WebGame config audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

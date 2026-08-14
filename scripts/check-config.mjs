import { isHttpUrl, isProductionHttpsUrl, loadConfig, parseArgs, printResult } from './lib.mjs';
import { validateConfigSchema } from './schema-validator.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const errors = [...validateConfigSchema(config)];
const warnings = [];

if (config.game?.officialUrl && !isHttpUrl(config.game.officialUrl)) {
  errors.push('game.officialUrl must be an http(s) URL when provided.');
}

if (config.site?.canonical && !isHttpUrl(config.site.canonical)) {
  errors.push('site.canonical must be an http(s) URL when provided.');
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

if (config.status?.deploymentReady === true) {
  if (config.status?.research !== 'resolved') errors.push('deploymentReady requires status.research = "resolved".');
  if (config.status?.onPageSeo !== 'pass') errors.push('deploymentReady requires status.onPageSeo = "pass".');
  if (!isProductionHttpsUrl(config.site?.canonical || '')) errors.push('deploymentReady requires a real HTTPS production canonical; placeholders/localhost are not allowed.');
  if (Array.isArray(config.status?.blockingIssues) && config.status.blockingIssues.length > 0) errors.push('deploymentReady cannot be true while status.blockingIssues is non-empty.');
  if (config.site?.mode === 'play-first' && config.embed?.status !== 'verified') errors.push('deploymentReady play-first sites require a verified embed.');
  if (!Array.isArray(config.sources) || config.sources.length === 0) errors.push('deploymentReady requires recorded research sources.');
  if (!Array.isArray(config.pages) || config.pages.length === 0) errors.push('deploymentReady requires pages[].');
}

if (config.site?.mode === 'auto' && config.status?.research === 'resolved') {
  warnings.push('Research is resolved but site.mode is still "auto"; choose play-first or guide before production QA.');
}

const ok = printResult(`Open WebGame config audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

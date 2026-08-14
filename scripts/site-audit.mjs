import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, normalizeUrl, parseArgs, printResult } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const siteDir = path.resolve(process.cwd(), args['site-dir'] || path.dirname(args.html || 'index.html'));
const pages = Array.isArray(config.pages) ? config.pages : [];
const errors = [];
const warnings = [];

if (pages.length === 0) errors.push('pages[] must contain at least the homepage.');

const paths = new Set();
const files = new Set();
const canonicals = new Set();
const intents = new Map();
let home = null;

for (const page of pages) {
  const route = String(page.path || '').trim();
  const file = String(page.file || '').trim();
  const canonical = String(page.canonical || '').trim();
  const intent = String(page.intent || '').trim();

  if (!route.startsWith('/')) errors.push(`Page path must start with /: ${route || '(empty)'}.`);
  if (paths.has(route)) errors.push(`Duplicate page path: ${route}.`);
  paths.add(route);

  if (!file) errors.push(`Page ${route || '(unknown)'} is missing file.`);
  if (files.has(file)) warnings.push(`Multiple routes use the same file: ${file}.`);
  files.add(file);

  const abs = path.resolve(siteDir, file || '__missing__');
  if (!fs.existsSync(abs)) errors.push(`Page file does not exist: ${file}.`);

  if (!canonical.startsWith('https://')) errors.push(`Page ${route} canonical must be HTTPS.`);
  const normalizedCanonical = normalizeUrl(canonical);
  if (canonicals.has(normalizedCanonical)) errors.push(`Duplicate canonical: ${canonical}.`);
  canonicals.add(normalizedCanonical);

  if (!intent) errors.push(`Page ${route} is missing intent.`);
  if (page.indexable !== false) {
    if (intents.has(intent)) warnings.push(`Indexable pages share intent "${intent}": ${intents.get(intent)} and ${route}. Review cannibalization.`);
    else intents.set(intent, route);
  }

  if (route === '/') home = page;
}

if (!home) errors.push('pages[] must include a homepage with path "/".');
if (home && config.site?.canonical && normalizeUrl(home.canonical) !== normalizeUrl(config.site.canonical)) {
  errors.push('Homepage page canonical must match site.canonical.');
}

const indexable = pages.filter((page) => page.indexable !== false);
const sitemapPath = path.join(siteDir, 'sitemap.xml');
if (config.status?.deploymentReady === true) {
  if (!fs.existsSync(sitemapPath)) {
    errors.push('Deployment-ready site requires sitemap.xml.');
  } else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    for (const page of indexable) {
      if (!sitemap.includes(page.canonical)) errors.push(`sitemap.xml is missing ${page.canonical}.`);
    }
  }
}

if (home) {
  const homePath = path.join(siteDir, home.file);
  if (fs.existsSync(homePath)) {
    const html = fs.readFileSync(homePath, 'utf8');
    for (const page of indexable) {
      if (page.path === '/') continue;
      const linked = html.includes(`href="${page.path}"`) || html.includes(`href='${page.path}'`) || html.includes(`href=".${page.path}"`) || html.includes(`href='.${page.path}'`);
      if (!linked) warnings.push(`Homepage does not appear to link to indexable route ${page.path}; review orphan risk.`);
    }
  }
}

const ok = printResult(`Site architecture audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

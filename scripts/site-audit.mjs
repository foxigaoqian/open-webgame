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
const pageDocuments = new Map();
let home = null;

const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match ? match[1].trim() : '';
};

const getRobotsDirectives = (html) => [...html.matchAll(/<meta\b[^>]*>/gi)]
  .filter((match) => getAttribute(match[0], 'name').toLowerCase() === 'robots')
  .flatMap((match) => getAttribute(match[0], 'content').toLowerCase().split(/[\s,]+/))
  .filter(Boolean);

const decodeXml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&apos;', "'");

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
  if (!fs.existsSync(abs)) {
    errors.push(`Page file does not exist: ${file}.`);
  } else {
    const html = fs.readFileSync(abs, 'utf8');
    pageDocuments.set(route, html);
    const directives = getRobotsDirectives(html);
    const hasNoindex = directives.includes('noindex') || directives.includes('none');
    if (page.indexable === false && !hasNoindex) {
      errors.push(`Non-indexable page ${route} must emit a robots noindex directive.`);
    }
    if (page.indexable !== false && hasNoindex) {
      errors.push(`Indexable page ${route} must not emit a robots noindex directive.`);
    }
  }

  if (!canonical.startsWith('https://')) errors.push(`Page ${route} canonical must be HTTPS.`);
  const normalizedCanonical = normalizeUrl(canonical);
  if (canonicals.has(normalizedCanonical)) errors.push(`Duplicate canonical: ${canonical}.`);
  canonicals.add(normalizedCanonical);

  if (!intent) errors.push(`Page ${route} is missing intent.`);
  if (page.indexable !== false) {
    const normalizedIntent = intent.toLowerCase().replace(/\s+/g, ' ');
    if (intents.has(normalizedIntent)) errors.push(`Indexable pages share intent "${intent}": ${intents.get(normalizedIntent)} and ${route}. Merge them or declare a distinct player task.`);
    else intents.set(normalizedIntent, route);
  }

  if (route === '/') home = page;
}

if (!home) errors.push('pages[] must include a homepage with path "/".');
if (home && config.site?.canonical && normalizeUrl(home.canonical) !== normalizeUrl(config.site.canonical)) {
  errors.push('Homepage page canonical must match site.canonical.');
}

const indexable = pages.filter((page) => page.indexable !== false);
const sitemapPath = path.join(siteDir, 'sitemap.xml');
if (config.status?.onPageSeo === 'pass') {
  if (!fs.existsSync(sitemapPath)) {
    errors.push('On-Page SEO pass requires sitemap.xml.');
  } else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
      .map((match) => normalizeUrl(decodeXml(match[1].trim())));
    const sitemapUrlSet = new Set(sitemapUrls);
    if (sitemapUrlSet.size !== sitemapUrls.length) errors.push('sitemap.xml contains duplicate <loc> URLs.');
    for (const page of indexable) {
      if (!sitemapUrlSet.has(normalizeUrl(page.canonical))) errors.push(`sitemap.xml is missing ${page.canonical}.`);
    }
    for (const page of pages.filter((candidate) => candidate.indexable === false)) {
      if (sitemapUrlSet.has(normalizeUrl(page.canonical))) errors.push(`sitemap.xml must omit non-indexable page ${page.canonical}.`);
    }
  }
}

if (home) {
  const homePath = path.join(siteDir, home.file);
  if (fs.existsSync(homePath)) {
    const html = pageDocuments.get('/') || fs.readFileSync(homePath, 'utf8');
    const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map((match) => match[1].trim());
    for (const page of indexable) {
      if (page.path === '/') continue;
      const linked = hrefs.some((href) => {
        if (!href || href.startsWith('#')) return false;
        if (/^https?:\/\//i.test(href)) return normalizeUrl(href) === normalizeUrl(page.canonical);
        const local = href.split(/[?#]/)[0];
        return local === page.path || local === `.${page.path}`;
      });
      if (!linked) warnings.push(`Homepage does not appear to link to indexable route ${page.path}; review orphan risk.`);
    }
  }
}

const ok = printResult(`Site architecture audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

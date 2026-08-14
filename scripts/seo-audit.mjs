import fs from 'node:fs';
import path from 'node:path';
import {
  attr,
  isProductionHttpsUrl,
  loadConfig,
  normalizeUrl,
  parseArgs,
  printResult,
  readText,
  stripTags,
} from './lib.mjs';

const args = parseArgs();
const htmlPath = args.html || 'index.html';
const configPath = args.config || 'open-webgame.json';
const html = readText(htmlPath);
const config = loadConfig(configPath);
const errors = [];
const warnings = [];
const gameName = String(config.game?.name || '').trim();
const lowerGame = gameName.toLowerCase();

const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
if (titleMatches.length !== 1) {
  errors.push(`Expected exactly one <title>; found ${titleMatches.length}.`);
} else {
  const title = stripTags(titleMatches[0][1]);
  if (!title) errors.push('<title> is empty.');
  if (lowerGame && !title.toLowerCase().includes(lowerGame)) errors.push(`<title> must identify ${gameName}.`);
  if (title.length > 70) warnings.push(`<title> is ${title.length} characters; review for truncation.`);
}

const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
const findMetaName = (name) => metaTags.find((tag) => attr(tag, 'name').toLowerCase() === name.toLowerCase());
const findMetaProperty = (name) => metaTags.find((tag) => attr(tag, 'property').toLowerCase() === name.toLowerCase());

const descriptionTag = findMetaName('description');
if (!descriptionTag) {
  errors.push('Missing meta description.');
} else {
  const description = attr(descriptionTag, 'content').trim();
  if (!description) errors.push('Meta description is empty.');
  if (description.length < 70 || description.length > 180) {
    warnings.push(`Meta description is ${description.length} characters; review snippet quality.`);
  }
}

const robotsTag = findMetaName('robots');
if (robotsTag && /\bnoindex\b/i.test(attr(robotsTag, 'content'))) {
  errors.push('Production page contains noindex.');
}

const canonicalTag = linkTags.find((tag) => attr(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
if (!canonicalTag) {
  errors.push('Missing canonical link.');
} else {
  const canonical = attr(canonicalTag, 'href').trim();
  if (!isProductionHttpsUrl(canonical)) errors.push('Canonical must be a real HTTPS production URL, not example.com/localhost.');
  if (config.site?.canonical && normalizeUrl(canonical) !== normalizeUrl(config.site.canonical)) {
    errors.push(`Canonical does not match config.site.canonical (${config.site.canonical}).`);
  }
}

for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
  const tag = findMetaProperty(property);
  if (!tag || !attr(tag, 'content').trim()) errors.push(`Missing ${property}.`);
}
const ogImage = findMetaProperty('og:image');
if (ogImage && !/^https:\/\//i.test(attr(ogImage, 'content'))) errors.push('og:image must be an absolute HTTPS URL.');
const ogUrl = findMetaProperty('og:url');
if (ogUrl && config.site?.canonical && normalizeUrl(attr(ogUrl, 'content')) !== normalizeUrl(config.site.canonical)) {
  errors.push('og:url must match the canonical URL for this page.');
}
if (!findMetaName('twitter:card')) warnings.push('Missing twitter:card metadata.');

const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
if (h1Matches.length !== 1) {
  errors.push(`Expected exactly one H1; found ${h1Matches.length}.`);
} else {
  const h1 = stripTags(h1Matches[0][1]);
  if (lowerGame && !h1.toLowerCase().includes(lowerGame)) errors.push(`H1 must clearly identify ${gameName}.`);
}

const bodyText = stripTags(html);
if (bodyText.length < 500) errors.push('Too little crawlable text outside scripts/styles/iframes.');
if (lowerGame && !bodyText.toLowerCase().includes(lowerGame)) errors.push('Crawlable page text does not identify the game entity.');

const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
for (let i = 0; i < imageTags.length; i += 1) {
  const alt = attr(imageTags[i], 'alt');
  if (!alt.trim()) errors.push(`Image ${i + 1} is missing meaningful alt text.`);
  if (!attr(imageTags[i], 'width') || !attr(imageTags[i], 'height')) {
    warnings.push(`Image ${i + 1} has no explicit width/height; review CLS risk.`);
  }
}

const jsonLdBlocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
const schemas = [];
for (const block of jsonLdBlocks) {
  try {
    schemas.push(JSON.parse(block[1]));
  } catch (error) {
    errors.push(`Invalid JSON-LD: ${error.message}`);
  }
}
const schemaTypes = new Set();
const collectType = (node) => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach(collectType);
  if (node['@type']) {
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    for (const type of types) schemaTypes.add(type);
  }
  if (Array.isArray(node['@graph'])) node['@graph'].forEach(collectType);
};
schemas.forEach(collectType);
if (config.site?.mode === 'play-first' && !schemaTypes.has('VideoGame')) {
  errors.push('Play-first homepage should include accurate VideoGame JSON-LD.');
}

const iframeTags = [...html.matchAll(/<iframe\b[^>]*>/gi)].map((m) => m[0]);
if (config.site?.mode === 'play-first') {
  if (iframeTags.length === 0) errors.push('Play-first page has no iframe player.');
  const configuredRuntime = String(config.embed?.runtimeUrl || '');
  const iframeUrls = iframeTags.flatMap((tag) => [attr(tag, 'src'), attr(tag, 'data-src')]).filter(Boolean);
  if (configuredRuntime && !iframeUrls.includes(configuredRuntime)) {
    errors.push('Player iframe does not use embed.runtimeUrl from open-webgame.json.');
  }
  for (const value of iframeUrls) {
    const lower = value.toLowerCase();
    if (/https?:\/\/[^/]+\.itch\.io\//.test(lower) && !lower.includes('html-classic.itch.zone/')) {
      errors.push(`Iframe appears to use an itch.io project detail page instead of a game runtime: ${value}`);
    }
  }
}

if (config.status?.deploymentReady === true) {
  const siteDir = path.resolve(process.cwd(), args['site-dir'] || path.dirname(htmlPath));
  const robotsPath = path.join(siteDir, 'robots.txt');
  const sitemapPath = path.join(siteDir, 'sitemap.xml');
  if (!fs.existsSync(robotsPath)) {
    errors.push(`Missing production robots.txt in ${path.relative(process.cwd(), siteDir) || '.'}.`);
  } else {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (/Disallow:\s*\//i.test(robots)) errors.push('robots.txt appears to block the entire site.');
    if (!/Sitemap:\s*https?:\/\//i.test(robots)) errors.push('robots.txt must declare an absolute Sitemap URL.');
  }
  if (!fs.existsSync(sitemapPath)) {
    errors.push(`Missing production sitemap.xml in ${path.relative(process.cwd(), siteDir) || '.'}.`);
  } else if (config.site?.canonical) {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    if (!sitemap.includes(config.site.canonical)) errors.push('sitemap.xml does not include the configured canonical URL.');
  }
}

const ok = printResult(`On-Page SEO audit: ${htmlPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

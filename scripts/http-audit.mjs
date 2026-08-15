import fs from 'node:fs';
import path from 'node:path';
import { attr, isHttpUrl, loadConfig, parseArgs, printResult, readText } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const htmlPath = args.html || 'index.html';
const siteDir = path.resolve(process.cwd(), args['site-dir'] || path.dirname(htmlPath));
const config = loadConfig(configPath);
const html = readText(htmlPath);
const errors = [];
const warnings = [];

const targets = new Map();
const addTarget = (url, label, expectedTypes = []) => {
  const value = String(url || '').trim();
  if (!value) return;
  if (!isHttpUrl(value)) {
    errors.push(`${label} is not an http(s) URL: ${value}`);
    return;
  }
  if (!targets.has(value)) targets.set(value, { labels: new Set(), expectedTypes: new Set() });
  const target = targets.get(value);
  target.labels.add(label);
  for (const type of expectedTypes) target.expectedTypes.add(type.toLowerCase());
};

const resolveResource = (href, baseUrl, label) => {
  const value = String(href || '').trim();
  if (!value) return '';
  try {
    return new URL(value, baseUrl).href;
  } catch {
    errors.push(`${label} could not be resolved against ${baseUrl}: ${value}`);
    return '';
  }
};

addTarget(config.site?.canonical, 'site canonical');
for (const page of Array.isArray(config.pages) ? config.pages : []) {
  if (page?.indexable) addTarget(page.canonical, `page canonical ${page.path}`);
}

const collectHtmlResources = (sourceHtml, baseUrl, labelPrefix) => {
  const metaTags = [...sourceHtml.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const ogImage = metaTags.find((tag) => attr(tag, 'property').toLowerCase() === 'og:image');
  if (ogImage) {
    const url = resolveResource(attr(ogImage, 'content'), baseUrl, `${labelPrefix} og:image`);
    if (url) addTarget(url, `${labelPrefix} og:image`);
  }

  const linkTags = [...sourceHtml.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  for (const tag of linkTags) {
    const rel = attr(tag, 'rel').toLowerCase().split(/\s+/).filter(Boolean);
    if (!rel.includes('icon') && !rel.includes('shortcut')) continue;
    const href = attr(tag, 'href');
    if (!href) {
      errors.push(`${labelPrefix} favicon link is missing href.`);
      continue;
    }
    const url = resolveResource(href, baseUrl, `${labelPrefix} favicon`);
    if (!url) continue;
    const type = attr(tag, 'type').toLowerCase();
    const expectedTypes = type === 'image/png'
      ? ['image/png']
      : type === 'image/x-icon'
        ? ['image/x-icon', 'image/vnd.microsoft.icon', 'image/ico']
        : [];
    addTarget(url, `${labelPrefix} favicon`, expectedTypes);
  }
};

collectHtmlResources(html, config.site?.canonical || 'https://invalid.local/', 'homepage');

for (const page of Array.isArray(config.pages) ? config.pages : []) {
  if (page?.indexable === false || !page?.file || !page?.canonical) continue;
  const file = path.resolve(siteDir, page.file);
  if (!fs.existsSync(file)) continue;
  if (path.resolve(htmlPath) === file) continue;
  collectHtmlResources(fs.readFileSync(file, 'utf8'), page.canonical, `page ${page.path}`);
}

const robotsPath = path.join(siteDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  for (const match of robots.matchAll(/^\s*Sitemap:\s*(\S+)\s*$/gim)) addTarget(match[1], 'robots sitemap');
}

const sitemapPath = path.join(siteDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  for (const match of sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)) addTarget(match[1], 'sitemap URL');
}

async function fetchStatus(url) {
  const options = {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
    headers: { 'user-agent': 'OpenWebGame-QA/0.3.3 (+https://github.com/foxigaoqian/open-webgame)' },
  };

  let response = await fetch(url, { ...options, method: 'HEAD' });
  if ([403, 405, 501].includes(response.status)) {
    response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: { ...options.headers, range: 'bytes=0-1023' },
    });
  }
  return response;
}

for (const [url, target] of targets) {
  const labels = [...target.labels];
  try {
    const response = await fetchStatus(url);
    if (!response.ok) {
      errors.push(`${labels.join(', ')} returned HTTP ${response.status}: ${url}`);
      continue;
    }
    if (response.url && response.url !== url) {
      warnings.push(`${labels.join(', ')} redirects to ${response.url}`);
    }
    if (target.expectedTypes.size > 0) {
      const contentType = String(response.headers.get('content-type') || '').toLowerCase();
      const accepted = [...target.expectedTypes].some((expected) => contentType.includes(expected));
      if (!accepted) {
        errors.push(`${labels.join(', ')} returned content-type ${contentType || 'missing'}; expected one of ${[...target.expectedTypes].join(', ')}: ${url}`);
      }
    }
  } catch (error) {
    errors.push(`${labels.join(', ')} could not be fetched: ${url} (${error.message})`);
  }
}

if (targets.size === 0) warnings.push('No production HTTP targets were discovered.');

const ok = printResult(`Live HTTP audit: ${htmlPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

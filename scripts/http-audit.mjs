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
const addTarget = (url, label) => {
  const value = String(url || '').trim();
  if (!value) return;
  if (!isHttpUrl(value)) {
    errors.push(`${label} is not an http(s) URL: ${value}`);
    return;
  }
  if (!targets.has(value)) targets.set(value, new Set());
  targets.get(value).add(label);
};

addTarget(config.site?.canonical, 'site canonical');
for (const page of Array.isArray(config.pages) ? config.pages : []) {
  if (page?.indexable) addTarget(page.canonical, `page canonical ${page.path}`);
}

const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
const ogImage = metaTags.find((tag) => attr(tag, 'property').toLowerCase() === 'og:image');
if (ogImage) addTarget(attr(ogImage, 'content'), 'og:image');

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
    headers: { 'user-agent': 'OpenWebGame-QA/0.3 (+https://github.com/foxigaoqian/open-webgame)' },
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

for (const [url, labels] of targets) {
  try {
    const response = await fetchStatus(url);
    if (!response.ok) {
      errors.push(`${[...labels].join(', ')} returned HTTP ${response.status}: ${url}`);
      continue;
    }
    if (response.url && response.url !== url) {
      warnings.push(`${[...labels].join(', ')} redirects to ${response.url}`);
    }
  } catch (error) {
    errors.push(`${[...labels].join(', ')} could not be fetched: ${url} (${error.message})`);
  }
}

if (targets.size === 0) warnings.push('No production HTTP targets were discovered.');

const ok = printResult(`Live HTTP audit: ${htmlPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

import fs from 'node:fs';
import path from 'node:path';
import { attr, loadConfig, normalizeUrl, parseArgs, printResult, readText } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const siteDir = path.resolve(process.cwd(), args['site-dir'] || '.');
const config = loadConfig(configPath);
const errors = [];
const warnings = [];
const i18n = config.i18n;

if (!i18n?.enabled) {
  if (Array.isArray(i18n?.languages) && i18n.languages.length > 1) {
    warnings.push('i18n.enabled is false but multiple languages are configured.');
  }
  const ok = printResult(`Multilingual SEO audit: ${configPath}`, errors, warnings);
  process.exit(ok ? 0 : 1);
}

const languages = Array.isArray(i18n.languages) ? i18n.languages : [];
const codes = languages.map((item) => String(item?.code || '').trim());
const codeSet = new Set(codes);
if (codes.length < 2) errors.push('i18n.enabled requires at least two configured languages.');
if (codeSet.size !== codes.length) errors.push('i18n.languages contains duplicate language codes.');
if (!codeSet.has(i18n.defaultLanguage)) errors.push('i18n.defaultLanguage must exist in i18n.languages.');
const xDefaultLanguage = i18n.xDefaultLanguage || i18n.defaultLanguage;
if (!codeSet.has(xDefaultLanguage)) errors.push('i18n.xDefaultLanguage must exist in i18n.languages.');
if (config.site?.language !== i18n.defaultLanguage) {
  errors.push('site.language must match i18n.defaultLanguage for a multilingual project.');
}

const pages = Array.isArray(config.pages) ? config.pages.filter((page) => page?.indexable) : [];
const groups = new Map();
for (const page of pages) {
  if (!page.language) errors.push(`Page ${page.path} is missing language.`);
  if (!page.translationKey) errors.push(`Page ${page.path} is missing translationKey.`);
  if (page.language && !codeSet.has(page.language)) errors.push(`Page ${page.path} uses unconfigured language ${page.language}.`);
  if (!page.translationKey || !page.language) continue;
  if (!groups.has(page.translationKey)) groups.set(page.translationKey, new Map());
  const group = groups.get(page.translationKey);
  if (group.has(page.language)) errors.push(`Duplicate ${page.translationKey}/${page.language} page.`);
  group.set(page.language, page);
}

for (const [translationKey, group] of groups) {
  for (const code of codes) {
    if (!group.has(code)) errors.push(`Translation group ${translationKey} is missing language ${code}.`);
  }

  const xDefaultPage = group.get(xDefaultLanguage);
  const expectedXDefault = xDefaultPage?.canonical || '';

  for (const [code, page] of group) {
    const filePath = path.join(siteDir, page.file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing multilingual page file: ${page.file}.`);
      continue;
    }
    const html = readText(filePath);
    const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] || '';
    const htmlLang = attr(htmlTag, 'lang');
    if (htmlLang.toLowerCase() !== code.toLowerCase()) {
      errors.push(`${page.file} html[lang] must be ${code}; found ${htmlLang || 'missing'}.`);
    }

    const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
    const canonicalTag = linkTags.find((tag) => attr(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
    if (!canonicalTag || normalizeUrl(attr(canonicalTag, 'href')) !== normalizeUrl(page.canonical)) {
      errors.push(`${page.file} canonical does not match pages[].canonical.`);
    }

    const alternates = new Map();
    for (const tag of linkTags) {
      const rel = attr(tag, 'rel').toLowerCase().split(/\s+/);
      if (!rel.includes('alternate')) continue;
      const hreflang = attr(tag, 'hreflang').trim();
      const href = attr(tag, 'href').trim();
      if (hreflang && href) alternates.set(hreflang.toLowerCase(), href);
    }

    for (const expectedCode of codes) {
      const sibling = group.get(expectedCode);
      const actual = alternates.get(expectedCode.toLowerCase());
      if (!actual) {
        errors.push(`${page.file} is missing hreflang=${expectedCode}.`);
      } else if (normalizeUrl(actual) !== normalizeUrl(sibling.canonical)) {
        errors.push(`${page.file} hreflang=${expectedCode} points to the wrong canonical.`);
      }
    }

    const xDefault = alternates.get('x-default');
    if (!xDefault) {
      errors.push(`${page.file} is missing hreflang=x-default.`);
    } else if (expectedXDefault && normalizeUrl(xDefault) !== normalizeUrl(expectedXDefault)) {
      errors.push(`${page.file} x-default points to the wrong canonical.`);
    }
  }
}

if (groups.size === 0) errors.push('i18n.enabled requires indexable pages with language and translationKey metadata.');

const sitemapPath = path.join(siteDir, 'sitemap.xml');
if (config.status?.deploymentReady === true) {
  if (!fs.existsSync(sitemapPath)) {
    errors.push('Deployment-ready multilingual sites require sitemap.xml.');
  } else {
    const sitemap = fs.readFileSync(sitemapPath, 'utf8');
    if (!/xmlns:xhtml=/i.test(sitemap)) errors.push('Multilingual sitemap.xml must declare the xhtml namespace.');
    for (const [translationKey, group] of groups) {
      for (const [, page] of group) {
        const escaped = page.canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const block = sitemap.match(new RegExp(`<url>[\\s\\S]*?<loc>\\s*${escaped}\\s*<\\/loc>[\\s\\S]*?<\\/url>`, 'i'))?.[0] || '';
        if (!block) {
          errors.push(`sitemap.xml is missing ${page.canonical}.`);
          continue;
        }
        for (const code of codes) {
          if (!new RegExp(`hreflang=["']${code}["']`, 'i').test(block)) {
            errors.push(`sitemap.xml ${translationKey} block is missing hreflang=${code}.`);
          }
        }
        if (!/hreflang=["']x-default["']/i.test(block)) {
          errors.push(`sitemap.xml ${translationKey} block is missing hreflang=x-default.`);
        }
      }
    }
  }
}

const ok = printResult(`Multilingual SEO audit: ${configPath}`, errors, warnings);
process.exit(ok ? 0 : 1);

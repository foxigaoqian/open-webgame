import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const validConfigPath = path.resolve('tests/fixtures/config-valid.json');

const siteHtml = ({ robots = 'index,follow', links = '' } = {}) => `<!doctype html>
<html lang="en">
<head><meta name="robots" content="${robots}"></head>
<body><main><h1>Fixture Game</h1>${links}</main></body>
</html>`;

const runSiteAudit = ({ secondPage, secondRobots = 'noindex,follow', includeSecondInSitemap = false }) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-webgame-site-'));
  const config = readJson(validConfigPath);
  config.status.onPageSeo = 'pass';
  config.pages = [config.pages[0]];
  if (secondPage) config.pages.push(secondPage);

  fs.writeFileSync(path.join(dir, 'index.html'), siteHtml({
    links: secondPage?.indexable === false ? '' : '<a href="/tools/">Tools</a>',
  }));
  if (secondPage) {
    fs.mkdirSync(path.dirname(path.join(dir, secondPage.file)), { recursive: true });
    fs.writeFileSync(path.join(dir, secondPage.file), siteHtml({ robots: secondRobots }));
  }

  const sitemapUrls = [config.pages[0].canonical];
  if (secondPage && (secondPage.indexable !== false || includeSecondInSitemap)) sitemapUrls.push(secondPage.canonical);
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), `<?xml version="1.0"?><urlset>${sitemapUrls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`);

  const configPath = path.join(dir, 'open-webgame.json');
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return spawnSync(process.execPath, [
    'scripts/site-audit.mjs', '--config', configPath, '--site-dir', dir,
  ], { cwd: process.cwd(), encoding: 'utf8' });
};

const nonIndexableTool = {
  path: '/tools/',
  file: 'tools/index.html',
  intent: 'use the Fixture Game score estimator',
  canonical: 'https://fixture.invalid/game/tools/',
  indexable: false,
};

test('site audit accepts aligned index and noindex routes', () => {
  const result = runSiteAudit({ secondPage: nonIndexableTool });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('site audit rejects duplicate intents on indexable routes', () => {
  const result = runSiteAudit({
    secondPage: {
      ...nonIndexableTool,
      intent: 'Fixture Game guide',
      indexable: true,
    },
    secondRobots: 'index,follow',
  });
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /share intent/i);
});

test('site audit rejects noindex on an indexable route', () => {
  const result = runSiteAudit({
    secondPage: {
      ...nonIndexableTool,
      indexable: true,
    },
    secondRobots: 'noindex,follow',
  });
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /must not emit a robots noindex/i);
});

test('site audit rejects a non-indexable page without noindex', () => {
  const result = runSiteAudit({
    secondPage: nonIndexableTool,
    secondRobots: 'index,follow',
  });
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /must emit a robots noindex/i);
});

test('site audit rejects a non-indexable canonical in sitemap', () => {
  const result = runSiteAudit({
    secondPage: nonIndexableTool,
    includeSecondInSitemap: true,
  });
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /must omit non-indexable page/i);
});

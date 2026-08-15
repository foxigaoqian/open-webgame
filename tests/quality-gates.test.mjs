import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { validateConfigSchema } from '../scripts/schema-validator.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const validConfigPath = path.resolve('tests/fixtures/config-valid.json');
const invalidTypoPath = path.resolve('tests/fixtures/config-invalid-typo.json');
const i18nConfigPath = path.resolve('tests/fixtures/i18n-config-valid.json');
const i18nSitePath = path.resolve('tests/fixtures/i18n-site');

const seoHtml = (imageMarkup) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fixture Game Guide | Controls, Basics and Beginner Tips</title>
  <meta name="description" content="Learn Fixture Game basics, controls, beginner strategy, progression concepts, and verified gameplay guidance in one concise reference page.">
  <meta name="robots" content="index,follow">
  <meta name="twitter:card" content="summary_large_image">
  <meta property="og:title" content="Fixture Game Guide">
  <meta property="og:description" content="Verified Fixture Game beginner guide and controls reference.">
  <meta property="og:image" content="https://fixture.invalid/game/og.jpg">
  <meta property="og:url" content="https://fixture.invalid/game/">
  <link rel="canonical" href="https://fixture.invalid/game/">
</head>
<body>
  <main>
    <h1>Fixture Game Guide</h1>
    <h2>How Fixture Game Works</h2>
    ${imageMarkup}
    <p>${'Fixture Game is used here only as deterministic regression-test content for the Open WebGame SEO gate. '.repeat(12)}</p>
  </main>
</body>
</html>`;

const runSeoAudit = (imageMarkup) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-webgame-seo-'));
  const htmlPath = path.join(dir, 'index.html');
  fs.writeFileSync(htmlPath, seoHtml(imageMarkup));
  return spawnSync(process.execPath, [
    'scripts/seo-audit.mjs',
    '--config', validConfigPath,
    '--html', htmlPath,
  ], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
};

const runI18nAudit = (siteDir) => spawnSync(process.execPath, [
  'scripts/i18n-audit.mjs',
  '--config', i18nConfigPath,
  '--site-dir', siteDir,
], {
  cwd: process.cwd(),
  encoding: 'utf8',
});

const writeTempConfig = (config, prefix) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const file = path.join(dir, 'open-webgame.json');
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
  return file;
};

const runConfigAudit = (config) => spawnSync(process.execPath, [
  'scripts/check-config.mjs', '--config', writeTempConfig(config, 'open-webgame-config-'),
], { cwd: process.cwd(), encoding: 'utf8' });

const runContentAudit = (config) => spawnSync(process.execPath, [
  'scripts/content-audit.mjs', '--config', writeTempConfig(config, 'open-webgame-content-'),
], { cwd: process.cwd(), encoding: 'utf8' });

test('strict schema accepts the valid fixture', () => {
  const errors = validateConfigSchema(readJson(validConfigPath));
  assert.deepEqual(errors, []);
});

test('strict schema rejects a misspelled config property', () => {
  const errors = validateConfigSchema(readJson(invalidTypoPath));
  assert.ok(errors.some((error) => error.includes('unknown property "primayKeyword"')));
  assert.ok(errors.some((error) => error.includes('missing required property "primaryKeyword"')));
});

test('config audit rejects an origin that contains the deployment path', () => {
  const config = readJson(validConfigPath);
  config.site.origin = 'https://fixture.invalid/game';
  config.site.basePath = '';
  const result = runConfigAudit(config);
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /origin must contain only scheme \+ host/i);
});

test('content audit accepts a fresh volatile claim', () => {
  const config = readJson(validConfigPath);
  const today = new Date().toISOString().slice(0, 10);
  config.status.research = 'resolved';
  config.site.mode = 'guide';
  config.sources = [{ id: 'official', type: 'official-site', url: 'https://fixture.invalid/official', retrievedAt: today }];
  config.claims = [{ id: 'release', text: 'Fixture release state is current.', sourceIds: ['official'], status: 'verified', volatility: 'volatile', maxAgeDays: 7 }];
  const result = runContentAudit(config);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('content audit rejects a stale volatile claim', () => {
  const config = readJson(validConfigPath);
  const stale = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  config.status.research = 'resolved';
  config.site.mode = 'guide';
  config.sources = [{ id: 'official', type: 'official-site', url: 'https://fixture.invalid/official', retrievedAt: stale }];
  config.claims = [{ id: 'release', text: 'Fixture release state is stale.', sourceIds: ['official'], status: 'verified', volatility: 'volatile', maxAgeDays: 7 }];
  const result = runContentAudit(config);
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /is stale/i);
});

test('SEO audit accepts alt="" for a decorative image', () => {
  const result = runSeoAudit('<img src="decorative.svg" alt="" width="24" height="24">');
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('SEO audit rejects an image with no alt attribute', () => {
  const result = runSeoAudit('<img src="informative.jpg" width="640" height="360">');
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /missing an alt attribute/i);
});

test('multilingual SEO audit accepts a complete en/ja hreflang cluster', () => {
  const result = runI18nAudit(i18nSitePath);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test('multilingual SEO audit rejects a page missing x-default', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-webgame-i18n-'));
  fs.cpSync(i18nSitePath, dir, { recursive: true });
  const jaPath = path.join(dir, 'ja/index.html');
  const html = fs.readFileSync(jaPath, 'utf8').replace(/\s*<link rel="alternate" hreflang="x-default"[^>]*>\s*/i, '\n');
  fs.writeFileSync(jaPath, html);
  const result = runI18nAudit(dir);
  assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}\n${result.stderr}`, /missing hreflang=x-default/i);
});

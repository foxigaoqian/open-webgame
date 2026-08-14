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

const runSeoAudit = (html) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'open-webgame-seo-'));
  const htmlPath = path.join(dir, 'index.html');
  fs.writeFileSync(htmlPath, html);
  return spawnSync(process.execPath, [
    'scripts/seo-audit.mjs',
    '--config', validConfigPath,
    '--html', htmlPath,
  ], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
};

test('strict schema accepts the valid fixture', () => {
  const errors = validateConfigSchema(readJson(validConfigPath));
  assert.deepEqual(errors, []);
});

test('strict schema rejects a misspelled config property', () => {
  const errors = validateConfigSchema(readJson(invalidTypoPath));
  assert.ok(errors.some((error) => error.includes('unknown property "primayKeyword"')));
  assert.ok(errors.some((error) => error.includes('missing required property "primaryKeyword"')));
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

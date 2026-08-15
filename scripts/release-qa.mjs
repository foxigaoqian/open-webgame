import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadConfig, parseArgs } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const html = args.html || 'index.html';
const siteDir = args['site-dir'] || path.dirname(html);
const config = loadConfig(configPath);
const artifactsDir = path.resolve(process.cwd(), 'qa-artifacts');
const artifactPath = path.join(artifactsDir, 'release-qa.json');

const gitResult = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: process.cwd(), encoding: 'utf8' });
const commit = String(process.env.GITHUB_SHA || (gitResult.status === 0 ? gitResult.stdout.trim() : '') || 'unknown');
const checkedAt = new Date().toISOString();
const blockingIssues = Array.isArray(config.status?.blockingIssues) ? config.status.blockingIssues : [];
const releaseErrors = [];

if (config.status?.research !== 'resolved') releaseErrors.push('status.research must be resolved before release QA.');
if (config.status?.onPageSeo !== 'pass') releaseErrors.push('status.onPageSeo must be pass before release QA.');
if (blockingIssues.length > 0) releaseErrors.push(`status.blockingIssues must be empty before release QA (${blockingIssues.length} remaining).`);

const checks = [
  ['Live non-browser gates', ['scripts/qa.mjs', '--config', configPath, '--html', html, '--site-dir', siteDir]],
  ['Browser + accessibility', ['scripts/browser-qa.mjs', '--config', configPath, '--site-dir', siteDir]],
  ['Lighthouse', ['scripts/lighthouse-qa.mjs', '--config', configPath, '--site-dir', siteDir]],
];

let failed = releaseErrors.length > 0;
const results = [];
for (const [name, commandArgs] of checks) {
  console.log(`\n=== ${name} ===`);
  const result = spawnSync(process.execPath, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  const pass = result.status === 0;
  results.push({ name, pass, exitCode: result.status });
  if (!pass) failed = true;
}

fs.mkdirSync(artifactsDir, { recursive: true });
const artifact = {
  schemaVersion: '1',
  projectSchemaVersion: config.schemaVersion || null,
  status: failed ? 'fail' : 'pass',
  deploymentReady: !failed,
  checkedAt,
  commit,
  config: path.relative(process.cwd(), path.resolve(configPath)),
  siteDir: path.relative(process.cwd(), path.resolve(siteDir)),
  releaseErrors,
  blockingIssues,
  checks: results,
};
fs.writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');

console.log('\n=== Open WebGame Release Readiness ===');
console.log(`Evidence: ${path.relative(process.cwd(), artifactPath)}`);
if (failed) {
  console.log('Deployment-ready: NO');
  for (const error of releaseErrors) console.log(`  ERROR: ${error}`);
  console.log('At least one production hard gate or release precondition failed.');
  process.exit(1);
}

console.log('Deployment-ready: YES');
console.log(`Release evidence is bound to commit ${commit}.`);
console.log('Live config/content/site/i18n/SEO/security/HTTP/embed, Browser/axe and Lighthouse gates all passed.');

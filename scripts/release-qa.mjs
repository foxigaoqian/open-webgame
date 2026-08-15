import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { parseArgs } from './lib.mjs';

const args = parseArgs();
const config = args.config || 'open-webgame.json';
const html = args.html || 'index.html';
const siteDir = args['site-dir'] || path.dirname(html);

const checks = [
  ['Live non-browser gates', ['scripts/qa.mjs', '--config', config, '--html', html, '--site-dir', siteDir]],
  ['Browser + accessibility', ['scripts/browser-qa.mjs', '--config', config, '--site-dir', siteDir]],
  ['Lighthouse', ['scripts/lighthouse-qa.mjs', '--config', config, '--site-dir', siteDir]],
];

let failed = false;
for (const [name, commandArgs] of checks) {
  console.log(`\n=== ${name} ===`);
  const result = spawnSync(process.execPath, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (result.status !== 0) failed = true;
}

console.log('\n=== Open WebGame Release Readiness ===');
if (failed) {
  console.log('Deployment-ready: NO');
  console.log('At least one production hard gate failed.');
  process.exit(1);
}

console.log('Deployment-ready: YES');
console.log('Live config/content/site/i18n/SEO/security/HTTP/embed, Browser/axe and Lighthouse gates all passed.');

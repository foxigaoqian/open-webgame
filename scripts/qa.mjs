import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { parseArgs } from './lib.mjs';

const args = parseArgs();
const config = args.config || 'open-webgame.json';
const html = args.html || 'index.html';
const offline = Boolean(args.offline);
const siteDir = args['site-dir'] || path.dirname(html);

const checks = [
  ['Config', ['scripts/check-config.mjs', '--config', config]],
  ['Content Provenance + Freshness', ['scripts/content-audit.mjs', '--config', config]],
  ['Site Architecture', ['scripts/site-audit.mjs', '--config', config, '--html', html, '--site-dir', siteDir]],
  ['Multilingual SEO', ['scripts/i18n-audit.mjs', '--config', config, '--site-dir', siteDir]],
  ['On-Page SEO', ['scripts/seo-audit.mjs', '--config', config, '--html', html, '--site-dir', siteDir]],
  ['Security', ['scripts/security-audit.mjs', '--config', config, '--html', html]],
  ...(!offline ? [['HTTP Resources', ['scripts/http-audit.mjs', '--config', config, '--html', html, '--site-dir', siteDir]]] : []),
  ['Embed', ['scripts/verify-embed.mjs', '--config', config, ...(offline ? ['--offline'] : [])]],
];

let failed = false;
for (const [name, commandArgs] of checks) {
  console.log(`\n=== ${name} Gate ===`);
  const result = spawnSync(process.execPath, commandArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
  if (result.status !== 0) failed = true;
}

console.log('\n=== Open WebGame QA Summary ===');
if (failed) {
  console.log('Deployment-ready: NO');
  console.log('At least one hard gate failed.');
  process.exit(1);
}

if (offline) {
  console.log('Offline deterministic gates: PASS');
  console.log('Deployment-ready: NO');
  console.log('Pending: live HTTP/embed, Browser/axe and Lighthouse release gates.');
} else {
  console.log('Live non-browser gates: PASS');
  console.log('Deployment-ready: NO');
  console.log('Pending: Browser/axe and Lighthouse release gates. Run npm run qa:release for the final readiness decision.');
}

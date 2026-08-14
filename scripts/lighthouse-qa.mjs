import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import { loadConfig, parseArgs, printResult } from './lib.mjs';

const args = parseArgs();
const configPath = args.config || 'open-webgame.json';
const config = loadConfig(configPath);
const siteDir = path.resolve(process.cwd(), args['site-dir'] || '.');
const artifactsDir = path.resolve(process.cwd(), args.artifacts || 'qa-artifacts');
const errors = [];
const warnings = [];
const pages = Array.isArray(config.pages) ? config.pages : [];
const home = pages.find((page) => page.path === '/') || { file: 'index.html', path: '/' };
const homeFile = path.resolve(siteDir, home.file || 'index.html');

if (!fs.existsSync(homeFile)) {
  console.error(`Homepage file not found: ${homeFile}`);
  process.exit(1);
}
fs.mkdirSync(artifactsDir, { recursive: true });

const mime = (file) => {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js' || ext === '.mjs') return 'text/javascript; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
};

const server = http.createServer((req, res) => {
  try {
    const parsed = new URL(req.url || '/', 'http://127.0.0.1');
    let pathname = decodeURIComponent(parsed.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const relative = pathname.replace(/^\/+/, '');
    const resolved = path.resolve(siteDir, relative);
    if (!resolved.startsWith(siteDir + path.sep) && resolved !== siteDir) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': mime(resolved), 'cache-control': 'no-store' });
    fs.createReadStream(resolved).pipe(res);
  } catch (error) {
    res.writeHead(500).end(error.message);
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const routePath = home.path === '/' ? '/' : home.path;

let chrome;
try {
  chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const result = await lighthouse(`${baseUrl}${routePath}`, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      disabled: false,
    },
  });

  if (!result?.lhr) {
    errors.push('Lighthouse did not return an LHR report.');
  } else {
    const reportPath = path.join(artifactsDir, 'lighthouse.json');
    fs.writeFileSync(reportPath, `${JSON.stringify(result.lhr, null, 2)}\n`);

    const categories = result.lhr.categories || {};
    const thresholds = {
      performance: 0.60,
      accessibility: 0.85,
      'best-practices': 0.80,
      seo: 0.90,
    };
    for (const [key, minimum] of Object.entries(thresholds)) {
      const score = categories[key]?.score;
      if (typeof score !== 'number') {
        errors.push(`Lighthouse category ${key} has no numeric score.`);
      } else if (score < minimum) {
        errors.push(`Lighthouse ${key} score ${(score * 100).toFixed(0)} is below ${(minimum * 100).toFixed(0)}.`);
      }
    }

    const audits = result.lhr.audits || {};
    const cls = audits['cumulative-layout-shift']?.numericValue;
    const lcp = audits['largest-contentful-paint']?.numericValue;
    const tbt = audits['total-blocking-time']?.numericValue;

    if (typeof cls === 'number' && cls > 0.15) {
      errors.push(`Lighthouse CLS ${cls.toFixed(3)} exceeds the 0.15 hard limit.`);
    }
    if (typeof lcp === 'number') {
      if (lcp > 4000) errors.push(`Lighthouse LCP ${(lcp / 1000).toFixed(2)}s exceeds the 4.0s hard limit; target <= 2.5s.`);
      else if (lcp > 2500) warnings.push(`Lighthouse LCP ${(lcp / 1000).toFixed(2)}s needs improvement; target <= 2.5s.`);
    }
    if (typeof tbt === 'number' && tbt > 600) warnings.push(`Lighthouse TBT ${Math.round(tbt)}ms is high; review main-thread work.`);
  }
} catch (error) {
  errors.push(`Lighthouse QA failed to run: ${error.message}`);
} finally {
  if (chrome) await chrome.kill();
  await new Promise((resolve) => server.close(resolve));
}

const ok = printResult(`Lighthouse QA: ${configPath}`, errors, warnings);
console.log(`Artifacts: ${path.relative(process.cwd(), artifactsDir) || artifactsDir}`);
process.exit(ok ? 0 : 1);

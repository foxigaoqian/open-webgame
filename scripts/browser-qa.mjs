import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
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
const home = pages.find((page) => page.path === '/') || { file: 'index.html' };
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

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    const response = await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!response?.ok()) errors.push(`${viewport.name}: homepage returned HTTP ${response?.status() || 'unknown'}.`);

    const h1 = page.locator('h1').first();
    if (!(await h1.count()) || !(await h1.isVisible())) errors.push(`${viewport.name}: H1 is not visible.`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
    if (overflow) errors.push(`${viewport.name}: horizontal overflow detected.`);

    if (config.site?.mode === 'play-first') {
      const iframe = page.locator('iframe').first();
      if (!(await iframe.count())) {
        errors.push(`${viewport.name}: play-first page has no iframe.`);
      } else {
        const runtimeUrl = String(config.embed?.runtimeUrl || '');
        let src = (await iframe.getAttribute('src')) || '';
        if (!src || !src.startsWith(runtimeUrl)) {
          const loadButton = page.getByRole('button', { name: /load game|play in browser|play now/i }).first();
          if (await loadButton.count()) {
            await loadButton.click();
            try {
              await page.waitForFunction(
                (expected) => document.querySelector('iframe')?.getAttribute('src')?.startsWith(expected),
                runtimeUrl,
                { timeout: 10000 },
              );
            } catch {
              errors.push(`${viewport.name}: clicking the player CTA did not assign embed.runtimeUrl to the iframe.`);
            }
          } else {
            errors.push(`${viewport.name}: iframe is lazy but no playable load button was found.`);
          }
        }

        src = (await iframe.getAttribute('src')) || '';
        if (runtimeUrl && !src.startsWith(runtimeUrl)) errors.push(`${viewport.name}: iframe src does not match embed.runtimeUrl after interaction.`);

        if (viewport.name === 'desktop' && runtimeUrl) {
          try {
            await page.waitForFunction(
              (expected) => Array.from(document.querySelectorAll('iframe')).some((node) => node.src.startsWith(expected)),
              runtimeUrl,
              { timeout: 10000 },
            );
            await page.waitForTimeout(1500);
          } catch {
            errors.push('desktop: runtime iframe did not remain attached after loading.');
          }

          const reload = page.getByRole('button', { name: /reload/i }).first();
          if (await reload.count()) {
            await reload.click();
            await page.waitForTimeout(500);
            const afterReload = (await iframe.getAttribute('src')) || '';
            if (!afterReload.startsWith(runtimeUrl)) errors.push('desktop: Reload did not restore the configured runtime URL.');
          } else {
            warnings.push('desktop: no Reload control found.');
          }

          const fullscreen = page.getByRole('button', { name: /fullscreen/i }).first();
          if (!(await fullscreen.count())) warnings.push('desktop: no Fullscreen control found.');
        }
      }
    }

    await page.screenshot({ path: path.join(artifactsDir, `${viewport.name}.png`), fullPage: true });

    for (const error of pageErrors) errors.push(`${viewport.name}: pageerror: ${error}`);
    if (consoleErrors.length > 0) warnings.push(`${viewport.name}: ${consoleErrors.length} console error message(s) observed; inspect browser QA artifact/logs.`);

    await context.close();
  }
} catch (error) {
  errors.push(`Browser QA failed to run: ${error.message}`);
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const ok = printResult(`Browser QA: ${configPath}`, errors, warnings);
console.log(`Artifacts: ${path.relative(process.cwd(), artifactsDir) || artifactsDir}`);
process.exit(ok ? 0 : 1);

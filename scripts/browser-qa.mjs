import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
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
const home = pages.find((page) => page.path === '/') || { file: 'index.html', path: '/', language: config.site?.language || 'en' };
const defaultLanguage = config.i18n?.defaultLanguage || config.site?.language || 'en';
const pageTargets = config.i18n?.enabled
  ? pages.filter((page) => page.indexable !== false)
  : [home];
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

const runtimeOrigin = (runtimeUrl) => {
  try {
    return new URL(runtimeUrl).origin;
  } catch {
    return '';
  }
};

const runtimeUrlMatcher = (runtimeUrl) => {
  const origin = runtimeOrigin(runtimeUrl);
  return (url) => Boolean(origin) && url.origin === origin;
};

const getContentFrame = async (iframeLocator) => {
  const handle = await iframeLocator.elementHandle();
  if (!handle) return null;
  return handle.contentFrame();
};

const waitForRuntimeNavigation = async (frame, runtimeUrl, timeout = 15000) => {
  if (!frame || !runtimeOrigin(runtimeUrl)) return false;
  try {
    await frame.waitForURL(runtimeUrlMatcher(runtimeUrl), {
      timeout,
      waitUntil: 'domcontentloaded',
    });
    return true;
  } catch {
    return false;
  }
};

const slug = (value) => String(value || 'page').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'page';

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const target of pageTargets) {
    const locale = target.language || config.site?.language || 'page';
    const routePath = target.path || '/';

    for (const viewport of viewports) {
      const label = `${locale}/${viewport.name}`;
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      const pageErrors = [];
      const consoleErrors = [];
      const requestFailures = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('requestfailed', (request) => {
        requestFailures.push(`${request.failure()?.errorText || 'request failed'} ${request.url()}`);
      });

      const response = await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response?.ok()) errors.push(`${label}: page returned HTTP ${response?.status() || 'unknown'}.`);

      const h1 = page.locator('h1').first();
      if (!(await h1.count()) || !(await h1.isVisible())) errors.push(`${label}: H1 is not visible.`);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      if (overflow) errors.push(`${label}: horizontal overflow detected.`);

      if (config.i18n?.enabled) {
        const toggle = page.locator('.langToggle').first();
        if (!(await toggle.count()) || !(await toggle.isVisible())) {
          errors.push(`${label}: visible language dropdown toggle was not rendered.`);
        } else {
          await toggle.click();
          const menu = page.locator('.langMenu').first();
          if (!(await menu.isVisible())) errors.push(`${label}: language dropdown did not open.`);
          const languageLinks = page.locator('.langMenu a');
          const expectedLanguages = config.i18n.languages?.length || 0;
          if ((await languageLinks.count()) !== expectedLanguages) {
            errors.push(`${label}: language dropdown has ${await languageLinks.count()} links; expected ${expectedLanguages}.`);
          }
          await page.keyboard.press('Escape');
          if (await menu.isVisible()) errors.push(`${label}: language dropdown did not close on Escape.`);
        }
      }

      try {
        const axeResults = await new AxeBuilder({ page })
          .exclude('iframe')
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        fs.writeFileSync(path.join(artifactsDir, `axe-${slug(locale)}-${viewport.name}.json`), `${JSON.stringify(axeResults, null, 2)}\n`);
        for (const violation of axeResults.violations) {
          const impact = violation.impact || 'unknown';
          const summary = `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`;
          if (impact === 'critical' || impact === 'serious') {
            errors.push(`${label}: accessibility ${impact}: ${summary}`);
          } else {
            warnings.push(`${label}: accessibility ${impact}: ${summary}`);
          }
        }
      } catch (error) {
        errors.push(`${label}: axe accessibility audit failed to run: ${error.message}`);
      }

      if (config.site?.mode === 'play-first') {
        const iframe = page.locator('iframe').first();
        if (!(await iframe.count())) {
          errors.push(`${label}: play-first page has no iframe.`);
        } else {
          const runtimeUrl = String(config.embed?.runtimeUrl || '');
          const configuredRuntime = (await iframe.getAttribute('data-src')) || (await iframe.getAttribute('src')) || '';
          if (runtimeUrl && !configuredRuntime.startsWith(runtimeUrl)) {
            errors.push(`${label}: iframe data-src/src does not match embed.runtimeUrl.`);
          }

          // Every locale validates its shell, player wiring and accessibility.
          // The shared remote game runtime is booted only once on the default
          // locale desktop page to avoid third-party hotlink/rate-limit flakiness.
          if (viewport.name === 'desktop' && locale === defaultLanguage) {
            let src = (await iframe.getAttribute('src')) || '';
            if (!src || !src.startsWith(runtimeUrl)) {
              const loadButton = page.locator('button[onclick*="startGame"]').last();
              if (await loadButton.count()) {
                await loadButton.click();
                try {
                  await page.waitForFunction(
                    (expected) => document.querySelector('iframe')?.getAttribute('src')?.startsWith(expected),
                    runtimeUrl,
                    { timeout: 10000 },
                  );
                } catch {
                  errors.push(`${label}: clicking the localized player CTA did not assign embed.runtimeUrl to the iframe.`);
                }
              } else {
                errors.push(`${label}: iframe is lazy but no startGame control was found.`);
              }
            }

            src = (await iframe.getAttribute('src')) || '';
            if (runtimeUrl && !src.startsWith(runtimeUrl)) errors.push(`${label}: iframe src does not match embed.runtimeUrl after interaction.`);

            const contentFrame = await getContentFrame(iframe);
            if (!contentFrame) {
              errors.push(`${label}: browser could not resolve the iframe content frame.`);
            } else if (runtimeUrl) {
              const booted = await waitForRuntimeNavigation(contentFrame, runtimeUrl);
              if (!booted) {
                const failedAtRuntimeOrigin = requestFailures.filter((item) => item.includes(runtimeOrigin(runtimeUrl))).slice(-3);
                errors.push(`${label}: game child frame did not reach the configured runtime origin; current frame URL is ${contentFrame.url() || 'empty'}.`);
                for (const failure of failedAtRuntimeOrigin) warnings.push(`${label}: runtime request failure: ${failure}`);
              }
            }

            if (runtimeUrl && contentFrame) {
              const reload = page.locator('button[onclick*="reloadGame"]').first();
              if (await reload.count()) {
                const blankNavigation = contentFrame.waitForURL('about:blank', {
                  timeout: 5000,
                  waitUntil: 'commit',
                }).then(() => true).catch(() => false);

                await reload.click();
                const sawBlank = await blankNavigation;
                if (!sawBlank) {
                  errors.push(`${label}: Reload did not navigate the game child frame to about:blank; current frame URL is ${contentFrame.url() || 'empty'}.`);
                } else {
                  const rebooted = await waitForRuntimeNavigation(contentFrame, runtimeUrl, 15000);
                  if (!rebooted) {
                    errors.push(`${label}: Reload did not navigate the same game child frame back to the configured runtime origin; current frame URL is ${contentFrame.url() || 'empty'}.`);
                  }
                }

                const afterReload = (await iframe.getAttribute('src')) || '';
                if (!afterReload.startsWith(runtimeUrl)) errors.push(`${label}: Reload did not restore the configured iframe src.`);
              } else {
                warnings.push(`${label}: no reloadGame control found.`);
              }

              const fullscreen = page.locator('button[onclick*="fullGame"]').first();
              if (!(await fullscreen.count())) warnings.push(`${label}: no fullGame control found.`);
            }
          }
        }
      }

      await page.screenshot({ path: path.join(artifactsDir, `${slug(locale)}-${viewport.name}.png`), fullPage: true });

      for (const error of pageErrors) errors.push(`${label}: pageerror: ${error}`);
      if (consoleErrors.length > 0) warnings.push(`${label}: ${consoleErrors.length} console error message(s) observed; inspect browser QA artifact/logs.`);

      await context.close();
    }
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

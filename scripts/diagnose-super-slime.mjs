import fs from 'node:fs';
import { chromium } from 'playwright';

const target = 'https://foxigaoqian.github.io/open-webgame/super-slime-black-hole/';
fs.mkdirSync('qa-artifacts/super-slime-diagnostic', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const events = [];
const push = (type, value) => events.push({ at: new Date().toISOString(), type, value: String(value).slice(0, 1200) });

page.on('console', (msg) => push(`console:${msg.type()}`, msg.text()));
page.on('pageerror', (err) => push('pageerror', err.stack || err.message));
page.on('requestfailed', (req) => push('requestfailed', `${req.failure()?.errorText || 'failed'} ${req.url()}`));
context.on('page', (popup) => {
  push('popup', popup.url());
  popup.on('console', (msg) => push(`popup-console:${msg.type()}`, msg.text()));
  popup.on('pageerror', (err) => push('popup-pageerror', err.stack || err.message));
});

const snapshot = async (label) => {
  const frames = page.frames().map((frame) => ({ name: frame.name(), url: frame.url() }));
  push(`frames:${label}`, JSON.stringify(frames));
  await page.screenshot({ path: `qa-artifacts/super-slime-diagnostic/${label}.png`, fullPage: true });
};

try {
  const resp = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30000 });
  push('main-status', resp?.status());
  await page.getByRole('button', { name: /play in browser/i }).click();
  await page.waitForTimeout(5000);
  await snapshot('01-after-outer-play');

  const gameFrameElement = page.locator('#game');
  const gameFrame = await gameFrameElement.contentFrame();
  if (!gameFrame) throw new Error('Kiz10 iframe did not attach');
  push('kiz10-frame-url', gameFrame.url());
  push('kiz10-title', await gameFrame.title().catch(() => ''));

  const buttons = await gameFrame.getByRole('button').allTextContents().catch(() => []);
  const links = await gameFrame.getByRole('link').allTextContents().catch(() => []);
  push('kiz10-buttons', JSON.stringify(buttons));
  push('kiz10-links', JSON.stringify(links.slice(0, 30)));

  const playCandidates = [
    gameFrame.getByRole('button', { name: /play game/i }).first(),
    gameFrame.getByText(/play game/i).first(),
    gameFrame.locator('[class*="play"], [id*="play"]').first(),
  ];
  let clicked = false;
  for (const candidate of playCandidates) {
    if (await candidate.count().catch(() => 0)) {
      try {
        await candidate.click({ timeout: 5000 });
        clicked = true;
        push('inner-play-click', 'clicked');
        break;
      } catch (err) {
        push('inner-play-click-error', err.message);
      }
    }
  }
  if (!clicked) push('inner-play-click', 'no clickable candidate found');

  await page.waitForTimeout(15000);
  await snapshot('02-after-inner-play');

  for (const frame of page.frames()) {
    let canvasCount = 0;
    let iframeCount = 0;
    try { canvasCount = await frame.locator('canvas').count(); } catch {}
    try { iframeCount = await frame.locator('iframe').count(); } catch {}
    push('frame-state', JSON.stringify({ url: frame.url(), canvasCount, iframeCount }));
  }
} catch (err) {
  push('fatal', err.stack || err.message);
  await page.screenshot({ path: 'qa-artifacts/super-slime-diagnostic/fatal.png', fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  fs.writeFileSync('qa-artifacts/super-slime-diagnostic/events.json', JSON.stringify(events, null, 2));
  console.log(JSON.stringify(events, null, 2));
  await browser.close();
}

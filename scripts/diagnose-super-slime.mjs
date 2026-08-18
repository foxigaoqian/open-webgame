import fs from 'node:fs';
import { chromium } from 'playwright';

const target = 'https://foxigaoqian.github.io/open-webgame/super-slime-black-hole/';
fs.mkdirSync('qa-artifacts/super-slime-diagnostic', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const events = [];
const push = (type, value) => events.push({ at: new Date().toISOString(), type, value: String(value).slice(0, 1800) });

page.on('console', (msg) => push(`console:${msg.type()}`, msg.text()));
page.on('pageerror', (err) => push('pageerror', err.stack || err.message));
page.on('requestfailed', (req) => push('requestfailed', `${req.failure()?.errorText || 'failed'} ${req.url()}`));
page.on('response', (res) => {
  const u = res.url();
  if (res.status() >= 400 || /kiz10|cdn|unity|game|html5/i.test(u)) push(`response:${res.status()}`, u);
});
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

  const gameFrame = page.frame({ name: 'game' });
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

  await page.waitForTimeout(18000);
  await snapshot('02-after-inner-play');

  for (const frame of page.frames()) {
    let canvasCount = 0;
    let iframeCount = 0;
    let text = '';
    try { canvasCount = await frame.locator('canvas').count(); } catch {}
    try { iframeCount = await frame.locator('iframe').count(); } catch {}
    try { text = (await frame.locator('body').innerText({ timeout: 1500 })).slice(0, 500); } catch {}
    push('frame-state', JSON.stringify({ name: frame.name(), url: frame.url(), canvasCount, iframeCount, text }));
  }

  const runtimeFrames = page.frames().filter((frame) => frame.name() === 'box-game-swf' || frame.url() !== 'about:blank' && frame !== page.mainFrame() && frame.name() !== 'game');
  if (!runtimeFrames.some((frame) => frame.name() === 'box-game-swf' && frame.url() !== 'about:blank')) {
    push('runtime-verdict', 'FAIL: box-game-swf never navigated away from about:blank');
    process.exitCode = 2;
  } else {
    push('runtime-verdict', 'PASS: runtime child frame navigated');
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

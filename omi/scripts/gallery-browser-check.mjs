const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    const mediaRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().includes('/media/galeria/') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    page.on('request', request => { if (request.url().endsWith('.mp4')) mediaRequests.push(request.url()); });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1200);
    assert.equal(await page.locator('#galeria').count(), 0, 'Gallery is not rendered on home');
    assert.equal(mediaRequests.length, 0, 'No videos downloaded on initial load');
    await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Galería', exact: true }).click();
    await page.waitForURL('**/galeria');
    await page.waitForTimeout(1800);
    assert.equal(await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Galería', exact: true }).getAttribute('aria-current'), 'page');
    assert.equal(await page.locator('#galeria video').count(), 5);
    assert.ok(await page.locator('h1#gallery-page-title').isVisible());
    const individualCards = await page.locator('#galeria article').evaluateAll(cards => cards.slice(1).map(card => {
      const box = card.getBoundingClientRect();
      return { height: box.height, bottom: box.bottom };
    }));
    assert.ok(Math.max(...individualCards.map(card => card.height)) - Math.min(...individualCards.map(card => card.height)) <= 1, 'Individual cards have equal heights');
    assert.ok(Math.max(...individualCards.map(card => card.bottom)) - Math.min(...individualCards.map(card => card.bottom)) <= 1, 'Individual cards have aligned bottoms');
    const family = page.locator('#galeria article').first();
    await page.locator('#galeria').scrollIntoViewIfNeeded();
    await family.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.waitForFunction(() => !document.querySelector('#galeria video').paused);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.ok(await family.locator('video').evaluate(v => v.paused));
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(() => !document.querySelector('#galeria video').paused);
    assert.ok(await family.locator('video').evaluate(v => v.muted && v.loop && v.playsInline));
    await family.getByRole('button', { name: 'Pausar Familia OMI' }).click();
    assert.ok(await family.locator('video').evaluate(v => v.paused));
    await family.getByRole('button', { name: 'Reproducir Familia OMI' }).click();
    await page.waitForFunction(() => !document.querySelector('#galeria video').paused);
    await family.getByRole('button', { name: 'Ampliar Familia OMI' }).click();
    assert.ok(await family.locator('video').first().evaluate(v => v.paused));
    assert.ok(await page.locator('dialog').evaluate(el => el.open));
    assert.equal(await page.locator('body').evaluate(el => el.style.overflow), 'hidden');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.evaluate(() => !!document.activeElement.closest('dialog')));
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      assert.ok(await page.evaluate(() => !!document.activeElement.closest('dialog')), 'Focus remains inside while traversing native controls');
    }
    await page.locator('dialog video').focus();
    await page.keyboard.press('Space');
    await page.waitForFunction(() => !document.querySelector('dialog video').paused);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    assert.equal(await page.locator('dialog').count(), 0);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Ampliar Familia OMI');
    await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
    await page.locator('#galeria').screenshot({ path: path.join(__dirname, '../docs/ai-kit/evals/gallery-desktop.png'), animations: 'disabled' });
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('http://localhost:3000');
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      await page.locator('#mobile-navigation').getByRole('link', { name: 'Galería', exact: true }).click();
      await page.waitForURL('**/galeria');
      assert.ok(await page.locator('h1#gallery-page-title').isVisible());
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      assert.equal(await page.locator('#mobile-navigation').getByRole('link', { name: 'Galería', exact: true }).getAttribute('aria-current'), 'page');
      await page.getByRole('button', { name: 'Cerrar menú' }).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      await page.addStyleTag({ content: 'header { visibility: hidden !important; }' });
      await page.locator('#galeria').screenshot({ path: path.join(__dirname, `../docs/ai-kit/evals/gallery-${width}.png`), animations: 'disabled' });
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    assert.ok(await page.locator('#galeria video').first().evaluate(video => video.paused));
    const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
    await reduced.goto('http://localhost:3000/galeria');
    await reduced.locator('#galeria').scrollIntoViewIfNeeded();
    await reduced.waitForTimeout(1000);
    assert.ok(await reduced.locator('#galeria video').evaluateAll(videos => videos.every(v => v.paused)));
    await reduced.getByRole('button', { name: 'Reproducir Familia OMI' }).click();
    await reduced.waitForFunction(() => !document.querySelector('#galeria video').paused);
    const blocked = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await blocked.addInitScript(() => { HTMLMediaElement.prototype.play = function() { return Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError')); }; });
    await blocked.goto('http://localhost:3000/galeria');
    await blocked.locator('#galeria').scrollIntoViewIfNeeded();
    await blocked.waitForTimeout(1000);
    assert.ok(await blocked.getByRole('button', { name: 'Reproducir Familia OMI' }).isVisible());
    assert.ok(await blocked.locator('#galeria video').first().evaluate(v => v.paused && !!v.poster));
    assert.deepEqual(errors, []);
    console.log('PASS: desktop/tablet/mobile, deferred sources, playback/pause, reduced motion, autoplay rejection, modal focus/Escape, overflow and media HTTP responses.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

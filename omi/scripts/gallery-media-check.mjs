// Local QA and lossless-source poster extraction. Requires Playwright via NODE_PATH.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/galeria');
    for (const name of ['omi-familia', 'omi-330cc', 'omi-1-5l', 'omi-5l', 'omi-18l']) {
      const result = await page.evaluate(async name => {
        const video = document.createElement('video');
        video.muted = true;
        video.src = `/media/galeria/${name}.mp4`;
        await new Promise((resolve, reject) => {
          video.onloadeddata = resolve;
          video.onerror = () => reject(new Error(`Cannot decode ${name}`));
        });
        video.currentTime = 1;
        await new Promise(resolve => { video.onseeked = resolve; });
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        return { width: video.videoWidth, height: video.videoHeight, duration: video.duration, poster: canvas.toDataURL('image/jpeg', 0.94) };
      }, name);
      fs.writeFileSync(path.join(__dirname, '../public/media/galeria', `${name}.jpg`), Buffer.from(result.poster.split(',')[1], 'base64'));
      console.log(name, JSON.stringify({ width: result.width, height: result.height, duration: result.duration }));
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

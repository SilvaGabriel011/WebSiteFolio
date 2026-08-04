/* Full-page screenshot with the repo's scroll-reveal handled: pages reveal
   sections via IntersectionObserver, so the page is walked end-to-end and
   leftover .reveal/[data-reveal] elements are forced visible before the shot
   — a naive capture leaves whole blocks blank.

   Usage:
     node tools/capture.js <url> <out.jpg> [width=1280] [deviceScaleFactor=0.7]
   Example (serve the repo root on :8080 first):
     node tools/capture.js http://localhost:8080/sites/proflow-plumbing/bold/index.html shot.jpg 390 0.85 */
const { chromium } = require('playwright');

const [url, out, width = '1280', dsf = '0.7'] = process.argv.slice(2);
if (!url || !out) {
  console.error('uso: node tools/capture.js <url> <out.jpg> [width] [deviceScaleFactor]');
  process.exit(2);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium'
  });
  const ctx = await browser.newContext({
    viewport: { width: +width, height: 900 },
    reducedMotion: 'reduce',
    deviceScaleFactor: +dsf
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(350);
  await page.evaluate(async () => {
    const step = Math.round(innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 250));
    document.querySelectorAll('.reveal, [data-reveal]').forEach(el => el.classList.add('is-visible'));
    scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 250));
  });
  await page.waitForTimeout(250);
  await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 82 });
  console.log('salvo:', out);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });

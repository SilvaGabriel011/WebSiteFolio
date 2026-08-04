/* Browser QA pass over every site variant (sites/<slug>/<variant>/), found
   dynamically so new variants are covered automatically.

   Per page (index + gallery when present), desktop 1280 and mobile 390:
   content present, exactly one h1, nav links, app links carry ?business=,
   no broken images, no horizontal overflow, no console/page errors, no
   failed requests (404s on assets/photos/*.jpg are the designed drop-in
   miss — the onerror fallback swaps to SVG — and are tolerated).
   Pages with a .hslider hero also get a functional carousel check:
   caption changes on next, wraps around, dots track the active slide.

   Usage:  node tools/verify-sites.js   (serve the repo root on :8080 first)
   Deps:   npm i playwright  (Chromium at /opt/pw-browsers/chromium) */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.BASE_URL || 'http://localhost:8080';
const EXECUTABLE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';

function discoverPages() {
  const pages = [];
  const sitesDir = path.join(ROOT, 'sites');
  for (const slug of fs.readdirSync(sitesDir)) {
    const slugDir = path.join(sitesDir, slug);
    if (!fs.statSync(slugDir).isDirectory()) continue;
    for (const variant of fs.readdirSync(slugDir)) {
      const vDir = path.join(slugDir, variant);
      if (!fs.statSync(vDir).isDirectory()) continue;
      for (const file of ['index.html', 'gallery.html']) {
        if (fs.existsSync(path.join(vDir, file))) {
          pages.push({ tag: `${slug}/${variant}/${file}`, url: `${BASE}/sites/${slug}/${variant}/${file}` });
        }
      }
    }
  }
  return pages;
}

let failures = 0;
function ok(cond, label) {
  if (!cond) { failures++; console.log('  FAIL ' + label); }
  return cond;
}

async function checkPage(browser, { tag, url }) {
  let allGood = true;
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errs = [], bad = [];
    page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errs.push(m.text()); });
    page.on('response', r => {
      if (r.status() >= 400 && !/assets\/photos\/[^/]+\.jpg$/.test(r.url())) {
        bad.push(r.status() + ' ' + r.url().split('/').slice(-2).join('/'));
      }
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.evaluate(async () => {
      const step = Math.round(innerHeight * 0.8);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        scrollTo(0, y);
        await new Promise(r => setTimeout(r, 40));
      }
      document.querySelectorAll('.reveal, [data-reveal]').forEach(el => el.classList.add('is-visible'));
      scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 150));
    });
    await page.waitForTimeout(200);

    const text = await page.locator('body').innerText();
    allGood &= ok(text.length > 400, `${tag} @${w}: has content`);
    allGood &= ok((await page.locator('h1').count()) === 1, `${tag} @${w}: exactly one h1`);
    allGood &= ok((await page.locator('a[href]').count()) >= 3, `${tag} @${w}: has links`);
    const brokenImgs = await page.evaluate(() =>
      [...document.images].filter(i => i.complete && i.naturalWidth === 0).length);
    allGood &= ok(brokenImgs === 0, `${tag} @${w}: images render (${brokenImgs} broken)`);
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    allGood &= ok(overflow <= 0, `${tag} @${w}: no horizontal overflow (${overflow}px)`);

    if (tag.endsWith('index.html')) {
      const appLinks = await page.evaluate(() =>
        [...document.querySelectorAll('a[href*="app/index.html"]')].map(a => a.getAttribute('href')));
      allGood &= ok(appLinks.length > 0 && appLinks.every(hh => hh.includes('business=')),
        `${tag} @${w}: app links carry ?business= (${appLinks.length})`);
    }

    // Functional carousel check when the page ships one.
    if (await page.locator('.hslider').count()) {
      const cap0 = (await page.locator('[data-hs-caption]').first().innerText()).trim();
      const slides = await page.locator('.hslide').count();
      for (let i = 0; i < slides; i++) {
        await page.locator('.hs-next').first().click();
        await page.waitForTimeout(350);
      }
      const capLoop = (await page.locator('[data-hs-caption]').first().innerText()).trim();
      await page.locator('.hs-next').first().click();
      await page.waitForTimeout(350);
      const cap1 = (await page.locator('[data-hs-caption]').first().innerText()).trim();
      allGood &= ok(cap1 !== cap0, `${tag} @${w}: carousel caption changes`);
      allGood &= ok(capLoop === cap0, `${tag} @${w}: carousel wraps around`);
      const dotOk = await page.evaluate(() =>
        [...document.querySelectorAll('.hs-dot')].filter(d => d.getAttribute('aria-current') === 'true').length === 1);
      allGood &= ok(dotOk, `${tag} @${w}: exactly one active carousel dot`);
    }

    allGood &= ok(errs.length === 0, `${tag} @${w}: no console/page errors → ${errs.slice(0, 2).join(' | ')}`);
    allGood &= ok(bad.length === 0, `${tag} @${w}: no failed requests → ${bad.slice(0, 3).join(' | ')}`);
    await ctx.close();
  }
  return allGood;
}

(async () => {
  const pages = discoverPages();
  console.log(`${pages.length} pages discovered under sites/`);
  const browser = await chromium.launch({ executablePath: EXECUTABLE });
  for (const p of pages) {
    const good = await checkPage(browser, p);
    console.log(`${good ? 'PASS  ' : 'ISSUES'}  ${p.tag}`);
  }
  await browser.close();
  console.log('\n' + (failures ? failures + ' FAILURES' : 'ALL SITE PAGES PASS'));
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

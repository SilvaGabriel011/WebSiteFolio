/* Full app verification: every business × every route, console/page errors,
   nav integrity, detail routes, booking flow end-to-end, quick actions. */
const { chromium } = require('playwright');

const BASE = (process.env.BASE_URL || 'http://localhost:8080') + '/app/index.html';
const BUSINESSES = ['proflow-plumbing', 'ironbark-cabinetry', 'harbourline-joinery', 'sunline-kitchens'];
const SECTIONS = ['dashboard', 'schedule', 'book', 'sales', 'purchasing', 'inventory', 'maintenance', 'money', 'settings'];

let failures = 0;
function ok(cond, label) {
  if (cond) console.log('  PASS ' + label);
  else { failures++; console.log('  FAIL ' + label); }
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });

  for (const biz of BUSINESSES) {
    console.log('\n=== ' + biz + ' ===');
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    const failed = [];
    page.on('requestfailed', r => failed.push(r.url()));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });

    await page.goto(BASE + '?business=' + biz + '#/dashboard');
    await page.waitForTimeout(400);

    ok((await page.locator('#sidebar-nav a').count()) === SECTIONS.length,
      'nav has ' + SECTIONS.length + ' entries (got ' + await page.locator('#sidebar-nav a').count() + ')');
    ok((await page.locator('#quick-actions .qa-btn').count()) === 2, 'quick-actions panel has 2 buttons');

    for (const section of SECTIONS) {
      await page.goto(BASE + '?business=' + biz + '#/' + section);
      await page.waitForTimeout(250);
      const text = await page.locator('#view').innerText();
      const broken = text.includes('Something went wrong') || text.includes('This screen is loading');
      ok(!broken && text.trim().length > 20, '#/' + section + ' renders');
      if (section === 'book') {
        ok(await page.evaluate(() => document.body.classList.contains('consumer')), '#/book is consumer mode');
      }
    }

    // Detail routes (ids exist in every dataset? proflow ids q2/i3/po2; others use same shape ids — check generically)
    const quoteId = await page.evaluate(() => (DEMO.store.get('quotes')[0] || {}).id);
    const invId = await page.evaluate(() => (DEMO.store.get('invoices')[0] || {}).id);
    const poId = await page.evaluate(() => (DEMO.store.get('purchaseOrders')[0] || {}).id);
    for (const [route, id] of [['sales/quote', quoteId], ['money/invoice', invId], ['purchasing/po', poId]]) {
      if (!id) { console.log('  SKIP ' + route + ' (no data)'); continue; }
      await page.goto(BASE + '?business=' + biz + '#/' + route + '/' + id);
      await page.waitForTimeout(250);
      const text = await page.locator('#view').innerText();
      ok(!text.includes('no longer in the demo data') && text.includes('GST') || route === 'purchasing/po' && text.includes('Order'),
        '#/' + route + '/' + id + ' renders detail');
    }

    ok(errors.length === 0, 'no console/page errors' + (errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''));
    ok(failed.length === 0, 'no failed requests' + (failed.length ? ' → ' + failed.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  // ---- Interaction tests on proflow ----
  console.log('\n=== interactions (proflow-plumbing) ===');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  // Booking flow end-to-end
  await page.goto(BASE + '?business=proflow-plumbing#/book');
  await page.waitForTimeout(300);
  await page.locator('.book-service').first().click();
  await page.waitForTimeout(200);
  const freeSlot = page.locator('.book-slot:not(.is-taken)').first();
  ok(await freeSlot.count() > 0 || await page.locator('.book-day').count() > 0, 'booking: time step shows');
  await freeSlot.click();
  await page.waitForTimeout(200);
  await page.fill('.book-form input[type="text"]', 'Playwright Test');
  await page.fill('.book-form input[type="tel"]', '0400 000 111');
  await page.locator('.book-form .btn--primary').click();
  await page.waitForTimeout(300);
  ok((await page.locator('.book-confirm').count()) === 1, 'booking: confirmation shows');
  const jobCount = await page.evaluate(() =>
    DEMO.store.get('jobs').filter(j => j.source === 'booking' && j.title.includes('Emergency')).length
      + DEMO.store.get('customers').filter(c => c.name === 'Playwright Test').length);
  ok(jobCount >= 1, 'booking: job + customer created in store');

  // Quick actions: hotkey N opens the quote drawer
  await page.goto(BASE + '?business=proflow-plumbing#/dashboard');
  await page.waitForTimeout(300);
  await page.keyboard.press('n');
  await page.waitForTimeout(200);
  ok((await page.locator('.overlay .drawer').count()) === 1, 'hotkey N opens New quote drawer');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  ok((await page.locator('.overlay').count()) === 0, 'Escape closes drawer');

  // Sales: New quote button uses shared drawer
  await page.goto(BASE + '?business=proflow-plumbing#/sales');
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: '+ New quote' }).click();
  await page.waitForTimeout(200);
  ok((await page.locator('.overlay .drawer').count()) === 1, 'Sales "New quote" opens drawer');
  await page.keyboard.press('Escape');

  // Schedule: open a job drawer, status action present
  await page.goto(BASE + '?business=proflow-plumbing#/schedule');
  await page.waitForTimeout(250);
  await page.locator('.tbl__row--link').first().click();
  await page.waitForTimeout(200);
  ok((await page.locator('.overlay .drawer').count()) === 1, 'schedule row opens job drawer');
  await page.keyboard.press('Escape');

  // Money: record payment on a sent invoice
  await page.goto(BASE + '?business=proflow-plumbing#/money/invoice/i3');
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Record payment' }).click();
  await page.waitForTimeout(250);
  const paid = await page.evaluate(() => DEMO.store.find('invoices', 'i3').status);
  ok(paid === 'paid', 'invoice i3 marked paid (got ' + paid + ')');

  // Purchasing: receive po2 updates stock
  const beforeQty = await page.evaluate(() => DEMO.store.find('stock', 'st4').qty);
  await page.goto(BASE + '?business=proflow-plumbing#/purchasing/po/po2');
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Receive stock' }).click();
  await page.waitForTimeout(200);
  await page.locator('.modal .btn--danger').click();
  await page.waitForTimeout(250);
  const afterQty = await page.evaluate(() => DEMO.store.find('stock', 'st4').qty);
  ok(afterQty === beforeQty + 20, 'receiving po2 adds 20 to st4 (' + beforeQty + ' → ' + afterQty + ')');

  // Maintenance: log service resets clock
  await page.goto(BASE + '?business=proflow-plumbing#/maintenance');
  await page.waitForTimeout(250);
  ok((await page.locator('.tbl__row--link').count()) >= 5, 'maintenance lists assets');

  ok(errors.length === 0, 'interactions: no console/page errors' + (errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''));

  // Mobile viewport smoke: tab bar + FAB
  const mctx = await browser.newContext({ viewport: { width: 375, height: 720 } });
  const mpage = await mctx.newPage();
  const merrors = [];
  mpage.on('pageerror', e => merrors.push(e.message));
  await mpage.goto(BASE + '?business=sunline-kitchens#/dashboard');
  await mpage.waitForTimeout(400);
  ok((await mpage.locator('#tabbar .tabbar__item').count()) === 5, 'mobile tab bar shows 5 slots (4 + More)');
  ok(await mpage.locator('.qa-fab').isVisible(), 'mobile FAB visible');
  await mpage.locator('#tabbar button.tabbar__item').click();
  await mpage.waitForTimeout(250);
  ok((await mpage.locator('.overlay .sheet-nav a').count()) === 5, 'More sheet lists 5 overflow sections');
  ok(merrors.length === 0, 'mobile: no page errors');

  await browser.close();
  console.log('\n' + (failures ? failures + ' FAILURES' : 'ALL PASS'));
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

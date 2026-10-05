// Live QA runner for DeshBhromon. Run it from a machine that can reach the site.
//   npm i --no-save playwright axe-core && npx playwright install chromium
//   node scripts/live-qa.mjs https://deshbhromon.vercel.app            # full run
//   node scripts/live-qa.mjs http://localhost:4173 --skip-external      # local sanity run
// Prints a PASS/FAIL report and exits non-zero if anything failed.
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const BASE = (process.argv[2] || 'https://deshbhromon.vercel.app').replace(/\/$/, '');
const SKIP_EXTERNAL = process.argv.includes('--skip-external');
const LOCAL = /localhost|127\.0\.0\.1/.test(BASE); // vercel.json headers only exist on Vercel
const WIDTHS = [360, 390, 768, 1024, 1280];
const TABS = ['home', 'guide', 'map', 'plan', 'diary', 'food', 'safety', 'quiz', 'world'];

const results = [];
const check = (area, name, ok, detail = '') => {
  results.push({ area, name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  [${area}] ${name}${detail ? ' — ' + detail : ''}`);
};

let chromium, axeSource;
try {
  ({ chromium } = require('playwright'));
  axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
} catch {
  console.error('Missing deps. Run: npm i --no-save playwright axe-core && npx playwright install chromium');
  process.exit(2);
}

// ---------- 1. HTTP: headers, SEO files ----------
async function httpChecks() {
  const get = async (p) => {
    const r = await fetch(BASE + p, { redirect: 'follow' });
    return { r, text: p.match(/\.(png|woff2|jpg)$/) ? '' : await r.text() };
  };
  const home = await get('/');
  check('access', 'home returns 200 HTML', home.r.status === 200 && /<div id="root">/.test(home.text), `status ${home.r.status}`);
  check('access', 'not a Vercel login wall', !/vercel\.com\/login|Authentication Required/i.test(home.text));
  const h = home.r.headers;
  const csp = h.get('content-security-policy') || '';
  const sec = (name, ok, d = '') => (LOCAL ? console.log(`SKIP  [security] ${name} (local server has no vercel.json headers)`) : check('security', name, ok, d));
  sec('CSP present and restrictive', /default-src 'self'/.test(csp) && /frame-ancestors 'none'/.test(csp) && !/unsafe-eval/.test(csp));
  sec('nosniff', h.get('x-content-type-options') === 'nosniff');
  sec('referrer-policy', !!h.get('referrer-policy'), h.get('referrer-policy') || '');
  sec('frame protection', h.get('x-frame-options') === 'DENY');
  sec('permissions-policy', !!h.get('permissions-policy'));
  const html = home.text;
  const origin = new URL(BASE).origin;
  const has = (re) => re.test(html);
  if (!BASE.includes('localhost')) {
    check('seo', 'canonical = site origin', has(new RegExp(`rel="canonical" href="${origin}/"`)));
    check('seo', 'og:url / og:image absolute', has(new RegExp(`og:url" content="${origin}/"`)) && has(new RegExp(`og:image" content="${origin}/assets/og-image.png"`)));
  }
  check('seo', 'title + description', has(/<title>[^<]+<\/title>/) && has(/name="description" content="[^"]{30,}/));
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let ldOk = false;
  try { ldOk = !!ld && JSON.parse(ld[1])['@type'] === 'WebApplication'; } catch { /* ignore */ }
  check('seo', 'JSON-LD parses (WebApplication)', ldOk || BASE.includes('localhost'));
  check('seo', 'no old branding / localhost in HTML', !/unseen\s*bangladesh|localhost:|আমার দেশ ম্যাপ/i.test(html) || BASE.includes('localhost'));
  for (const p of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest']) {
    const x = await get(p);
    check('seo', `${p} 200`, x.r.status === 200 || (BASE.includes('localhost') && p === '/sitemap.xml'), `status ${x.r.status}`);
    if (p === '/robots.txt') check('seo', 'robots.txt has sitemap line', /Sitemap: https?:\/\//.test(x.text) || BASE.includes('localhost'));
    if (p === '/manifest.webmanifest') {
      try { const m = JSON.parse(x.text); check('seo', 'manifest has name, icons, start_url', !!m.name && m.icons?.length >= 2 && !!m.start_url); } catch { check('seo', 'manifest JSON valid', false); }
    }
  }
  const js = html.match(/src="(\/static\/[^"]+\.js)"/);
  if (js) {
    const r = await fetch(BASE + js[1]);
    check('perf', '/static JS is immutable-cached', /immutable/.test(r.headers.get('cache-control') || '') || BASE.includes('localhost'), r.headers.get('cache-control') || '');
  }
  const og = await fetch(BASE + '/assets/og-image.png');
  check('seo', 'og-image 200 image/png', og.status === 200 && /image\/png/.test(og.headers.get('content-type') || ''));
}

// ---------- 2. Image URLs (dataset) ----------
async function imageChecks() {
  if (SKIP_EXTERNAL) return console.log('SKIP  image URL checks (--skip-external)');
  const src = fs.readFileSync(new URL('../src/data/landmark-images.ts', import.meta.url), 'utf8');
  const entries = [...src.matchAll(/"([^"]+)": \{\s*url: "([^"]+)",\s*caption: "([^"]+)"/g)].map((m) => ({ id: m[1], url: m[2], caption: m[3] }));
  let bad = 0;
  for (const e of entries) {
    try {
      const r = await fetch(e.url, { redirect: 'follow' });
      const ok = r.status === 200 && /^image\//.test(r.headers.get('content-type') || '');
      if (!ok) { bad++; console.log(`  broken: ${e.id} ${e.caption} -> ${r.status} ${decodeURIComponent(e.url.split('FilePath/')[1].split('?')[0])}`); }
    } catch (err) { bad++; console.log(`  error: ${e.id} ${err.message}`); }
  }
  check('images', `district images load (${entries.length - bad}/${entries.length})`, bad === 0);
  const home = ["Cox's Bazar", 'Bagerhat', 'Rangamati', 'Sylhet', 'Bandarban', 'Sunamganj', 'Naogaon', 'Panchagarh'];
  console.log('  Homepage mosaic files (verify each depicts its landmark by eye, plus author/licence on the Commons page):');
  for (const id of home) {
    const e = entries.find((x) => x.id === id);
    console.log(`   - ${id.padEnd(12)} ${e?.caption} :: https://commons.wikimedia.org/wiki/File:${decodeURIComponent(e.url.split('FilePath/')[1].split('?')[0])}`);
  }
}

// ---------- 3. Browser: per width, per tab ----------
async function browserChecks() {
  const browser = await chromium.launch();
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: w < 500, hasTouch: w < 500 });
    const page = await ctx.newPage();
    const problems = { console: [], failed: [], csp: [] };
    page.on('console', (m) => m.type() === 'error' && !(SKIP_EXTERNAL && /Failed to load resource/.test(m.text())) && problems.console.push(m.text().slice(0, 140)));
    page.on('pageerror', (e) => problems.console.push('PAGEERR ' + e.message.slice(0, 140)));
    page.on('requestfailed', (r) => problems.failed.push(r.url().slice(0, 110)));
    await page.addInitScript(() => document.addEventListener('securitypolicyviolation', (e) => (window.__csp = (window.__csp || []).concat(e.blockedURI + ' ' + e.violatedDirective))));
    for (const t of TABS) {
      await page.goto(`${BASE}/#${t}`, { waitUntil: 'load' });
      await page.waitForTimeout(1500);
      const r = await page.evaluate(() => ({
        over: document.documentElement.scrollWidth - innerWidth,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
        raw: /\b(bus|train|launch|local)\b(?![a-z])/.test(document.querySelector('main')?.innerText || '') && /^(bus|car)[^\s]/m.test(document.querySelector('main')?.innerText || ''),
        csp: window.__csp || [],
      }));
      check('responsive', `${w}px #${t}: no horizontal overflow`, r.over <= 0, r.over > 0 ? `${r.over}px` : '');
      if (r.broken) check('images', `${w}px #${t}: broken <img>`, false, `${r.broken}`);
      if (r.csp.length) check('security', `${w}px #${t}: CSP violations`, false, r.csp.join('; '));
    }
    const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family); });
    check('fonts', `${w}px Anek Bangla loaded`, fonts.includes('Anek Bangla'));
    const weatherFail = problems.failed.filter((u) => !/open-meteo/.test(u) || !SKIP_EXTERNAL);
    check('console', `${w}px no console errors`, problems.console.length === 0, problems.console.slice(0, 3).join(' | '));
    check('network', `${w}px no failed requests`, weatherFail.length === 0 || SKIP_EXTERNAL, weatherFail.slice(0, 3).join(' | '));
    if (w === 390 || w === 1280) {
      for (const t of TABS) {
        await page.goto(`${BASE}/#${t}`);
        await page.waitForTimeout(1200);
        await page.evaluate(axeSource);
        const v = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] })).violations.map((x) => `${x.id}(${x.nodes.length})`));
        check('a11y', `${w}px axe #${t}`, v.length === 0, v.join(', '));
      }
    }
    await ctx.close();
  }

  // ---------- 4. Flows + storage on a mobile context ----------
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const go = async (t) => { await page.goto(`${BASE}/#${t}`); await page.waitForTimeout(900); };
  const ls = (k) => page.evaluate((key) => localStorage.getItem('deshbhromon_' + key), k);
  await go('home');
  check('home', 'creator name not in header', !(await page.locator('header').innerText()).includes('হাসিবুল') && !/Hasibul/.test(await page.locator('header').innerText()));
  check('home', 'footer credit present (English)', /Designed & developed by\s*Md\. Hasibul Hasan/.test(await page.locator('footer').innerText()));
  check('home', 'photo mosaic has 8 tiles', (await page.locator('section[aria-labelledby="photo-title"] li').count()) === 8);
  await page.locator('button:has-text("ভ্রমণ শুরু করুন")').click(); await page.waitForTimeout(500);
  check('nav', 'CTA opens guide', page.url().endsWith('#guide'));
  await go('map');
  await page.locator('label:has(input[type=checkbox])').first().click(); await page.waitForTimeout(300);
  check('map', 'toggle saves to storage', JSON.parse((await ls('visited')) || '[]').length === 1);
  await page.reload(); await page.waitForTimeout(900);
  check('map', 'visited survives reload', JSON.parse((await ls('visited')) || '[]').length === 1);
  await go('diary');
  await page.locator('button:has-text("নতুন স্মৃতি যোগ করুন")').click(); await page.locator('textarea').first().fill('QA entry'); await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(400);
  check('diary', 'entry saved + persists', JSON.parse((await ls('travel_logs')) || '[]').some((l) => l.notes === 'QA entry'));
  await go('food'); await page.locator('button:has-text("টেস্ট করুন")').first().click(); await page.waitForTimeout(300);
  check('food', 'tasted state saved', JSON.parse((await ls('tasted_foods')) || '[]').length === 1);
  await go('guide'); await page.waitForTimeout(800);
  await page.locator('h3, h2').filter({ hasText: 'বাগেরহাট' }).first().click(); await page.waitForTimeout(600);
  const dlg = await page.locator('[role=dialog]').innerText();
  check('guide', 'district dialog shows overview, no raw keys', /ঢাকা থেকে যাওয়ার উপায়/.test(dlg) && !/(^|\n)(bus|car|train|launch)(?=\S)/.test(dlg));
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  check('a11y', 'Escape closes dialog', (await page.locator('[role=dialog]').count()) === 0);
  await go('quiz'); await page.locator('button:has-text("৪.")').click(); await page.waitForTimeout(300);
  const solve = async (seq) => { for (const t of seq) await page.locator(`button[aria-label="বর্ণ ${t}"]:not([disabled])`).first().click(); };
  await solve(['বা', 'ন্দ', 'র', 'বা', 'ন']); await page.waitForTimeout(300);
  check('quiz', 'anagram (Bandarban) solvable', (await page.locator('text=সঠিক উত্তর! জেলা: বান্দরবান').count()) > 0);
  // storage scenarios
  const fresh = await browser.newContext({ viewport: { width: 390, height: 800 } });
  const p2 = await fresh.newPage(); const errs = [];
  p2.on('pageerror', (e) => errs.push(e.message));
  await p2.addInitScript(() => { localStorage.setItem('deshbhromon_visited', '{broken'); localStorage.setItem('deshbhromon_world', JSON.stringify(['BD', 'IN', 'TH'])); localStorage.setItem('deshbhromon_travel_logs', JSON.stringify([1, 'x'])); });
  await p2.goto(`${BASE}/#world`); await p2.waitForTimeout(1500);
  check('storage', 'corrupted data does not crash the app', errs.length === 0, errs[0] || '');
  check('storage', 'unreadable value backed up', (await p2.evaluate(() => localStorage.getItem('deshbhromon_visited_unreadable_backup'))) === '{broken');
  check('storage', 'legacy world codes migrate (3 selected)', (await p2.locator('ul button[aria-pressed="true"]').count()) === 3);
  await fresh.close();
  await ctx.close();
  await browser.close();
}

// ---------- 5. Performance ----------
async function perfChecks() {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 390, height: 800 } })).newPage();
  let bytes = 0, reqs = 0;
  page.on('response', async (r) => { reqs++; try { bytes += (await r.body()).length; } catch { /* ignore */ } });
  await page.goto(`${BASE}/#home`, { waitUntil: 'networkidle' });
  const m = await page.evaluate(() => new Promise((res) => {
    let lcp = 0; new PerformanceObserver((l) => { lcp = l.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    let cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (cls += e.value))).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => { const n = performance.getEntriesByType('navigation')[0]; res({ lcp: Math.round(lcp), cls: +cls.toFixed(3), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }); }, 800);
  }));
  console.log(`  perf (mobile, cold): LCP ${m.lcp} ms, CLS ${m.cls}, DCL ${m.dcl} ms, load ${m.load} ms, ${reqs} requests, ${(bytes / 1024).toFixed(0)} KB transferred (uncompressed bodies)`);
  check('perf', 'LCP < 2500 ms', m.lcp < 2500, `${m.lcp} ms`);
  check('perf', 'CLS < 0.1', m.cls < 0.1, `${m.cls}`);
  await browser.close();
}

await httpChecks();
await imageChecks();
await browserChecks();
await perfChecks();

const failed = results.filter((r) => !r.ok);
console.log(`\n==== ${results.length - failed.length}/${results.length} checks passed ====`);
failed.forEach((f) => console.log(`FAILED [${f.area}] ${f.name} ${f.detail}`));
fs.writeFileSync('live-qa-report.json', JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);

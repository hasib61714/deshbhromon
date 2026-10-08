// Regenerates one Facebook/Open Graph preview image per district: public/assets/og/<slug>.jpg (1200x630).
// Each shows the real district map with that district highlighted, its Bangla name, division and what it is known for.
// No photographs are used, so no photo credits are needed. Run: node scripts/make-district-og.mjs  (needs Playwright + Chromium)
import fs from 'fs';
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = await import('playwright-core')); }

const data = JSON.parse(fs.readFileSync('src/data/map-data.ts', 'utf8').slice(fs.readFileSync('src/data/map-data.ts', 'utf8').indexOf('= {') + 2).replace(/;\s*$/, ''));
const details = {};
for (const m of fs.readFileSync('src/data/bangladesh-data.ts', 'utf8').matchAll(/^\s+"([^"]+)": \{ bn: "([^"]+)", dv: "[^"]*", dvBn: "([^"]+)", fam: "([^"]+)" \}/gm)) {
  details[m[1]] = { bn: m[2], dvBn: m[3], fam: m[4] };
}
const slug = (id) => id.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const font = fs.readFileSync('public/assets/fonts/anek-bangla-bengali.woff2').toString('base64');
const latin = fs.readFileSync('public/assets/fonts/anek-bangla-latin.woff2').toString('base64');
const css = `@font-face{font-family:'Anek Bangla';font-weight:100 800;src:url(data:font/woff2;base64,${font}) format('woff2');unicode-range:U+0980-09FF,U+200C-200D,U+25CC}
@font-face{font-family:'Anek Bangla';font-weight:100 800;src:url(data:font/woff2;base64,${latin}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}`;

fs.mkdirSync('public/assets/og', { recursive: true });
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1200, height: 630 } });
let n = 0;
for (const f of data.f) {
  const d = details[f.n];
  if (!d) { console.log('skip (no details)', f.n); continue; }
  const paths = data.f
    .map((g) => `<path d="${g.d}" fill="${g.n === f.n ? '#fbbf24' : 'rgba(255,255,255,.2)'}" stroke="rgba(2,44,34,.9)" stroke-width="${g.n === f.n ? 1.4 : 0.8}"/>`)
    .join('');
  const html = `<html><head><style>${css}</style></head><body style="margin:0;width:1200px;height:630px;background:linear-gradient(135deg,#022c22,#064e3b 55%,#115e59);font-family:'Anek Bangla',sans-serif;color:#fff;position:relative;overflow:hidden">
<div style="position:absolute;right:70px;top:30px;height:570px;width:413px;filter:drop-shadow(0 12px 30px rgba(0,0,0,.35))"><svg viewBox="0 0 ${data.w} ${data.h}" xmlns="http://www.w3.org/2000/svg">${paths}</svg></div>
<div style="position:absolute;left:70px;top:90px;width:660px">
  <div style="display:inline-block;padding:8px 18px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);font-size:26px;font-weight:700;color:#a7f3d0">${esc(d.dvBn)} বিভাগ</div>
  <div style="font-size:132px;font-weight:800;line-height:1.2;margin-top:14px;color:#fde68a">${esc(d.bn)}</div>
  <div style="font-size:40px;font-weight:700;margin-top:4px">ভ্রমণ গাইড</div>
  <div style="font-size:34px;line-height:1.5;color:#d1fae5;margin-top:14px;font-weight:500">${esc(d.fam)}</div>
</div>
<div style="position:absolute;left:70px;bottom:40px;font-size:30px;font-weight:700;color:#a7f3d0">দেশভ্রমণ · DeshBhromon</div>
</body></html>`;
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `public/assets/og/${slug(f.n)}.jpg`, type: 'jpeg', quality: 82 });
  n++;
}
await b.close();
console.log(`wrote ${n} images to public/assets/og/`);

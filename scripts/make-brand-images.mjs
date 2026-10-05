// Regenerates public/assets/og-image.png and icon-512.png from the real district map.
// Run: node scripts/make-brand-images.mjs   (needs Playwright + a Chromium)
import fs from 'fs';
import { chromium } from 'playwright';

const src = fs.readFileSync('src/data/map-data.ts', 'utf8');
const data = JSON.parse(src.slice(src.indexOf('= {') + 2).replace(/;\s*$/, ''));
const paths = (fill, stroke, sw) =>
  data.f.map((f) => `<path d="${f.d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`).join('');
const svg = (fill, stroke, sw) => `<svg viewBox="0 0 ${data.w} ${data.h}" xmlns="http://www.w3.org/2000/svg">${paths(fill, stroke, sw)}</svg>`;

const og = `<html><body style="margin:0;width:1200px;height:630px;background:linear-gradient(135deg,#022c22,#064e3b 55%,#115e59);font-family:'Anek Bangla','Noto Sans Bengali',sans-serif;color:#fff;position:relative;overflow:hidden">
<div style="position:absolute;right:70px;top:30px;height:570px;width:413px;filter:drop-shadow(0 12px 30px rgba(0,0,0,.35))">${svg('rgba(255,255,255,.2)', 'rgba(2,44,34,.9)', 0.8)}</div>
<div style="position:absolute;left:80px;top:150px;width:640px">
  <div style="display:inline-block;padding:8px 18px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);font-size:24px;font-weight:700;color:#a7f3d0">🇧🇩 DeshBhromon</div>
  <div style="font-size:128px;font-weight:800;line-height:1.15;margin-top:18px">দেশভ্রমণ</div>
  <div style="font-size:36px;line-height:1.45;color:#d1fae5;margin-top:10px;font-weight:500">বাংলাদেশের প্রতিটি জেলা, প্রতিটি গল্প, প্রতিটি ভ্রমণ — এক জায়গায়।</div>
</div></body></html>`;

const icon = (size) => `<html><body style="margin:0;width:${size}px;height:${size}px;background:linear-gradient(135deg,#059669,#065f46);position:relative">
<div style="position:absolute;left:${size * 0.2}px;top:${size * 0.1}px;height:${size * 0.8}px;width:${size * 0.8 * (data.w / data.h)}px">${svg('#fff', '#d1fae5', 1)}</div>
<div style="position:absolute;left:${size * 0.36}px;top:${size * 0.34}px;width:${size * 0.2}px;height:${size * 0.2}px;border-radius:50%;background:#e11d48"></div></body></html>`;

const b = await chromium.launch();
const page = await b.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(og);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/assets/og-image.png' });
await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(icon(512));
await page.screenshot({ path: 'public/assets/icons/icon-512.png' });
await b.close();

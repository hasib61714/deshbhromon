#!/usr/bin/env node
// Finds CANDIDATE Wikimedia Commons photos for the foods in scripts/food-wishlist.json.
//
//   node scripts/find-food-photos.mjs                 # all foods
//   node scripts/find-food-photos.mjs --only w01,w02  # only some
//   node scripts/find-food-photos.mjs --per 8         # candidates per food (default 10)
//
// It needs internet access to commons.wikimedia.org (run it on your own PC). Nothing is added to the app
// automatically: it writes food-photo-candidates.html, where you look at the pictures yourself, tick the right
// one for each food and press "Copy selection". Author and licence come from the Commons API, never from guesses.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const PER = Number(arg('per', 10));
const ONLY = arg('only', '') ? new Set(arg('only', '').split(',')) : null;
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'DeshBhromon-photo-finder/1.0 (https://deshbhromon.vercel.app; personal travel app)';
const FOREIGN = /\b(india|indian|west[ _]bengal|kolkata|calcutta|pakistan|karachi|lahore|nepal|sri[ _]lanka|odisha|assam|tripura)\b/i;
const BD_HINT = /bangladesh|bangla|dhaka|chittagong|chattogram|sylhet|rajshahi|khulna|barisal|barishal|rangpur|mymensingh|comilla|cumilla|[ঀ-৿]/i;
// Everything on Commons is freely reusable, so any licence is accepted; the licence name is still shown and credited.
const LICENCE_OK = /\S/;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function api(params, tries = 4) {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
      if (r.status === 429 || r.status >= 500) { await wait(1500 * (i + 1)); continue; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i === tries - 1) throw e;
      await wait(1000 * (i + 1));
    }
  }
  throw new Error('no response');
}
const strip = (h = '') => h.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function candidatesFor(food) {
  const seen = new Map();
  for (const term of food.search) {
    const s = await api({ action: 'query', list: 'search', srnamespace: '6', srlimit: '12', srsearch: `${term} filetype:bitmap` });
    for (const hit of s.query?.search ?? []) if (!seen.has(hit.title)) seen.set(hit.title, hit.title);
    await wait(250);
  }
  const titles = [...seen.values()].slice(0, 30);
  const out = [];
  for (let i = 0; i < titles.length; i += 15) {
    const j = await api({ action: 'query', prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '420', titles: titles.slice(i, i + 15).join('|') });
    for (const p of Object.values(j.query?.pages ?? {})) {
      const ii = p.imageinfo?.[0];
      if (!ii || !/^image\/(jpeg|png)$/.test(ii.mime) || ii.width < 400) continue;
      const md = ii.extmetadata ?? {};
      const lic = strip(md.LicenseShortName?.value);
      if (!LICENCE_OK.test(lic)) continue;
      const hay = `${p.title} ${strip(md.Categories?.value)} ${strip(md.ImageDescription?.value)}`;
      if (FOREIGN.test(hay)) continue;
      out.push({
        file: p.title.replace(/^File:/, ''),
        src: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, '_')).replace(/%3A/g, ':').replace(/%2C/g, ',')}`,
        thumb: ii.thumburl,
        by: strip(md.Artist?.value) || 'Unknown',
        lic,
        w: ii.width,
        h: ii.height,
        bd: BD_HINT.test(hay),
        desc: strip(md.ImageDescription?.value).slice(0, 140),
      });
    }
    await wait(250);
  }
  return out.sort((a, b) => Number(b.bd) - Number(a.bd) || b.w * b.h - a.w * a.h).slice(0, PER);
}

const wishlist = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/food-wishlist.json'), 'utf8')).filter((f) => (!ONLY || ONLY.has(f.id)) && !(argv.includes('--skip-seasons') && f.id.startsWith('season-')));
console.log(`Looking for photos of ${wishlist.length} foods (${PER} candidates each)…`);
const results = [];
for (const [i, food] of wishlist.entries()) {
  process.stdout.write(`[${i + 1}/${wishlist.length}] ${food.nameBn} … `);
  try {
    const c = await candidatesFor(food);
    console.log(`${c.length} candidates`);
    results.push({ food, candidates: c });
  } catch (e) {
    console.log(`FAILED (${e.message})`);
    results.push({ food, candidates: [], error: e.message });
  }
}

const html = `<!doctype html><html lang="bn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>খাবারের ছবি বাছাই</title>
<style>
body{font-family:system-ui,"Noto Sans Bengali",sans-serif;margin:0;background:#faf9f6;color:#1c1917}
header{position:sticky;top:0;background:#064e3b;color:#fff;padding:10px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;z-index:5}
header button{background:#f5b83d;border:0;border-radius:8px;padding:8px 14px;font-weight:700;cursor:pointer}
main{padding:16px;max-width:1200px;margin:auto}
section{background:#fff;border:1px solid #e7e5e4;border-radius:14px;padding:14px;margin-bottom:18px}
h2{margin:0 0 4px;font-size:18px} .meta{color:#78716c;font-size:12px;margin-bottom:10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
label.card{display:block;border:2px solid #e7e5e4;border-radius:12px;overflow:hidden;cursor:pointer;background:#fafaf9}
label.card:has(input:checked){border-color:#059669;box-shadow:0 0 0 3px #a7f3d0}
label.card img{width:100%;height:150px;object-fit:cover;display:block;background:#e7e5e4}
.info{padding:8px;font-size:11px;line-height:1.35} .info b{display:block;word-break:break-word}
.tag{display:inline-block;background:#ecfdf5;color:#065f46;border-radius:6px;padding:1px 6px;margin-top:3px}
textarea{width:100%;height:120px;font-family:monospace;font-size:11px;margin-top:10px}
</style></head><body>
<header><strong>প্রতিটি খাবারের জন্য সঠিক ছবিটা টিক দিন (না মিললে কিছু বাছবেন না)</strong>
<span id="count">০ টি বাছাই</span><button id="copy">Copy selection</button><button id="dl">Download selection.json</button></header>
<main>
${results.map(({ food, candidates, error }) => `<section data-id="${esc(food.id)}">
<h2>${esc(food.nameBn)} <small style="color:#a8a29e">${esc(food.search[0])}</small></h2>
<div class="meta">${esc(food.id)} · ${esc(food.category)} · জেলা: ${food.districtId ? esc(food.districtId) : 'সারা বাংলাদেশ (নির্দিষ্ট জেলা নেই)'}${error ? ' · ত্রুটি: ' + esc(error) : ''}</div>
<div class="grid">${candidates.length ? candidates.map((c, k) => `<label class="card"><input type="radio" name="${esc(food.id)}" value="${k}" hidden>
<img loading="lazy" src="${esc(c.thumb)}" alt=""><div class="info"><b>${esc(c.file)}</b>${esc(c.by)} · ${esc(c.lic)}<br>${c.w}×${c.h}${c.bd ? ' <span class="tag">বাংলাদেশ-সম্পর্কিত</span>' : ''}<br><a href="${esc(c.src)}" target="_blank" rel="noopener">Commons পেজ</a></div></label>`).join('') : '<em>কোনো উপযুক্ত ছবি পাওয়া যায়নি</em>'}</div></section>`).join('\n')}
<textarea id="out" readonly placeholder="এখানে বাছাই করা তালিকা দেখাবে"></textarea>
</main>
<script>
const DATA=${JSON.stringify(results).replace(/</g, '\\u003c')};
const out=document.getElementById('out'),count=document.getElementById('count');
function sel(){const r=[];for(const s of DATA){const v=document.querySelector('input[name="'+s.food.id+'"]:checked');if(!v)continue;const c=s.candidates[+v.value];r.push({id:s.food.id,nameBn:s.food.nameBn,category:s.food.category,districtId:s.food.districtId,file:c.file,src:c.src,by:c.by,lic:c.lic});}return r;}
function upd(){const r=sel();count.textContent=r.length+' টি বাছাই';out.value=JSON.stringify(r,null,2);}
document.addEventListener('change',upd);
document.getElementById('copy').onclick=async()=>{upd();try{await navigator.clipboard.writeText(out.value);alert('কপি হয়েছে — চ্যাটে পেস্ট করুন');}catch{out.select();alert('নিচের লেখাটি সিলেক্ট করা হয়েছে, Ctrl+C চাপুন');}};
document.getElementById('dl').onclick=()=>{upd();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([out.value],{type:'application/json'}));a.download='selection.json';a.click();};
</script></body></html>`;
const file = path.join(ROOT, 'food-photo-candidates.html');
fs.writeFileSync(file, html);
console.log(`\nDone. Open this file in your browser:\n  ${file}`);

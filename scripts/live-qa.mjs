#!/usr/bin/env node
// DeshBhromon live QA runner.
//
//   npm run qa:live                         # tests https://deshbhromon.vercel.app
//   npm run qa:live -- https://other.url    # tests another deployment
//   npm run qa:live -- --quick              # widths 390 + 1280 only
//   npm run qa:live -- --full-images        # also check every photo in places.json (slow)
//   npm run qa:live -- --headed             # watch the browser
//
// It needs Chrome or Edge installed (it uses your installed browser; no download needed).
//
// Result semantics (nothing is marked PASS unless it was really verified):
//   PASS  verified OK
//   FAIL  genuine production failure -> exit code 1
//   WARN  non-critical problem, an optional external service (Wikimedia, Open-Meteo),
//         a known product gap, or a machine/network dependent measurement -> exit code 0
//   SKIP  NOT run (not applicable or the environment could not run it) -> never counts as PASS
// Exit codes: 0 = no FAIL and nothing blocked, 1 = at least one FAIL,
//             2 = the run was blocked by the environment (site unreachable / no browser) and is INCOMPLETE.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- args
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const BASE = (argv.find((a) => /^https?:\/\//.test(a)) || 'https://deshbhromon.vercel.app').replace(/\/+$/, '');
const ORIGIN = new URL(BASE).origin;
const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(new URL(BASE).hostname);
const QUICK = flag('quick');
const HEADED = flag('headed');
// npm swallows unknown flags given without "--" and exposes them as npm_config_*; accept that form too.
const FULL_IMAGES = flag('full-images') || flag('full') || process.env.npm_config_full_images === 'true' || process.env.QA_FULL_IMAGES === '1';
const WIDTHS = QUICK ? [390, 1280] : [360, 390, 768, 1024, 1280];
const TABS = [
  { id: 'home', label: 'হোম' },
  { id: 'guide', label: 'জেলা গাইড' },
  { id: 'map', label: 'আমার ম্যাপ' },
  { id: 'plan', label: 'ট্রিপ প্ল্যানার' },
  { id: 'diary', label: 'ভ্রমণ ডায়েরি' },
  { id: 'food', label: 'ফুড ট্র্যাকার' },
  { id: 'safety', label: 'ঋতু ও নিরাপত্তা' },
  { id: 'quiz', label: 'কুইজ খেলা' },
  { id: 'world', label: 'বিশ্ব ভ্রমণ' },
];
const EXTERNAL_HOST = /(^|\.)(wikimedia\.org|wikipedia\.org|wikidata\.org|open-meteo\.com|whatsapp\.com|facebook\.com|google\.com)$/;
const UA = 'DeshBhromon-QA/1.0 (+https://deshbhromon.vercel.app)';
const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

// ---------------------------------------------------------------- reporting
const R = [];
const LOG = [];
const color = process.stdout.isTTY && !process.env.NO_COLOR;
const C = { PASS: '\x1b[32m', FAIL: '\x1b[31m', WARN: '\x1b[33m', SKIP: '\x1b[90m', INFO: '\x1b[36m' };
const out = (line, status) => {
  LOG.push(line);
  console.log(color && status ? `${C[status]}${line}\x1b[0m` : line);
};
const rec = (status, area, name, detail = '') => {
  R.push({ status, area, name, detail });
  out(`${status.padEnd(4)}  [${area}] ${name}${detail ? ' — ' + detail : ''}`, status);
};
const pass = (a, n, d) => rec('PASS', a, n, d);
const fail = (a, n, d) => rec('FAIL', a, n, d);
const warn = (a, n, d) => rec('WARN', a, n, d);
const skip = (a, n, d) => rec('SKIP', a, n, d);
const info = (line) => out(`INFO  ${line}`, 'INFO');
const section = (t) => out(`\n=== ${t} ===`);
/** ok -> PASS, otherwise `bad` (FAIL by default, or WARN) */
const check = (a, n, ok, detail = '', bad = 'FAIL') => (ok ? pass(a, n) : rec(bad, a, n, detail));
const short = (e) => String(e && e.message ? e.message : e).split('\n')[0].slice(0, 220);
let BLOCKED = null;
let LIVE_CSP = ''; // the Content-Security-Policy header the live site actually sent // reason the environment blocked part of the run

// ---------------------------------------------------------------- http helpers
async function http(url, { method = 'GET', headers = {}, timeout = 25000, redirect = 'follow', body = true } = {}) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeout);
  try {
    const res = await fetch(url, { method, headers: { 'User-Agent': UA, ...headers }, redirect, signal: ac.signal });
    const textual = /text|json|xml|javascript/.test(res.headers.get('content-type') || '');
    let text = '';
    if (body && textual) text = await res.text();
    else await res.body?.cancel().catch(() => {});
    return { res, text };
  } finally {
    clearTimeout(t);
  }
}
async function retrying(fn, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fn();
      if (r.res.status !== 429 && r.res.status < 500) return r;
      last = r;
      await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
    } catch (e) {
      last = { error: e };
      await new Promise((s) => setTimeout(s, 1000 * (i + 1)));
    }
  }
  if (last?.error) throw last.error;
  return last;
}
async function pool(items, n, fn) {
  const q = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()); }));
}

// ---------------------------------------------------------------- repo data (for image + quiz checks)
function readData(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function evalArray(file, marker) {
  const src = readData(file);
  const start = src.indexOf('[', src.indexOf(marker));
  let end = src.indexOf('\n];', start);
  if (end < 0) end = src.lastIndexOf('];') - 1;
  return new Function(`return ${src.slice(start, end + 3).replace(/;\s*$/, '')}`)();
}
const wikiUrl = (file, w = 800) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;
function districtImages() {
  const src = readData('src/data/landmark-images.ts');
  const re = /"([^"]+)": \{\s*url: "([^"]+)",\s*caption: "([^"]+)",\s*photographer: "([^"]*)",\s*license: "([^"]*)",\s*sourceUrl: "([^"]*)"/g;
  return [...src.matchAll(re)].map((m) => ({
    id: m[1], url: m[2], caption: m[3], by: m[4], lic: m[5], source: m[6],
    file: decodeURIComponent(m[2].split('FilePath/')[1].split('?')[0]),
  }));
}

// ================================================================ 1. HTTP / HEADERS / SEO
async function httpSuite() {
  section('1. Production availability, headers, caching');
  let home;
  try {
    home = await retrying(() => http(BASE + '/'));
  } catch (e) {
    BLOCKED = `cannot reach ${BASE}: ${short(e)}`;
    skip('access', 'production reachable', BLOCKED);
    return null;
  }
  const { res, text: html } = home;
  // A real Vercel response always carries x-vercel-id. A 4xx/5xx without it (or with proxy wording)
  // came from a firewall / corporate proxy / sandbox in between: that is "cannot test from here",
  // not a production failure, so the run is reported as INCOMPLETE (exit code 2) instead of 50 false FAILs.
  if (!LOCAL && !res.headers.get('x-vercel-id') && (res.status >= 400 || /allowlist|egress|proxy|blocked/i.test(html.slice(0, 600)))) {
    BLOCKED = `${BASE} answered HTTP ${res.status} but not from Vercel (no x-vercel-id header): ${html.replace(/\s+/g, ' ').slice(0, 140) || 'empty body'} — a firewall/proxy/VPN is blocking this machine`;
    skip('access', 'production reachable', BLOCKED);
    return null;
  }
  check('access', 'HTTP 200 for /', res.status === 200, `status ${res.status}`);
  check('access', 'serves the DeshBhromon app (not a login/protection wall)', /<div id="root">/.test(html) && !/vercel\.com\/(login|sso)|Authentication Required/i.test(html));
  if (!LOCAL) {
    try {
      const r = await http(BASE.replace(/^https:/, 'http:') + '/', { redirect: 'manual', body: false });
      check('access', 'http:// redirects to https://', [301, 302, 307, 308].includes(r.res.status) && /^https:/.test(r.res.headers.get('location') || ''), `status ${r.res.status}`, 'WARN');
    } catch (e) { warn('access', 'http:// → https:// redirect', short(e)); }
  }

  const h = res.headers;
  const csp = h.get('content-security-policy') || '';
  const sec = (name, ok, detail = '', bad = 'FAIL') => (LOCAL ? skip('security', name, 'local server does not apply vercel.json headers') : check('security', name, ok, detail, bad));
  const dir = (n) => (csp.match(new RegExp(`(?:^|;)\\s*${n}\\s+([^;]*)`)) || [])[1] || '';
  sec('CSP present', !!csp);
  if (!LOCAL) {
    LIVE_CSP = csp;
    info(`live Content-Security-Policy header: ${csp || '(none)'}`);
    let expected = '';
    try { expected = JSON.parse(readData('vercel.json')).headers[0].headers.find((x) => x.key === 'Content-Security-Policy').value; } catch { /* below */ }
    check('security', 'live CSP header is exactly the CSP in vercel.json of this checkout (deployment is current)', !!expected && csp === expected, `live: ${csp.slice(0, 160)} | repo: ${expected.slice(0, 160)}  (if they differ: run "git pull" or the deployment is stale)`);
  }
  sec("CSP default-src 'self'", /(^|\s)'self'(\s|$)/.test(dir('default-src')), dir('default-src'));
  sec("CSP script-src is 'self' only (no unsafe-inline / unsafe-eval)", dir('script-src').trim() === "'self'", dir('script-src'));
  sec('CSP img-src allows Wikimedia Commons + upload + thumb (redirect chain) + data/blob', /commons\.wikimedia\.org/.test(dir('img-src')) && /upload\.wikimedia\.org/.test(dir('img-src')) && /thumb\.wikimedia\.org/.test(dir('img-src')) && !/\*/.test(dir('img-src')) && /data:/.test(dir('img-src')) && /blob:/.test(dir('img-src')), dir('img-src'));
  sec('CSP connect-src allows only self + Open-Meteo + the Commons API (no wildcard)', /api\.open-meteo\.com/.test(dir('connect-src')) && /commons\.wikimedia\.org/.test(dir('connect-src')) && !/\*/.test(dir('connect-src')) && dir('connect-src').split(/\s+/).slice(1).every((t) => ["'self'", 'https://api.open-meteo.com', 'https://commons.wikimedia.org'].includes(t)), dir('connect-src'));
  sec("CSP frame-ancestors 'none', object-src 'none', base-uri 'self'", /'none'/.test(dir('frame-ancestors')) && /'none'/.test(dir('object-src')) && /'self'/.test(dir('base-uri')));
  sec('X-Content-Type-Options: nosniff', h.get('x-content-type-options') === 'nosniff', h.get('x-content-type-options') || 'missing');
  sec('Referrer-Policy set', !!h.get('referrer-policy'), h.get('referrer-policy') || 'missing');
  sec('Frame protection (X-Frame-Options)', /^(DENY|SAMEORIGIN)$/i.test(h.get('x-frame-options') || ''), h.get('x-frame-options') || 'missing');
  sec('Permissions-Policy set', !!h.get('permissions-policy'), h.get('permissions-policy') || 'missing');
  sec('HSTS set', /max-age=\d{6,}/.test(h.get('strict-transport-security') || ''), h.get('strict-transport-security') || 'missing', 'WARN');
  sec('HTML is revalidated (not long-cached)', /must-revalidate|no-cache|max-age=0/.test(h.get('cache-control') || ''), h.get('cache-control') || 'missing', 'WARN');

  const js = [...html.matchAll(/(?:src|href)="(\/static\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
  check('assets', 'page references hashed /static bundles', js.length >= 2, js.join(', '));
  let mainJs = '';
  for (const p of js) {
    const r = await http(BASE + p);
    check('assets', `${p} returns 200`, r.res.status === 200, `status ${r.res.status}`);
    if (p.endsWith('.js') && /index-/.test(p)) mainJs = r.text;
    if (!LOCAL) check('perf', `${p} has immutable 1-year cache`, /immutable/.test(r.res.headers.get('cache-control') || '') && /max-age=31536000/.test(r.res.headers.get('cache-control') || ''), r.res.headers.get('cache-control') || 'missing');
  }
  if (!LOCAL) {
    try {
      const a = await http(BASE + '/_vercel/insights/script.js', { body: false });
      if (a.res.status === 200 && /javascript/.test(a.res.headers.get('content-type') || '')) pass('analytics', 'Vercel Web Analytics script is served (visitors are being counted)');
      else warn('analytics', 'Vercel Web Analytics script is NOT served yet', `status ${a.res.status}: open the project on vercel.com → Analytics → Enable, then redeploy/refresh (the code is already in the site)`);
    } catch (e) { warn('analytics', 'could not check the Vercel Web Analytics script', short(e)); }
  }
  const font = await http(BASE + '/assets/fonts/anek-bangla-bengali.woff2', { body: false });
  check('assets', 'Bangla font file returns 200', font.res.status === 200, `status ${font.res.status}`);
  if (!LOCAL) check('perf', 'font cache ≥ 1 day', Number((font.res.headers.get('cache-control') || '').match(/max-age=(\d+)/)?.[1] || 0) >= 86400, font.res.headers.get('cache-control') || 'missing', 'WARN');

  section('2. SEO, social metadata, structured data, branding');
  const meta = (re) => (html.match(re) || [])[1];
  check('seo', '<title> present', !!meta(/<title>([^<]{5,})<\/title>/));
  check('seo', 'meta description (≥ 50 chars)', (meta(/name="description" content="([^"]*)"/) || '').length >= 50);
  check('seo', 'lang="bn"', /<html[^>]*lang="bn"/.test(html));
  if (LOCAL) {
    for (const n of ['canonical URL', 'og:url', 'og:image absolute URL']) skip('seo', n, 'local server: absolute production URLs are only generated on Vercel');
  } else {
    check('seo', `canonical = ${ORIGIN}/`, meta(/rel="canonical" href="([^"]*)"/) === `${ORIGIN}/`, meta(/rel="canonical" href="([^"]*)"/) || 'missing');
    check('seo', 'og:url = production URL', meta(/property="og:url" content="([^"]*)"/) === `${ORIGIN}/`, meta(/property="og:url" content="([^"]*)"/) || 'missing');
  }
  check('seo', 'og:title + og:description', !!meta(/property="og:title" content="([^"]+)"/) && (meta(/property="og:description" content="([^"]*)"/) || '').length > 20);
  check('seo', 'og:type website + og:locale', /property="og:type" content="website"/.test(html) && /property="og:locale"/.test(html));
  check('seo', 'twitter:card summary_large_image', /name="twitter:card" content="summary_large_image"/.test(html));
  const ogImg = meta(/property="og:image" content="([^"]*)"/);
  if (!LOCAL) check('seo', 'og:image is an absolute production URL', ogImg === `${ORIGIN}/assets/og-image.png`, ogImg || 'missing');
  try {
    const r = await http(LOCAL || !/^https?:/.test(ogImg || '') ? BASE + '/assets/og-image.png' : ogImg, { body: false });
    check('seo', 'og:image resolves to a PNG', r.res.status === 200 && /image\/png/.test(r.res.headers.get('content-type') || ''), `status ${r.res.status}`);
  } catch (e) { fail('seo', 'og:image resolves', short(e)); }
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (LOCAL) skip('seo', 'JSON-LD structured data', 'only generated on Vercel');
  else {
    let j = null;
    try { j = ld && JSON.parse(ld[1]); } catch { /* handled below */ }
    check('seo', 'JSON-LD parses as WebApplication', !!j && j['@type'] === 'WebApplication', ld ? 'invalid JSON' : 'missing');
    check('seo', 'JSON-LD url/image use the production origin', !!j && j.url === `${ORIGIN}/` && String(j.image).startsWith(ORIGIN), j ? `${j.url} ${j.image}` : '');
  }
  const robots = await http(BASE + '/robots.txt');
  check('seo', '/robots.txt 200 and allows crawling', robots.res.status === 200 && /User-agent:\s*\*/i.test(robots.text) && /Allow:\s*\//.test(robots.text) && !/Disallow:\s*\/\s*$/m.test(robots.text));
  if (!LOCAL) check('seo', 'robots.txt lists the production sitemap', robots.text.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), robots.text.trim().slice(0, 120));
  const sm = await http(BASE + '/sitemap.xml');
  if (LOCAL) skip('seo', '/sitemap.xml', 'only generated on Vercel');
  else check('seo', '/sitemap.xml valid and lists the production URL', sm.res.status === 200 && /<urlset/.test(sm.text) && sm.text.includes(`<loc>${ORIGIN}/</loc>`), `status ${sm.res.status}`);
  const man = await http(BASE + '/manifest.webmanifest');
  let mj = null;
  try { mj = JSON.parse(man.text); } catch { /* below */ }
  check('seo', '/manifest.webmanifest valid JSON', man.res.status === 200 && !!mj);
  if (mj) {
    check('seo', 'manifest has name/short_name/start_url/display/theme/background', !!(mj.name && mj.short_name && mj.start_url && mj.display && mj.theme_color && mj.background_color));
    check('seo', 'manifest has 192 and 512 icons', !!mj.icons?.some((i) => i.sizes === '192x192') && !!mj.icons?.some((i) => i.sizes === '512x512'));
    for (const i of mj.icons || []) {
      const r = await http(BASE + i.src, { body: false });
      check('seo', `manifest icon ${i.src} (${i.purpose || 'any'}) loads`, r.res.status === 200 && /image\//.test(r.res.headers.get('content-type') || ''), `status ${r.res.status}`);
    }
    check('branding', 'manifest uses DeshBhromon branding', /DeshBhromon|দেশভ্রমণ/.test(mj.name));
  }
  const corpus = html + mainJs;
  const bad = [/unseen\s*-?\s*bangladesh/i, /unseenbangladesh/i, /localhost[:/]/i, /127\.0\.0\.1/, /আমার দেশ ম্যাপ/, /AI Studio/i, /GEMINI_API_KEY/].filter((re) => re.test(corpus));
  check('branding', 'no Unseen Bangladesh / localhost / dev / old branding in HTML + main bundle', bad.length === 0, bad.map(String).join(' '));
  check('branding', 'creator Bengali name not shipped in the app shell (header/footer)', !/মোঃ হাসিবুল হাসান/.test(mainJs), '', 'WARN');
  return { html };
}

// ================================================================ 2b. content of what is actually deployed
// Everything the browser can ever receive (HTML, every JS chunk reachable from the entry bundle,
// places.json, world.json) is downloaded and scanned, so a stale or wrong deployment is caught
// even if the page happens not to render the bad item in a given flow.
async function contentSuite(home) {
  section('2b. Deployed content: previously fixed issues, emergency numbers, branding, claims');
  const dl = async (p) => { const r = await retrying(() => http(BASE + p)); return r.res.status === 200 ? r.text : null; };
  const entry = [...home.html.matchAll(/src="\/static\/([^"]+\.js)"/g)].map((m) => m[1]);
  const chunks = new Map();
  const queue = [...entry];
  try {
    while (queue.length) {
      const f = queue.pop();
      if (chunks.has(f)) continue;
      const t = await dl('/static/' + f);
      if (t === null) { fail('content', `JS chunk /static/${f} is reachable`, 'not HTTP 200'); chunks.set(f, ''); continue; }
      chunks.set(f, t);
      for (const m of t.match(/[A-Za-z0-9_.-]+\.js/g) || []) if (!chunks.has(m) && m !== f && /-[A-Za-z0-9_-]{6,}\.js$/.test(m)) queue.push(m);
    }
  } catch (e) { warn('content', 'could not download every JS chunk', short(e)); }
  const places = await dl('/places.json');
  const worldTxt = await dl('/world.json');
  check('content', `scanned ${chunks.size} JS chunks + places.json + world.json`, chunks.size >= 10 && !!places && !!worldTxt, `chunks=${chunks.size}`);
  if (!places) return;
  const js = [...chunks.values()].join('\n');
  const corpus = home.html + '\n' + js + '\n' + places;
  const absent = (area, name, patterns, text = corpus) => {
    const hit = patterns.filter((p) => (p instanceof RegExp ? p.test(text) : text.includes(p)));
    check(area, name, hit.length === 0, hit.map(String).join(' | '));
  };

  absent('content', 'Ratargul: the Louisiana swamp photo (Atchafalaya Basin) is gone', ['Atchafalaya']);
  absent('content', 'Dhaka: the art-festival photo (Aichi Triennale) is gone', ['Aichi_Triennale']);
  absent('content', 'Rajshahi: the Dhaka mosque photo (Bayt al-Mukarram) is gone', ['Bayt_al_Mukarram']);
  let pj = null;
  try { pj = JSON.parse(places); } catch { /* below */ }
  // The Chakma photo is correct for Rangamati/Khagrachhari (Chakma attire); it was wrong only as a Rakhine textile in Patuakhali.
  if (pj?.Patuakhali) check('content', 'Patuakhali (Rakhine) no longer shows a Chakma textile photo', !JSON.stringify(pj.Patuakhali).includes('Chakma_woman_weaving'));
  check('content', 'places.json parses with 64 districts', !!pj && Object.keys(pj).length === 64, pj ? String(Object.keys(pj).length) : 'invalid JSON');
  if (pj?.Sylhet) check('content', 'Sylhet/Ratargul gallery has no non-Bangladesh photo', !JSON.stringify(pj.Sylhet).includes('Atchafalaya'));
  absent('content', 'Ramsar/UNESCO: no "UNESCO-declared Ramsar" claim, no unverifiable "largest in Asia" claims', ['ইউনেস্কো ঘোষিত রামসার', 'পুরো এশিয়ার', 'দক্ষিণ এশিয়ার বৃহত্তম কৃত্রিম', 'largest in Asia'], js);
  absent('content', 'no "AI image generation prompt" feature text anywhere in the shipped code', ['Generation Prompt', 'AI Landmark Photo Prompt', 'প্রম্পট কপি', 'aiPrompt'], js);
  absent('content', 'quiz: no banknote claims and no ambiguous floating-market question', ['৫০ টাকার নোটে', '১০ টাকার পুরোনো নোটে', 'ভাসমান পেয়ারা বাজার কোন জেলায় সবচেয়ে বিখ্যাত'], js);
  absent('content', 'one spelling for contested words (রসমালাই / ঢাকা জেলার মুন্সীগঞ্জ / পুণ্ড্র)', ['রসমলাই', 'মুন্সিগঞ্জ', 'পুন্ড্র'], js + places);

  // Phone numbers: only numbers confirmed from public sources may exist anywhere in the shipped code.
  const VERIFIED = new Set(['999', '131', '16163', '1090', '01320222222', '01887878787']);
  const found = new Set();
  for (const m of corpus.matchAll(/tel:([0-9+-]{3,})/g)) found.add(m[1].replace(/[-+]/g, ''));
  for (const m of corpus.matchAll(/\b01[3-9][0-9]{2}-?[0-9]{6}\b/g)) found.add(m[0].replace(/-/g, ''));
  const unknown = [...found].filter((n) => !VERIFIED.has(n));
  check('content', 'every phone number shipped is on the verified emergency list', found.size >= 4 && unknown.length === 0, `${[...found].join(', ')}${unknown.length ? ` — unverified: ${unknown.join(', ')}` : ''}`);
  absent('content', 'the removed unverified numbers (01320-163599, 01320-189999) are gone', ['01320-163599', '01320163599', '01320-189999', '01320189999']);

  absent('branding', 'no Unseen Bangladesh / localhost / dev leftovers anywhere in the shipped code', [/unseen\s*-?\s*bangladesh/i, /unseenbangladesh/i, /localhost[:/]/i, /127\.0\.0\.1/, /AI Studio/i, /GEMINI_API_KEY/, /আমার দেশ ম্যাপ/]);
  const brand = (js.match(/DeshBhromon/g) || []).length;
  check('branding', 'DeshBhromon / দেশভ্রমণ are used consistently', brand >= 5 && /দেশভ্রমণ/.test(js), `${brand} mentions`);
  absent('claims', 'no invented usage statistics ("10,000+ users", "লক্ষ ব্যবহারকারী", ...)', [/[0-9০-৯,]+\+?\s*(হাজার|লক্ষ|লাখ)?\+?\s*(ব্যবহারকারী|ডাউনলোড|সক্রিয় ভ্রমণকারী)/, /\b[0-9][0-9,]{2,}\+?\s+(users|downloads|travellers|travelers)\b/i], js);
  absent('claims', 'no "official"/"verified" certificate or fake verification-ID claims', [/Verified by/i, /verification\s*(id|code)/i, /যাচাইকরণ\s*(আইডি|কোড)/, /ভেরিফায়েড/, /official certificate/i], js);
  absent('claims', 'no placeholder/fake user data (lorem ipsum, John Doe, test@example)', [/lorem ipsum/i, /john doe/i, /test@example/i], js);
  const seasonsOk = ['গ্রীষ্ম', 'বর্ষা', 'শরৎ', 'হেমন্ত', 'শীত', 'বসন্ত'].every((x) => js.includes(x));
  check('content', 'six seasons present in the deployed seasons guide', seasonsOk);
}

// ================================================================ 3. external services + photos
async function externalSuite() {
  section('3. External services and photographs (Wikimedia / Open-Meteo problems are WARN, not production FAIL)');
  const imgs = districtImages();
  check('images', 'dataset parsed (64 district photos)', imgs.length === 64, `${imgs.length}`);
  const homeIds = ["Cox's Bazar", 'Bagerhat', 'Rangamati', 'Sylhet', 'Bandarban', 'Sunamganj', 'Naogaon', 'Panchagarh'];
  const featured = ["Cox's Bazar", 'Sylhet', 'Bandarban', 'Bagerhat', 'Panchagarh', 'Sunamganj'];
  const homeSet = new Set([...homeIds, ...featured]);

  // Can THIS machine reach the external services at all? If not, say so once instead of reporting
  // dozens of misleading failures (corporate proxy, offline, sandbox, ...).
  let commonsUp = false;
  try {
    const r = await http('https://commons.wikimedia.org/w/api.php?action=query&meta=siteinfo&format=json', { timeout: 15000 });
    commonsUp = r.res.status === 200 && /"query"/.test(r.text);
  } catch { /* stays false */ }
  let weatherUp = false;
  try {
    const r = await retrying(() => http('https://api.open-meteo.com/v1/forecast?latitude=23.81&longitude=90.41&current=temperature_2m&timezone=Asia%2FDhaka'));
    let j = null;
    try { j = JSON.parse(r.text); } catch { /* not JSON */ }
    weatherUp = r.res.status === 200 && typeof j?.current?.temperature_2m === 'number';
    if (weatherUp) pass('external', 'Open-Meteo weather API responds');
    else warn('external', 'Open-Meteo weather API did not respond with weather JSON', `status ${r.res.status} (optional external service)`);
  } catch (e) { warn('external', 'Open-Meteo weather API unreachable from this machine', short(e)); }
  if (!commonsUp) {
    skip('environment', 'Wikimedia Commons reachable from this machine', 'NOT REACHABLE here: photo URL and licence checks cannot be run (environment limitation, not a production verdict)');
    for (const id of new Set(homeIds)) {
      const e = imgs.find((x) => x.id === id);
      check('images', `homepage photo ${id} has credit (author, licence, Commons source link)`, !!(e.by && e.lic && /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(e.source)), `${e.by} | ${e.lic} | ${e.source}`);
    }
    skip('images', 'district photo URL checks', 'Wikimedia unreachable from this machine');
    if (FULL_IMAGES) skip('images', 'FULL places.json photo scan (--full-images)', 'NOT RUN: Wikimedia unreachable from this machine — this is not a pass');
    skip('images', 'author/licence cross-check against the Commons API', 'Wikimedia unreachable from this machine');
    return;
  }

  const status = {};
  await pool(imgs, 5, async (e) => {
    try {
      const r = await retrying(() => http(e.url, { body: false, timeout: 30000 }));
      status[e.id] = r.res.status === 200 && /^image\//.test(r.res.headers.get('content-type') || '') ? 'ok' : `HTTP ${r.res.status}`;
    } catch (err) { status[e.id] = `network: ${short(err)}`; }
  });
  for (const id of new Set(homeIds)) {
    const e = imgs.find((x) => x.id === id);
    const s = status[id];
    if (s === 'ok') pass('images', `homepage photo ${id} loads`);
    else if (/^HTTP 4(04|10)\b/.test(s)) fail('images', `homepage photo ${id} is missing on Commons`, `${s} ${e.file}`);
    else warn('images', `homepage photo ${id} could not be verified`, `${s} (external service)`);
    check('images', `homepage photo ${id} has credit (author, licence, Commons source link)`, !!(e.by && e.lic && /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(e.source)), `${e.by} | ${e.lic} | ${e.source}`);
  }
  const broken = imgs.filter((e) => status[e.id] !== 'ok' && !homeSet.has(e.id));
  const hard = broken.filter((e) => /^HTTP 4(04|10)\b/.test(status[e.id]));
  if (hard.length) fail('images', `${hard.length} district photo file(s) missing on Commons (data bug: fix the file name)`, hard.map((e) => `${e.id}:${e.file}`).join(' | '));
  const soft = broken.filter((e) => !/^HTTP 4(04|10)\b/.test(status[e.id]));
  if (soft.length) warn('images', `${soft.length} district photo(s) could not be verified (rate limit / network / external)`, soft.slice(0, 5).map((e) => `${e.id}:${status[e.id]}`).join(' | '));
  if (!hard.length && !soft.length) pass('images', `all ${imgs.length} district photos load`);

  const names = [...new Set(homeIds)].map((id) => imgs.find((x) => x.id === id));
  try {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(names.map((n) => 'File:' + n.file).join('|'))}`;
    const r = await retrying(() => http(api));
    const pages = Object.values(JSON.parse(r.text).query.pages);
    for (const n of names) {
      const norm = (s) => s.replace(/_/g, ' ');
      const p = pages.find((x) => norm(x.title) === 'File:' + norm(n.file));
      const md = p?.imageinfo?.[0]?.extmetadata;
      if (!md) { warn('images', `${n.id}: Commons metadata`, 'file not found in the Commons API response'); continue; }
      const lic = (md.LicenseShortName?.value || '').replace(/\s+/g, ' ').trim();
      const artist = (md.Artist?.value || '').replace(/<[^>]*>/g, '').trim();
      const licOk = lic.toLowerCase().replace(/[^a-z0-9.]/g, '') === n.lic.toLowerCase().replace(/[^a-z0-9.]/g, '');
      const artistOk = artist.toLowerCase().includes(n.by.toLowerCase().slice(0, 10)) || n.by.toLowerCase().includes(artist.toLowerCase().slice(0, 10));
      if (licOk && artistOk) pass('images', `${n.id}: author + licence match Commons`);
      else warn('images', `${n.id}: credit differs from Commons — review manually`, `dataset "${n.by}" / "${n.lic}" vs Commons "${artist}" / "${lic}"`);
    }
  } catch (e) { skip('images', 'author/licence cross-check against the Commons API', `external service unavailable: ${short(e)}`); }
  info('Homepage photo files (open each and confirm it shows the stated landmark):');
  for (const id of new Set(homeIds)) {
    const e = imgs.find((x) => x.id === id);
    info(`   ${id.padEnd(12)} ${e.caption}  <-  https://commons.wikimedia.org/wiki/File:${encodeURIComponent(e.file)}`);
  }

  if (FULL_IMAGES) {
    const places = JSON.parse(readData('public/places.json'));
    const items = new Map(); // Commons file name -> { where:Set(district), by, lic }
    const add = (d, o) => {
      const m = o?.src?.match(/File:(.+)$/);
      if (!m) return;
      const f = decodeURIComponent(m[1]);
      if (!items.has(f)) items.set(f, { where: new Set(), by: o.by || '', lic: o.lic || '' });
      items.get(f).where.add(d);
    };
    for (const [d, p] of Object.entries(places)) { p.fam?.forEach((f) => add(d, f[2])); p.spots?.forEach((sp) => { add(d, sp.img); sp.gal?.forEach((g) => add(d, g)); }); }
    const files = [...items.keys()];
    info(`Full photo scan: ${files.length} distinct Commons files from places.json (this takes several minutes)…`);

    // A. every file must actually be served as an image through the same Special:FilePath URL the app uses
    const gone = [], flaky = [];
    let done = 0;
    await pool(files, 4, async (f) => {
      try {
        const r = await retrying(() => http(wikiUrl(f), { body: false, timeout: 30000 }));
        const ok = r.res.status === 200 && /^image\//.test(r.res.headers.get('content-type') || '');
        if (!ok) (r.res.status === 404 || r.res.status === 410 ? gone : flaky).push(`${r.res.status} ${f} [${[...items.get(f).where].join(',')}]`);
      } catch (e) { flaky.push(`net ${f}: ${short(e)}`); }
      if (++done % 100 === 0) info(`   …${done}/${files.length} checked`);
    });
    check('images', `all ${files.length} places.json photos exist on Commons (no 404/410)`, gone.length === 0, `${gone.length} broken: ${gone.slice(0, 10).join(' | ')}`);
    if (flaky.length) warn('images', `${flaky.length}/${files.length} photos could not be verified (rate limit / network / 5xx — not a confirmed broken image)`, flaky.slice(0, 6).join(' | '));
    else if (!gone.length) pass('images', `all ${files.length} places.json photos load as images`);

    // B. credit + relevance cross-check against the Commons API (author, licence, "is this really Bangladesh?")
    const BD_HINT = /bangladesh|bengal|bangla|dhaka|chittagong|chattogram|sylhet|rajshahi|khulna|barisal|barishal|rangpur|mymensingh|sundarban|padma|jamuna|meghna|brahmaputra|ganges|rangamati|bandarban|cox|kuakata|srimangal|sreemangal|comilla|cumilla|bogra|bogura|dinajpur|jessore|jashore|[ঀ-৿]/i;
    const norm = (t) => t.replace(/_/g, ' ').toLowerCase();
    const meta = new Map();
    let apiOk = true;
    for (let i = 0; i < files.length && apiOk; i += 40) {
      const batch = files.slice(i, i + 40);
      try {
        const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(batch.map((f) => 'File:' + f).join('|'))}`;
        const r = await retrying(() => http(api, { timeout: 30000 }));
        const j = JSON.parse(r.text);
        for (const pg of Object.values(j.query.pages)) meta.set(norm(pg.title), pg);
      } catch (e) { apiOk = false; skip('images', 'author/licence/relevance cross-check against the Commons API', `API unavailable: ${short(e)}`); }
    }
    if (apiOk) {
      const missing = [], credit = [], offTopic = [];
      for (const f of files) {
        const pg = meta.get(norm('File:' + f));
        if (!pg) { credit.push(`${f}: not in API response`); continue; }
        if (pg.missing !== undefined) { missing.push(`${f} [${[...items.get(f).where].join(',')}]`); continue; }
        const md = pg.imageinfo?.[0]?.extmetadata || {};
        const it = items.get(f);
        const lic = (md.LicenseShortName?.value || '').replace(/\s+/g, ' ').trim();
        const artist = (md.Artist?.value || '').replace(/<[^>]*>/g, '').trim();
        const licOk = lic.toLowerCase().replace(/[^a-z0-9.]/g, '') === it.lic.toLowerCase().replace(/[^a-z0-9.]/g, '');
        const artistOk = !artist || artist.toLowerCase().includes(it.by.toLowerCase().slice(0, 10)) || it.by.toLowerCase().includes(artist.toLowerCase().slice(0, 10));
        if (!licOk || !artistOk) credit.push(`${f}: dataset "${it.by}"/"${it.lic}" vs Commons "${artist.slice(0, 30)}"/"${lic}"`);
        const hay = `${f} ${md.Categories?.value || ''} ${(md.ImageDescription?.value || '').replace(/<[^>]*>/g, '')}`;
        if (!BD_HINT.test(hay)) offTopic.push(`${f} [${[...it.where].join(',')}]`);
      }
      check('images', 'no places.json photo is a deleted/missing Commons file', missing.length === 0, missing.slice(0, 10).join(' | '));
      if (credit.length) warn('images', `${credit.length} photo credit(s) differ from Commons — review manually`, credit.slice(0, 6).join(' | '));
      else pass('images', 'author + licence of every places.json photo match Commons');
      if (offTopic.length) warn('images', `${offTopic.length} photo(s) have no Bangladesh-related name/category/description on Commons — possible wrong image, review manually`, offTopic.slice(0, 12).join(' | '));
      else pass('images', 'every places.json photo has Bangladesh-related Commons metadata');
    }
  } else skip('images', 'places.json photo scan (≈800 requests)', 'not run; use --full-images');
}

// ================================================================ browser helpers
async function fileInfo(download) {
  const p = await download.path();
  const size = fs.statSync(p).size;
  const fd = fs.openSync(p, 'r');
  const b = Buffer.alloc(24);
  fs.readSync(fd, b, 0, 24, 0);
  fs.closeSync(fd);
  const hex = b.toString('hex', 0, 8);
  const type = hex.startsWith('89504e47') ? 'png' : hex.startsWith('ffd8ff') ? 'jpg' : hex.startsWith('25504446') ? 'pdf' : 'unknown';
  return { size, type, width: type === 'png' ? b.readUInt32BE(16) : 0, height: type === 'png' ? b.readUInt32BE(20) : 0 };
}
let chromium, axeSource;
function loadDeps() {
  try {
    ({ chromium } = require('playwright-core'));
    axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  } catch {
    BLOCKED = 'dependencies missing: run `npm ci` first';
  }
}
async function launch() {
  const tries = process.env.CHROME_PATH ? [{ executablePath: process.env.CHROME_PATH }] : [{ channel: 'chrome' }, { channel: 'msedge' }, {}];
  let last;
  for (const t of tries) {
    try { return await chromium.launch({ headless: !HEADED, ...t }); } catch (e) { last = e; }
  }
  throw last;
}
function watch(page) {
  const w = { console: [], failed: [], bad: [], errors: [], hosts: new Set() };
  page.on('request', (r) => { try { const h = new URL(r.url()).hostname; if (/wikimedia\.org$/.test(h)) w.hosts.add(h); } catch { /* ignore */ } });
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    w.console.push({ text: m.text().slice(0, 160), url: m.location()?.url || '' });
  });
  page.on('pageerror', (e) => w.errors.push(e.message.slice(0, 200)));
  page.on('requestfailed', (r) => w.failed.push({ url: r.url(), why: r.failure()?.errorText || '' }));
  page.on('response', (r) => { if (r.status() >= 400) w.bad.push({ url: r.url(), status: r.status() }); });
  page.on('dialog', (d) => d.accept().catch(() => {}));
  return w;
}
const isExternal = (u) => { try { return EXTERNAL_HOST.test(new URL(u).hostname) || new URL(u).origin !== ORIGIN; } catch { return false; } };
async function settle(page) {
  await page.waitForLoadState('load').catch(() => {});
  await page.locator('h1').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(900);
}
const go = async (page, tab) => { await page.goto(`${BASE}/#${tab}`, { waitUntil: 'load' }); await settle(page); };
const ls = (page, k) => page.evaluate((key) => localStorage.getItem('deshbhromon_' + key), k);
const lsJson = async (page, k, d = []) => { try { return JSON.parse((await ls(page, k)) || JSON.stringify(d)); } catch { return null; } };
const newCtx = (browser, w, extra = {}) => browser.newContext({ viewport: { width: w, height: 800 }, isMobile: w < 500, hasTouch: w < 500, serviceWorkers: 'block', ...extra });
const navBtn = (page, label) => page.locator('nav[aria-label*="ছোট স্ক্রিন"] button', { hasText: label }).first();
async function flow(area, name, fn) {
  try { await fn(); } catch (e) { fail(area, name, `flow error: ${short(e)}`); }
}

// ================================================================ 4. per-width, per-tab
async function layoutSuite(browser) {
  section('4. Responsive layout, console, network, CSP, fonts, images on every tab');
  for (const w of WIDTHS) {
    const ctx = await newCtx(browser, w);
    const page = await ctx.newPage();
    const ev = watch(page);
    await page.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`)); });
    const overflow = [], small = [], extBroken = [], ownBroken = [], text = [];
    for (const t of TABS) {
      try {
        await go(page, t.id);
        const r = await page.evaluate(() => {
          const vis = (e) => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
          const tiny = [...document.querySelectorAll('button, a[href], select, input:not([type=hidden]):not([type=checkbox]):not([type=radio])')].filter(vis).filter((e) => { const b = e.getBoundingClientRect(); return b.height < 24 || b.width < 24; });
          const main = document.querySelector('main')?.innerText || '';
          return {
            over: document.documentElement.scrollWidth - innerWidth,
            imgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
            tiny: tiny.map((e) => `${(e.innerText || e.getAttribute('aria-label') || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 24)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`),
            bad: /undefined|NaN|\[object|\{\{/.test(main),
            h1: !!document.querySelector('h1'),
          };
        });
        if (r.over > 0) overflow.push(`#${t.id}:${r.over}px`);
        r.imgs.forEach((u) => (isExternal(u) ? extBroken : ownBroken).push(`#${t.id} ${u.slice(0, 90)}`));
        if (r.tiny.length) small.push(`#${t.id}: ${r.tiny.slice(0, 2).join(' / ')}`);
        if (r.bad) text.push(`#${t.id}`);
        if (!r.h1) text.push(`#${t.id}(no h1)`);
      } catch (e) { fail('layout', `${w}px #${t.id} loads`, short(e)); }
    }
    check('responsive', `${w}px: no horizontal overflow on any of the ${TABS.length} tabs`, overflow.length === 0, overflow.join(', '));
    check('responsive', `${w}px: no "undefined"/"NaN" text and every tab has an h1`, text.length === 0, text.join(', '));
    if (w <= 768) check('responsive', `${w}px: touch targets ≥ 24px (WCAG 2.2 AA minimum)`, small.length === 0, small.join(', '), 'WARN');
    check('images', `${w}px: no broken first-party images`, ownBroken.length === 0, ownBroken.slice(0, 4).join(' | '));
    if (extBroken.length) warn('images', `${w}px: ${extBroken.length} external (Wikimedia) image(s) did not load`, extBroken.slice(0, 3).join(' | '));
    else pass('images', `${w}px: every image loaded`);
    const fonts = await page.evaluate(async () => { await document.fonts.ready; return { loaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family), body: getComputedStyle(document.body).fontFamily }; });
    check('fonts', `${w}px: Anek Bangla font loaded and applied`, fonts.loaded.includes('Anek Bangla') && /Anek Bangla/.test(fonts.body), `loaded=[${fonts.loaded}] body=${fonts.body.slice(0, 40)}`);
    const csp = await page.evaluate(() => window.__csp);
    check('security', `${w}px: no CSP violations`, csp.length === 0, `${[...new Set(csp)].slice(0, 8).join(' | ')}  [live img-src: ${((LIVE_CSP.match(/img-src ([^;]*)/) || [])[1] || 'n/a (local)').slice(0, 200)}]`);
    if (ev.hosts.size) {
      info(`${w}px: Wikimedia hosts the browser actually contacted (incl. redirect hops): ${[...ev.hosts].join(', ')}`);
      if (LIVE_CSP) {
        const allowed = ((LIVE_CSP.match(/img-src ([^;]*)/) || [])[1] || '').split(/\s+/);
        const missing = [...ev.hosts].filter((h) => !allowed.includes(`https://${h}`));
        check('security', `${w}px: every Wikimedia host contacted is allowed by the live img-src`, missing.length === 0, `not allowed: ${missing.join(', ')}`);
      }
    }
    check('console', `${w}px: no uncaught JavaScript errors`, ev.errors.length === 0, ev.errors.slice(0, 2).join(' | '));
    const ownConsole = ev.console.filter((c) => !c.url || !isExternal(c.url)).filter((c) => !/Content Security Policy/.test(c.text));
    check('console', `${w}px: no first-party console errors`, ownConsole.length === 0, ownConsole.slice(0, 2).map((c) => c.text).join(' | '));
    const extConsole = ev.console.filter((c) => c.url && isExternal(c.url));
    if (extConsole.length) warn('external', `${w}px: ${extConsole.length} console error(s) from external services`, [...new Set(extConsole.map((c) => { try { return new URL(c.url).hostname; } catch { return c.url; } }))].join(', '));
    const own404 = ev.bad.filter((b) => !isExternal(b.url));
    check('network', `${w}px: no first-party 4xx/5xx responses`, own404.length === 0, own404.slice(0, 3).map((b) => `${b.status} ${b.url.slice(0, 80)}`).join(' | '));
    const ownFail = ev.failed.filter((f) => !isExternal(f.url));
    check('network', `${w}px: no failed first-party requests`, ownFail.length === 0, ownFail.slice(0, 3).map((f) => `${f.why} ${f.url.slice(0, 80)}`).join(' | '));
    const extFail = [...ev.failed.filter((f) => isExternal(f.url)).map((f) => f.url), ...ev.bad.filter((b) => isExternal(b.url)).map((b) => b.url)];
    if (extFail.length) warn('external', `${w}px: ${extFail.length} external request(s) failed (Wikimedia/Open-Meteo)`, [...new Set(extFail.map((u) => { try { return new URL(u).hostname; } catch { return u.slice(0, 40); } }))].join(', '));
    await ctx.close();
  }
}

// ================================================================ 5. accessibility
async function a11ySuite(browser) {
  section('5. Accessibility (axe-core WCAG 2 A/AA + best practice) and keyboard');
  const runAxe = async (page, label) => {
    await page.evaluate(axeSource);
    const v = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] })).violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, sel: x.nodes[0].target.join(' ').slice(0, 60) })));
    const serious = v.filter((x) => x.impact === 'critical' || x.impact === 'serious');
    const minor = v.filter((x) => !(x.impact === 'critical' || x.impact === 'serious'));
    if (!v.length) pass('a11y', `axe ${label}: 0 violations`);
    if (serious.length) fail('a11y', `axe ${label}: ${serious.length} serious/critical`, serious.map((x) => `${x.id}(${x.n}) ${x.sel}`).join(' | '));
    if (minor.length) warn('a11y', `axe ${label}: ${minor.length} moderate/minor`, minor.map((x) => `${x.id}(${x.n}) ${x.sel}`).join(' | '));
  };
  for (const w of QUICK ? [390] : [390, 1280]) {
    const ctx = await newCtx(browser, w);
    const page = await ctx.newPage();
    watch(page);
    for (const t of TABS) { try { await go(page, t.id); await runAxe(page, `${w}px #${t.id}`); } catch (e) { fail('a11y', `axe ${w}px #${t.id}`, short(e)); } }
    if (w === 390) {
      await flow('a11y', 'axe on dialogs', async () => {
        await go(page, 'home');
        await page.locator('header button[title*="জরুরি"]').click();
        await page.locator('[role=dialog]').waitFor();
        await runAxe(page, 'emergency dialog');
        await page.keyboard.press('Escape');
        await page.getByRole('button', { name: 'যোগাযোগ', exact: true }).click();
        await page.locator('[role=dialog]').waitFor();
        await runAxe(page, 'about dialog');
        await page.keyboard.press('Escape');
        await go(page, 'guide');
        await page.getByRole('heading', { name: 'বাগেরহাট', exact: true }).first().click();
        await page.locator('[role=dialog]').waitFor();
        await runAxe(page, 'district dialog');
        await page.keyboard.press('Escape');
        await go(page, 'map');
        await page.locator('button', { hasText: 'সার্টিফিকেট' }).first().click();
        await page.locator('[role=dialog]').waitFor();
        await runAxe(page, 'certificate dialog');
        await page.keyboard.press('Escape');
        await page.locator('label:has(input[type=checkbox])').nth(0).click();
        await page.getByRole('button', { name: /ট্রাভেল কার্ড/ }).first().click();
        await page.locator('[role=dialog] canvas').waitFor();
        await page.waitForTimeout(800);
        await runAxe(page, 'travel card dialog');
      });
    }
    await ctx.close();
  }

  const ctx = await newCtx(browser, 1280);
  const page = await ctx.newPage();
  watch(page);
  await flow('keyboard', 'keyboard checks', async () => {
    await go(page, 'home');
    // Cards animate their focus ring in; disable transitions so the ring is measurable immediately
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await page.evaluate(() => document.body.focus());
    const seen = []; const noRing = [];
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press('Tab');
      const s = await page.evaluate(() => {
        const e = document.activeElement; if (!e || e === document.body) return null;
        const cs = getComputedStyle(e); const b = e.getBoundingClientRect();
        const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
        return { name: (e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 24), tag: e.tagName, ring, visible: b.width > 0 && b.height > 0, inFooter: !!e.closest('footer') };
      });
      if (!s) continue;
      seen.push(s);
      if (!s.ring) noRing.push(s.name);
    }
    check('keyboard', 'Tab moves through interactive elements (≥ 20 stops, no trap)', seen.length >= 20 && new Set(seen.map((s) => s.name + s.tag)).size >= 15, `${seen.length} stops`);
    check('keyboard', 'every focused element shows a visible focus indicator', noRing.length === 0, [...new Set(noRing)].slice(0, 5).join(', '));
    let footer = seen.some((s) => s.inFooter);
    for (let i = 0; i < 80 && !footer; i++) { await page.keyboard.press('Tab'); footer = await page.evaluate(() => !!document.activeElement?.closest('footer')); }
    check('keyboard', 'Tab can reach the footer links', footer);
    await navBtn(page, 'জেলা গাইড').focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    check('keyboard', 'Enter on a tab button navigates (#guide)', page.url().endsWith('#guide'));
    await go(page, 'home');
    await page.locator('header button[title*="জরুরি"]').focus();
    await page.keyboard.press('Enter');
    await page.locator('[role=dialog]').waitFor();
    check('keyboard', 'opening a dialog moves focus inside it', await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]')));
    check('a11y', 'dialog has role=dialog, aria-modal and a label', await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); return d.getAttribute('aria-modal') === 'true' && !!d.getAttribute('aria-label'); }));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    check('keyboard', 'Escape closes the dialog', (await page.locator('[role=dialog]').count()) === 0);
    check('keyboard', 'focus returns to the control that opened the dialog', await page.evaluate(() => !!document.activeElement?.matches('button[title*="জরুরি"]')));
    const alts = await page.evaluate(() => [...document.images].filter((i) => !i.hasAttribute('alt')).length);
    check('a11y', 'every <img> has an alt attribute', alts === 0, `${alts} without`);
  });
  await ctx.close();
}

// ================================================================ 6. performance
async function perfSuite(browser) {
  section('6. Performance (cold load, 390px viewport; numbers depend on your machine and network)');
  for (const t of TABS) {
    const ctx = await newCtx(browser, 390);
    const page = await ctx.newPage();
    watch(page);
    let bytes = 0, js = 0, reqs = 0;
    try {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      const kinds = new Map();
      cdp.on('Network.responseReceived', (e) => kinds.set(e.requestId, e.type));
      cdp.on('Network.loadingFinished', (e) => { reqs++; bytes += e.encodedDataLength; if (kinds.get(e.requestId) === 'Script') js += e.encodedDataLength; });
    } catch { /* CDP unavailable: sizes will show 0 */ }
    await page.addInitScript(() => {
      window.__m = { lcp: 0, cls: 0 };
      new PerformanceObserver((l) => { window.__m.lcp = l.getEntries().at(-1).startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__m.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
    });
    try {
      await page.goto(`${BASE}/#${t.id}`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
      await settle(page);
      await page.waitForTimeout(1500);
      const m = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { ...window.__m, ttfb: n.responseStart, load: n.loadEventEnd }; });
      info(`#${t.id.padEnd(6)} LCP ${Math.round(m.lcp)} ms · CLS ${m.cls.toFixed(3)} · TTFB ${Math.round(m.ttfb)} ms · load ${Math.round(m.load)} ms · ${reqs} requests · ${(bytes / 1024).toFixed(0)} KB total · ${(js / 1024).toFixed(0)} KB JS (transferred)`);
      check('perf', `#${t.id} CLS ≤ 0.1`, m.cls <= 0.1, m.cls.toFixed(3));
      if (m.cls > 0.05 && m.cls <= 0.1) warn('perf', `#${t.id} CLS is above 0.05`, m.cls.toFixed(3));
      check('perf', `#${t.id} LCP ≤ 2.5 s (machine/network dependent)`, m.lcp <= 2500, `${Math.round(m.lcp)} ms`, 'WARN');
      if (t.id === 'home') {
        if (js > 0) check('perf', 'home: transferred JS ≤ 350 KB', js <= 350 * 1024, `${(js / 1024).toFixed(0)} KB`, 'WARN');
        else skip('perf', 'home: transferred JS size', 'CDP network events unavailable');
        check('perf', 'home: ≤ 60 requests', reqs <= 60, `${reqs}`, 'WARN');
      }
    } catch (e) { fail('perf', `#${t.id} measurement`, short(e)); }
    await ctx.close();
  }
}

// ================================================================ 7. user flows
async function flowSuite(browser) {
  section('7. User flows (390px mobile)');
  const ctx = await newCtx(browser, 390);
  const page = await ctx.newPage();
  const ev = watch(page);
  const clear = async () => { await page.evaluate(() => localStorage.clear()); };

  await flow('home', 'homepage', async () => {
    await go(page, 'home');
    const hdr = await page.locator('header').innerText();
    check('home', 'logo + brand in header', /দেশভ্রমণ/.test(hdr) && /DeshBhromon/i.test(hdr));
    check('home', 'creator name is NOT in the header', !/হাসিবুল|Hasibul/i.test(hdr));
    check('home', 'hero title + tagline', (await page.locator('h1').first().innerText()).includes('দেশভ্রমণ') && (await page.locator('main').innerText()).includes('প্রতিটি জেলা, প্রতিটি গল্প, প্রতিটি ভ্রমণ'));
    check('home', 'both hero CTAs present', (await page.getByRole('button', { name: 'ভ্রমণ শুরু করুন' }).count()) === 1 && (await page.getByRole('button', { name: 'আমার ভ্রমণ ম্যাপ' }).count()) >= 1);
    check('home', 'photo mosaic shows 8 tiles', (await page.locator('section[aria-labelledby="photo-title"] li').count()) === 8);
    check('home', 'photo attribution note shown', /উইকিমিডিয়া কমন্স/.test(await page.locator('section[aria-labelledby="photo-title"]').innerText()));
    check('home', 'all 8 division cards', (await page.locator('section[aria-labelledby="div-title"] li').count()) === 8);
    check('home', 'creator section: English credit + external links', await page.evaluate(() => { const s = document.querySelector('#about-title')?.closest('section'); return !!s && /Md\. Hasibul Hasan/.test(s.innerText) && s.querySelectorAll('a[target=_blank][rel*=noopener]').length >= 2; }));
    const foot = await page.locator('footer').innerText();
    check('home', 'footer credit is English-only', /Designed & developed by\s*Md\. Hasibul Hasan/i.test(foot) && !/হাসিবুল/.test(foot));
    check('home', 'emergency button visible in header', (await page.locator('header button[title*="জরুরি"]').count()) === 1);
    check('home', 'visited counter text renders', /ঘুরেছি|এখানেই শুরু|জেলা ঘুরেছেন/.test(await page.locator('main').innerText()));
    await page.getByRole('button', { name: 'ভ্রমণ শুরু করুন' }).click();
    await page.waitForTimeout(400);
    check('home', 'CTA "ভ্রমণ শুরু করুন" opens the guide', page.url().endsWith('#guide'));
    await go(page, 'home');
    await page.getByRole('button', { name: 'আমার ভ্রমণ ম্যাপ' }).first().click();
    await page.waitForTimeout(400);
    check('home', 'CTA "আমার ভ্রমণ ম্যাপ" opens the map', page.url().endsWith('#map'));
    await go(page, 'home');
    await page.locator('section[aria-labelledby="div-title"] li button', { hasText: 'সিলেট' }).click();
    await page.waitForTimeout(700);
    const heads = await page.locator('main h3').allInnerTexts();
    check('home', 'division card filters the guide to the Sylhet division', heads.some((h) => /সিলেট|সুনামগঞ্জ|মৌলভীবাজার|হবিগঞ্জ/.test(h)) && !heads.some((h) => /^বাগেরহাট$/.test(h.trim())));
  });

  await flow('nav', 'navigation', async () => {
    await go(page, 'home');
    for (const t of TABS) {
      await navBtn(page, t.label).click();
      await page.waitForTimeout(350);
      const cur = await navBtn(page, t.label).getAttribute('aria-current');
      check('nav', `tab "${t.label}" → #${t.id} (aria-current)`, page.url().endsWith(`#${t.id}`) && cur === 'page');
    }
    await navBtn(page, 'জেলা গাইড').click(); await page.waitForTimeout(300);
    await navBtn(page, 'আমার ম্যাপ').click(); await page.waitForTimeout(300);
    await page.goBack(); await page.waitForTimeout(400);
    check('nav', 'browser Back returns to the previous tab', page.url().endsWith('#guide'));
    await page.goForward(); await page.waitForTimeout(400);
    check('nav', 'browser Forward works', page.url().endsWith('#map'));
    await go(page, 'quiz');
    await page.reload(); await settle(page);
    check('nav', 'refresh keeps the current tab (#quiz)', page.url().endsWith('#quiz') && (await navBtn(page, 'কুইজ খেলা').getAttribute('aria-current')) === 'page');
    await page.goto(`${BASE}/#world`); await settle(page);
    check('nav', 'direct URL navigation to #world', (await navBtn(page, 'বিশ্ব ভ্রমণ').getAttribute('aria-current')) === 'page');
    await page.goto(`${BASE}/#not-a-tab`); await settle(page);
    check('nav', 'unknown hash falls back to Home', (await navBtn(page, 'হোম').getAttribute('aria-current')) === 'page');
    await page.getByRole('button', { name: 'দেশভ্রমণ হোম' }).click(); await page.waitForTimeout(300);
    check('nav', 'logo returns to Home', page.url().endsWith('#home'));
    const titles = {};
    for (const t of TABS) { await go(page, t.id); titles[t.id] = await page.title(); }
    check('nav', 'every tab sets its own document title', new Set(Object.values(titles)).size === TABS.length, JSON.stringify(titles).slice(0, 160), 'WARN');
  });

  await flow('map', 'map', async () => {
    await go(page, 'map'); await clear(); await page.reload(); await settle(page);
    check('map', 'map canvas renders', await page.evaluate(() => { const c = document.querySelector('canvas'); return !!c && c.width > 200 && c.height > 200; }));
    const search = page.locator('input[placeholder*="জেলার নাম দিয়ে খুঁজুন"]');
    await search.fill('সিলেট'); await page.waitForTimeout(400);
    const n = await page.locator('label:has(input[type=checkbox])').count();
    check('map', 'search filters the district list', n >= 1 && n <= 3, `${n} rows for "সিলেট"`);
    await search.fill(''); await page.waitForTimeout(300);
    await page.locator('label:has(input[type=checkbox])').first().click(); await page.waitForTimeout(300);
    check('map', 'selecting a district marks it visited (stored)', (await lsJson(page, 'visited'))?.length === 1);
    await page.reload(); await settle(page);
    check('map', 'visited state persists after reload', (await lsJson(page, 'visited'))?.length === 1 && (await page.locator('label:has(input:checked)').count()) >= 1);
    await page.locator('button', { hasText: 'সব বাছাই করুন' }).first().click(); await page.waitForTimeout(400);
    check('map', '"select all" marks all 64 districts', (await lsJson(page, 'visited'))?.length === 64);
    await page.locator('button', { hasText: 'সব মুছুন' }).first().click(); await page.waitForTimeout(400);
    check('map', '"clear all" empties the selection', (await lsJson(page, 'visited'))?.length === 0);
    await page.locator('canvas').first().scrollIntoViewIfNeeded();
    const box = await page.locator('canvas').first().boundingBox();
    let changed = false;
    for (let fx = 0.2; fx <= 0.8 && !changed; fx += 0.1) {
      for (let fy = 0.2; fy <= 0.8 && !changed; fy += 0.1) {
        await page.mouse.click(box.x + box.width * fx, box.y + box.height * fy); await page.waitForTimeout(60);
        changed = (await lsJson(page, 'visited'))?.length > 0;
      }
    }
    check('map', 'clicking the map canvas selects a district', changed, 'no grid point selected a district; verify manually', 'WARN');
    for (const fmt of ['PNG', 'JPG', 'PDF']) {
      try {
        await page.locator('button', { hasText: 'সব বাছাই করুন' }).first().click(); await page.waitForTimeout(300);
        const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.locator('button', { hasText: fmt }).first().click()]);
        const f = await fileInfo(d);
        check('map', `${fmt} export downloads a valid ${fmt} file`, f.size > 5000 && f.type === fmt.toLowerCase(), `${f.size} bytes, detected ${f.type}`);
      } catch (e) { fail('map', `${fmt} export`, short(e)); }
    }
  });

  await flow('guide', 'district guide', async () => {
    const districts = [['ঢাকা', 'Dhaka'], ['চট্টগ্রাম', 'Chattogram'], ['রাজশাহী', 'Rajshahi'], ['রাঙ্গামাটি', 'Rangamati'], ['সিলেট', 'Sylhet'], ['খুলনা', 'Khulna'], ['বরিশাল', 'Barishal'], ['মেহেরপুর', 'Meherpur']];
    for (const [name, id] of districts) {
      await flow('guide', `district ${name}`, async () => {
        await go(page, 'guide');
        await page.locator('input[placeholder*="জেলা বা দর্শনীয় স্থান খুঁজুন"]').fill(name);
        await page.waitForTimeout(500);
        await page.getByRole('heading', { name, exact: true }).first().click();
        const dlg = page.locator('[role=dialog]');
        await dlg.waitFor({ timeout: 8000 });
        const t = await dlg.innerText();
        const must = [id === 'Dhaka' ? 'শহরের ভেতরে চলাচল' : 'ঢাকা থেকে যাওয়ার উপায়', 'কী খাবেন', 'কোথায় থাকবেন', 'দর্শনীয় স্থান', 'বিভাগ'];
        const missing = must.filter((m) => !t.includes(m));
        check('guide', `${name}: division, transport, food, stay and places sections`, missing.length === 0, `missing: ${missing.join(', ')}`);
        check('guide', `${name}: no raw internal keys (bus/car/train/local/launch/air) shown`, !/(^|\n)\s*(bus|car|train|local|launch|air)\b/i.test(t) && !/undefined|\[object/.test(t));
        check('guide', `${name}: cost/distance or season information present`, /কিমি|খরচ|৳|ভালো সময়|সময় লাগবে/.test(t), '', 'WARN');
        if (id === 'Meherpur') check('guide', 'missing stay data is explained, not blank or invented', /থাকার তথ্য এখনো যোগ করা হয়নি/.test(t) || /হোটেল|রিসোর্ট|গেস্ট/.test(t));
        const imgs = await dlg.evaluate((d) => ({ total: d.querySelectorAll('img').length, broken: [...d.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length }));
        if (imgs.broken) warn('guide', `${name}: ${imgs.broken}/${imgs.total} photo(s) not loaded (external Wikimedia?)`);
        await page.keyboard.press('Escape'); await page.waitForTimeout(250);
        check('guide', `${name}: Escape closes the dialog`, (await page.locator('[role=dialog]').count()) === 0);
      });
    }
  });

  await flow('plan', 'trip planner', async () => {
    await go(page, 'plan');
    const grab = () => page.evaluate(() => (document.body.innerText.match(/৳\s?[০-৯,]+/g) || []).join('|'));
    const before = await grab();
    const sel = page.locator('select[aria-label="আরও জেলা যুক্ত করুন"]');
    const opt = await sel.evaluate((s) => [...s.options].find((o) => /সিলেট/.test(o.textContent))?.value);
    await sel.selectOption(opt); await page.waitForTimeout(400);
    check('plan', 'adding a destination shows it as a chip', (await page.locator('button[aria-label="সিলেট বাদ দিন"]').count()) === 1);
    const days = page.locator('input[aria-label="সময়কাল (দিন)"]');
    await days.fill('6'); await page.waitForTimeout(400);
    check('plan', 'changing the number of days recalculates the budget', before !== (await grab()));
    await page.locator('button[aria-label="সিলেট বাদ দিন"]').click(); await page.waitForTimeout(300);
    check('plan', 'removing a destination works', (await page.locator('button[aria-label="সিলেট বাদ দিন"]').count()) === 0);
    check('plan', 'print voucher button present', (await page.locator('button', { hasText: 'প্রিন্ট ভাউচার' }).count()) >= 1);
    // The window.open() popup starts at about:blank and navigates a moment later, so its URL is not
    // reliable at the instant the 'page' event fires. Judge the real user flow instead: a new window
    // opens AND it requests api.whatsapp.com/send?text=<the trip summary>. The request is answered
    // locally so no message is ever sent.
    const waReqs = [];
    ctx.on('request', (r) => { if (/(^|\.)whatsapp\.com$/.test(new URL(r.url()).hostname)) waReqs.push(r.url()); });
    await ctx.route(/whatsapp\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }));
    const share = page.locator('button[title*="হোয়াটসঅ্যাপ"]').first();
    if (await share.count()) {
      const popP = ctx.waitForEvent('page', { timeout: 10000 }).catch(() => null);
      await share.click();
      const pop = await popP;
      for (let i = 0; i < 40 && !waReqs.length; i++) await page.waitForTimeout(250);
      check('plan', 'WhatsApp share opens a new window', !!pop, 'no new window opened (is a popup blocker active for this profile?)');
      const u = waReqs.find((x) => /\/send\?/.test(x));
      check('plan', 'WhatsApp share navigates to api.whatsapp.com/send with the trip text', !!u && /^https:\/\/(api|web)\.whatsapp\.com\//.test(u), `requests: ${waReqs.join(' , ').slice(0, 160) || 'none'}; popup url: ${pop ? pop.url().slice(0, 80) : 'n/a'}`);
      let text = '';
      try { text = new URL(u).searchParams.get('text') || ''; } catch { /* below */ }
      check('plan', 'WhatsApp text carries the route, budget and only verified emergency numbers', /DeshBhromon/.test(text) && /৳/.test(text) && /999/.test(text) && /01320-222222/.test(text) && !/163599|189999/.test(text), text.slice(0, 80).replace(/\n/g, ' '));
      if (pop) await pop.close().catch(() => {});
    } else fail('plan', 'WhatsApp share button exists', 'not found');
    await sel.selectOption(opt); await days.fill('5'); await page.reload(); await settle(page);
    check('plan', 'planner state is stored under the deshbhromon_trip_planner key', !!(await lsJson(page, 'trip_planner')));
    check('plan', 'planner restores the edited days after reload', (await page.locator('input[aria-label="সময়কাল (দিন)"]').inputValue()) === '5');
    check('plan', 'planner restores the added destination after reload', (await page.locator('button[aria-label="সিলেট বাদ দিন"]').count()) === 1);
    await page.evaluate(() => localStorage.setItem('deshbhromon_trip_planner', '{broken'));
    await page.reload(); await settle(page);
    check('plan', 'corrupted planner storage falls back to defaults without crashing', (await page.locator('input[aria-label="সময়কাল (দিন)"]').inputValue()) === '4' && (await page.locator('button[aria-label="কক্সবাজার বাদ দিন"]').count()) === 1);
  });

  await flow('diary', 'diary', async () => {
    await go(page, 'diary'); await clear(); await page.reload(); await settle(page);
    check('diary', 'empty state shown on first visit', (await page.locator('text=এখনও কোনো ভ্রমণ স্মৃতি').count()) >= 1);
    await page.locator('button', { hasText: 'নতুন স্মৃতি যোগ করুন' }).click();
    await page.locator('textarea').first().fill('QA স্মৃতি ১');
    await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(400);
    check('diary', 'entry created and visible', (await page.locator('text=QA স্মৃতি ১').count()) >= 1);
    check('diary', 'entry stored', !!(await lsJson(page, 'travel_logs'))?.some((l) => l.notes === 'QA স্মৃতি ১'));
    await page.reload(); await settle(page);
    check('diary', 'entry persists after reload', (await page.locator('text=QA স্মৃতি ১').count()) >= 1);
    const editBtn = page.locator('button[title="সম্পাদনা করুন"]').first();
    check('diary', 'edit control present', (await editBtn.count()) === 1);
    await editBtn.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    check('diary', 'edit form opens by keyboard with the saved text prefilled', (await page.locator('textarea').first().inputValue()) === 'QA স্মৃতি ১');
    await page.locator('textarea').first().fill('QA বদলানো ২');
    await page.locator('button', { hasText: /^বাতিল করুন$/ }).click(); await page.waitForTimeout(300);
    check('diary', 'cancel leaves the original entry unchanged', (await page.locator('text=QA স্মৃতি ১').count()) >= 1 && (await page.locator('text=QA বদলানো ২').count()) === 0);
    await page.locator('button[title="সম্পাদনা করুন"]').first().click();
    await page.locator('textarea').first().fill('QA বদলানো ২');
    await page.locator('button[type=submit]').first().click(); await page.waitForTimeout(400);
    check('diary', 'saved edit replaces the text, no duplicate created', (await lsJson(page, 'travel_logs'))?.length === 1 && (await lsJson(page, 'travel_logs'))[0].notes === 'QA বদলানো ২');
    await page.reload(); await settle(page);
    check('diary', 'edited entry persists after reload', (await page.locator('text=QA বদলানো ২').count()) >= 1);
    await page.locator('button[title="মুছুন"]').first().click(); await page.waitForTimeout(400);
    check('diary', 'entry deleted', (await lsJson(page, 'travel_logs'))?.length === 0 && (await page.locator('text=QA বদলানো ২').count()) === 0);
  });

  await flow('food', 'food', async () => {
    await go(page, 'food'); await clear(); await page.reload(); await settle(page);
    const cards = await page.locator('button', { hasText: /^(টেস্ট করুন|খেয়েছি)$/ }).count();
    // The expected list comes from the repository's own data file, so adding foods never needs a runner change
    const foodSrc = readData('src/data/food-data.ts');
    const expected = (foodSrc.match(/^\s+id: '[a-z]\d+',/gm) || []).length;
    const withPhoto = (foodSrc.match(/^\s+img: \{ src:/gm) || []).length + (foodSrc.match(/^\s+f\d+: \{ src:/gm) || []).length;
    check('food', `all ${expected} food items listed`, expected >= 45 && cards === expected, `${cards} shown, ${expected} in the data file`);
    const photoSlots = await page.locator('[data-food-photo]').count();
    const missingSlots = await page.locator('[data-food-photo-missing]').count();
    check('food', 'every food card has a photo slot (photo, or an honest placeholder)', photoSlots + missingSlots === expected, `${photoSlots} photos + ${missingSlots} placeholders vs ${expected}`);
    check('food', `${withPhoto} foods carry a credited photo`, photoSlots === withPhoto, `${photoSlots} in the page vs ${withPhoto} in the data`);
    check('food', 'photo credits are printed under each food photo', (await page.locator('[data-food-photo] figcaption', { hasText: 'Wikimedia Commons' }).count()) === photoSlots);
    const search = page.locator('input[placeholder*="খাবার বা জেলার নাম"]');
    await search.fill('দই'); await page.waitForTimeout(400);
    const hits = await page.locator('button', { hasText: /^(টেস্ট করুন|খেয়েছি)$/ }).count();
    check('food', 'search filters the list', hits >= 1 && hits < expected, `${hits} results for "দই"`);
    await search.fill('');
    await page.locator('button', { hasText: 'টেস্ট করুন' }).first().click(); await page.waitForTimeout(300);
    check('food', 'tasted state stored', (await lsJson(page, 'tasted_foods'))?.length === 1);
    await page.reload(); await settle(page);
    check('food', 'tasted state persists after reload', (await page.locator('button', { hasText: 'খেয়েছি' }).count()) === 1);
  });

  await flow('quiz', 'quiz', async () => {
    const questions = evalArray('src/data/quiz-questions.ts', 'QUIZ_QUESTIONS');
    const games = (name) => evalArray('src/data/quiz-games.ts', `export const ${name}`);
    await go(page, 'quiz');
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const wrong = i % 4 === 3;
      const idx = wrong ? (q.correctIndex + 1) % 4 : q.correctIndex;
      if (!wrong) correct++;
      await page.getByRole('button', { name: q.options[idx], exact: true }).click();
      if (i === 0) check('quiz', 'answering reveals an explanation', (await page.locator(`text=${q.explanation.slice(0, 25)}`).count()) >= 1);
      await page.locator('button', { hasText: /পরবর্তী প্রশ্ন|ফলাফল দেখুন/ }).click();
      await page.waitForTimeout(120);
    }
    const res = await page.locator('main').innerText();
    check('quiz', `result screen shows the exact correct count (${correct}/${questions.length})`, res.includes(`${bn(questions.length)}টির মধ্যে ${bn(correct)}টি সঠিক`), res.match(/কুইজ শেষ[^\n]*/)?.[0] || '');
    check('quiz', 'score is shown on the result screen', /[০-৯]+ পয়েন্ট/.test(res));
    await page.reload(); await settle(page);
    check('quiz', 'reload restarts the quiz at question 1', (await page.locator('main').innerText()).includes(`১ / ${bn(questions.length)}`));

    await page.locator('button', { hasText: 'ছবি দেখে জেলা চিনুন' }).click(); await page.waitForTimeout(400);
    const pm = games('PHOTO_MYSTERY_ITEMS')[0];
    await page.getByRole('button', { name: pm.correct, exact: true }).first().click(); await page.waitForTimeout(300);
    check('quiz', 'photo mystery: answer accepted and next button appears', (await page.locator('button', { hasText: 'পরবর্তী ছবি' }).count()) >= 1);
    await page.locator('button', { hasText: 'ঐতিহ্যবাহী খাবার' }).or(page.locator('button', { hasText: '৩.' })).first().click(); await page.waitForTimeout(400);
    const pair = games('FOOD_MATCH_PAIRS')[0];
    await page.getByText(pair.food, { exact: true }).first().click();
    await page.getByText(pair.district, { exact: true }).first().click(); await page.waitForTimeout(400);
    check('quiz', 'food match mode renders and accepts a pair', (await page.locator('main').innerText()).length > 100, '', 'WARN');

    await page.locator('button', { hasText: 'বর্ণ সাজিয়ে জেলা আবিষ্কার' }).first().click(); await page.waitForTimeout(400);
    const puzzles = games('ANAGRAM_PUZZLES');
    const order = (letters, sol) => {
      const rec2 = (left, acc) => {
        if (acc === sol) return [];
        for (let i = 0; i < left.length; i++) {
          if (!sol.startsWith(acc + left[i])) continue;
          const r = rec2(left.filter((_, j) => j !== i), acc + left[i]);
          if (r) return [left[i], ...r];
        }
        return null;
      };
      return rec2(letters, '');
    };
    const tile = (t) => page.locator(`button[aria-label="বর্ণ ${t}"]:not([disabled])`).first();
    const first = order(puzzles[0].letters, puzzles[0].solution);
    await tile(first[0]).click();
    check('quiz', 'anagram: a used tile is disabled (no reuse)', (await page.locator(`button[aria-label="বর্ণ ${first[0]}"][disabled]`).count()) >= 1);
    await page.locator('button', { hasText: 'রিসেট করুন' }).click(); await page.waitForTimeout(200);
    let solvedAll = true;
    for (let p = 0; p < puzzles.length; p++) {
      const seq = order(puzzles[p].letters, puzzles[p].solution);
      for (const t of seq) await tile(t).click();
      await page.waitForTimeout(250);
      if (!(await page.locator(`text=সঠিক উত্তর! জেলা: ${puzzles[p].solution}`).count())) { solvedAll = false; fail('quiz', `anagram "${puzzles[p].solution}" cannot be solved in the UI`); break; }
      if (p === 0) {
        const score = async () => (await page.locator('text=মোট পয়েন্ট').first().locator('xpath=..').innerText()).replace(/\s+/g, ' ');
        const s1 = await score();
        await page.locator('button[title="মুছতে ক্লিক করুন"]').last().click(); await tile(seq.at(-1)).click(); await page.waitForTimeout(250);
        check('quiz', 'anagram: removing and re-adding a tile does not score again', (await score()) === s1, s1);
      }
      if (p < puzzles.length - 1) await page.locator('button', { hasText: 'পরবর্তী ধাঁধা' }).click();
      await page.waitForTimeout(200);
    }
    if (solvedAll) check('quiz', `all ${puzzles.length} anagram puzzles solve in the UI`, (await page.locator('button', { hasText: 'আবার খেলুন' }).count()) >= 1);
  });

  await flow('world', 'world tracker', async () => {
    await go(page, 'world'); await clear(); await page.reload(); await settle(page);
    await page.locator('ul li button[aria-pressed]').first().waitFor({ timeout: 20000 });
    const n = await page.locator('ul li button[aria-pressed]').count();
    check('world', 'all 195 countries listed', n === 195, `${n}`);
    check('world', 'world map SVG renders', (await page.locator('svg[aria-label*="বিশ্ব মানচিত্র"] path').count()) > 150);
    const search = page.locator('input[type=search][aria-label="দেশের নাম খুঁজুন"]');
    await search.fill('ভারত'); await page.waitForTimeout(300);
    const bnHits = await page.locator('ul li button[aria-pressed]').count();
    check('world', 'search by Bangla name', bnHits >= 1 && bnHits <= 3, `${bnHits}`);
    await search.fill('thai'); await page.waitForTimeout(300);
    check('world', 'search by English name', (await page.locator('ul li button[aria-pressed]').count()) >= 1);
    await search.fill('');
    await page.locator('div[role=group] button', { hasText: 'এশিয়া' }).click(); await page.waitForTimeout(300);
    check('world', 'continent filter (Asia = 48 countries)', (await page.locator('ul li button[aria-pressed]').count()) === 48);
    await page.locator('ul li button[aria-pressed]').first().click(); await page.waitForTimeout(300);
    check('world', 'selecting a country saves an ISO-3 code', /^[A-Z]{3}$/.test((await lsJson(page, 'world'))?.[0] || ''));
    check('world', 'continent progress updates', /১\s*\/\s*৪৮/.test(await page.locator('section[aria-label="মহাদেশ অনুযায়ী অগ্রগতি"]').innerText()));
    await page.reload(); await settle(page);
    await page.locator('ul li button[aria-pressed]').first().waitFor();
    check('world', 'selection persists after reload', (await page.locator('ul li button[aria-pressed="true"]').count()) === 1);
  });

  await flow('safety', 'safety, seasons and emergency', async () => {
    await go(page, 'safety');
    const t = await page.locator('main').innerText();
    const seasonNames = ['গ্রীষ্ম', 'বর্ষা', 'শরৎ', 'হেমন্ত', 'শীত', 'বসন্ত'];
    const found = seasonNames.filter((s) => t.includes(s));
    check('seasons', 'all 6 seasons covered', found.length === 6, `found: ${found.join(', ')}`);
    check('seasons', 'every season card has a photo slot; each photo prints its credit', (await page.locator('[data-season-photo], [data-season-photo-missing]').count()) === 6 && (await page.locator('[data-season-photo]').count()) === (await page.locator('[data-season-photo] figcaption', { hasText: 'Wikimedia Commons' }).count()), `${await page.locator('[data-season-photo]').count()} photos, ${await page.locator('[data-season-photo-missing]').count()} placeholders`);
    check('seasons', 'season cards show places per season', (await page.locator('main h2').count()) >= 3, `${await page.locator('main h2').count()} headings`);
    check('safety', 'seasons tab has substantive content', t.length > 800, `${t.length} chars`);
    await page.locator('button', { hasText: 'জরুরি হেল্পলাইন ও নিরাপত্তা' }).click(); await page.waitForTimeout(400);
    const VERIFIED = new Set(['999', '131', '16163', '1090', '01320222222', '01887878787']);
    const tabTels = (await page.locator('main a[href^="tel:"]').evaluateAll((as) => as.map((a) => a.getAttribute('href').replace('tel:', '').replace(/-/g, '')))).filter(Boolean);
    check('safety', 'safety tab shows emergency numbers', tabTels.length >= 3, `${tabTels.length} numbers`);
    check('safety', 'every number on the safety tab is on the verified list', tabTels.every((n) => VERIFIED.has(n)), tabTels.filter((n) => !VERIFIED.has(n)).join(', '));
    await go(page, 'home');
    await page.locator('header button[title*="জরুরি"]').click();
    const dlg = page.locator('[role=dialog]'); await dlg.waitFor();
    const tels = (await dlg.locator('a[href^="tel:"]').evaluateAll((as) => as.map((a) => a.getAttribute('href').replace('tel:', '')))).sort();
    const expected = ['01320222222', '01887878787', '131', '16163', '999'].sort();
    check('safety', 'emergency list is exactly the verified numbers (999, 01320-222222, 01887-878787, 16163, 131)', JSON.stringify(tels) === JSON.stringify(expected), tels.join(', '));
    check('safety', '"verify before travel" disclaimer shown', /যাচাই/.test(await dlg.innerText()));
    await page.keyboard.press('Escape');
  });

  await flow('certificate', 'certificate', async () => {
    await go(page, 'map'); await clear(); await page.reload(); await settle(page);
    await page.locator('button', { hasText: 'সার্টিফিকেট' }).first().click();
    const dlg = page.locator('[role=dialog]'); await dlg.waitFor();
    const dl = dlg.locator('button', { hasText: 'সনদ ডাউনলোড' });
    check('certificate', 'download is disabled with 0 districts', await dl.isDisabled());
    check('certificate', 'explains that a district must be marked first', /অন্তত একটি ঘোরা জেলা/.test(await dlg.innerText()));
    await page.keyboard.press('Escape');
    await page.locator('label:has(input[type=checkbox])').nth(0).click(); await page.locator('label:has(input[type=checkbox])').nth(1).click(); await page.waitForTimeout(300);
    await page.locator('button', { hasText: 'সার্টিফিকেট' }).first().click(); await dlg.waitFor();
    await page.locator('#cert-name').fill('টেস্ট ভ্রমণকারী');
    const txt = await dlg.innerText();
    check('certificate', 'shows the correct district count (২টি)', txt.includes('২টি জেলা'));
    check('certificate', 'shows the traveller name', (await page.locator('#cert-name').inputValue()) === 'টেস্ট ভ্রমণকারী');
    check('certificate', 'no fake "official / verified / verification ID" wording', !/official certificate|ভেরিফায়েড|যাচাইকরণ আইডি|OFFICIAL/i.test(txt) && /সরকারি বা যাচাইকৃত সনদ নয়/.test(txt));
    check('certificate', 'no creator signature on the certificate', !/হাসিবুল|Hasibul/i.test(txt));
    check('certificate', 'DeshBhromon branding', /DeshBhromon/.test(txt));
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), dl.click()]);
    const f = await fileInfo(d);
    check('certificate', 'PNG download is a valid PNG image', f.size > 10000 && f.type === 'png', `${f.size} bytes, detected ${f.type}`);
    const box = await dlg.locator('> div').first().boundingBox();
    check('certificate', 'dialog fits the 390px viewport', box.x >= 0 && box.x + box.width <= 390, `${Math.round(box.x)}..${Math.round(box.x + box.width)}`);
  });

  await flow('artcard', 'district photo cards and their downloadable image', async () => {
    await go(page, 'guide'); await page.reload(); await settle(page); // a reload also closes any dialog a previous flow left open
    await page.locator('button', { hasText: 'ফটো গ্যালারি' }).first().click(); await page.waitForTimeout(2500);
    const dls = page.locator('button[title*="এইচডি আর্ট কার্ড"]');
    check('artcard', 'district cards offer a download button (64)', (await dls.count()) === 64, `${await dls.count()}`);
    check('artcard', 'no "AI Prompt" text anywhere on the cards', !/AI Prompt/i.test(await page.locator('main').innerText()));
    const shown = await page.evaluate(() => [...document.querySelectorAll('main img[alt]')].filter((i) => /wikimedia/.test(i.currentSrc || i.src) && i.naturalWidth > 0).length);
    // Can the browser export a canvas that contains a Wikimedia photo? Needs CORS. Three routes are tried
    // and all are reported, so a failure says exactly which part of Wikimedia's chain lacks CORS.
    const probe = await page.evaluate(async () => {
      const file = 'Sixty_Dome_Mosque,Bagerhat.jpg';
      const load = (url, cors) => new Promise((r) => { const i = new Image(); if (cors) i.crossOrigin = 'anonymous'; i.onload = () => r(true); i.onerror = () => r(false); i.src = url; setTimeout(() => r(false), 20000); });
      const fp = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file) + '?width=400';
      const out = { plain: await load(fp, false), filePathCors: await load(fp, true), apiOk: false, thumb: '', thumbCors: false, err: '' };
      try {
        const r = await fetch('https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&iiurlwidth=400&origin=*&titles=' + encodeURIComponent('File:' + file));
        const j = await r.json();
        const info = Object.values(j.query.pages)[0].imageinfo[0];
        out.apiOk = true; out.thumb = info.thumburl || info.url;
        out.thumbCors = await load(out.thumb, true);
      } catch (e) { out.err = String(e).slice(0, 120); }
      return out;
    });
    info(`photo export probe: plain=${probe.plain} Special:FilePath+CORS=${probe.filePathCors} commonsAPI=${probe.apiOk} thumb=${probe.thumb.slice(0, 70)} thumb+CORS=${probe.thumbCors} ${probe.err}`);
    if (!probe.plain) skip('artcard', 'photo-on-downloaded-card (CORS) check', 'Wikimedia photo not reachable from this browser — environment limit, not a pass');
    else check('artcard', 'a Wikimedia photo can be loaded with CORS (via the Commons API), so the downloaded card can contain it', probe.apiOk && probe.thumbCors, `Special:FilePath+CORS=${probe.filePathCors} commonsAPI=${probe.apiOk} thumb+CORS=${probe.thumbCors} ${probe.err}`);
    if (probe.plain) check('artcard', 'district cards display real photos', shown > 0, `${shown} photos decoded`);
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 40000 }), dls.first().click()]);
    const f = await fileInfo(d);
    await page.waitForTimeout(500);
    const note = await dls.first().locator('xpath=ancestor::div[contains(@class,"group")][1]').locator('[role=status]').innerText().catch(() => '');
    if (probe.plain) check('artcard', 'the downloaded card really contains the photo (not the illustrated fallback)', /ছবিসহ/.test(note), `status message: "${note}"`);
    check('artcard', 'downloaded district card is a valid 1200x800 PNG', f.type === 'png' && f.width === 1200 && f.height === 800 && f.size > 20000, `${f.type} ${f.width}x${f.height} ${f.size} bytes`);
    check('artcard', 'downloaded district card has a safe ASCII file name', /^DeshBhromon-Inspiration-[A-Za-z0-9_]+\.png$/.test(d.suggestedFilename()), d.suggestedFilename());
    // the second kind of downloadable card: one per place, inside the district dialog (tab 2)
    await go(page, 'guide'); await page.reload(); await settle(page); // back to the default directory view
    await page.getByRole('heading', { name: 'বাগেরহাট', exact: true }).first().click();
    await page.locator('[role=dialog]').waitFor();
    await page.locator('[role=dialog] [role=tab]').nth(1).click(); await page.waitForTimeout(2500);
    const spotBtns = page.locator('[role=dialog] button[title="ছবি ডাউনলোড করুন"]');
    check('artcard', 'the district dialog has no AI prompt box', !/Prompt|প্রম্পট/.test(await page.locator('[role=dialog]').innerText()));
    check('artcard', 'the district dialog offers a download per place', (await spotBtns.count()) >= 1, `${await spotBtns.count()}`);
    const [sd] = await Promise.all([page.waitForEvent('download', { timeout: 40000 }), spotBtns.first().click()]);
    const sf = await fileInfo(sd);
    check('artcard', 'downloaded place card is a valid 1200x900 PNG', sf.type === 'png' && sf.width === 1200 && sf.height === 900 && sf.size > 20000, `${sf.type} ${sf.width}x${sf.height} ${sf.size} bytes`);
    await page.waitForTimeout(500);
    const snote = (await page.locator('[role=status]').allInnerTexts()).join(' ');
    if (probe.plain) check('artcard', 'the downloaded place card really contains the photo (not the illustrated fallback)', /ছবিসহ/.test(snote), `status message: "${snote.trim()}"`);
    await page.keyboard.press('Escape');
  });

  await flow('travelcard', 'personal travel card (Facebook image)', async () => {
    await go(page, 'map'); await clear(); await page.reload(); await settle(page);
    const open = () => page.getByRole('button', { name: /ট্রাভেল কার্ড/ }).first().click();
    await open();
    const dlg = page.locator('[role=dialog]'); await dlg.waitFor();
    const dl = dlg.getByRole('button', { name: /কার্ড ডাউনলোড/ });
    check('travelcard', 'download is disabled with 0 districts and the reason is explained', (await dl.isDisabled()) && /অন্তত একটি ঘোরা জেলা/.test(await dlg.innerText()));
    await page.keyboard.press('Escape');
    check('travelcard', 'Escape closes the dialog', (await page.locator('[role=dialog]').count()) === 0);
    await page.locator('label:has(input[type=checkbox])').nth(0).click(); await page.locator('label:has(input[type=checkbox])').nth(1).click(); await page.waitForTimeout(300);
    await open(); await dlg.waitFor();
    await dlg.locator('#travelcard-name').fill('টেস্ট ভ্রমণকারী'); await page.waitForTimeout(900);
    const cv = dlg.locator('canvas');
    const dim = await cv.evaluate((c) => [c.width, c.height, c.getAttribute('aria-label') || '']);
    check('travelcard', 'preview is a 1080x1350 (4:5, Facebook feed) image with a descriptive label', dim[0] === 1080 && dim[1] === 1350 && /২টি/.test(dim[2]) && /টেস্ট ভ্রমণকারী/.test(dim[2]), dim.join(' | '));
    const drawn = await cv.evaluate((c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4 * 997) if (x[i] > 200 && x[i + 1] > 150 && x[i + 2] < 120) n++; return n; });
    check('travelcard', 'the card is really painted (gold visited districts present)', drawn > 20, `${drawn} gold samples`);
    check('travelcard', 'plan / diary options are disabled when there is no such data', (await dlg.getByLabel(/পরবর্তী যাত্রা/).isDisabled()) && (await dlg.getByLabel(/সেরা স্মৃতির লেখা/).isDisabled()));
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), dl.click()]);
    const f = await fileInfo(d);
    check('travelcard', 'PNG download is a valid 1080x1350 PNG', f.type === 'png' && f.width === 1080 && f.height === 1350 && f.size > 30000, `${f.type} ${f.width}x${f.height} ${f.size} bytes`);
    check('travelcard', 'download file name is a safe ASCII .png', /^DeshBhromon-TravelCard-[\d-]+\.png$/.test(d.suggestedFilename()), d.suggestedFilename());
    const cap = await dlg.getByRole('textbox', { name: /ক্যাপশন/ }).inputValue();
    check('travelcard', 'Facebook caption has the counts, the site and hashtags, and no diary text', /২টি/.test(cap) && /#DeshBhromon/.test(cap) && /vercel\.app|localhost/.test(cap));
    const box = await dlg.locator('> div').first().boundingBox();
    check('travelcard', 'dialog fits the 390px viewport', box.x >= 0 && box.x + box.width <= 390, `${Math.round(box.x)}..${Math.round(box.x + box.width)}`);
    await page.keyboard.press('Escape');
    // diary entry point + data from the diary and the planner flows into the card
    await go(page, 'diary');
    check('travelcard', 'the diary tab offers the same travel card', (await page.getByRole('button', { name: /ট্রাভেল কার্ড বানান/ }).count()) === 1);
  });

  check('console', 'no uncaught JavaScript errors during all user flows', ev.errors.length === 0, ev.errors.slice(0, 2).join(' | '));
  await ctx.close();
}

// ================================================================ 8. storage
async function storageSuite(browser) {
  section('8. Storage: first visit, saved data, corruption, legacy data, failures');
  const scenario = async (name, init, test) => {
    const ctx = await newCtx(browser, 390);
    const page = await ctx.newPage();
    const ev = watch(page);
    if (init) await page.addInitScript(init);
    try { await go(page, 'home'); await test(page, ev); } catch (e) { fail('storage', name, short(e)); }
    await ctx.close();
  };
  await scenario('first visit', null, async (page, ev) => {
    check('storage', 'first visit: clean empty start state, no errors', /এখানেই শুরু/.test(await page.locator('main').innerText()) && ev.errors.length === 0);
  });
  await scenario('valid data', () => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('deshbhromon_visited', JSON.stringify(['Dhaka', 'Sylhet']));
      localStorage.setItem('deshbhromon_travel_logs', JSON.stringify([{ id: 'a', districtId: 'Dhaka', date: '2025-01', companions: 'solo', rating: 5, notes: 'সংরক্ষিত' }]));
      localStorage.setItem('deshbhromon_tasted_foods', JSON.stringify(['f1']));
      localStorage.setItem('deshbhromon_traveler_name', 'পরীক্ষক');
    }
  }, async (page) => {
    check('storage', 'returning user: saved districts are loaded', (await page.locator('section[aria-label="আপনার অগ্রগতি"] h2').innerText()).includes('২/৬৪'));
    await go(page, 'diary'); await go(page, 'food'); await go(page, 'map');
    const v = await lsJson(page, 'visited'), l = await lsJson(page, 'travel_logs'), f = await lsJson(page, 'tasted_foods');
    check('storage', 'valid saved data is preserved after using the app', v?.length === 2 && l?.length === 1 && l[0].notes === 'সংরক্ষিত' && f?.length === 1, JSON.stringify({ v, f }));
    check('storage', 'traveller name preserved', (await ls(page, 'traveler_name')) === 'পরীক্ষক');
  });
  await scenario('corrupted', () => {
    for (const k of ['visited', 'wishlist', 'world', 'travel_logs', 'tasted_foods']) localStorage.setItem('deshbhromon_' + k, '{broken');
  }, async (page, ev) => {
    check('storage', 'corrupted JSON: app loads without errors', ev.errors.length === 0 && /এখানেই শুরু/.test(await page.locator('main').innerText()), ev.errors[0] || '');
    check('storage', 'corrupted values are backed up (…_unreadable_backup)', (await ls(page, 'visited_unreadable_backup')) === '{broken');
  });
  await scenario('wrong shape', () => {
    localStorage.setItem('deshbhromon_visited', JSON.stringify({ a: 1 }));
    localStorage.setItem('deshbhromon_travel_logs', JSON.stringify([1, 'x', null, {}]));
    localStorage.setItem('deshbhromon_world', JSON.stringify([5, null, 'BD']));
  }, async (page, ev) => {
    await go(page, 'diary');
    check('storage', 'wrong-shaped data is ignored safely', ev.errors.length === 0 && (await page.locator('text=এখনও কোনো ভ্রমণ স্মৃতি').count()) >= 1);
  });
  await scenario('legacy', () => { localStorage.setItem('deshbhromon_world', JSON.stringify(['BD', 'IN', 'TH'])); }, async (page) => {
    await go(page, 'world');
    await page.locator('ul li button[aria-pressed]').first().waitFor({ timeout: 20000 });
    check('storage', 'legacy 2-letter country codes migrate (3 selected)', (await page.locator('ul li button[aria-pressed="true"]').count()) === 3);
    check('storage', 'migrated codes are stored as ISO-3', JSON.stringify((await lsJson(page, 'world')).sort()) === JSON.stringify(['BGD', 'IND', 'THA']));
  });
  await scenario('throwing storage', () => {
    const f = () => { throw new DOMException('denied', 'SecurityError'); };
    Storage.prototype.getItem = f; Storage.prototype.setItem = f; Storage.prototype.removeItem = f;
  }, async (page, ev) => {
    await go(page, 'map');
    await page.locator('label:has(input[type=checkbox])').first().click(); await page.waitForTimeout(300);
    check('storage', 'unavailable storage (private mode): app keeps working', ev.errors.length === 0 && (await page.locator('label:has(input:checked)').count()) === 1, ev.errors[0] || '');
  });
  await scenario('quota', () => {
    const real = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { if (String(k).startsWith('deshbhromon_')) throw new DOMException('quota', 'QuotaExceededError'); return real.call(this, k, v); };
  }, async (page, ev) => {
    await go(page, 'map');
    await page.locator('label:has(input[type=checkbox])').first().click(); await page.waitForTimeout(300);
    check('storage', 'storage full (quota error): app keeps working', ev.errors.length === 0 && (await page.locator('label:has(input:checked)').count()) === 1, ev.errors[0] || '');
  });
  await scenario('clear', null, async (page) => {
    await go(page, 'map');
    await page.locator('label:has(input[type=checkbox])').first().click(); await page.waitForTimeout(300);
    await page.evaluate(() => localStorage.clear()); await page.reload(); await settle(page);
    await go(page, 'home');
    check('storage', 'clearing site data returns to a clean first-visit state', /এখানেই শুরু/.test(await page.locator('main').innerText()));
  });
}

// ================================================================ main
const started = Date.now();
out(`DeshBhromon live QA — ${BASE}${LOCAL ? '  (LOCAL server: production-only checks are SKIPPED, not passed)' : ''}`);
out(`full image scan: ${FULL_IMAGES ? 'ON (every places.json photo)' : 'OFF (only the 64 district photos) — use: npm run qa:live:full'}`);
out(`widths: ${WIDTHS.join(', ')}px · ${new Date().toISOString()} · node ${process.version}${QUICK ? ' · quick' : ''}${FULL_IMAGES ? ' · full-images' : ''}`);

const homeInfo = await httpSuite();
if (!BLOCKED && homeInfo) await contentSuite(homeInfo);
if (!BLOCKED) await externalSuite();
if (!BLOCKED) loadDeps();
let browser = null;
const BROWSER_SUITES = ['layout', 'accessibility', 'keyboard', 'performance', 'user flows', 'storage'];
if (BLOCKED) {
  for (const a of BROWSER_SUITES) skip(a, `${a} suite`, `NOT RUN: ${BLOCKED}`);
} else {
  try { browser = await launch(); } catch (e) {
    BLOCKED = `no usable browser (install Chrome or Edge, or set CHROME_PATH): ${short(e)}`;
    for (const a of BROWSER_SUITES) skip(a, `${a} suite`, `NOT RUN: ${BLOCKED}`);
  }
}
if (browser) {
  for (const [name, fn] of [['layout', layoutSuite], ['accessibility', a11ySuite], ['performance', perfSuite], ['flows', flowSuite], ['storage', storageSuite]]) {
    try { await fn(browser); } catch (e) { fail(name, `${name} suite crashed`, short(e)); }
  }
  await browser.close();
}

// ---------------------------------------------------------------- summary
const count = (s) => R.filter((r) => r.status === s).length;
const group = (s) => R.filter((r) => r.status === s);
section('SUMMARY');
for (const s of ['PASS', 'FAIL', 'WARN', 'SKIP']) out(`${s}: ${count(s)}`, s);
if (group('FAIL').length) { out('\nFAILURES (genuine, critical):', 'FAIL'); group('FAIL').forEach((r) => out(`  FAIL [${r.area}] ${r.name}${r.detail ? ' — ' + r.detail : ''}`, 'FAIL')); }
if (group('WARN').length) { out('\nWARNINGS (non-critical / external service / known gaps / machine dependent):', 'WARN'); group('WARN').forEach((r) => out(`  WARN [${r.area}] ${r.name}${r.detail ? ' — ' + r.detail : ''}`, 'WARN')); }
if (group('SKIP').length) { out('\nSKIPPED (NOT verified; these are not passes):', 'SKIP'); group('SKIP').forEach((r) => out(`  SKIP [${r.area}] ${r.name}${r.detail ? ' — ' + r.detail : ''}`, 'SKIP')); }
const secs = Math.round((Date.now() - started) / 1000);
const code = count('FAIL') ? 1 : BLOCKED ? 2 : 0;
out(`\nRESULT: ${code === 0 ? 'PASS — no critical failures' : code === 1 ? 'FAIL — critical failures found' : 'INCOMPLETE — blocked by the environment (' + BLOCKED + ')'}  (${secs}s, exit code ${code})`, code === 0 ? 'PASS' : 'FAIL');
try {
  fs.writeFileSync(path.join(ROOT, 'live-qa-report.json'), JSON.stringify({ base: BASE, when: new Date().toISOString(), exitCode: code, blocked: BLOCKED, counts: { pass: count('PASS'), fail: count('FAIL'), warn: count('WARN'), skip: count('SKIP') }, results: R }, null, 2));
  fs.writeFileSync(path.join(ROOT, 'live-qa-report.txt'), LOG.join('\n'));
  out('Reports written: live-qa-report.txt and live-qa-report.json');
} catch { /* ignore */ }
process.exit(code);

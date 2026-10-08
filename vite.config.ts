import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {DISTRICT_DETAILS, toBengaliNumber} from './src/data/bangladesh-data';
import {districtPath, districtSlug} from './src/lib/districtRoutes';
import {DATA as MAP} from './src/data/map-data';
import {nearestDistricts} from './src/lib/nearby';

// Production origin used for canonical URLs, Open Graph, sitemap and robots.txt.
// Set VITE_SITE_URL (e.g. https://deshbhromon.example) or let Vercel supply
// VERCEL_PROJECT_PRODUCTION_URL. With neither, absolute-URL tags are simply omitted.
function resolveSiteUrl(mode: string): string {
  const env = {...process.env, ...loadEnv(mode, process.cwd(), '')};
  const explicit = env.VITE_SITE_URL?.trim();
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = explicit || (vercel ? `https://${vercel}` : '');
  return raw.replace(/\/+$/, '');
}

function seo(siteUrl: string): Plugin {
  return {
    name: 'deshbhromon-seo',
    transformIndexHtml(html) {
      if (!siteUrl) {
        // No known origin: drop tags that must be absolute, keep root-relative images
        return html
          .replace(/^.*(rel="canonical"|property="og:url").*\n/gm, '')
          .replace(/%SITE_URL%/g, '')
          .replace(/^.*%JSON_LD%.*\n/m, '');
      }
      const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'দেশভ্রমণ (DeshBhromon)',
        url: `${siteUrl}/`,
        inLanguage: 'bn',
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Any',
        description: 'বাংলাদেশের ৬৪ জেলার ভ্রমণ মানচিত্র, দর্শনীয় স্থানের গাইড, ট্রিপ প্ল্যানার ও ভ্রমণ ডায়েরি।',
        image: `${siteUrl}/assets/og-image.png`,
        offers: {'@type': 'Offer', price: '0', priceCurrency: 'BDT'},
      });
      return html
        .replace(/%SITE_URL%/g, siteUrl)
        .replace('%JSON_LD%', jsonLd);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`,
      });
      if (siteUrl) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n${Object.keys(DISTRICT_DETAILS).map((id) => `  <url><loc>${siteUrl}${districtPath(id)}</loc></url>\n`).join('')}</urlset>\n`,
        });
      }
    },
  };
}


const esc = (t: unknown) =>
  String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type PlaceSpotLite = {n: string; d?: string};
type PlaceLite = {intro?: string; km?: number; time?: string; food?: string; cost?: string; stay?: string[]; spots?: PlaceSpotLite[]};

// One static page per district (/district/<name>/): own title, description, canonical, Open Graph and readable text,
// so Google and Facebook previews see the district. The app loads on top and opens that district.
function districtPages(siteUrl: string): Plugin {
  let outDir = 'dist';
  return {
    name: 'deshbhromon-district-pages',
    apply: 'build',
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
    },
    closeBundle() {
      const indexFile = path.join(outDir, 'index.html');
      const placesFile = path.resolve('public/places.json');
      if (!fs.existsSync(indexFile) || !fs.existsSync(placesFile)) return;
      const base = fs.readFileSync(indexFile, 'utf8');
      const places = JSON.parse(fs.readFileSync(placesFile, 'utf8')) as Record<string, PlaceLite>;
      const setTag = (html: string, re: RegExp, tag: string) => (re.test(html) ? html.replace(re, tag) : html);

      for (const [id, info] of Object.entries(DISTRICT_DETAILS)) {
        const p = places[id] ?? {};
        const url = siteUrl ? `${siteUrl}${districtPath(id)}` : '';
        const title = `${info.bn} ভ্রমণ গাইড — দর্শনীয় স্থান, যাতায়াত ও খরচ | দেশভ্রমণ`;
        const desc = `${info.bn} জেলার ভ্রমণ গাইড: ${info.fam}। ${p.intro ?? ''} দর্শনীয় স্থান, যাতায়াত, খরচ ও খাবারের তথ্য।`.replace(/\s+/g, ' ').trim();
        const nearby = nearestDistricts(id, MAP.f).filter((n) => DISTRICT_DETAILS[n]);
        const spots = (p.spots ?? []).map((s) => `<li><strong>${esc(s.n)}</strong>${s.d ? ` — ${esc(s.d)}` : ''}</li>`).join('');
        const body = `<main style="max-width:720px;margin:0 auto;padding:24px 16px;line-height:1.7">
<nav><a href="/">দেশভ্রমণ</a> › <a href="/#guide">জেলা গাইড</a></nav>
<h1>${esc(info.bn)} ভ্রমণ গাইড</h1>
<p>${esc(info.dvBn)} বিভাগ · ${esc(info.fam)}</p>
${p.intro ? `<p>${esc(p.intro)}</p>` : ''}
${p.km || p.time ? `<h2>ঢাকা থেকে যাতায়াত</h2><p>${p.km ? `দূরত্ব প্রায় ${esc(toBengaliNumber(p.km))} কিমি` : ''}${p.km && p.time ? ' · ' : ''}${p.time ? `সময় ${esc(p.time)}` : ''}</p>` : ''}
${spots ? `<h2>দর্শনীয় স্থান</h2><ul>${spots}</ul>` : ''}
${p.food ? `<h2>খাবার</h2><p>${esc(p.food)}</p>` : ''}
${p.stay?.length ? `<h2>থাকার ব্যবস্থা</h2><ul>${p.stay.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
${p.cost ? `<h2>আনুমানিক খরচ</h2><p>${esc(p.cost)}</p>` : ''}
${nearby.length ? `<h2>কাছের জেলা</h2><ul>${nearby.map((n) => `<li><a href="${districtPath(n)}">${esc(DISTRICT_DETAILS[n]?.bn ?? n)}</a></li>`).join('')}</ul>` : ''}
<p><a href="/#guide">সব জেলার গাইড ও ভ্রমণ ম্যাপ দেখুন</a></p>
</main>`;
        let html = base;
        html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
        html = setTag(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(desc)}" />`);
        html = setTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(title)}" />`);
        html = setTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(desc)}" />`);
        const ogImg = siteUrl ? `${siteUrl}/assets/og/${districtSlug(id)}.jpg` : `/assets/og/${districtSlug(id)}.jpg`;
        html = setTag(html, /<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${esc(ogImg)}" />`);
        html = setTag(html, /<meta property="og:image:alt" content="[^"]*"\s*\/?>/, `<meta property="og:image:alt" content="${esc(info.bn)} জেলার মানচিত্র ও ভ্রমণ গাইড" />`);
        html = setTag(html, /<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${esc(ogImg)}" />`);
        html = setTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${esc(title)}" />`);
        html = setTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${esc(desc)}" />`);
        if (url) {
          html = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(url)}" />`);
          html = setTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(url)}" />`);
          const ld = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: `${info.bn}, বাংলাদেশ`,
            description: desc,
            url,
            inLanguage: 'bn',
          });
          html = html.replace('</head>', `<script type="application/ld+json">${ld.replace(/</g, '\\u003c')}</script>\n</head>`);
        }
        html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
        const dir = path.join(outDir, districtPath(id));
        fs.mkdirSync(dir, {recursive: true});
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      }
    },
  };
}

export default defineConfig(({mode}) => ({
  plugins: [react(), tailwindcss(), seo(resolveSiteUrl(mode)), districtPages(resolveSiteUrl(mode))],
  build: {
    // Hashed JS/CSS go to /static so vercel.json can give them immutable caching with a simple path pattern
    assetsDir: 'static',
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
}));

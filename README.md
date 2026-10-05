# 🇧🇩 দেশভ্রমণ — DeshBhromon

বাংলাদেশের প্রতিটি জেলা, প্রতিটি গল্প, প্রতিটি ভ্রমণ — এক জায়গায়।

DeshBhromon is a Bangla-first Bangladesh travel companion:

- **হোম** — start here: the real district map lights up the districts you have visited
- **জেলা গাইড** — 64 districts: places, how to get there from Dhaka, approximate costs, food, stays, photos with Wikimedia Commons credits
- **আমার ম্যাপ** — mark visited / wishlist districts, export the map as PNG, JPG or PDF, get a travel certificate
- **ট্রিপ প্ল্যানার**, **ভ্রমণ ডায়েরি**, **ফুড ট্র্যাকার**
- **ঋতু ও নিরাপত্তা** and a short, verified emergency-number list
- **কুইজ** (quiz, photo mystery, food matching, word puzzles)
- **বিশ্ব ভ্রমণ** — 195-country world map tracker

## Local-first

This version has **no backend and no accounts**. Everything you record (visited districts, wishlist, diary,
tasted foods, countries, name, avatar) is stored in your browser's `localStorage` under `deshbhromon_*` keys.
Clearing site data erases it. Cloud sync (accounts, backup, sharing) is a future phase.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run lint
npm test             # unit + data-integrity tests
npm run build        # outputs dist/
npm run check        # typecheck + lint + test + build
```

Stack: Vite 8, React 19, TypeScript 5.9, Tailwind CSS 4, lucide-react, jsPDF (loaded on demand), Vitest, ESLint 10.

> TypeScript is pinned to the 5.9 line because `typescript-eslint` does not support TypeScript 7 yet.

## Deploy (Vercel)

Import the repository in Vercel. The defaults in `vercel.json` apply:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | none required |

`vercel.json` also sets security headers, including a Content-Security-Policy that allows only this site, Wikimedia
Commons photos and the Open-Meteo weather API.

### Site URL (canonical, Open Graph, sitemap)

The build writes `canonical`, `og:url`, absolute `og:image`, JSON-LD, `sitemap.xml` and `robots.txt` from the production
origin. It uses, in order:

1. `VITE_SITE_URL` (e.g. `https://your-domain.example`), if you set it, or
2. `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel provides automatically, or
3. nothing: absolute-URL tags are then simply omitted.

If you add a custom domain later, set `VITE_SITE_URL` to it and redeploy.

## Data and credits

District, food and quiz content lives in `public/places.json` and `src/data/`. Photos come from Wikimedia Commons; every
photo carries its author, licence and source link in `places.json`. Figures such as costs and distances are approximate.
`npm test` includes data-integrity checks (district/division membership, photo credits, quiz answers, puzzle solvability).

### Live QA

`scripts/live-qa.mjs` checks a deployed site end to end: headers (CSP etc.), SEO files, image URLs, per-width overflow,
console/network/CSP errors, fonts, axe accessibility, key user flows, storage scenarios and performance (LCP/CLS).

```bash
npm i --no-save playwright axe-core && npx playwright install chromium
npm run qa:live -- https://deshbhromon.vercel.app
```

To regenerate the social image and 512px icon: `node scripts/make-brand-images.mjs` (needs Playwright with Chromium).

Built by মোঃ হাসিবুল হাসান (Md. Hasibul Hasan).

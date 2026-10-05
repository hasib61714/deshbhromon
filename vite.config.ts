import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

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
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig(({mode}) => ({
  plugins: [react(), tailwindcss(), seo(resolveSiteUrl(mode))],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
}));

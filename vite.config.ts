import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const apiPlugin = (): Plugin => ({
  name: 'api-routes',
  configureServer(server) {
    const scores: Array<{ board: string; name: string; score: number; ms: number; date: number }> = [];
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
      if (url.pathname === '/api/score' && req.method === 'POST') {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            scores.push({ ...data, date: Date.now() });
            const userBoard = scores.filter(s => s.board === data.board);
            userBoard.sort((a, b) => b.score !== a.score ? (b.score || 0) - (a.score || 0) : (a.ms || 0) - (b.ms || 0));
            const rank = Math.max(1, userBoard.findIndex(s => s.name === data.name) + 1);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              ok: true,
              week: { rank, best: { score: data.score || 0, ms: data.ms || 0 } },
              all: { rank, best: { score: data.score || 0, ms: data.ms || 0 } }
            }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'invalid' }));
          }
        });
        return;
      }
      if (url.pathname === '/api/leaderboard' && req.method === 'GET') {
        const board = url.searchParams.get('b') || 'quiz';
        const filtered = scores.filter(s => s.board === board);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ top: filtered.slice(0, 10) }));
        return;
      }
      if (url.pathname === '/api/share' && req.method === 'POST') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ url: 'https://unseenbangladesh.com/#quiz' }));
        return;
      }
      next();
    });
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});


import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';
import { streamChat, ChatError } from './server/chat.mjs';
import { enforceRateLimit, createMemoryStore, RateLimitError } from './server/ratelimit.mjs';

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    enforce: 'post' as const,
    apply: 'build' as const,
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const htmlPath = path.join(distDir, 'index.html');
      let html = fs.readFileSync(htmlPath, 'utf-8');
      const cssLinks = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g);
      if (cssLinks) {
        for (const link of cssLinks) {
          const hrefMatch = link.match(/href="([^"]+)"/);
          if (hrefMatch) {
            const cssPath = path.join(distDir, hrefMatch[1]);
            if (fs.existsSync(cssPath)) {
              const cssContent = fs.readFileSync(cssPath, 'utf-8');
              html = html.replace(link, `<style>${cssContent}</style>`);
              fs.unlinkSync(cssPath);
            }
          }
        }
        fs.writeFileSync(htmlPath, html);
      }
    },
  };
}

// Dev-only middleware that mirrors the Netlify function at /api/chat, so the
// chatbot works with `npm run dev`. The key is read from .env server-side and
// never exposed to the browser bundle.
function chatDevApiPlugin(apiKey: string) {
  // Single dev process → an in-memory counter is enough to mirror prod limits.
  const rateStore = createMemoryStore();

  return {
    name: 'chat-dev-api',
    apply: 'serve' as const,
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }
        let raw = '';
        req.on('data', (chunk) => (raw += chunk));
        req.on('end', async () => {
          try {
            const forwarded = req.headers['x-forwarded-for'];
            const ip =
              (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
              req.socket.remoteAddress ||
              'unknown';
            await enforceRateLimit({ ip, store: rateStore });

            const { messages } = JSON.parse(raw || '{}');
            const stream = await streamChat({ messages, apiKey });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            const reader = stream.getReader();
            const decoder = new TextDecoder();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(decoder.decode(value));
            }
            res.end();
          } catch (err) {
            const status = err instanceof ChatError ? err.status : 500;
            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            if (err instanceof RateLimitError) res.setHeader('Retry-After', String(err.retryAfter));
            const message =
              err instanceof ChatError && status < 500
                ? err.message
                : 'Chat is temporarily unavailable.';
            res.end(JSON.stringify({ error: message }));
            if (status >= 500) server.config.logger.error(`[chat] ${String(err)}`);
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load .env (including non-VITE_ vars) at config time; keep server-side only.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), inlineCssPlugin(), chatDevApiPlugin(env.DEEPSEEK_API_KEY)],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: { port: 5173 },
  };
});

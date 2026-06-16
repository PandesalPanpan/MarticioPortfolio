import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import fs from 'node:fs';

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

export default defineConfig({
  plugins: [react(), inlineCssPlugin()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 5173 },
});

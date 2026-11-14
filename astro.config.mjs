// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://github.io',
  base: '/Centry_AI',
  devToolbar: { enabled: false },
  // Poll for file changes so edits made from Claude's workspace hot-reload too
  vite: { server: { watch: { usePolling: true, interval: 300 } } },
});

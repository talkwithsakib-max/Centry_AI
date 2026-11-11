// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://centry.ai', // TODO: confirm production domain
  devToolbar: { enabled: false },
});

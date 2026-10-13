import { defineConfig } from 'astro/config';

// The output is ordinary HTML, CSS and JS. Cloudflare Pages serves dist/.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});

import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { articleMarkdown } from './src/lib/article-markdown.js';

// The output is ordinary HTML, CSS and JS. Cloudflare Pages serves dist/.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: {
    processor: satteri({ features: { gfm: true }, hastPlugins: [articleMarkdown] }),
  },
});

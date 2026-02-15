import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seoPrerender from 'vite-plugin-seo-prerender'

export default defineConfig({
  plugins: [
    react(),
    seoPrerender({
      routes: [
        '/',
        '/blog',
        '/blog/piwi-and-the-agentic-economy',
        '/blog/building-piwi-ai',
        '/about',
      ],
      delay: 1000,
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    }),
  ],
  base: '/',
  build: {
    outDir: 'dist',
  },
  assetsInclude: ['**/*.md'],
})

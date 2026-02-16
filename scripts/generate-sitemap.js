#!/usr/bin/env node

/**
 * Sitemap & route generator.
 *
 * Reads src/data/posts.json and:
 *  1. Writes public/sitemap.xml
 *  2. Updates the `routes` array inside vite.config.js
 *
 * Run:  node scripts/generate-sitemap.js
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const SITE = 'https://adrianweb.xyz'
const TODAY = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

// ── 1. Read posts ───────────────────────────────────────────────────────
const posts = JSON.parse(
    readFileSync(resolve(ROOT, 'src/data/posts.json'), 'utf-8'),
)

// ── 2. Define all routes ────────────────────────────────────────────────
const staticRoutes = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/blog', changefreq: 'weekly', priority: '0.8' },
    { path: '/about', changefreq: 'monthly', priority: '0.7' },
]

const postRoutes = posts.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p.date,
    changefreq: 'monthly',
    priority: '0.9',
}))

const allRoutes = [...staticRoutes, ...postRoutes]

// ── 3. Generate sitemap.xml ─────────────────────────────────────────────
function buildSitemap(routes) {
    const urls = routes
        .map((r) => {
            const lastmod = r.lastmod ? `\n        <lastmod>${r.lastmod}</lastmod>` : ''
            return `    <url>
        <loc>${SITE}${r.path}</loc>${lastmod}
        <changefreq>${r.changefreq}</changefreq>
        <priority>${r.priority}</priority>
    </url>`
        })
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

const sitemapPath = resolve(ROOT, 'public/sitemap.xml')
writeFileSync(sitemapPath, buildSitemap(allRoutes), 'utf-8')
console.log(`✅  sitemap.xml → ${allRoutes.length} URLs`)

// ── 4. Update vite.config.js routes array ───────────────────────────────
const viteConfigPath = resolve(ROOT, 'vite.config.js')
let viteConfig = readFileSync(viteConfigPath, 'utf-8')

const routesList = allRoutes.map((r) => `        '${r.path}',`).join('\n')
const newRoutes = `routes: [\n${routesList}\n      ]`

// Replace the existing routes: [...] block
viteConfig = viteConfig.replace(
    /routes:\s*\[[\s\S]*?\]/,
    newRoutes,
)

writeFileSync(viteConfigPath, viteConfig, 'utf-8')
console.log(`✅  vite.config.js routes updated (${allRoutes.length} routes)`)

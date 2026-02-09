import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://primos.mat.br';
const PUBLIC_DIR = path.resolve(__dirname, '../public');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

const pages = [
  { url: '/', priority: '1.0', freq: 'daily' },
  { url: '/sobre.html', priority: '0.8', freq: 'monthly' },
  { url: '/privacidade.html', priority: '0.5', freq: 'yearly' },
  { url: '/termos.html', priority: '0.5', freq: 'yearly' }
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots);

console.log('✅ Sitemap and Robots.txt generated successfully!');

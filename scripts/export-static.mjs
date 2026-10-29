// Exporta dist/client a una versión que se abre sin servidor (doble clic):
// estilos y scripts incrustados en cada página, enlaces relativos y logo embebido.
// Uso: npm run build && node scripts/export-static.mjs [carpeta-salida]
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('dist/client');
const OUT = path.resolve(process.argv[2] ?? 'dist/html');
fs.rmSync(OUT, { recursive: true, force: true });

const pages = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== '_astro' && f !== 'oportunidades') walk(p); }
    else if (f.endsWith('.html')) pages.push(p);
  }
};
walk(SRC);

const bundleCache = new Map();
async function bundle(file) {
  if (!bundleCache.has(file)) {
    const r = await build({ entryPoints: [file], bundle: true, format: 'iife', minify: true, write: false, logLevel: 'silent' });
    bundleCache.set(file, r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script'));
  }
  return bundleCache.get(file);
}
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const dataUri = (abs) => `data:${mime[path.extname(abs)]};base64,${fs.readFileSync(abs).toString('base64')}`;

for (const page of pages) {
  const rel = path.relative(SRC, page);
  const depth = rel.split(path.sep).length - 1;
  const up = depth ? '../'.repeat(depth) : './';
  let html = fs.readFileSync(page, 'utf8');

  // Estilos externos → <style>
  html = html.replace(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)"[^>]*>/g, (_, href) => `<style>${fs.readFileSync(path.join(SRC, href))}</style>`);
  // Scripts de módulo → IIFE incrustado (los módulos no cargan desde file://)
  const scripts = [...html.matchAll(/<script type="module" src="(\/_astro\/[^"]+\.js)"><\/script>/g)];
  for (const m of scripts) html = html.replace(m[0], `<script>${await bundle(path.join(SRC, m[1]))}</script>`);
  const inline = [...html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)];
  for (const m of inline) {
    const tmp = path.join(SRC, '_astro', `__inline_${Math.random().toString(36).slice(2)}.js`);
    fs.writeFileSync(tmp, m[1].replace(/from\s*"\/_astro\//g, 'from "./'));
    const code = await bundle(tmp); fs.rmSync(tmp);
    html = html.replace(m[0], () => `<script>${code}</script>`);
  }
  // Imágenes del sitio → data URI
  html = html.replace(/(src|href)="(\/(?:brand|images)\/[^"]+\.(?:png|jpg|webp|svg)|\/favicon\.svg)"/g, (_, a, p) => `${a}="${dataUri(path.join(SRC, p))}"`);
  // Enlaces internos absolutos → relativos a index.html
  html = html.replace(/href="\/(?!\/)([^"#?]*)([^"]*)"/g, (_, p, rest) => {
    if (p.startsWith('oportunidades')) p = 'asesoria/';
    if (/\.[a-z0-9]+$/i.test(p)) return `href="${up}${p}${rest}"`;
    const dir = p.replace(/\/$/, '');
    return `href="${up}${dir ? dir + '/' : ''}index.html${rest}"`;
  });
  html = html.replace(/href="#/g, 'href="#'); // anclas sin cambio
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}
fs.copyFileSync(path.join(SRC, 'og-default.png'), path.join(OUT, 'og-default.png'));
console.log(`Exportadas ${pages.length} páginas en ${OUT}`);

// Gera HTML estático completo a partir do build SSR e o injeta em dist/index.html.
// Também escreve sitemap.xml e robots.txt com a URL definida em VITE_SITE_URL.
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const ssrEntry = resolve(root, "dist-ssr/entry-server.js");

const { render } = await import(pathToFileURL(ssrEntry).href);
const { html, head } = render();

// Pré-carrega a fonte do título (latin) para acelerar o LCP.
const base = process.env.BASE ?? "/";
const font = readdirSync(resolve(dist, "assets")).find((f) => /^geist-latin-wght-normal.*\.woff2$/.test(f));
const preload = font ? `<link rel="preload" href="${base}assets/${font}" as="font" type="font/woff2" crossorigin />` : "";

const indexPath = resolve(dist, "index.html");
const template = readFileSync(indexPath, "utf8");
const out = template.replace("<!--head-->", `${head}\n    ${preload}`).replace("<!--app-->", html);
writeFileSync(indexPath, out);

const site = (process.env.VITE_SITE_URL ?? "https://axion-sites.lovable.app").replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><lastmod>${today}</lastmod></url>\n</urlset>\n`,
);
writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerender: ${(out.length / 1024).toFixed(1)} KB de HTML, fonte pré-carregada: ${font ?? "nenhuma"}`);

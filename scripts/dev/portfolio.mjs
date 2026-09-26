// Captura a primeira dobra dos sites do portfólio (desktop 1440x900 e mobile 390x844)
// e gera WebP otimizados em public/portfolio. Requer ImageMagick (`magick`) no PATH.
// Uso: node scripts/dev/portfolio.mjs [id...]
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sites = [
  { id: "automax", url: "https://automaxsolution.com.br/" },
  { id: "gireh", url: "https://girehv2.vercel.app/" },
  { id: "vitta-reale", url: "https://vitta-reale.lovable.app/" },
];
const only = process.argv.slice(2);
const out = "public/portfolio";
const tmp = join(tmpdir(), "axion-portfolio");
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

const shapes = {
  // Desktop capturado em 2x e reduzido para 1600px: texto nítido em telas retina.
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, resize: "1600x", isMobile: false },
  // Mobile em 2x (780x1688) reduzido para 600px de largura: suficiente para a moldura (~200px CSS).
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, resize: "600x", isMobile: true, hasTouch: true },
};

const browser = await chromium.launch();
for (const site of sites.filter((s) => !only.length || only.includes(s.id))) {
  for (const [kind, shape] of Object.entries(shapes)) {
    const { resize, ...ctxOpts } = shape;
    const ctx = await browser.newContext({ ...ctxOpts, locale: "pt-BR" });
    const page = await ctx.newPage();
    try {
      const res = await page.goto(site.url, { waitUntil: "networkidle", timeout: 45_000 });
      if (!res || !res.ok()) throw new Error(`HTTP ${res?.status()}`);
      await page.waitForTimeout(4000); // animações de entrada
      const png = join(tmp, `${site.id}-${kind}.png`);
      await page.screenshot({ path: png });
      const webp = join(out, `${site.id}-${kind}.webp`);
      execFileSync("magick", [png, "-resize", resize, "-strip", "-quality", "80", "-define", "webp:method=6", webp]);
      console.log("ok", webp);
    } catch (e) {
      console.error("FALHOU", site.id, kind, e.message);
    }
    await ctx.close();
  }
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });

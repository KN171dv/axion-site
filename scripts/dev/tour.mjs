import { chromium } from "@playwright/test";
const w = Number(process.env.W ?? 1440), h = Number(process.env.H ?? 900);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(4200);
await page.mouse.move(w * 0.3, h * 0.4);
const n = Number(process.env.N ?? 16), step = Number(process.env.STEP ?? 800);
for (let i = 0; i < n; i++) {
  await page.screenshot({ path: `/home/claude/shots/tour-${i}.png` });
  for (let k = 0; k < step / 200; k++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(40); }
  await page.waitForTimeout(1300);
}
await browser.close();

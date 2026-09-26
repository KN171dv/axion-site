import { chromium } from "@playwright/test";
const w = Number(process.env.W ?? 1440), h = Number(process.env.H ?? 900);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(process.env.URL ?? "http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.mouse.move(w / 2, h / 2);
const start = await page.evaluate(() => document.querySelector("#portfolio").getBoundingClientRect().top + scrollY);
// rola por roda até o início da seção
let y = 0;
while (y < start + Number(process.env.FROM ?? 600)) { await page.mouse.wheel(0, 500); y += 500 * 0.9; await page.waitForTimeout(60); }
await page.waitForTimeout(1200);
for (let i = 0; i < Number(process.env.N ?? 5); i++) {
  await page.screenshot({ path: `/home/claude/shots/wheel-${i}.png` });
  const info = await page.evaluate(() => ({ y: Math.round(scrollY), c: document.querySelector(".st-counter")?.textContent, tr: getComputedStyle(document.querySelector(".st-track")).transform }));
  console.log(i, JSON.stringify(info));
  for (let k = 0; k < 4; k++) { await page.mouse.wheel(0, 250); await page.waitForTimeout(60); }
  await page.waitForTimeout(1400);
}
await browser.close();

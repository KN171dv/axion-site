import { chromium } from "@playwright/test";
const url = process.env.URL ?? "http://localhost:4173/";
const widths = (process.env.W ?? "1440").split(",").map(Number);
const full = process.env.FULL === "1";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (const w of widths) {
  const h = w < 768 ? 844 : 900;
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: process.env.RM === "1" ? "reduce" : "no-preference" });
  const errors = [];
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.type() + ": " + m.text()));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(Number(process.env.WAIT ?? 4500));
  if (full) {
    // rola até o fim para disparar reveals
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 400) { await page.mouse.wheel(0, 400); await page.waitForTimeout(120); }
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
  }
  const ov = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, h: document.documentElement.scrollHeight }));
  await page.screenshot({ path: `/home/claude/shots/${process.env.NAME ?? "shot"}-${w}.png`, fullPage: full });
  console.log(w, JSON.stringify(ov), errors.slice(0, 8).join(" | "));
  await page.close();
}
await browser.close();

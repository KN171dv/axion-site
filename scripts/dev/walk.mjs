import { chromium } from "@playwright/test";
const w = Number(process.env.W ?? 1440), h = Number(process.env.H ?? 900);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: process.env.TOUCH === "1", isMobile: process.env.TOUCH === "1" });
const errors = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
await page.goto(process.env.URL ?? "http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const stops = (process.env.STOPS ?? "").split(",").filter(Boolean);
let i = 0;
for (const sel of stops) {
  // sel pode ser um seletor + deslocamento: "#estudos@1200"
  const [s, off] = sel.split("@");
  const y = await page.evaluate(([s, off]) => { const el = document.querySelector(s); return (el ? el.getBoundingClientRect().top + scrollY : 0) + Number(off || 0); }, [s, off]);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `/home/claude/shots/walk-${w}-${i++}.png` });
}
console.log("errors:", errors.join(" | ") || "none");
await browser.close();

import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
const svg = readFileSync("public/favicon.svg", "utf8");
const font = readFileSync("node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2").toString("base64");
const mono = readFileSync("node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2").toString("base64");
const css = `@font-face{font-family:G;src:url(data:font/woff2;base64,${font})}@font-face{font-family:M;src:url(data:font/woff2;base64,${mono})}*{margin:0}body{background:#0b0c0e}`;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(`<style>${css}
.og{width:1200px;height:630px;position:relative;color:#ece9e2;font-family:G;overflow:hidden;
background-image:linear-gradient(to right,rgb(236 233 226/.06) 1px,transparent 1px),linear-gradient(to bottom,rgb(236 233 226/.06) 1px,transparent 1px);background-size:60px 60px}
.glow{position:absolute;right:-200px;top:-100px;width:800px;height:800px;background:radial-gradient(closest-side,rgb(59 123 255/.22),transparent)}
.logo{position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:16px;font-weight:600;letter-spacing:.14em;font-size:28px}
.logo svg{width:44px;height:44px}
h1{position:absolute;left:72px;bottom:120px;font-size:96px;font-weight:560;letter-spacing:-.045em;line-height:.95}
h1 span{color:#3b7bff}
p{position:absolute;left:72px;bottom:64px;font-family:M;font-size:20px;letter-spacing:.08em;text-transform:uppercase;color:#a3a39e}
</style><div class="og"><div class="glow"></div><div class="logo">${svg}AXION</div><h1>Sites feitos para trabalhar<br>pela sua empresa<span>.</span></h1><p>Criação de sites para empresas · Proposta em até 24h</p></div>`);
await p.waitForTimeout(300);
await p.screenshot({ path: "public/og.png" });
for (const [size, name, pad, bg] of [[32,"favicon-32.png",2,"transparent"],[180,"apple-touch-icon.png",30,"#0b0c0e"],[512,"icon-512.png",90,"#0b0c0e"]]) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(`<style>*{margin:0}body{background:${bg}}div{width:${size}px;height:${size}px;display:grid;place-items:center}svg{width:${size-pad*2}px;height:${size-pad*2}px}</style><div>${svg}</div>`);
  await p.screenshot({ path: "public/" + name, omitBackground: bg === "transparent" });
}
await b.close();

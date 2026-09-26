import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Axion — site", () => {
  test("carrega sem erros de console e com metadados de SEO", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveTitle(/Axion/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{80,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(2);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test("HTML pré-renderizado já contém o conteúdo (SEO sem JS)", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("Sites feitos");
    expect(html).toContain("Quatro formatos.");
    expect(html).toContain("Quanto custa um site?");
  });

  for (const width of [320, 375, 390, 430, 768, 1280, 1440, 1920]) {
    test(`sem overflow horizontal em ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
      expect(sw).toBeLessThanOrEqual(iw);
    });
  }

  test("âncoras internas apontam para seções existentes e links externos são seguros", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.$$eval("a[href^='#']", (as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    for (const h of hrefs) expect(await page.locator(h).count(), h).toBe(1);
    const unsafe = await page.$$eval("a[target=_blank]", (as) => as.filter((a) => !/noopener/.test(a.getAttribute("rel") ?? "")).length);
    expect(unsafe).toBe(0);
  });

  test("acessibilidade: sem violações sérias (axe)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    await ctx.close();
  });

  test("reduced motion: todo o conteúdo visível sem animação", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/motion-ok/);
    await expect(page.locator("#hero-title")).toBeVisible();
    const hidden = await page.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity === "0").length);
    expect(hidden).toBe(0);
    await ctx.close();
  });

  test("formulário valida o nome e abre o WhatsApp com a mensagem montada", async ({ page, context }) => {
    await page.goto("/");
    const form = page.locator("#contato form");
    await form.getByRole("button", { name: /Enviar pelo WhatsApp/ }).click();
    await expect(form.getByRole("alert")).toBeVisible();

    await form.getByLabel("Nome").fill("Maria");
    await form.getByRole("textbox", { name: /Empresa/ }).fill("Ateliê M");
    await form.getByText("Landing Page", { exact: true }).click();
    // Intercepta o wa.me para não depender de rede externa.
    let opened = "";
    await context.route("https://wa.me/**", (route) => {
      opened = route.request().url();
      return route.fulfill({ status: 200, body: "ok" });
    });
    await Promise.all([context.waitForEvent("page"), form.getByRole("button", { name: /Enviar pelo WhatsApp/ }).click()]);
    await expect.poll(() => opened).not.toBe("");
    const url = decodeURIComponent(opened);
    expect(url).toContain("5521980390477");
    expect(url).toContain("Maria, da Ateliê M");
    expect(url).toContain("Landing Page");
  });

  test("menu móvel abre, navega e fecha com Esc", async ({ page, isMobile }) => {
    test.skip(!isMobile, "apenas mobile");
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await dialog.getByRole("link", { name: /Processo/ }).click();
    await expect(dialog).toBeHidden();
  });

  test("FAQ é um acordeão acessível", async ({ page }) => {
    await page.goto("/");
    const q = page.getByRole("button", { name: "Quanto tempo leva?" });
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.click();
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/em até 7 dias, conforme o formato/)).toBeVisible();
  });
});

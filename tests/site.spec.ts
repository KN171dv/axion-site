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
    expect(html).toContain("Sites no ar,");
    expect(html).not.toContain("Não representam clientes");
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

test.describe("portfólio", () => {
    const expected = [
      { name: "Automax Solution", url: "https://automaxsolution.com.br/" },
      { name: "Gireh Barber Shop", url: "https://girehv2.vercel.app/" },
      { name: "Clínica Vitta Reale", url: "https://vitta-reale.lovable.app/" },
    ];

    test("mostra os 3 projetos reais com link seguro para o site ao vivo", async ({ page }) => {
      await page.goto("/");
      const section = page.locator("#portfolio");
      await expect(section.getByRole("heading", { level: 2 })).toContainText("Sites no ar");
      await expect(section.locator("article")).toHaveCount(3);
      for (const p of expected) {
        const article = section.locator("article", { has: page.getByRole("heading", { name: p.name, exact: true }) });
        const link = article.getByRole("link", { name: /Ver site ao vivo/ });
        await expect(link).toHaveAttribute("href", p.url);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAttribute("rel", /noreferrer/);
      }
      // O menu e o rodapé apontam para a seção nova
      await expect(page.locator('footer a[href="#portfolio"]')).toHaveCount(1);
      await expect(page.locator('a[href="#estudos"]')).toHaveCount(0);
    });

    test("imagens do portfólio existem, são lazy e carregam", async ({ page, request }) => {
      await page.goto("/");
      const imgs = page.locator("#portfolio img");
      await expect(imgs).toHaveCount(6);
      const attrs = await imgs.evaluateAll((els) =>
        (els as HTMLImageElement[]).map((i) => ({
          src: i.getAttribute("src")!,
          alt: i.alt,
          loading: i.loading,
          decoding: i.decoding,
          w: i.getAttribute("width"),
          h: i.getAttribute("height"),
        })),
      );
      for (const a of attrs) {
        expect(a.src).toMatch(/^\/portfolio\/.+\.webp$/);
        expect(a.alt.length).toBeGreaterThan(10);
        expect(a.loading).toBe("lazy");
        expect(a.decoding).toBe("async");
        expect(Number(a.w)).toBeGreaterThan(0);
        expect(Number(a.h)).toBeGreaterThan(0);
        const res = await request.get(a.src);
        expect(res.status(), a.src).toBe(200);
        expect(res.headers()["content-type"]).toContain("image/webp");
      }
      // Ao entrar na tela, cada imagem decodifica de verdade
      for (let i = 0; i < 6; i++) {
        const img = imgs.nth(i);
        await img.evaluate((el) => el.scrollIntoView({ block: "center", inline: "center" }));
        await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
    });
  });

  test("Depoimentos não aparece enquanto não houver depoimento real", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#depoimentos")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Depoimentos/i })).toHaveCount(0);
    // A numeração dos rótulos não pula número
    const labels = (await page.locator("section p.label span.tabular").allTextContents()).filter((t) => /^\[\d+\]$/.test(t));
    expect(labels).toEqual(["[01]", "[02]", "[03]", "[04]", "[05]", "[06]", "[07]"]);
  });

  test("Garantias aparece entre Processo e Dúvidas com os 4 compromissos", async ({ page }) => {
    await page.goto("/");
    const ids = await page.$$eval("main > section[id]", (els) => els.map((e) => e.id));
    expect(ids.indexOf("garantias")).toBe(ids.indexOf("processo") + 1);
    expect(ids.indexOf("duvidas")).toBe(ids.indexOf("garantias") + 1);
    const section = page.locator("#garantias");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section.locator("li")).toHaveCount(4);
    for (const t of ["Proposta em até 24h", "layout antes do código", "Ajustes até ficar como combinado", "Suporte depois do lançamento"]) {
      await expect(section.getByText(t)).toBeVisible();
    }
  });

  test("3D: planta do hero vira vista explodida ao rolar (desktop com mouse)", async ({ page, isMobile }) => {
    test.skip(isMobile, "3D só em desktop com mouse");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2500);
    const flat = await page.locator(".bp-stack").evaluate((el) => getComputedStyle(el).transform);
    expect(flat === "none" || !flat.startsWith("matrix3d")).toBe(true);
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(80);
    }
    await expect.poll(() => page.locator(".bp-layer").last().evaluate((el) => getComputedStyle(el).transform)).toMatch(/^matrix3d/);
  });

  test("3D: mockups do portfólio inclinam com o mouse (desktop)", async ({ page, isMobile }) => {
    test.skip(isMobile, "inclinação só com mouse");
    // Página nova: depois de rolar com a roda, o Lenis desfaria o scrollIntoView.
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const mock = page.locator("#portfolio [data-tilt]").first();
    await mock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // scroll suave + scrub assentarem
    const box = (await mock.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.2, { steps: 8 });
    await expect.poll(() => mock.locator(".pf-tilt").evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  });

  test("reduced motion: nada em 3D, nem ao rolar nem com o mouse", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(300);
    const mock = page.locator("#portfolio .pf-tilt").first();
    await mock.scrollIntoViewIfNeeded();
    const box = (await mock.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1, { steps: 5 });
    await page.waitForTimeout(400);
    const transforms = await page.$$eval(".bp-stack, .bp-layer, .bp-tag, .pf-tilt, .pf-phone, .hero-visual", (els) =>
      els.map((e) => getComputedStyle(e).transform),
    );
    expect(transforms.length).toBeGreaterThan(0);
    for (const t of transforms) expect(t === "none" || !t.startsWith("matrix3d")).toBe(true);
    expect(await page.locator("[data-tilt]").count()).toBe(0);
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

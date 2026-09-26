# Axion — site institucional

Site da Axion (estúdio de criação de sites). Página única, pré-renderizada em HTML estático e hidratada com React.

- **Stack:** Vite 8 · React 19 · TypeScript · Tailwind CSS 4
- **Motion:** GSAP + ScrollTrigger (timelines e scroll), Motion (menu, acordeão, microinterações), Lenis (scroll suave só em desktop com mouse)
- **Fontes:** Geist e Geist Mono, auto-hospedadas via Fontsource (sem Google Fonts)
- **Sem backend:** o formulário monta a mensagem e abre o WhatsApp

A auditoria do site antigo e as decisões de design estão em [`docs/AUDITORIA-E-DIRECAO.md`](docs/AUDITORIA-E-DIRECAO.md).

## Rodar localmente

Requisitos: Node 20.19+ (recomendado 22) e npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Build de produção:

```bash
cp .env.example .env    # ajuste VITE_SITE_URL para o domínio final
npm run build           # typecheck + build + pré-renderização
npm run preview         # serve dist/ em http://localhost:4173
```

`npm run build` gera `dist/` com `index.html` já contendo todo o conteúdo (bom para SEO), `sitemap.xml` e `robots.txt`. Qualquer hospedagem estática serve (Vercel, Netlify, Cloudflare Pages, a própria Lovable).

## Testes

```bash
npx playwright install chromium   # primeira vez
npm run build
npm run test:e2e
```

Cobrem: erros de console, metadados de SEO, HTML pré-renderizado, overflow horizontal em 320–1920px, âncoras e links externos, acessibilidade (axe, WCAG AA), reduced motion (inclusive sem transforms 3D), portfólio (links e imagens), Garantias, Depoimentos oculto quando vazio, 3D no desktop, formulário → WhatsApp, menu móvel e FAQ.

## Estrutura

```
src/
  content/site.ts        ← TODOS os textos, serviços, FAQ, contatos. Edite aqui.
  sections/              ← uma seção por arquivo (Hero, Manifesto, Services, Portfolio, Testimonials, Process, Guarantees, Faq, Contact)
  components/            ← Header, Footer, Button, Logo, ícones, rótulos
  hooks/                 ← GSAP com escopo/limpeza, reveal por atributo, Lenis
  lib/motion.ts          ← registro do GSAP, curvas e checagens de reduced-motion/ponteiro
  lib/head.ts            ← <head>: title, OG, Twitter, canonical, JSON-LD (ProfessionalService + FAQPage)
  styles/index.css       ← tokens de design (cores, fontes, curvas) e utilitários
  entry-server.tsx       ← render para a pré-renderização
scripts/prerender.mjs    ← injeta o HTML e o <head> no build; gera sitemap/robots
scripts/dev/             ← utilitários de QA (screenshots, tour de scroll, geração de OG/ícones)
scripts/dev/portfolio.mjs ← recaptura os screenshots do portfólio (Playwright + ImageMagick)
public/portfolio/        ← screenshots WebP dos sites do portfólio
tests/                   ← Playwright
```

### Animações
- Elementos com `data-reveal` entram ao rolar; `data-reveal="lines"` revela títulos linha a linha (componente `RevealLines`).
- O estado inicial "escondido" só existe com a classe `motion-ok` no `<html>`, adicionada antes da pintura. Sem JS, com `prefers-reduced-motion` ou se o JS atrasar mais de 4s, tudo aparece normalmente.
- Scroll horizontal do Portfólio só acontece em telas ≥1024px de largura e ≥640px de altura; no mobile é uma pilha vertical.
- O texto do hero entra por keyframes CSS (`index.css`), sem depender do JS; a montagem da planta é GSAP.
- **3D (CSS transforms, sem WebGL), só em desktop com mouse:** a planta do hero tem 3 camadas (wireframe, design, código) que se separam em profundidade ao rolar para fora do hero; os mockups do portfólio inclinam até 6° seguindo o cursor (mola do Motion), com o celular num plano à frente. Mobile, touch e `prefers-reduced-motion` ficam planos. Nada roda em loop e `will-change` só fica ativo durante o movimento.

### Portfólio, depoimentos e numeração
- Projetos em `projects` (`content/site.ts`). `result` só deve ser preenchido com dado real confirmado pelo cliente.
- Para trocar/atualizar imagens, rode `node scripts/dev/portfolio.mjs [id]` (captura 1440×900 e 390×844 em 2x, salva WebP q80).
- Depoimentos: array `testimonials`. Vazio = a seção não existe no HTML. Somente depoimentos reais, com autorização por escrito.
- Os rótulos [01], [02]… vêm de `sectionIndex()` e se ajustam quando Depoimentos aparece.

## Lovable → GitHub → VS Code

Este projeto é uma reconstrução completa e independente da Lovable (não há dependências ou plugins da Lovable).

1. **Crie um repositório** no GitHub (ex.: `axion-site`). Se o projeto antigo já estiver conectado a um repositório pela Lovable, use-o numa branch nova (`redesign`) para preservar o histórico.
2. Envie este código:
   ```bash
   git remote add origin git@github.com:SEU-USUARIO/axion-site.git
   git push -u origin main          # ou: git push -u origin main:redesign
   ```
3. Abra a pasta no VS Code e rode `npm install`.
4. Para publicar: conecte o repositório a Vercel/Netlify/Cloudflare Pages (build `npm run build`, saída `dist`) e defina `VITE_SITE_URL` nas variáveis de ambiente.

## Pendências (precisam da Axion)

- [ ] **Condição para primeiros clientes:** preencher `firstClients.condition` em `src/content/site.ts` (`TODO(axion)`). Enquanto estiver vazio, o bloco no Contato convida a perguntar no WhatsApp.
- [ ] **Depoimentos:** quando houver, com autorização por escrito, adicionar em `testimonials` (use `projectId` para ligar ao portfólio). A seção aparece sozinha.
- [ ] **Resultados do portfólio:** o campo `result` de cada projeto está vazio. Preencha só com números reais e autorizados.
- [ ] **Permissão dos clientes do portfólio:** confirmar por escrito que Automax, Gireh e Vitta Reale autorizam aparecer no site.
- [ ] **Screenshots:** recapturar (`node scripts/dev/portfolio.mjs`) quando os sites dos clientes mudarem. O título "Excelência" no site da Vitta Reale tem o acento deslocado (problema de fonte no próprio site deles) — vale avisar o cliente.
- [ ] **Lighthouse mobile ≥ 90:** medir no domínio publicado (PageSpeed Insights). Localmente (Windows, `vite preview`) o resultado oscila muito: 64–81 no código anterior a estas mudanças e 72–77 no atual, com a mesma causa (tempo de CPU simulado em aparelho lento), não as imagens — elas são lazy e não entram no carregamento inicial.
- [ ] **E-mail:** `contato@axion.com` veio do site antigo, mas o domínio axion.com provavelmente não é da Axion. Confirme em `src/content/site.ts`.
- [ ] **Domínio final:** definir `VITE_SITE_URL` (canonical, OG, sitemap usam esse valor).
- [ ] **Promessas comerciais:** "entrega em até 7 dias", "proposta em até 24h", suporte após o lançamento e "ajustes até ficar como combinado" (seção Garantias). Confirme que continuam válidas.
- [ ] Atualizar o ano do rodapé (`components/Footer.tsx`) anualmente.

# Axion — Auditoria do site atual e direção do redesign

Auditoria feita em 26/09/2026 em https://axion-sites.lovable.app/ (Chrome, desktop 1568px + viewport mobile 390px, HTML servido, links, imagens, meta tags).

## 1. Auditoria

### O que o site é hoje
Uma landing page única (SSR, TanStack/Lovable) com 8 seções: Hero → Benefícios (6 cards) → Serviços (4 cards de plano) → Portfólio (3 cards) → Processo (4 passos) → Sobre (+ números) → Depoimentos (3 cards) → CTA → Footer. Todos os CTAs levam ao WhatsApp.

### Direção de arte — "intencional ou gerado?"
| Seção | Veredito | Por quê |
|---|---|---|
| Header | Genérico | Nav centralizada + ícones + pill com glow: o layout padrão de qualquer template. Fundo translúcido deixa o conteúdo "vazar" por trás ao rolar. |
| Hero | Gerado | Fundo é uma imagem de stock/IA (notebook + celular com texto ilegível "Wircher Snorre Selenft"), escurecida até quase sumir. Título em gradiente azul, badge "Software house premium", 2 botões, 3 checks — a fórmula exata de landing de IA. Nada ali é da Axion. |
| Benefícios | Gerado | 6 cards idênticos (ícone em quadrado azul + título + frase). Nenhuma informação que o cliente não assumiria. |
| Serviços | Parcialmente útil | O conteúdo (4 formatos) é a informação mais valiosa do site, mas vira mais uma grade de cards com glow, badge "🏆 Mais escolhido" e 4 botões iguais. |
| Portfólio | Problemático | As 3 imagens são mockups gerados por IA com texto sem sentido ("AUTIO HINGEESE", "Vefoyea Horth Umant"). "Ver Projeto" não é link; "Ver mais" leva ao contato. Para uma agência, isso destrói credibilidade. |
| Processo | Genérico | 4 cards numerados. OK em conteúdo, sem ritmo visual. |
| Sobre | Gerado | Números não verificáveis (+50, 98%, 24/7) e 4 "valores" (Confiança, Inovação…) em cards vazios com ícone placeholder. |
| Depoimentos | Fictícios | Confirmado pelo cliente: são exemplos. Precisam sair. |
| CTA / Footer | Genérico | Card com gradiente; footer em 3 colunas padrão. |

Resumo: a paleta azul-neon + glow + cards + gradiente em texto em **todas** as seções cria monotonia (a página inteira tem o mesmo "volume") e o visual que o público já reconhece como "feito por IA".

### UX / conversão
- A proposta é clara ("sites para empresas"), mas não há diferencial concreto: todo concorrente diz "moderno, rápido, profissional".
- 10+ botões "Solicitar orçamento" idênticos, todos abrindo WhatsApp **sem mensagem pré-preenchida** — o lead chega sem contexto.
- Nenhuma resposta às objeções reais (quanto custa, quanto demora, o que está incluso, e depois?).
- Benefícios e Serviços repetem as mesmas ideias.
- Seções animadas ficam **invisíveis** até o reveal disparar; ao pular via âncora, grandes áreas pretas aparecem.

### Frontend / técnico
- `<html lang="en">` num site em português → o Chrome oferece/aplica tradução automática (vimos o menu virar "Não se trata de uma questão de…") e leitores de tela pronunciam errado. **Bug crítico.**
- Ícone do logo: PNG 1024×1024 exibido a 32px.
- Imagem de fundo do hero 1920×1080 JPG para algo quase invisível.
- Imagens do logo com `alt=""` dentro do link da home → link sem nome acessível.
- `og:image` aponta para um screenshot de preview da Lovable (URL temporária de R2), `twitter:card=summary` (sem imagem grande).
- Sem dados estruturados.
- Links externos sem `rel="noopener"` verificável; ícones sociais sem rótulo visível.
- Console: sem erros. Sem overflow horizontal no desktop; no mobile há elementos decorativos (blobs `size-96`) extrapolando a viewport, contidos por overflow-hidden.
- E-mail `contato@axion.com` — o domínio axion.com provavelmente **não** é da Axion. Precisa ser confirmado (ver pendências).

### Fica / reconstrói / sai
- **Fica:** nome, ícone "A" (redesenhado em SVG), WhatsApp como canal principal, Instagram, os 4 formatos de serviço, os 4 passos do processo, "entrega em até 7 dias" e "proposta em até 24h" (promessas do próprio site).
- **Reconstrói:** hero, serviços, portfólio, processo, contato, header, footer, SEO.
- **Sai:** imagem de fundo do hero, grade de benefícios (vira "incluso em todo projeto"), números inventados, valores genéricos, depoimentos fictícios, mockups de IA.

## 2. Direção criativa

**Conceito: "Planta técnica".** A Axion vende sites bem construídos; o site deve parecer um projeto de engenharia bem desenhado — grid visível, medidas, anotações em fonte mono, precisão. Tecnológico sem neon; premium sem ostentação.

- **Tipografia:** Geist (variável) para display e texto, em tamanhos grandes com tracking negativo; Geist Mono para rótulos, números, metadados e "anotações técnicas". Uma família, dois registros — coerência e personalidade. Fontes auto-hospedadas (sem Google Fonts).
- **Cor:** grafite quase preto `#0B0C0E` e osso `#ECE9E2` como base. Um único acento, o azul do logo (`#3B7BFF`), usado só em pontos de ação e marcas de medida. Seções alternam escuro/claro para criar ritmo e transições reais entre capítulos.
- **Grid:** 12 colunas, container 1440px, gutters 20/32/48px. Linhas de grid visíveis como elemento gráfico (baixo contraste) em hero e rodapé.
- **Espaçamento:** base 4px; seções com `clamp(6rem, 12vw, 11rem)` de respiro vertical.
- **Motion:** "montagem". Elementos entram como se estivessem sendo construídos — linhas que se desenham, máscaras que revelam texto, blocos que se encaixam. Curvas `expo.out`, 0.6–1.1s, nunca bounce. Movimento ligado ao scroll só onde conta história (manifesto, estudos, processo). Tudo desliga com `prefers-reduced-motion`.
- **Conversão:** um CTA primário ("Começar um projeto") em lugar fixo no header + final. Formulário curto que monta a mensagem do WhatsApp com tipo de projeto, prazo e contexto — o lead chega qualificado. FAQ responde às objeções.

### Nova estrutura
1. Header — logo, 4 links, CTA. Menu mobile em tela cheia.
2. Hero — título editorial grande + "planta" de um site sendo montado (SVG/CSS), grid que reage ao cursor.
3. Manifesto — uma frase que se acende palavra a palavra com o scroll.
4. Serviços — lista editorial (não cards) dos 4 formatos + "incluso em todo projeto".
5. Estudos — 3 estudos conceituais (barbearia, oficina, restaurante) desenhados em código, rotulados como conceito. Scroll horizontal fixado no desktop.
6. Processo — 4 etapas com linha de progresso guiada pelo scroll.
7. FAQ — objeções reais, com dados estruturados FAQPage.
8. Contato — formulário → WhatsApp, e-mail, Instagram.
9. Footer — wordmark gigante, links, voltar ao topo.

## 3. Arquitetura

Vite + React 19 + TypeScript + Tailwind CSS v4. Pré-renderização estática (HTML completo no build, hidratado no cliente) para SEO sem depender de servidor. GSAP + ScrollTrigger para scroll/timelines; Motion para menu, acordeão e microinterações; Lenis só em desktop com mouse e sem reduced-motion. Conteúdo em `src/content/site.ts` — editar textos não exige mexer em componentes.

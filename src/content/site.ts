/**
 * Todo o conteúdo editável do site vive aqui.
 * Itens marcados com `TODO(axion)` precisam de confirmação antes de publicar.
 */

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://axion-sites.lovable.app";

export const contact = {
  whatsappNumber: "5521980390477",
  whatsappDisplay: "(21) 98039-0477",
  instagramHandle: "@axion_dev",
  instagramUrl: "https://www.instagram.com/axion_dev/",
  // TODO(axion): confirmar o e-mail. O domínio axion.com provavelmente não pertence à Axion.
  email: "contato@axion.com",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const defaultWhatsappMessage = "Olá, Axion! Quero conversar sobre um site para a minha empresa.";

export const nav = [
  { label: "Serviços", href: "#servicos" },
  { label: "Estudos", href: "#estudos" },
  { label: "Processo", href: "#processo" },
  { label: "Dúvidas", href: "#duvidas" },
] as const;

export const hero = {
  eyebrow: "Axion — estúdio de sites",
  titleLines: ["Sites feitos", "para trabalhar", "pela sua empresa."],
  lead:
    "Projetamos e desenvolvemos sites institucionais e landing pages rápidos, claros e prontos para transformar visita em conversa no WhatsApp.",
  primaryCta: { label: "Pedir orçamento", href: "#contato" },
  secondaryCta: { label: "Ver estudos", href: "#estudos" },
  facts: [
    { k: "Prazo", v: "Entrega em até 7 dias" },
    { k: "Resposta", v: "Proposta em até 24h" },
    { k: "Canal", v: "Direto no WhatsApp" },
  ],
} as const;

export const manifesto = {
  label: "Sobre",
  statement:
    "Seu site é o primeiro atendente que o cliente conhece. Se ele demora, confunde ou parece amador, a venda termina antes da conversa começar.",
  body:
    "A Axion existe para empresas que já fazem um bom trabalho e precisam que a internet mostre isso. Cada projeto é desenhado do zero para o seu negócio — sem template, sem enrolação — e entregue pronto para ser encontrado, entendido e contatado.",
  principles: [
    { k: "Sem template", v: "Layout desenhado para a sua marca e o seu cliente, não adaptado de um modelo pronto." },
    { k: "Rápido de verdade", v: "Código enxuto, imagens otimizadas e nada que faça o visitante esperar." },
    { k: "Feito para converter", v: "Cada página tem um próximo passo claro — quase sempre, uma conversa com você." },
  ],
} as const;

export type Service = {
  id: string;
  name: string;
  audience: string;
  summary: string;
  includes: string[];
  highlight?: string;
  whatsappMessage: string;
};

export const services: Service[] = [
  {
    id: "basico",
    name: "Site Básico",
    audience: "Pequenos negócios",
    summary: "Presença profissional para quem precisa ser encontrado e parecer confiável desde o primeiro clique.",
    includes: ["Até 5 seções", "Design responsivo", "Integração com WhatsApp", "Formulário de contato", "SEO básico"],
    whatsappMessage: "Olá, Axion! Tenho interesse no Site Básico.",
  },
  {
    id: "empresarial",
    name: "Site Empresarial",
    audience: "Empresas em crescimento",
    summary: "Para quem quer ocupar espaço no Google e transformar o site em um canal de vendas de verdade.",
    includes: ["Até 15 páginas", "Blog otimizado para SEO", "Formulários avançados", "Integração com WhatsApp", "Estrutura escalável"],
    highlight: "Mais completo",
    whatsappMessage: "Olá, Axion! Tenho interesse no Site Empresarial.",
  },
  {
    id: "landing",
    name: "Landing Page",
    audience: "Campanhas e captação",
    summary: "Uma página, um objetivo: transformar o tráfego das suas campanhas em contatos.",
    includes: ["Estrutura orientada à conversão", "Copy persuasiva", "Integração com WhatsApp", "Captação de leads"],
    whatsappMessage: "Olá, Axion! Tenho interesse em uma Landing Page.",
  },
  {
    id: "sob-medida",
    name: "Sob medida",
    audience: "Projetos exclusivos",
    summary: "Quando o problema pede mais que um site: sistemas, integrações e automações desenhados para a sua operação.",
    includes: ["Sistemas personalizados", "Integrações com APIs", "Automações", "Escopo e orçamento sob consulta"],
    whatsappMessage: "Olá, Axion! Quero conversar sobre um projeto sob medida.",
  },
];

export const standards = [
  { k: "Layout exclusivo", v: "Desenhado para a sua marca." },
  { k: "Mobile primeiro", v: "Pensado para o celular, onde está o seu cliente." },
  { k: "Carregamento rápido", v: "Leve, otimizado e sem espera." },
  { k: "SEO técnico", v: "Estrutura pronta para o Google." },
  { k: "WhatsApp integrado", v: "Do clique à conversa em um toque." },
  { k: "Suporte contínuo", v: "Ajustes e atualizações quando precisar." },
] as const;

export type Study = {
  id: "barbearia" | "oficina" | "restaurante";
  name: string;
  segment: string;
  goal: string;
  decision: string;
};

export const studies: Study[] = [
  {
    id: "barbearia",
    name: "Barbearia Premium",
    segment: "Beleza & estilo",
    goal: "Encher a agenda da semana.",
    decision: "Horários disponíveis logo na primeira tela. O cliente escolhe o corte e cai no WhatsApp com tudo preenchido.",
  },
  {
    id: "oficina",
    name: "Oficina Performance",
    segment: "Automotivo",
    goal: "Tirar a desconfiança do orçamento.",
    decision: "Serviços com escopo claro e um passo a passo do atendimento. Transparência vira argumento de venda.",
  },
  {
    id: "restaurante",
    name: "Sabor Urbano",
    segment: "Gastronomia",
    goal: "Levar pedidos direto, sem taxa de aplicativo.",
    decision: "Cardápio legível no celular, com pedido pelo WhatsApp a partir de cada prato.",
  },
];

export const process = [
  {
    n: "01",
    title: "Briefing",
    text: "Uma conversa para entender o negócio, o público e o que o site precisa fazer. Saímos com objetivo, páginas e prazo definidos.",
  },
  {
    n: "02",
    title: "Design",
    text: "Você aprova o layout antes de qualquer linha de código. Ajustar aqui custa minutos, não dias.",
  },
  {
    n: "03",
    title: "Desenvolvimento",
    text: "Código limpo, rápido e otimizado para mecanismos de busca, testado no celular e no desktop.",
  },
  {
    n: "04",
    title: "Lançamento",
    text: "Publicação, treinamento e suporte para você seguir com tranquilidade depois que o site está no ar.",
  },
] as const;

export const faq = [
  {
    q: "Quanto custa um site?",
    a: "Depende do formato e do escopo. Conte o que você precisa pelo formulário ou pelo WhatsApp e enviamos uma proposta personalizada em até 24 horas.",
  },
  {
    q: "Quanto tempo leva?",
    a: "A entrega pode ser feita em até 7 dias, conforme o formato. O prazo exato fica definido na proposta, antes de começarmos.",
  },
  {
    q: "O site funciona bem no celular?",
    a: "Sim. Todo projeto é desenhado primeiro para o celular e depois ampliado para tablet e desktop — não é uma versão encolhida do site de computador.",
  },
  {
    q: "Meu site vai aparecer no Google?",
    a: "Todo site sai com SEO técnico configurado: títulos, descrições, estrutura de páginas, velocidade e indexação. A posição nas buscas também depende de conteúdo e concorrência, por isso não prometemos primeiro lugar — prometemos a base certa para chegar lá.",
  },
  {
    q: "E depois que o site estiver no ar?",
    a: "Oferecemos suporte e manutenção: atualizações, ajustes e acompanhamento sempre que você precisar.",
  },
] as const;

export const projectTypes = ["Site Básico", "Site Empresarial", "Landing Page", "Sob medida", "Ainda não sei"] as const;

export const seo = {
  title: "Axion — Criação de sites profissionais para empresas",
  description:
    "Sites institucionais e landing pages rápidos, exclusivos e prontos para converter visitas em contatos no WhatsApp. Proposta em até 24h.",
  ogImage: "/og.png",
} as const;

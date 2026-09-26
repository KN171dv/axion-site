import { contact, faq, seo, services, SITE_URL } from "../content/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const json = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");

/** Tags de <head> geradas no build a partir de content/site.ts (fonte única). */
export function renderHead() {
  const url = `${SITE_URL}/`;
  const image = `${SITE_URL}${seo.ogImage}`;

  const org = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}#org`,
    name: "Axion",
    url,
    logo: `${SITE_URL}/icon-512.png`,
    image,
    description: seo.description,
    telephone: `+${contact.whatsappNumber}`,
    email: contact.email,
    sameAs: [contact.instagramUrl],
    areaServed: { "@type": "Country", name: "Brasil" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.summary },
      })),
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="Axion" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Axion — sites feitos para trabalhar pela sua empresa." />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${json(org)}</script>`,
    `<script type="application/ld+json">${json(faqLd)}</script>`,
  ].join("\n    ");
}

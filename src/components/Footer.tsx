import { contact, defaultWhatsappMessage, nav, whatsappLink } from "../content/site";
import { LogoMark } from "./Logo";

export function Footer() {
  const year = 2026; // fixo para evitar divergência entre HTML pré-renderizado e cliente; atualize anualmente
  return (
    <footer data-tone="dark" className="relative overflow-hidden border-t border-line-dark pt-16 md:pt-24">
      <div className="container-x grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <LogoMark className="size-9" />
          <p className="mt-6 max-w-[22rem] leading-relaxed text-muted-dark">
            Estúdio de criação de sites para empresas. Design exclusivo, código rápido e contato direto pelo WhatsApp.
          </p>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-3 md:col-start-7">
          <p className="label text-muted-dark">Navegação</p>
          <ul className="mt-5 space-y-2.5">
            {[...nav, { label: "Contato", href: "#contato" }].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="label text-muted-dark">Contato</p>
          <ul className="mt-5 space-y-2.5">
            <li>
              <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="link-underline">
                WhatsApp {contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
                Instagram {contact.instagramHandle}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="link-underline break-all">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-16 flex flex-col-reverse gap-4 border-t border-line-dark py-6 text-[0.8125rem] text-muted-dark sm:flex-row sm:items-center sm:justify-between md:mt-24">
        <p>© {year} Axion. Todos os direitos reservados.</p>
        <a href="#inicio" className="link-underline self-start sm:self-auto">
          Voltar ao topo ↑
        </a>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.22em] select-none text-center text-[27vw] font-[620] leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(236_233_226/0.14)]"
      >
        AXION
      </p>
    </footer>
  );
}
